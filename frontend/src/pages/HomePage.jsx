import { useState, useEffect } from 'react'
import * as api from '../lib/api'
import styles from './HomePage.module.css'

const MOODS = [
  { value: 5, emoji: '😄', label: 'Great' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 2, emoji: '😟', label: 'Tough' },
  { value: 1, emoji: '😔', label: 'Bad' },
]

const fmtL = v => {
  if (!v && v !== 0) return '₹0'
  const n = Math.abs(v)
  if (n >= 10000000) return `₹${(n/10000000).toFixed(1)}Cr`
  if (n >= 100000)   return `₹${(n/100000).toFixed(1)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

const fmtDate = iso => new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
const qColor = q => q > 0.3 ? 'var(--opt)' : q > 0 ? '#88ccff' : q > -0.3 ? 'var(--gold)' : 'var(--risk)'
const qLabel = q => q > 0.5 ? 'Strong Move' : q > 0.2 ? 'Decent Bet' : q > -0.1 ? 'Borderline' : q > -0.4 ? 'Risky' : 'Poor Timing'

export default function HomePage({ user, profile, onNewDecision, onViewDecision, onEditProfile, onSignOut }) {
  const [mood, setMood]               = useState(null)
  const [feeling, setFeeling]         = useState('')
  const [nextDecision, setNextDecision] = useState('')
  const [feelingSaved, setFeelingSaved] = useState(false)
  const [decisions, setDecisions]     = useState([])
  const [loadingDec, setLoadingDec]   = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    api.getDecisions()
      .then(decs => setDecisions(decs || []))
      .catch(console.error)
      .finally(() => setLoadingDec(false))
  }, [])

  async function handleSaveFeeling() {
    if (!mood && !feeling.trim()) return
    try {
      await api.saveFeeling({ mood, feeling, nextDecision })
      setFeelingSaved(true)
      setTimeout(() => setFeelingSaved(false), 3000)
      if (nextDecision.trim().length >= 20) onNewDecision(nextDecision)
    } catch (err) { console.error(err) }
  }

  async function handleDelete(id) {
    try {
      await api.deleteDecision(id)
      setDecisions(prev => prev.filter(d => d.id !== id))
      setDeleteConfirm(null)
    } catch (err) { console.error(err) }
  }

  return (
    <div className={styles.page}>
      <div className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.sidebarOverlayOpen:''}`}
        onClick={() => setSidebarOpen(false)} />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen:''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarBrand}>LifePath <span>AI</span></div>
          <button className={styles.sidebarClose} onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <div className={styles.sidebarProfile}>
          <div className={styles.sidebarAvatar}>{profile?.name?.[0]?.toUpperCase() || '?'}</div>
          <div>
            <div className={styles.sidebarName}>{profile?.name || user?.email}</div>
            <div className={styles.sidebarMeta}>{profile?.employmentStatus} · {profile?.city}</div>
          </div>
        </div>
        <nav className={styles.sidebarNav}>
          <button className={`${styles.navBtn} ${styles.navBtnActive}`}><span>🏠</span> Home</button>
          <button className={styles.navBtn} onClick={() => { onEditProfile(); setSidebarOpen(false) }}><span>✏️</span> Edit My Profile</button>
        </nav>
        <div className={styles.sidebarStats}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{decisions.length}</span>
            <span className={styles.statLabel}>Decisions</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>{profile?.yearsOfExperience || 0}</span>
            <span className={styles.statLabel}>Yrs Exp</span>
          </div>
        </div>
        <div style={{ flex:1 }} />
        <button className={styles.signOutBtn} onClick={onSignOut}>↩ Sign Out</button>
      </aside>

      <div className={styles.main}>
        <header className={styles.topBar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
          <div className={styles.topBarBrand}>LifePath <span>AI</span></div>
        </header>

        <div className={styles.content}>
          <div className={styles.greeting}>
            <h1 className={styles.greetingTitle}>Hey {profile?.name?.split(' ')[0] || 'there'} 👋</h1>
            <p className={styles.greetingSubtitle}>How's life going? Check in below or start a new simulation.</p>
          </div>

          {/* Feeling Panel */}
          <div className={styles.feelingPanel}>
            <div className={styles.feelingHeader}>
              <div className={styles.feelingTitle}>💬 How are you feeling right now?</div>
              <div className={styles.feelingSubtitle}>Check in with yourself — it takes 30 seconds</div>
            </div>
            <div className={styles.moodRow}>
              {MOODS.map(m => (
                <button key={m.value} type="button"
                  className={`${styles.moodBtn} ${mood===m.value ? styles.moodBtnActive:''}`}
                  onClick={() => setMood(m.value)}>
                  <span className={styles.moodEmoji}>{m.emoji}</span>
                  <span className={styles.moodLabel}>{m.label}</span>
                </button>
              ))}
            </div>
            <textarea className={styles.feelingTextarea} rows={3} value={feeling}
              onChange={e => setFeeling(e.target.value)}
              placeholder="How are you feeling about your current situation?..." />
            <div className={styles.nextDecLabel}>What's your next decision you're thinking about?</div>
            <textarea className={styles.feelingTextarea} rows={3} value={nextDecision}
              onChange={e => setNextDecision(e.target.value)}
              placeholder="Describe any upcoming decision — if it's detailed enough we'll offer to simulate it..." />
            <div className={styles.feelingFooter}>
              {nextDecision.trim().length >= 20 && (
                <div className={styles.simulateHint}>✨ Looks like a full decision — saving will offer to simulate it</div>
              )}
              <button className={`${styles.feelingSaveBtn} ${feelingSaved ? styles.feelingSaved:''}`}
                onClick={handleSaveFeeling} disabled={!mood && !feeling.trim()}>
                {feelingSaved ? '✓ Saved!' : 'Save Check-in'}
              </button>
            </div>
          </div>

          {/* Decision History */}
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <div className={styles.historyTitle}>📁 Your Decision History</div>
              <div className={styles.historyCount}>{decisions.length} simulation{decisions.length!==1?'s':''}</div>
            </div>

            {loadingDec ? (
              <div style={{ textAlign:'center', padding:40, color:'var(--muted)', fontFamily:'var(--fm)', fontSize:12 }}>
                Loading your decisions...
              </div>
            ) : decisions.length === 0 ? (
              <div className={styles.emptyHistory}>
                <div className={styles.emptyIcon}>🔮</div>
                <div className={styles.emptyTitle}>No simulations yet</div>
                <p className={styles.emptyText}>Hit "New Decision" to simulate your first life path.</p>
                <button className={styles.emptyBtn} onClick={() => onNewDecision('')}>Start First Simulation →</button>
              </div>
            ) : (
              <div className={styles.decisionList}>
                {decisions.map(dec => (
                  <div key={dec.id} className={styles.decisionCard}>
                    <div className={styles.decCardLeft}>
                      <div className={styles.decCardDate}>{fmtDate(dec.createdAt)}</div>
                      <div className={styles.decCardText}>{dec.decisionText}</div>
                      {dec.businessType && <div className={styles.decCardType}>{dec.businessType}</div>}
                      <div className={styles.decCardCity}>📍 {dec.city}</div>
                    </div>
                    <div className={styles.decCardRight}>
                      <div className={styles.decCardScore} style={{ color: qColor(dec.qualityScore) }}>
                        <span className={styles.decCardScoreNum}>{dec.qualityScore > 0 ? '+' : ''}{Math.round(dec.qualityScore * 100)}</span>
                        <span className={styles.decCardScoreLabel}>{qLabel(dec.qualityScore)}</span>
                      </div>
                      {dec.result?.timelines?.realistic && (
                        <div className={styles.decCardIncomes}>
                          <div className={styles.decCardIncome} style={{ color:'var(--opt)' }}>
                            <span>{fmtL(dec.result.timelines.optimistic[4].income)}</span>
                            <span className={styles.decCardIncomeLabel}>best</span>
                          </div>
                          <div className={styles.decCardIncome} style={{ color:'var(--real)' }}>
                            <span>{fmtL(dec.result.timelines.realistic[4].income)}</span>
                            <span className={styles.decCardIncomeLabel}>likely</span>
                          </div>
                          <div className={styles.decCardIncome} style={{ color:'var(--risk)' }}>
                            <span>{fmtL(dec.result.timelines.risky[4].income)}</span>
                            <span className={styles.decCardIncomeLabel}>risky</span>
                          </div>
                        </div>
                      )}
                      <div className={styles.decCardActions}>
                        <button className={styles.decCardViewBtn} onClick={() => onViewDecision(dec)}>View Results</button>
                        {deleteConfirm === dec.id ? (
                          <div className={styles.deleteConfirm}>
                            <span>Sure?</span>
                            <button className={styles.deleteYes} onClick={() => handleDelete(dec.id)}>Yes</button>
                            <button className={styles.deleteNo} onClick={() => setDeleteConfirm(null)}>No</button>
                          </div>
                        ) : (
                          <button className={styles.decCardDeleteBtn} onClick={() => setDeleteConfirm(dec.id)}>🗑</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
