import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ComposedChart,
} from 'recharts'
import { SCENARIO_CONFIG, fmt } from '../constants'
import styles from './Charts.module.css'

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#0e1420', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11, color: '#e8e8f0',
  },
  itemStyle: { color: '#e8e8f0' },
  labelStyle: { color: '#6b7280', marginBottom: 4 },
}

const AXIS_PROPS = {
  stroke: '#374151',
  tick: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fill: '#6b7280' },
}

const LINE_KEYS = [
  ['opt',  SCENARIO_CONFIG.optimistic.chartColor, 'optimistic'],
  ['real', SCENARIO_CONFIG.realistic.chartColor,  'realistic'],
  ['risk', SCENARIO_CONFIG.risky.chartColor,       'risky'],
]

function ChartCard({ title, subtitle, children, wide }) {
  return (
    <div className={`${styles.card} ${wide ? styles.wide : ''}`}>
      <div className={styles.cardTitle}>{title}</div>
      {subtitle && <div className={styles.cardSubtitle}>{subtitle}</div>}
      {children}
      <div className={styles.legend}>
        {LINE_KEYS.map(([k,,s]) => (
          <div key={k} className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: SCENARIO_CONFIG[s].chartColor }} />
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Charts({ timelines, activeScenario, comparison, careerIntel }) {
  const years = timelines.optimistic.map(r => r.year)

  const opacity = (s) => activeScenario && activeScenario !== s ? 0.2 : 1
  const lw      = (s) => activeScenario === s ? 3 : 1.5

  const merge = (key) => years.map((year, i) => ({
    year,
    opt:  timelines.optimistic[i][key],
    real: timelines.realistic[i][key],
    risk: timelines.risky[i][key],
  }))

  const incomeData   = merge('income')
  const savingsData  = merge('savings')
  const stressData   = merge('stress')
  const careerData   = merge('careerScore')
  const lifeData     = merge('lifeScore')
  const happyData    = merge('happiness')
  const purposeData  = merge('purpose')
  const freedomData  = merge('freedom')

  // Income vs market benchmark line
  const marketMedian = careerIntel?.salaryIntel?.marketMedian
  const incomeVsMarket = years.map((year, i) => ({
    year,
    opt:    timelines.optimistic[i].income,
    real:   timelines.realistic[i].income,
    risk:   timelines.risky[i].income,
    market: marketMedian ? Math.round(marketMedian * Math.pow(1.06, i)) : null,
    stay:   comparison?.baseline?.[i]?.income || null,
  }))

  // Wealth gap — difference from "staying"
  const wealthGap = years.map((year, i) => {
    const base = comparison?.baseline?.[i]?.income || 0
    return {
      year,
      opt:  timelines.optimistic[i].income - base,
      real: timelines.realistic[i].income  - base,
      risk: timelines.risky[i].income      - base,
    }
  })

  // Life quality radar — year 5 snapshot
  const radarData = [
    { subject: 'Income', opt: timelines.optimistic[4].careerScore, real: timelines.realistic[4].careerScore, risk: timelines.risky[4].careerScore },
    { subject: 'Life',   opt: timelines.optimistic[4].lifeScore,   real: timelines.realistic[4].lifeScore,   risk: timelines.risky[4].lifeScore },
    { subject: 'Happy',  opt: timelines.optimistic[4].happiness,   real: timelines.realistic[4].happiness,   risk: timelines.risky[4].happiness },
    { subject: 'Purpose',opt: timelines.optimistic[4].purpose,     real: timelines.realistic[4].purpose,     risk: timelines.risky[4].purpose },
    { subject: 'Freedom',opt: timelines.optimistic[4].freedom,     real: timelines.realistic[4].freedom,     risk: timelines.risky[4].freedom },
    { subject: 'Stress', opt: 10-timelines.optimistic[4].stress,   real: 10-timelines.realistic[4].stress,   risk: 10-timelines.risky[4].stress },
  ]

  // Savings accumulation with negative handling
  const cumulativeWealth = years.map((year, i) => ({
    year,
    opt:  timelines.optimistic[i].savings,
    real: timelines.realistic[i].savings,
    risk: timelines.risky[i].savings,
  }))

  return (
    <div className={styles.grid}>

      {/* 1. Income vs Market Benchmark — wide */}
      <div className={styles.wide}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>💰 Income vs Market Benchmark</div>
          <div className={styles.cardSubtitle}>Solid = your scenarios · Dashed = market median · Dotted = if you stayed</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={incomeVsMarket}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} tickFormatter={fmt} width={62} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [fmt(v), n === 'market' ? 'Market Median' : n === 'stay' ? 'If You Stayed' : n]} />
              {LINE_KEYS.map(([k, c, s]) => (
                <Line key={k} type="monotone" dataKey={k} stroke={c}
                  strokeWidth={lw(s)} dot={{ fill: c, r: 3 }} opacity={opacity(s)} />
              ))}
              {incomeVsMarket[0].market && (
                <Line type="monotone" dataKey="market" stroke="rgba(232,200,74,0.5)"
                  strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
              )}
              {incomeVsMarket[0].stay && (
                <Line type="monotone" dataKey="stay" stroke="rgba(255,255,255,0.2)"
                  strokeWidth={1} strokeDasharray="3 3" dot={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
          <div className={styles.legend}>
            {LINE_KEYS.map(([k,,s]) => (
              <div key={k} className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: SCENARIO_CONFIG[s].chartColor }} />
                <span>{s}</span>
              </div>
            ))}
            {incomeVsMarket[0].market && <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: 'rgba(232,200,74,0.5)' }} /><span>market</span></div>}
            {incomeVsMarket[0].stay   && <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: 'rgba(255,255,255,0.2)' }} /><span>if stayed</span></div>}
          </div>
        </div>
      </div>

      {/* 2. Wealth Accumulation */}
      <ChartCard title="💸 Wealth Accumulation" subtitle="Savings balance over 5 years">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={cumulativeWealth}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} tickFormatter={fmt} width={62} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [fmt(v), '']} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            {LINE_KEYS.map(([k, c, s]) => (
              <Area key={k} type="monotone" dataKey={k} stroke={c} fill={c}
                fillOpacity={0.06} strokeWidth={lw(s)} opacity={opacity(s)} dot={false} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 3. Income Gap vs Staying */}
      <ChartCard title="📊 Income Gap vs Staying" subtitle="Positive = ahead, negative = behind">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={wealthGap} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} tickFormatter={fmt} width={62} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [fmt(v), '']} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
            {LINE_KEYS.map(([k, c, s]) => (
              <Bar key={k} dataKey={k} fill={c} radius={[3,3,0,0]} opacity={opacity(s) * 0.85} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 4. Life Score — the real simulation */}
      <ChartCard title="✨ Life Score" subtitle="Holistic: happiness + purpose + freedom + career − stress">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lifeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} domain={[0,10]} tickFormatter={v => `${v}`} width={28} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}/10`, '']} />
            <ReferenceLine y={7} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 3" label={{ value: 'good', fill: '#6b7280', fontSize: 9 }} />
            {LINE_KEYS.map(([k, c, s]) => (
              <Line key={k} type="monotone" dataKey={k} stroke={c}
                strokeWidth={lw(s)} dot={{ fill: c, r: 3 }} opacity={opacity(s)} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 5. Happiness trajectory */}
      <ChartCard title="😊 Happiness Over Time" subtitle="How you'll likely feel day-to-day">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={happyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} domain={[0,10]} tickFormatter={v=>`${v}`} width={28} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}/10`, '']} />
            {LINE_KEYS.map(([k, c, s]) => (
              <Area key={k} type="monotone" dataKey={k} stroke={c} fill={c}
                fillOpacity={0.05} strokeWidth={lw(s)} opacity={opacity(s)} dot={false} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 6. Purpose + Freedom combined */}
      <ChartCard title="🎯 Purpose & Freedom" subtitle="Solid = purpose · Dashed = freedom">
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={purposeData.map((p, i) => ({ ...p, fopt: freedomData[i].opt, freal: freedomData[i].real, frisk: freedomData[i].risk }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} domain={[0,10]} tickFormatter={v=>`${v}`} width={28} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}/10`, '']} />
            {LINE_KEYS.map(([k, c, s]) => (
              <Line key={`p${k}`} type="monotone" dataKey={k} stroke={c}
                strokeWidth={lw(s)} dot={{ fill: c, r: 2 }} opacity={opacity(s)} />
            ))}
            {LINE_KEYS.map(([k, c, s]) => (
              <Line key={`f${k}`} type="monotone" dataKey={`f${k}`} stroke={c}
                strokeWidth={lw(s)} strokeDasharray="4 2" dot={false} opacity={opacity(s) * 0.6} />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 7. Stress */}
      <ChartCard title="😤 Stress Levels" subtitle="Lower is better">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stressData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} domain={[0,10]} tickFormatter={v=>`${v}`} width={28} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}/10`, '']} />
            <ReferenceLine y={7} stroke="rgba(245,115,106,0.3)" strokeDasharray="3 3" />
            {LINE_KEYS.map(([k, c, s]) => (
              <Bar key={k} dataKey={k} fill={c} radius={[3,3,0,0]} opacity={opacity(s) * 0.85} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 8. Career score */}
      <ChartCard title="🚀 Career Trajectory" subtitle="Professional growth over 5 years">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={careerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" {...AXIS_PROPS} />
            <YAxis {...AXIS_PROPS} domain={[0,10]} tickFormatter={v=>`${v}`} width={28} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}/10`, '']} />
            {LINE_KEYS.map(([k, c, s]) => (
              <Line key={k} type="monotone" dataKey={k} stroke={c}
                strokeWidth={lw(s)} dot={{ fill: c, r: 3 }} opacity={opacity(s)} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 9. Year 5 Radar — life quality snapshot */}
      <div className={styles.wide}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>🔬 Year 5 Quality Snapshot — All Dimensions</div>
          <div className={styles.cardSubtitle}>How each future looks across every dimension by {new Date().getFullYear() + 4}</div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject"
                tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fill: '#6b7280' }} />
              {LINE_KEYS.map(([k, c, s]) => (
                <Radar key={k} name={s} dataKey={k} stroke={c}
                  fill={c} fillOpacity={0.08} strokeWidth={lw(s)} opacity={opacity(s)} />
              ))}
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}/10`, '']} />
            </RadarChart>
          </ResponsiveContainer>
          <div className={styles.legend}>
            {LINE_KEYS.map(([k,,s]) => (
              <div key={k} className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: SCENARIO_CONFIG[s].chartColor }} />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
