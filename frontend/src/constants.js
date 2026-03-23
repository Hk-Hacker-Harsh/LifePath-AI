export const SCENARIO_CONFIG = {
  optimistic: {
    icon: '📈',
    label: 'Optimistic Future',
    color: 'var(--opt)',
    dim: 'var(--opt-dim)',
    glow: 'var(--opt-glow)',
    chartColor: '#3de8a0',
  },
  realistic: {
    icon: '➡️',
    label: 'Realistic Future',
    color: 'var(--real)',
    dim: 'var(--real-dim)',
    glow: 'var(--real-glow)',
    chartColor: '#5ba4f5',
  },
  risky: {
    icon: '📉',
    label: 'Risky Future',
    color: 'var(--risk)',
    dim: 'var(--risk-dim)',
    glow: 'var(--risk-glow)',
    chartColor: '#f5736a',
  },
}

// Popular cities shown as quick-select pills
export const CITIES = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'Lucknow',
  'Chandigarh',
  'Indore',
  'Bhopal',
  'Kochi',
  'Coimbatore',
  'Noida',
  'Gurgaon',
  'Nagpur',
  'Visakhapatnam',
]

export const RELATIONSHIP_OPTIONS = [
  { value: 'low',    label: 'Career First' },
  { value: 'medium', label: 'Balanced' },
  { value: 'high',   label: 'Family First' },
]

export const LOADING_PHASES = [
  'Analysing your decision...',
  'Modelling career trajectories...',
  'Calculating financial outcomes...',
  'Simulating life scenarios...',
  'Generating your three futures...',
  'Almost ready...',
]

export const fmt = (v) => `₹${(v / 100000).toFixed(1)}L`
export const fmtFull = (v) => `₹${v.toLocaleString('en-IN')}`
