import { SCENARIO_CONFIG, fmt } from '../constants'
import styles from './ScenarioCard.module.css'

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// Generate a sharp, DB-informed one-liner for each scenario card
function buildCardInsight(scenario, data, result) {
  const last = data[data.length - 1]
  const first = data[0]
  const ci = result?.careerIntelligence
  const mh = ci?.salaryIntel?.marketHealth
  const trajectory = ci?.trajectory
  const trend = ci?.salaryIntel?.trend

  const incomeGrowth = ((last.income - first.income) / (first.income || 1) * 100).toFixed(0)
  const marketDemand = mh?.currentDemand || 7

  if (scenario === 'optimistic') {
    const trendNote = trend === 'strong_growth' || trend === 'growing'
      ? `Market is actively hiring — timing is in your favour.`
      : trend === 'declining'
      ? `Market is softening, so this best case requires sharper execution.`
      : `Steady market — this outcome is achievable with consistent effort.`
    const nextTitle = trajectory?.nextTitle ? `You'd reach ${trajectory.nextTitle} level.` : ''
    return `${trendNote} Income grows ${incomeGrowth}% over 5 years. ${nextTitle}`
  }

  if (scenario === 'realistic') {
    const demandNote = marketDemand >= 8
      ? `Demand in your field is strong (${marketDemand}/10) — this path is well-supported by market conditions.`
      : marketDemand >= 6
      ? `Market demand is moderate (${marketDemand}/10) — execution will matter more than luck here.`
      : `This is a competitive market — realistic path requires standing out.`
    return `${demandNote} Life score ends at ${last.lifeScore}/10 — stress ${last.stress}/10.`
  }

  if (scenario === 'risky') {
    const layoffNote = mh?.layoffRisk === 'low' || mh?.layoffRisk === 'very_low'
      ? `Sector layoff risk is low — the crash here is from execution, not market.`
      : mh?.layoffRisk === 'high'
      ? `Sector carries real layoff risk — this scenario models that downside.`
      : `Year 2 is the test — most who fail do so from runway issues, not bad ideas.`
    return `${layoffNote} If you survive the dip, income recovers to ${fmt(last.income)}/yr by year 5.`
  }

  return ''
}

export default function ScenarioCard({ scenario, data, summary, active, onClick, result }) {
  const cfg  = SCENARIO_CONFIG[scenario]
  const last = data[data.length - 1]
  const first = data[0]
  const ci = result?.careerIntelligence

  // Smart insight from DB
  const dbInsight = buildCardInsight(scenario, data, result)

  // Income delta vs year 1
  const incomeDelta = last.income - first.income
  const deltaPositive = incomeDelta >= 0

  // Life score colour
  const lifeColor = last.lifeScore >= 7 ? 'var(--opt)' : last.lifeScore >= 5 ? 'var(--gold)' : 'var(--risk)'

  // Scenario-specific demand context
  // Optimistic: full market demand, Realistic: moderate, Risky: lower (harder conditions)
  const baseDemand = ci?.salaryIntel?.marketHealth?.currentDemand || ci?.salaryIntel?.cityDemand || null
  const scenarioDemand = baseDemand
    ? scenario === 'optimistic' ? baseDemand
      : scenario === 'realistic' ? Math.max(1, +(baseDemand - 1).toFixed(1))
      : Math.max(1, +(baseDemand - 2.5).toFixed(1))
    : null
  const demandColor = !scenarioDemand ? 'var(--muted)'
    : scenarioDemand >= 8 ? 'var(--opt)'
    : scenarioDemand >= 6 ? 'var(--gold)'
    : 'var(--risk)'

  const stats = [
    { label: 'Income / yr',  value: fmt(last.income),          color: cfg.color },
    { label: 'Savings',      value: fmt(last.savings),         color: 'var(--text)' },
    { label: 'Life Score',   value: `${last.lifeScore}/10`,    color: lifeColor },
    { label: 'Stress',       value: `${last.stress}/10`,       color: last.stress >= 8 ? 'var(--risk)' : last.stress >= 6 ? 'var(--gold)' : 'var(--opt)' },
    { label: 'Career',       value: `${last.careerScore}/10`,  color: 'var(--text)' },
    { label: 'Happiness',    value: `${last.happiness}/10`,    color: last.happiness >= 7 ? 'var(--opt)' : 'var(--gold)' },
  ]

  // Build sparkline for income and life score together
  const maxInc = Math.max(...data.map(x => x.income))
  const minInc = Math.min(...data.map(x => x.income))

  return (
    <div
      className={`${styles.card} ${active ? styles.active : ''}`}
      style={{ '--sc': cfg.color, '--sc-dim': cfg.dim, '--sc-glow': `${cfg.chartColor}22` }}
      onClick={onClick}
    >
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.icon}>{cfg.icon}</span>
        <div style={{ flex: 1 }}>
          <div className={styles.label}>{cfg.label}</div>
          <div className={styles.years}>
            {new Date().getFullYear()} — {new Date().getFullYear() + 4}
          </div>
        </div>
        {scenarioDemand && (
          <div className={styles.demandBadge} style={{ color: demandColor, borderColor: demandColor }}>
            Demand {scenarioDemand}/10
          </div>
        )}
        {active && <div className={styles.activeBadge}>SELECTED</div>}
      </div>

      {/* DB-powered insight — one sharp sentence */}
      {dbInsight && (
        <p className={styles.dbInsight}>{dbInsight}</p>
      )}

      {/* Stats grid — 3 columns, 2 rows */}
      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.label} className={styles.statBox}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Income delta badge */}
      <div className={styles.deltaRow}>
        <span className={styles.deltaLabel}>5-yr income change</span>
        <span className={styles.deltaVal} style={{ color: deltaPositive ? 'var(--opt)' : 'var(--risk)' }}>
          {deltaPositive ? '▲' : '▼'} {fmt(Math.abs(incomeDelta))}
        </span>
      </div>

      {/* Dual sparkline — income + life score */}
      <div className={styles.sparkline}>
        <svg viewBox="0 0 160 36" preserveAspectRatio="none" width="100%" height="36">
          {/* Income line */}
          <polyline
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 160
              const y = 30 - ((d.income - minInc) / (maxInc - minInc + 1)) * 22
              return `${x},${y}`
            }).join(' ')}
            fill="none" stroke={cfg.chartColor} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.8"
          />
          {/* Life score line (subtle) */}
          <polyline
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 160
              const y = 30 - ((d.lifeScore / 10)) * 22
              return `${x},${y}`
            }).join(' ')}
            fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="3 2"
          />
          {/* Dots at year 5 */}
          <circle
            cx="160"
            cy={30 - ((last.income - minInc) / (maxInc - minInc + 1)) * 22}
            r="3" fill={cfg.chartColor}
          />
        </svg>
        <div className={styles.sparklineLegend}>
          <span style={{ color: cfg.chartColor }}>— income</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>- - life score</span>
        </div>
      </div>
    </div>
  )
}
