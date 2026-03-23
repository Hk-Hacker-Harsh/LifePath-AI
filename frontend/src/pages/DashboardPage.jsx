import { useState } from 'react'
import ScenarioCard  from '../components/ScenarioCard'
import AIAdvisor     from '../components/AIAdvisor'
import TimelineTable from '../components/TimelineTable'
import Charts        from '../components/Charts'
import { SCENARIO_CONFIG } from '../constants'
import styles from './DashboardPage.module.css'

const fmtL = v => {
  if (!v && v !== 0) return '₹0'
  const n = Math.abs(v)
  const sign = v < 0 ? '-' : ''
  if (n >= 10000000) return `${sign}₹${(n/10000000).toFixed(1)}Cr`
  if (n >= 100000)   return `${sign}₹${(n/100000).toFixed(1)}L`
  return `${sign}₹${n.toLocaleString('en-IN')}`
}

const TABS = [
  { id: 'overview', label: '📊 Overview'          },
  { id: 'market',   label: '🌐 Market Intel'      },
  { id: 'skills',   label: '🛠️ Skill Fit'         },
  { id: 'life',     label: '✨ Life Quality'       },
  { id: 'compare',  label: '⚖️ Before vs After'   },
  { id: 'table',    label: '📋 Full Data'          },
]

export default function DashboardPage({ result, form, comparison, onReset }) {
  const [active, setActive]       = useState('realistic')
  const [tab,    setTab]          = useState('overview')
  const [advisorOpen, setAdvisorOpen] = useState(false)

  const q = result.qualityScore || 0
  const qPct = Math.round(q * 100)
  const qLabel = q > 0.5 ? 'Strong Move' : q > 0.2 ? 'Decent Bet' : q > -0.1 ? 'Borderline' : q > -0.4 ? 'Risky Move' : 'Poor Timing'
  const qColor = q > 0.3 ? 'var(--opt)' : q > 0 ? '#88ccff' : q > -0.3 ? 'var(--gold)' : 'var(--risk)'

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>LifePath AI</div>
            <div className={styles.divider} />
            <div className={styles.headerMeta}>
              {form.name && <span className={styles.headerName}>{form.name}</span>}
              {form.name && <span className={styles.headerSep}>·</span>}
              <span className={styles.headerDecision} title={form.careerDecision}>
                {form.careerDecision.length > 60 ? form.careerDecision.slice(0,60)+'…' : form.careerDecision}
              </span>
              <span className={styles.headerCity}> · {form.city}</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.resetBtn} onClick={onReset}>← Back to Home</button>
            <button className={styles.newSimBtn} onClick={onReset}>+ New Simulation</button>
          </div>
        </div>
        <div className={styles.headerTabs}>
          {TABS.map(t => (
            <button key={t.id}
              className={`${styles.tabBtn} ${tab === t.id ? styles.tabBtnActive : ''}`}
              onClick={() => setTab(t.id)}>{t.label}
            </button>
          ))}
        </div>
      </header>

      <main className={styles.body}>

        {/* ── Decision Quality Banner ── */}
        {(() => {
          const motType  = result.motivationProfile?.type || 'mixed'
          const motLabel = result.motivationProfile?.label || ''
          const ci       = result.careerIntelligence
          const mhTrend  = ci?.salaryIntel?.marketHealth?.trend
          const runway   = form.savings
            ? (() => {
                const s = parseFloat(String(form.savings).replace(/[,₹\s]/g,'').replace(/l$/i,''))
                const total = s > 1000 ? s : s * 100000
                const sal = parseFloat(String(form.currentSalary||'0').replace(/[,₹\s]/g,'').replace(/l$/i,''))
                const salNum = sal > 1000 ? sal : sal * 100000
                const monthly = salNum / 12
                return monthly > 0 ? (total / monthly).toFixed(1) : null
              })()
            : null

          // Dynamic left labels based on motivation type
          const leftLabel = motType === 'aspiration' ? 'Pull-driven ✓'
            : motType === 'escape' ? 'Escape-driven ⚠'
            : 'Mixed motives'

          // Dynamic right label based on market trend
          const rightLabel = mhTrend === 'growing' || mhTrend === 'strong_growth' ? 'Market: Growing 📈'
            : mhTrend === 'declining' ? 'Market: Declining 📉'
            : mhTrend === 'stable_high' ? 'Market: Stable ✓'
            : 'Decision: Strong ✓'

          // Dynamic mid label based on runway
          const midLabel = runway
            ? `${runway}mo runway`
            : 'Neutral'

          // Key signal chips — pulled from actual data
          const chips = []
          if (motType === 'aspiration') chips.push({ text: 'Passion-driven', color: 'var(--opt)' })
          else if (motType === 'escape') chips.push({ text: 'Escape-driven', color: 'var(--gold)' })
          if (result.skillFit?.percentMatch >= 70) chips.push({ text: `Skill fit ${result.skillFit.percentMatch}%`, color: 'var(--opt)' })
          else if (result.skillFit?.percentMatch > 0) chips.push({ text: `Skill fit ${result.skillFit.percentMatch}%`, color: 'var(--gold)' })
          if (mhTrend === 'growing' || mhTrend === 'strong_growth') chips.push({ text: 'Market growing', color: 'var(--opt)' })
          else if (mhTrend === 'declining') chips.push({ text: 'Market declining', color: 'var(--risk)' })
          if (runway && parseFloat(runway) < 6) chips.push({ text: `Low runway (${runway}mo)`, color: 'var(--risk)' })
          else if (runway && parseFloat(runway) >= 12) chips.push({ text: `Good runway (${runway}mo)`, color: 'var(--opt)' })
          if (form.fundingType === 'loan') chips.push({ text: 'Loan risk', color: 'var(--risk)' })
          if (form.fundingType === 'parttime') chips.push({ text: 'Hedged ✓', color: 'var(--opt)' })

          return (
            <div className={styles.qualityBanner} style={{ borderColor: qColor }}>
              <div className={styles.qualityLeft}>
                <div className={styles.qualityScore} style={{ color: qColor }}>
                  {qPct > 0 ? '+' : ''}{qPct}
                </div>
                <div>
                  <div className={styles.qualityLabel} style={{ color: qColor }}>{qLabel}</div>
                  <div className={styles.qualitySubLabel}>Decision Quality Score</div>
                  {/* Signal chips */}
                  {chips.length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:8 }}>
                      {chips.slice(0,4).map((c,i) => (
                        <span key={i} style={{
                          fontFamily:'var(--fm)', fontSize:9, padding:'2px 7px',
                          borderRadius:4, border:`1px solid ${c.color}`,
                          color: c.color, background: `${c.color}15`,
                          letterSpacing:'0.5px', whiteSpace:'nowrap',
                        }}>{c.text}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.qualityMeter}>
                <div className={styles.qualityMeterTrack}>
                  <div className={styles.qualityMeterFill}
                    style={{
                      width: `${Math.abs(qPct) / 2}%`,
                      left: q >= 0 ? '50%' : `${50 - Math.abs(qPct) / 2}%`,
                      background: qColor, opacity: 0.85,
                    }} />
                  <div className={styles.qualityMeterMid} />
                </div>
                <div className={styles.qualityMeterLabels}>
                  <span style={{ color: motType === 'escape' ? 'var(--gold)' : 'var(--muted)' }}>{leftLabel}</span>
                  <span style={{ color: 'var(--muted)' }}>{midLabel}</span>
                  <span style={{ color: mhTrend === 'growing' ? 'var(--opt)' : mhTrend === 'declining' ? 'var(--risk)' : 'var(--muted)' }}>{rightLabel}</span>
                </div>
              </div>
              <div className={styles.qualityRec}>{result.recommendation}</div>
            </div>
          )
        })()}

        {/* ── Scenario Cards ── */}
        <div className={styles.cardsGrid}>
          {['optimistic','realistic','risky'].map(s => (
            <ScenarioCard key={s} scenario={s}
              data={result.timelines[s]} summary={result.summary[s]}
              active={active === s} onClick={() => setActive(s)}
              result={result} />
          ))}
        </div>

        {/* ── TAB: Overview ── */}
        {tab === 'overview' && (
          <section className={styles.section}>

            {/* One clean DB-sourced insight paragraph */}
            {(() => {
              const ci = result.careerIntelligence
              const mh = ci?.salaryIntel?.marketHealth
              const traj = ci?.trajectory
              const trend = ci?.salaryIntel?.trend
              const realY5 = result.timelines.realistic[4]
              const optY5  = result.timelines.optimistic[4]
              const riskY5 = result.timelines.risky[4]

              const parts = []
              if (mh?.note) parts.push(mh.note)
              if (traj?.currentTitle && traj?.nextTitle)
                parts.push(`You're currently at ${traj.currentTitle} level — the next milestone is ${traj.nextTitle} (market range ${fmtL(traj.nextRange?.min)}–${fmtL(traj.nextRange?.max)}/yr).`)
              if (ci?.opportunityFactors?.[0])
                parts.push(ci.opportunityFactors[0])

              return parts.length > 0 ? (
                <div className={styles.intelParagraph}>
                  <span className={styles.intelTag}>📡 Market Intelligence</span>
                  <p>{parts.join(' ')}</p>
                </div>
              ) : null
            })()}

            {/* Quick stat row — all 3 scenarios at a glance */}
            <div className={styles.quickStats}>
              {['optimistic','realistic','risky'].map(s => {
                const tl = result.timelines[s]
                const cfg = SCENARIO_CONFIG[s]
                return (
                  <div key={s} className={`${styles.quickStat} ${active === s ? styles.quickStatActive : ''}`}
                    style={{ '--sc': cfg.color }} onClick={() => setActive(s)}>
                    <div className={styles.qsIcon}>{cfg.icon}</div>
                    <div className={styles.qsIncome} style={{ color: cfg.color }}>{fmtL(tl[4].income)}/yr</div>
                    <div className={styles.qsLabel}>{cfg.label.replace(' Future','')}</div>
                    <div className={styles.qsMeta}>
                      Life {tl[4].lifeScore}/10 · Stress {tl[4].stress}/10
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Charts front and centre */}
            <Charts
              timelines={result.timelines}
              activeScenario={active}
              comparison={comparison}
              careerIntel={result.careerIntelligence}
            />

            {/* Insights — collapsed by default, expandable */}
            {result.keyInsights?.length > 0 && (
              <details className={styles.insightsDetails}>
                <summary className={styles.insightsSummary}>
                  💡 Key Insights ({result.keyInsights.length})
                </summary>
                <div className={styles.insightsGrid}>
                  {result.keyInsights.map((ins, i) => (
                    <div key={i} className={styles.insightCard}>
                      <div className={styles.insightNum}>Insight {String(i+1).padStart(2,'0')}</div>
                      <p className={styles.insightText}>{ins}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* Year by year for selected */}
            <div className={styles.sectionTitle} style={{ marginTop: 32 }}>
              {SCENARIO_CONFIG[active].icon} {SCENARIO_CONFIG[active].label} — Year by Year
            </div>
            <TimelineTable data={result.timelines[active]} scenario={active} />
          </section>
        )}

        {/* ── TAB: Before vs After ── */}
        {tab === 'compare' && comparison && (
          <section className={styles.section}>
            <div className={styles.sectionTitle}>⚖️ If You Stay vs If You Make This Move</div>
            <p className={styles.sectionSub}>
              Your baseline: <strong>{form.currentJob || 'Current role'}{form.currentCompany ? ` at ${form.currentCompany}` : ''}</strong> at <strong>{form.currentSalary}/yr</strong>, projected with ~10% annual hikes.
              Each simulated future is compared directly against this.
            </p>

            {/* Stay baseline */}
            <div className={styles.baselineCard}>
              <div className={styles.baselineHeader}>
                <span className={styles.baselineIcon}>🏢</span>
                <div>
                  <div className={styles.baselineTitle}>If You Stay — 5-Year Projection</div>
                  <div className={styles.baselineSub}>
                    {form.currentJob}{form.currentCompany ? ` at ${form.currentCompany}` : ''} · ~10% YoY increment
                  </div>
                </div>
                <div className={styles.baselineY5}>
                  <span className={styles.baselineY5Val}>{fmtL(comparison.baseline[4].income)}</span>
                  <span className={styles.baselineY5Label}>by {new Date().getFullYear() + 4} · {fmtL(comparison.baseline[4].savings)} saved</span>
                </div>
              </div>
              <div className={styles.baselineYears}>
                {comparison.baseline.map(y => (
                  <div key={y.year} className={styles.baselineYear}>
                    <div className={styles.byYearLabel}>{y.year}</div>
                    <div className={styles.byIncome}>{fmtL(y.income)}</div>
                    <div className={styles.byEvent}>{y.event}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS cards */}
            <div className={styles.vsHeading}>How each simulated future compares to staying</div>
            <div className={styles.vsGrid}>
              {comparison.scenarios.map(sc => {
                const cfg = SCENARIO_CONFIG[sc.type]
                const incomeWins = sc.incomeDelta >= 0
                const savingsWins = sc.savingsDelta >= 0
                const isBad = !incomeWins && Math.abs(sc.incomeDelta) > 200000
                return (
                  <div key={sc.type}
                    className={`${styles.vsCard} ${active === sc.type ? styles.vsCardActive : ''} ${isBad ? styles.vsCardBad : ''}`}
                    style={{ '--scenario-color': cfg.color }}
                    onClick={() => setActive(sc.type)}>
                    <div className={styles.vsCardHeader} style={{ color: cfg.color }}>
                      {cfg.icon} {cfg.label} Path
                    </div>

                    <div className={styles.vsIncome}>{fmtL(sc.yFinalIncome)}</div>
                    <div className={styles.vsIncomeLabel}>by 2029</div>

                    <div className={styles.vsDivider} />

                    <div className={styles.vsRow}>
                      <span className={styles.vsRowLabel}>vs staying</span>
                      <span className={`${styles.vsRowVal} ${incomeWins ? styles.positive : styles.negative}`}>
                        {incomeWins ? '▲' : '▼'} {incomeWins ? fmtL(sc.incomeDelta) + ' more' : fmtL(Math.abs(sc.incomeDelta)) + ' LESS'}
                      </span>
                    </div>
                    <div className={styles.vsRow}>
                      <span className={styles.vsRowLabel}>savings</span>
                      <span className={`${styles.vsRowVal} ${savingsWins ? styles.positive : styles.negative}`}>
                        {savingsWins ? '▲' : '▼'} {fmtL(Math.abs(sc.savingsDelta))} {savingsWins ? 'more' : 'less'}
                      </span>
                    </div>
                    <div className={styles.vsRow}>
                      <span className={styles.vsRowLabel}>stress</span>
                      <span className={styles.vsRowVal}>{sc.stressVerdict}</span>
                    </div>

                    <div className={`${styles.vsVerdict} ${isBad ? styles.vsVerdictBad : ''}`}>
                      {sc.worthIt}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Year-by-year side-by-side for selected scenario */}
            <div className={styles.sectionTitle} style={{ marginTop: 40 }}>
              {SCENARIO_CONFIG[active].icon} {SCENARIO_CONFIG[active].label} vs Staying — Year by Year
            </div>
            <p className={styles.sectionSub}>
              Green = ahead of staying. Red = behind staying.
              {form.fundingType === 'loan' && ' 🏦 Loan EMI burden modelled in risky path.'}
            </p>
            <div className={styles.compareTableWrap}>
              <table className={styles.compareTable}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>🏢 If You Stay</th>
                    <th style={{ color: SCENARIO_CONFIG[active].color }}>
                      {SCENARIO_CONFIG[active].icon} {SCENARIO_CONFIG[active].label}
                    </th>
                    <th>Difference</th>
                    <th>What Happens</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.baseline.map((b, i) => {
                    const after = result.timelines[active][i]
                    const diff  = after.income - b.income
                    const isAhead = diff >= 0
                    return (
                      <tr key={b.year} className={!isAhead ? styles.rowBehind : ''}>
                        <td className={styles.tdYear}>{b.year}</td>
                        <td className={styles.tdStay}>{fmtL(b.income)}</td>
                        <td className={styles.tdAfter} style={{ color: SCENARIO_CONFIG[active].color }}>
                          {fmtL(after.income)}
                        </td>
                        <td className={`${styles.tdDiff} ${isAhead ? styles.positive : styles.negative}`}>
                          {isAhead ? '+' : ''}{fmtL(diff)}
                        </td>
                        <td className={styles.tdEvent}>{after.event}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Funding summary */}
            {(form.savingsUsagePct || form.fundingType) && (
              <div className={styles.fundingSummary}>
                <div className={styles.fundingItem}>
                  <span>Funding type</span>
                  <strong>{{
                    savings: '💰 Own savings',
                    loan: '🏦 Bank/personal loan',
                    parttime: '⚡ Part-time hedged',
                    investor: '🤝 External investor'
                  }[form.fundingType] || form.fundingType}</strong>
                </div>
                <div className={styles.fundingItem}>
                  <span>Savings deployed</span>
                  <strong>{form.savingsUsagePct}% of total savings</strong>
                </div>
                <div className={styles.fundingItem}>
                  <span>Buffer remaining</span>
                  <strong>{(() => {
                    const s = parseFloat(String(form.savings||'0').replace(/[,₹\s]/g,'').replace(/l$/i,''))
                    const total = s > 1000 ? s : s * 100000
                    const dep = total * (form.savingsUsagePct/100)
                    const rem = total - dep
                    return rem >= 100000 ? `₹${(rem/100000).toFixed(1)}L` : `₹${Math.round(rem).toLocaleString()}`
                  })()}</strong>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── TAB: Skill Fit ── */}
        {tab === 'skills' && (
          <section className={styles.section}>
            {result.skillFit && result.skillFit.percentMatch > 10 ? (
              <>
                <div className={styles.sectionTitle}>🛠️ Skill Fit Assessment</div>
                <p className={styles.sectionSub}>
                  How well your background matches what this move actually requires.
                  Based on your skills vs what <strong>{result.businessType || 'this type of decision'}</strong> typically demands.
                </p>

                {/* Big fit score */}
                <div className={styles.skillFitHero}>
                  <div className={styles.sfScore} style={{
                    color: result.skillFit.score >= 0.7 ? 'var(--opt)'
                      : result.skillFit.score >= 0.4 ? 'var(--gold)' : 'var(--risk)'
                  }}>
                    {result.skillFit.percentMatch}%
                  </div>
                  <div className={styles.sfInfo}>
                    <div className={styles.sfLabel} style={{
                      color: result.skillFit.score >= 0.7 ? 'var(--opt)'
                        : result.skillFit.score >= 0.4 ? 'var(--gold)' : 'var(--risk)'
                    }}>{result.skillFit.label}</div>
                    <div className={styles.sfVerdict}>{result.skillFit.verdict}</div>
                  </div>
                  <div className={styles.sfMeterWrap}>
                    <div className={styles.sfMeter}>
                      <div style={{
                        width: `${result.skillFit.percentMatch}%`, height: '100%',
                        background: result.skillFit.score >= 0.7 ? 'var(--opt)'
                          : result.skillFit.score >= 0.4 ? 'var(--gold)' : 'var(--risk)',
                        borderRadius: 3, transition: 'width 0.5s ease',
                      }} />
                    </div>
                    <div className={styles.sfMeterLabels}><span>0%</span><span>50%</span><span>100%</span></div>
                  </div>
                </div>

                {/* Strengths */}
                {result.skillFit.strengths.length > 0 && (
                  <div className={styles.sfSection}>
                    <div className={styles.sfSectionTitle}>✅ Skills that work for you</div>
                    <div className={styles.sfCards}>
                      {result.skillFit.strengths.map((s, i) => (
                        <div key={i} className={styles.sfCard} style={{ borderColor: 'rgba(72,199,142,0.3)', background: 'rgba(72,199,142,0.05)' }}>
                          <div className={styles.sfCardLabel}>{s.label}</div>
                          <div className={styles.sfCardBar}>
                            <div style={{ width: `${s.strength * 10}%`, height: '100%', background: 'var(--opt)', borderRadius: 2 }} />
                          </div>
                          <div className={styles.sfCardNote}>{s.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing critical skills */}
                {result.skillFit.missingCritical.length > 0 && (
                  <div className={styles.sfSection}>
                    <div className={styles.sfSectionTitle}>⚠️ Critical skill gaps</div>
                    <div className={styles.sfGapList}>
                      {result.skillFit.missingCritical.map((g, i) => (
                        <div key={i} className={styles.sfGapItem}>
                          <span className={styles.sfGapIcon}>❌</span>
                          <div>
                            <div className={styles.sfGapLabel}>{g}</div>
                            <div className={styles.sfGapNote}>
                              This is a core requirement for {result.businessType || 'this type of work'}.
                              Address by: learning it, hiring someone who has it, or finding a co-founder to complement you.
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Less relevant skills */}
                {result.skillFit.gaps.length > 0 && (
                  <div className={styles.sfSection}>
                    <div className={styles.sfSectionTitle}>💡 Skills you have — less directly relevant</div>
                    <div className={styles.sfCards}>
                      {result.skillFit.gaps.map((g, i) => (
                        <div key={i} className={styles.sfCard} style={{ borderColor: 'var(--border)' }}>
                          <div className={styles.sfCardLabel}>{g.label}</div>
                          <div className={styles.sfCardNote}>{g.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skill fit impact on quality score */}
                <div className={styles.sfImpactCard}>
                  <div className={styles.sfImpactTitle}>📊 How this affected your Decision Quality Score</div>
                  <p className={styles.sfImpactText}>
                    Your skill fit of <strong>{result.skillFit.percentMatch}%</strong> {result.skillFit.score >= 0.7
                      ? 'boosted your quality score — strong alignment between your background and the target reduces execution risk.'
                      : result.skillFit.score >= 0.4
                      ? 'had a neutral to slightly negative effect — some alignment, some gaps.'
                      : 'pulled down your quality score — significant skill gaps increase execution risk and make the realistic path harder.'}
                    {' '}Skill fit is one of the most controllable factors — you can learn, hire, or partner to improve it before committing.
                  </p>
                </div>
              </>
            ) : (
              <div className={styles.sfEmpty}>
                <div className={styles.sfEmptyIcon}>🛠️</div>
                <div className={styles.sfEmptyTitle}>No skills entered</div>
                <p className={styles.sfEmptyText}>
                  You skipped the skills step. Go back and add your skills or paste your resume to get a personalised skill-fit assessment — it changes the quality score and tells you exactly what gaps to fill before committing to this decision.
                </p>
              </div>
            )}
          </section>
        )}

        {/* ── TAB: Life Quality ── */}
        {tab === 'life' && (
          <section className={styles.section}>
            <div className={styles.sectionTitle}>✨ Life Quality — Beyond the Numbers</div>
            <p className={styles.sectionSub}>
              Income is one dimension. These scores track how each future actually <strong>feels</strong> to live —
              happiness, sense of purpose, and personal freedom. Sometimes the lower-income path scores higher here.
            </p>

            {/* Motivation analysis */}
            {result.motivationProfile && (
              <div className={styles.motivationCard}>
                <div className={styles.motivationHeader}>
                  <div className={styles.motivationIcon}>
                    {result.motivationProfile.type === 'aspiration' ? '🎯'
                      : result.motivationProfile.type === 'escape' ? '🚪' : '🔄'}
                  </div>
                  <div>
                    <div className={styles.motivationTitle}>
                      {result.motivationProfile.type === 'aspiration' ? 'Aspiration-Driven Move'
                        : result.motivationProfile.type === 'escape' ? 'Escape-Driven Move'
                        : 'Mixed Motivation'}
                    </div>
                    <div className={styles.motivationSub}>{result.motivationProfile.label}</div>
                  </div>
                </div>
                <div className={styles.motivationDrives}>
                  {result.motivationProfile.drivers.map((d, i) => (
                    <div key={i} className={styles.motivationDrive}>
                      <span className={styles.motivationDriveIcon}>{d.icon}</span>
                      <div>
                        <div className={styles.motivationDriveName}>{d.name}</div>
                        <div className={styles.motivationDriveNote}>{d.note}</div>
                      </div>
                      <div className={styles.motivationDriveBar}>
                        <div style={{ width: `${d.score * 10}%`, height: '100%',
                          background: d.score >= 7 ? 'var(--opt)' : d.score >= 4 ? 'var(--gold)' : 'var(--muted)',
                          borderRadius: 2 }} />
                      </div>
                      <span className={styles.motivationDriveVal}>{d.score}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Life score comparison across scenarios */}
            <div className={styles.lifeScoreGrid}>
              {['optimistic','realistic','risky'].map(s => {
                const tl  = result.timelines[s]
                const cfg = SCENARIO_CONFIG[s]
                const avg = v => Math.round(tl.reduce((sum, y) => sum + y[v], 0) / tl.length)
                return (
                  <div key={s} className={`${styles.lifeCard} ${active === s ? styles.lifeCardActive : ''}`}
                    style={{ '--sc': cfg.color }} onClick={() => setActive(s)}>
                    <div className={styles.lifeCardHeader} style={{ color: cfg.color }}>
                      {cfg.icon} {cfg.label}
                    </div>
                    <div className={styles.lifeScoreBig}>{tl[4].lifeScore}<span>/10</span></div>
                    <div className={styles.lifeScoreLabel}>Life Score by {new Date().getFullYear() + 4}</div>
                    <div className={styles.lifeDims}>
                      {[
                        { key: 'happiness', label: '😊 Happiness',  color: '#88ccff' },
                        { key: 'purpose',   label: '🎯 Purpose',    color: 'var(--opt)' },
                        { key: 'freedom',   label: '🕊️ Freedom',    color: 'var(--gold)' },
                        { key: 'stress',    label: '😤 Stress',     color: null },
                      ].map(dim => {
                        const raw = tl[4][dim.key]
                        // Stress: bar width = actual value, colour = severity (high stress = red)
                        const barColor = dim.key === 'stress'
                          ? raw >= 8 ? 'var(--risk)' : raw >= 6 ? 'var(--gold)' : 'var(--opt)'
                          : dim.color
                        const barWidth = raw * 10  // just use real value for bar width
                        return (
                          <div key={dim.key} className={styles.lifeDim}>
                            <div className={styles.lifeDimLabel}>{dim.label}</div>
                            <div className={styles.lifeDimBar}>
                              <div style={{
                                width: `${barWidth}%`, height: '100%',
                                background: barColor, borderRadius: 2,
                                transition: 'width 0.4s ease',
                              }} />
                            </div>
                            <span className={styles.lifeDimVal} style={{ color: dim.key === 'stress' ? barColor : 'inherit' }}>
                              {raw}/10
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Year by year life score for selected scenario */}
            <div className={styles.sectionTitle} style={{ marginTop: 36 }}>
              {SCENARIO_CONFIG[active].icon} {SCENARIO_CONFIG[active].label} — Life Journey Year by Year
            </div>
            <div className={styles.lifeTimeline}>
              {result.timelines[active].map((y, i) => (
                <div key={y.year} className={styles.lifeTimelineYear}>
                  <div className={styles.ltyYear}>{y.year}</div>
                  <div className={styles.ltyLifeScore}
                    style={{ color: y.lifeScore >= 7 ? 'var(--opt)' : y.lifeScore >= 5 ? 'var(--gold)' : 'var(--risk)' }}>
                    {y.lifeScore}/10
                  </div>
                  <div className={styles.ltyLabel}>life score</div>
                  <div className={styles.ltyDims}>
                    {[
                      { label: '😊', val: y.happiness, key: 'happiness' },
                      { label: '🎯', val: y.purpose,   key: 'purpose'   },
                      { label: '🕊️', val: y.freedom,   key: 'freedom'   },
                    ].map(d => (
                      <div key={d.key} className={styles.ltyDim}>
                        <span>{d.label}</span>
                        <strong style={{ color: d.val >= 7 ? 'var(--opt)' : d.val >= 4 ? 'var(--gold)' : 'var(--risk)' }}>
                          {d.val}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <div className={styles.ltyEvent}>{y.event}</div>
                </div>
              ))}
            </div>

            {/* The key insight: life score vs income comparison */}
            <div className={styles.lifeVsMoneyCard}>
              <div className={styles.lvmTitle}>💡 Life vs Money — The Real Trade-off</div>
              <div className={styles.lvmGrid}>
                {['optimistic','realistic','risky'].map(s => {
                  const tl  = result.timelines[s]
                  const cfg = SCENARIO_CONFIG[s]
                  const stayIncome = comparison ? comparison.baseline[4].income : 0
                  const incDiff = tl[4].income - stayIncome
                  const lifeScore = tl[4].lifeScore
                  return (
                    <div key={s} className={styles.lvmRow}>
                      <div className={styles.lvmScenario} style={{ color: cfg.color }}>
                        {cfg.icon} {cfg.label}
                      </div>
                      <div className={styles.lvmIncome}>
                        <span>Income vs staying</span>
                        <strong className={incDiff >= 0 ? styles.positive : styles.negative}>
                          {incDiff >= 0 ? '+' : ''}{fmtL(incDiff)}
                        </strong>
                      </div>
                      <div className={styles.lvmLife}>
                        <span>Life score</span>
                        <strong style={{ color: lifeScore >= 7 ? 'var(--opt)' : lifeScore >= 5 ? 'var(--gold)' : 'var(--risk)' }}>
                          {lifeScore}/10
                        </strong>
                      </div>
                      <div className={styles.lvmVerdict}>
                        {incDiff >= 0 && lifeScore >= 7 ? '✅ Better money + better life'
                          : incDiff < 0 && lifeScore >= 7 ? '💛 Less money, better life — worth it if you value this'
                          : incDiff >= 0 && lifeScore < 6 ? '💰 More money, worse life — is it worth it?'
                          : '⚠️ Less money and worse life — reconsider'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── TAB: Market Intelligence ── */}
        {tab === 'market' && (
          <section className={styles.section}>
            <div className={styles.sectionTitle}>🌐 Market Intelligence</div>
            <p className={styles.sectionSub}>
              Real historical salary data, city job market health, career trajectory, and risk/opportunity factors
              drawn from our career intelligence database (2018–2024).
            </p>

            {result.careerIntelligence ? (() => {
              const ci = result.careerIntelligence
              const si = ci.salaryIntel
              const traj = ci.trajectory
              const mh = si?.marketHealth

              return (
                <>
                  {/* Salary Intelligence */}
                  {si && si.marketMedian > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <div className={styles.sfSectionTitle} style={{ marginBottom: 16 }}>📊 Market Salary Range (Current, {form.city})</div>
                      <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                        {[
                          { label: 'Entry (P25)', val: si.marketMedian * 0.55, color: 'var(--muted)' },
                          { label: 'Market Median', val: si.marketMedian, color: 'var(--real)' },
                          { label: 'Senior (P75)', val: si.marketP75, color: 'var(--gold)' },
                          { label: 'Top Earner (P90)', val: si.marketP90, color: 'var(--opt)' },
                        ].map(s => (
                          <div key={s.label} style={{
                            flex: '1 1 140px', padding: '16px 20px',
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 12, textAlign: 'center',
                          }}>
                            <div style={{ fontFamily:'var(--fd)', fontSize:22, fontWeight:900, color: s.color }}>
                              {fmtL(s.val)}
                            </div>
                            <div style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--muted)', marginTop:4, textTransform:'uppercase', letterSpacing:'1px' }}>
                              {s.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Salary trend */}
                      {si.trend && (
                        <div style={{
                          marginTop: 12, padding: '10px 16px',
                          background: si.trend === 'strong_growth' || si.trend === 'growing' ? 'rgba(61,232,160,0.06)' : si.trend === 'declining' ? 'rgba(245,115,106,0.06)' : 'rgba(91,164,245,0.06)',
                          border: `1px solid ${si.trend === 'strong_growth' || si.trend === 'growing' ? 'rgba(61,232,160,0.2)' : si.trend === 'declining' ? 'rgba(245,115,106,0.2)' : 'rgba(91,164,245,0.2)'}`,
                          borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10,
                        }}>
                          <span style={{ fontSize: 16 }}>
                            {si.trend === 'strong_growth' ? '🚀' : si.trend === 'growing' ? '📈' : si.trend === 'declining' ? '📉' : '➡️'}
                          </span>
                          <div>
                            <span style={{ fontFamily:'var(--fd)', fontSize:12, fontWeight:700, color: si.trend === 'strong_growth' || si.trend === 'growing' ? 'var(--opt)' : si.trend === 'declining' ? 'var(--risk)' : 'var(--real)' }}>
                              {si.trend === 'strong_growth' ? 'Strong Growth' : si.trend === 'growing' ? 'Growing' : si.trend === 'declining' ? 'Declining' : 'Stable'} Market
                            </span>
                            {si.trendPct && (
                              <span style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--muted)', marginLeft: 8 }}>
                                {si.trendPct > 0 ? '+' : ''}{(si.trendPct * 100).toFixed(1)}% avg annual salary growth
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {si.cityInsight && (
                        <div style={{ marginTop: 10, fontFamily:'var(--fm)', fontSize:12, color:'var(--text-secondary)', padding:'10px 14px', background:'var(--surface2)', borderRadius:8, borderLeft:'3px solid var(--gold)' }}>
                          📍 <strong>{form.city}:</strong> {si.cityInsight}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Market Health */}
                  {mh && (
                    <div style={{ marginBottom: 28 }}>
                      <div className={styles.sfSectionTitle} style={{ marginBottom: 16 }}>🏥 Job Market Health</div>
                      <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom: 14 }}>
                        {[
                          { label: 'Demand Score', val: `${mh.currentDemand}/10`, color: mh.currentDemand >= 8 ? 'var(--opt)' : mh.currentDemand >= 6 ? 'var(--gold)' : 'var(--risk)' },
                          { label: 'Trend', val: mh.trend?.replace('_',' ') || 'stable', color: mh.trend === 'growing' ? 'var(--opt)' : mh.trend === 'declining' ? 'var(--risk)' : 'var(--real)' },
                          { label: 'Saturation', val: mh.saturation?.replace('_',' ') || 'moderate', color: mh.saturation === 'low' || mh.saturation === 'very_low' ? 'var(--opt)' : mh.saturation === 'high' || mh.saturation === 'very_high' ? 'var(--risk)' : 'var(--gold)' },
                          { label: 'Layoff Risk', val: mh.layoffRisk?.replace('_',' ') || 'medium', color: mh.layoffRisk === 'low' || mh.layoffRisk === 'very_low' ? 'var(--opt)' : mh.layoffRisk === 'high' ? 'var(--risk)' : 'var(--gold)' },
                        ].map(item => (
                          <div key={item.label} style={{
                            flex:'1 1 130px', padding:'14px 16px',
                            background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10,
                          }}>
                            <div style={{ fontFamily:'var(--fd)', fontSize:16, fontWeight:800, color: item.color, textTransform:'capitalize' }}>{item.val}</div>
                            <div style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--muted)', marginTop:3, textTransform:'uppercase', letterSpacing:'1px' }}>{item.label}</div>
                          </div>
                        ))}
                      </div>
                      {mh.note && (
                        <div style={{ fontFamily:'var(--fm)', fontSize:12, color:'var(--text-secondary)', padding:'12px 16px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, lineHeight:1.7 }}>
                          💡 {mh.note}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Career Trajectory */}
                  {traj && (
                    <div style={{ marginBottom: 28 }}>
                      <div className={styles.sfSectionTitle} style={{ marginBottom: 16 }}>🎯 Your Career Trajectory</div>
                      <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap', padding:'16px 20px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12 }}>
                        <div style={{ flex:1, minWidth: 160 }}>
                          <div style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>You are here</div>
                          <div style={{ fontFamily:'var(--fd)', fontSize:15, fontWeight:800, color:'var(--real)' }}>{traj.currentTitle}</div>
                          <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--muted)', marginTop:2 }}>
                            {fmtL(traj.currentRange?.min)} – {fmtL(traj.currentRange?.max)}/yr
                          </div>
                        </div>
                        <div style={{ fontFamily:'var(--fd)', fontSize:20, color:'var(--muted)' }}>→</div>
                        <div style={{ flex:1, minWidth: 160 }}>
                          <div style={{ fontFamily:'var(--fm)', fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>
                            Next level {traj.yearsToNext > 0 ? `(~${Math.ceil(traj.yearsToNext)} yrs)` : ''}
                          </div>
                          <div style={{ fontFamily:'var(--fd)', fontSize:15, fontWeight:800, color:'var(--gold)' }}>{traj.nextTitle}</div>
                          <div style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--muted)', marginTop:2 }}>
                            {fmtL(traj.nextRange?.min)} – {fmtL(traj.nextRange?.max)}/yr
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Opportunity Factors */}
                  {ci.opportunityFactors?.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <div className={styles.sfSectionTitle} style={{ marginBottom: 12 }}>🚀 Opportunity Factors</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                        {ci.opportunityFactors.map((f, i) => (
                          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'10px 14px', background:'rgba(61,232,160,0.05)', border:'1px solid rgba(61,232,160,0.15)', borderRadius:8 }}>
                            <span style={{ color:'var(--opt)', flexShrink:0 }}>✓</span>
                            <span style={{ fontFamily:'var(--fm)', fontSize:12, color:'var(--text-secondary)', lineHeight:1.6 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Risk Factors */}
                  {ci.riskFactors?.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <div className={styles.sfSectionTitle} style={{ marginBottom: 12 }}>⚠️ Risk Factors</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                        {ci.riskFactors.map((f, i) => (
                          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'10px 14px', background:'rgba(245,115,106,0.05)', border:'1px solid rgba(245,115,106,0.15)', borderRadius:8 }}>
                            <span style={{ color:'var(--risk)', flexShrink:0 }}>!</span>
                            <span style={{ fontFamily:'var(--fm)', fontSize:12, color:'var(--text-secondary)', lineHeight:1.6 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* City immigration info for abroad moves */}
                  {ci.immigrationInfo && (
                    <div style={{ marginBottom: 24 }}>
                      <div className={styles.sfSectionTitle} style={{ marginBottom: 12 }}>✈️ Moving to {form.city} — What You Need to Know</div>
                      <div style={{ padding:'16px 20px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12 }}>
                        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                          <div style={{ display:'flex', gap:10 }}>
                            <span style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--muted)', width:120, flexShrink:0 }}>VISA PATHWAY</span>
                            <span style={{ fontFamily:'var(--fm)', fontSize:12, color:'var(--text-secondary)', lineHeight:1.6 }}>{ci.immigrationInfo.pathway}</span>
                          </div>
                          <div style={{ display:'flex', gap:10 }}>
                            <span style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--muted)', width:120, flexShrink:0 }}>PR/RESIDENCY</span>
                            <span style={{ fontFamily:'var(--fm)', fontSize:12, color:'var(--text-secondary)', lineHeight:1.6 }}>{ci.immigrationInfo.prPathway}</span>
                          </div>
                          {ci.immigrationInfo.diaspora && (
                            <div style={{ display:'flex', gap:10 }}>
                              <span style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--muted)', width:120, flexShrink:0 }}>INDIAN NETWORK</span>
                              <span style={{ fontFamily:'var(--fm)', fontSize:12, color:'var(--gold)', lineHeight:1.6 }}>{ci.immigrationInfo.diaspora}</span>
                            </div>
                          )}
                          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                            <span style={{ fontFamily:'var(--fm)', fontSize:11, color:'var(--muted)', width:120, flexShrink:0 }}>DIFFICULTY</span>
                            <span style={{
                              padding:'3px 10px', borderRadius:5,
                              background: ci.immigrationInfo.difficulty === 'easy' ? 'rgba(61,232,160,0.1)' : ci.immigrationInfo.difficulty === 'very_hard' ? 'rgba(245,115,106,0.1)' : 'rgba(232,200,74,0.1)',
                              color: ci.immigrationInfo.difficulty === 'easy' ? 'var(--opt)' : ci.immigrationInfo.difficulty === 'very_hard' ? 'var(--risk)' : 'var(--gold)',
                              fontFamily:'var(--fd)', fontSize:11, fontWeight:700, textTransform:'capitalize',
                            }}>
                              {ci.immigrationInfo.difficulty?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )
            })() : (
              <div style={{ textAlign:'center', padding:'40px 24px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16 }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
                <div style={{ fontFamily:'var(--fd)', fontSize:16, fontWeight:800, color:'var(--text)', marginBottom:8 }}>No market data available</div>
                <p style={{ fontFamily:'var(--fm)', fontSize:12, color:'var(--muted)' }}>
                  Add your industry and target city in the decision description for personalised market intelligence.
                </p>
              </div>
            )}
          </section>
        )}

        {/* ── TAB: Full Data ── */}
        {tab === 'table' && (
          <section className={styles.section}>
            <div className={styles.sectionTitle}>Full Data — All Scenarios</div>
            {['optimistic','realistic','risky'].map(s => (
              <div key={s} className={styles.tableSection}>
                <div className={styles.tableSectionTitle} style={{ color: SCENARIO_CONFIG[s].color }}>
                  {SCENARIO_CONFIG[s].icon} {s.charAt(0).toUpperCase()+s.slice(1)} Path
                </div>
                <TimelineTable data={result.timelines[s]} scenario={s} />
              </div>
            ))}
          </section>
        )}

      </main>

      {/* ── Floating AI Advisor button ── */}
      <button
        className={styles.advisorBtn}
        onClick={() => setAdvisorOpen(true)}>
        <span>🤖</span>
        <div className={styles.advisorBtnText}>
          <span>Ask AI Advisor</span>
          <span className={styles.advisorBtnSub}>Pros · Cons · Alternatives</span>
        </div>
        <div className={styles.advisorBtnPulse} />
      </button>

      {/* ── AI Advisor panel ── */}
      <AIAdvisor
        result={result}
        form={form}
        comparison={comparison}
        isOpen={advisorOpen}
        onClose={() => setAdvisorOpen(false)} />

    </div>
  )
}
