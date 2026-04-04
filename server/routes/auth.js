import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = Router()

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function setCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' })
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ error: 'Email already registered.' })
    const user = await User.create({ name, email, password })
    const token = signToken(user._id)
    setCookie(res, token)
    res.status(201).json({ user, token })
  } catch (err) {
    console.error("[AUTH]", err.message); res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, remember } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'No account found with that email address.' })
    const match = await user.matchPassword(password)
    if (!match) return res.status(401).json({ error: 'Incorrect password. Please try again.' })
    if (user.status === 'suspended') return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' })
    const token = signToken(user._id)
    setCookie(res, token)
    console.log('[LOGIN] success for:', user.email, '| token:', token.substring(0,20) + '...')
    res.json({ user, token })
  } catch (err) {
    console.error("[AUTH]", err.message); res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
})

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user })
})

// PATCH /api/auth/me
router.patch('/me', protect, async (req, res, next) => {
  try {
    const { name, email, phone, currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    if (name)  user.name  = name
    if (email) user.email = email
    if (phone !== undefined) user.phone = phone
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: 'Current password required.' })
      const match = await user.matchPassword(currentPassword)
      if (!match) return res.status(400).json({ error: 'Current password is incorrect.' })
      if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters.' })
      user.password = newPassword
    }
    await user.save()
    res.json({ user })
  } catch (err) {
    console.error("[AUTH]", err.message); res.status(500).json({ error: err.message })
  }
})

export default router


