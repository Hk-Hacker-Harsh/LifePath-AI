import { useState } from 'react'
import * as api from '../lib/api'
import LifePathOrb from '../components/LifePathOrb'
import styles from './AuthPage.module.css'

export default function AuthPage({ onAuth }) {
  const [mode, setMode]         = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [info, setInfo]         = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setInfo('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        const data = await api.signup(email, password)
        if (data.devMode) {
          // Dev mode — auto-verified, just switch to login
          setMode('login')
          setInfo('Account created! You can log in now.')
        } else {
          setMode('verify')
          setInfo(`Verification email sent to ${email}. Click the link in the email, then log in here.`)
        }
      } else {
        const data = await api.login(email, password)
        onAuth(data.user)
      }
    } catch (err) {
      if (err.data?.needsVerification) {
        setError('Please verify your email first. Check your inbox.')
      } else {
        setError(err.message || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setLoading(true)
    try {
      await api.resendVerification(email)
      setInfo('Verification email resent! Check your inbox.')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className={styles.page}>
      <div className={styles.gridBg} />
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.orbWrap}><LifePathOrb size={64} /></div>
        <div className={styles.brand}>LifePath <span className={styles.gold}>AI</span></div>
        <div className={styles.tagline}>Simulate your decisions before you make them</div>

        {mode === 'verify' ? (
          <div className={styles.verifyBlock}>
            <div className={styles.verifyIcon}>📬</div>
            <div className={styles.verifyTitle}>Check your email</div>
            <p className={styles.verifyText}>{info}</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <button className={styles.switchBtn} onClick={handleResend} disabled={loading}>
                Resend Email
              </button>
              <button className={styles.switchBtn} onClick={() => { setMode('login'); setInfo('') }}>
                ← Back to Login
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.modeTabs}>
              <button className={`${styles.modeTab} ${mode==='login' ? styles.modeTabActive:''}`}
                onClick={() => { setMode('login'); setError('') }}>Log In</button>
              <button className={`${styles.modeTab} ${mode==='signup' ? styles.modeTabActive:''}`}
                onClick={() => { setMode('signup'); setError('') }}>Sign Up</button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} type="email" required autoFocus
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <input className={styles.input} type="password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={mode==='signup' ? 'Min 6 characters' : '••••••••'} />
              </div>
              {error && <div className={styles.error}>⚠ {error}</div>}
              {info  && <div className={styles.info}>✓ {info}</div>}
              <button type="submit" className={`${styles.submitBtn} ${loading ? styles.loading:''}`} disabled={loading}>
                {loading ? 'Please wait...' : mode==='signup' ? 'Create Account →' : 'Log In →'}
              </button>
            </form>

            <div className={styles.switchRow}>
              {mode === 'login'
                ? <span>Don't have an account? <button className={styles.switchLink} onClick={() => { setMode('signup'); setError('') }}>Sign up</button></span>
                : <span>Already have an account? <button className={styles.switchLink} onClick={() => { setMode('login'); setError('') }}>Log in</button></span>
              }
            </div>
          </>
        )}
      </div>
    </div>
  )
}
