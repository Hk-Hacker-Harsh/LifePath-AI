const express = require('express')
const { pool } = require('../db')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
router.use(authMiddleware)

// ─── GET FEELINGS (latest 20) ──────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, mood, feeling_text, next_decision, created_at
       FROM feelings WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 20`,
      [req.user.id]
    )
    res.json({ feelings: result.rows })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── SAVE FEELING ──────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { mood, feeling, nextDecision } = req.body
  try {
    const saved = await pool.query(
      `INSERT INTO feelings (user_id, mood, feeling_text, next_decision)
       VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
      [req.user.id, mood || null, feeling || null, nextDecision || null]
    )
    res.status(201).json({ id: saved.rows[0].id, createdAt: saved.rows[0].created_at })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
