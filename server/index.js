import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes     from './routes/auth.js'
import shipmentRoutes from './routes/shipments.js'
import userRoutes     from './routes/users.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// ── Request logger ─────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  const auth = req.headers.authorization ? 'Bearer present' : 'none'
  console.log(`[REQ] ${req.method} ${req.path} | auth: ${auth} | cookie: ${req.cookies?.token ? 'present' : 'none'}`)
  next()
})

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/shipments', shipmentRoutes)
app.use('/api/users',     userRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// ── Static Assets & Catch-all ──────────────────────────────────────────────
const distPath = path.join(__dirname, '../dist')
app.use(express.static(distPath))

// Catch-all: serve index.html for unknown routes (enables SPA routing)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Endpoint not found.' })
  res.sendFile(path.join(distPath, 'index.html'))
})

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', req.method, req.path, err.message)
  if (err.name === 'CastError')      return res.status(400).json({ error: 'Invalid ID format.' })
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message })
  res.status(500).json({ error: err.message })
})

// ── Start server with port error handling ─────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`API server running on port ${PORT} (mode: ${process.env.NODE_ENV || 'dev'})`)
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] Port ${PORT} is already in use by another process.`)
    process.exit(1)
  } else {
    console.error('[ERROR] Server failure:', err)
    process.exit(1)
  }
})

async function connectDB(retries = 5, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      if (!process.env.MONGO_URI) throw new Error('MONGO_URI not defined in environment.')
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
      })
      console.log('MongoDB connected')
      return
    } catch (err) {
      console.error(`MongoDB attempt ${i}/${retries} failed:`, err.message)
      if (i < retries) {
        console.log(`Retrying in ${delay / 1000}s...`)
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }
}

connectDB()
