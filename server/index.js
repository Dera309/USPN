import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import authRoutes     from './routes/auth.js'
import shipmentRoutes from './routes/shipments.js'
import userRoutes     from './routes/users.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const app  = express()
const PORT = process.env.PORT || 5000

// ── Serve static files FIRST (before CORS/auth middleware) ─────────────────
// This ensures JS/CSS assets are never blocked by CORS checks
const distPath = path.join(__dirname, '../dist')
if (!fs.existsSync(distPath)) {
  console.error('[WARN] dist/ directory not found. Did the build step complete?')
} else {
  console.log('[OK] dist/ directory found at', distPath)
}
app.use(express.static(distPath, { index: false }))

// ── Middleware ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://localhost:5005',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true)
    
    // Allow any localhost or 127.0.0.1 in development
    const isLocal = origin.startsWith('http://localhost:') || 
                    origin.startsWith('http://127.0.0.1:') ||
                    origin === 'http://localhost' || 
                    origin === 'http://127.0.0.1'

    if (isLocal || allowedOrigins.some(o => origin.startsWith(o)) || origin.endsWith('.onrender.com')) {
      return callback(null, true)
    }
    
    // Return false instead of an Error to avoid 500 status on CORS rejection
    callback(null, false)
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

// Catch-all: ONLY handle navigation routes (no file extension = page request)
// Asset requests (JS/CSS/images) that weren't found will naturally 404 via express.static
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found.' })
  }

  // If the request has a file extension (e.g. .js, .css, .png), do NOT intercept -
  // let it 404 naturally rather than serving wrong content
  const ext = path.extname(req.path)
  if (ext && ext !== '.html') {
    return res.status(404).send('File not found.')
  }

  // Try to serve the exact matching .html file from dist
  const requestedHtml = path.join(distPath, req.path.endsWith('.html') ? req.path : req.path + '.html')
  if (fs.existsSync(requestedHtml)) {
    return res.sendFile(requestedHtml)
  }

  // Fall back to index.html
  const indexFile = path.join(distPath, 'index.html')
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile)
  }

  res.status(500).send('App not built. Run npm run build first.')
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
