// USPN Vite Entry - src/main.js
import '../assets/css/tailwind.css'
import '../assets/css/responsive.css'
import '../assets/css/uspn.css'
import { DB } from '../assets/js/data.js'

window.DB = DB

// Shared Navbar Logic
export function initNavbar() {
  const mBtn = document.getElementById('mobile-menu-btn')
  const mMenu = document.getElementById('mobile-menu')

  if (mBtn && mMenu) {
    mBtn.addEventListener('click', () => {
      const isOpen = !mMenu.classList.contains('hidden')
      if (isOpen) {
        mMenu.classList.add('hidden')
        mBtn.setAttribute('aria-expanded', 'false')
        mBtn.querySelector('.material-symbols-outlined').textContent = 'menu'
      } else {
        mMenu.classList.remove('hidden')
        mBtn.setAttribute('aria-expanded', 'true')
        mBtn.querySelector('.material-symbols-outlined').textContent = 'close'
      }
    })
  }

  // Mobile accordion dropdowns
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', function () {
      const isActive = this.classList.contains('active')
      // Close all other open dropdowns first
      document.querySelectorAll('.mobile-dropdown-toggle.active').forEach(other => {
        if (other !== this) other.classList.remove('active')
      })
      this.classList.toggle('active', !isActive)
    })
  })

  // Auth Nav Injection
  const user = DB.getCurrentUser()
  const navAuth = document.getElementById('nav-auth')
  const mobileAuth = document.getElementById('mobile-nav-auth')

  // Calculate relative path to root
  const path = window.location.pathname
  const depth = path.split('/').filter(p => p && !p.endsWith('.html')).length
  const root = depth === 0 ? './' : '../'.repeat(depth)
  const pages = `${root}pages/`

  if (navAuth) {
    if (!user) {
      navAuth.innerHTML = `<a href="${pages}login.html" class="text-slate-600 font-medium hover:text-orange-500 transition-colors">Login</a>
        <a href="${pages}register.html" class="bg-secondary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-secondary-container transition-all">Register</a>`
    } else {
      const dashboardLink = user.role === 'admin' ? `${pages}admin/dashboard.html` : `${pages}dashboard.html`
      navAuth.innerHTML = `<a href="${dashboardLink}" class="text-slate-600 font-medium hover:text-orange-500">${user.role === 'admin' ? 'Admin' : 'Dashboard'}</a>
        <button onclick="logout()" class="bg-secondary text-white px-6 py-2.5 rounded-lg font-bold ml-2">Logout</button>`
    }
  }

  if (mobileAuth) {
    if (!user) {
      mobileAuth.innerHTML = `<a href="${pages}login.html" class="block text-slate-700 font-medium py-2">Login</a>
        <a href="${pages}register.html" class="block bg-secondary text-white text-center py-3 rounded-lg font-bold">Register</a>`
    } else {
      const dashboardLink = user.role === 'admin' ? `${pages}admin/dashboard.html` : `${pages}dashboard.html`
      mobileAuth.innerHTML = `<a href="${dashboardLink}" class="block text-slate-700 font-medium py-2">${user.role === 'admin' ? 'Admin' : 'Dashboard'}</a>
        <button onclick="logout()" class="block bg-secondary text-white text-center py-3 rounded-lg font-bold mt-2">Logout</button>`
    }
  }
}

// Auto-init if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar)
} else {
  initNavbar()
}

window.logout = function () {
  DB.clearSession()
  const path = window.location.pathname
  const depth = path.split('/').filter(p => p && !p.endsWith('.html')).length
  const root = depth === 0 ? './' : '../'.repeat(depth)
  window.location.href = `${root}index.html`
}

window.showToast = function (msg, type = 'success') {
  const bg = type === 'error' ? 'bg-red-600' : 'bg-slate-900'
  const t = document.createElement('div')
  t.className = `fixed bottom-6 right-6 z-50 ${bg} text-white px-6 py-4 rounded-xl font-medium shadow-2xl`
  t.textContent = msg
  document.body.appendChild(t)
  setTimeout(() => t.remove(), 3000)
}
