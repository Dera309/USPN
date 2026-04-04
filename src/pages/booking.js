import { DB } from '../../assets/js/data.js'
import '../../assets/css/tailwind.css'
import '../../assets/css/responsive.css'
import '../../assets/css/uspn.css'

function logout() { DB.clearSession(); window.location.href = '../index.html' }
window.logout = logout

  ; (async () => {
    const mainEl = document.getElementById('main-content')
    if (mainEl) mainEl.classList.remove('hidden')

    const user = DB.requireAuth('user')
    if (!user) return

    // Pre-fill from quote calculator
    const p = new URLSearchParams(window.location.search)
    const serviceMap = { air: 'Air Expedited', ocean: 'Ocean Link', land: 'Land Network' }
    if (p.get('origin')) document.getElementById('b-origin').value = p.get('origin')
    if (p.get('destination')) document.getElementById('b-destination').value = p.get('destination')
    if (p.get('weight')) document.getElementById('b-weight').value = p.get('weight')
    if (p.get('service')) document.getElementById('b-service').value = serviceMap[p.get('service')] || p.get('service')
    if (p.get('cargoType')) {
      const ct = { general: 'General Cargo', fragile: 'Luxury / High-Value', hazmat: 'Hazardous Materials', perishable: 'Perishable Goods', oversized: 'Oversized / Heavy Lift' }
      document.getElementById('b-cargo-type').value = ct[p.get('cargoType')] || 'General Cargo'
    }

    document.getElementById('booking-form').addEventListener('submit', async function (e) {
      e.preventDefault()
      let valid = true
      function req(id, errId, msg) {
        const val = document.getElementById(id).value.trim()
        const err = document.getElementById(errId)
        if (!val) { err.textContent = msg; err.classList.remove('hidden'); valid = false }
        else err.classList.add('hidden')
        return val
      }
      const origin = req('b-origin', 'b-origin-err', 'Origin is required.')
      const destination = req('b-destination', 'b-destination-err', 'Destination is required.')
      const cargoType = req('b-cargo-type', 'b-cargo-err', 'Please select a cargo type.')
      const service = req('b-service', 'b-service-err', 'Please select a service type.')
      const weight = req('b-weight', 'b-weight-err', 'Weight is required.')
      if (!valid) return

      const L = document.getElementById('b-length').value
      const W = document.getElementById('b-width').value
      const H = document.getElementById('b-height').value
      const dimensions = (L && W && H) ? `${L}×${W}×${H}` : ''

      try {
        const shipment = await DB.createShipment({
          userId: user._id || user.userId,
          origin, destination, cargoType, weight, dimensions,
          specialHandling: {
            fragile: document.getElementById('b-fragile').checked,
            hazmat: document.getElementById('b-hazmat').checked,
            perishable: document.getElementById('b-perishable').checked
          },
          notes: document.getElementById('b-notes').value.trim()
        })

        if (shipment && shipment.error) {
          alert('Booking failed: ' + shipment.error)
          return
        }

        document.getElementById('main-content').classList.add('hidden')
        document.getElementById('confirmation').classList.remove('hidden')
        document.getElementById('confirm-details').innerHTML = `
        <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1 border-b border-outline-variant/10 pb-2"><span class="text-on-surface-variant">Route</span><span class="font-bold sm:text-right break-words">${origin} → ${destination}</span></div>
        <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1 border-b border-outline-variant/10 pb-2 pt-2"><span class="text-on-surface-variant">Cargo Type</span><span class="font-bold sm:text-right break-words">${cargoType}</span></div>
        <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1 border-b border-outline-variant/10 pb-2 pt-2"><span class="text-on-surface-variant">Service</span><span class="font-bold sm:text-right break-words">${service}</span></div>
        <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1 border-b border-outline-variant/10 pb-2 pt-2"><span class="text-on-surface-variant">Weight</span><span class="font-bold sm:text-right break-words">${weight} kg</span></div>
        <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1 pt-2"><span class="text-on-surface-variant">Status</span><span class="font-bold text-orange-600 sm:text-right break-words">Pending — Tracking # to be assigned</span></div>`
      } catch (err) {
        console.error('[BOOKING] Submission error:', err)
        alert('An unexpected error occurred. Please try again.')
      }
    })
  })()
