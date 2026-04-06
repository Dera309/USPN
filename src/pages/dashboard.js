import { DB } from '../../assets/js/data.js'
import '../../assets/css/tailwind.css'
import '../../assets/css/responsive.css'
import '../../assets/css/uspn.css'

function logout() {
  DB.clearSession()
  const path = window.location.pathname
  const depth = path.split('/').filter(p => p && !p.endsWith('.html')).length
  const root = depth === 0 ? './' : '../'.repeat(depth)
  window.location.href = `${root}index.html`
}
window.logout = logout

// Shared navbar/logout/toasts come from src/main.js

function showTab(tab) {
  ;['shipments', 'account'].forEach(t => {
    const panel = document.getElementById('panel-' + t)
    const btn = document.getElementById('tab-' + t)
    if (panel) panel.classList.toggle('hidden', t !== tab)
    if (btn) btn.setAttribute('data-active', t === tab)
  })
}
window.showTab = showTab

;(async () => {
  const mainEl = document.getElementById('dashboard-main')
  if (mainEl) mainEl.classList.remove('hidden')

  const user = DB.requireAuth('user')
  if (!user) return

  try {
    // Shipments
    async function renderShipments(loading = false) {
      const list = document.getElementById('shipments-list')
      const empty = document.getElementById('no-shipments')
      
      if (loading) {
        list.innerHTML = Array(3).fill(0).map(() => `
          <div class="bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15 mb-4 animate-pulse">
            <div class="flex justify-between items-start mb-4">
              <div class="space-y-2">
                <div class="h-5 w-32 skeleton"></div>
                <div class="h-3 w-48 skeleton"></div>
              </div>
              <div class="h-6 w-20 skeleton rounded-full"></div>
            </div>
            <div class="h-16 w-full skeleton opacity-50"></div>
          </div>`).join('')
        list.classList.remove('hidden')
        empty.classList.add('hidden')
        return
      }

      try {
        const data = await DB.getShipments()

        if (data && data.error) {
          console.error('[DASHBOARD] Error loading shipments:', data.error)
          empty.innerHTML = `
            <span class="material-symbols-outlined text-6xl text-error mb-4 block">error</span>
            <h3 class="font-headline text-xl font-bold text-primary mb-2">Error loading shipments</h3>
            <p class="text-on-surface-variant mb-6">${data.error}</p>
            <button onclick="location.reload()" class="bg-secondary text-white px-6 py-2 rounded-lg font-bold hover:bg-secondary-container transition-all">Retry</button>`
          list.classList.add('hidden')
          empty.classList.remove('hidden')
          return
        }

        const shipments = Array.isArray(data) ? data : []
        if (!shipments.length) {
          list.classList.add('hidden')
          empty.classList.remove('hidden')
          return
        }

        empty.classList.add('hidden')
        list.classList.remove('hidden')
        list.innerHTML = shipments.map(s => {
          // Use tracking number in URL if assigned; fall back to _id for unassigned shipments
          const trackParam = s.trackingNumber
            ? encodeURIComponent(s.trackingNumber)
            : s._id
          return `
          <a href="tracking.html?id=${trackParam}" class="group bg-surface-container-lowest p-6 rounded-xl ambient-shadow border border-outline-variant/15 flex items-center justify-between hover:bg-surface-container-high transition-colors">
            <div class="flex items-center gap-6">
              <div class="hidden sm:flex h-12 w-12 items-center justify-center bg-surface-container-low rounded-lg">
                <span class="material-symbols-outlined text-outline">package_2</span>
              </div>
              <div>
                <div class="text-primary font-bold">${s.trackingNumber ? DB.esc(s.trackingNumber) : 'Pending Assignment'}</div>
                <div class="text-on-surface-variant text-xs font-medium">${DB.esc(s.origin)} → ${DB.esc(s.destination)}</div>
                <div class="text-outline text-xs mt-1">${DB.fmtDate(s.createdAt)}</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              ${DB.statusChip(s.status)}
              <span class="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">chevron_right</span>
            </div>
          </a>`
        }).join('')
      } catch (err) {
        console.error('[DASHBOARD] Render error:', err)
        list.innerHTML = `<div class="text-error text-center p-8">Failed to load shipments. Please try again.</div>`
      }
    }
    
    // First show skeletons, then fetch data
    renderShipments(true)
    mainEl.classList.remove('hidden')
    mainEl.classList.add('fade-in')
    
    renderShipments()

    // Profile
    try {
      const fullUser = await DB.getMe()
      if (fullUser && !fullUser.error) {
        if (document.getElementById('p-name')) document.getElementById('p-name').value = fullUser.name || ''
        if (document.getElementById('p-email')) document.getElementById('p-email').value = fullUser.email || ''
        if (document.getElementById('p-phone')) document.getElementById('p-phone').value = fullUser.phone || ''
      }
    } catch (err) {
      console.error('[DASHBOARD] Profile fetch error:', err)
    }

    document.getElementById('profile-form')?.addEventListener('submit', async function (e) {
      e.preventDefault()
      const btn = e.target.querySelector('button[type="submit"]')
      const originalText = btn.textContent
      btn.disabled = true
      btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm mr-2">sync</span> Saving...'
      
      try {
        const data = await DB.updateMe({
          name: document.getElementById('p-name').value.trim(),
          email: document.getElementById('p-email').value.trim(),
          phone: document.getElementById('p-phone').value.trim()
        })
        if (data.error) {
          if (window.showToast) window.showToast(data.error, 'error')
          else alert('Profile update failed: ' + data.error)
          return
        }
        localStorage.setItem('uspn_user', JSON.stringify(data.user || data))
        if (window.showToast) window.showToast('Profile updated successfully!')
        else {
          const s = document.getElementById('profile-success')
          s?.classList.remove('hidden')
          setTimeout(() => s?.classList.add('hidden'), 3000)
        }
      } catch (err) {
        console.error('[DASHBOARD] Update error:', err)
        if (window.showToast) window.showToast('Unexpected error during update.', 'error')
      } finally {
        btn.disabled = false
        btn.textContent = originalText
      }
    })

    document.getElementById('password-form')?.addEventListener('submit', async function (e) {
      e.preventDefault()
      const btn = e.target.querySelector('button[type="submit"]')
      const originalText = btn.textContent
      
      try {
        const currentPassword = document.getElementById('pw-current').value
        const newPassword = document.getElementById('pw-new').value
        const confirm = document.getElementById('pw-confirm').value
        
        if (newPassword.length < 8) { 
          if (window.showToast) window.showToast('New password must be at least 8 characters.', 'error')
          return 
        }
        if (newPassword !== confirm) { 
          if (window.showToast) window.showToast('Passwords do not match.', 'error')
          return 
        }
        
        btn.disabled = true
        btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm mr-2">sync</span> Updating...'

        const data = await DB.updateMe({ currentPassword, newPassword })
        if (data.error) { 
          if (window.showToast) window.showToast(data.error, 'error')
          return 
        }
        
        if (window.showToast) window.showToast('Password changed successfully!')
        e.target.reset()
      } catch (err) {
        console.error('[DASHBOARD] Password error:', err)
        if (window.showToast) window.showToast('Unexpected error during password change.', 'error')
      } finally {
        btn.disabled = false
        btn.textContent = originalText
      }
    })
  } catch (err) {
    console.error('[DASHBOARD] Initialization error:', err)
  } finally {
    // Page is shown earlier for better perceived performance
  }
})()
