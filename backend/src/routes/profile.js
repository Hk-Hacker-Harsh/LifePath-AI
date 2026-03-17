const express = require('express')
const { pool } = require('../db')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
router.use(authMiddleware)

// ─── GET PROFILE ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [req.user.id]
    )
    if (result.rows.length === 0) return res.json({ profile: null })

    const p = result.rows[0]
    // Return in the same shape the frontend expects
    res.json({
      profile: {
        name:               p.name,
        age:                String(p.age || ''),
        city:               p.city,
        employmentStatus:   p.employment_status,
        currentJob:         p.current_job,
        currentCompany:     p.current_company,
        currentSalary:      p.current_salary,
        yearsOfExperience:  String(p.years_of_experience || '0'),
        currentSituation:   p.current_situation,
        skills:             p.skills,
        resumeText:         p.resume_text,
        updatedAt:          p.updated_at,
      }
    })
  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── SAVE / UPDATE PROFILE ─────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const {
    name, age, city, employmentStatus, currentJob, currentCompany,
    currentSalary, yearsOfExperience, currentSituation, skills, resumeText
  } = req.body

  try {
    await pool.query(
      `INSERT INTO profiles
        (user_id, name, age, city, employment_status, current_job, current_company,
         current_salary, years_of_experience, current_situation, skills, resume_text)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (user_id) DO UPDATE SET
         name               = EXCLUDED.name,
         age                = EXCLUDED.age,
         city               = EXCLUDED.city,
         employment_status  = EXCLUDED.employment_status,
         current_job        = EXCLUDED.current_job,
         current_company    = EXCLUDED.current_company,
         current_salary     = EXCLUDED.current_salary,
         years_of_experience= EXCLUDED.years_of_experience,
         current_situation  = EXCLUDED.current_situation,
         skills             = EXCLUDED.skills,
         resume_text        = EXCLUDED.resume_text,
         updated_at         = NOW()`,
      [
        req.user.id, name, parseInt(age) || null, city, employmentStatus,
        currentJob, currentCompany, currentSalary,
        parseInt(yearsOfExperience) || 0, currentSituation, skills, resumeText
      ]
    )
    res.json({ success: true })
  } catch (err) {
    console.error('Save profile error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
