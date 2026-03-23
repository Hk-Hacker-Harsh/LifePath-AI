import { useState, useEffect } from 'react'
import * as api from './lib/api'
import AuthPage         from './pages/AuthPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import HomePage         from './pages/HomePage'
import DecisionPage     from './pages/DecisionPage'
import DashboardPage    from './pages/DashboardPage'
import { generateComparison } from './api/engine'

export default function App() {
  const [authState, setAuthState] = useState('loading')
  const [user,      setUser]      = useState(null)
  const [profile,   setProfile]   = useState(null)
  const [page,      setPage]      = useState('home')
  const [result,    setResult]    = useState(null)
  const [comparison,setComparison]= useState(null)
  const [currentForm,setCurrentForm] = useState(null)
  const [prefillDecision, setPrefillDecision] = useState('')

  // ── Boot — check stored token ──────────────────────────────────────────
  useEffect(() => {
    const token = api.getToken()
    if (!token) { setAuthState('unauthed'); return }

    api.getMe()
      .then(data => {
        setUser(data.user)
        return api.getProfile()
      })
      .then(profile => {
        setAuthState('authed')
        if (profile) { setProfile(profile); setPage('home') }
        else setPage('setup')
      })
      .catch(() => {
        api.clearToken()
        setAuthState('unauthed')
      })
  }, [])

  // ── Check for ?verified=true in URL ───────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('verified') === 'true') {
      window.history.replaceState({}, '', '/')
    }
  }, [])

  async function handleAuth(userData) {
    setUser(userData)
    try {
      const profile = await api.getProfile()
      setAuthState('authed')
      if (profile) { setProfile(profile); setPage('home') }
      else setPage('setup')
    } catch {
      setAuthState('authed')
      setPage('setup')
    }
  }

  async function handleProfileComplete(profileData) {
    setProfile(profileData)
    setPage('home')
  }

  function handleNewDecision(prefill = '') {
    setPrefillDecision(prefill)
    setPage('decision')
  }

  function handleDecisionComplete({ result, form, comparison }) {
    setResult(result); setCurrentForm(form); setComparison(comparison)
    setPage('dashboard')
  }

  function handleViewDecision(dec) {
    setResult(dec.result); setCurrentForm(dec.form)
    setComparison(generateComparison(dec.form, dec.result.timelines))
    setPage('dashboard')
  }

  function handleReset() {
    setResult(null); setCurrentForm(null); setComparison(null)
    setPage('home')
  }

  async function handleSignOut() {
    await api.logout()
    setUser(null); setProfile(null)
    setAuthState('unauthed'); setPage('home')
  }

  if (authState === 'loading') return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', flexDirection:'column', gap:16 }}>
      <div style={{ fontFamily:'var(--fd)', fontSize:20, color:'var(--gold)' }}>LifePath AI</div>
      <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--muted)' }}>Loading...</div>
    </div>
  )

  if (authState === 'unauthed') return <AuthPage onAuth={handleAuth} />

  if (page === 'setup') return <ProfileSetupPage user={user} onComplete={handleProfileComplete} />
  if (page === 'edit')  return <ProfileSetupPage user={user} initialData={profile} onComplete={p => { setProfile(p); setPage('home') }} onBack={() => setPage('home')} />

  if (page === 'home') return (
    <HomePage user={user} profile={profile}
      onNewDecision={handleNewDecision}
      onViewDecision={handleViewDecision}
      onEditProfile={() => setPage('edit')}
      onSignOut={handleSignOut} />
  )

  if (page === 'decision') return (
    <DecisionPage user={user} profile={profile}
      prefillDecision={prefillDecision}
      onComplete={handleDecisionComplete}
      onBack={() => setPage('home')} />
  )

  if (page === 'dashboard') return (
    <DashboardPage result={result} form={currentForm} comparison={comparison} onReset={handleReset} />
  )

  return null
}
