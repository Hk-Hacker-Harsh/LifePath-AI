const express  = require('express')
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { pool } = require('../db')
const { sendVerificationEmail } = require('../middleware/email')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// ─── SIGNUP ────────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  try {
    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Email already registered' })

    const passwordHash  = await bcrypt.hash(password, 12)
    const verifyToken   = uuidv4()
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // In development: auto-verify so SMTP setup is not required to test
    const isDev = process.env.NODE_ENV !== 'production'
    const isVerified = isDev ? true : false

    await pool.query(
      `INSERT INTO users (email, password_hash, verify_token, verify_expires, is_verified)
       VALUES ($1, $2, $3, $4, $5)`,
      [email.toLowerCase(), passwordHash, verifyToken, verifyExpires, isVerified]
    )

    // Try sending verification email — skip silently if SMTP not configured
    if (!isDev) {
      try {
        await sendVerificationEmail(email.toLowerCase(), verifyToken)
      } catch (emailErr) {
        console.warn('Email send failed (not critical in dev):', emailErr.message)
      }
    }

    if (isDev) {
      // In dev: return a token immediately so user can log in right away
      res.status(201).json({
        message: 'Account created. You can log in now (dev mode — email verification skipped).',
        devMode: true,
      })
    } else {
      res.status(201).json({
        message: 'Account created. Check your email to verify your account before logging in.',
      })
    }
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Server error during signup' })
  }
})

// ─── VERIFY EMAIL ──────────────────────────────────────────────────────────
router.get('/verify', async (req, res) => {
  const { token } = req.query
  if (!token) return res.status(400).json({ error: 'Token required' })

  try {
    const result = await pool.query(
      `SELECT id FROM users
       WHERE verify_token = $1 AND verify_expires > NOW() AND is_verified = FALSE`,
      [token]
    )
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification link' })
    }

    await pool.query(
      `UPDATE users SET is_verified = TRUE, verify_token = NULL, verify_expires = NULL
       WHERE id = $1`,
      [result.rows[0].id]
    )

    // Redirect to frontend login with success flag
    res.redirect(`${process.env.FRONTEND_URL}?verified=true`)
  } catch (err) {
    console.error('Verify error:', err)
    res.status(500).json({ error: 'Server error during verification' })
  }
})

// ─── LOGIN ─────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    )
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' })

    const user = result.rows[0]

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in', needsVerification: true })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      token,
      user: { id: user.id, email: user.email }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error during login' })
  }
})

// ─── GET CURRENT USER ──────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' })
    res.json({ user: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── RESEND VERIFICATION ───────────────────────────────────────────────────
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND is_verified = FALSE',
      [email.toLowerCase()]
    )
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Email not found or already verified' })
    }

    const verifyToken   = uuidv4()
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await pool.query(
      'UPDATE users SET verify_token = $1, verify_expires = $2 WHERE email = $3',
      [verifyToken, verifyExpires, email.toLowerCase()]
    )

    await sendVerificationEmail(email.toLowerCase(), verifyToken)
    res.json({ message: 'Verification email resent' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
