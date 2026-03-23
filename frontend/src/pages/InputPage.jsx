import { useState } from 'react'
import { CITIES } from '../constants'
import styles from './InputPage.module.css'

const RELATIONSHIP_OPTIONS = [
  { value: 'Career First', label: '💼 Career First' },
  { value: 'Balanced',     label: '⚖️  Balanced'    },
  { value: 'Family First', label: '🏠 Family First'  },
]

const RISK_LEVELS = [
  { value: 2,  emoji: '🛡️', label: 'Very Safe',  desc: 'Need certainty, hate volatility' },
  { value: 4,  emoji: '⚖️', label: 'Cautious',   desc: 'Some risk ok, need a safety net' },
  { value: 6,  emoji: '🚀', label: 'Moderate',   desc: 'Comfortable with ups & downs' },
  { value: 8,  emoji: '🔥', label: 'Aggressive', desc: 'Big swings, ready for real pain' },
  { value: 10, emoji: '💀', label: 'All In',     desc: 'Nothing to lose, go for broke' },
]

const FUNDING_TYPES = [
  { value: 'savings',  emoji: '💰', label: 'Own savings',       desc: 'Using personal / family savings' },
  { value: 'loan',     emoji: '🏦', label: 'Taking a loan',     desc: 'Bank / personal / business loan' },
  { value: 'parttime', emoji: '⚡', label: 'Keeping income',    desc: 'Part-time job, freelance, or spouse income' },
  { value: 'investor', emoji: '🤝', label: 'External investor', desc: 'Angel, VC, family investment' },
]

// Employment status — the key missing piece
const EMPLOYMENT_STATUS = [
  { value: 'employed',     emoji: '💼', label: 'Employed',         desc: 'Currently working full-time' },
  { value: 'self',         emoji: '🏢', label: 'Self-employed',    desc: 'Running own business already' },
  { value: 'unemployed',   emoji: '🔍', label: 'Unemployed',       desc: 'Between jobs / was laid off / resigned' },
  { value: 'retired',      emoji: '🌅', label: 'Retired',          desc: 'Retired from service / career' },
  { value: 'student',      emoji: '🎓', label: 'Student',          desc: 'Currently studying, no job yet' },
  { value: 'homemaker',    emoji: '🏠', label: 'Homemaker',        desc: 'Managing home, looking to start something' },
  { value: 'parttime',     emoji: '🕐', label: 'Part-time',        desc: 'Working part-time / freelance only' },
]

const STEPS = [
  { id: 1, label: 'About You',      icon: '👤' },
  { id: 2, label: 'Current Life',   icon: '📊' },
  { id: 3, label: 'Skills',         icon: '🛠️'  },
  { id: 4, label: 'The Decision',   icon: '🎯' },
  { id: 5, label: 'Final Details',  icon: '💰' },
]

// Detect if a decision needs capital (startup/business/investment) or not (job/promotion/abroad/education)
function detectDecisionMode(text) {
  if (!text || text.trim().length < 5) return 'capital' // default
  const t = text.toLowerCase()
  const careerKeywords = [
    'get a job', 'find a job', 'looking for job', 'job search', 'apply for',
    'promotion', 'switch job', 'switch company', 'new job', 'joining', 'offer letter',
    'salary hike', 'salary raise', 'appraisal', 'negotiate salary',
    'abroad', 'move to', 'relocate', 'migrate', 'settle in', 'visa',
    'mba', 'masters', 'phd', 'degree', 'college', 'study', 'iim', 'iit',
    'certification', 'upskill', 'course', 'pgp',
    'placement', 'campus', 'interview', 'get placed',
  ]
  const capitalKeywords = [
    'startup', 'business', 'launch', 'found', 'open a', 'start a', 'invest',
    'restaurant', 'cafe', 'shop', 'store', 'agency', 'factory', 'franchise',
    'ecommerce', 'saas', 'app', 'product', 'venture', 'own company',
    'real estate', 'property', 'stocks', 'trading', 'crypto', 'mutual fund',
    'freelance', 'consultant', 'independent', 'self-employed',
  ]
  const careerHits  = careerKeywords.filter(k => t.includes(k)).length
  const capitalHits = capitalKeywords.filter(k => t.includes(k)).length
  return capitalHits > careerHits ? 'capital' : careerHits > 0 ? 'career' : 'capital'
}

// Status-specific Step 2 config
const STATUS_CONFIG = {
  employed:   { showJob: true,  showSalary: true,  showExp: true,  salaryLabel: 'Annual CTC / Take-home', salaryHint: 'Your current salary' },
  self:       { showJob: true,  showSalary: true,  showExp: true,  salaryLabel: 'Annual income from business', salaryHint: 'What you actually draw from your business' },
  unemployed: { showJob: true,  showSalary: true,  showExp: true,  salaryLabel: 'Last drawn annual salary', salaryHint: 'Your salary before you lost / left the job (enter 0 if never worked)' },
  retired:    { showJob: true,  showSalary: true,  showExp: true,  salaryLabel: 'Pension / monthly income (annual)', salaryHint: 'Pension, rental, or any regular income — enter 0 if none' },
  student:    { showJob: false, showSalary: false, showExp: false, salaryLabel: '', salaryHint: '' },
  homemaker:  { showJob: false, showSalary: true,  showExp: false, salaryLabel: 'Household income (family income)', salaryHint: 'Total household income — helps calibrate the risk model' },
  parttime:   { showJob: true,  showSalary: true,  showExp: true,  salaryLabel: 'Annual income (part-time / freelance)', salaryHint: 'What you currently earn in total per year' },
}

// ── Skills Input Sub-component ──────────────────────────────────────────
const POPULAR_SKILLS = [
  'Python', 'JavaScript', 'Java', 'React', 'Node.js', 'SQL', 'Machine Learning',
  'Sales', 'Marketing', 'SEO', 'Content Writing', 'Graphic Design', 'UI/UX',
  'Finance', 'Accounting', 'CA', 'Financial Modelling',
  'Management', 'Leadership', 'Operations', 'Project Management', 'Agile',
  'Teaching', 'Training', 'Coaching',
  'Cooking', 'Food', 'Hospitality',
  'Real Estate', 'Construction', 'Civil Engineering',
  'Communication', 'Public Speaking', 'Customer Service',
  'Mechanical', 'Electrical', 'Manufacturing',
  'Photography', 'Video Editing', 'Animation',
  'Legal', 'Compliance', 'HR', 'Recruitment',
]

function SkillsInput({ form, set }) {
  const [mode, setMode] = useState('manual')  // 'manual' or 'resume'
  const [addedSkills, setAddedSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')

  function addSkill(skill) {
    const s = skill.trim()
    if (!s || addedSkills.includes(s)) return
    const newList = [...addedSkills, s]
    setAddedSkills(newList)
    set('skills')(newList.join(', '))
    setSkillInput('')
  }

  function removeSkill(s) {
    const newList = addedSkills.filter(x => x !== s)
    setAddedSkills(newList)
    set('skills')(newList.join(', '))
  }

  function handleResumeUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      // For now extract raw text (works for .txt; PDFs need parsing)
      const text = ev.target.result
      set('resumeText')(text.substring(0, 3000))
    }
    reader.readAsText(file)
  }

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['manual','⌨️ Type Skills'], ['resume','📄 Paste / Upload Resume']].map(([m, label]) => (
          <button key={m} type="button"
            onClick={() => setMode(m)}
            style={{
              padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
              border: '1px solid', fontFamily: 'var(--fm)', fontSize: 12,
              borderColor: mode === m ? 'var(--gold)' : 'var(--border)',
              background: mode === m ? 'var(--gold-dim)' : 'var(--surface2)',
              color: mode === m ? 'var(--gold)' : 'var(--muted)',
              fontWeight: mode === m ? 700 : 400,
            }}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'manual' && (
        <div>
          {/* Added skills chips */}
          {addedSkills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
              {addedSkills.map(s => (
                <div key={s} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 10px 5px 12px', borderRadius: 6,
                  background: 'var(--gold-dim)', border: '1px solid var(--gold)',
                  fontFamily: 'var(--fm)', fontSize: 11, color: 'var(--gold)',
                }}>
                  {s}
                  <button onClick={() => removeSkill(s)} style={{
                    background: 'none', border: 'none', color: 'var(--gold)',
                    cursor: 'pointer', fontSize: 12, lineHeight: 1, padding: 0,
                  }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Skill input box */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              style={{
                flex: 1, padding: '10px 14px', background: 'var(--surface2)',
                border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)',
                fontFamily: 'var(--fm)', fontSize: 13, outline: 'none',
              }}
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
              placeholder="Type a skill and press Enter — e.g. Python, Sales, Cooking..." />
            <button onClick={() => addSkill(skillInput)} type="button"
              style={{
                padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
                background: 'var(--gold-dim)', border: '1px solid var(--gold)',
                color: 'var(--gold)', fontFamily: 'var(--fd)', fontSize: 12, fontWeight: 700,
              }}>
              + Add
            </button>
          </div>

          {/* Popular skill quick-adds */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>
              Quick add popular skills:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {POPULAR_SKILLS.filter(s => !addedSkills.includes(s)).slice(0, 24).map(s => (
                <button key={s} type="button" onClick={() => addSkill(s)}
                  style={{
                    padding: '5px 11px', borderRadius: 5, cursor: 'pointer',
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--muted)', fontFamily: 'var(--fm)', fontSize: 11,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.target.style.borderColor = 'rgba(232,200,74,0.4)'; e.target.style.color = 'var(--text-secondary)' }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)' }}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'resume' && (
        <div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 8 }}>
              Upload resume (.txt or paste text below)
            </label>
            <input type="file" accept=".txt,.text" onChange={handleResumeUpload}
              style={{ fontFamily: 'var(--fm)', fontSize: 12, color: 'var(--muted)', marginBottom: 12 }} />
          </div>
          <textarea
            style={{
              width: '100%', padding: '13px 14px', boxSizing: 'border-box',
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text)', fontFamily: 'var(--fm)', fontSize: 12,
              outline: 'none', resize: 'vertical', lineHeight: 1.6,
            }}
            rows={7}
            value={form.resumeText || ''}
            onChange={e => set('resumeText')(e.target.value)}
            placeholder="Paste your resume or LinkedIn summary here. The engine will extract skills and experience from the text...

Example: 8 years of experience in software development. Proficient in Python, Java, React. Led teams of 5-10 engineers. Strong background in data analytics and SQL. Managed product roadmaps and worked closely with sales teams on B2B deals..." />
          <div style={{ fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)', marginTop: 6 }}>
            {form.resumeText ? `✓ ${form.resumeText.length} characters — engine will extract skills from this` : 'Paste any amount of text — more detail = better skill matching'}
          </div>
        </div>
      )}
    </div>
  )
}

export default function InputPage({ onGenerate, error }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', age: '', city: 'Bangalore',
    employmentStatus: '',
    currentJob: '', currentCompany: '', currentSalary: '0',
    yearsOfExperience: '0', currentSituation: '',
    careerDecision: '',
    riskTolerance: 5, savings: '', relationshipPriority: 'Balanced',
    fundingType: 'savings', savingsUsagePct: 50,
    loanAmount: '', externalAmount: '',
    skills: '', resumeText: '',
  })
  const [customCity, setCustomCity]           = useState('')
  const [usingCustomCity, setUsingCustomCity] = useState(false)
  const [showAllCities, setShowAllCities]     = useState(false)

  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const riskPct = ((form.riskTolerance - 1) / 9) * 100

  // Detect whether this decision needs capital (startup/biz) or is a career move (job/abroad/education)
  const decisionMode = detectDecisionMode(form.careerDecision)
  const isCareerMode = decisionMode === 'career'

  // Parse any ₹ string to a number
  function parseFundingAmt(str) {
    if (!str) return 0
    const s = String(str).toLowerCase().replace(/[₹,\s]/g, '')
    if (s.includes('cr')) return parseFloat(s) * 10000000
    if (s.includes('l'))  return parseFloat(s) * 100000
    const n = parseFloat(s)
    return isNaN(n) ? 0 : n > 1000 ? n : n * 100000
  }

  // Savings calculations
  const pct         = form.savingsUsagePct
  const savingsAmt  = parseFundingAmt(form.savings)
  const deployedAmt = savingsAmt * pct / 100
  const remainingAmt= savingsAmt - deployedAmt
  const fmtL        = v => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${Math.round(v).toLocaleString()}`

  // Runway
  const currentSalaryNum = parseFundingAmt(form.currentSalary) || 0
  const monthlyBurn      = currentSalaryNum / 12
  const savingsRunway    = remainingAmt > 0 && monthlyBurn > 0 ? remainingAmt / monthlyBurn : 0

  const sc = STATUS_CONFIG[form.employmentStatus] || {}
  const isNoIncome = ['student','homemaker'].includes(form.employmentStatus)

  // Step 2 ready: depends on employment status
  const step2Ready = () => {
    if (!form.employmentStatus) return false
    if (form.employmentStatus === 'student') return form.currentSituation.trim().length > 0
    if (form.employmentStatus === 'homemaker') return form.currentSituation.trim().length > 0
    return form.currentSituation.trim().length > 0
  }

  const ready = {
    1: form.name.trim() && form.age && form.city && form.employmentStatus,
    2: step2Ready(),
    3: true,  // skills optional — can skip
    4: form.careerDecision.trim().length >= 20,
    // Career mode: savings optional; capital mode: savings required
    5: isCareerMode ? true : form.savings.trim(),
  }

  const displayedCities = showAllCities ? CITIES : CITIES.slice(0, 10)

  function handleCityPill(c) {
    setUsingCustomCity(false); setCustomCity(''); set('city')(c)
  }
  function handleCustomCity(val) {
    setCustomCity(val); setUsingCustomCity(true)
    set('city')(val.trim() || 'Bangalore')
  }

  // Status-specific situation placeholder
  const situationPlaceholder = {
    employed:   "e.g. I've been at my company 3 years, salary is ok but I feel stuck. No growth, politics everywhere, and I'm bored most days...",
    self:       "e.g. My current business is doing ok but not growing. I want to pivot or expand but I'm not sure if this is the right move...",
    unemployed: "e.g. I was laid off 2 months ago / I quit my job last month because it was toxic. I've been looking but haven't found the right fit yet...",
    retired:    "e.g. I retired from my government job 6 months ago. I get a pension but I'm restless and want to build something meaningful with my time and savings...",
    student:    "e.g. I'm in final year of my BTech. I've been thinking about this idea for 2 years. I don't want to go the placement route...",
    homemaker:  "e.g. I was working before marriage, took a break for family. My kids are now older and I want to rebuild my career / start my own thing...",
    parttime:   "e.g. I do some freelance work and have a part-time job, but it's not enough. I want to build something full-time...",
  }[form.employmentStatus] || "Describe your current situation honestly..."

  // Status-aware decision placeholder
  const decisionPlaceholder = {
    unemployed: `e.g. I was laid off from my job as ${form.currentJob || 'a software engineer'} and instead of looking for another job, I want to use this time to launch my own product / startup / freelance practice...`,
    retired:    `e.g. Now that I'm retired from ${form.currentJob || 'government service'}, I want to use my savings and experience to start a ${form.currentJob?.toLowerCase().includes('teach') ? 'coaching centre' : 'consulting / small business'}...`,
    student:    `e.g. Before taking up a job after graduation, I want to launch a startup / product I've been working on. My college project validated there's a real problem here...`,
    homemaker:  `e.g. I want to start a home-based business / return to work in my field / launch an online business. I have ${form.savings || 'some'} savings and want to do this seriously...`,
    employed:   `e.g. I want to quit my ${form.currentJob || 'job'} at ${form.currentCompany || 'my company'} and start something. I have a co-founder and we've validated the idea...`,
    self:       `e.g. I want to pivot my current business into a new direction / launch a second venture / acquire another business in my space...`,
    parttime:   `e.g. I want to go all-in on my freelance work / startup idea and stop the part-time work entirely...`,
  }[form.employmentStatus] || 'Describe your decision in detail...'

  return (
    <div className={styles.layout}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>LifePath AI</div>
        <div className={styles.sidebarSub}>Future Simulator</div>
        <nav className={styles.stepNav}>
          {STEPS.map(s => (
            <div key={s.id}
              className={`${styles.stepItem} ${step === s.id ? styles.stepActive : ''} ${step > s.id ? styles.stepDone : ''}`}
              onClick={() => step > s.id && setStep(s.id)}>
              <div className={styles.stepBubble}>{step > s.id ? '✓' : s.id}</div>
              <div className={styles.stepMeta}>
                <span className={styles.stepIcon}>{s.icon}</span>
                <span className={styles.stepLabel}>
                  {s.id === 5 ? (isCareerMode ? 'Final Details' : 'Risk & Funding') : s.label}
                </span>
              </div>
            </div>
          ))}
        </nav>
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarCardTitle}>🧠 How we think about this</div>
          <p className={styles.sidebarCardText}>
            Whether you're employed, retired, fired, or just starting out — every situation has a different risk profile. The engine adjusts everything based on your actual position, not just your income.
          </p>
        </div>
      </aside>

      {/* ── Form ── */}
      <main className={styles.form}>
        {error && <div className={styles.errorBanner}>⚠ {error}</div>}

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(step/5)*100}%` }} />
        </div>
        <div className={styles.progressLabel}>Step {step} of 5 — {step === 5 ? (isCareerMode ? 'Final Details' : 'Risk & Funding') : STEPS[step-1].label}</div>

        {/* ── STEP 1: About You ── */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Let's start with you</h2>
            <p className={styles.stepSub}>Your situation shapes everything. Someone who just got fired needs a very different simulation than someone with a stable job exploring options.</p>

            <div className={styles.field}>
              <label className={styles.label}>Your Name <span className={styles.req}>*</span></label>
              <input className={styles.input} value={form.name} autoFocus
                onChange={e => set('name')(e.target.value)} placeholder="What should we call you?" />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Your Age <span className={styles.req}>*</span></label>
                <input className={styles.input} type="number" value={form.age} min="16" max="80"
                  onChange={e => set('age')(e.target.value)} placeholder="e.g. 27" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Where are you based? <span className={styles.req}>*</span></label>
                <div className={styles.pillGroup}>
                  {displayedCities.map(c => (
                    <button key={c} type="button"
                      className={`${styles.pill} ${!usingCustomCity && form.city === c ? styles.pillActive : ''}`}
                      onClick={() => handleCityPill(c)}>{c}</button>
                  ))}
                  <button type="button" className={styles.pillMore}
                    onClick={() => setShowAllCities(v => !v)}>
                    {showAllCities ? '↑ Less' : `+${CITIES.length - 10} more`}
                  </button>
                </div>
                <div className={styles.customCityWrap}>
                  <input className={`${styles.input} ${usingCustomCity && customCity ? styles.inputActive : ''}`}
                    value={customCity} onChange={e => handleCustomCity(e.target.value)}
                    placeholder="Or type city — Dubai, London, New York..." />
                  {usingCustomCity && customCity && (
                    <button type="button" className={styles.clearBtn}
                      onClick={() => { setUsingCustomCity(false); setCustomCity(''); set('city')('Bangalore') }}>✕</button>
                  )}
                </div>
              </div>
            </div>

            {/* Employment Status — THE key field */}
            <div className={styles.field}>
              <label className={styles.label}>What best describes your current situation? <span className={styles.req}>*</span></label>
              <div className={styles.statusGrid}>
                {EMPLOYMENT_STATUS.map(s => (
                  <button key={s.value} type="button"
                    className={`${styles.statusCard} ${form.employmentStatus === s.value ? styles.statusActive : ''}`}
                    onClick={() => {
                      set('employmentStatus')(s.value)
                      // Auto-set salary to 0 for non-earning statuses
                      if (['student','retired','unemployed','homemaker'].includes(s.value)) {
                        set('currentSalary')('0')
                      }
                    }}>
                    <span className={styles.statusEmoji}>{s.emoji}</span>
                    <span className={styles.statusLabel}>{s.label}</span>
                    <span className={styles.statusDesc}>{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className={`${styles.nextBtn} ${ready[1] ? styles.nextReady : ''}`}
              disabled={!ready[1]} onClick={() => setStep(2)}>
              Next: Your Current Life →
            </button>
          </div>
        )}

        {/* ── STEP 2: Current Life (status-aware) ── */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>
              {form.employmentStatus === 'unemployed' ? `${form.name ? form.name + ', what' : 'What'} happened and where are you now?`
               : form.employmentStatus === 'retired'  ? `${form.name ? form.name + ', tell' : 'Tell'} us about your life after retirement`
               : form.employmentStatus === 'student'  ? `${form.name ? form.name + ', tell' : 'Tell'} us about your current situation`
               : form.employmentStatus === 'homemaker'? `${form.name ? form.name + ', tell' : 'Tell'} us about your situation`
               : `${form.name ? form.name + ', your' : 'Your'} current life`}
            </h2>
            <p className={styles.stepSub}>
              {form.employmentStatus === 'unemployed' ? 'Your last salary and current situation help us build an accurate baseline — even if income is now zero.'
               : form.employmentStatus === 'retired'  ? "Your retirement income and savings are your baseline. We'll model what starting something new looks like from this position."
               : form.employmentStatus === 'student'  ? "No job yet? That's fine. We'll build your simulation from zero-income baseline."
               : form.employmentStatus === 'homemaker'? "Your household income and savings shape the risk model."
               : 'This is your <strong>baseline</strong>. Every simulated future is compared against this reality.'}
            </p>

            {/* Status-specific context banner */}
            {form.employmentStatus === 'unemployed' && (
              <div className={styles.statusBanner} style={{ borderColor: 'var(--gold)', background: 'rgba(232,200,74,0.06)' }}>
                <span>🔍</span>
                <div>
                  <strong>Currently unemployed</strong> — your baseline in the "Before vs After" comparison will be ₹0 current income.
                  The simulation shows what each path looks like from <em>this exact starting point</em>, not from a hypothetical employed state.
                </div>
              </div>
            )}
            {form.employmentStatus === 'retired' && (
              <div className={styles.statusBanner} style={{ borderColor: 'var(--opt)', background: 'rgba(72,199,142,0.06)' }}>
                <span>🌅</span>
                <div>
                  <strong>Retired</strong> — the engine accounts for your age, pension income, and the fact that you're building from a position of experience rather than urgency.
                  Risk profile will reflect your life stage.
                </div>
              </div>
            )}
            {form.employmentStatus === 'student' && (
              <div className={styles.statusBanner} style={{ borderColor: '#88ccff', background: 'rgba(136,204,255,0.06)' }}>
                <span>🎓</span>
                <div>
                  <strong>Student / fresher</strong> — baseline income is ₹0. The comparison will show each path vs "taking a regular job" as an alternative.
                </div>
              </div>
            )}

            {/* Job/role fields — only for relevant statuses */}
            {sc.showJob && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    {form.employmentStatus === 'unemployed' ? 'Last Job Title'
                     : form.employmentStatus === 'retired'  ? 'Last / Previous Role'
                     : form.employmentStatus === 'self'     ? 'Your Business / Role'
                     : 'Current Job Title'}
                    {' '}<span className={styles.req}>*</span>
                  </label>
                  <input className={styles.input} value={form.currentJob} autoFocus
                    onChange={e => set('currentJob')(e.target.value)}
                    placeholder={
                      form.employmentStatus === 'unemployed' ? "e.g. Software Engineer, Sales Manager..."
                      : form.employmentStatus === 'retired'  ? "e.g. IAS Officer, Bank Manager, Army Colonel..."
                      : form.employmentStatus === 'self'     ? "e.g. Founder of XYZ, Freelance Designer..."
                      : "e.g. Software Engineer, CA, Teacher..."
                    } />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    {form.employmentStatus === 'unemployed' ? 'Last Company'
                     : form.employmentStatus === 'retired'  ? 'Organisation'
                     : 'Company / Organisation'}
                  </label>
                  <input className={styles.input} value={form.currentCompany}
                    onChange={e => set('currentCompany')(e.target.value)}
                    placeholder={
                      form.employmentStatus === 'retired' ? "e.g. Indian Army, State Bank, BSNL..."
                      : form.employmentStatus === 'unemployed' ? "e.g. Infosys, TCS, previous employer..."
                      : "e.g. Infosys, SBI, self-employed..."
                    } />
                </div>
              </div>
            )}

            {/* Salary field — context-aware */}
            {sc.showSalary && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>{sc.salaryLabel}</label>
                  <input className={styles.input} value={form.currentSalary}
                    onChange={e => set('currentSalary')(e.target.value)}
                    placeholder={
                      form.employmentStatus === 'unemployed' ? "Last salary e.g. 12L (enter 0 if first job)"
                      : form.employmentStatus === 'retired'  ? "Pension + income e.g. 3L/yr (enter 0 if none)"
                      : form.employmentStatus === 'homemaker'? "Household income e.g. 15L/yr"
                      : "e.g. 12L or 12,00,000"
                    } />
                  <span className={styles.hint}>{sc.salaryHint}</span>
                </div>
                {sc.showExp && (
                  <div className={styles.field}>
                    <label className={styles.label}>Years of Experience</label>
                    <input className={styles.input} type="number" value={form.yearsOfExperience}
                      onChange={e => set('yearsOfExperience')(e.target.value)}
                      placeholder="e.g. 4" min="0" max="50" />
                    <span className={styles.hint}>Total professional experience</span>
                  </div>
                )}
              </div>
            )}

            {/* For students: just savings/family support */}
            {form.employmentStatus === 'student' && (
              <div className={styles.field}>
                <label className={styles.label}>Current field / degree</label>
                <input className={styles.input} value={form.currentJob}
                  autoFocus
                  onChange={e => set('currentJob')(e.target.value)}
                  placeholder="e.g. Final year BTech CS, MBA at IIM-B, CA Final..." />
              </div>
            )}

            {/* Situation / context */}
            <div className={styles.field}>
              <label className={styles.label}>
                {form.employmentStatus === 'unemployed' ? 'What happened? How long since, and how are you doing?' :
                 form.employmentStatus === 'retired'    ? 'How long retired? What does your daily life look like?' :
                 form.employmentStatus === 'student'    ? 'Tell us about yourself and what led to this decision' :
                 form.employmentStatus === 'homemaker'  ? 'Tell us about your background and current situation' :
                 'How are you feeling about your current situation?'}
                {' '}<span className={styles.req}>*</span>
              </label>
              <textarea className={styles.textarea} rows={3}
                value={form.currentSituation}
                onChange={e => set('currentSituation')(e.target.value)}
                placeholder={situationPlaceholder} />
              <span className={styles.hint}>The engine reads this to understand your real motivations</span>
            </div>

            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
              <button className={`${styles.nextBtn} ${ready[2] ? styles.nextReady : ''}`}
                disabled={!ready[2]} onClick={() => setStep(3)}>
                Next: Your Skills →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Skills ── */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Your skills & background</h2>
            <p className={styles.stepSub}>
              The engine compares your skills against what the target decision actually requires.
              Type them manually, or paste your resume text — it reads both.
              <strong> You can skip this step</strong>, but it unlocks a personalised Skill Fit score on the dashboard.
            </p>

            <div className={styles.skillsInputToggle}>
              <SkillsInput form={form} set={set} />
            </div>

            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
              <button className={styles.skipBtn} onClick={() => setStep(4)}>Skip →</button>
              <button className={`${styles.nextBtn} ${styles.nextReady}`} onClick={() => setStep(4)}>
                Next: The Decision →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: The Decision ── */}
        {step === 4 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>What are you thinking of doing?</h2>
            <p className={styles.stepSub}>Be as specific as possible. Name the business type, role, target income, timeline, plan. The engine reads every word.</p>

            <div className={styles.field}>
              <label className={styles.label}>Describe your decision in detail <span className={styles.req}>*</span></label>
              <textarea className={styles.textarea} rows={6} autoFocus
                value={form.careerDecision}
                onChange={e => set('careerDecision')(e.target.value)}
                placeholder={decisionPlaceholder} />
              <span className={styles.hint}>
                {form.careerDecision.length < 20
                  ? `${20 - form.careerDecision.length} more characters to unlock simulation`
                  : `✓ ${form.careerDecision.length} characters`}
              </span>
            </div>

            {/* Context pill showing what we're comparing against */}
            <div className={styles.contextPill}>
              📌 Comparing from:&nbsp;
              <strong>
                {form.employmentStatus === 'unemployed' ? `Currently unemployed (last job: ${form.currentJob || 'unknown'})` :
                 form.employmentStatus === 'retired'    ? `Retired from ${form.currentJob || 'service'}` :
                 form.employmentStatus === 'student'    ? 'Student / no current income' :
                 form.employmentStatus === 'homemaker'  ? 'Homemaker / non-earning' :
                 `${form.currentJob || 'Current role'}${form.currentCompany ? ' at ' + form.currentCompany : ''}`}
              </strong>
              {form.currentSalary && form.currentSalary !== '0'
                ? ` · ₹${form.currentSalary}/yr` : ' · ₹0 current income'}
            </div>

            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => setStep(3)}>← Back</button>
              <button className={`${styles.nextBtn} ${ready[4] ? styles.nextReady : ''}`}
                disabled={!ready[4]} onClick={() => setStep(5)}>
              Next: {detectDecisionMode(form.careerDecision) === 'career' ? 'Final Details' : 'Risk & Funding'} →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Final Details (smart: career vs capital mode) ── */}
        {step === 5 && (
          <div className={styles.stepContent}>

            {/* ── CAREER MODE: job / promotion / abroad / education ── */}
            {isCareerMode ? (
              <>
                <h2 className={styles.stepTitle}>Almost there — a few final details</h2>
                <p className={styles.stepSub}>
                  Since you're making a career move (not investing capital into a business), we just need your
                  financial cushion and priorities to complete the simulation.
                </p>

                {/* Info banner */}
                <div className={styles.statusBanner} style={{ borderColor: '#88ccff', background: 'rgba(136,204,255,0.06)', marginBottom: 24 }}>
                  <span>💡</span>
                  <div>
                    <strong>No funding needed for this decision</strong> — you're not starting a business or investing capital.
                    The simulation models income trajectories, career growth, and life quality for this type of move.
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>What matters most right now?</label>
                  <div className={styles.pillGroup} style={{ marginTop: 6 }}>
                    {RELATIONSHIP_OPTIONS.map(o => (
                      <button key={o.value} type="button"
                        className={`${styles.pill} ${form.relationshipPriority === o.value ? styles.pillActive : ''}`}
                        onClick={() => set('relationshipPriority')(o.value)}>{o.label}</button>
                    ))}
                  </div>
                </div>

                {/* Risk tolerance — still relevant for career moves */}
                <div className={styles.field}>
                  <label className={styles.label}>How much career risk are you comfortable with?</label>
                  <div className={styles.riskGrid}>
                    {RISK_LEVELS.map(r => (
                      <button key={r.value} type="button"
                        className={`${styles.riskCard} ${form.riskTolerance === r.value ? styles.riskCardActive : ''}`}
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
                      style={{ background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${riskPct}%, rgba(255,255,255,0.1) ${riskPct}%, rgba(255,255,255,0.1) 100%)` }} />
                    <span className={styles.riskValue}>{form.riskTolerance}/10</span>
                  </div>
                </div>

                {/* Simulation summary */}
                <div className={styles.capitalSummary}>
                  <div className={styles.capitalTitle}>🎯 What the engine will simulate</div>
                  <div className={styles.capitalGrid}>
                    <div className={styles.capitalRow}>
                      <span>Decision type</span>
                      <strong style={{ color: '#88ccff' }}>Career move — no capital deployment</strong>
                    </div>
                    <div className={styles.capitalRow}>
                      <span>Starting from</span>
                      <strong>{
                        form.employmentStatus === 'unemployed' ? '🔍 Currently unemployed'
                        : form.employmentStatus === 'retired'  ? '🌅 Retired'
                        : form.employmentStatus === 'student'  ? '🎓 Student / no income'
                        : form.employmentStatus === 'homemaker'? '🏠 Homemaker'
                        : `${form.currentJob || 'Current role'}${form.currentCompany ? ' @ '+form.currentCompany : ''}`
                      }</strong>
                    </div>
                    <div className={styles.capitalRow}>
                      <span>Income baseline</span>
                      <strong style={{ color: currentSalaryNum === 0 ? 'var(--muted)' : 'inherit' }}>
                        {currentSalaryNum > 0 ? fmtL(currentSalaryNum) + '/yr' : '₹0 — starting from zero'}
                      </strong>
                    </div>
                    {savingsAmt > 0 ? null : null}

                    <div className={styles.capitalRowTotal}>
                      <span>Risk preference</span>
                      <strong>{form.riskTolerance}/10 — {
                        form.riskTolerance <= 3 ? 'very conservative' :
                        form.riskTolerance <= 5 ? 'cautious' :
                        form.riskTolerance <= 7 ? 'moderate' : 'aggressive'
                      }</strong>
                    </div>
                  </div>
                </div>
              </>

            ) : (

              /* ── CAPITAL MODE: startup / business / investment ── */
              <>
                <h2 className={styles.stepTitle}>Money, risk & final details</h2>
                <p className={styles.stepSub}>
                  These numbers change the simulation significantly. Loan amount and investor funding are modelled as real financial burden.
                </p>

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
                    <div className={styles.pillGroup} style={{ marginTop: 6 }}>
                      {RELATIONSHIP_OPTIONS.map(o => (
                        <button key={o.value} type="button"
                          className={`${styles.pill} ${form.relationshipPriority === o.value ? styles.pillActive : ''}`}
                          onClick={() => set('relationshipPriority')(o.value)}>{o.label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Savings deployment */}
                <div className={styles.field}>
                  <label className={styles.label}>How much of your savings will you put into this?</label>
                  <div className={styles.savingsSliderRow}>
                    <span className={styles.savingsPct}>{pct}%</span>
                    <input type="range" min={0} max={100} value={pct}
                      onChange={e => set('savingsUsagePct')(Number(e.target.value))}
                      className={styles.savingsSlider}
                      style={{ background: `linear-gradient(to right, var(--gold) ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }} />
                    <span className={styles.savingsLabel}>100%</span>
                  </div>
                  {savingsAmt > 0 && (
                    <div className={styles.savingsBreakdown}>
                      <div className={styles.savingsCol}>
                        <span>Deploying</span>
                        <strong style={{ color: 'var(--gold)' }}>{fmtL(deployedAmt)}</strong>
                      </div>
                      <div className={styles.savingsCol}>
                        <span>Buffer left</span>
                        <strong style={{ color: remainingAmt < 100000 ? 'var(--risk)' : 'var(--opt)' }}>{fmtL(remainingAmt)}</strong>
                      </div>
                      <div className={styles.savingsCol}>
                        <span>Runway</span>
                        <strong style={{ color: savingsRunway < 3 ? 'var(--risk)' : savingsRunway < 6 ? 'var(--gold)' : 'var(--opt)' }}>
                          {savingsRunway > 0 ? savingsRunway.toFixed(1) + ' mo' : (currentSalaryNum === 0 ? 'No income ref' : '—')}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Funding sources */}
                <div className={styles.field}>
                  <label className={styles.label}>Additional funding sources</label>
                  <div className={styles.fundingGrid}>
                    {FUNDING_TYPES.map(f => (
                      <button key={f.value} type="button"
                        className={`${styles.fundingCard} ${form.fundingType === f.value ? styles.fundingActive : ''}`}
                        onClick={() => set('fundingType')(f.value)}>
                        <span className={styles.fundingEmoji}>{f.emoji}</span>
                        <span className={styles.fundingLabel}>{f.label}</span>
                        <span className={styles.fundingDesc}>{f.desc}</span>
                      </button>
                    ))}
                  </div>

                  {form.fundingType === 'loan' && (
                    <div className={styles.fundingAmountBlock}>
                      <div className={styles.fundingAmountRow}>
                        <div className={styles.field} style={{ margin: 0, flex: 1 }}>
                          <label className={styles.label}>Loan Amount (₹)</label>
                          <input className={styles.input} value={form.loanAmount}
                            onChange={e => set('loanAmount')(e.target.value)}
                            placeholder="e.g. 10L" />
                        </div>
                        {parseFundingAmt(form.loanAmount) > 0 && (() => {
                          const amt = parseFundingAmt(form.loanAmount)
                          const emi = Math.round(amt * 0.012)
                          return (
                            <div className={styles.loanCalc}>
                              <div className={styles.loanCalcRow}><span>Monthly EMI</span><strong style={{ color: 'var(--risk)' }}>{fmtL(emi)}/mo</strong></div>
                              <div className={styles.loanCalcRow}><span>Annual burden</span><strong style={{ color: 'var(--risk)' }}>{fmtL(emi*12)}/yr</strong></div>
                              <div className={styles.loanCalcRow}><span>Total capital</span><strong style={{ color: 'var(--gold)' }}>{fmtL(deployedAmt + amt)}</strong></div>
                            </div>
                          )
                        })()}
                      </div>
                      <div className={styles.fundingWarning}>
                        ⚠️ EMI runs even when income drops. The risky path will model cash crunch when revenue dips AND you owe EMI.
                      </div>
                    </div>
                  )}

                  {form.fundingType === 'investor' && (
                    <div className={styles.fundingAmountBlock}>
                      <div className={styles.field} style={{ margin: 0 }}>
                        <label className={styles.label}>External Funding Amount (₹)</label>
                        <input className={styles.input} value={form.externalAmount}
                          onChange={e => set('externalAmount')(e.target.value)}
                          placeholder="e.g. 25L or seed round amount" />
                        <span className={styles.hint}>Angel, family money, VC seed — reduces your personal risk exposure</span>
                      </div>
                      {parseFundingAmt(form.externalAmount) > 0 && (
                        <div className={styles.savingsBreakdown} style={{ marginTop: 10 }}>
                          <div className={styles.savingsCol}><span>Your savings</span><strong>{fmtL(deployedAmt)}</strong></div>
                          <div className={styles.savingsCol}><span>External</span><strong style={{ color: 'var(--opt)' }}>{fmtL(parseFundingAmt(form.externalAmount))}</strong></div>
                          <div className={styles.savingsCol}><span>Total capital</span><strong style={{ color: 'var(--gold)' }}>{fmtL(deployedAmt + parseFundingAmt(form.externalAmount))}</strong></div>
                        </div>
                      )}
                    </div>
                  )}

                  {form.fundingType === 'parttime' && (
                    <div className={styles.fundingNote}>
                      💡 Keeping income (spouse job, freelance, part-time) significantly reduces catastrophic risk — the risky path will be less severe. Growth may be slower.
                    </div>
                  )}
                </div>

                {/* Risk */}
                <div className={styles.field}>
                  <label className={styles.label}>Your personal risk tolerance</label>
                  <div className={styles.riskGrid}>
                    {RISK_LEVELS.map(r => (
                      <button key={r.value} type="button"
                        className={`${styles.riskCard} ${form.riskTolerance === r.value ? styles.riskCardActive : ''}`}
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
                      style={{ background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${riskPct}%, rgba(255,255,255,0.1) ${riskPct}%, rgba(255,255,255,0.1) 100%)` }} />
                    <span className={styles.riskValue}>{form.riskTolerance}/10</span>
                  </div>
                </div>

                {/* Capital summary */}
                <div className={styles.capitalSummary}>
                  <div className={styles.capitalTitle}>💼 What the engine will simulate</div>
                  <div className={styles.capitalGrid}>
                    <div className={styles.capitalRow}>
                      <span>Starting from</span>
                      <strong>{
                        form.employmentStatus === 'unemployed' ? '🔍 Currently unemployed'
                        : form.employmentStatus === 'retired'  ? '🌅 Retired'
                        : form.employmentStatus === 'student'  ? '🎓 Student / no income'
                        : form.employmentStatus === 'homemaker'? '🏠 Homemaker'
                        : `${form.currentJob || 'Current role'}${form.currentCompany ? ' @ '+form.currentCompany : ''}`
                      }</strong>
                    </div>
                    <div className={styles.capitalRow}>
                      <span>Current income baseline</span>
                      <strong style={{ color: currentSalaryNum === 0 ? 'var(--muted)' : 'inherit' }}>
                        {currentSalaryNum > 0 ? fmtL(currentSalaryNum) + '/yr' : '₹0 — starting from zero'}
                      </strong>
                    </div>
                    <div className={styles.capitalRow}>
                      <span>Savings deployed</span>
                      <strong style={{ color: 'var(--gold)' }}>{fmtL(deployedAmt)}</strong>
                    </div>
                    {form.fundingType === 'loan' && parseFundingAmt(form.loanAmount) > 0 && (
                      <div className={styles.capitalRow}>
                        <span>Loan amount</span>
                        <strong style={{ color: 'var(--risk)' }}>+ {fmtL(parseFundingAmt(form.loanAmount))} (EMI burden)</strong>
                      </div>
                    )}
                    {form.fundingType === 'investor' && parseFundingAmt(form.externalAmount) > 0 && (
                      <div className={styles.capitalRow}>
                        <span>External funding</span>
                        <strong style={{ color: 'var(--opt)' }}>+ {fmtL(parseFundingAmt(form.externalAmount))}</strong>
                      </div>
                    )}
                    <div className={styles.capitalRowTotal}>
                      <span>Safety buffer</span>
                      <strong style={{ color: remainingAmt < 100000 ? 'var(--risk)' : 'var(--opt)' }}>
                        {fmtL(remainingAmt)} untouched
                        {savingsRunway > 0 && ` · ${savingsRunway.toFixed(1)}mo runway`}
                      </strong>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => setStep(4)}>← Back</button>
              <button className={`${styles.submitBtn} ${ready[5] ? styles.submitReady : ''}`}
                disabled={!ready[5]} onClick={() => onGenerate({ 
                  ...form, 
                  savingsUsagePct: isCareerMode ? 0 : form.savingsUsagePct,
                  savings: isCareerMode ? '0' : form.savings,
                })}>
                Simulate My 3 Futures →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
