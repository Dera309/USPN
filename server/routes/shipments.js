import { Router } from 'express'
import Shipment from '../models/Shipment.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

function genTrackingNumber() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const rand4 = () => Math.floor(1000 + Math.random() * 9000)
  const rand2 = () => Array.from({ length: 2 }, () => letters[Math.floor(Math.random() * letters.length)]).join('')
  return `USPN-${rand4()}-${rand2()}`
}

// GET /api/shipments — user gets own, admin gets all
router.get('/', protect, async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id }
    const shipments = await Shipment.find(filter).sort({ createdAt: -1 })
    res.json(shipments)
  } catch (err) {
    console.error("[SHIPMENTS]", err.message); res.status(500).json({ error: err.message })
  }
})

// GET /api/shipments/track/:trackingNumber — public (MUST be before /:id)
router.get('/track/:trackingNumber', async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({
      trackingNumber: req.params.trackingNumber.toUpperCase()
    })
    if (!shipment) return res.status(404).json({ error: 'Shipment not found.' })
    res.json(shipment)
  } catch (err) {
    console.error("[SHIPMENTS]", err.message); res.status(500).json({ error: err.message })
  }
})

// POST /api/shipments/generate-tracking — admin only (MUST be before /:id)
router.post('/generate-tracking', protect, adminOnly, (req, res) => {
  res.json({ trackingNumber: genTrackingNumber() })
})

// POST /api/shipments — authenticated users
router.post('/', protect, async (req, res, next) => {
  try {
    const { origin, destination, cargoType, weight, dimensions, specialHandling, notes } = req.body
    if (!origin || !destination || !cargoType || !weight)
      return res.status(400).json({ error: 'Origin, destination, cargo type, and weight are required.' })
    const shipment = await Shipment.create({
      userId: req.user._id,
      origin, destination, cargoType, weight, dimensions, specialHandling, notes,
      currentLocation: origin,
      activityLog: [{ location: origin, event: 'Shipment booked. Awaiting processing.' }]
    })
    res.status(201).json(shipment)
  } catch (err) {
    console.error("[SHIPMENTS]", err.message); res.status(500).json({ error: err.message })
  }
})

// GET /api/shipments/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid shipment ID.' })
    }
    const shipment = await Shipment.findById(req.params.id)
    if (!shipment) return res.status(404).json({ error: 'Shipment not found.' })
    if (req.user.role !== 'admin' && String(shipment.userId) !== String(req.user._id))
      return res.status(403).json({ error: 'Access denied.' })
    res.json(shipment)
  } catch (err) {
    console.error("[SHIPMENTS]", err.message); res.status(500).json({ error: err.message })
  }
})

// PATCH /api/shipments/:id — admin only
router.patch('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { trackingNumber, status, currentLocation, currentLat, currentLng, estimatedDelivery } = req.body
    const shipment = await Shipment.findById(req.params.id)
    if (!shipment) return res.status(404).json({ error: 'Shipment not found.' })
    if (trackingNumber !== undefined) shipment.trackingNumber = trackingNumber || null
    if (status)            shipment.status          = status
    if (currentLocation)   shipment.currentLocation = currentLocation
    if (currentLat  !== undefined) shipment.currentLat = currentLat
    if (currentLng  !== undefined) shipment.currentLng = currentLng
    if (estimatedDelivery !== undefined) shipment.estimatedDelivery = estimatedDelivery
    await shipment.save()
    res.json(shipment)
  } catch (err) {
    console.error("[SHIPMENTS]", err.message); res.status(500).json({ error: err.message })
  }
})

// POST /api/shipments/:id/log — admin only
router.post('/:id/log', protect, adminOnly, async (req, res, next) => {
  try {
    const { location, event } = req.body
    if (!location || !event) return res.status(400).json({ error: 'Location and event are required.' })
    const shipment = await Shipment.findById(req.params.id)
    if (!shipment) return res.status(404).json({ error: 'Shipment not found.' })
    shipment.activityLog.push({ location, event })
    await shipment.save()
    res.json(shipment)
  } catch (err) {
    console.error("[SHIPMENTS]", err.message); res.status(500).json({ error: err.message })
  }
})

export default router





