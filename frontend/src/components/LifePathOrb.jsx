import styles from './LifePathOrb.module.css'

export default function LifePathOrb({ size = 112, onClick, animate = true }) {
  return (
    <div
      className={`${styles.orb} ${animate ? styles.float : ''} ${onClick ? styles.clickable : ''}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <div className={styles.sphere} style={{ width: size, height: size, fontSize: size * 0.4 }}>
        <span className={styles.emoji}>🔮</span>
        <div className={styles.scanLine} />
        <div className={styles.shine} />
      </div>
    </div>
  )
}
