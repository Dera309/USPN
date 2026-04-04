import { DB } from '../../assets/js/data.js'
import '../../assets/css/tailwind.css'
import '../../assets/css/responsive.css'
import '../../assets/css/uspn.css'

const MAPS_KEY = import.meta.env.VITE_MAPS_KEY || ''
const STEPS = [
  { label: 'Ordered',   icon: 'receipt_long' },
  { label: 'Picked Up', icon: 'inventory_2' },
  { label: 'In Transit',icon: 'local_shipping' },
  { label: 'Delivered', icon: 'check_circle' }
]
const STATUS_STEP = { 'Pending':0,'In Transit':2,'Delayed':2,'Delivered':3,'Cancelled':0 }

// Utilities and Shared navbar/logout/toasts come from src/main.js & assets/js/data.js

function renderTracking(shipment) {
  document.getElementById('not-found').classList.add('hidden')
  const results = document.getElementById('tracking-results')
  results.style.display = 'grid'
  results.classList.remove('hidden')
  results.classList.add('fade-in')
  document.getElementById('res-tracking-num').textContent = 'Shipment #' + (shipment.trackingNumber || 'Pending')
  document.getElementById('res-route').textContent = shipment.origin + ' → ' + shipment.destination
  document.getElementById('res-status-chip').innerHTML = DB.statusChip(shipment.status)

  const activeStep = STATUS_STEP[shipment.status] ?? 0
  const pcts = ['0%','33%','66%','100%']
  document.getElementById('progress-bar').style.width = `calc(${pcts[activeStep]} - 4rem)`

  // Desktop horizontal steps
  document.getElementById('timeline-steps').innerHTML = STEPS.map((s,i) => {
    const done = i < activeStep, active = i === activeStep, future = i > activeStep
    const dotCls = (done||active) ? 'bg-secondary-container text-white' : 'bg-surface-container-high text-outline'
    const pulse = active ? 'ring-8 ring-secondary-container/10' : ''
    return `<div class="flex flex-col items-center gap-4 text-center">
      <div class="w-10 h-10 rounded-full ${dotCls} ${pulse} flex items-center justify-center z-10">
        <span class="material-symbols-outlined text-xl">${done?'check':s.icon}</span>
      </div>
      <div><p class="font-bold ${future?'text-on-surface-variant':'text-primary'} text-sm">${s.label}</p></div>
    </div>`
  }).join('')

  // Mobile vertical stepper
  const mobileEl = document.getElementById('timeline-steps-mobile')
  if (mobileEl) {
    mobileEl.innerHTML = STEPS.map((s,i) => {
      const done = i < activeStep, active = i === activeStep, future = i > activeStep
      const dotCls = (done||active) ? 'bg-secondary-container text-white' : 'bg-surface-container-high text-outline'
      const pulse = active ? 'ring-4 ring-secondary-container/20' : ''
      const labelCls = future ? 'text-on-surface-variant' : 'text-primary'
      const isLast = i === STEPS.length - 1
      return `<div class="flex items-start gap-4 ${isLast ? '' : 'pb-4'} relative">
        <div class="flex flex-col items-center">
          <div class="w-9 h-9 rounded-full ${dotCls} ${pulse} flex items-center justify-center flex-shrink-0 z-10">
            <span class="material-symbols-outlined text-base">${done?'check':s.icon}</span>
          </div>
          ${!isLast ? '<div class="w-0.5 flex-1 bg-outline-variant/30 mt-1" style="min-height:2rem"></div>' : ''}
        </div>
        <div class="pt-1.5 pb-2">
          <p class="font-bold ${labelCls} text-sm">${s.label}</p>
          ${active ? '<p class="text-xs text-secondary-container font-medium mt-0.5">Current</p>' : ''}
          ${done ? '<p class="text-xs text-on-surface-variant mt-0.5">Completed</p>' : ''}
        </div>
      </div>`
    }).join('')
  }

  const logs = [...(shipment.activityLog||[])].reverse()
  document.getElementById('activity-log').innerHTML = logs.map((entry,i) => `
    <div class="flex gap-8 group pb-8">
      <div class="flex flex-col items-center">
        <div class="w-3 h-3 rounded-full ${i===0?'bg-secondary ring-4 ring-secondary/20':'bg-outline-variant'}"></div>
        ${i<logs.length-1?'<div class="w-px flex-1 bg-outline-variant/30 mt-4"></div>':''}
      </div>
      <div class="flex-1 -mt-1 pb-4">
        <div class="flex justify-between items-start mb-1 flex-wrap gap-2">
          <h4 class="font-bold text-primary">${DB.esc(entry.event)}</h4>
          <span class="text-sm font-medium text-on-surface-variant">${DB.fmtDateTime(entry.timestamp)}</span>
        </div>
        <p class="text-on-surface-variant text-sm">${entry.location}</p>
      </div>
    </div>`).join('')

  const mapImg = document.getElementById('map-img')
  document.getElementById('map-location-text').textContent = shipment.currentLocation || shipment.origin
  if (shipment.currentLat && shipment.currentLng) {
    mapImg.src = `https://maps.googleapis.com/maps/api/staticmap?center=${shipment.currentLat},${shipment.currentLng}&zoom=9&size=600x300&maptype=roadmap&markers=color:0xFE6B00|${shipment.currentLat},${shipment.currentLng}&key=${MAPS_KEY}`
  } else {
    mapImg.src = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(shipment.currentLocation||shipment.origin)}&zoom=8&size=600x300&maptype=roadmap&markers=color:0xFE6B00|${encodeURIComponent(shipment.currentLocation||shipment.origin)}&key=${MAPS_KEY}`
  }
  mapImg.onerror = () => { mapImg.src = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=60' }

  const rows = [['Weight',shipment.weight?shipment.weight+' kg':'—'],['Dimensions',shipment.dimensions||'—'],['Cargo Type',shipment.cargoType||'—'],['Fragile',shipment.specialHandling?.fragile?'Yes':'No']]
  document.getElementById('manifest-details').innerHTML = rows.map(([k,v]) => `
    <div class="flex justify-between items-center border-b border-outline-variant/10 pb-3">
      <span class="text-on-surface-variant text-sm font-medium">${k}</span>
      <span class="text-primary font-bold text-sm">${v}</span>
    </div>`).join('')
  document.getElementById('res-eta').textContent = shipment.estimatedDelivery ? 'Estimated Delivery: ' + DB.fmtDate(shipment.estimatedDelivery) : ''
}

async function doLookup(num) {
  if (!num) return
  const results = document.getElementById('tracking-results')
  const notFound = document.getElementById('not-found')
  
  notFound.classList.add('hidden')
  notFound.classList.add('fade-in')
  
  try {
    let data = null
    // If it looks like a MongoDB ObjectId (24 hex chars), try fetching by ID first
    if (/^[0-9a-fA-F]{24}$/.test(num)) {
      data = await DB.getShipmentById(num)
    }
    
    // If not found by ID or not an ID, try by tracking number
    if (!data || data.error) {
      data = await DB.getShipmentByTracking(num)
    }
    
    if (data && data.error) {
      console.error('[TRACKING] lookup error:', data.error)
      results.style.display = 'none'
      notFound.classList.remove('hidden')
      notFound.innerHTML = `
        <span class="material-symbols-outlined text-6xl text-error mb-4 block">error</span>
        <h3 class="font-headline text-xl font-bold text-primary mb-2">Service unavailable</h3>
        <p class="text-on-surface-variant mb-6">${DB.esc(data.error)}</p>`
      return
    }

    if (!data) {
      results.style.display = 'none'
      notFound.innerHTML = `
        <span class="material-symbols-outlined text-6xl text-outline mb-4 block">search_off</span>
        <h3 class="font-headline text-xl font-bold text-primary mb-2">Shipment Not Found</h3>
        <p class="text-on-surface-variant mb-6">We couldn't find any shipment matching <strong id="not-found-num" class="text-primary">${DB.esc(num)}</strong>. Please check the number and try again.</p>`
      notFound.classList.remove('hidden')
    } else {
      renderTracking(data)
    }
  } catch (err) {
    console.error('[TRACKING] logic error:', err)
    if (window.showToast) window.showToast('Unexpected error during tracking.', 'error')
    else alert('An unexpected error occurred during tracking. Please try again.')
  }
}

const params = new URLSearchParams(window.location.search)
const preId = params.get('id')
if (preId) { document.getElementById('track-input').value = preId; doLookup(preId) }

document.getElementById('track-form').addEventListener('submit', function(e) {
  e.preventDefault()
  doLookup(document.getElementById('track-input').value.trim())
})
