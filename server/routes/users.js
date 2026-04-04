import { Router } from 'express'
import User from '../models/User.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

// GET /api/users — admin only
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    console.error("[USERS]", err.message); res.status(500).json({ error: err.message })
  }
})

// PATCH /api/users/:id — admin only
router.patch('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, email, role, status } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found.' })
    if (name)   user.name   = name
    if (email)  user.email  = email
    if (role)   user.role   = role
    if (status) user.status = status
    await user.save()
    res.json(user)
  } catch (err) {
    console.error("[USERS]", err.message); res.status(500).json({ error: err.message })
  }
})

export default router


