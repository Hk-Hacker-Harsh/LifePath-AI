const express = require('express')
const { pool } = require('../db')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
router.use(authMiddleware)

// ─── GET ALL DECISIONS ─────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, decision_text, city, quality_score, business_type,
              result, form_snapshot, created_at
       FROM decisions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    )
    res.json({
      decisions: result.rows.map(r => ({
        id:           r.id,
        decisionText: r.decision_text,
        city:         r.city,
        qualityScore: r.quality_score,
        businessType: r.business_type,
        result:       r.result,
        form:         r.form_snapshot,
        createdAt:    r.created_at,
      }))
    })
  } catch (err) {
    console.error('Get decisions error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── SAVE DECISION ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { decisionText, city, formSnapshot, result, qualityScore, businessType } = req.body

  try {
    const saved = await pool.query(
      `INSERT INTO decisions
        (user_id, decision_text, city, form_snapshot, result, quality_score, business_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [req.user.id, decisionText, city,
       JSON.stringify(formSnapshot), JSON.stringify(result),
       qualityScore, businessType]
    )
    res.status(201).json({ id: saved.rows[0].id, createdAt: saved.rows[0].created_at })
  } catch (err) {
    console.error('Save decision error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── DELETE DECISION ───────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM decisions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
