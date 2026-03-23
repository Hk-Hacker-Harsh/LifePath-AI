import { SCENARIO_CONFIG, fmt } from '../constants'
import styles from './TimelineTable.module.css'

export default function TimelineTable({ data, scenario }) {
  const cfg = SCENARIO_CONFIG[scenario]

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {['Year', 'Income', 'Savings', 'Career', 'Stress', 'Relationships', 'Event', 'Milestone'].map(h => (
              <th key={h} className={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.year} className={`${styles.tr} ${i % 2 ? styles.alt : ''}`}>
              <td className={styles.tdYear} style={{ color: cfg.color }}>{row.year}</td>
              <td className={styles.td}>{fmt(row.income)}</td>
              <td className={styles.td}>{fmt(row.savings)}</td>

              {/* Career bar */}
              <td className={styles.td}>
                <div className={styles.barCell}>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${row.careerScore * 10}%`, background: cfg.color }} />
                  </div>
                  <span className={styles.barNum}>{row.careerScore}</span>
                </div>
              </td>

              {/* Stress colored */}
              <td className={styles.td}>
                <span style={{
                  color: row.stress >= 8 ? 'var(--risk)' : row.stress >= 5 ? 'var(--gold)' : 'var(--opt)',
                  fontWeight: 600,
                }}>
                  {row.stress}/10
                </span>
              </td>

              {/* Relationship bar */}
              <td className={styles.td}>
                <div className={styles.barCell}>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${row.relationshipScore * 10}%`, background: 'var(--real)' }} />
                  </div>
                  <span className={styles.barNum}>{row.relationshipScore}</span>
                </div>
              </td>

              <td className={`${styles.td} ${styles.tdEvent}`}>{row.event}</td>
              <td className={`${styles.td} ${styles.tdMilestone}`}>{row.milestone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
