// USPN API Client - assets/js/data.js

function authHeader() {
  const token = localStorage.getItem('uspn_token')
  if (!token) console.warn('[DB] No token in localStorage')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function jsonHeaders() {
  return { 'Content-Type': 'application/json', ...authHeader() }
}

async function safeJson(res) {
  try { return await res.json() } catch { return { error: 'Invalid server response.' } }
}

function handle401() {
  DB.clearSession()
  const isAdmin = window.location.pathname.includes('/admin/')
  window.location.href = isAdmin ? '../../pages/login.html' : '../pages/login.html'
}

export const DB = {

  // Utilities
  esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  },

  fmtDate(iso) {
    return iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
  },

  fmtDateTime(iso) {
    return iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
  },

  statusChip(status) {
    const map = {
      'In Transit': 'bg-secondary-container text-on-secondary-container',
      'Pending': 'bg-surface-variant text-on-surface-variant',
      'Delayed': 'bg-error-container text-on-error-container',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-surface-container-highest text-outline'
    }
    return `<span class="${map[status] || map['Pending']} px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">${status}</span>`
  },

  async register({ name, email, password }) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await safeJson(res)
      if (data.token) {
        localStorage.setItem('uspn_token', data.token)
        localStorage.setItem('uspn_user', JSON.stringify(data.user))
      }
      return data
    } catch { return { error: 'Cannot connect to server.' } }
  },

  async login({ email, password, remember }) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember })
      })
      if (res.status === 502) return { error: 'Server is unavailable. Please try again shortly.' }
      const data = await safeJson(res)
      if (data.token) {
        localStorage.setItem('uspn_token', data.token)
        localStorage.setItem('uspn_user', JSON.stringify(data.user))
      }
      return data
    } catch { return { error: 'Cannot connect to server.' } }
  },

  async logout() {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }) } catch {}
    localStorage.removeItem('uspn_token')
    localStorage.removeItem('uspn_user')
  },

  async getMe() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include', headers: authHeader() })
      if (!res.ok) return null
      const data = await safeJson(res)
      if (data.user) localStorage.setItem('uspn_user', JSON.stringify(data.user))
      return data.user
    } catch { return null }
  },

  async updateMe(updates) {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH', credentials: 'include',
        headers: jsonHeaders(), body: JSON.stringify(updates)
      })
      return safeJson(res)
    } catch { return { error: 'Cannot connect to server.' } }
  },

  getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('uspn_user')) } catch { return null }
  },

  clearSession() {
    localStorage.removeItem('uspn_token')
    localStorage.removeItem('uspn_user')
  },

  async getShipments() {
    try {
      const res = await fetch('/api/shipments', { credentials: 'include', headers: authHeader() })
      if (res.status === 401) { handle401(); return { error: 'Unauthorized.' } }
      if (!res.ok) return { error: `Server error: ${res.status}` }
      return safeJson(res)
    } catch { return { error: 'Network error connecting to API.' } }
  },

  async getShipmentByTracking(trackingNumber) {
    try {
      const res = await fetch(`/api/shipments/track/${encodeURIComponent(trackingNumber)}`)
      if (res.status === 404) return null
      return res.ok ? safeJson(res) : null
    } catch { return null }
  },

  async getShipmentById(id) {
    try {
      const res = await fetch(`/api/shipments/${id}`, { credentials: 'include', headers: authHeader() })
      if (res.status === 401) { handle401(); return null }
      return res.ok ? safeJson(res) : null
    } catch { return null }
  },

  async createShipment(data) {
    try {
      const res = await fetch('/api/shipments', {
        method: 'POST', credentials: 'include',
        headers: jsonHeaders(), body: JSON.stringify(data)
      })
      if (res.status === 401) { handle401(); return { error: 'Not authenticated.' } }
      return safeJson(res)
    } catch { return { error: 'Cannot connect to server.' } }
  },

  async updateShipment(id, updates) {
    try {
      const res = await fetch(`/api/shipments/${id}`, {
        method: 'PATCH', credentials: 'include',
        headers: jsonHeaders(), body: JSON.stringify(updates)
      })
      if (res.status === 401) { handle401(); return { error: 'Not authenticated.' } }
      return safeJson(res)
    } catch { return { error: 'Cannot connect to server.' } }
  },

  async addActivityLog(shipmentId, { location, event }) {
    try {
      const res = await fetch(`/api/shipments/${shipmentId}/log`, {
        method: 'POST', credentials: 'include',
        headers: jsonHeaders(), body: JSON.stringify({ location, event })
      })
      if (res.status === 401) { handle401(); return { error: 'Not authenticated.' } }
      return safeJson(res)
    } catch { return { error: 'Cannot connect to server.' } }
  },

  async generateTrackingNumber() {
    try {
      const res = await fetch('/api/shipments/generate-tracking', {
        method: 'POST', credentials: 'include', headers: authHeader()
      })
      if (res.status === 401) { handle401(); return { error: 'Not authenticated.' } }
      if (!res.ok) return { error: `Server error: ${res.status}` }
      const data = await safeJson(res)
      return data.trackingNumber ? data.trackingNumber : { error: 'Invalid response from server.' }
    } catch { return { error: 'Cannot connect to server.' } }
  },

  async getUsers() {
    try {
      const res = await fetch('/api/users', { credentials: 'include', headers: authHeader() })
      if (res.status === 401) { handle401(); return { error: 'Unauthorized.' } }
      if (!res.ok) return { error: `Server error: ${res.status}` }
      return safeJson(res)
    } catch { return { error: 'Network error connecting to API.' } }
  },

  async updateUser(id, updates) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH', credentials: 'include',
        headers: jsonHeaders(), body: JSON.stringify(updates)
      })
      if (res.status === 401) { handle401(); return { error: 'Not authenticated.' } }
      return safeJson(res)
    } catch { return { error: 'Cannot connect to server.' } }
  },

  requireAuth(requiredRole = 'user') {
    const user = this.getCurrentUser()
    const token = localStorage.getItem('uspn_token')
    if (!user || !token) {
      this.clearSession()
      const isAdmin = window.location.pathname.includes('/admin/')
      window.location.href = isAdmin ? '../../pages/login.html' : '../pages/login.html'
      return false
    }
    if (requiredRole === 'admin' && user.role !== 'admin') {
      window.location.href = window.location.pathname.includes('/admin/') ? '../../index.html' : '../index.html'
      return false
    }
    // Check JWT expiry client-side
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.exp * 1000 < Date.now()) {
        this.clearSession()
        const isAdmin = window.location.pathname.includes('/admin/')
        window.location.href = isAdmin ? '../../pages/login.html' : '../pages/login.html'
        return false
      }
    } catch {
      this.clearSession()
      window.location.href = '../pages/login.html'
      return false
    }
    return user
  }
}

window.DB = DB
