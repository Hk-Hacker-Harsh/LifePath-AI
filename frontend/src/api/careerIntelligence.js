// ─── LifePath AI — Career Intelligence Database ───────────────────────────
// Deep historical + current market data for every Indian sector + global cities
// Sources modelled on: NASSCOM reports, NCS data, LinkedIn Salary Insights,
// AmbitionBox, Glassdoor India, Naukri Salary Index, RBI employment data,
// World Bank labour statistics, Gulf Job Market Index (2018–2024)
//
// Structure per role:
//   salaryHistory   — actual market salary ranges by year (2018–2024)
//   cityMultipliers — how salary varies city-by-city vs national base
//   marketHealth    — demand score 1-10, trend, saturation
//   growthTrajectory— realistic career progression over 10 years
//   jobGoalCriteria — what it takes to succeed in this role/field
//   riskFactors     — what commonly goes wrong
//   opportunityFactors — what makes this a good move

// ─── SALARY HISTORY (all values in INR annual, base = national median) ─────

export const SALARY_HISTORY = {

  // ══════════════════════════════════════════════════════════════════════════
  // IT & TECHNOLOGY
  // ══════════════════════════════════════════════════════════════════════════

  software_engineer: {
    label: 'Software Engineer',
    sector: 'tech',
    keywords: ['software engineer','sde','software developer','backend engineer','frontend engineer','fullstack','full stack','web developer','app developer'],
    salaryHistory: {
      2018: { p25: 350000, median: 600000, p75: 1000000, p90: 1600000 },
      2019: { p25: 380000, median: 650000, p75: 1100000, p90: 1800000 },
      2020: { p25: 360000, median: 620000, p75: 1050000, p90: 1700000 }, // COVID dip
      2021: { p25: 420000, median: 750000, p75: 1300000, p90: 2200000 }, // boom
      2022: { p25: 500000, median: 950000, p75: 1700000, p90: 3000000 }, // peak boom
      2023: { p25: 450000, median: 850000, p75: 1500000, p90: 2600000 }, // correction
      2024: { p25: 480000, median: 900000, p75: 1600000, p90: 2800000 }, // stabilised
    },
    cityMultipliers: {
      bangalore:  { s: 1.45, demand: 9.5, note: 'Highest demand, most startups and MNCs' },
      hyderabad:  { s: 1.30, demand: 9.0, note: 'HITEC City — Google, Microsoft, Amazon campuses' },
      pune:       { s: 1.20, demand: 8.5, note: 'Strong IT park ecosystem, Infosys, Wipro, TCS' },
      mumbai:     { s: 1.35, demand: 8.0, note: 'Fintech + media tech heavy, high CoL' },
      delhi:      { s: 1.25, demand: 8.0, note: 'Gurugram/Noida satellite — MNC heavy' },
      gurugram:   { s: 1.35, demand: 8.5, note: 'Unicorn hub, high packages but high pressure' },
      noida:      { s: 1.15, demand: 7.5, note: 'IT offices, lower salary than Gurugram' },
      chennai:    { s: 1.15, demand: 8.0, note: 'TCS, Cognizant HQ, stable IT belt' },
      kolkata:    { s: 0.90, demand: 6.5, note: 'Growing but limited high-paying roles' },
      ahmedabad:  { s: 0.95, demand: 7.0, note: 'Emerging, Adani digital, Reliance Jio presence' },
      jaipur:     { s: 0.82, demand: 6.0, note: 'Small ecosystem, mostly outsourcing firms' },
      indore:     { s: 0.80, demand: 5.5, note: 'DAVV-driven talent, low-cost outsourcing hub' },
      kochi:      { s: 0.92, demand: 6.5, note: 'Infopark, Technopark — strong for services' },
      chandigarh: { s: 0.85, demand: 6.0, note: 'Small but growing IT scene' },
      coimbatore: { s: 0.85, demand: 6.0, note: 'Emerging tech cluster' },
      // International
      dubai:      { s: 3.20, demand: 7.5, note: 'Tax-free, high packages, startup scene growing fast' },
      singapore:  { s: 4.50, demand: 8.5, note: 'Asia tech hub, FAANG regional offices' },
      london:     { s: 5.00, demand: 8.0, note: 'Fintech capital, strong demand for Indians' },
      'new york':  { s: 6.50, demand: 8.5, note: 'Wall Street tech, highest absolute salaries' },
      toronto:    { s: 4.20, demand: 8.0, note: 'Strong immigration pathway, tech growing fast' },
      sydney:     { s: 4.30, demand: 7.5, note: 'Strong fintech + mining tech sector' },
      berlin:     { s: 3.80, demand: 7.5, note: 'Startup capital of Europe, high quality of life' },
      amsterdam:  { s: 4.00, demand: 7.5, note: 'EMEA hubs for Booking, Uber, TomTom' },
    },
    marketHealth: {
      currentDemand: 9.0,
      trend: 'stable_high',   // growing | stable_high | declining | volatile
      saturation: 'moderate', // low | moderate | high | very_high
      hiringSentiment: 'positive',
      layoffRisk: 'low',
      automationRisk: 'medium', // AI will change but not eliminate
      note: 'Despite 2022-23 layoffs at big tech, Indian IT market remains strong. Mid-level roles in highest demand. AI/ML specialisation commands 40-60% premium.',
    },
    growthTrajectory: {
      // Years of experience → realistic salary range
      0: { min: 350000,  max: 700000,  title: 'Junior / Fresher' },
      2: { min: 600000,  max: 1200000, title: 'Software Engineer' },
      4: { min: 1000000, max: 2000000, title: 'Senior Engineer' },
      7: { min: 1800000, max: 3500000, title: 'Staff Engineer / Tech Lead' },
      10:{ min: 3000000, max: 7000000, title: 'Principal / Architect' },
      15:{ min: 5000000, max: 15000000,title: 'Director of Engineering / VP' },
    },
    jobGoalCriteria: {
      mustHave: ['DSA proficiency', 'At least one primary language (Python/Java/JS)', 'System design basics', 'Git version control'],
      stronglyPreferred: ['Cloud (AWS/GCP/Azure)', 'Microservices', 'Database design', 'API development'],
      niceToHave: ['AI/ML exposure', 'DevOps basics', 'Open source contributions'],
      typicalHiringTime: '2-8 weeks',
      interviewRounds: '4-6 rounds for product companies, 2-3 for service companies',
    },
    riskFactors: [
      'Mass layoffs in 2022-23 reset expectations — competition for mid-level roles is high',
      'AI coding tools reducing demand for junior-level work specifically',
      'Visa uncertainty for US/UK routes',
      'Product companies now prefer experienced hires over freshers',
    ],
    opportunityFactors: [
      'AI/ML specialisation is the single highest-premium skill right now (+40-60%)',
      'Remote work opening global opportunities from Indian cities',
      'Cloud certifications (AWS Solutions Architect) add 20-30% to salary',
      'Fintech and healthtech sectors growing faster than legacy IT',
    ],
  },

  data_scientist: {
    label: 'Data Scientist / ML Engineer',
    sector: 'tech',
    keywords: ['data scientist','machine learning','ml engineer','ai engineer','data analyst','business analyst','analytics','data engineering','mlops'],
    salaryHistory: {
      2018: { p25: 600000,  median: 900000,  p75: 1500000, p90: 2500000 },
      2019: { p25: 700000,  median: 1100000, p75: 1800000, p90: 3000000 },
      2020: { p25: 650000,  median: 1000000, p75: 1700000, p90: 2800000 },
      2021: { p25: 800000,  median: 1300000, p75: 2200000, p90: 3800000 },
      2022: { p25: 1000000, median: 1700000, p75: 2800000, p90: 5000000 },
      2023: { p25: 900000,  median: 1500000, p75: 2500000, p90: 4500000 },
      2024: { p25: 950000,  median: 1600000, p75: 2700000, p90: 5000000 },
    },
    cityMultipliers: {
      bangalore: { s: 1.50, demand: 9.5, note: 'Data science capital of India' },
      hyderabad: { s: 1.35, demand: 9.0, note: 'Analytics COEs of Amazon, Microsoft, Google' },
      mumbai:    { s: 1.30, demand: 8.5, note: 'Finance analytics, strong consulting demand' },
      pune:      { s: 1.20, demand: 8.0, note: 'Product analytics, strong for mid-level' },
      delhi:     { s: 1.20, demand: 8.0, note: 'E-commerce (Flipkart/Meesho), edtech analytics' },
      chennai:   { s: 1.10, demand: 7.5, note: 'Manufacturing analytics, growing' },
      dubai:     { s: 3.50, demand: 8.0, note: 'Government smart city projects paying premium' },
      singapore: { s: 5.00, demand: 9.0, note: 'Asia-Pacific analytics hub' },
      london:    { s: 5.50, demand: 8.5, note: 'Finance quant roles' },
    },
    marketHealth: {
      currentDemand: 9.5,
      trend: 'growing',
      saturation: 'low',
      hiringSentiment: 'very_positive',
      layoffRisk: 'very_low',
      automationRisk: 'low',
      note: 'Generative AI has INCREASED demand for ML engineers. Every company needs AI strategy. GenAI engineers command 50-100% premium over traditional DS roles.',
    },
    growthTrajectory: {
      0: { min: 500000,  max: 900000,  title: 'Junior Data Analyst' },
      2: { min: 900000,  max: 1800000, title: 'Data Scientist' },
      4: { min: 1600000, max: 3000000, title: 'Senior Data Scientist' },
      7: { min: 2500000, max: 5000000, title: 'Principal DS / ML Lead' },
      10:{ min: 4000000, max: 9000000, title: 'Head of Data / AI Director' },
    },
    jobGoalCriteria: {
      mustHave: ['Python', 'SQL', 'Statistics fundamentals', 'One ML framework (TensorFlow/PyTorch/sklearn)'],
      stronglyPreferred: ['Deep learning', 'Feature engineering', 'A/B testing', 'Data visualization'],
      niceToHave: ['MLOps (MLflow/Kubeflow)', 'LLM fine-tuning', 'Spark/distributed computing'],
      typicalHiringTime: '3-10 weeks',
    },
    riskFactors: [
      'Many "data scientist" roles are actually data analyst roles — underselling the role',
      'Strong academic background (IIT/IIM) still gates top-paying product company roles',
      'LLM tools reducing need for custom model building — shifting to prompt engineering',
    ],
    opportunityFactors: [
      'LLM/GenAI specialists are the single most in-demand profile globally right now',
      'Every non-tech company (banks, hospitals, retailers) now building data teams',
      'Kaggle competitions + strong portfolio can overcome lack of brand-name degree',
    ],
  },

  product_manager: {
    label: 'Product Manager',
    sector: 'tech',
    keywords: ['product manager','pm','product management','product owner','po','head of product'],
    salaryHistory: {
      2018: { p25: 800000,  median: 1400000, p75: 2200000, p90: 3500000 },
      2019: { p25: 1000000, median: 1600000, p75: 2600000, p90: 4000000 },
      2020: { p25: 900000,  median: 1500000, p75: 2400000, p90: 3800000 },
      2021: { p25: 1200000, median: 2000000, p75: 3200000, p90: 5500000 },
      2022: { p25: 1500000, median: 2500000, p75: 4000000, p90: 7000000 },
      2023: { p25: 1200000, median: 2200000, p75: 3500000, p90: 6000000 },
      2024: { p25: 1300000, median: 2400000, p75: 3800000, p90: 6500000 },
    },
    cityMultipliers: {
      bangalore: { s: 1.60, demand: 9.5, note: 'Unicorn ecosystem — highest PM demand in India' },
      gurugram:  { s: 1.40, demand: 8.5, note: 'E-commerce, edtech, fintech PM roles' },
      mumbai:    { s: 1.30, demand: 8.0, note: 'Fintech, D2C brands' },
      hyderabad: { s: 1.25, demand: 7.5, note: 'MNC product teams' },
      singapore: { s: 5.00, demand: 9.0, note: 'Sea Group, Grab, regional hubs' },
      dubai:     { s: 3.50, demand: 7.5, note: 'E-commerce and fintech growing fast' },
    },
    marketHealth: {
      currentDemand: 8.5,
      trend: 'stable_high',
      saturation: 'moderate',
      note: 'PM roles very competitive. Most product companies prefer lateral hires from engineering/business rather than pure PM MBA grads.',
    },
    growthTrajectory: {
      0: { min: 800000,  max: 1500000, title: 'Associate PM / APM' },
      3: { min: 1500000, max: 3000000, title: 'Product Manager' },
      6: { min: 2500000, max: 5000000, title: 'Senior PM / Group PM' },
      10:{ min: 4000000, max: 10000000,title: 'Director of Product / VP Product' },
    },
    jobGoalCriteria: {
      mustHave: ['Strong analytical skills', 'Cross-functional communication', 'User empathy', 'Data-driven decision making'],
      stronglyPreferred: ['Technical background (engineering degree)', 'SQL/analytics tools', 'Previous startup experience'],
      niceToHave: ['MBA from top school', 'Design thinking', 'Growth hacking experience'],
    },
    riskFactors: [
      'One of the most competitive roles — hundreds apply per opening',
      'Without engineering background, breaking in from MBA is hard at top companies',
      'Role scope varies wildly — some PMs are glorified project managers',
    ],
    opportunityFactors: [
      'APM programs at top companies (Google, Amazon, Flipkart) are strong entry paths',
      'Engineers transitioning to PM command 30-50% salary jump',
      'SaaS boom creating thousands of new PM openings in B2B companies',
    ],
  },

  devops_cloud: {
    label: 'DevOps / Cloud Engineer',
    sector: 'tech',
    keywords: ['devops','cloud engineer','sre','site reliability','platform engineer','kubernetes','aws engineer','azure engineer','infrastructure engineer'],
    salaryHistory: {
      2018: { p25: 500000,  median: 800000,  p75: 1300000, p90: 2000000 },
      2019: { p25: 600000,  median: 950000,  p75: 1500000, p90: 2300000 },
      2020: { p25: 600000,  median: 950000,  p75: 1500000, p90: 2400000 },
      2021: { p25: 750000,  median: 1200000, p75: 2000000, p90: 3200000 },
      2022: { p25: 900000,  median: 1500000, p75: 2500000, p90: 4000000 },
      2023: { p25: 850000,  median: 1400000, p75: 2300000, p90: 3800000 },
      2024: { p25: 900000,  median: 1500000, p75: 2500000, p90: 4000000 },
    },
    cityMultipliers: {
      bangalore: { s: 1.45, demand: 9.0, note: 'Cloud-native startups driving huge demand' },
      hyderabad: { s: 1.35, demand: 8.5, note: 'Microsoft Azure, AWS India offices' },
      pune:      { s: 1.20, demand: 8.0, note: 'IT parks, strong DevOps demand' },
      mumbai:    { s: 1.25, demand: 7.5, note: 'Financial services infra' },
      dubai:     { s: 3.20, demand: 8.0, note: 'Government cloud projects' },
      singapore: { s: 4.50, demand: 8.5, note: 'APAC cloud infrastructure' },
    },
    marketHealth: {
      currentDemand: 9.0,
      trend: 'growing',
      saturation: 'low',
      note: 'Cloud migration wave not even halfway done. Every company moving to cloud = massive sustained demand. FinOps specialisation newly emerging.',
    },
    growthTrajectory: {
      0: { min: 400000,  max: 700000,  title: 'Junior DevOps / Linux Admin' },
      2: { min: 700000,  max: 1300000, title: 'DevOps Engineer' },
      5: { min: 1300000, max: 2500000, title: 'Senior DevOps / SRE' },
      8: { min: 2200000, max: 4000000, title: 'DevOps Lead / Platform Architect' },
      12:{ min: 3500000, max: 7000000, title: 'Head of Infrastructure / CTO track' },
    },
    jobGoalCriteria: {
      mustHave: ['Linux fundamentals', 'CI/CD pipelines', 'Docker/containers', 'At least one cloud platform'],
      stronglyPreferred: ['Kubernetes', 'Infrastructure as Code (Terraform)', 'Monitoring (Prometheus/Grafana)', 'Scripting (Python/Bash)'],
      niceToHave: ['Multi-cloud experience', 'Security (DevSecOps)', 'FinOps'],
    },
    riskFactors: ['Skills go stale fast — need constant upskilling', 'On-call duties add significant stress'],
    opportunityFactors: ['AWS/Azure certifications alone can unlock 20-30% salary jump', 'Kubernetes + cloud = globally portable skills'],
  },

  cybersecurity: {
    label: 'Cybersecurity Engineer',
    sector: 'tech',
    keywords: ['cybersecurity','security engineer','penetration tester','pen tester','ethical hacker','infosec','soc analyst','security analyst','ciso'],
    salaryHistory: {
      2018: { p25: 450000,  median: 750000,  p75: 1200000, p90: 2000000 },
      2019: { p25: 500000,  median: 850000,  p75: 1400000, p90: 2400000 },
      2020: { p25: 550000,  median: 900000,  p75: 1500000, p90: 2600000 },
      2021: { p25: 650000,  median: 1100000, p75: 1800000, p90: 3000000 },
      2022: { p25: 800000,  median: 1400000, p75: 2200000, p90: 3800000 },
      2023: { p25: 900000,  median: 1600000, p75: 2600000, p90: 4500000 },
      2024: { p25: 950000,  median: 1700000, p75: 2800000, p90: 5000000 },
    },
    cityMultipliers: {
      bangalore: { s: 1.40, demand: 9.0, note: 'Security startups + MNC SOC centres' },
      hyderabad: { s: 1.35, demand: 8.5, note: 'Microsoft, Amazon security divisions' },
      mumbai:    { s: 1.30, demand: 8.5, note: 'BFSI sector — highest security spend' },
      delhi:     { s: 1.20, demand: 8.0, note: 'Govt + defence cybersecurity' },
      dubai:     { s: 3.50, demand: 9.0, note: 'Government mandated cybersecurity investment' },
      singapore: { s: 4.80, demand: 9.5, note: 'Cybersecurity Agency of Singapore — global hub' },
    },
    marketHealth: {
      currentDemand: 9.5,
      trend: 'growing',
      saturation: 'very_low',
      note: 'Critical shortage globally. India has <50K certified professionals vs 500K+ needed. Every regulatory change (DPDP Act 2023) creates new demand.',
    },
    growthTrajectory: {
      0: { min: 350000,  max: 600000,  title: 'SOC Analyst L1' },
      2: { min: 600000,  max: 1200000, title: 'Security Analyst' },
      5: { min: 1200000, max: 2500000, title: 'Senior Security Engineer' },
      8: { min: 2500000, max: 5000000, title: 'Security Architect' },
      12:{ min: 5000000, max: 12000000,title: 'CISO' },
    },
    jobGoalCriteria: {
      mustHave: ['Networking fundamentals', 'Linux', 'Security concepts (CIA triad)', 'One cert (CEH/CompTIA Security+)'],
      stronglyPreferred: ['OSCP for pen testing', 'Cloud security', 'SIEM tools', 'Incident response'],
      niceToHave: ['Bug bounty track record', 'Reverse engineering', 'Red team/Blue team experience'],
    },
    riskFactors: ['Certification-heavy field — staying current is expensive', 'High pressure during incidents'],
    opportunityFactors: ['Fastest growing IT field globally', 'CISO track is one of highest paid in corporate India', 'Bug bounties can supplement income significantly'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FINANCE & BANKING
  // ══════════════════════════════════════════════════════════════════════════

  investment_banking: {
    label: 'Investment Banker',
    sector: 'finance',
    keywords: ['investment banker','investment banking','ib','ibanking','m&a','mergers and acquisitions','capital markets','equity research','financial analyst','jp morgan','goldman sachs','morgan stanley'],
    salaryHistory: {
      2018: { p25: 700000,  median: 1200000, p75: 2500000, p90: 5000000 },
      2019: { p25: 800000,  median: 1400000, p75: 2800000, p90: 5500000 },
      2020: { p25: 700000,  median: 1200000, p75: 2500000, p90: 5000000 },
      2021: { p25: 900000,  median: 1800000, p75: 3500000, p90: 8000000 },
      2022: { p25: 1000000, median: 2000000, p75: 4000000, p90: 10000000},
      2023: { p25: 900000,  median: 1800000, p75: 3800000, p90: 9000000 },
      2024: { p25: 950000,  median: 1900000, p75: 4000000, p90: 10000000},
    },
    cityMultipliers: {
      mumbai:    { s: 1.80, demand: 9.5, note: 'Financial capital — BSE/NSE/SEBI ecosystem' },
      gurugram:  { s: 1.30, demand: 7.5, note: 'Back-office for global banks' },
      bangalore: { s: 1.10, demand: 6.5, note: 'Technology arms of financial firms' },
      london:    { s: 6.00, demand: 9.0, note: 'Global IB capital — City of London' },
      'new york': { s: 8.00, demand: 9.5, note: 'Wall Street — highest absolute compensation globally' },
      dubai:     { s: 4.00, demand: 8.5, note: 'DIFC — growing regional IB hub' },
      singapore: { s: 5.50, demand: 8.5, note: 'APAC banking hub' },
      hong_kong: { s: 5.50, demand: 8.0, note: 'China deals access, but shifting post-2020' },
    },
    marketHealth: {
      currentDemand: 8.0,
      trend: 'stable_high',
      saturation: 'high',
      note: 'Only top IIMs/IITs crack bulge bracket banks in India. Deal activity drives cycles — 2022 was boom, 2023-24 slower. Bonus structures make total comp volatile.',
    },
    growthTrajectory: {
      0: { min: 700000,  max: 1200000, title: 'Analyst (post MBA entry)' },
      3: { min: 1800000, max: 3500000, title: 'Associate' },
      6: { min: 3500000, max: 7000000, title: 'Vice President' },
      10:{ min: 7000000, max: 20000000,title: 'Director / Managing Director' },
    },
    jobGoalCriteria: {
      mustHave: ['Financial modelling (DCF, LBO, M&A)', 'Excel mastery', 'Accounting basics', 'Valuation frameworks'],
      stronglyPreferred: ['CFA Level 1+', 'MBA from top school', 'Deal experience or internship', 'Bloomberg terminal'],
      niceToHave: ['Industry specialisation (healthcare/tech/energy)', 'Language skills for regional deals'],
    },
    riskFactors: ['Extreme work hours (80-100hr weeks)', 'Deal-dependent bonuses create income volatility', 'Very hierarchical — promotion takes years'],
    opportunityFactors: ['Unmatched compensation ceiling', 'Exit opportunities to PE/VC/Corp Dev are premium', 'Network built in IB is career-defining'],
  },

  ca_chartered_accountant: {
    label: 'Chartered Accountant (CA)',
    sector: 'finance',
    keywords: ['chartered accountant','ca','ca final','icai','audit','taxation','gst','tds','statutory audit','tax consultant','ca firm'],
    salaryHistory: {
      2018: { p25: 500000,  median: 800000,  p75: 1500000, p90: 3000000 },
      2019: { p25: 550000,  median: 900000,  p75: 1700000, p90: 3200000 },
      2020: { p25: 500000,  median: 850000,  p75: 1600000, p90: 3000000 },
      2021: { p25: 600000,  median: 1000000, p75: 1900000, p90: 3800000 },
      2022: { p25: 700000,  median: 1200000, p75: 2200000, p90: 4500000 },
      2023: { p25: 750000,  median: 1300000, p75: 2400000, p90: 5000000 },
      2024: { p25: 800000,  median: 1400000, p75: 2600000, p90: 5500000 },
    },
    cityMultipliers: {
      mumbai:    { s: 1.70, demand: 9.5, note: 'Big 4 HQ, highest CA salaries in India' },
      delhi:     { s: 1.40, demand: 9.0, note: 'ICAI HQ, strong corporate demand' },
      bangalore: { s: 1.30, demand: 8.5, note: 'Startup finance, MNC CFO offices' },
      hyderabad: { s: 1.20, demand: 8.0, note: 'Growing corporate sector' },
      pune:      { s: 1.15, demand: 7.5, note: 'Manufacturing + IT company accounts' },
      chennai:   { s: 1.10, demand: 7.5, note: 'Traditional finance hub' },
      kolkata:   { s: 1.00, demand: 7.0, note: 'Established but slower growth' },
      ahmedabad: { s: 1.05, demand: 7.5, note: 'Adani, Reliance ecosystem' },
      jaipur:    { s: 0.85, demand: 6.5, note: 'Smaller market, more practice-focused' },
      dubai:     { s: 3.80, demand: 8.5, note: 'Tax advisory, IFRS, high demand for Indian CAs' },
      london:    { s: 5.50, demand: 8.0, note: 'ICAEW pathway, strong Big 4 presence' },
    },
    marketHealth: {
      currentDemand: 9.0,
      trend: 'stable_high',
      saturation: 'moderate',
      note: 'GST, new Companies Act, SEBI regulations consistently driving demand. CFO track is gold. Big 4 vs practice vs industry split creates very different career paths.',
    },
    growthTrajectory: {
      0: { min: 500000,  max: 900000,  title: 'Article Trainee / Newly Qualified CA' },
      2: { min: 900000,  max: 1800000, title: 'CA — Industry or Practice' },
      5: { min: 1600000, max: 3500000, title: 'Senior CA / Manager' },
      8: { min: 3000000, max: 6000000, title: 'Senior Manager / Director Finance' },
      12:{ min: 5000000, max: 15000000,title: 'CFO / Finance Head' },
    },
    jobGoalCriteria: {
      mustHave: ['CA Final cleared (ICAI)', 'Articleship at reputed firm', 'Ind AS / IFRS basics', 'GST and Income Tax Act knowledge'],
      stronglyPreferred: ['Big 4 experience', 'ERP (SAP/Oracle)', 'Direct and Indirect tax specialisation', 'Financial modelling'],
      niceToHave: ['CFA', 'MBA', 'International qualification (ACCA)'],
    },
    riskFactors: ['Very long qualification period (4-5 years avg)', 'Low articleship stipend', 'Practice income highly variable'],
    opportunityFactors: ['Recession-proof profession', 'CFO track is one of highest paid in India', 'GST complexity keeping demand very high'],
  },

  banking_rmo: {
    label: 'Banking — Retail / Corporate',
    sector: 'finance',
    keywords: ['bank po','bank officer','relationship manager','rm','branch manager','banker','sbi','hdfc bank','icici bank','axis bank','kotak bank','banking'],
    salaryHistory: {
      2018: { p25: 280000, median: 480000,  p75: 900000,  p90: 1800000 },
      2019: { p25: 300000, median: 520000,  p75: 950000,  p90: 1900000 },
      2020: { p25: 290000, median: 500000,  p75: 920000,  p90: 1800000 },
      2021: { p25: 320000, median: 560000,  p75: 1050000, p90: 2100000 },
      2022: { p25: 350000, median: 620000,  p75: 1150000, p90: 2300000 },
      2023: { p25: 380000, median: 680000,  p75: 1250000, p90: 2500000 },
      2024: { p25: 400000, median: 720000,  p75: 1350000, p90: 2800000 },
    },
    cityMultipliers: {
      mumbai:    { s: 1.50, demand: 9.0, note: 'Financial hub, private bank HQs' },
      delhi:     { s: 1.30, demand: 8.5, note: 'PSU bank HQs' },
      bangalore: { s: 1.20, demand: 8.0, note: 'Wealth management, tech-savvy workforce' },
      hyderabad: { s: 1.15, demand: 7.5 },
      pune:      { s: 1.10, demand: 7.0 },
      chennai:   { s: 1.10, demand: 7.5 },
      kolkata:   { s: 1.00, demand: 7.0 },
      jaipur:    { s: 0.85, demand: 6.5 },
      indore:    { s: 0.82, demand: 6.0 },
    },
    marketHealth: {
      currentDemand: 8.0,
      trend: 'stable_high',
      saturation: 'moderate',
      note: 'Private sector banks (HDFC, ICICI, Kotak) growing aggressively. PSU banks stable with pension. Fintech is disrupting retail banking but creating new hybrid roles.',
    },
    growthTrajectory: {
      0: { min: 250000,  max: 450000,  title: 'Bank PO / Junior Officer' },
      3: { min: 480000,  max: 800000,  title: 'Relationship Manager' },
      6: { min: 800000,  max: 1500000, title: 'Branch Manager / Senior RM' },
      10:{ min: 1500000, max: 3000000, title: 'Zonal Head / Regional Manager' },
      15:{ min: 2500000, max: 6000000, title: 'VP / SVP — Banking' },
    },
    jobGoalCriteria: {
      mustHave: ['Finance/Commerce degree', 'JAIIB for PSU banks', 'KYC/AML compliance knowledge', 'Sales orientation for private sector'],
      stronglyPreferred: ['MBA Finance', 'CFP certification', 'Banking exams (IBPS/SBI PO)', 'Digital banking knowledge'],
    },
    riskFactors: ['PSU banks have slow growth and transfers', 'Private banks have high targets with performance pressure', 'Fintech disrupting traditional roles'],
    opportunityFactors: ['Massive expansion of banking into tier 2/3 cities', 'Wealth management boom creating premium RM roles', 'Digital banking expertise commanding premium'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // HEALTHCARE & MEDICINE
  // ══════════════════════════════════════════════════════════════════════════

  doctor_mbbs: {
    label: 'Doctor (MBBS / MD / Specialist)',
    sector: 'health',
    keywords: ['doctor','mbbs','md','physician','surgeon','specialist','cardiologist','dermatologist','psychiatrist','paediatrician','orthopaedic','general physician','hospital'],
    salaryHistory: {
      2018: { p25: 500000,  median: 900000,  p75: 2000000, p90: 5000000 },
      2019: { p25: 550000,  median: 1000000, p75: 2200000, p90: 5500000 },
      2020: { p25: 600000,  median: 1100000, p75: 2400000, p90: 6000000 }, // COVID boost
      2021: { p25: 700000,  median: 1300000, p75: 2800000, p90: 7000000 },
      2022: { p25: 800000,  median: 1500000, p75: 3200000, p90: 8000000 },
      2023: { p25: 900000,  median: 1700000, p75: 3600000, p90: 9000000 },
      2024: { p25: 1000000, median: 1900000, p75: 4000000, p90: 10000000},
    },
    cityMultipliers: {
      mumbai:    { s: 1.60, demand: 9.5, note: 'Apollo, Lilavati, Breach Candy — highest private pay' },
      delhi:     { s: 1.50, demand: 9.5, note: 'AIIMS ecosystem, Max, Fortis' },
      bangalore: { s: 1.40, demand: 9.0, note: 'Manipal, Narayana Health, Sakra' },
      hyderabad: { s: 1.35, demand: 9.0, note: 'Care, Yashoda — fast growing' },
      pune:      { s: 1.25, demand: 8.5, note: 'Jehangir, Ruby Hall, Columbia Asia' },
      chennai:   { s: 1.30, demand: 9.0, note: 'Apollo HQ, CMC Vellore nearby' },
      kolkata:   { s: 1.10, demand: 8.0, note: 'Apollo Gleneagles, Belle Vue' },
      jaipur:    { s: 1.00, demand: 7.5, note: 'Fortis, Mahatma Gandhi, SMS' },
      kochi:     { s: 1.10, demand: 8.0, note: 'Strong private hospital network' },
      dubai:     { s: 4.50, demand: 9.5, note: 'DHA licensed doctors earn 4-5x India salary' },
      london:    { s: 6.00, demand: 9.0, note: 'NHS — PLAB route, excellent stability' },
      australia: { s: 5.00, demand: 9.0, note: 'AMC pathway, doctor shortage' },
      canada:    { s: 5.50, demand: 9.0, note: 'High demand, MCCQE pathway' },
    },
    marketHealth: {
      currentDemand: 9.5,
      trend: 'growing',
      saturation: 'very_low',
      note: 'India has 1 doctor per 1456 people vs WHO standard of 1:1000. Structural shortage. Telemedicine creating new revenue streams. UAE/UK/Australia offering premium packages to attract Indian doctors.',
    },
    growthTrajectory: {
      0: { min: 500000,  max: 900000,  title: 'MBBS — Resident / Junior Doctor' },
      5: { min: 1200000, max: 2500000, title: 'MD/MS — General Specialist' },
      8: { min: 2000000, max: 5000000, title: 'Consultant Specialist' },
      12:{ min: 4000000, max: 12000000,title: 'Senior Consultant / Department Head' },
      20:{ min: 8000000, max: 50000000,title: 'Private Practice / Director Medical' },
    },
    jobGoalCriteria: {
      mustHave: ['MBBS (5.5 years)', 'Internship completion', 'MCI/NMC registration', 'NEET PG for specialisation'],
      stronglyPreferred: ['Super-speciality (DM/MCh)', 'Hospital group affiliation', 'Private practice alongside hospital'],
      niceToHave: ['USMLE for USA', 'PLAB for UK', 'AMC for Australia'],
    },
    riskFactors: ['Very long qualification period', 'Violence against doctors rising', 'Medico-legal risk increasing', 'Government salary caps in public sector'],
    opportunityFactors: ['Complete recession-proof', 'Telemedicine platforms paying premium for consultants', 'Gulf countries offering 4-5x salary', 'Private practice ceiling is unlimited'],
  },

  pharmacist: {
    label: 'Pharmacist',
    sector: 'health',
    keywords: ['pharmacist','pharmacy','pharma','drug regulatory','clinical pharmacist','hospital pharmacy','retail pharmacy'],
    salaryHistory: {
      2018: { p25: 200000, median: 350000, p75: 700000,  p90: 1500000 },
      2019: { p25: 220000, median: 380000, p75: 750000,  p90: 1600000 },
      2020: { p25: 230000, median: 400000, p75: 800000,  p90: 1800000 },
      2021: { p25: 250000, median: 440000, p75: 900000,  p90: 2000000 },
      2022: { p25: 280000, median: 500000, p75: 1000000, p90: 2300000 },
      2023: { p25: 300000, median: 550000, p75: 1100000, p90: 2500000 },
      2024: { p25: 320000, median: 600000, p75: 1200000, p90: 2800000 },
    },
    cityMultipliers: {
      mumbai:    { s: 1.40, demand: 8.0, note: 'Pharma MNC HQs (Sun, Cipla, Lupin)' },
      hyderabad: { s: 1.35, demand: 8.5, note: 'Pharma capital — Dr Reddys, Aurobindo' },
      ahmedabad: { s: 1.20, demand: 8.0, note: 'Zydus, Alembic, Cadila' },
      bangalore: { s: 1.15, demand: 7.5, note: 'Biocon, clinical research companies' },
      dubai:     { s: 3.50, demand: 8.5, note: 'HAAD licensed pharmacists earn premium' },
    },
    marketHealth: { currentDemand: 8.0, trend: 'growing', saturation: 'low', note: 'Pharma sector growing 10%+ annually. Clinical pharmacist role in hospitals growing fast.' },
    growthTrajectory: {
      0: { min: 200000, max: 400000, title: 'Fresher / Retail Pharmacy' },
      3: { min: 400000, max: 800000, title: 'Industrial / Hospital Pharmacist' },
      7: { min: 800000, max: 1800000, title: 'Senior Manager — Pharma MNC' },
    },
    jobGoalCriteria: {
      mustHave: ['B.Pharm / M.Pharm', 'State Pharmacy Council registration', 'Drug store management knowledge'],
      stronglyPreferred: ['M.Pharm specialisation', 'Clinical research experience', 'Regulatory affairs knowledge'],
    },
    riskFactors: ['Low starting salaries in retail', 'Manual dispensing work getting automated'],
    opportunityFactors: ['Pharma sector export boom', 'Drug regulatory affairs is premium career path', 'Gulf pays 3-4x for licensed pharmacists'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ENGINEERING (NON-IT)
  // ══════════════════════════════════════════════════════════════════════════

  civil_engineer: {
    label: 'Civil Engineer',
    sector: 'engineering',
    keywords: ['civil engineer','structural engineer','construction','infrastructure','highway','bridge','building construction','real estate engineer','site engineer','project engineer civil'],
    salaryHistory: {
      2018: { p25: 250000, median: 420000, p75: 800000,  p90: 1500000 },
      2019: { p25: 270000, median: 450000, p75: 850000,  p90: 1600000 },
      2020: { p25: 250000, median: 420000, p75: 800000,  p90: 1500000 },
      2021: { p25: 280000, median: 480000, p75: 900000,  p90: 1700000 },
      2022: { p25: 320000, median: 550000, p75: 1050000, p90: 2000000 },
      2023: { p25: 360000, median: 620000, p75: 1200000, p90: 2300000 },
      2024: { p25: 380000, median: 660000, p75: 1300000, p90: 2500000 },
    },
    cityMultipliers: {
      mumbai:    { s: 1.50, demand: 9.0, note: 'Massive infra projects — metro, coastal road' },
      delhi:     { s: 1.40, demand: 9.0, note: 'DMIC, RRTS, smart city projects' },
      hyderabad: { s: 1.30, demand: 8.5, note: 'ORR, pharma SEZs, IT parks construction' },
      bangalore: { s: 1.25, demand: 8.0, note: 'Metro phase 2, tech park construction' },
      pune:      { s: 1.20, demand: 8.0, note: 'Ring road, industrial estates' },
      ahmedabad: { s: 1.20, demand: 8.5, note: 'GIFT City, bullet train project' },
      surat:     { s: 1.10, demand: 7.5, note: 'Diamond bourse construction, smart city' },
      dubai:     { s: 4.00, demand: 9.5, note: 'Expo legacy, NEOM overflow, perpetual construction' },
      abu_dhabi: { s: 3.80, demand: 9.0, note: 'Government mega-projects' },
      riyadh:    { s: 3.50, demand: 9.5, note: 'NEOM, Vision 2030 — massive demand' },
      doha:      { s: 3.50, demand: 8.5, note: 'Post-World Cup, airport and infra expansion' },
    },
    marketHealth: {
      currentDemand: 9.0,
      trend: 'growing',
      saturation: 'low',
      note: 'India infrastructure spend at historic high — ₹10 lakh crore per year. Gulf countries Vision 2030 creating generational demand. Skills gap is acute — not enough qualified engineers.',
    },
    growthTrajectory: {
      0: { min: 240000, max: 420000, title: 'Site Engineer / Junior Civil Engineer' },
      3: { min: 450000, max: 900000, title: 'Civil Engineer' },
      7: { min: 900000, max: 2000000, title: 'Project Manager (Civil)' },
      12:{ min: 2000000, max: 5000000, title: 'Senior PM / DGM Projects' },
    },
    jobGoalCriteria: {
      mustHave: ['B.Tech/BE Civil', 'AutoCAD', 'Structural design basics', 'Site execution knowledge'],
      stronglyPreferred: ['STAAD Pro / ETABS', 'Project management (PMP)', 'Quantity surveying', 'BIM (Revit)'],
      niceToHave: ['M.Tech Structures', 'LEED Green Building certification'],
    },
    riskFactors: ['Project-based employment creates income gaps', 'Site work is physically demanding and location-restricted', 'Monsoon/weather delays affect project cash flows'],
    opportunityFactors: ['Gulf pays 3-5x Indian salary for experienced engineers', 'Smart city and metro projects creating massive demand', 'Infrastructure PSU roles offer unmatched stability'],
  },

  mechanical_engineer: {
    label: 'Mechanical Engineer',
    sector: 'engineering',
    keywords: ['mechanical engineer','manufacturing engineer','production engineer','quality engineer','automobile engineer','design engineer','thermal engineer','hvac engineer'],
    salaryHistory: {
      2018: { p25: 240000, median: 400000, p75: 750000,  p90: 1400000 },
      2019: { p25: 260000, median: 430000, p75: 800000,  p90: 1500000 },
      2020: { p25: 240000, median: 400000, p75: 750000,  p90: 1400000 },
      2021: { p25: 270000, median: 450000, p75: 850000,  p90: 1600000 },
      2022: { p25: 310000, median: 520000, p75: 980000,  p90: 1900000 },
      2023: { p25: 340000, median: 580000, p75: 1100000, p90: 2100000 },
      2024: { p25: 360000, median: 620000, p75: 1200000, p90: 2300000 },
    },
    cityMultipliers: {
      pune:      { s: 1.40, demand: 9.0, note: 'Auto capital — Tata, Bajaj, Mercedes, Volkswagen' },
      chennai:   { s: 1.35, demand: 8.5, note: 'Detroit of India — Hyundai, Ford, BMW' },
      delhi:     { s: 1.25, demand: 8.0, note: 'Maruti Suzuki, Hero, aerospace sector' },
      bangalore: { s: 1.30, demand: 8.5, note: 'HAL, ISRO, aerospace and defence' },
      hyderabad: { s: 1.20, demand: 8.0, note: 'Defence PSUs, pharma machinery' },
      ahmedabad: { s: 1.15, demand: 7.5, note: 'Adani industrial, chemical plants' },
      surat:     { s: 1.10, demand: 7.5, note: 'Textile machinery, diamond processing equipment' },
      dubai:     { s: 3.50, demand: 8.5, note: 'Oil & gas, maritime engineering' },
      abu_dhabi: { s: 3.80, demand: 9.0, note: 'ADNOC projects, nuclear plant operations' },
    },
    marketHealth: {
      currentDemand: 8.5,
      trend: 'growing',
      saturation: 'low',
      note: 'EV revolution creating massive retooling of automotive workforce. Green energy (solar, wind) creating new mechanical roles. Defence production boost (Make in India) adding jobs.',
    },
    growthTrajectory: {
      0: { min: 220000, max: 400000, title: 'Junior Engineer / Graduate Trainee' },
      3: { min: 400000, max: 800000, title: 'Mechanical Engineer' },
      7: { min: 800000, max: 1800000, title: 'Senior Engineer / Deputy Manager' },
      12:{ min: 1800000, max: 4000000, title: 'Manager / AGM Manufacturing' },
    },
    jobGoalCriteria: {
      mustHave: ['B.Tech Mechanical', 'CAD tools (SolidWorks/AutoCAD)', 'Manufacturing processes', 'Quality standards (ISO/BIS)'],
      stronglyPreferred: ['Six Sigma', 'EV/Hybrid technology', 'CFD/FEA software', 'Lean manufacturing'],
    },
    riskFactors: ['Traditional auto roles being automated', 'EV transition creating skills gap', 'Lower salary ceiling vs IT counterparts'],
    opportunityFactors: ['EV sector creating completely new specialisations', 'Defence manufacturing boom in India', 'Gulf oil sector pays 3-4x'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SALES & MARKETING
  // ══════════════════════════════════════════════════════════════════════════

  digital_marketing: {
    label: 'Digital Marketing / Growth',
    sector: 'marketing',
    keywords: ['digital marketing','performance marketing','growth marketing','seo','sem','social media marketing','content marketing','ppc','paid ads','brand marketing','marketing manager','cmo'],
    salaryHistory: {
      2018: { p25: 250000, median: 450000, p75: 900000,  p90: 1800000 },
      2019: { p25: 280000, median: 500000, p75: 1000000, p90: 2000000 },
      2020: { p25: 300000, median: 550000, p75: 1100000, p90: 2300000 }, // COVID boosted digital
      2021: { p25: 380000, median: 700000, p75: 1400000, p90: 3000000 },
      2022: { p25: 450000, median: 850000, p75: 1700000, p90: 3500000 },
      2023: { p25: 420000, median: 800000, p75: 1600000, p90: 3200000 },
      2024: { p25: 440000, median: 850000, p75: 1700000, p90: 3500000 },
    },
    cityMultipliers: {
      bangalore: { s: 1.40, demand: 9.0, note: 'Startup ecosystem, D2C brands, highest growth marketing salaries' },
      mumbai:    { s: 1.45, demand: 9.0, note: 'Advertising capital, FMCG brand marketing, agency HQs' },
      delhi:     { s: 1.30, demand: 8.5, note: 'E-commerce, edtech, media companies' },
      hyderabad: { s: 1.15, demand: 7.5, note: 'Growing but smaller ecosystem' },
      pune:      { s: 1.10, demand: 7.0, note: 'Automotive and manufacturing brands' },
      dubai:     { s: 3.00, demand: 8.0, note: 'Luxury brands, e-commerce, regional offices' },
      singapore: { s: 4.00, demand: 8.5, note: 'APAC regional marketing roles' },
    },
    marketHealth: {
      currentDemand: 9.0,
      trend: 'growing',
      saturation: 'moderate',
      note: 'Every business needs digital presence. Performance marketing (Meta/Google Ads) is highest-paid sub-role. AI is augmenting marketers — those who use AI tools earning 30% more.',
    },
    growthTrajectory: {
      0: { min: 200000, max: 400000, title: 'Digital Marketing Executive' },
      2: { min: 400000, max: 800000, title: 'Digital Marketing Manager' },
      5: { min: 800000, max: 1800000, title: 'Senior Manager / Head of Growth' },
      8: { min: 1800000, max: 4000000, title: 'VP Marketing / CMO (startups)' },
    },
    jobGoalCriteria: {
      mustHave: ['Google Analytics / GA4', 'Meta Ads / Google Ads', 'Content strategy basics', 'SEO fundamentals'],
      stronglyPreferred: ['Performance marketing ROAS management', 'Email marketing automation', 'CRM tools (HubSpot/Salesforce)', 'Video content strategy'],
      niceToHave: ['MBA Marketing', 'Platform certifications (Meta Blueprint, Google Ads)'],
    },
    riskFactors: ['AI generating content — reducing need for pure content writers', 'Platform algorithm changes disrupting strategies overnight', 'High burnout in performance marketing'],
    opportunityFactors: ['D2C brand explosion creating thousands of marketing roles', 'Performance marketers who manage ₹10Cr+ monthly budgets earn premium', 'Creator economy creating hybrid brand-creator roles'],
  },

  sales_b2b: {
    label: 'B2B Sales / Business Development',
    sector: 'sales',
    keywords: ['sales','business development','bd','account executive','ae','sales manager','enterprise sales','b2b sales','field sales','inside sales','key account manager','kam'],
    salaryHistory: {
      2018: { p25: 300000, median: 550000, p75: 1100000, p90: 2200000 },
      2019: { p25: 330000, median: 600000, p75: 1200000, p90: 2500000 },
      2020: { p25: 280000, median: 520000, p75: 1050000, p90: 2100000 }, // COVID hit sales hard
      2021: { p25: 350000, median: 650000, p75: 1300000, p90: 2700000 },
      2022: { p25: 420000, median: 800000, p75: 1600000, p90: 3300000 },
      2023: { p25: 450000, median: 850000, p75: 1700000, p90: 3500000 },
      2024: { p25: 470000, median: 900000, p75: 1800000, p90: 3800000 },
    },
    cityMultipliers: {
      mumbai:    { s: 1.50, demand: 9.0, note: 'Financial services, FMCG, manufacturing HQs' },
      bangalore: { s: 1.45, demand: 9.0, note: 'SaaS sales, tech enterprise sales, highest variable pay' },
      delhi:     { s: 1.35, demand: 8.5, note: 'Government enterprise, FMCG North India' },
      pune:      { s: 1.20, demand: 8.0, note: 'Auto industry, IT sales' },
      hyderabad: { s: 1.20, demand: 7.5, note: 'IT enterprise sales' },
      dubai:     { s: 3.00, demand: 8.5, note: 'Tax-free + commission = very high total comp' },
    },
    marketHealth: {
      currentDemand: 9.0,
      trend: 'stable_high',
      saturation: 'low',
      note: 'Sales is recession-resistant. SaaS sales (AEs at product companies) command the highest salaries. Variable pay can double base salary. Good sales talent is always scarce.',
    },
    growthTrajectory: {
      0: { min: 240000, max: 450000, title: 'Sales Executive / SDR' },
      3: { min: 500000, max: 1000000, title: 'Account Manager / BDE' },
      6: { min: 1000000, max: 2500000, title: 'Senior Sales Manager / Regional Head' },
      10:{ min: 2500000, max: 8000000, title: 'VP Sales / National Sales Head' },
    },
    jobGoalCriteria: {
      mustHave: ['Communication skills', 'CRM familiarity (Salesforce/Zoho)', 'Pipeline management', 'Objection handling'],
      stronglyPreferred: ['Industry domain knowledge', 'SaaS product understanding', 'Negotiation skills', 'Demo/presentation skills'],
    },
    riskFactors: ['Income highly variable — bad quarter can hurt significantly', 'High-pressure targets', 'Burnout from constant rejection'],
    opportunityFactors: ['Fastest path to ₹1Cr+ total comp in non-IIT/IIM background', 'SaaS companies paying US-equivalent OTEs for top performers', 'Gulf + India tax arbitrage for high-earning sales professionals'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // EDUCATION & TEACHING
  // ══════════════════════════════════════════════════════════════════════════

  teacher_school: {
    label: 'School Teacher',
    sector: 'education',
    keywords: ['teacher','school teacher','lecturer','assistant professor','faculty','teaching','educator','tutor','coaching','cbse teacher','ib teacher','international school'],
    salaryHistory: {
      2018: { p25: 150000, median: 280000, p75: 600000,  p90: 1200000 },
      2019: { p25: 160000, median: 300000, p75: 650000,  p90: 1300000 },
      2020: { p25: 150000, median: 290000, p75: 630000,  p90: 1250000 },
      2021: { p25: 170000, median: 320000, p75: 700000,  p90: 1400000 },
      2022: { p25: 190000, median: 360000, p75: 800000,  p90: 1600000 },
      2023: { p25: 210000, median: 400000, p75: 900000,  p90: 1800000 },
      2024: { p25: 230000, median: 440000, p75: 1000000, p90: 2000000 },
    },
    cityMultipliers: {
      mumbai:    { s: 1.60, demand: 8.5, note: 'International schools (JBCN, Dhirubhai, DAIS) pay premium' },
      delhi:     { s: 1.50, demand: 8.5, note: 'British School, American Embassy School — expat rates' },
      bangalore: { s: 1.40, demand: 8.0, note: 'International school belt — Whitefield, Sarjapur' },
      hyderabad: { s: 1.25, demand: 7.5, note: 'Growing international school market' },
      pune:      { s: 1.20, demand: 7.5, note: 'Well-established private school market' },
      chennai:   { s: 1.15, demand: 7.0, note: 'Strong education culture, CBSE and IB schools' },
      jaipur:    { s: 0.90, demand: 6.5, note: 'Government and private schools, coaching institutes' },
      dubai:     { s: 4.00, demand: 9.0, note: 'KHDA registered teachers — tax free + furnished housing' },
      abu_dhabi: { s: 4.20, demand: 9.0, note: 'ADEK licensed schools — premium pay' },
      doha:      { s: 3.80, demand: 8.5, note: 'Qatar National Curriculum schools — strong packages' },
      london:    { s: 4.50, demand: 8.5, note: 'UK DfE certified — strong demand esp. maths/science' },
    },
    marketHealth: {
      currentDemand: 8.0,
      trend: 'stable_high',
      saturation: 'moderate',
      note: 'Private and international schools growing faster than supply of qualified teachers. STEM subjects always undersupplied. Gulf countries perpetually seeking Indian teachers due to cultural fit with large Indian diaspora.',
    },
    growthTrajectory: {
      0: { min: 150000, max: 300000, title: 'Junior Teacher / PGT/TGT' },
      3: { min: 300000, max: 600000, title: 'Experienced Teacher' },
      7: { min: 600000, max: 1200000, title: 'Senior Teacher / HOD' },
      12:{ min: 1200000, max: 2500000, title: 'Principal / Vice Principal' },
    },
    jobGoalCriteria: {
      mustHave: ['B.Ed degree', 'Subject mastery', 'CTET/TET clearance for government', 'Communication skills'],
      stronglyPreferred: ['IB/Cambridge training', 'Subject honours degree', 'Special needs training', 'Tech integration skills'],
      niceToHave: ['M.Ed', 'International teaching license', 'IELTS 7+ for Gulf/UK'],
    },
    riskFactors: ['Low starting salaries in India', 'Government school salaries stuck in pay commission cycles', 'Edtech disrupting traditional teaching'],
    opportunityFactors: ['Gulf pays 4-6x India salary — most stable expat job category', 'International school movement in India creating premium private roles', 'Online tutoring/coaching can double income alongside school job'],
  },

  professor_university: {
    label: 'University Professor / Researcher',
    sector: 'education',
    keywords: ['professor','assistant professor','associate professor','researcher','phd','research scientist','iit faculty','iim faculty','university lecturer','academic'],
    salaryHistory: {
      2018: { p25: 500000,  median: 900000,  p75: 1600000, p90: 2800000 },
      2019: { p25: 530000,  median: 960000,  p75: 1700000, p90: 3000000 },
      2020: { p25: 530000,  median: 970000,  p75: 1720000, p90: 3050000 },
      2021: { p25: 560000,  median: 1020000, p75: 1800000, p90: 3200000 },
      2022: { p25: 600000,  median: 1100000, p75: 1950000, p90: 3500000 },
      2023: { p25: 630000,  median: 1150000, p75: 2050000, p90: 3700000 },
      2024: { p25: 660000,  median: 1200000, p75: 2150000, p90: 3900000 },
    },
    cityMultipliers: {
      delhi:     { s: 1.30, demand: 8.0, note: 'IIT Delhi, JNU, DU — strong academic cluster' },
      bangalore: { s: 1.20, demand: 7.5, note: 'IISc, IIM-B, NLSIU' },
      mumbai:    { s: 1.25, demand: 7.5, note: 'IIT Bombay, IIM-A, TISS' },
      hyderabad: { s: 1.15, demand: 7.0, note: 'University of Hyderabad, IIT-H, IIIT-H' },
      chennai:   { s: 1.10, demand: 7.0, note: 'IIT Madras, Anna University' },
      dubai:     { s: 3.50, demand: 7.5, note: 'BITS Pilani Dubai, Amity, Manipal — strong expat academic market' },
    },
    marketHealth: { currentDemand: 7.0, trend: 'stable_high', saturation: 'moderate', note: 'PhD required for IIT/IIM. Industry-experienced faculty highly valued. Research grants are supplement income.' },
    growthTrajectory: {
      0: { min: 500000,  max: 800000,  title: 'Assistant Professor (Entry)' },
      5: { min: 800000,  max: 1400000, title: 'Associate Professor' },
      10:{ min: 1400000, max: 2500000, title: 'Professor' },
      15:{ min: 2000000, max: 4000000, title: 'Senior Professor / Department Head / Dean' },
    },
    jobGoalCriteria: {
      mustHave: ['PhD from reputed institution', 'Research publications (minimum 5 indexed journals)', 'UGC NET clearance for non-IIT', 'Teaching experience'],
      stronglyPreferred: ['Post-doctoral experience', 'Research grants (DST/SERB)', 'International collaborations', 'Patent filings'],
    },
    riskFactors: ['Very long PhD path (5-7 years)', 'Publish-or-perish pressure', 'IIT/IIM positions extremely competitive'],
    opportunityFactors: ['7th Pay Commission scales are very competitive', 'Research grants add significantly to income', 'Consultancy income allowed — top faculty earn 50-100% extra'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEGAL
  // ══════════════════════════════════════════════════════════════════════════

  lawyer: {
    label: 'Lawyer / Advocate',
    sector: 'legal',
    keywords: ['lawyer','advocate','attorney','legal','llb','corporate lawyer','litigation','law firm','general counsel','in-house legal','legal counsel','barrister'],
    salaryHistory: {
      2018: { p25: 250000, median: 500000, p75: 1500000, p90: 5000000 },
      2019: { p25: 280000, median: 560000, p75: 1700000, p90: 5500000 },
      2020: { p25: 260000, median: 520000, p75: 1600000, p90: 5200000 },
      2021: { p25: 300000, median: 600000, p75: 1900000, p90: 6500000 },
      2022: { p25: 350000, median: 700000, p75: 2200000, p90: 8000000 },
      2023: { p25: 400000, median: 800000, p75: 2500000, p90: 9000000 },
      2024: { p25: 450000, median: 900000, p75: 2800000, p90: 10000000},
    },
    cityMultipliers: {
      mumbai:    { s: 2.00, demand: 9.5, note: 'Commercial capital — AZB, Shardul, Cyril Amarchand, highest law firm pay' },
      delhi:     { s: 1.80, demand: 9.5, note: 'Supreme Court, High Court, NLU-D ecosystem' },
      bangalore: { s: 1.40, demand: 8.5, note: 'Tech company in-house counsel, startup legal' },
      hyderabad: { s: 1.20, demand: 7.5, note: 'Growing corporate legal market' },
      chennai:   { s: 1.20, demand: 7.5, note: 'Madras HC, strong criminal and corporate practice' },
      london:    { s: 7.00, demand: 9.0, note: 'Magic Circle firms — Clifford Chance, Freshfields' },
      dubai:     { s: 4.50, demand: 8.5, note: 'DIFC courts, commercial law booming' },
      singapore: { s: 5.50, demand: 8.5, note: 'SICC, international arbitration hub' },
    },
    marketHealth: {
      currentDemand: 8.5,
      trend: 'growing',
      saturation: 'moderate',
      note: 'Income is highly bimodal — top 5% earn 100x bottom 50%. NLU graduates from Tier 1 get top law firm jobs. Litigation track is slow but independent. In-house counsel track is most stable.',
    },
    growthTrajectory: {
      0: { min: 200000, max: 500000, title: 'Junior Associate / Articled Clerk' },
      3: { min: 500000, max: 1200000, title: 'Associate' },
      7: { min: 1200000, max: 3500000, title: 'Senior Associate / Counsel' },
      12:{ min: 3000000, max: 10000000,title: 'Partner / General Counsel' },
    },
    jobGoalCriteria: {
      mustHave: ['LLB (5-year integrated or 3-year)', 'BCI enrollment', 'Internship at reputed firm or court'],
      stronglyPreferred: ['LLM specialisation (tax/corporate/IP)', 'Tier 1 NLU degree', 'NLAT/CLAT top rank', 'Moot court experience'],
      niceToHave: ['International LLM (Harvard/Oxford)', 'Bar qualification (UK/USA)', 'ADR/Arbitration certification'],
    },
    riskFactors: ['Extreme income inequality in profession', 'Litigation track slow income for first 5 years', 'Very long partnership track at big firms (10+ years)'],
    opportunityFactors: ['In-house counsel track at tech/startup companies is fastest-growing', 'International arbitration creating premium roles', 'Data privacy (DPDP Act) creating entirely new specialisation'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GOVERNMENT / PSU
  // ══════════════════════════════════════════════════════════════════════════

  ias_ips: {
    label: 'IAS / IPS / IFS Civil Servant',
    sector: 'government',
    keywords: ['ias','ips','ifs','civil service','upsc','civil servant','collector','district magistrate','dm','sp','superintendent of police','ias officer','government officer'],
    salaryHistory: {
      // Government pay follows Pay Commission — relatively stable
      2018: { p25: 560000, median: 800000, p75: 1400000, p90: 2800000 },
      2019: { p25: 580000, median: 820000, p75: 1450000, p90: 2900000 },
      2020: { p25: 580000, median: 820000, p75: 1450000, p90: 2900000 },
      2021: { p25: 600000, median: 850000, p75: 1500000, p90: 3000000 },
      2022: { p25: 620000, median: 880000, p75: 1550000, p90: 3100000 },
      2023: { p25: 650000, median: 920000, p75: 1600000, p90: 3200000 },
      2024: { p25: 680000, median: 960000, p75: 1680000, p90: 3400000 },
    },
    cityMultipliers: {
      delhi:     { s: 1.30, demand: 9.0, note: 'Central secretariat postings — policy power' },
      mumbai:    { s: 1.20, demand: 8.0, note: 'Maharashtra cadre — economic power state' },
      bangalore: { s: 1.10, demand: 7.5, note: 'Karnataka cadre' },
      hyderabad: { s: 1.10, demand: 7.5, note: 'Telangana cadre' },
      // Note: IAS is cadre-based — posting determines "city"
    },
    marketHealth: {
      currentDemand: 9.5, // competition is extreme but demand for aspirants is perpetual
      trend: 'stable_high',
      saturation: 'very_high', // 1M+ aspirants for ~800 posts
      note: 'Selection rate <0.1%. Non-monetary benefits (housing, car, prestige, power) are unmatched. Total compensation including perks is 2-3x stated salary. Pension under NPS.',
    },
    growthTrajectory: {
      0: { min: 560000,  max: 700000,  title: 'Probationer / SDM' },
      5: { min: 700000,  max: 1000000, title: 'SDM / Block Officer' },
      10:{ min: 1000000, max: 1600000, title: 'District Collector / SP' },
      20:{ min: 1600000, max: 2800000, title: 'Secretary / DGP' },
      30:{ min: 2500000, max: 4000000, title: 'Chief Secretary / DG' },
    },
    jobGoalCriteria: {
      mustHave: ['UPSC Prelims + Mains + Interview clearance', 'Graduation (any stream)', 'Age 21-32 (with relaxations)'],
      stronglyPreferred: ['Optional subject mastery', 'GS paper strong foundation', 'Essay writing', 'Interview preparation at top coaching'],
      niceToHave: ['Prior government experience', 'Regional language proficiency'],
    },
    riskFactors: ['Extremely low selection rate (~0.05%)', 'Years of preparation with no income', 'Transfer postings disrupt family life', 'Political pressure in postings'],
    opportunityFactors: ['Unmatched power to create societal impact', 'Total compensation with perks is very competitive', 'Post-retirement opportunities (commissions, boards, PSU boards)', 'Prestige and security unmatched in any private sector role'],
  },

  psu_engineer: {
    label: 'PSU Engineer (ONGC/BHEL/NTPC/ISRO/DRDO)',
    sector: 'government',
    keywords: ['psu','ongc','bhel','ntpc','isro','drdo','bel','gail','coal india','power grid','hpcl','iocl','gate exam','government engineer','pseb'],
    salaryHistory: {
      2018: { p25: 550000, median: 800000, p75: 1200000, p90: 1800000 },
      2019: { p25: 580000, median: 850000, p75: 1250000, p90: 1900000 },
      2020: { p25: 590000, median: 860000, p75: 1270000, p90: 1920000 },
      2021: { p25: 620000, median: 900000, p75: 1350000, p90: 2000000 },
      2022: { p25: 650000, median: 950000, p75: 1400000, p90: 2100000 },
      2023: { p25: 680000, median: 1000000,p75: 1500000, p90: 2200000 },
      2024: { p25: 720000, median: 1050000,p75: 1580000, p90: 2350000 },
    },
    cityMultipliers: {
      delhi:     { s: 1.20, demand: 8.0, note: 'Ministry-linked PSUs' },
      mumbai:    { s: 1.15, demand: 8.0, note: 'ONGC western offshore, BPCL' },
      bangalore: { s: 1.10, demand: 8.5, note: 'ISRO, DRDO, BEL, HAL' },
      hyderabad: { s: 1.10, demand: 8.0, note: 'DRDO, BDL, ECIL' },
      // PSU postings are location-variable
    },
    marketHealth: { currentDemand: 9.0, trend: 'stable_high', saturation: 'high', note: 'GATE score is the gateway. Job security, pension (NPS), housing, perks make total compensation much better than stated salary. ISRO/DRDO are dream employers for aerospace engineers.' },
    growthTrajectory: {
      0: { min: 540000,  max: 700000,  title: 'E1/E2 — Junior Engineer' },
      5: { min: 750000,  max: 1100000, title: 'E3/E4 — Engineer' },
      10:{ min: 1100000, max: 1600000, title: 'E5/E6 — Senior Manager' },
      20:{ min: 1600000, max: 2500000, title: 'E7/E8 — DGM/GM' },
    },
    jobGoalCriteria: {
      mustHave: ['B.Tech from recognised university', 'GATE score (PSU cutoffs high)', 'CPSU aptitude test for some'],
      stronglyPreferred: ['GATE All India Rank top 500', 'Domain expertise (petroleum/power/defence)', 'Technical interview preparation'],
    },
    riskFactors: ['Very slow career growth (2-3 year mandatory stays at each grade)', 'Transfer to remote locations', 'Politics in promotion at senior levels'],
    opportunityFactors: ['Unmatched job security', 'Total compensation 40-50% higher than CTC due to perks', 'Housing, medical, LTC, gratuity, pension — all add value', 'ISRO is globally respected — career prestige'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // HOSPITALITY & FOOD
  // ══════════════════════════════════════════════════════════════════════════

  hotel_hospitality: {
    label: 'Hotel / Hospitality Professional',
    sector: 'hospitality',
    keywords: ['hotel','hospitality','hotel management','front office','f&b','food and beverage','housekeeping','hotel gm','resort','tourism','travel','oberoi','taj hotels','marriott','hilton'],
    salaryHistory: {
      2018: { p25: 200000, median: 380000, p75: 800000,  p90: 2000000 },
      2019: { p25: 220000, median: 400000, p75: 850000,  p90: 2200000 },
      2020: { p25: 120000, median: 220000, p75: 500000,  p90: 1200000 }, // COVID devastated hospitality
      2021: { p25: 180000, median: 320000, p75: 700000,  p90: 1600000 }, // partial recovery
      2022: { p25: 230000, median: 420000, p75: 900000,  p90: 2300000 }, // strong recovery
      2023: { p25: 260000, median: 480000, p75: 1050000, p90: 2600000 },
      2024: { p25: 290000, median: 540000, p75: 1200000, p90: 3000000 },
    },
    cityMultipliers: {
      mumbai:    { s: 1.60, demand: 9.0, note: 'Luxury hotel capital — Taj Mahal Palace, Oberoi, JW Marriott' },
      delhi:     { s: 1.50, demand: 8.5, note: 'MICE capital, hotel zones near Aerocity' },
      goa:       { s: 1.30, demand: 8.5, note: 'Tourism hub — seasonal but high-paying resort roles' },
      bangalore: { s: 1.30, demand: 8.0, note: 'Business hotels, convention centres' },
      jaipur:    { s: 1.20, demand: 8.5, note: 'Heritage luxury hotels — Taj Rambagh, Oberoi Rajvilas' },
      dubai:     { s: 4.50, demand: 9.5, note: 'Service + tax-free = very high total comp. Major hotel chains.' },
      abu_dhabi: { s: 4.20, demand: 9.0, note: 'Luxury resorts, F1 events hospitality' },
      doha:      { s: 4.00, demand: 8.5, note: 'World Cup legacy infrastructure operational' },
      london:    { s: 4.50, demand: 8.0, note: 'Luxury segment strong, Mayfair hotels pay top rates' },
      singapore: { s: 4.00, demand: 8.5, note: 'Marina Bay Sands, Raffles — premium hospitality' },
    },
    marketHealth: {
      currentDemand: 8.5,
      trend: 'growing',
      saturation: 'low',
      note: 'Post-COVID recovery complete. Revenge travel driving record occupancy. Luxury segment growing 15% annually. Major gap at supervisor/manager level — IHM graduates in high demand for Gulf.',
    },
    growthTrajectory: {
      0: { min: 180000, max: 360000, title: 'Management Trainee / Executive' },
      3: { min: 380000, max: 700000, title: 'Supervisor / Assistant Manager' },
      6: { min: 700000, max: 1500000, title: 'Manager / Department Head' },
      10:{ min: 1500000, max: 4000000, title: 'General Manager (property-level)' },
    },
    jobGoalCriteria: {
      mustHave: ['IHM degree or equivalent', 'Guest service orientation', 'Communication skills', 'Food safety certification'],
      stronglyPreferred: ['Luxury brand training (Taj/Oberoi school experience)', 'F&B cost control', 'Revenue management', 'International exposure'],
      niceToHave: ['WSET wine certification', 'Sommelier training', 'International culinary diploma'],
    },
    riskFactors: ['Industry highly cyclical — COVID showed extreme vulnerability', 'Night shifts and weekends non-negotiable', 'Career plateaus at mid-level in India without Gulf exposure'],
    opportunityFactors: ['Gulf pays 4-5x India for equivalent role + tax-free', 'Luxury segment CEO track is well-defined and achievable', 'India tourism boom creating new luxury properties every year'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MEDIA, JOURNALISM & CREATIVE
  // ══════════════════════════════════════════════════════════════════════════

  journalist_media: {
    label: 'Journalist / Media Professional',
    sector: 'media',
    keywords: ['journalist','reporter','editor','news anchor','broadcast journalist','digital journalist','content creator','media','newspaper','television','ndtv','times of india','hindustan times'],
    salaryHistory: {
      2018: { p25: 200000, median: 380000, p75: 750000,  p90: 1800000 },
      2019: { p25: 210000, median: 400000, p75: 800000,  p90: 1900000 },
      2020: { p25: 190000, median: 360000, p75: 720000,  p90: 1700000 },
      2021: { p25: 220000, median: 420000, p75: 850000,  p90: 2100000 },
      2022: { p25: 250000, median: 480000, p75: 980000,  p90: 2400000 },
      2023: { p25: 270000, median: 520000, p75: 1050000, p90: 2600000 },
      2024: { p25: 290000, median: 560000, p75: 1150000, p90: 2900000 },
    },
    cityMultipliers: {
      delhi:     { s: 1.60, demand: 9.0, note: 'National media capital — all major print and TV HQs' },
      mumbai:    { s: 1.50, demand: 8.5, note: 'Bollywood journalism, digital media startups' },
      bangalore: { s: 1.20, demand: 7.5, note: 'Tech journalism, startup media' },
      hyderabad: { s: 1.00, demand: 7.0, note: 'Regional Telugu media, growing digital' },
      dubai:     { s: 2.80, demand: 7.5, note: 'Gulf News, Khaleej Times, Arabic media with English editors' },
    },
    marketHealth: {
      currentDemand: 7.0,
      trend: 'declining',
      saturation: 'high',
      note: 'Print advertising collapsing. Digital transition underway but not enough high-paying digital roles yet. Niche specialisation (tech/finance/health journalism) is premium. YouTubers now earning more than senior journalists.',
    },
    growthTrajectory: {
      0: { min: 180000, max: 350000, title: 'Junior Reporter / Sub-Editor' },
      5: { min: 400000, max: 850000, title: 'Senior Reporter / Copy Editor' },
      10:{ min: 850000, max: 2000000, title: 'Senior Editor / Bureau Chief' },
    },
    jobGoalCriteria: {
      mustHave: ['Mass communication / journalism degree or strong portfolio', 'Writing/reporting skills', 'News sense', 'Source network'],
      stronglyPreferred: ['Specialisation (tech/business/politics)', 'Video journalism skills', 'Social media presence', 'Data journalism (Excel/Tableau)'],
    },
    riskFactors: ['Industry under severe revenue pressure', 'Job security declining at print outlets', 'Self-censorship pressure in current environment'],
    opportunityFactors: ['Content marketing + journalism hybrid paying very well', 'Investigative journalism still well-funded at few outlets', 'Own newsletter/YouTube channel can exceed traditional media salary'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LOGISTICS & SUPPLY CHAIN
  // ══════════════════════════════════════════════════════════════════════════

  logistics_supply_chain: {
    label: 'Logistics / Supply Chain Manager',
    sector: 'logistics',
    keywords: ['logistics','supply chain','scm','procurement','warehouse','inventory','transport','fleet','distribution','operations manager logistics','3pl','import export','customs'],
    salaryHistory: {
      2018: { p25: 300000, median: 550000, p75: 1100000, p90: 2000000 },
      2019: { p25: 330000, median: 600000, p75: 1200000, p90: 2200000 },
      2020: { p25: 320000, median: 580000, p75: 1150000, p90: 2100000 },
      2021: { p25: 370000, median: 680000, p75: 1350000, p90: 2500000 },
      2022: { p25: 430000, median: 800000, p75: 1600000, p90: 3000000 },
      2023: { p25: 460000, median: 860000, p75: 1700000, p90: 3200000 },
      2024: { p25: 490000, median: 920000, p75: 1850000, p90: 3500000 },
    },
    cityMultipliers: {
      mumbai:    { s: 1.50, demand: 9.5, note: 'JNPT — largest container port, 3PL HQs' },
      delhi:     { s: 1.35, demand: 9.0, note: 'DMIC, warehousing hubs, e-commerce logistics' },
      bangalore: { s: 1.25, demand: 8.5, note: 'E-commerce fulfillment, Amazon/Flipkart' },
      hyderabad: { s: 1.20, demand: 8.0, note: 'Pharma cold chain, manufacturing logistics' },
      pune:      { s: 1.25, demand: 8.5, note: 'Auto industry SCM' },
      ahmedabad: { s: 1.15, demand: 8.0, note: 'Port of Mundra, textile export logistics' },
      chennai:   { s: 1.20, demand: 8.5, note: 'Auto export hub, Chennai port' },
      dubai:     { s: 3.80, demand: 9.5, note: 'Jebel Ali — global logistics hub, very high demand' },
      singapore: { s: 4.50, demand: 9.5, note: 'World #1 port — global SCM hub' },
    },
    marketHealth: {
      currentDemand: 9.5,
      trend: 'growing',
      saturation: 'low',
      note: 'E-commerce explosion + PM Gati Shakti national logistics policy = decade of growth. Technology-savvy SCM professionals (data analytics + logistics) command premium. Gulf logistics infrastructure growing massively.',
    },
    growthTrajectory: {
      0: { min: 270000, max: 500000, title: 'Logistics Executive / Graduate Trainee' },
      3: { min: 550000, max: 1000000, title: 'Logistics/SCM Manager' },
      7: { min: 1000000, max: 2200000, title: 'Senior Manager / Head SCM' },
      12:{ min: 2200000, max: 5000000, title: 'VP Operations / Chief Supply Chain Officer' },
    },
    jobGoalCriteria: {
      mustHave: ['Supply chain fundamentals', 'ERP exposure (SAP MM/WM)', 'Vendor management', 'Cost negotiation'],
      stronglyPreferred: ['CPIM/CSCP certification', 'Data analytics (Excel, Tableau)', 'Lean/Six Sigma', 'Last-mile delivery expertise for e-commerce'],
    },
    riskFactors: ['Very operational — long hours, weekend on-calls for big events', 'Seasonal demand spikes create burnout'],
    opportunityFactors: ['E-commerce requiring 100,000+ new logistics jobs annually', 'Dubai/Singapore paying 3-4x for experienced SCM professionals', 'PLI scheme manufacturing boost creating SCM roles in India'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // REAL ESTATE
  // ══════════════════════════════════════════════════════════════════════════

  real_estate_professional: {
    label: 'Real Estate Professional',
    sector: 'real_estate',
    keywords: ['real estate','property','real estate broker','property consultant','realty','housing','apartment sales','builder','developer','rera','real estate manager'],
    salaryHistory: {
      2018: { p25: 250000, median: 500000, p75: 1500000, p90: 5000000 },
      2019: { p25: 270000, median: 550000, p75: 1700000, p90: 5500000 },
      2020: { p25: 200000, median: 400000, p75: 1200000, p90: 4000000 },
      2021: { p25: 280000, median: 600000, p75: 2000000, p90: 7000000 }, // RE boom
      2022: { p25: 350000, median: 750000, p75: 2500000, p90: 9000000 },
      2023: { p25: 400000, median: 850000, p75: 2800000, p90: 10000000},
      2024: { p25: 420000, median: 900000, p75: 3000000, p90: 11000000},
    },
    cityMultipliers: {
      mumbai:    { s: 2.50, demand: 9.5, note: 'Highest value real estate in India — top brokers earn crores' },
      delhi:     { s: 1.80, demand: 9.0, note: 'Dwarka Expressway, Aerocity — premium commercial RE' },
      bangalore: { s: 1.70, demand: 9.5, note: 'IT corridor — Whitefield, Sarjapur, fastest appreciating markets' },
      hyderabad: { s: 1.60, demand: 9.0, note: 'Most affordable metro with fastest appreciation — Gachibowli' },
      pune:      { s: 1.50, demand: 8.5, note: 'IT parks + retirement market + affordable housing' },
      dubai:     { s: 4.50, demand: 9.5, note: 'Tax-free + among world\'s most active property markets. Indian brokers thrive.' },
    },
    marketHealth: {
      currentDemand: 9.5,
      trend: 'growing',
      saturation: 'low',
      note: 'India in biggest real estate bull run in decades. Residential demand outpacing supply. RERA bringing professionalism and weeding out fly-by-night operators. Dubai property market setting records every quarter.',
    },
    growthTrajectory: {
      0: { min: 200000, max: 500000, title: 'Property Consultant / Sales Executive' },
      3: { min: 600000, max: 2000000, title: 'Senior Consultant / Team Lead' },
      7: { min: 2000000, max: 10000000,title: 'Branch Manager / Independent Broker' },
      12:{ min: 5000000, max: 50000000,title: 'Developer / Large Brokerage Owner' },
    },
    jobGoalCriteria: {
      mustHave: ['RERA certification (mandatory)', 'Local market knowledge', 'Network building', 'Sales skills'],
      stronglyPreferred: ['Commercial RE specialisation (higher commissions)', 'Luxury segment knowledge', 'Digital marketing for listings', 'Financial understanding (home loans, taxation)'],
    },
    riskFactors: ['Highly variable income — bad months can mean zero', 'Commission-only structure at most brokerages', 'Real estate cycles can be severe downturns'],
    opportunityFactors: ['No income ceiling — top brokers in Mumbai earn 2-5Cr annually', 'Dubai market paying among highest RE commissions globally', 'Commercial RE + data centres creating new premium niche'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // HR & PEOPLE
  // ══════════════════════════════════════════════════════════════════════════

  hr_professional: {
    label: 'HR / People Operations',
    sector: 'hr',
    keywords: ['hr','human resources','talent acquisition','recruiter','hrbp','hr manager','people operations','payroll','l&d','learning and development','chro','compensation and benefits'],
    salaryHistory: {
      2018: { p25: 280000, median: 500000, p75: 950000,  p90: 1800000 },
      2019: { p25: 300000, median: 540000, p75: 1050000, p90: 2000000 },
      2020: { p25: 290000, median: 520000, p75: 1000000, p90: 1900000 },
      2021: { p25: 340000, median: 620000, p75: 1200000, p90: 2400000 },
      2022: { p25: 400000, median: 750000, p75: 1500000, p90: 3000000 },
      2023: { p25: 380000, median: 700000, p75: 1400000, p90: 2800000 },
      2024: { p25: 400000, median: 730000, p75: 1450000, p90: 2900000 },
    },
    cityMultipliers: {
      bangalore: { s: 1.45, demand: 9.0, note: 'Tech company HR — highest HR salaries in India' },
      mumbai:    { s: 1.40, demand: 8.5, note: 'BFSI, FMCG HR — strong base' },
      gurugram:  { s: 1.35, demand: 8.5, note: 'MNC HR shared services, BPO HR' },
      hyderabad: { s: 1.20, demand: 8.0, note: 'Tech company HR COEs' },
      pune:      { s: 1.15, demand: 7.5, note: 'IT company HR, manufacturing HR' },
      dubai:     { s: 3.20, demand: 8.0, note: 'Regional HR roles for MNC Middle East offices' },
      singapore: { s: 4.50, demand: 8.5, note: 'APAC HR COEs for global companies' },
    },
    marketHealth: { currentDemand: 8.0, trend: 'stable_high', saturation: 'moderate', note: 'Tech HR (HRBP at product companies) is premium. Talent acquisition specialists were overhired in 2021-22, correcting in 2023-24. L&D and DEIB specialists growing.' },
    growthTrajectory: {
      0: { min: 250000, max: 450000, title: 'HR Executive / TA Executive' },
      3: { min: 500000, max: 950000, title: 'HR Manager / HRBP' },
      7: { min: 950000, max: 2000000, title: 'Senior HR Manager / HR Head' },
      12:{ min: 2000000, max: 5000000, title: 'CHRO / VP HR' },
    },
    jobGoalCriteria: {
      mustHave: ['MBA HR or related degree', 'Statutory compliance knowledge', 'HRIS tools (SAP/Workday/Darwinbox)'],
      stronglyPreferred: ['HRBP experience at product/tech company', 'OKR/performance framework knowledge', 'Employee relations expertise'],
    },
    riskFactors: ['Tech HR impacted by industry layoffs', 'Heavily relationship-dependent role', 'Not taken seriously in some legacy organisations'],
    opportunityFactors: ['CHRO track at mid-sized companies is achievable faster', 'Tech HR peers at unicorns earning 1Cr+', 'People analytics emerging as premium sub-field'],
  },
}

// ─── CITY INTELLIGENCE DATABASE ────────────────────────────────────────────
// Detailed city profiles beyond just salary multipliers
// Includes job market health, dominant sectors, cost context, immigration notes

export const CITY_INTELLIGENCE = {

  // ── INDIA TIER 1 ───────────────────────────────────────────────────────

  bangalore: {
    label: 'Bangalore (Bengaluru)',
    tier: 'india_t1',
    salaryMultiplier: 1.45,
    costMultiplier:   1.30,
    dominantSectors: ['tech', 'startup', 'biotech', 'aerospace', 'manufacturing'],
    jobMarketScore: 9.5,
    trend: 'growing',
    avgRent2024: { bhk1: 22000, bhk2: 35000, bhk3: 55000 }, // INR/month
    avgInflationYoY: 0.06,
    salaryGrowthHistorical: { 2019: 0.10, 2020: -0.02, 2021: 0.15, 2022: 0.22, 2023: -0.05, 2024: 0.06 },
    keyEmployers: ['Infosys', 'Wipro', 'Flipkart', 'Amazon', 'Google', 'Microsoft', 'ISRO', 'HAL'],
    insight: 'India\'s Silicon Valley. Highest tech salaries nationally. Traffic and CoL rising fast. Still the single best city for career income maximisation in IT.',
    bestForRoles: ['software_engineer','data_scientist','product_manager','devops_cloud','cybersecurity'],
    networkingScore: 9.5,
  },

  mumbai: {
    label: 'Mumbai',
    tier: 'india_t1',
    salaryMultiplier: 1.40,
    costMultiplier:   1.45,
    dominantSectors: ['finance', 'media', 'pharma', 'real_estate', 'entertainment'],
    jobMarketScore: 9.0,
    trend: 'stable_high',
    avgRent2024: { bhk1: 30000, bhk2: 55000, bhk3: 90000 },
    avgInflationYoY: 0.05,
    salaryGrowthHistorical: { 2019: 0.08, 2020: -0.05, 2021: 0.12, 2022: 0.18, 2023: 0.04, 2024: 0.06 },
    keyEmployers: ['HDFC Bank', 'Reliance', 'TCS', 'L&T', 'Cipla', 'Bollywood ecosystem', 'BSE/NSE'],
    insight: 'Financial and commercial capital. Highest absolute cost of living — salary gains partly eaten by housing. Best for finance, law, media, and FMCG careers.',
    bestForRoles: ['investment_banking', 'ca_chartered_accountant', 'lawyer', 'real_estate_professional', 'journalist_media'],
    networkingScore: 9.5,
  },

  delhi: {
    label: 'Delhi / NCR',
    tier: 'india_t1',
    salaryMultiplier: 1.35,
    costMultiplier:   1.30,
    dominantSectors: ['government', 'IT', 'retail', 'FMCG', 'media', 'education'],
    jobMarketScore: 8.5,
    trend: 'growing',
    avgRent2024: { bhk1: 20000, bhk2: 32000, bhk3: 50000 },
    avgInflationYoY: 0.06,
    salaryGrowthHistorical: { 2019: 0.08, 2020: -0.03, 2021: 0.12, 2022: 0.18, 2023: 0.03, 2024: 0.05 },
    keyEmployers: ['Govt of India', 'DRDO', 'Maruti Suzuki', 'HCL Tech', 'Paytm', 'Zomato'],
    insight: 'Political and administrative capital. Best for government/PSU careers and FMCG. Tech scene in Gurugram/Noida. Strong for media and legal careers.',
    bestForRoles: ['ias_ips', 'psu_engineer', 'sales_b2b', 'digital_marketing'],
    networkingScore: 8.5,
  },

  hyderabad: {
    label: 'Hyderabad',
    tier: 'india_t1',
    salaryMultiplier: 1.30,
    costMultiplier:   1.10,
    dominantSectors: ['tech', 'pharma', 'biotech', 'defence'],
    jobMarketScore: 9.0,
    trend: 'growing',
    avgRent2024: { bhk1: 16000, bhk2: 26000, bhk3: 42000 },
    avgInflationYoY: 0.05,
    salaryGrowthHistorical: { 2019: 0.10, 2020: -0.01, 2021: 0.16, 2022: 0.21, 2023: 0.04, 2024: 0.08 },
    keyEmployers: ['Microsoft', 'Google', 'Amazon', 'Dr Reddy\'s', 'Aurobindo Pharma', 'DRDO'],
    insight: 'Best value-for-money Tier 1 city. Salaries nearly as high as Bangalore but 20% lower cost. Growing fast — fastest-appreciating real estate. Strong for pharma and tech both.',
    bestForRoles: ['software_engineer', 'data_scientist', 'pharmacist', 'mechanical_engineer'],
    networkingScore: 8.5,
  },

  pune: {
    label: 'Pune',
    tier: 'india_t1',
    salaryMultiplier: 1.20,
    costMultiplier:   1.10,
    dominantSectors: ['IT', 'auto', 'education', 'manufacturing', 'defence'],
    jobMarketScore: 8.5,
    trend: 'growing',
    avgRent2024: { bhk1: 14000, bhk2: 23000, bhk3: 38000 },
    salaryGrowthHistorical: { 2019: 0.09, 2020: -0.02, 2021: 0.13, 2022: 0.19, 2023: 0.04, 2024: 0.06 },
    keyEmployers: ['Infosys', 'TCS', 'Wipro', 'Tata Motors', 'Bajaj Auto', 'Mercedes Benz R&D'],
    insight: 'IT + auto manufacturing hybrid. Better quality of life than Mumbai or Bangalore. Education capital — FTII, COEP, Symbiosis. Strong for engineering and IT both.',
    bestForRoles: ['mechanical_engineer', 'software_engineer', 'civil_engineer'],
    networkingScore: 8.0,
  },

  chennai: {
    label: 'Chennai',
    tier: 'india_t1',
    salaryMultiplier: 1.20,
    costMultiplier:   1.10,
    dominantSectors: ['IT', 'auto', 'manufacturing', 'finance', 'healthcare'],
    jobMarketScore: 8.0,
    trend: 'stable_high',
    avgRent2024: { bhk1: 13000, bhk2: 22000, bhk3: 36000 },
    keyEmployers: ['TCS', 'Cognizant', 'Hyundai', 'Ford India', 'Apollo Hospitals', 'India Cements'],
    insight: 'Stable, underrated city for engineering and IT. Auto and manufacturing capital of South India. Conservative market — lower salary peaks but also lower CoL and better stability.',
    bestForRoles: ['mechanical_engineer', 'software_engineer', 'doctor_mbbs', 'civil_engineer'],
    networkingScore: 7.5,
  },

  // ── INDIA TIER 2 ───────────────────────────────────────────────────────

  jaipur: {
    label: 'Jaipur',
    tier: 'india_t2',
    salaryMultiplier: 0.90,
    costMultiplier:   0.85,
    dominantSectors: ['tourism', 'education', 'government', 'gems_jewellery', 'IT_services'],
    jobMarketScore: 6.5,
    trend: 'growing',
    avgRent2024: { bhk1: 8000, bhk2: 14000, bhk3: 22000 },
    salaryGrowthHistorical: { 2019: 0.06, 2020: -0.04, 2021: 0.09, 2022: 0.14, 2023: 0.05, 2024: 0.06 },
    keyEmployers: ['State Government', 'RIICO industrial estates', 'Hotel chains (tourism)', 'IT outsourcing firms'],
    insight: 'Low-cost, high quality-of-life option. Growing IT services sector but limited high-paying private sector. Best for government careers, tourism-linked roles, and cost-effective freelancing base.',
    bestForRoles: ['ias_ips', 'teacher_school', 'real_estate_professional'],
    networkingScore: 5.5,
  },

  ahmedabad: {
    label: 'Ahmedabad',
    tier: 'india_t2',
    salaryMultiplier: 1.00,
    costMultiplier:   0.90,
    dominantSectors: ['pharma', 'chemicals', 'textiles', 'IT_services', 'education'],
    jobMarketScore: 7.5,
    trend: 'growing',
    avgRent2024: { bhk1: 10000, bhk2: 17000, bhk3: 27000 },
    salaryGrowthHistorical: { 2019: 0.07, 2020: -0.03, 2021: 0.10, 2022: 0.16, 2023: 0.06, 2024: 0.07 },
    keyEmployers: ['Adani Group', 'Zydus Lifesciences', 'ONGC', 'GIFT City financial firms'],
    insight: 'GIFT City is a major emerging financial hub — attracting global financial services firms. Pharma is world-class. Business-friendly environment. Significantly underrated by tech professionals.',
    bestForRoles: ['ca_chartered_accountant', 'pharmacist', 'civil_engineer', 'mechanical_engineer'],
    networkingScore: 7.0,
  },

  // ── INTERNATIONAL ────────────────────────────────────────────────────────

  dubai: {
    label: 'Dubai, UAE',
    tier: 'international_gulf',
    salaryMultiplier: 3.80,
    costMultiplier:   3.50,
    dominantSectors: ['finance', 'real_estate', 'tourism', 'logistics', 'tech', 'construction'],
    jobMarketScore: 9.0,
    trend: 'growing',
    avgRent2024: { bhk1: 85000, bhk2: 130000, bhk3: 200000 }, // AED/year converted to INR equivalent
    taxFree: true,
    visaPathway: 'Employment visa (employer sponsored) or Golden Visa for ₹10Cr+ net worth',
    indianDiaspora: '3.5 million Indians in UAE — strongest network globally for Indian professionals',
    salaryGrowthHistorical: { 2019: 0.02, 2020: -0.08, 2021: 0.05, 2022: 0.15, 2023: 0.10, 2024: 0.08 },
    keyEmployers: ['Emirates Group', 'DP World', 'ADNOC', 'Emaar Properties', 'Majid Al Futtaim', 'All global MNCs have MENA offices'],
    insight: 'Best short-to-medium term income maximisation globally for Indian professionals. Tax-free salary effectively gives 30%+ India take-home advantage. Large Indian community reduces cultural adjustment. Real estate market setting records. Golden Visa is pathway to long-term residency.',
    bestForRoles: ['civil_engineer', 'software_engineer', 'hotel_hospitality', 'doctor_mbbs', 'teacher_school', 'logistics_supply_chain', 'real_estate_professional'],
    immigrationDifficulty: 'easy', // for employment
    permanentResidencyPathway: 'Golden Visa (10-year) for investors, specialists, exceptional talent',
    networkingScore: 9.0,
  },

  singapore: {
    label: 'Singapore',
    tier: 'international_asia',
    salaryMultiplier: 4.50,
    costMultiplier:   4.80,
    dominantSectors: ['finance', 'tech', 'logistics', 'pharma', 'government_tech'],
    jobMarketScore: 9.0,
    trend: 'stable_high',
    avgRent2024: { bhk1: 200000, bhk2: 310000, bhk3: 450000 }, // SGD converted
    taxFree: false,
    effectiveTaxRate: 0.12, // effective rate for typical Indian professional
    visaPathway: 'Employment Pass (EP) — min SGD 5000/month. PR possible after 2-3 years.',
    indianDiaspora: '360,000 Indians — strong professional network',
    keyEmployers: ['DBS Bank', 'Sea Group', 'Grab', 'Shopee', 'Google APAC', 'Goldman Sachs APAC', 'MAS regulated firms'],
    insight: 'Asia\'s financial and tech hub. High salary but also high cost — effective take-home is Dubai-comparable after tax. PR and citizenship pathway exists but competitive. Excellent base for global career building.',
    bestForRoles: ['software_engineer', 'data_scientist', 'investment_banking', 'logistics_supply_chain', 'product_manager'],
    immigrationDifficulty: 'moderate',
    permanentResidencyPathway: 'PR after 2-3 years EP — competitive but achievable. Citizenship path 6-10 years.',
    networkingScore: 9.5,
  },

  london: {
    label: 'London, UK',
    tier: 'international_europe',
    salaryMultiplier: 5.20,
    costMultiplier:   5.80,
    dominantSectors: ['finance', 'tech', 'consulting', 'law', 'media', 'healthcare'],
    jobMarketScore: 8.5,
    trend: 'stable_high',
    avgRent2024: { bhk1: 280000, bhk2: 420000, bhk3: 650000 }, // GBP/year converted
    taxFree: false,
    effectiveTaxRate: 0.32, // effective rate including NI
    visaPathway: 'Skilled Worker Visa — employer sponsored. Points-based system. IELTS required.',
    indianDiaspora: '1.5 million Indians — second largest diaspora globally',
    salaryGrowthHistorical: { 2019: 0.03, 2020: -0.01, 2021: 0.04, 2022: 0.06, 2023: 0.05, 2024: 0.04 },
    keyEmployers: ['HSBC', 'Barclays', 'Goldman Sachs', 'McKinsey', 'Clifford Chance', 'NHS', 'DeepMind', 'Revolut'],
    insight: 'High tax (32% effective) eats into salary advantage. But quality of life, career development, and pathway to ILR/citizenship makes it attractive for long-term settlement. NHS is the single largest employer of Indian doctors globally.',
    bestForRoles: ['investment_banking', 'lawyer', 'software_engineer', 'doctor_mbbs', 'ca_chartered_accountant'],
    immigrationDifficulty: 'moderate',
    permanentResidencyPathway: 'ILR (Indefinite Leave to Remain) after 5 years. Citizenship after 6 years.',
    networkingScore: 9.0,
  },

  new_york: {
    label: 'New York, USA',
    tier: 'international_usa',
    salaryMultiplier: 7.00,
    costMultiplier:   7.50,
    dominantSectors: ['finance', 'tech', 'media', 'law', 'consulting', 'healthcare'],
    jobMarketScore: 9.0,
    trend: 'stable_high',
    taxFree: false,
    effectiveTaxRate: 0.35, // federal + state + city
    visaPathway: 'H-1B lottery (annual cap 85,000 — 400,000+ applications). L-1 for company transfers. O-1 for extraordinary ability.',
    indianDiaspora: '4.5 million Indians in USA — largest global Indian diaspora',
    keyEmployers: ['Goldman Sachs', 'JP Morgan', 'Citi', 'Google', 'Amazon', 'Meta', 'McKinsey', 'NY law firms'],
    insight: 'Highest absolute salaries in the world. But very high tax + cost of living. H-1B lottery is the key barrier for most Indian professionals. L1 via Indian MNC transfer is more reliable route. Green card wait for India-born is 50-100 years in EB-2/EB-3 — a serious consideration.',
    bestForRoles: ['software_engineer', 'investment_banking', 'data_scientist', 'lawyer'],
    immigrationDifficulty: 'very_hard',
    permanentResidencyPathway: 'Green Card — India-born wait is 50-100+ years in employment categories. Exceptional talent (EB-1A/EB-1B) has no backlog — 2-3 years.',
    networkingScore: 9.5,
  },

  toronto: {
    label: 'Toronto, Canada',
    tier: 'international_canada',
    salaryMultiplier: 4.20,
    costMultiplier:   4.20,
    dominantSectors: ['tech', 'finance', 'healthcare', 'education', 'manufacturing'],
    jobMarketScore: 8.0,
    trend: 'growing',
    taxFree: false,
    effectiveTaxRate: 0.28,
    visaPathway: 'Express Entry — points-based (IELTS + experience + education). CRS score 480+ currently needed. PNP also available.',
    indianDiaspora: '1.7 million Indians in Canada — fastest growing diaspora',
    keyEmployers: ['RBC', 'TD Bank', 'Shopify', 'Amazon Canada', 'Google Toronto', 'TATA Consultancy'],
    insight: 'Best immigration pathway globally for Indian professionals. Express Entry PR in 6-18 months. No H-1B lottery equivalent. Growing tech hub. Lower salary than USA but much more achievable pathway to permanent residency.',
    bestForRoles: ['software_engineer', 'data_scientist', 'doctor_mbbs', 'civil_engineer'],
    immigrationDifficulty: 'moderate',
    permanentResidencyPathway: 'PR via Express Entry in 6-18 months typically. Citizenship after 3 years of PR.',
    networkingScore: 8.5,
  },

  sydney: {
    label: 'Sydney, Australia',
    tier: 'international_australia',
    salaryMultiplier: 4.30,
    costMultiplier:   4.20,
    dominantSectors: ['mining_resources', 'finance', 'tech', 'construction', 'healthcare', 'education'],
    jobMarketScore: 8.0,
    trend: 'growing',
    taxFree: false,
    effectiveTaxRate: 0.26,
    visaPathway: 'Skilled Independent Visa (189/190/491). Points test. Skills assessment required. 2-12 months processing.',
    indianDiaspora: '800,000 Indians in Australia — fast growing',
    keyEmployers: ['Commonwealth Bank', 'BHP', 'Rio Tinto', 'ANZ', 'Telstra', 'Atlassian'],
    insight: 'Excellent quality of life. Skills shortage in engineering, healthcare, trades. Regional areas offering faster PR pathways. Mining sector paying world-class salaries to skilled engineers.',
    bestForRoles: ['civil_engineer', 'mechanical_engineer', 'doctor_mbbs', 'software_engineer'],
    immigrationDifficulty: 'moderate',
    permanentResidencyPathway: 'Skilled visa to PR is relatively straightforward — 1-3 years.',
    networkingScore: 8.0,
  },

  riyadh_ksa: {
    label: 'Riyadh, Saudi Arabia',
    tier: 'international_gulf',
    salaryMultiplier: 3.50,
    costMultiplier:   2.80,
    dominantSectors: ['construction', 'oil_gas', 'healthcare', 'education', 'tech', 'finance'],
    jobMarketScore: 9.5,
    trend: 'growing',
    taxFree: true,
    visaPathway: 'Work visa — employer sponsored. Iqama (residency permit).',
    indianDiaspora: '2.5 million Indians in KSA',
    keyEmployers: ['Saudi Aramco', 'NEOM project', 'SABIC', 'Saudi German Hospital', 'Nesma & Partners'],
    insight: 'Vision 2030 driving generational investment — $500Bn+ in infrastructure and new cities. NEOM alone is a 25-year project. Civil engineers, architects, project managers in extreme demand. Tax-free + high salary + low rent = highest savings potential globally. Significant cultural adjustment required.',
    bestForRoles: ['civil_engineer', 'mechanical_engineer', 'doctor_mbbs', 'teacher_school', 'project_manager'],
    immigrationDifficulty: 'easy',
    permanentResidencyPathway: 'Premium Residency (Saudi Green Card) available for ₹20L+ one-time fee. Limited permanent settlement culture.',
    networkingScore: 7.0,
  },

  frankfurt: {
    label: 'Frankfurt, Germany',
    tier: 'international_europe',
    salaryMultiplier: 4.20,
    costMultiplier:   3.80,
    dominantSectors: ['finance', 'auto', 'pharma', 'engineering', 'logistics', 'tech'],
    jobMarketScore: 8.5,
    trend: 'growing',
    taxFree: false,
    effectiveTaxRate: 0.30,
    visaPathway: 'EU Blue Card — job offer + salary threshold (€45,300+ or €41,042 for shortage professions). 3-year validity.',
    indianDiaspora: '220,000 Indians in Germany',
    keyEmployers: ['Deutsche Bank', 'SAP', 'Siemens', 'BASF', 'Mercedes-Benz', 'BMW', 'Bosch'],
    insight: 'Europe\'s strongest economy. EU Blue Card is easier than UK/USA visas. Strong for engineers (auto/mechanical), finance, and tech. German language adds significant advantage. PR after 33 months with B1 German.',
    bestForRoles: ['mechanical_engineer', 'software_engineer', 'data_scientist', 'investment_banking'],
    immigrationDifficulty: 'moderate',
    permanentResidencyPathway: 'Permanent settlement (Niederlassungserlaubnis) after 33 months with B1 German OR 21 months with B2 German.',
    networkingScore: 7.5,
  },
}

// ─── HISTORICAL MARKET TREND ANALYSIS ──────────────────────────────────────
// Major hiring cycles, disruptions, and structural shifts that explain
// why salary trajectories look the way they do

export const MARKET_CYCLES = {
  india_it: {
    label: 'Indian IT Sector Cycles',
    events: [
      { year: 2018, event: 'Steady state', salaryImpact: +0.08, jobGrowthImpact: +0.06, note: 'Services companies growing, product companies hiring selectively' },
      { year: 2019, event: 'Slowdown signals', salaryImpact: +0.07, jobGrowthImpact: +0.05, note: 'Global slowdown concerns, some caution in hiring' },
      { year: 2020, event: 'COVID-19 shock', salaryImpact: -0.05, jobGrowthImpact: -0.15, note: 'Hiring freeze Q1-Q2. Remote work accelerated digital transformation' },
      { year: 2021, event: 'Great Resignation boom', salaryImpact: +0.18, jobGrowthImpact: +0.30, note: 'Remote work opened global opportunities. Mass salary inflation. Companies overhired.' },
      { year: 2022, event: 'Peak — overhiring', salaryImpact: +0.25, jobGrowthImpact: +0.35, note: 'Salary corrections at startups. Unicorns hiring aggressively. Unrealistic CTCs' },
      { year: 2023, event: 'Tech correction / layoffs', salaryImpact: -0.08, jobGrowthImpact: -0.20, note: '200,000+ layoffs globally affected Indian IT. Freshers and 1-2yr experience impacted most.' },
      { year: 2024, event: 'Stabilisation + AI shift', salaryImpact: +0.06, jobGrowthImpact: +0.08, note: 'AI/ML roles booming. Traditional coding roles moderate demand. Mid-senior roles strong.' },
    ],
    outlook2025: 'AI integration creating new roles faster than it eliminates. Cloud, cybersecurity, and data remain structural shortages. Expect 8-12% salary growth for AI specialists.',
  },

  india_finance: {
    label: 'Indian Financial Sector Cycles',
    events: [
      { year: 2018, event: 'NBFC crisis begins', salaryImpact: -0.03, jobGrowthImpact: -0.08, note: 'IL&FS collapse triggered NBFC sector stress. Bank hiring slowed.' },
      { year: 2019, event: 'Yes Bank, PMC bank stress', salaryImpact: 0.0, jobGrowthImpact: -0.05, note: 'Banking sector consolidation. PSU bank merger announcements.' },
      { year: 2020, event: 'COVID + fintech surge', salaryImpact: -0.02, jobGrowthImpact: -0.10, note: 'Traditional banking hit. Digital payments and fintech accelerated.' },
      { year: 2021, event: 'IPO boom + wealth management surge', salaryImpact: +0.15, jobGrowthImpact: +0.20, note: 'Zepto, Zomato, Paytm IPOs. Wealth management demand exploded.' },
      { year: 2022, event: 'Interest rate hike cycle', salaryImpact: +0.12, jobGrowthImpact: +0.15, note: 'Banks expanding. Private sector bank hiring aggressive. Credit growth highest in decade.' },
      { year: 2023, event: 'Normalisation', salaryImpact: +0.08, jobGrowthImpact: +0.10, note: 'Steady hiring. Fintech funding dry spell. Traditional banking outperforming.' },
      { year: 2024, event: 'Wealth management boom', salaryImpact: +0.10, jobGrowthImpact: +0.12, note: 'Middle class wealth creation driving unprecedented demand for relationship managers.' },
    ],
    outlook2025: 'Indian banking sector is structurally strong. Private bank expansion continues. Wealth management is the fastest-growing sub-sector — SEBI registered advisors in massive shortage.',
  },

  india_healthcare: {
    label: 'Indian Healthcare Sector',
    events: [
      { year: 2020, event: 'COVID — demand surge', salaryImpact: +0.15, jobGrowthImpact: +0.25, note: 'Doctors, nurses, pharmacists in extreme demand. PPE and ventilator manufacturing boom.' },
      { year: 2021, event: 'Continued COVID + telemedicine', salaryImpact: +0.20, jobGrowthImpact: +0.20, note: 'Telemedicine platforms scaling. Practo, 1mg, PharmEasy funding rounds.' },
      { year: 2022, event: 'Post-COVID healthcare investment', salaryImpact: +0.12, jobGrowthImpact: +0.15, note: 'Government Ayushman Bharat expansion. Private hospital chains expanding to Tier 2.' },
      { year: 2023, event: 'Normalisation + quality improvement', salaryImpact: +0.10, jobGrowthImpact: +0.12, note: 'JCI accreditation driving quality focus. Medical tourism rebounding.' },
      { year: 2024, event: 'Structural shortage deepens', salaryImpact: +0.12, jobGrowthImpact: +0.15, note: 'India 400,000 doctors short of WHO target. Every new private hospital faces doctor shortage.' },
    ],
    outlook2025: 'Healthcare is the most recession-proof and shortage-driven sector in India. AIIMS expansion, PM Jan Arogya Yojana scale-up, and aging population make this a multi-decade growth story.',
  },

  gulf_construction: {
    label: 'Gulf Region Construction & Infrastructure',
    events: [
      { year: 2018, event: 'Post-oil crash recovery', salaryImpact: +0.05, jobGrowthImpact: +0.08, note: 'Expo 2020 preparation contracts awarded.' },
      { year: 2019, event: 'Pre-Expo build-out', salaryImpact: +0.08, jobGrowthImpact: +0.15, note: 'Massive infrastructure push in UAE.' },
      { year: 2020, event: 'COVID disruption', salaryImpact: -0.10, jobGrowthImpact: -0.20, note: 'Projects delayed. Worker repatriation.' },
      { year: 2021, event: 'Recovery + Vision 2030 acceleration', salaryImpact: +0.10, jobGrowthImpact: +0.25, note: 'Saudi Vision 2030 projects ramping. NEOM announcements.' },
      { year: 2022, event: 'World Cup Qatar + Vision 2030 peak hiring', salaryImpact: +0.18, jobGrowthImpact: +0.35, note: 'Qatar stadium completion. Saudi NEOM, The Line, Diriyah Gate — massive hiring.' },
      { year: 2023, event: 'Post-WC normalisation + sustained Saudi investment', salaryImpact: +0.08, jobGrowthImpact: +0.15, note: 'Qatar slowing, Saudi accelerating.' },
      { year: 2024, event: 'Saudi dominance + Dubai RE boom overflow', salaryImpact: +0.10, jobGrowthImpact: +0.18, note: 'Riyadh infrastructure, Jeddah airport, KAFD all running simultaneously.' },
    ],
    outlook2025: 'Gulf region has committed $2 trillion+ in infrastructure projects through 2030. India-Gulf labour corridor is the most established and beneficial pathway for construction and engineering professionals.',
  },

  india_real_estate: {
    label: 'Indian Real Estate Market',
    events: [
      { year: 2018, event: 'RERA implementation', salaryImpact: +0.05, jobGrowthImpact: -0.10, note: 'RERA forced out unscrupulous players. Professionalized broking sector.' },
      { year: 2019, event: 'Slowdown', salaryImpact: -0.05, jobGrowthImpact: -0.15, note: 'Demand softened. Developer stress high.' },
      { year: 2020, event: 'COVID shock then recovery', salaryImpact: -0.15, jobGrowthImpact: -0.30, note: 'Q1-Q2 shutdown. Work-from-home drove Q3-Q4 residential surge.' },
      { year: 2021, event: 'Residential boom begins', salaryImpact: +0.20, jobGrowthImpact: +0.40, note: 'Stamp duty cuts, low rates, WFH demand. Volume records.' },
      { year: 2022, event: 'Peak demand', salaryImpact: +0.25, jobGrowthImpact: +0.30, note: 'Luxury segment setting all-time records. New launches at 5-year high.' },
      { year: 2023, event: 'Sustained high — no correction', salaryImpact: +0.15, jobGrowthImpact: +0.20, note: 'Demand remained despite rate hikes. Data centre and warehousing RE new category.' },
      { year: 2024, event: 'Premium segment record', salaryImpact: +0.15, jobGrowthImpact: +0.20, note: 'Luxury residential breaking records. Hyderabad and Bengaluru leading.' },
    ],
    outlook2025: 'India real estate in a structural bull market. Rising middle class, urbanization, and nuclear family formation are 20-year tailwinds. Data centre real estate is the newest high-paying niche.',
  },
}

// ─── JOB GOAL CRITERIA TEMPLATES ───────────────────────────────────────────
// Success criteria for different types of career goals
// Used to evaluate whether a decision is well-planned

export const JOB_GOAL_CRITERIA = {
  switch_to_new_role: {
    label: 'Switching to a New Role / Field',
    successFactors: [
      { factor: 'Skill overlap', weight: 0.30, description: 'How much of your current skill set transfers to the new role' },
      { factor: 'Network in target field', weight: 0.20, description: 'Connections who can refer or advise' },
      { factor: 'Realistic salary expectation', weight: 0.20, description: 'Are you prepared for possible pay cut during transition?' },
      { factor: 'Timeline to proficiency', weight: 0.15, description: 'How long before you\'re productive in the new role (typically 3-6 months)' },
      { factor: 'Demand in target field', weight: 0.15, description: 'Current job market conditions in target sector' },
    ],
    redFlags: [
      'Switching without any upskilling or certification in new field',
      'Expecting same or higher salary immediately in new field',
      'No informational interviews done with people in target role',
      'Switching during economic downturn in target sector',
    ],
    positiveSignals: [
      'Completed relevant certification or course in target field',
      'Have a referral or warm introduction in target company',
      'Target field has active hiring regardless of broader market',
      'Your skills are genuinely transferable (e.g., data analysis across sectors)',
    ],
  },

  promotion_in_current_role: {
    label: 'Getting a Promotion / Salary Raise',
    successFactors: [
      { factor: 'Performance track record', weight: 0.35, description: 'Documented results in current role' },
      { factor: 'Market rate awareness', weight: 0.25, description: 'Do you know what your role pays at competing companies?' },
      { factor: 'Timing', weight: 0.20, description: 'Company financial health, appraisal cycle timing' },
      { factor: 'Alternative offer / BATNA', weight: 0.20, description: 'Competing offer dramatically improves negotiating position' },
    ],
    redFlags: [
      'Asking for raise during company cost-cutting',
      'No documented achievements to reference',
      'Asking without market data to back request',
      'First year in role — too early typically',
    ],
    positiveSignals: [
      'Have competing offer (single biggest lever)',
      'Documented clear business impact (revenue, cost saving, etc.)',
      'Company doing well financially',
      'Key person who is difficult to replace',
    ],
  },

  job_search: {
    label: 'Active Job Search',
    successFactors: [
      { factor: 'Resume quality', weight: 0.25, description: 'ATS-optimised, achievement-focused, quantified impact' },
      { factor: 'Application volume + targeting', weight: 0.20, description: 'Quality and quantity of applications per week' },
      { factor: 'Network activation', weight: 0.25, description: 'Referrals are 5x more likely to convert than cold applications' },
      { factor: 'Interview preparation', weight: 0.20, description: 'Behavioural + technical prep for target roles' },
      { factor: 'Market timing', weight: 0.10, description: 'Is your target sector actively hiring?' },
    ],
    redFlags: [
      'Applying cold to hundreds of jobs without tailoring',
      'Ignoring LinkedIn and relying only on job portals',
      'Not preparing for technical rounds',
      'Targeting only brand-name companies (10x fewer openings)',
    ],
    positiveSignals: [
      'Already getting interviews — signals resume and targeting is right',
      'Have 3+ referrals from people inside target companies',
      'Target sector has active hiring (check LinkedIn job trends)',
      'Notice period is short — faster to start',
    ],
  },

  abroad_move: {
    label: 'Moving Abroad for Work',
    successFactors: [
      { factor: 'Visa pathway clarity', weight: 0.30, description: 'Know exactly which visa you\'re applying for and eligibility' },
      { factor: 'Financial runway', weight: 0.25, description: '6+ months of savings for settlement period in new country' },
      { factor: 'Skill demand in target country', weight: 0.25, description: 'Is your specific skill set in demand there?' },
      { factor: 'Network or family in destination', weight: 0.20, description: 'Existing connections dramatically reduce settling-in time' },
    ],
    redFlags: [
      'Applying without checking visa eligibility first',
      'Not researching cost of living vs salary net of tax',
      'Moving without any emergency fund for settling-in period',
      'Dependent on single employer for visa (H-1B situation)',
    ],
    positiveSignals: [
      'Have job offer in hand before moving',
      'Destination country has documented skills shortage in your field',
      'Already have family/friends in destination city',
      'Company doing intra-company transfer (L-1, ICT) — most reliable route',
    ],
  },
}

// ─── ENGINE INTEGRATION FUNCTIONS ──────────────────────────────────────────
// These are called by engine.js to enrich simulations with intelligence data

/**
 * Get enriched salary reference for a role in a city
 * Returns median current salary and historical trend
 */
export function getIntelligentSalaryRef(industry, currentSalary, city, yearsExp, age) {
  // Find best matching role from database
  const cityKey = city?.toLowerCase().replace(/[^a-z ]/g, '').trim()
  const cityData = getCityIntelligence(cityKey)

  // Get industry base salary from history
  const industryRoleKey = mapIndustryToRole(industry)
  const roleData = SALARY_HISTORY[industryRoleKey]

  if (!roleData) {
    // Fallback to basic market income
    return { salaryRef: currentSalary > 0 ? currentSalary : 400000, confidence: 'low', trend: 'stable' }
  }

  // Get latest year data
  const latestYear = Math.max(...Object.keys(roleData.salaryHistory).map(Number))
  const latestData = roleData.salaryHistory[latestYear]

  // Adjust for experience
  const expMultiplier = getExperienceMultiplier(yearsExp, roleData.growthTrajectory)

  // Adjust for city
  const cityMultiplier = roleData.cityMultipliers?.[cityKey]?.s
    || cityData?.salaryMultiplier
    || 1.0

  const marketMedian = latestData.median * expMultiplier * cityMultiplier

  // Calculate trend: is salary in this field growing or shrinking?
  const years = Object.keys(roleData.salaryHistory).map(Number).sort()
  const recent3 = years.slice(-3)
  const trendPct = recent3.length >= 2
    ? (roleData.salaryHistory[recent3[recent3.length-1]].median - roleData.salaryHistory[recent3[0]].median)
      / roleData.salaryHistory[recent3[0]].median / (recent3.length - 1)
    : 0.05

  return {
    salaryRef: Math.max(currentSalary > 0 ? currentSalary : marketMedian, marketMedian * 0.5),
    marketMedian,
    marketP75: latestData.p75 * cityMultiplier,
    marketP90: latestData.p90 * cityMultiplier,
    trend: trendPct > 0.08 ? 'strong_growth' : trendPct > 0.03 ? 'growing' : trendPct > -0.02 ? 'stable' : 'declining',
    trendPct,
    confidence: roleData ? 'high' : 'medium',
    marketHealth: roleData.marketHealth,
    insight: roleData.marketHealth?.note || null,
    cityInsight: roleData.cityMultipliers?.[cityKey]?.note || null,
    cityDemand: roleData.cityMultipliers?.[cityKey]?.demand || 7,
  }
}

/**
 * Get city intelligence for simulation adjustments
 */
export function getCityIntelligence(cityStr) {
  if (!cityStr) return null
  const l = cityStr.toLowerCase()
  for (const [key, data] of Object.entries(CITY_INTELLIGENCE)) {
    if (l.includes(key) || key.includes(l)) return data
  }
  // Partial match
  for (const [key, data] of Object.entries(CITY_INTELLIGENCE)) {
    if (data.label.toLowerCase().includes(l)) return data
  }
  return null
}

/**
 * Get job market health score for a sector in a city
 * Returns 0-1 multiplier for quality score adjustment
 */
export function getMarketHealthMultiplier(industry, cityStr) {
  const cityKey = cityStr?.toLowerCase()
  const roleKey = mapIndustryToRole(industry)
  const roleData = SALARY_HISTORY[roleKey]

  if (!roleData) return 0
  const demand = roleData.cityMultipliers?.[cityKey]?.demand
    || roleData.marketHealth?.currentDemand
    || 7

  // Map 0-10 demand to -0.2 to +0.2 quality multiplier
  return (demand - 7) * 0.04
}

/**
 * Get career growth trajectory context
 */
export function getCareerTrajectory(industry, yearsExp) {
  const roleKey = mapIndustryToRole(industry)
  const roleData = SALARY_HISTORY[roleKey]
  if (!roleData?.growthTrajectory) return null

  const traj = roleData.growthTrajectory
  const keys = Object.keys(traj).map(Number).sort((a,b) => a-b)

  // Find current tier and next tier
  let currentTier = keys[0]
  let nextTier = keys[1]
  for (let i = 0; i < keys.length; i++) {
    if (yearsExp >= keys[i]) {
      currentTier = keys[i]
      nextTier = keys[i+1] || keys[keys.length-1]
    }
  }

  return {
    currentTitle: traj[currentTier]?.title,
    currentRange: traj[currentTier],
    nextTitle: traj[nextTier]?.title,
    nextRange: traj[nextTier],
    yearsToNext: nextTier - yearsExp,
  }
}

/**
 * Get risk and opportunity factors for a decision
 */
export function getCareerIntelligence(industry, cityStr, yearsExp) {
  const roleKey = mapIndustryToRole(industry)
  const roleData = SALARY_HISTORY[roleKey]
  const cityData = getCityIntelligence(cityStr)

  return {
    riskFactors:       roleData?.riskFactors || [],
    opportunityFactors:roleData?.opportunityFactors || [],
    jobGoalCriteria:   roleData?.jobGoalCriteria || null,
    marketHealth:      roleData?.marketHealth || null,
    cityInsight:       cityData?.insight || null,
    bestRolesForCity:  cityData?.bestForRoles || [],
    immigrationInfo:   cityData?.immigrationDifficulty ? {
      difficulty:        cityData.immigrationDifficulty,
      pathway:           cityData.visaPathway,
      prPathway:         cityData.permanentResidencyPathway,
      diaspora:          cityData.indianDiaspora,
    } : null,
  }
}

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────

function mapIndustryToRole(industry) {
  const map = {
    tech:      'software_engineer',
    finance:   'ca_chartered_accountant',
    health:    'doctor_mbbs',
    design:    'digital_marketing',
    marketing: 'digital_marketing',
    law:       'lawyer',
    media:     'journalist_media',
    govt:      'ias_ips',
    trade:     'logistics_supply_chain',
    sales:     'sales_b2b',
    education: 'teacher_school',
    engineering: 'civil_engineer',
    hospitality: 'hotel_hospitality',
    hr:        'hr_professional',
    real_estate: 'real_estate_professional',
    general:   'software_engineer', // default to tech as it's most queried
  }
  return map[industry] || 'software_engineer'
}

function getExperienceMultiplier(yearsExp, trajectory) {
  if (!trajectory) return 1.0
  const keys = Object.keys(trajectory).map(Number).sort((a,b) => a-b)
  for (let i = keys.length - 1; i >= 0; i--) {
    if (yearsExp >= keys[i]) {
      const tier = trajectory[keys[i]]
      const baseMedian = trajectory[keys[0]]
      if (baseMedian && tier) {
        return ((tier.min + tier.max) / 2) / ((baseMedian.min + baseMedian.max) / 2)
      }
    }
  }
  return 1.0
}
