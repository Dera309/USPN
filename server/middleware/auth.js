import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function protect(req, res, next) {
  // Prioritize Authorization header (works through Vite proxy), fall back to cookie
  let token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : req.cookies?.token

  console.log('[AUTH] path:', req.path)
  console.log('[AUTH] authorization header:', req.headers.authorization || 'none')
  console.log('[AUTH] cookie token:', req.cookies?.token ? 'present' : 'none')
  console.log('[AUTH] resolved token:', token ? token.substring(0,20) + '...' : 'NONE')

  if (!token) return res.status(401).json({ error: 'Not authenticated' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ error: 'User not found' })
    if (req.user.status === 'suspended') return res.status(403).json({ error: 'Account suspended' })
    next()
  } catch (err) {
    console.error('[AUTH] JWT error:', err.message)
    res.status(401).json({ error: 'Invalid or expired token. Please log in again.' })
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })
  next()
}
