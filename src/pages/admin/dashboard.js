import { DB } from '../../../assets/js/data.js'
import '../../../assets/css/tailwind.css';
import '../../../assets/css/responsive.css';
import '../../../assets/css/uspn.css';

const MAPS_KEY = import.meta.env.VITE_MAPS_KEY || ''

// Utilities and logout come from src/main.js & assets/js/data.js

  ; (async () => {
    const mainEl = document.getElementById('admin-main')
    if (mainEl) {
      mainEl.classList.remove('hidden')
      mainEl.classList.add('fade-in')
    }

    const user = DB.requireAuth('admin')
    if (!user) return

    try {
      const [shipmentsData, usersData] = await Promise.all([DB.getShipments(), DB.getUsers()])

      // Handle error objects returned from data.js
      const shipments = Array.isArray(shipmentsData) ? shipmentsData : []
      const users = Array.isArray(usersData) ? usersData : []

      if (shipmentsData.error || usersData.error) {
        console.error('[ADMIN] Error loading data:', shipmentsData.error || usersData.error)
        // Optional: show a non-blocking toast or banner
      }

      const active = shipments.filter(s => s.status === 'In Transit' || s.status === 'Delayed')
      
      const updateMetric = (id, val, isError) => {
        const el = document.getElementById(id)
        if (!el) return
        el.textContent = isError ? 'Err' : val
        el.classList.remove('italic', 'opacity-50')
      }

      updateMetric('metric-total', shipments.length, !!shipmentsData.error)
      updateMetric('metric-active', active.length, !!shipmentsData.error)
      updateMetric('metric-users', users.length, !!usersData.error)

      const mapImg = document.getElementById('admin-map')
      mapImg.src = `https://maps.googleapis.com/maps/api/staticmap?center=20,0&zoom=2&size=1200x400&maptype=roadmap&key=${MAPS_KEY}`
      mapImg.onerror = () => { mapImg.src = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=60' }

      const recentEl = document.getElementById('recent-shipments')
      if (shipments.length === 0) {
        recentEl.innerHTML = `<div class="text-center py-10 text-outline">No recent shipments found.</div>`
      } else {
        recentEl.innerHTML = shipments.slice(0, 10).map(s => `
        <a href="shipment-edit.html?id=${DB.esc(s._id)}" class="group bg-surface-container-lowest p-6 rounded-xl shadow-lg shadow-on-surface/5 border border-outline-variant/15 flex items-center justify-between hover:bg-surface-container-high transition-colors block">
          <div class="flex items-center gap-6">
            <div class="hidden sm:flex h-12 w-12 items-center justify-center bg-surface-container-low rounded-lg"><span class="material-symbols-outlined text-outline">package_2</span></div>
            <div>
              <div class="text-primary font-bold">${s.trackingNumber ? DB.esc(s.trackingNumber) : 'Unassigned'}</div>
              <div class="text-on-surface-variant text-xs font-medium">${DB.esc(s.origin)} → ${DB.esc(s.destination)}</div>
              <div class="text-outline text-xs mt-1">${DB.fmtDate(s.createdAt)}</div>
            </div>
          </div>
          <div class="flex items-center gap-4">${DB.statusChip(s.status)}<span class="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">chevron_right</span></div>
        </a>`).join('')
      }
  } catch (err) {
    console.error('[ADMIN] Fatal initialization error:', err)
  } finally {
    // Page is shown earlier
  }
  })()

