import { useState } from 'react'
import { CITIES } from '../constants'
import * as api from '../lib/api'
import styles from './InputPage.module.css'

const EMPLOYMENT_STATUS = [
  { value: 'employed',   emoji: '💼', label: 'Employed',      desc: 'Currently working full-time' },
  { value: 'self',       emoji: '🏢', label: 'Self-employed', desc: 'Running own business already' },
  { value: 'unemployed', emoji: '🔍', label: 'Unemployed',    desc: 'Between jobs / laid off' },
  { value: 'retired',    emoji: '🌅', label: 'Retired',       desc: 'Retired from service' },
  { value: 'student',    emoji: '🎓', label: 'Student',       desc: 'Currently studying' },
  { value: 'homemaker',  emoji: '🏠', label: 'Homemaker',     desc: 'Managing home' },
  { value: 'parttime',   emoji: '🕐', label: 'Part-time',     desc: 'Working part-time / freelance' },
]

const STATUS_CONFIG = {
  employed:   { showJob: true,  showSalary: true,  showExp: true,  salaryLabel: 'Annual CTC / Take-home' },
  self:       { showJob: true,  showSalary: true,  showExp: true,  salaryLabel: 'Annual income from business' },
  unemployed: { showJob: true,  showSalary: true,  showExp: true,  salaryLabel: 'Last drawn annual salary' },
  retired:    { showJob: true,  showSalary: true,  showExp: true,  salaryLabel: 'Pension / annual income' },
  student:    { showJob: false, showSalary: false, showExp: false, salaryLabel: '' },
  homemaker:  { showJob: false, showSalary: true,  showExp: false, salaryLabel: 'Household income' },
  parttime:   { showJob: true,  showSalary: true,  showExp: true,  salaryLabel: 'Annual income (part-time)' },
}

const POPULAR_SKILLS = [
  'Python','JavaScript','React','SQL','Machine Learning','Sales','Marketing',
  'SEO','Content Writing','Graphic Design','UI/UX','Finance','Accounting','CA',
  'Management','Leadership','Operations','Project Management','Teaching','Coaching',
  'Cooking','Hospitality','Real Estate','Construction','Communication','Public Speaking',
  'Mechanical','Electrical','Manufacturing','Photography','Video Editing','Legal','HR',
]

const STEPS = [
  { id: 1, label: 'About You',    icon: '👤' },
  { id: 2, label: 'Current Life', icon: '📊' },
  { id: 3, label: 'Your Skills',  icon: '🛠️'  },
]

function SkillsInput({ form, set }) {
  const [addedSkills, setAddedSkills] = useState(
    form.skills ? form.skills.split(', ').filter(Boolean) : []
  )
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

  return (
    <div>
      {addedSkills.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:14 }}>
          {addedSkills.map(s => (
            <div key={s} style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'5px 10px 5px 12px', borderRadius:6,
              background:'var(--gold-dim)', border:'1px solid var(--gold)',
              fontFamily:'var(--fm)', fontSize:11, color:'var(--gold)',
            }}>
              {s}
              <button onClick={() => removeSkill(s)} style={{
                background:'none', border:'none', color:'var(--gold)',
                cursor:'pointer', fontSize:12, padding:0,
              }}>✕</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <input
          style={{
            flex:1, padding:'10px 14px', background:'var(--surface2)',
            border:'1px solid var(--border)', borderRadius:10, color:'var(--text)',
            fontFamily:'var(--fm)', fontSize:13, outline:'none',
          }}
          value={skillInput}
          onChange={e => setSkillInput(e.target.value)}
          onKeyDown={e => { if (e.key==='Enter'){e.preventDefault(); addSkill(skillInput)} }}
          placeholder="Type a skill and press Enter..." />
        <button onClick={() => addSkill(skillInput)} type="button" style={{
          padding:'10px 18px', borderRadius:10, cursor:'pointer',
          background:'var(--gold-dim)', border:'1px solid var(--gold)',
          color:'var(--gold)', fontFamily:'var(--fd)', fontSize:12, fontWeight:700,
        }}>+ Add</button>
      </div>
      <div style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--muted)', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:8 }}>
        Quick add:
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {POPULAR_SKILLS.filter(s => !addedSkills.includes(s)).slice(0,24).map(s => (
          <button key={s} type="button" onClick={() => addSkill(s)} style={{
            padding:'5px 11px', borderRadius:5, cursor:'pointer',
            border:'1px solid var(--border)', background:'transparent',
            color:'var(--muted)', fontFamily:'var(--fm)', fontSize:11,
          }}>+ {s}</button>
        ))}
      </div>
    </div>
  )
}

export default function ProfileSetupPage({ user, onComplete, initialData = null, onBack = null }) {
  const isEditing = !!initialData
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialData || {
    name:'', age:'', city:'Bangalore', employmentStatus:'',
    currentJob:'', currentCompany:'', currentSalary:'0',
    yearsOfExperience:'0', currentSituation:'', skills:'', resumeText:'',
  })
  const [customCity, setCustomCity] = useState('')
  const [usingCustomCity, setUsingCustomCity] = useState(false)
  const [showAllCities, setShowAllCities] = useState(false)
  const [saving, setSaving] = useState(false)

  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const sc = STATUS_CONFIG[form.employmentStatus] || {}
  const displayedCities = showAllCities ? CITIES : CITIES.slice(0, 10)

  const ready = {
    1: form.name.trim() && form.age && form.city && form.employmentStatus,
    2: true,
    3: true,
  }

  async function handleFinish() {
    setSaving(true)
    await api.saveProfile(form)
    await new Promise(r => setTimeout(r, 400))
    setSaving(false)
    onComplete(form)
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>LifePath AI</div>
        <div className={styles.sidebarSub}>{isEditing ? 'Edit Profile' : 'Profile Setup'}</div>
        <nav className={styles.stepNav}>
          {STEPS.map(s => (
            <div key={s.id}
              className={`${styles.stepItem} ${step===s.id ? styles.stepActive:''} ${step>s.id ? styles.stepDone:''}`}
              onClick={() => step > s.id && setStep(s.id)}>
              <div className={styles.stepBubble}>{step > s.id ? '✓' : s.id}</div>
              <div className={styles.stepMeta}>
                <span className={styles.stepIcon}>{s.icon}</span>
                <span className={styles.stepLabel}>{s.label}</span>
              </div>
            </div>
          ))}
        </nav>
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarCardTitle}>🧠 Why we ask this</div>
          <p className={styles.sidebarCardText}>
            Your profile is saved once. Every future simulation you run will use this as the base — no need to re-enter it each time.
          </p>
        </div>
        {isEditing && onBack && (
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <button onClick={onBack} style={{
              width: '100%', padding: '10px', borderRadius: 8,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--muted)', fontFamily: 'var(--fm)', fontSize: 11,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--border-hover)'; e.target.style.color = 'var(--text-secondary)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)' }}>
              ← Back to Home
            </button>
          </div>
        )}
      </aside>

      {/* Form */}
      <main className={styles.form}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(step/3)*100}%` }} />
        </div>
        <div className={styles.progressLabel}>
          {isEditing ? 'Editing' : 'Setting up'} profile — Step {step} of 3 — {STEPS[step-1].label}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>{isEditing ? 'Update your details' : "Let's start with you"}</h2>
            <p className={styles.stepSub}>This is saved to your profile and used in every simulation.</p>

            <div className={styles.field}>
              <label className={styles.label}>Your Name <span className={styles.req}>*</span></label>
              <input className={styles.input} value={form.name} autoFocus
                onChange={e => set('name')(e.target.value)} placeholder="What should we call you?" />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Age <span className={styles.req}>*</span></label>
                <input className={styles.input} type="number" value={form.age}
                  onChange={e => set('age')(e.target.value)} placeholder="e.g. 27" min="16" max="80" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>City <span className={styles.req}>*</span></label>
                <div className={styles.pillGroup}>
                  {displayedCities.map(c => (
                    <button key={c} type="button"
                      className={`${styles.pill} ${!usingCustomCity && form.city===c ? styles.pillActive:''}`}
                      onClick={() => { setUsingCustomCity(false); setCustomCity(''); set('city')(c) }}>{c}</button>
                  ))}
                  <button type="button" className={styles.pillMore}
                    onClick={() => setShowAllCities(v => !v)}>
                    {showAllCities ? '↑ Less' : `+${CITIES.length-10} more`}
                  </button>
                </div>
                <div className={styles.customCityWrap}>
                  <input className={`${styles.input} ${usingCustomCity && customCity ? styles.inputActive:''}`}
                    value={customCity}
                    onChange={e => { setCustomCity(e.target.value); setUsingCustomCity(true); set('city')(e.target.value.trim() || 'Bangalore') }}
                    placeholder="Or type city — Dubai, London..." />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Current situation <span className={styles.req}>*</span></label>
              <div className={styles.statusGrid}>
                {EMPLOYMENT_STATUS.map(s => (
                  <button key={s.value} type="button"
                    className={`${styles.statusCard} ${form.employmentStatus===s.value ? styles.statusActive:''}`}
                    onClick={() => {
                      set('employmentStatus')(s.value)
                      if (['student','retired','unemployed','homemaker'].includes(s.value)) set('currentSalary')('0')
                    }}>
                    <span className={styles.statusEmoji}>{s.emoji}</span>
                    <span className={styles.statusLabel}>{s.label}</span>
                    <span className={styles.statusDesc}>{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className={`${styles.nextBtn} ${ready[1] ? styles.nextReady:''}`}
              disabled={!ready[1]} onClick={() => setStep(2)}>
              Next: Current Life →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>{form.name ? `${form.name}, your` : 'Your'} current life</h2>
            <p className={styles.stepSub}>This is your baseline — every simulated future is compared against it.</p>

            {sc.showJob && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    {form.employmentStatus==='unemployed' ? 'Last Job Title' :
                     form.employmentStatus==='retired'    ? 'Last / Previous Role' :
                     form.employmentStatus==='self'       ? 'Your Business / Role' : 'Current Job Title'}
                  </label>
                  <input className={styles.input} value={form.currentJob} autoFocus
                    onChange={e => set('currentJob')(e.target.value)}
                    placeholder="e.g. Software Engineer, CA, Teacher..." />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Company / Organisation</label>
                  <input className={styles.input} value={form.currentCompany}
                    onChange={e => set('currentCompany')(e.target.value)}
                    placeholder="e.g. Infosys, SBI..." />
                </div>
              </div>
            )}

            {sc.showSalary && (
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>{sc.salaryLabel}</label>
                  <input className={styles.input} value={form.currentSalary}
                    onChange={e => set('currentSalary')(e.target.value)}
                    placeholder="e.g. 12L or 12,00,000" />
                </div>
                {sc.showExp && (
                  <div className={styles.field}>
                    <label className={styles.label}>Years of Experience</label>
                    <input className={styles.input} type="number" value={form.yearsOfExperience}
                      onChange={e => set('yearsOfExperience')(e.target.value)}
                      placeholder="e.g. 4" min="0" max="50" />
                  </div>
                )}
              </div>
            )}

            {form.employmentStatus === 'student' && (
              <div className={styles.field}>
                <label className={styles.label}>Current field / degree</label>
                <input className={styles.input} value={form.currentJob} autoFocus
                  onChange={e => set('currentJob')(e.target.value)}
                  placeholder="e.g. Final year BTech CS, MBA at IIM-B..." />
              </div>
            )}

            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
              <button className={`${styles.nextBtn} ${styles.nextReady}`}
                onClick={() => setStep(3)}>
                Next: Your Skills →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Your skills & background</h2>
            <p className={styles.stepSub}>
              These are saved to your profile. Every simulation will use them to calculate skill fit.
              <strong> Optional but highly recommended.</strong>
            </p>

            <SkillsInput form={form} set={set} />

            <div className={styles.field} style={{ marginTop: 20 }}>
              <label className={styles.label}>Or paste resume / LinkedIn summary</label>
              <textarea className={styles.textarea} rows={5}
                value={form.resumeText || ''}
                onChange={e => set('resumeText')(e.target.value)}
                placeholder="Paste your resume or LinkedIn summary here. The engine will extract skills and experience automatically..." />
            </div>

            <div className={styles.btnRow}>
              <button className={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
              <button className={styles.skipBtn} onClick={handleFinish}>
                {isEditing ? 'Save Changes' : 'Skip & Finish'} →
              </button>
              <button className={`${styles.nextBtn} ${styles.nextReady}`}
                disabled={saving} onClick={handleFinish}>
                {saving ? 'Saving...' : isEditing ? '✓ Save Profile' : 'Save & Continue →'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
