import { useState } from 'react'
import * as api from '../lib/api'
import { generateTimelines, generateComparison } from '../api/engine'
import styles from './InputPage.module.css'

function detectDecisionMode(text) {
  if (!text || text.trim().length < 5) return 'capital'
  const t = text.toLowerCase()
  const careerKeywords = [
    'get a job','find a job','looking for job','job search','apply for',
    'promotion','switch job','switch company','new job','joining','offer letter',
    'salary hike','salary raise','appraisal','negotiate salary',
    'abroad','move to','relocate','migrate','settle in','visa',
    'mba','masters','phd','degree','college','study','iim','iit',
    'certification','upskill','course','pgp','placement','campus','interview',
  ]
  const capitalKeywords = [
    'startup','business','launch','found','open a','start a','invest',
    'restaurant','cafe','shop','store','agency','factory','franchise',
    'ecommerce','saas','app','product','venture','own company',
    'real estate','property','stocks','trading','crypto','mutual fund',
    'freelance','consultant','independent','self-employed',
  ]
  const careerHits  = careerKeywords.filter(k => t.includes(k)).length
  const capitalHits = capitalKeywords.filter(k => t.includes(k)).length
  return capitalHits > careerHits ? 'capital' : careerHits > 0 ? 'career' : 'capital'
}

const RELATIONSHIP_OPTIONS = [
  { value: 'Career First', label: '💼 Career First' },
  { value: 'Balanced',     label: '⚖️  Balanced'    },
  { value: 'Family First', label: '🏠 Family First'  },
]
const RISK_LEVELS = [
  { value: 2,  emoji: '🛡️', label: 'Very Safe',  desc: 'Need certainty' },
  { value: 4,  emoji: '⚖️', label: 'Cautious',   desc: 'Some risk ok' },
  { value: 6,  emoji: '🚀', label: 'Moderate',   desc: 'Comfortable with ups & downs' },
  { value: 8,  emoji: '🔥', label: 'Aggressive', desc: 'Big swings ok' },
  { value: 10, emoji: '💀', label: 'All In',     desc: 'Nothing to lose' },
]
const FUNDING_TYPES = [
  { value: 'savings',  emoji: '💰', label: 'Own savings',       desc: 'Personal / family savings' },
  { value: 'loan',     emoji: '🏦', label: 'Taking a loan',     desc: 'Bank / personal loan' },
  { value: 'parttime', emoji: '⚡', label: 'Keeping income',    desc: 'Part-time / spouse income' },
  { value: 'investor', emoji: '🤝', label: 'External investor', desc: 'Angel / VC / family' },
]

export default function DecisionPage({ user, profile, prefillDecision = '', onComplete, onBack }) {
  const [step, setStep]   = useState(4)
  const [loading, setLoading] = useState(false)
  const [form, setForm]   = useState({
    careerDecision: prefillDecision,
    riskTolerance: 5, savings: '', relationshipPriority: 'Balanced',
    fundingType: 'savings', savingsUsagePct: 50,
    loanAmount: '', externalAmount: '',
  })

  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const riskPct = ((form.riskTolerance - 1) / 9) * 100

  const decisionMode = detectDecisionMode(form.careerDecision)
  const isCareerMode = decisionMode === 'career'

  function parseFundingAmt(str) {
    if (!str) return 0
    const s = String(str).toLowerCase().replace(/[₹,\s]/g, '')
    if (s.includes('cr')) return parseFloat(s) * 10000000
    if (s.includes('l'))  return parseFloat(s) * 100000
    const n = parseFloat(s)
    return isNaN(n) ? 0 : n > 1000 ? n : n * 100000
  }

  const pct          = form.savingsUsagePct
  const savingsAmt   = parseFundingAmt(form.savings)
  const deployedAmt  = savingsAmt * pct / 100
  const remainingAmt = savingsAmt - deployedAmt
  const fmtL         = v => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${Math.round(v).toLocaleString()}`
  const currentSalaryNum = parseFundingAmt(profile?.currentSalary || '0')
  const monthlyBurn      = currentSalaryNum / 12
  const savingsRunway    = remainingAmt > 0 && monthlyBurn > 0 ? remainingAmt / monthlyBurn : 0

  const ready4 = form.careerDecision.trim().length >= 20
  const ready5 = isCareerMode ? true : form.savings.trim()

  async function handleGenerate() {
    setLoading(true)
    try {
      const fullForm = {
        ...profile,
        ...form,
        savingsUsagePct: isCareerMode ? 0 : form.savingsUsagePct,
        savings: isCareerMode ? '0' : form.savings,
      }
      const result     = await generateTimelines(fullForm)
      const comparison = generateComparison(fullForm, result.timelines)
      const saved = await api.saveDecision({ decisionText: fullForm.careerDecision, city: fullForm.city, formSnapshot: fullForm, result, qualityScore: result.qualityScore, businessType: result.businessType })
      onComplete({ result, form: fullForm, comparison, id: saved.id })
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', background:'var(--bg)', gap:20,
      }}>
        <div style={{ fontFamily:'var(--fd)', fontSize:24, color:'var(--gold)' }}>Simulating your futures...</div>
        <div style={{ fontFamily:'var(--fm)', fontSize:12, color:'var(--muted)' }}>Analysing decision, modelling trajectories...</div>
      </div>
    )
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>LifePath AI</div>
        <div className={styles.sidebarSub}>New Simulation</div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:12 }}>
            Your Profile
          </div>
          <div style={{ background:'var(--surface2)', borderRadius:10, padding:'12px 14px', border:'1px solid var(--border)' }}>
            <div style={{ fontFamily:'var(--fd)', fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:4 }}>
              {profile?.name}
            </div>
            <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--muted)' }}>
              {profile?.currentJob || profile?.employmentStatus} · {profile?.city}
            </div>
            {profile?.currentSalary && profile?.currentSalary !== '0' && (
              <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--gold)', marginTop:4 }}>
                ₹{profile.currentSalary}/yr
              </div>
            )}
          </div>
        </div>
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarCardTitle}>💡 Tip</div>
          <p className={styles.sidebarCardText}>
            Be as specific as possible about your decision — name the business, role, target, and plan. The engine reads every word.
          </p>
        </div>
        <div style={{ marginTop:'auto' }}>
          <button onClick={onBack} style={{
            width:'100%', padding:'10px', borderRadius:8,
            border:'1px solid var(--border)', background:'transparent',
            color:'var(--muted)', fontFamily:'var(--fm)', fontSize:11, cursor:'pointer',
          }}>← Back to Home</button>
        </div>
      </aside>

      <main className={styles.form}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: step === 4 ? '50%' : '100%' }} />
        </div>
        <div className={styles.progressLabel}>
          Step {step === 4 ? '1' : '2'} of 2 — {step === 4 ? 'The Decision' : isCareerMode ? 'Final Details' : 'Risk & Funding'}
        </div>

        {/* STEP 4 — The Decision */}
        {step === 4 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>What are you thinking of doing?</h2>
            <p className={styles.stepSub}>
              Be as specific as possible. Name the business type, role, target income, timeline, plan. The engine reads every word.
            </p>

            <div className={styles.field}>
              <label className={styles.label}>Describe your decision in detail <span className={styles.req}>*</span></label>
              <textarea className={styles.textarea} rows={7} autoFocus
                value={form.careerDecision}
                onChange={e => set('careerDecision')(e.target.value)}
                placeholder={`e.g. I want to quit my ${profile?.currentJob || 'job'} at ${profile?.currentCompany || 'my company'} and start something. I have a co-founder and we've validated the idea...`} />
              <span className={styles.hint}>
                {form.careerDecision.length < 20
                  ? `${20 - form.careerDecision.length} more characters to unlock simulation`
                  : `✓ ${form.careerDecision.length} characters`}
              </span>
            </div>

            <div className={styles.contextPill}>
              📌 Simulating from: <strong>{profile?.currentJob || profile?.employmentStatus || 'your profile'}</strong>
              {profile?.currentSalary && profile.currentSalary !== '0' ? ` · ₹${profile.currentSalary}/yr` : ' · ₹0 current income'}
            </div>

            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={onBack}>← Back</button>
              <button className={`${styles.nextBtn} ${ready4 ? styles.nextReady : ''}`}
                disabled={!ready4} onClick={() => setStep(5)}>
                Next: {isCareerMode ? 'Final Details' : 'Risk & Funding'} →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 — Risk & Funding or Final Details */}
        {step === 5 && (
          <div className={styles.stepContent}>
            {isCareerMode ? (
              <>
                <h2 className={styles.stepTitle}>Almost there — final details</h2>
                <p className={styles.stepSub}>No funding needed for this type of decision. Just tell us your priorities.</p>

                <div className={styles.statusBanner} style={{ borderColor:'#88ccff', background:'rgba(136,204,255,0.06)', marginBottom:24 }}>
                  <span>💡</span>
                  <div><strong>No funding needed</strong> — the simulation models career growth, income trajectory, and life quality for this move.</div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>What matters most right now?</label>
                  <div className={styles.pillGroup} style={{ marginTop:6 }}>
                    {RELATIONSHIP_OPTIONS.map(o => (
                      <button key={o.value} type="button"
                        className={`${styles.pill} ${form.relationshipPriority===o.value ? styles.pillActive:''}`}
                        onClick={() => set('relationshipPriority')(o.value)}>{o.label}</button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className={styles.stepTitle}>Money, risk & final details</h2>
                <p className={styles.stepSub}>These numbers change the simulation significantly.</p>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Total Savings Right Now (₹) <span className={styles.req}>*</span></label>
                    <input className={styles.input} value={form.savings} autoFocus
                      onChange={e => set('savings')(e.target.value)}
                      placeholder="e.g. 5L or 5,00,000 (enter 0 if none)" />
                    <span className={styles.hint}>Everything liquid — FD, bank, investments</span>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>What matters most right now?</label>
                    <div className={styles.pillGroup} style={{ marginTop:6 }}>
                      {RELATIONSHIP_OPTIONS.map(o => (
                        <button key={o.value} type="button"
                          className={`${styles.pill} ${form.relationshipPriority===o.value ? styles.pillActive:''}`}
                          onClick={() => set('relationshipPriority')(o.value)}>{o.label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>How much of your savings will you put into this?</label>
                  <div className={styles.savingsSliderRow}>
                    <span className={styles.savingsPct}>{pct}%</span>
                    <input type="range" min={0} max={100} value={pct}
                      onChange={e => set('savingsUsagePct')(Number(e.target.value))}
                      className={styles.savingsSlider}
                      style={{ background:`linear-gradient(to right, var(--gold) ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }} />
                    <span className={styles.savingsLabel}>100%</span>
                  </div>
                  {savingsAmt > 0 && (
                    <div className={styles.savingsBreakdown}>
                      <div className={styles.savingsCol}><span>Deploying</span><strong style={{ color:'var(--gold)' }}>{fmtL(deployedAmt)}</strong></div>
                      <div className={styles.savingsCol}><span>Buffer</span><strong style={{ color: remainingAmt < 100000 ? 'var(--risk)':'var(--opt)' }}>{fmtL(remainingAmt)}</strong></div>
                      <div className={styles.savingsCol}><span>Runway</span><strong style={{ color: savingsRunway < 3 ? 'var(--risk)': savingsRunway < 6 ? 'var(--gold)':'var(--opt)' }}>{savingsRunway > 0 ? savingsRunway.toFixed(1)+' mo' : '—'}</strong></div>
                    </div>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Additional funding</label>
                  <div className={styles.fundingGrid}>
                    {FUNDING_TYPES.map(f => (
                      <button key={f.value} type="button"
                        className={`${styles.fundingCard} ${form.fundingType===f.value ? styles.fundingActive:''}`}
                        onClick={() => set('fundingType')(f.value)}>
                        <span className={styles.fundingEmoji}>{f.emoji}</span>
                        <span className={styles.fundingLabel}>{f.label}</span>
                        <span className={styles.fundingDesc}>{f.desc}</span>
                      </button>
                    ))}
                  </div>
                  {form.fundingType === 'loan' && (
                    <div className={styles.fundingAmountBlock}>
                      <div className={styles.field} style={{ margin:0 }}>
                        <label className={styles.label}>Loan Amount (₹)</label>
                        <input className={styles.input} value={form.loanAmount}
                          onChange={e => set('loanAmount')(e.target.value)} placeholder="e.g. 10L" />
                      </div>
                    </div>
                  )}
                  {form.fundingType === 'investor' && (
                    <div className={styles.fundingAmountBlock}>
                      <div className={styles.field} style={{ margin:0 }}>
                        <label className={styles.label}>External Funding (₹)</label>
                        <input className={styles.input} value={form.externalAmount}
                          onChange={e => set('externalAmount')(e.target.value)} placeholder="e.g. 25L" />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Risk tolerance — always shown */}
            <div className={styles.field}>
              <label className={styles.label}>Your personal risk tolerance</label>
              <div className={styles.riskGrid}>
                {RISK_LEVELS.map(r => (
                  <button key={r.value} type="button"
                    className={`${styles.riskCard} ${form.riskTolerance===r.value ? styles.riskCardActive:''}`}
                    onClick={() => set('riskTolerance')(r.value)}>
                    <span className={styles.riskEmoji}>{r.emoji}</span>
                    <span className={styles.riskLabel}>{r.label}</span>
                    <span className={styles.riskDesc}>{r.desc}</span>
                  </button>
                ))}
              </div>
              <div className={styles.riskSliderRow}>
                <span className={styles.riskSliderLabel}>Fine-tune:</span>
                <input type="range" min={1} max={10} value={form.riskTolerance}
                  onChange={e => set('riskTolerance')(Number(e.target.value))}
                  className={styles.riskSlider}
                  style={{ background:`linear-gradient(to right, var(--gold) 0%, var(--gold) ${riskPct}%, rgba(255,255,255,0.1) ${riskPct}%, rgba(255,255,255,0.1) 100%)` }} />
                <span className={styles.riskValue}>{form.riskTolerance}/10</span>
              </div>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => setStep(4)}>← Back</button>
              <button className={`${styles.submitBtn} ${ready5 ? styles.submitReady:''}`}
                disabled={!ready5} onClick={handleGenerate}>
                Simulate My 3 Futures →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
