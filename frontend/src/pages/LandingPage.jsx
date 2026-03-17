import LifePathOrb from '../components/LifePathOrb'
import styles from './LandingPage.module.css'

export default function LandingPage({ onStart }) {
  return (
    <div className={styles.page}>
      {/* Grid bg */}
      <div className={styles.gridBg} />
      {/* Glow */}
      <div className={styles.glow} />

      <div className={`animate-fade-up s0 ${styles.orbWrap}`}>
        <LifePathOrb size={120} onClick={onStart} />
      </div>

      <div className={`animate-fade-up s1 ${styles.titleBlock}`}>
        <div className={styles.badge}>LifePath AI · AI-Powered Future Simulator</div>
        <h1 className={styles.title}>
          LifePath <span className={styles.gold}>AI</span>
        </h1>
      </div>

      <p className={`animate-fade-up s2 ${styles.subtitle}`}>
        Simulate your life decisions before making them.
        <br />
        <span className={styles.subtitleDim}>Three futures. One choice. Zero guesswork.</span>
      </p>

      <div className={`animate-fade-up s3 ${styles.pills}`}>
        {['📈 Optimistic', '➡️ Realistic', '📉 Risky'].map(s => (
          <div key={s} className={styles.pill}>{s}</div>
        ))}
      </div>

      <button className={`animate-fade-up s4 ${styles.cta}`} onClick={onStart}>
        Start Simulation
      </button>

      <div className={styles.footer}>
        Built with AI · See your possible futures
      </div>
    </div>
  )
}
