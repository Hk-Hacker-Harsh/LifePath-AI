require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const { initDB } = require('./db')

const authRouter      = require('./routes/auth')
const profileRouter   = require('./routes/profile')
const decisionsRouter = require('./routes/decisions')
const feelingsRouter  = require('./routes/feelings')

const app  = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))  // large for result JSON

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',      authRouter)
app.use('/api/profile',   profileRouter)
app.use('/api/decisions', decisionsRouter)
app.use('/api/feelings',  feelingsRouter)

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date() }))

// ─── 404 ──────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))

// ─── Start ────────────────────────────────────────────────────────────────
async function start() {
  try {
    await initDB()
    app.listen(PORT, () => {
      console.log(`🚀 LifePath AI backend running on port ${PORT}`)
      console.log(`   Frontend URL: ${process.env.FRONTEND_URL}`)
      console.log(`   DB: ${process.env.DB_HOST}/${process.env.DB_NAME}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
