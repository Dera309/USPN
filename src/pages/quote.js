import { DB } from '../../assets/js/data.js'
import '../../assets/css/tailwind.css'
import '../../assets/css/responsive.css'
import '../../assets/css/uspn.css'

// Logic
const display = document.getElementById('quote-display')
const rangeEl = document.getElementById('quote-range')
const lowEl    = document.getElementById('quote-low')
const highEl   = document.getElementById('quote-high')
const bdEl    = document.getElementById('quote-breakdown')
const bookBtn = document.getElementById('book-btn')
const bookLnk = document.getElementById('book-link')

const bdBase    = document.getElementById('bd-base')
const bdWeight  = document.getElementById('bd-weight')
const bdService = document.getElementById('bd-service')
const bdCargo   = document.getElementById('bd-cargo')

function updateQuote() {
  const origin = document.getElementById('q-origin').value.trim()
  const dest   = document.getElementById('q-destination').value.trim()
  const weight = parseFloat(document.getElementById('q-weight').value) || 0
  const service = document.getElementById('q-service').value
  const cargo   = document.getElementById('q-cargo-type').value

  if (!origin || !dest || weight <= 0) {
    display.querySelector('p').classList.remove('hidden')
    rangeEl.classList.add('hidden')
    bdEl.classList.add('hidden')
    bookBtn.classList.add('hidden')
    return
  }

  display.querySelector('p').classList.add('hidden')
  rangeEl.classList.remove('hidden')
  bdEl.classList.remove('hidden')
  bookBtn.classList.remove('hidden')

  // Simple calc logic
  const basePrice = 450
  const weightPrice = weight * 1.25
  const serviceMult = { air: 2.5, ocean: 0.8, land: 1.2 }[service] || 1
  const cargoMult = { general: 1, fragile: 1.5, hazmat: 2.2, perishable: 1.8, oversized: 2.5 }[cargo] || 1

  const totalLow = (basePrice + weightPrice) * serviceMult * cargoMult
  const totalHigh = totalLow * 1.15

  lowEl.textContent = `$${Math.round(totalLow).toLocaleString()}`
  highEl.textContent = `$${Math.round(totalHigh).toLocaleString()}`

  bdBase.textContent = `$${basePrice}`
  bdWeight.textContent = `$${Math.round(weightPrice).toLocaleString()}`
  bdService.textContent = `x${serviceMult}`
  bdCargo.textContent = `x${cargoMult}`

  // Prepare booking link
  const params = new URLSearchParams({
    origin,
    destination: dest,
    weight,
    service,
    cargo
  })
  bookLnk.href = `booking.html?${params.toString()}`
}

document.getElementById('quote-form').addEventListener('input', updateQuote)
bookBtn.addEventListener('click', () => bookLnk.click())

// Handle pre-fill from URL
const urlParams = new URLSearchParams(window.location.search)
if (urlParams.get('service')) {
  document.getElementById('q-service').value = urlParams.get('service')
  updateQuote()
}
