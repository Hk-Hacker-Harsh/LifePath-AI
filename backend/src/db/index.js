const { Pool } = require('pg')

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err)
})

// ─── Auto-create tables on startup ────────────────────────────────────────

async function initDB() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email         VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_verified   BOOLEAN DEFAULT FALSE,
        verify_token  VARCHAR(255),
        verify_expires TIMESTAMPTZ,
        reset_token   VARCHAR(255),
        reset_expires TIMESTAMPTZ,
        created_at    TIMESTAMPTZ DEFAULT NOW(),
        updated_at    TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS profiles (
        id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id             UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        name                VARCHAR(255),
        age                 INTEGER,
        city                VARCHAR(255),
        employment_status   VARCHAR(50),
        current_job         VARCHAR(255),
        current_company     VARCHAR(255),
        current_salary      VARCHAR(100),
        years_of_experience INTEGER,
        current_situation   TEXT,
        skills              TEXT,
        resume_text         TEXT,
        created_at          TIMESTAMPTZ DEFAULT NOW(),
        updated_at          TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS decisions (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
        decision_text   TEXT NOT NULL,
        city            VARCHAR(255),
        form_snapshot   JSONB,
        result          JSONB,
        quality_score   FLOAT,
        business_type   VARCHAR(255),
        created_at      TIMESTAMPTZ DEFAULT NOW(),
        updated_at      TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS feelings (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
        mood          INTEGER CHECK (mood BETWEEN 1 AND 5),
        feeling_text  TEXT,
        next_decision TEXT,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_decisions_user_id ON decisions(user_id);
      CREATE INDEX IF NOT EXISTS idx_feelings_user_id  ON feelings(user_id);
    `)
    console.log('✅ Database tables ready')
  } catch (err) {
    console.error('❌ DB init error:', err.message)
    throw err
  } finally {
    client.release()
  }
}

module.exports = { pool, initDB }
