import { useState, useEffect } from 'react'
import LifePathOrb from '../components/LifePathOrb'
import { LOADING_PHASES } from '../constants'
import styles from './LoadingPage.module.css'

export default function LoadingPage({ form }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p + 1) % LOADING_PHASES.length), 950)
    return () => clearInterval(t)
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.orbWrap}>
        <LifePathOrb size={110} animate />
      </div>

      <div className={styles.textBlock}>
        <h2 className={styles.title}>Simulating your futures</h2>
        <div className={styles.phase}>
          {LOADING_PHASES[phase]}
          <span className={styles.cursor}>_</span>
        </div>
      </div>

      <div className={styles.dots}>
        {LOADING_PHASES.map((_, i) => (
          <div key={i} className={`${styles.dot} ${i === phase ? styles.dotActive : ''}`} />
        ))}
      </div>

      <div className={styles.paramSummary}>
        <div className={styles.paramRow}>
          <span className={styles.paramKey}>Decision</span>
          <span className={styles.paramVal}>{form.careerDecision}</span>
        </div>
        <div className={styles.paramRow}>
          <span className={styles.paramKey}>City</span>
          <span className={styles.paramVal}>{form.city}</span>
        </div>
        <div className={styles.paramRow}>
          <span className={styles.paramKey}>Risk</span>
          <span className={styles.paramValGold}>{form.riskTolerance}/10</span>
        </div>
        <div className={styles.paramRow}>
          <span className={styles.paramKey}>Savings</span>
          <span className={styles.paramVal}>₹{form.savings}</span>
        </div>
      </div>
    </div>
  )
}
