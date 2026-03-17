/**
 * LifePath AI — Engine v4
 *
 * v4 additions:
 * - Career Intelligence Database integration (careerIntelligence.js)
 * - Salary references now use real historical market data per city + role
 * - Market health score adjusts quality score automatically
 * - Growth trajectory uses real progression data
 * - City intelligence enriches simulation context
 */

import {
  getIntelligentSalaryRef,
  getMarketHealthMultiplier,
  getCityIntelligence,
  getCareerIntelligence,
  getCareerTrajectory,
} from './careerIntelligence.js'

// ─── PARSE SALARY STRING ───────────────────────────────────────────────────

function parseSalary(str) {
  if (!str) return 0
  const s = String(str).toLowerCase().replace(/[₹,\s]/g, '')
  if (s.includes('cr')) return parseFloat(s) * 10000000
  if (s.includes('l'))  return parseFloat(s) * 100000
  const n = parseFloat(s)
  // if number looks like raw e.g. 800000
  return n > 1000 ? n : n * 100000
}

const fmt = v => {
  if (!v || isNaN(v)) return '₹0'
  if (v >= 10000000) return `₹${(v/10000000).toFixed(1)}Cr`
  if (v >= 100000)   return `₹${(v/100000).toFixed(1)}L`
  return `₹${Math.round(v).toLocaleString('en-IN')}`
}


// ─── SKILL FIT ANALYSIS ───────────────────────────────────────────────────
// Maps skill keywords → skill categories, then checks if target decision
// requires those skills. Returns a 0-1 fit score and detailed breakdown.

const SKILL_DOMAINS = {
  // Technical / engineering
  tech_dev: {
    label: 'Software / Tech Development',
    keywords: ['coding','programming','software','developer','python','javascript','java','react','node','sql','data','machine learning','ai','ml','backend','frontend','fullstack','devops','cloud','aws','android','ios','mobile app','web development','api'],
    fits: ['tech_startup','ecommerce','creator','promotion'],
    fitDomains: ['startup','promotion','freelance'],
  },
  data_analytics: {
    label: 'Data & Analytics',
    keywords: ['data analysis','analytics','excel','tableau','power bi','sql','statistics','research','market research','data science','reporting','dashboards','forecasting'],
    fits: ['tech_startup','agency'],
    fitDomains: ['promotion','freelance','startup'],
  },
  // Business / management
  management: {
    label: 'Management & Leadership',
    keywords: ['management','team lead','manager','leadership','operations','project management','pmp','agile','scrum','strategy','planning','budgeting','p&l','stakeholders','cross-functional'],
    fits: ['agency','franchise','acquisition','tech_startup'],
    fitDomains: ['promotion','startup','general'],
  },
  sales_marketing: {
    label: 'Sales & Marketing',
    keywords: ['sales','marketing','business development','bd','client acquisition','negotiation','crm','revenue','growth','digital marketing','seo','social media','content','brand','advertising','leads','pipeline','b2b','b2c'],
    fits: ['agency','ecommerce','micro_retail','food_biz','creator','tech_startup'],
    fitDomains: ['startup','freelance','promotion'],
  },
  finance_accounting: {
    label: 'Finance & Accounting',
    keywords: ['finance','accounting','ca','chartered accountant','cfa','financial modelling','valuation','investment','audit','tax','gst','tds','bookkeeping','balance sheet','p&l','cash flow','fundraising','vc','private equity'],
    fits: ['investment','real_estate_biz','acquisition','tech_startup','agency'],
    fitDomains: ['investment','freelance','startup'],
  },
  // Creative
  design_creative: {
    label: 'Design & Creative',
    keywords: ['design','ui','ux','graphic design','figma','photoshop','illustrator','branding','logo','video editing','photography','animation','creative','visual','adobe','canva'],
    fits: ['agency','creator','ecommerce','micro_retail'],
    fitDomains: ['freelance','startup','creator'],
  },
  content_writing: {
    label: 'Writing & Content',
    keywords: ['writing','content writing','blogging','copywriting','editing','journalism','storytelling','social media content','newsletter','author','script','communication'],
    fits: ['creator','agency'],
    fitDomains: ['freelance','creator'],
  },
  // Domain-specific
  healthcare: {
    label: 'Healthcare & Medicine',
    keywords: ['doctor','mbbs','medical','clinical','nursing','pharma','healthcare','diagnosis','patient','surgery','ayurveda','dentist','physiotherapy','health'],
    fits: ['micro_retail','agency','franchise'],
    fitDomains: ['freelance','startup'],
  },
  teaching_training: {
    label: 'Teaching & Training',
    keywords: ['teaching','training','coaching','mentoring','curriculum','faculty','professor','education','workshop','tutoring','academic','upskilling','learning'],
    fits: ['agency','micro_retail','creator'],
    fitDomains: ['freelance','education','startup'],
  },
  legal: {
    label: 'Legal & Compliance',
    keywords: ['law','legal','advocate','llb','compliance','contracts','litigation','corporate law','ip','intellectual property','arbitration','court'],
    fits: ['agency','freelance'],
    fitDomains: ['freelance','promotion'],
  },
  trades_operations: {
    label: 'Trades & Operations',
    keywords: ['manufacturing','production','operations','supply chain','logistics','procurement','inventory','quality control','factory','engineering','mechanical','electrical','civil','construction','plumbing','carpentry'],
    fits: ['manufacturing','franchise','micro_retail','food_biz'],
    fitDomains: ['startup','general'],
  },
  hospitality_food: {
    label: 'Hospitality & Food',
    keywords: ['hotel','hospitality','chef','cooking','food','restaurant','catering','bakery','barista','service','kitchen','menu','recipes','food safety'],
    fits: ['food_biz','micro_retail','franchise'],
    fitDomains: ['startup'],
  },
  real_estate_prop: {
    label: 'Real Estate & Property',
    keywords: ['real estate','property','construction','builder','architect','interior design','civil engineering','land','plot','apartment','housing','vastu'],
    fits: ['real_estate_biz','investment','micro_retail'],
    fitDomains: ['investment','startup'],
  },
  soft_skills: {
    label: 'Communication & People Skills',
    keywords: ['communication','public speaking','presentation','networking','relationship','empathy','customer service','client handling','hr','recruitment','team building','conflict resolution','negotiation','leadership'],
    fits: ['agency','food_biz','micro_retail','franchise','creator'],
    fitDomains: ['freelance','startup','promotion'],
  },
}

// Detect skills from free text input
function parseSkills(skillText) {
  if (!skillText || skillText.trim().length === 0) return { categories: [], rawSkills: [] }
  const t = skillText.toLowerCase()
  const matched = []

  for (const [key, cfg] of Object.entries(SKILL_DOMAINS)) {
    const hits = cfg.keywords.filter(k => t.includes(k))
    if (hits.length > 0) {
      matched.push({ key, label: cfg.label, hits, strength: Math.min(10, hits.length * 2 + 2) })
    }
  }

  // Also extract raw comma-separated skills for display
  const rawSkills = skillText.split(/[,;\n]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 40)

  return { categories: matched.sort((a,b) => b.strength - a.strength), rawSkills }
}

// Score skill fit against the target decision
function scoreSkillFit(skillsAnalysis, decisionAnalysis, params) {
  const { categories } = skillsAnalysis
  const { domain, industry, businessSubtype } = decisionAnalysis

  if (categories.length === 0) return { score: 0.5, label: 'Unknown', gaps: [], strengths: [], verdict: 'No skills entered — fit not assessed' }

  const bstKey = businessSubtype?.key || null
  let fitScore = 0
  let totalWeight = 0
  const strengths = []
  const gaps = []

  for (const cat of categories) {
    const cfg = SKILL_DOMAINS[cat.key]
    const fitsThisBusiness = bstKey && cfg.fits.includes(bstKey)
    const fitsThisDomain   = cfg.fitDomains.includes(domain)

    if (fitsThisBusiness || fitsThisDomain) {
      const weight = fitsThisBusiness ? 1.5 : 1.0
      fitScore += (cat.strength / 10) * weight
      totalWeight += weight
      strengths.push({ label: cat.label, strength: cat.strength, reason: fitsThisBusiness
        ? 'Directly relevant to this type of business'
        : 'Useful in this career domain' })
    } else {
      gaps.push({ label: cat.label, note: 'You have this skill but it may not be directly relevant to the target' })
    }
  }

  // Check for critical missing skills based on decision type
  const criticalSkills = {
    tech_startup:  ['tech_dev','sales_marketing','management'],
    food_biz:      ['hospitality_food','sales_marketing','finance_accounting'],
    agency:        ['sales_marketing','management','soft_skills'],
    manufacturing: ['trades_operations','management','finance_accounting'],
    ecommerce:     ['sales_marketing','tech_dev','finance_accounting'],
    creator:       ['content_writing','design_creative','sales_marketing'],
    micro_retail:  ['sales_marketing','finance_accounting','trades_operations'],
    real_estate_biz:['real_estate_prop','finance_accounting','management'],
  }

  const required = criticalSkills[bstKey] || []
  const presentKeys = categories.map(c => c.key)
  const missingCritical = required.filter(r => !presentKeys.includes(r))
    .map(r => SKILL_DOMAINS[r]?.label || r)

  const normalizedScore = totalWeight > 0 ? Math.min(1, fitScore / totalWeight) : 0.3
  const finalScore = missingCritical.length > 0
    ? normalizedScore * (1 - missingCritical.length * 0.15)
    : normalizedScore

  const label = finalScore >= 0.8 ? 'Excellent Fit'
    : finalScore >= 0.6 ? 'Good Fit'
    : finalScore >= 0.4 ? 'Partial Fit'
    : finalScore >= 0.2 ? 'Skill Gap'
    : 'Poor Fit'

  const verdict = finalScore >= 0.8
    ? 'Your skills strongly align with what this move requires.'
    : finalScore >= 0.6
    ? 'Solid skill base for this. A few gaps to fill but nothing critical.'
    : finalScore >= 0.4
    ? 'Some relevant skills but significant gaps. Plan for learning or co-founder/hire to cover missing areas.'
    : missingCritical.length > 0
    ? `Missing key skills: ${missingCritical.join(', ')}. These are critical for this type of work — address before committing.`
    : 'Your skill set does not closely match what this decision requires. Consider whether you can acquire the missing skills quickly.'

  return {
    score: Math.max(0.1, finalScore),
    label,
    verdict,
    strengths,
    gaps,
    missingCritical,
    percentMatch: Math.round(Math.max(10, finalScore * 100)),
  }
}

// ─── DECISION QUALITY SCORER ───────────────────────────────────────────────
// Returns score -1.0 (terrible idea) to +1.0 (excellent idea)
// This is the CORE of everything — realistic & risky pivot around this

function scoreDecisionQuality(analysis, params) {
  let score = 0
  const { domain, industry, tone, mentionedTargetSalary } = analysis
  const { age, savings, currentSalary, riskTolerance, fundingType, savingsUsagePct, yearsExp, employmentStatus } = params
  const empStatus = employmentStatus || 'employed'

  // ── Employment status adjustments ──────────────────────────────────────
  // Unemployed: urgency is high, but starting from zero income is actually freeing
  // Retired: age penalty but savings/stability bonus; starting from position of experience
  // Student: no income anchor, pure potential play
  // Homemaker: risk appetite typically lower, support structure matters
  const isZeroIncome = ['student','homemaker','retired','unemployed'].includes(employmentStatus)
  const isRetired    = employmentStatus === 'retired'
  const isStudent    = employmentStatus === 'student'
  const isUnemployed = employmentStatus === 'unemployed'

  if (isRetired)    score += 0.15   // wisdom, experience, pension safety net, no job to lose
  if (isStudent)    score += 0.05   // low opportunity cost
  if (isUnemployed) score -= 0.10   // urgency/pressure
  if (employmentStatus === 'homemaker') score -= 0.05

  // Retired-specific safety bonus: pension means business losses don't affect survival
  if (isRetired && currentSalary > 0) score += 0.10  // pension = safety net = can take more risk
  // Retired with good savings: additional boost
  if (isRetired && savings > currentSalary * 5) score += 0.05  // 5+ years pension in savings

  // Runway: for zero-income people, savings IS the entire runway (no salary to reference)
  // For retired: runway = savings / monthly expenses (NOT vs pension, since pension covers expenses)
  const monthlyExpenses = empStatus === 'retired' 
    ? Math.max(currentSalary * 0.8 / 12, 20000)   // 80% of pension = living costs
    : 0
  const effectiveSalary = currentSalary > 0 ? currentSalary : savings * 0.20  // assume 20% annual draw
  const runway = isRetired && monthlyExpenses > 0
    ? (savings * (savingsUsagePct / 100)) / monthlyExpenses  // for retired: how long deployed savings last
    : savings / (effectiveSalary / 12 || 1)

  // --- Runway adequacy ---
  if      (runway >= 18) score += 0.3
  else if (runway >= 12) score += 0.2
  else if (runway >= 6)  score += 0.1
  else if (runway >= 3)  score -= 0.1
  else                   score -= 0.3

  // --- Funding type & actual amounts ---
  const loanAmt = params.loanAmount || 0
  const extAmt  = params.externalAmount || 0
  const totalCapital = (savings * savingsUsagePct / 100) + loanAmt + extAmt

  if (fundingType === 'savings') score += 0.0
  if (fundingType === 'parttime') score += 0.15   // hedged — safer
  if (fundingType === 'investor') score += 0.15 + (extAmt > 2000000 ? 0.10 : 0)  // validation + size

  if (fundingType === 'loan') {
    // Loan burden relative to current salary is the key metric
    const annualEMI = loanAmt * 0.144   // ~14.4% total annual cost
    const emiToSalaryRatio = currentSalary > 0 ? annualEMI / currentSalary : 1
    if (emiToSalaryRatio > 0.5) score -= 0.40   // EMI > 50% of salary — dangerous
    else if (emiToSalaryRatio > 0.3) score -= 0.25
    else if (emiToSalaryRatio > 0.15) score -= 0.15
    else score -= 0.05   // manageable EMI
  }

  // More total capital relative to business type = better odds
  if (totalCapital > 2000000) score += 0.05   // well capitalised

  // --- How much savings being used ---
  const usagePct = savingsUsagePct / 100
  if (usagePct > 0.8) score -= 0.2   // betting everything
  else if (usagePct > 0.5) score -= 0.1
  else if (usagePct < 0.3) score += 0.1  // conservative

  // --- Age vs domain fit (adjusted for employment status) ---
  if (isRetired) {
    // Retired people have experience capital — age is less penalising
    if (domain === 'startup') score += 0.05   // experience is an asset
    if (domain === 'freelance') score += 0.10  // expertise consulting
    if (domain === 'education') score -= 0.10  // going back to study late is risky
  } else if (isStudent) {
    if (domain === 'startup') score += 0.10    // best time to try
    if (domain === 'education') score -= 0.05  // already studying — meta
  } else {
    if (domain === 'startup') {
      if (age < 30) score += 0.15
      else if (age > 45) score -= 0.15
    }
    if (domain === 'education') {
      if (age < 32) score += 0.1
      else if (age > 38) score -= 0.15
    }
    if (domain === 'abroad') {
      if (age < 35) score += 0.1
      else if (age > 45) score -= 0.15
    }
  }

  // --- Experience ---
  if (yearsExp >= 5) score += 0.1
  else if (yearsExp <= 1) score -= 0.1

  // --- Emotional tone ---
  if (tone === 'positive') score += 0.05
  if (tone === 'cautious') score -= 0.05  // hesitation = doubt

  // --- Target salary mentioned and realistic ---
  if (mentionedTargetSalary && currentSalary > 0) {
    const jump = mentionedTargetSalary / currentSalary
    if (jump > 3) score -= 0.15   // unrealistic expectation
    else if (jump > 1.5) score += 0.1  // good opportunity
    else if (jump < 1) score -= 0.2    // taking a pay cut consciously
  }

  // --- Domain inherent risk ---
  const domainRisk = { startup: -0.1, freelance: -0.05, abroad: 0, education: 0.05, investment: -0.15, promotion: 0.15, general: 0 }
  score += domainRisk[domain] || 0

  // --- Career Intelligence: market health adjustment ───────────────────────
  // If the target industry in the target city has high demand → boost quality
  // If market is declining or saturated → reduce quality score
  try {
    const cityLabel = params.city?.label || ''
    const mhMultiplier = getMarketHealthMultiplier(industry, cityLabel)
    score += mhMultiplier  // range: -0.2 to +0.2
  } catch (e) { /* non-critical — skip */ }

  // --- Skill fit score ---
  // Strong skill match = +0.25, poor match = -0.25
  if (params.skillFitScore !== undefined) {
    const sf = params.skillFitScore  // 0 to 1
    score += (sf - 0.5) * 0.5  // maps 0->-0.25, 0.5->0, 1->+0.25
  }

  return Math.max(-1, Math.min(1, score))
}

// ─── TEXT ANALYSIS ────────────────────────────────────────────────────────

// ─── BUSINESS SUBTYPE DETECTION ──────────────────────────────────────────
// This is the key: different businesses have HARD income ceilings based on reality
// A bookstore ≠ a SaaS startup ≠ a manufacturing company

const BUSINESS_SUBTYPES = {
  // ── Micro / local physical businesses (very low ceiling) ──
  micro_retail: {
    keywords: ['bookstore','book store','book shop','stationery','grocery','kirana','general store',
               'medical store','pharmacy','chemist shop','hardware store','clothing store','garment shop',
               'toy shop','gift shop','flower shop','bakery','sweet shop','mithai','paan shop',
               'mobile repair','phone repair','electronics repair','cycle shop','tailoring','boutique',
               'salon','parlour','beauty salon','barbershop','barber'],
    // Owner income (not revenue) — what the founder actually takes home
    incomeCapOpt: 2500000,   // 25L absolute best case (busy metro area, multi-year)
    incomeCapReal: 1200000,  // 12L realistic good outcome
    incomeCapRisk: 400000,   // 4L struggling
    y1Income: 300000,        // 3L year 1 (getting started)
    growthG: 0.20,           // 20% good year growth
    growthB: 0.08,           // 8% bad year growth
    stress: 7,
    note: 'Local retail/service — owner income, not revenue',
  },

  // ── Food & hospitality ──
  food_biz: {
    keywords: ['restaurant','cafe','coffee shop','dhaba','hotel','canteen','tiffin','cloud kitchen',
               'food delivery','catering','food truck','chai shop','tea stall','juice shop','ice cream',
               'fast food','biryani','mess','hostel food','bakery','sweets','confectionery','bar ',
               'pub ','brewery','winery','food business','food startup'],
    incomeCapOpt: 5000000,   // 50L (chain / popular spot)
    incomeCapReal: 1800000,  // 18L decent restaurant
    incomeCapRisk: 500000,   // 5L struggling
    y1Income: 400000,
    growthG: 0.25,
    growthB: 0.05,
    stress: 8,
    note: 'Food business — high failure rate, thin margins',
  },

  // ── Service / freelance agency ──
  agency: {
    keywords: ['agency','marketing agency','design agency','digital agency','consulting firm',
               'advisory','recruitment firm','staffing','placement','hr firm','law firm','ca firm',
               'accounting firm','event management','pr firm','media agency','ad agency',
               'travel agency','real estate broker','coaching center','tuition center','training institute'],
    incomeCapOpt: 8000000,   // 80L (scaling team, multiple clients)
    incomeCapReal: 3500000,  // 35L good agency
    incomeCapRisk: 800000,   // 8L struggling
    y1Income: 600000,
    growthG: 0.35,
    growthB: 0.10,
    stress: 7,
    note: 'Service/agency — people-limited growth',
  },

  // ── Tech / SaaS / digital product ──
  tech_startup: {
    keywords: ['saas','software startup','app startup','tech startup','fintech startup','edtech',
               'healthtech','b2b software','api','platform','marketplace startup','product startup',
               'mobile app','web app','ai startup','ml product','developer tool','dev tool',
               'subscription product','product-led','product led'],
    incomeCapOpt: 50000000,  // 5Cr (funded, scaling)
    incomeCapReal: 8000000,  // 80L (profitable small SaaS)
    incomeCapRisk: 1000000,  // 10L (struggling, not finding PMF)
    y1Income: 200000,
    growthG: 0.65,
    growthB: 0.15,
    stress: 9,
    note: 'Tech/SaaS — high risk, very high ceiling if successful',
  },

  // ── E-commerce / trading / wholesale ──
  ecommerce: {
    keywords: ['ecommerce','e-commerce','online store','amazon seller','flipkart seller','meesho',
               'dropshipping','reselling','import export','wholesale','distribution','trading company',
               'online business','sell online','d2c','direct to consumer','brand launch'],
    incomeCapOpt: 15000000,  // 1.5Cr (scaled brand)
    incomeCapReal: 3000000,  // 30L decent
    incomeCapRisk: 500000,   // 5L
    y1Income: 350000,
    growthG: 0.45,
    growthB: 0.10,
    stress: 7,
    note: 'E-commerce — depends heavily on category and marketing spend',
  },

  // ── Manufacturing / production ──
  manufacturing: {
    keywords: ['factory','manufacturing','production unit','plant','workshop','fabrication',
               'furniture','woodwork','metal','steel','plastic','garment factory','textile',
               'printing press','packaging','construction','contractor'],
    incomeCapOpt: 8000000,   // 80L (mature, repeat orders)
    incomeCapReal: 2500000,  // 25L
    incomeCapRisk: 400000,   // 4L
    y1Income: 300000,
    growthG: 0.25,
    growthB: 0.05,
    stress: 8,
    note: 'Manufacturing — capital heavy, slow to ramp',
  },

  // ── Content / creator / media ──
  creator: {
    keywords: ['youtube','youtuber','content creator','influencer','instagram','podcast','blog',
               'newsletter','substack','course','online course','coaching online','personal brand',
               'streaming','twitch','creator economy'],
    incomeCapOpt: 10000000,  // 1Cr (major creator)
    incomeCapReal: 1500000,  // 15L (decent following)
    incomeCapRisk: 200000,   // 2L (struggling to monetise)
    y1Income: 100000,
    growthG: 0.80,           // high variance — viral growth possible
    growthB: 0.05,
    stress: 6,
    note: 'Creator — extremely high variance, most earn little',
  },

  // ── Real estate development / builder ──
  real_estate_biz: {
    keywords: ['real estate business','builder','developer','property developer','construction company',
               'housing project','apartment project','plots','land development'],
    incomeCapOpt: 20000000,  // 2Cr
    incomeCapReal: 5000000,  // 50L
    incomeCapRisk: 500000,   // 5L
    y1Income: 200000,
    growthG: 0.30,
    growthB: -0.05,
    stress: 8,
    note: 'Real estate development — lumpy income, capital intensive',
  },

  // ── Franchise ──
  franchise: {
    keywords: ['franchise','franchisee','franchise model','amul franchise','jockey franchise',
               'subway franchise','mcdonalds','dominos','branded store','dealership','authorized dealer'],
    incomeCapOpt: 4000000,   // 40L
    incomeCapReal: 1500000,  // 15L
    incomeCapRisk: 400000,   // 4L
    y1Income: 500000,
    growthG: 0.18,
    growthB: 0.05,
    stress: 6,
    note: 'Franchise — lower risk but limited upside, royalty costs',
  },

  // ── Buying / acquiring an existing business ──
  acquisition: {
    keywords: ['buy a company','acquire','acquisition','buying a business','takeover','buy existing',
               'purchase company','invest in company','stake in','equity stake','silent partner'],
    incomeCapOpt: 30000000,  // 3Cr (good acquisition, scale)
    incomeCapReal: 6000000,  // 60L
    incomeCapRisk: 0,        // lost investment
    y1Income: 800000,        // depends on what you bought
    growthG: 0.28,
    growthB: 0.05,
    stress: 7,
    note: 'Acquisition — depends entirely on what was bought and price paid',
  },
}

function detectBusinessSubtype(text) {
  const t = text.toLowerCase()
  let best = null, bestHits = 0

  for (const [key, cfg] of Object.entries(BUSINESS_SUBTYPES)) {
    const hits = cfg.keywords.filter(k => t.includes(k)).length
    if (hits > bestHits) { bestHits = hits; best = { key, cfg, hits } }
  }

  return bestHits > 0 ? best : null
}

// ─── TEXT ANALYSIS ────────────────────────────────────────────────────────

function analyseDecision(text, currentJobText) {
  const t = (text + ' ' + (currentJobText || '')).toLowerCase()
  const decisionOnly = text.toLowerCase()

  // First: detect specific business subtype (most important for realistic income caps)
  const businessSubtype = detectBusinessSubtype(decisionOnly)

  const domains = {
    startup:    ['startup','saas','app','product','launch','build','found','venture','own company','own business','entrepreneur','business idea','open a','open my','start a','start my'],
    freelance:  ['freelance','freelancer','consulting','consultant','own boss','independent','self-employed','contract','go independent','side hustle'],
    abroad:     ['abroad','move to','relocate','migrate','settle in','dubai','singapore','london','usa','uk','canada','australia','germany','new york','europe','foreign country'],
    education:  ['mba','masters','phd','study','degree','iim','iit','college','pgp','certification','upskill','executive programme','back to school'],
    investment: ['invest','real estate','property','stocks','trading','crypto','mutual fund','passive income','portfolio','buy land','buy flat','buy house','put money'],
    promotion:  ['promotion','appraisal','raise','hike','negotiate salary','offer letter','new job','joining','switch company','switch job','better role','new company'],
  }

  let domain = 'general', domainScore = 0
  for (const [d, kws] of Object.entries(domains)) {
    const hits = kws.filter(k => decisionOnly.includes(k)).length
    if (hits > domainScore) { domainScore = hits; domain = d }
  }

  const industries = {
    tech:      ['software','engineer','developer','coding','tech','infosys','tcs','wipro','product manager','data scientist','ai','machine learning','saas','web dev','it '],
    finance:   ['finance','banking','fintech','ca ','chartered','accounting','investment banking','hedge fund','private equity','venture capital'],
    health:    ['doctor','medical','healthcare','hospital','pharma','mbbs','nurse','dentist'],
    design:    ['design','ux','ui','graphic','creative','branding','architect'],
    marketing: ['marketing','brand','social media','content creator','seo','advertising'],
    law:       ['lawyer','legal','law firm','advocate','llb'],
    media:     ['journalist','media','film','video','youtube','influencer','podcast'],
    govt:      ['government','govt','ias','ips','psc','ssc','civil service','public sector','police','military','army','navy','air force','bank po','railway'],
    trade:     ['manufacturing','factory','operations','supply chain','logistics','retail','ecommerce','shop','store'],
  }

  let industry = 'general', indScore = 0
  for (const [ind, kws] of Object.entries(industries)) {
    const hits = kws.filter(k => t.includes(k)).length
    if (hits > indScore) { indScore = hits; industry = ind }
  }

  const positive = ["excited","love","passionate","dream","always wanted","confident","ready","great opportunity","amazing","finally","can\'t wait"]
  const negative  = ["scared","worried","nervous","unsure","not sure","afraid","doubt","hesitant","confused","stuck","burnout","frustrated","hate my job","bored"]

  const posHits = positive.filter(w => decisionOnly.includes(w)).length
  const negHits = negative.filter(w => decisionOnly.includes(w)).length
  const tone = posHits > negHits ? "positive" : negHits > posHits ? "cautious" : "neutral"

  const salMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lpa|lakh|l\b|cr\b|crore)/i)
  const mentionedTargetSalary = salMatch ? parseSalary(salMatch[0]) : null

  const snippet = text.length > 55 ? text.slice(0, 52) + "..." : text

  // ── Life motivation signals ──────────────────────────────────────────────
  // What is actually driving this decision beyond money?
  const motivations = {
    escape:    ['hate my job','fed up','can\'t take it','toxic','burned out','burnout','bored','no growth',
                'stuck','suffocating','trapped','no freedom','micromanaged','underpaid','unappreciated',
                'meaningless','pointless','tired of','done with','quit anyway'],
    passion:   ['passionate','love to','always dreamed','always wanted','my calling','meant to do',
                'fulfilling','meaningful','matter','purpose','excited about','genuinely enjoy',
                'love doing','love working on','care about','believe in'],
    freedom:   ['freedom','flexible','own boss','independent','no one telling me','my own hours',
                'work from anywhere','remote','autonomy','control over','choose my clients',
                'no office','no politics','escape the corporate'],
    money:     ['earn more','higher salary','better pay','financial freedom','more money','rich',
                'wealth','crore','income gap','not earning enough','underpaid'],
    growth:    ['learn more','grow faster','challenge','stretch','skill up','career growth',
                'advance','level up','impact','build something','create something','leave a mark'],
    family:    ['family','kids','parents','wife','husband','partner','spend time','be present',
                'relocate for','close to home','move back','care for'],
  }

  const motivationScores = {}
  for (const [mot, kws] of Object.entries(motivations)) {
    motivationScores[mot] = kws.filter(k => (decisionOnly + ' ' + (currentJobText||'')).toLowerCase().includes(k)).length
  }

  // Primary motivation (what's really driving this)
  const primaryMotivation = Object.entries(motivationScores)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'general'

  // Is this mostly a push (escape) or pull (towards something)?
  const pushScore = motivationScores.escape || 0
  const pullScore = (motivationScores.passion || 0) + (motivationScores.freedom || 0) + (motivationScores.growth || 0)
  const motivationType = pushScore > pullScore ? 'escape' : pullScore > pushScore ? 'aspiration' : 'mixed'

  return { domain, industry, tone, mentionedTargetSalary, snippet, raw: text, businessSubtype,
           motivationScores, primaryMotivation, motivationType }
}

// ─── CITY DATA ────────────────────────────────────────────────────────────

const CITY_DATA = {
  mumbai: { s: 1.40, c: 1.45 }, bangalore: { s: 1.45, c: 1.30 },
  bengaluru: { s: 1.45, c: 1.30 }, delhi: { s: 1.35, c: 1.30 },
  'new delhi': { s: 1.35, c: 1.30 }, hyderabad: { s: 1.30, c: 1.10 },
  pune: { s: 1.20, c: 1.10 }, chennai: { s: 1.20, c: 1.10 },
  gurugram: { s: 1.35, c: 1.30 }, noida: { s: 1.20, c: 1.10 },
  ahmedabad: { s: 1.00, c: 0.90 }, jaipur: { s: 0.90, c: 0.85 },
  kolkata: { s: 1.00, c: 0.90 }, kochi: { s: 1.00, c: 0.90 },
  indore: { s: 0.85, c: 0.80 }, bhopal: { s: 0.80, c: 0.75 },
  lucknow: { s: 0.85, c: 0.80 }, nagpur: { s: 0.85, c: 0.80 },
  surat: { s: 0.90, c: 0.85 }, chandigarh: { s: 0.90, c: 0.85 },
  coimbatore: { s: 0.90, c: 0.80 }, patna: { s: 0.75, c: 0.70 },
  dubai: { s: 3.80, c: 3.50 }, singapore: { s: 4.20, c: 4.80 },
  london: { s: 5.20, c: 5.80 }, 'new york': { s: 6.50, c: 7.00 },
  usa: { s: 5.80, c: 5.50 }, uk: { s: 4.80, c: 5.00 },
  canada: { s: 4.20, c: 4.20 }, australia: { s: 4.50, c: 4.30 },
  germany: { s: 4.20, c: 4.00 }, 'san francisco': { s: 7.00, c: 8.00 },
}

function getCity(str) {
  const l = str.toLowerCase().trim()
  for (const [k, d] of Object.entries(CITY_DATA)) {
    if (l.includes(k)) return { ...d, label: str }
  }
  return { s: 1.0, c: 1.0, label: str }
}

// ─── DOMAIN INCOME PROFILES ───────────────────────────────────────────────
// These are FALLBACKS when no business subtype is detected.
// When a subtype IS detected, its caps override everything.

const DOMAIN = {
  startup:    { y1: 0.20, gG: 0.50, gB: 0.15, stress: 8, floor: 0.05 },
  freelance:  { y1: 0.55, gG: 0.35, gB: 0.10, stress: 6, floor: 0.25 },
  abroad:     { y1: 1.10, gG: 0.22, gB: 0.08, stress: 7, floor: 0.60 },
  education:  { y1: 0.02, gG: 0.55, gB: 0.20, stress: 6, floor: 0.00 },
  investment: { y1: 0.35, gG: 0.45, gB:-0.10, stress: 5, floor: 0.00 },
  promotion:  { y1: 0.95, gG: 0.22, gB: 0.05, stress: 4, floor: 0.70 },
  general:    { y1: 0.80, gG: 0.20, gB: 0.06, stress: 5, floor: 0.50 },
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// ─── MARKET INCOME REFERENCE ──────────────────────────────────────────────
// Now powered by Career Intelligence Database — uses real historical salary
// data per industry, city, and experience level

function getMarketIncome(age, industry, city, yearsExp) {
  try {
    const intel = getIntelligentSalaryRef(industry, 0, city?.label || '', yearsExp || Math.max(0, age - 22), age)
    if (intel.confidence !== 'low' && intel.marketMedian > 0) {
      return intel.marketMedian
    }
  } catch (e) { /* fallback below */ }

  // Fallback: basic estimates if intelligence DB lookup fails
  const base = {
    tech:      600000, finance:   550000, health:    500000,
    design:    450000, marketing: 450000, law:       500000,
    media:     400000, govt:      450000, trade:     400000, general: 400000,
  }[industry] || 400000

  const expMult = age < 22 ? 0.6 : age < 25 ? 0.8 : age < 30 ? 1.0 : age < 35 ? 1.3 : age < 45 ? 1.6 : 1.4
  return base * expMult
}

// ─── MAIN SIMULATION ──────────────────────────────────────────────────────

function simulate(type, analysis, city, params, qualityScore) {
  const { currentSalary, savings, riskTolerance, relPriority, savingsUsagePct, fundingType, age, yearsExp } = params
  const cfg = DOMAIN[analysis.domain] || DOMAIN.general

  // ── Business subtype overrides ──────────────────────────────────────────
  // If a specific business type was detected (bookstore, restaurant, SaaS, etc.)
  // use its REAL income caps instead of generic startup growth rates.
  // This prevents a bookstore from showing 2Cr projections.
  const bst = analysis.businessSubtype?.cfg  // may be null

  const investedAmount = savings * (savingsUsagePct / 100)
  const loanAmt = params.loanAmount || 0
  const extAmt  = params.externalAmount || 0
  const totalCapital = investedAmount + loanAmt + extAmt
  // Monthly EMI on loan — 14.4% annual (typical personal/business loan India)
  const monthlyEMI = fundingType === 'loan' ? loanAmt * 0.012 : 0
  const annualEMI  = monthlyEMI * 12
  // Investor capital reduces personal risk and improves Y1 income floor
  const investorBoost = extAmt > 0 ? Math.min(0.3, extAmt / (currentSalary * 2)) : 0

  const RM = {
    'Career First': { rel: -1.5, career: 1.08, stress: +0.5 },
    'Balanced':     { rel:  0.0, career: 1.00, stress:  0.0 },
    'Family First': { rel: +1.5, career: 0.92, stress: -0.5 },
  }[relPriority] || { rel: 0, career: 1, stress: 0 }

  // ── PASSIVE INCOME BASE ─────────────────────────────────────────────────
  // For retired, part-time, and homemaker: they have a CONTINUING income base
  // that does NOT stop when they start a business. The business income is ADDITIVE.
  // For employed: quitting means losing the salary — no additive income.
  // This fixes the core loophole: retired person showing "₹1.1K/yr income" when
  // they still have a pension.
  const empStatus = params.employmentStatus || 'employed'
  const passiveIncome =
    empStatus === 'retired'   ? currentSalary                         // pension continues always
    : empStatus === 'parttime' ? currentSalary * 0.6                  // keeps some income (part of existing)
    : empStatus === 'homemaker'? 0                                     // no personal income, business is new
    : empStatus === 'unemployed' && type !== 'risky' ? 0              // no income until business works
    : 0                                                                // employed quits, no passive

  // Income FLOOR: retired person's income can never drop below pension
  // (pension doesn't disappear because a business is struggling)
  const passiveFloor = empStatus === 'retired' ? currentSalary : 0

  const r = riskTolerance / 10
  const q = qualityScore

  // ── Determine Y1 income and growth rate ──────────────────────────────────
  // If business subtype detected: use its ABSOLUTE income values (not salary multiples)
  // If not: fall back to salary-multiple system
  let y1Income, growthRate, incomeCap

  if (bst) {
    // Business subtype detected — use reality-based numbers
    const cityFactor = city.s  // adjust for city cost of living
    if (type === 'optimistic') {
      y1Income   = bst.y1Income * cityFactor * (1 + q * 0.3 + investorBoost)
      growthRate = bst.growthG * (1 + q * 0.2 + r * 0.2)
      incomeCap  = bst.incomeCapOpt * cityFactor * (1 + q * 0.2)
    } else if (type === 'realistic') {
      y1Income   = bst.y1Income * cityFactor * (0.8 + q * 0.2 + investorBoost * 0.5)
      growthRate = q >= 0 ? bst.growthG * 0.6 : bst.growthB
      incomeCap  = q >= 0 ? bst.incomeCapReal * cityFactor : bst.incomeCapReal * cityFactor * 0.6
    } else { // risky
      y1Income   = bst.y1Income * cityFactor * 0.5 * (1 - r * 0.1)
      growthRate = q >= 0 ? bst.growthB * 0.8 : bst.growthB * 0.4
      incomeCap  = q >= 0 ? bst.incomeCapRisk * cityFactor : bst.incomeCapRisk * cityFactor * 0.5
    }
  } else {
    // No specific subtype — use salary-multiple system
    // If currentSalary=0 (student/retired/unemployed), use age-based market income as reference
    const industry = analysis.industry || 'general'
    let salaryRef
    try {
      const intel = getIntelligentSalaryRef(industry, currentSalary, city?.label || '', yearsExp, age)
      salaryRef = currentSalary > 0 ? currentSalary : (intel.marketMedian || getMarketIncome(age, industry, city, yearsExp) * city.s * 0.5)
    } catch(e) {
      salaryRef = currentSalary > 0 ? currentSalary : getMarketIncome(age, industry, city, yearsExp) * city.s * 0.5
    }
    if (type === 'optimistic') {
      y1Income   = salaryRef * cfg.y1 * (1 + q * 0.5 + r * 0.4 + investorBoost)
      growthRate = cfg.gG * (1 + q * 0.3 + r * 0.3)
      incomeCap  = null
    } else if (type === 'realistic') {
      y1Income   = salaryRef * cfg.y1 * (1 + q * 0.4)
      growthRate = q >= 0 ? cfg.gG * (0.5 + q * 0.4) : cfg.gB * (1 + Math.abs(q) * 0.5)
      incomeCap  = null
    } else {
      y1Income   = salaryRef * cfg.y1 * (0.5 + q * 0.2) * (1 - r * 0.1)
      growthRate = q >= 0 ? cfg.gB * 0.8 : cfg.gB * 0.3
      incomeCap  = null
    }
  }

  const scenarioMult = {
    y1Income, growthRate, incomeCap,
    stressMod: type === 'optimistic' ? -1 - Math.round(q * 2)
      : type === 'realistic' ? Math.round(-q * 1.5)
      : Math.round(3 + Math.abs(q) * 3),
    crashMult: type === 'risky'
      ? (q >= 0 ? (0.35 + (1-r)*0.15) : (0.20 + (1-r)*0.10))
      : null,
    savingsRate: type === 'optimistic' ? 0.28 + q * 0.08
      : type === 'realistic' ? 0.18 + q * 0.05
      : 0.06 + (q >= 0 ? 0.04 : 0),
  }

  // Floor: use subtype floor or domain floor
  const floorIncome = bst
    ? (type === 'risky' ? bst.incomeCapRisk * 0.3 : bst.incomeCapRisk * 0.5) * (city.s || 1)
    : Math.max(currentSalary, 120000) * cfg.floor  // floor on floor: min 12K baseline

  // Living cost: if currentSalary=0 (retired/student/unemployed), use city median as reference
  const livingReference = currentSalary > 0 ? currentSalary
    : params.employmentStatus === 'retired'    ? Math.max(params.savings * 0.08, 300000)  // ~8% of savings or 3L
    : params.employmentStatus === 'student'    ? 300000   // minimal baseline
    : params.employmentStatus === 'homemaker'  ? 400000   // household reference
    : params.employmentStatus === 'unemployed' ? Math.max(params.savings * 0.15, 400000)
    : 400000
  const livingCost = (bst ? Math.max(livingReference, 300000) : livingReference) * city.c * 0.40
  let income = scenarioMult.y1Income
  let cumulSavings = savings - investedAmount
  const timeline = []
  const startYear = new Date().getFullYear()
  const years = [0,1,2,3,4].map(i => startYear + i)

  for (let i = 0; i < 5; i++) {
    const year = years[i]

    if (i > 0) {
      const variation = 1 + (((year * 17 + params.rawDecision.length * 3 + i * 11) % 13) - 6) * 0.012
      income = income * (1 + scenarioMult.growthRate) * variation
    }

    if (analysis.domain === 'education') {
      if (i <= 1) {
        income = currentSalary * 0.03
      } else {
        const postDegFactor = type === 'optimistic' ? 2.2 + q*0.5
          : type === 'realistic' ? (q >= 0 ? 1.7 + q*0.3 : 1.0 + q*0.3)
          : (q >= 0 ? 1.2 : 0.9)
        income = currentSalary * postDegFactor * Math.pow(1 + scenarioMult.growthRate, i - 2)
      }
    }

    if (type === 'risky' && i === 1 && scenarioMult.crashMult) {
      income = income * scenarioMult.crashMult
    }

    if (type === 'risky' && i >= 2) {
      // Recovery is slower than realistic growth — risky path should never catch up fully
      const recSpeed = q >= 0 ? 0.15 + r*0.10 : 0.05 + r*0.05
      income = income * (1 + recSpeed)
    }

    if (type === 'realistic' && q < -0.3 && i >= 2) {
      income = income * (1 + 0.03)
    }

    // Apply income cap (critical for physical businesses)
    if (scenarioMult.incomeCap && income > scenarioMult.incomeCap) {
      income = scenarioMult.incomeCap
    }

    // Floor: business income can't go negative
    income = Math.max(income, Math.max(floorIncome, 0))

    // Add passive income (pension / part-time base) ON TOP of business income
    // This makes the total = what the person actually earns in total
    const totalIncome = income + passiveIncome

    // Ensure total income never drops below passive floor (pension is always there)
    const finalIncome = Math.max(totalIncome, passiveFloor)

    // ── Use finalIncome for all downstream calculations ──
    // 'income' is BUSINESS income only (used for caps/floors)
    // 'finalIncome' is TOTAL income (business + pension/passive)
    // All user-facing numbers, savings, and adequacy use finalIncome

    // Stress
    const baseStress = cfg.stress
    const isBad = type === 'risky' && i <= 1
    const stress = clamp(Math.round(
      baseStress + scenarioMult.stressMod + RM.stress
      + (isBad ? 2 : 0)
      + (type === 'optimistic' ? -i * 0.4 : -i * 0.1)
    ), 1, 10)

    // Career score
    const cProgress = (i / 4) * (8 - 3)
    const cMult = type === 'optimistic' ? 1.3 + q*0.2
      : type === 'realistic' ? 1.0 + q*0.15
      : (i < 2 ? 0.5 : 0.8 + q*0.1)
    const careerScore = clamp(Math.round((3 + cProgress) * cMult * RM.career), 1, 10)

    // Relationship score
    const relBase = 5 + RM.rel
      + (type === 'optimistic' ? i * 0.35 : 0)
      + (type === 'risky' && i < 2 ? -2.5 : 0)
      + (type === 'realistic' && q < 0 ? -0.5 * i : 0)
    const relationshipScore = clamp(Math.round(relBase), 1, 10)

    // Savings: use TOTAL income (finalIncome) for net calculation
    const netIncome = finalIncome - annualEMI
    const yearSaved = Math.max(0, netIncome - livingCost) * scenarioMult.savingsRate
    const emergencyDraw = type === 'risky' && i === 1
      ? savings * (0.15 + Math.abs(q) * 0.20) : 0
    // Retired: savings floor = 0 (pension covers living, don't draw down more than invested)
    const savingsFloor = empStatus === 'retired' ? 0 : -investedAmount * 0.5
    cumulSavings = Math.max(savingsFloor, cumulSavings + yearSaved - emergencyDraw)

    // ── Life quality scores ────────────────────────────────────────────────
    // These are NOT just income proxies — they track how the person actually feels
    const { primaryMotivation, motivationType } = analysis

    // Scenario severity multiplier — risky path has sustained drag throughout, not just year 1-2
    const riskySeverity = type === 'risky'
      ? (i === 0 ? 0.0    // year 0: decision made, not yet feeling it
       : i === 1 ? -2.5   // year 1: crash — worst period
       : i === 2 ? -1.8   // year 2: still recovering, stress high
       : i === 3 ? -1.0   // year 3: partial recovery
       : -0.5)            // year 4: mostly recovered but scarred
      : 0

    // HAPPINESS: blend of stress, relationship, purpose alignment, income adequacy
    const incomeRef = empStatus === 'retired' ? currentSalary
      : empStatus === 'student' ? 400000
      : Math.max(currentSalary, 300000)
    const incomeAdequacy = clamp((finalIncome / (incomeRef * 0.8)) - 0.5, 0, 1)  // 0-1
    const stressHappinessDrag = (stress - 5) * 0.3  // high stress crushes happiness
    const motivationBonus =
      motivationType === 'aspiration' ? (type === 'optimistic' ? 1.5 : type === 'realistic' ? 1.0 : 0.3)
      : motivationType === 'escape'   ? (type === 'optimistic' ? 0.8 : type === 'realistic' ? 0.5 : -0.5)
      : 0.5  // mixed
    const happinessBase = 5 + motivationBonus - stressHappinessDrag + incomeAdequacy * 1.5 + riskySeverity * 0.5
    const happiness = clamp(Math.round(happinessBase + (i > 2 ? 0.5 : 0)), 1, 10)

    // PURPOSE: does this work feel meaningful? Tied to motivation type, not income
    const purposeByDomain = {
      startup: 7, freelance: 6, abroad: 5, education: 6,
      investment: 4, promotion: 5, general: 5,
    }
    const purposeBase = purposeByDomain[analysis.domain] || 5
    const purposeMotivMod =
      primaryMotivation === 'passion'  ? 2.5
      : primaryMotivation === 'freedom' ? 1.5
      : primaryMotivation === 'growth'  ? 1.5
      : primaryMotivation === 'money'   ? -0.5
      : primaryMotivation === 'escape'  ? 0.5
      : 0
    // Risky: purpose drops during crash years, slowly rebuilds — NOT same as realistic
    const purposeScenarioMod = type === 'optimistic' ? 1.0
      : type === 'risky' ? riskySeverity * 0.6
      : 0
    const purpose = clamp(Math.round(purposeBase + purposeMotivMod + purposeScenarioMod + (i > 1 ? 0.3 : 0)), 1, 10)

    // FREEDOM: autonomy, time control
    const freedomByDomain = { startup: 8, freelance: 9, abroad: 5, education: 4, investment: 7, promotion: 3, general: 5 }
    const freedomBase = freedomByDomain[analysis.domain] || 5
    const freedomMotivMod = primaryMotivation === 'freedom' ? 1.5 : 0
    // Risky: financial stress kills perceived freedom throughout the bad years
    const freedomScenarioMod = type === 'optimistic' ? 0.5
      : type === 'risky' ? riskySeverity * 0.4
      : 0
    const freedom = clamp(Math.round(freedomBase + freedomMotivMod + freedomScenarioMod), 1, 10)

    // LIFE SCORE: holistic — weighted average
    // Risky path gets an additional direct penalty to ensure clear separation from realistic
    const lifeScoreBase = happiness * 0.35 + purpose * 0.25 + freedom * 0.15 + careerScore * 0.15 + (10 - stress) * 0.10
    const lifeScore = clamp(Math.round(lifeScoreBase + (type === 'risky' ? riskySeverity * 0.3 : 0)), 1, 10)

    timeline.push({
      year,
      income:            Math.round(finalIncome / 1000) * 1000,
      businessIncome:    Math.round(income / 1000) * 1000,    // business-only income (for reference)
      passiveBase:       Math.round(passiveIncome / 1000) * 1000,  // pension/base income
      stress,
      careerScore,
      relationshipScore,
      happiness,
      purpose,
      freedom,
      lifeScore,
      savings:           Math.round(cumulSavings / 10000) * 10000,
      event:             getEvent(analysis.domain, type, i, analysis, params, q),
      milestone:         getMilestone(analysis.domain, type, i, q),
    })
  }

  return timeline
}

// ─── EVENT GENERATOR (uses actual user input) ─────────────────────────────

function getEvent(domain, type, i, analysis, params, q) {
  const job = params.currentJob || 'current role'
  const company = params.currentCompany || 'current company'
  const fund = params.fundingType
  const selfDeployed = params.savings * params.savingsUsagePct / 100
  const loanAmt2 = params.loanAmount || 0
  const extAmt2  = params.externalAmount || 0
  const totalCapitalStr = fmt(selfDeployed + loanAmt2 + extAmt2)
  const investAmt = totalCapitalStr
  const snippet = analysis.snippet

  const badDecision = q < -0.2
  const goodDecision = q > 0.2

  const ev = {
    startup: {
      optimistic: [
        `Left ${company}, deployed ${investAmt} into startup`,
        'MVP launched, first 20 paying customers',
        'Revenue ₹5L/month, raised seed round',
        'Team of 8, Series A conversations started',
        'Profitable, growing 3x YoY, hiring senior team',
      ],
      realistic: goodDecision ? [
        `Quit ${job}, slower start than hoped`,
        'MVP shipped in 4 months, 6 paying customers',
        'Break-even on product revenue, team of 2',
        'Steady growth, 25% MoM, no outside funding',
        'Sustainable business, ₹2-3L/month revenue',
      ] : [
        `Left ${job} — initial momentum not building`,
        'MVP struggled to find users, extended runway',
        'Pivoted twice, still searching for fit',
        'Consulting on side to keep startup alive',
        'Startup paused, returned to employment',
      ],
      risky: goodDecision ? [
        `Deployed ${investAmt} — runway tighter than expected`,
        'Serious cash crunch, took consulting to survive',
        'Pivoted, new direction showing early signs',
        'Revenue returning, team rebuilt smaller',
        'Surviving and growing, scars earned',
      ] : [
        `Deployed ${investAmt} — burned fast`,
        'Runway exhausted, had to wind down',
        'Lost most investment, back to job market',
        'Rebuilding financially, trauma of failure',
        'New job, wiser and rebuilding savings',
      ],
    },
    freelance: {
      optimistic: [
        `Left ${company}, first retainer client in week 1`,
        'Rate raised 50%, 3 long-term clients secured',
        'Launched productised service, passive revenue starts',
        '₹1Cr+ annual billing, team of 2',
        'Selective clientele, working 4 days/week',
      ],
      realistic: goodDecision ? [
        'Dry 6 weeks, then first client found',
        'Stable 2-client base, income predictable',
        'Rate raised 25%, referrals starting',
        'Consistent ₹50-70K/month net',
        'Steady niche expert, good work-life balance',
      ] : [
        'Client acquisition harder than expected',
        'Below-rate work to survive the dry spell',
        'Main client left, scrambling to replace',
        'Income inconsistent, stress is high',
        'Barely ahead of salaried income, no stability',
      ],
      risky: goodDecision ? [
        'No clients for 2 months, savings draining',
        'Emergency: took temp job to cover bills',
        'Freelance rebuilt part-time alongside temp work',
        'Fully freelance again, lessons learned',
        'Growing but cautious, buffer always maintained',
      ] : [
        'No clients for 3+ months — depleting savings',
        `Used ${investAmt} savings to survive`,
        'Had to go back to full-time employment',
        'Side freelancing while rebuilding savings',
        'Stable job, freelance as side-income only',
      ],
    },
    abroad: {
      optimistic: [
        'Visa approved, smooth relocation',
        'Performed well, promoted in year 1',
        'PR process started, bought first asset abroad',
        'Senior role, building global network',
        'PR approved, long-term life established',
      ],
      realistic: goodDecision ? [
        'Moved — settling-in period tough but ok',
        'Stable in role, adjusting to new culture',
        'Visa renewed, network growing',
        'Mid-senior level, sending money home',
        'Settled life abroad, no plans to return yet',
      ] : [
        'Relocation rougher than expected',
        'Job performance issues in new environment',
        'Visa concern, switched to lesser role to stay',
        'Found footing but not the career leap imagined',
        'Stable abroad but not dramatically ahead',
      ],
      risky: goodDecision ? [
        'Visa delays pushed start by 3 months',
        'Brief layoff — job market abroad competitive',
        'New role found, rebuilding momentum',
        'Steady now, learned the hard way',
        'Established, wiser about risks of moving',
      ] : [
        'Visa/job issues stacked up quickly',
        'Laid off, visa tied to employer — had to leave',
        'Back in India, financial impact significant',
        'Rebuilding career at home',
        'Stable domestically, overseas dream deferred',
      ],
    },
    education: {
      optimistic: [
        `Left ${job}, enrolled in target programme`,
        'Top 10% of batch, best summer internship offer',
        'Graduated — premium placement, 2.5x previous CTC',
        'Fast-tracked in post-MBA role, leading team',
        'Director-level, MBA fully paid for itself',
      ],
      realistic: goodDecision ? [
        `Left ${job}, enrolled, adjusting to academic pace`,
        'Average batch standing, decent internship',
        'Graduated — good offer, 1.7x previous CTC',
        'Steady growth in post-MBA org',
        'Senior IC — solid career, no regrets',
      ] : [
        'Programme cost more than budgeted',
        'Below average batch standing, stress high',
        'Post-degree offers below expectations',
        'Took offer below peers, still adjusting',
        'Income now above pre-degree but took long',
      ],
      risky: goodDecision ? [
        `Used ${investAmt} for fees — financially tight`,
        'Academic struggle + financial stress',
        'Graduated, had to take backup offer',
        'Performing ok in post-degree role',
        'Finally above pre-MBA income, relief',
      ] : [
        `Fees wiped ${investAmt} — loan also taken`,
        'Academic and financial stress severe',
        'Dropped out or passed with low standing',
        'Struggling in job market with debt',
        'Debt burden significant, income just covers EMI',
      ],
    },
    investment: {
      optimistic: [
        `Deployed ${investAmt} across diversified portfolio`,
        'Portfolio +35%, added real estate SIP',
        'Passive income ₹30K/month from rental',
        'Multiple income streams, FI approaching',
        'Financially independent, working by choice',
      ],
      realistic: goodDecision ? [
        `Deployed ${investAmt}, staying disciplined`,
        'Portfolio +12%, compounding steady',
        'Added second asset class, diversified',
        '2.5x net worth from start, no debt',
        'Comfortable passive income alongside career',
      ] : [
        `Deployed ${investAmt} — market timing poor`,
        'Portfolio down 20%, holding through volatility',
        'Sold some assets in panic, lost gains',
        'Recovery phase, more conservative now',
        'Back to near-breakeven — expensive lesson',
      ],
      risky: goodDecision ? [
        `Heavy position — ${investAmt} all in one asset`,
        '40% drawdown — portfolio in crisis',
        'Liquidated partially to stop the bleeding',
        'Rebuilt with different strategy',
        'Recovered to 80% of original — lesson learned',
      ] : [
        `All-in bet of ${investAmt} went wrong`,
        'Near-total loss — had to liquidate everything',
        'Working to repay loss, no savings left',
        'Slowly rebuilding from scratch',
        'Back at zero — 5 years lost financially',
      ],
    },
    promotion: {
      optimistic: [
        `Left ${company} for new role — great first impression`,
        'Exceeded targets, promoted in first year',
        'Leading team of 5, equity vesting started',
        'Senior manager — headhunted regularly',
        'VP-level track clear, total comp 3x before',
      ],
      realistic: goodDecision ? [
        'Joined new role, learning curve expected',
        'Good review cycle, on track for hike',
        'Promoted, managing small team',
        'Respected contributor, comp growing steadily',
        'Senior role, stable trajectory',
      ] : [
        'Role different from what was described',
        'Manager changed, key sponsor lost',
        'Missed promotion cycle, frustration',
        'Thinking of switching again',
        'Comp grew but below original expectations',
      ],
      risky: goodDecision ? [
        'Role didn\'t start as expected',
        'Restructuring hit team, role changed',
        'Rebuilt reputation in new team',
        'Promotion delayed but achieved',
        'Stable — not the dream outcome but solid',
      ] : [
        'Role was misrepresented in interview',
        'Laid off in 8 months — bad cultural fit',
        'Back in job market, income gap hurts',
        'New job found at same level as before',
        'Back to baseline — 2 years wasted',
      ],
    },
    general: {
      optimistic: [
        'Decision executed with full clarity',
        'Early results validate the move',
        'Momentum building, trajectory clear',
        'Recognised for consistent performance',
        'Goals achieved, next chapter clear',
      ],
      realistic: goodDecision ? [
        'Transition complete, adjusting well',
        'Steady early progress',
        'Results visible, confidence up',
        'Respected in new context',
        'Stable and satisfied',
      ] : [
        'Transition harder than expected',
        'Progress slower than hoped',
        'Some regret, but pushing through',
        'Adapting, finding small wins',
        'Stable but not the transformation imagined',
      ],
      risky: [
        'Rough start, unexpected obstacles',
        'Major setback — rethinking everything',
        'Slowly recovering, cutting losses',
        'New plan forming, regaining ground',
        'Rebuilt — harder but much wiser',
      ],
    },
  }

  const d = ev[domain] || ev.general
  const s = d[type] || d.realistic
  return s[Math.min(i, s.length - 1)]
}

function getMilestone(domain, type, i, q) {
  const good = q >= 0
  const bad  = q < -0.2

  const M = {
    startup: {
      optimistic: ['Idea deployed','MVP live','Seed funded','Series A','Market leader'],
      realistic:  good ? ['Launched lean','First revenue','Break-even','Sustainable','Niche leader']
                       : ['Launched, struggling','Pivoting','Side income','Winding down','Back to job'],
      risky:      good ? ['Savings deployed','Cash crunch','Pivot made','Recovering','Profitable']
                       : ['All-in deployed','Failed','Losses taken','Job hunting','Rebuilding'],
    },
    freelance: {
      optimistic: ['First client','Rate 2x','Productised','₹1Cr billing','Lifestyle biz'],
      realistic:  good ? ['Client found','Stable','Rate raised','Referrals flowing','Niche expert']
                       : ['Struggling for clients','Below-rate','Lost anchor','Inconsistent','Barely ahead'],
      risky:      good ? ['No clients','Temp job','Rebuilt pt-time','Back ft freelance','Cautious growth']
                       : ['No clients','Savings gone','Job taken','Side hustle','Salaried again'],
    },
    education: {
      optimistic: ['Enrolled + scholarship','Top intern','Premium job','Fast promoted','Leadership'],
      realistic:  good ? ['Enrolled','Decent intern','Good job +70%','Progressing','Senior IC']
                       : ['Enrolled (costly)','Struggling','Below-avg offer','Adjusting','Finally ahead'],
      risky:      good ? ['Fees deployed','Financial stress','Graduated','Backup offer','Relief — ahead']
                       : ['Fees + loan','Academic fail','Dropout/low grade','Debt burden','Breaking even'],
    },
    abroad: {
      optimistic: ['Relocated','Promoted Y1','PR started','Property bought','PR done'],
      realistic:  good ? ['Settled','Stable role','Visa ok','Mid-senior','Long-term stay']
                       : ['Rough landing','Struggling','Holding on','Found footing','Stable not thriving'],
      risky:      good ? ['Visa delay','Laid off','New role','Recovering','Established']
                       : ['Issues stacked','Had to leave','Back in India','Rebuilding','Domestic career'],
    },
    investment: {
      optimistic: ['Capital deployed','+35%','RE + passive','FI near','FI hit'],
      realistic:  good ? ['Deployed','Steady +12%','Diversified','2.5x NW','Passive income']
                       : ['Deployed','Market down','Panic sold','Recovery','Break-even finally'],
      risky:      good ? ['All-in','40% down','Liquidated','Rebuilt','80% recovered']
                       : ['All-in','Total loss','Repaying','Rebuilding zero','5 years lost'],
    },
    promotion: {
      optimistic: ['Strong start','Fast-tracked','Team lead','Equity vesting','VP track'],
      realistic:  good ? ['Settled in','Good review','Promoted','Steady comp','Senior role']
                       : ['Role mismatch','Sponsor lost','Missed promo','Switching again','Below expectations'],
      risky:      good ? ['Rough start','Restructured','Rebuilt rep','Delayed promo','Solid end']
                       : ['Misrepresented role','Laid off','Job hunting','Back to baseline','2 years wasted'],
    },
    general: {
      optimistic: ['Started strong','Momentum','Results clear','Recognised','Goals met'],
      realistic:  good ? ['Executed','Adjusting','Progress','Competent','Satisfied']
                       : ['Harder than expected','Slow progress','Pushing through','Small wins','Stable not transformed'],
      risky:      ['Rough start','Major setback','Cutting losses','Regrouping','Rebuilt wiser'],
    },
  }

  const d = M[domain] || M.general
  const s = d[type] || d.realistic
  return s[Math.min(i, s.length - 1)]
}

// ─── SUMMARIES ────────────────────────────────────────────────────────────

function buildSummaries(timelines, analysis, params, q) {
  const CURRENT_YEAR = new Date().getFullYear()
  const END_YEAR = CURRENT_YEAR + 4
  const { currentSalary, name } = params
  const n = name ? `${name}'s` : 'Your'
  const bst = analysis.businessSubtype

  const opt  = timelines.optimistic
  const real = timelines.realistic
  const risk = timelines.risky

  const qualLabel = q > 0.4 ? 'strong' : q > 0 ? 'decent' : q > -0.3 ? 'questionable' : 'high-risk'

  // Business context note — tells user WHY the numbers are what they are
  const bizNote = bst
    ? ` (${bst.cfg.note})`
    : ''

  const isZeroIncome = currentSalary === 0 || ['student','unemployed','homemaker'].includes(params.employmentStatus)
  const realVsStay = isZeroIncome
    ? real[4].income > 0  // any income beats zero
    : real[4].income >= currentSalary * Math.pow(1.1, 4)

  return {
    optimistic: `Best case${bizNote}: by ${END_YEAR} ${n} income reaches ${fmt(opt[4].income)} with ${fmt(opt[4].savings)} saved. Career score ${opt[4].careerScore}/10, stress ${opt[4].stress}/10. This requires consistent execution and some luck — not guaranteed.`,

    realistic: isZeroIncome
      ? `Most likely outcome${bizNote}: ${fmt(real[4].income)}/yr by ${END_YEAR}, ${fmt(real[4].savings)} saved. Career ${real[4].careerScore}/10. ${realVsStay ? 'Clear income gain — you start from ₹0 today.' : 'Income still building — takes time from a zero base.'}`
      : q >= 0
        ? `Most likely outcome${bizNote}: ${fmt(real[4].income)} by ${END_YEAR}, ${fmt(real[4].savings)} saved. Career ${real[4].careerScore}/10. ${realVsStay ? 'Ahead of staying put.' : 'Slightly behind staying — validate the non-financial upside.'}`
        : `Honest projection${bizNote}: this decision has headwinds. By ${END_YEAR} only ${fmt(real[4].income)} — ${real[4].income < currentSalary ? 'BELOW your current salary' : 'minimal improvement'}. Average stress ${Math.round(real.reduce((s,y) => s+y.stress,0)/5)}/10. The fundamentals need work.`,

    risky: q >= 0
      ? `Rough ride version${bizNote}: ${CURRENT_YEAR+1} hits hard — income drops to ${fmt(risk[1].income)}, stress ${risk[1].stress}/10. Recovery by ${CURRENT_YEAR+2}, exit ${END_YEAR} at ${fmt(risk[4].income)}. Survivable with enough runway.`
      : `Worst case${bizNote}: ${CURRENT_YEAR+1} is very bad — income ${fmt(risk[1].income)}, stress ${risk[1].stress}/10. Slow partial recovery. By ${END_YEAR}: ${fmt(risk[4].income)} — likely below where you started. Have a clear exit plan before committing.`,
  }
}

// ─── INSIGHTS ─────────────────────────────────────────────────────────────

function buildInsights(timelines, params, q, analysis) {
  const CURRENT_YEAR = new Date().getFullYear()
  const END_YEAR = CURRENT_YEAR + 4
  const { currentSalary, savings, savingsUsagePct, fundingType } = params
  const deployed = savings * savingsUsagePct / 100
  const effSalary = currentSalary > 0 ? currentSalary : savings * 0.15
  const runway = (savings - deployed) / (effSalary / 12)
  const bst = analysis.businessSubtype

  const opt  = timelines.optimistic
  const real = timelines.realistic
  const risk = timelines.risky

  const isZeroIncome = currentSalary === 0 || ['student','unemployed','homemaker'].includes(params.employmentStatus)
  const realVsStay = isZeroIncome
    ? real[4].income  // vs zero baseline — always positive if earning anything
    : real[4].income - (currentSalary * Math.pow(1.10, 4))

  const qualityNote = q > 0.3
    ? `Decision quality is solid (${(q*100).toFixed(0)}/100) — execution is your main variable now, not whether to do this.`
    : q > -0.2
    ? `Decision quality is borderline (${(q*100).toFixed(0)}/100) — small execution mistakes will push you toward the risky outcome.`
    : `Decision quality is weak (${(q*100).toFixed(0)}/100) — even the realistic path underperforms staying. Fix runway, funding, or timing first.`

  const businessNote = bst
    ? `This is a ${bst.cfg.note.toLowerCase()}. Realistic owner income ceiling is around ${fmt(bst.cfg.incomeCapReal)} by year 5 — not a path to fast wealth, but can be a solid livelihood with the right execution.`
    : `No specific business type detected — projections use generic growth rates. Add more details about your business model for better accuracy.`

  const fundNote = fundingType === 'loan'
    ? `Loan funding adds real pressure — EMI continues even when revenue dips. Keep 3 months of EMI as a hard reserve.`
    : fundingType === 'parttime'
    ? `Part-time hedging is smart — extends runway and reduces catastrophic risk, but may slow early momentum.`
    : `${deployed > savings * 0.6 ? `Deploying ${savingsUsagePct}% of savings is aggressive — only ${fmt(savings - deployed)} buffer left.` : `Deploying ${savingsUsagePct}% is reasonable, ${fmt(savings - deployed)} buffer maintained.`}`

  const skillNote = params.skillsAnalysis && params.skillsAnalysis.categories.length > 0
    ? `Skill fit is ${params.skillFitScore >= 0.7 ? 'strong' : params.skillFitScore >= 0.4 ? 'partial' : 'weak'} for this move. ${params.skillFitScore < 0.5 ? 'Fill skill gaps before committing or find a co-founder who covers what you lack.' : 'Your background supports this direction.'}`
    : 'Add your skills for a personalised skill-fit assessment.'

  return [
    qualityNote,
    businessNote,
    skillNote,
    isZeroIncome
      ? `Starting from ₹0 income — realistic path builds to ${fmt(real[4].income)} by ${END_YEAR}. ${fundNote}`
      : `Runway after deployment: ${runway.toFixed(1)} months. Realistic path ${realVsStay >= 0 ? `beats staying by ${fmt(realVsStay)} by ${END_YEAR}` : `lags staying by ${fmt(Math.abs(realVsStay))} by ${END_YEAR}`}. ${fundNote}`,
  ]
}

// ─── RECOMMENDATION ───────────────────────────────────────────────────────

function buildRecommendation(analysis, params, timelines, q) {
  const CURRENT_YEAR = new Date().getFullYear()
  const END_YEAR = CURRENT_YEAR + 4
  const { name, riskTolerance, savings, currentSalary, savingsUsagePct, fundingType } = params
  const n = name || 'You'
  const deployed  = savings * savingsUsagePct / 100
  const remaining = savings - deployed
  const effSal2 = currentSalary > 0 ? currentSalary : savings * 0.15
  const runway    = remaining / (effSal2 / 12)

  const realY5    = timelines.realistic[4].income
  const isZeroIncome = currentSalary === 0 || ['student','unemployed','homemaker'].includes(params.employmentStatus)
  const stayY5    = isZeroIncome ? 0 : currentSalary * Math.pow(1.10, 4)
  const realLife5 = timelines.realistic[4].lifeScore
  const realHappy5= timelines.realistic[4].happiness
  const realPurpose5 = timelines.realistic[4].purpose

  const { primaryMotivation, motivationType } = analysis

  // ── Life-first framing ──────────────────────────────────────────────────
  // The recommendation now asks: is this right for THIS person's life, not just their wallet?

  const lifeWinsMoneyLoses = realLife5 >= 7 && realY5 < stayY5
  const moneyWinsLifeLoses = realY5 > stayY5 * 1.2 && realLife5 < 6
  const bothWin = realY5 >= stayY5 && realLife5 >= 7
  const bothLose = realY5 < stayY5 && realLife5 < 5

  const motivNote =
    motivationType === 'escape'
      ? `You're mainly trying to escape your current situation — that's valid, but make sure you're running *towards* something, not just away. A different job first might fix the same problem with less risk.`
      : motivationType === 'aspiration'
      ? `You're pulled towards this by genuine interest — that's the best reason to make a hard move. Passion-driven decisions have higher follow-through.`
      : `Your motivations are mixed — some push (dissatisfaction) and some pull (opportunity). That's normal. The question is: would you do this even if it paid the same as staying?`

  const moneyNote =
    lifeWinsMoneyLoses
      ? `Financially it trails staying — but life quality scores are higher. If money isn't the primary driver, that trade-off may be exactly right for you.`
      : moneyWinsLifeLoses
      ? `The numbers look good but life quality doesn't improve much. Ask: is a ${fmt(realY5 - stayY5)} income gain worth the stress and purpose cost?`
      : bothWin
      ? `Both income and life quality improve — that's rare. Strong signal this is the right direction.`
      : bothLose
      ? `Both income and life quality decline in the realistic path. This needs serious reconsideration.`
      : `Income and life quality roughly neutral vs staying.`

  // Financial safety note
  const safetyNote = runway < 6
    ? `Financial safety is the urgent issue — only ${runway.toFixed(1)} months of runway. Build to 9 months before committing.`
    : fundingType === 'loan' && q < 0
    ? `Loan + weak fundamentals is the dangerous combination here. De-risk by reducing loan or improving the business plan first.`
    : q > 0.3 && runway >= 9
    ? `Decision fundamentals are solid and runway is healthy — the main variable is execution.`
    : `Runway is workable but watch the ${runway.toFixed(0)}-month clock carefully.`

  return `${motivNote} ${moneyNote} ${safetyNote}`
}

// ─── BASELINE & COMPARISON ────────────────────────────────────────────────

export function generateComparison(form, timelines) {
  const currentSalary = parseSalary(form.currentSalary)
  const currentSavings = parseSalary(form.savings)
  const job = form.currentJob || 'Current role'
  const company = form.currentCompany || ''

  const empStatus = form.employmentStatus || 'employed'
  const isZeroBase = currentSalary === 0 || ['student','unemployed'].includes(empStatus)

  // "Stay" baseline depends on current situation:
  // - Employed: 10% annual hike
  // - Unemployed: assumes gets a new job by 2026, modest salary
  // - Retired: flat pension income
  // - Student: gets a job in current year, grows from there
  const baselineEvents = {
    employed:  ['Stayed in current role','Annual increment received','Performance review cycle','Senior responsibilities added','Comfortable plateau'],
    unemployed:['Still job-hunting','Got a new job — reset career','Settling into new role','Steady progress','Stable career, not exciting'],
    retired:   ['Retirement — pension income','Pension + occasional income','Steady retired life','Aging comfortably','Long-term retirement steady'],
    student:   ['Placed in campus job / first role','Second year at job — increment','Progressing in career','Growing professionally','Established in career track'],
    homemaker: ['Stayed at home, no income','Family income continues','Family income grows','Family income stable','Comfortable household'],
    self:      ['Continued current business','Business grows steadily','Scale achieved','Revenue growing','Mature business — steady'],
    parttime:  ['Part-time work continues','Slight income growth','Consistent part-time income','Stable part-time track','Comfortable part-time life'],
  }
  const evArr = baselineEvents[empStatus] || baselineEvents.employed

  const getBaselineIncome = (i) => {
    if (empStatus === 'unemployed') {
      // Year 1: likely still job hunting (low/no income), Year 2+: new job
      if (i === 0) return Math.round(currentSalary * 0.3 / 1000) * 1000  // some freelance
      return Math.round(Math.max(currentSalary, 400000) * Math.pow(1.08, i-1) / 1000) * 1000
    }
    if (empStatus === 'retired') {
      return Math.round((currentSalary || form.savings * 0.06) * Math.pow(1.03, i) / 1000) * 1000
    }
    if (empStatus === 'student') {
      if (i === 0) return 0  // still studying or just placed
      return Math.round(300000 * Math.pow(1.12, i-1) / 1000) * 1000  // entry level grows
    }
    if (empStatus === 'homemaker') return 0  // no personal income
    return Math.round(currentSalary * Math.pow(1.10, i) / 1000) * 1000
  }

  const startYear = new Date().getFullYear()
  const baseline = [0,1,2,3,4].map(i => startYear + i).map((year, i) => ({
    year,
    income:    getBaselineIncome(i),
    stress:    empStatus === 'unemployed' ? (i === 0 ? 7 : 5) : 5,
    careerScore: Math.min(8, 5 + i * 0.4),
    relationshipScore: 6,
    savings:   Math.round((currentSavings + (getBaselineIncome(i) * 0.20 * (i + 1))) / 10000) * 10000,
    event:     evArr[i] || evArr[evArr.length - 1],
    milestone: ['Status quo','Year 2','Year 3','Year 4','Year 5'][i],
  }))

  const empStatusComp = form.employmentStatus || 'employed'

  const scenarios = ['optimistic','realistic','risky'].map(type => {
    const tl  = timelines[type]
    const y5  = tl[4]
    const b5  = baseline[4]
    const inc = y5.income - b5.income
    const sav = y5.savings - b5.savings
    const str = y5.stress - 5

    // For retired/part-time: income in timelines ALREADY includes passive income
    // So comparison is valid: timeline.income vs baseline.income is apples-to-apples
    // However the verdict wording needs to be smarter

    // Student/unemployed: baseline is ₹0 or near-zero — any income from the move is positive
    // Retired/homemaker: pension/family income continues — business adds on top
    const isZeroBaseStatus = ['student', 'unemployed', 'homemaker'].includes(empStatusComp)
    const alwaysPositive = empStatusComp === 'retired' || empStatusComp === 'homemaker'
    const isStudentOrUnemployed = ['student', 'unemployed'].includes(empStatusComp)

    // For students/unemployed: if baseline is 0, comparison is meaningless as "less than staying"
    // The real question is just: what income does this path generate?
    const effectiveInc = isStudentOrUnemployed && b5.income === 0 ? y5.income : inc

    const verdictLabel = alwaysPositive
      ? (inc >= 0 ? `▲ ${fmt(inc)} more than staying (pension + business)` : `Your business income fully covers your investment`)
      : isStudentOrUnemployed && b5.income === 0
        ? (y5.income > 0 ? `▲ ${fmt(y5.income)} income — vs ₹0 if you stayed as student` : `Still building — income starting from zero`)
        : inc >= 0 ? `▲ ${fmt(inc)} more than staying` : `▼ ${fmt(Math.abs(inc))} LESS than staying`

    const effectiveDelta = isStudentOrUnemployed && b5.income === 0 ? y5.income : inc

    return {
      type,
      yFinalIncome:   y5.income,
      baselineIncome: b5.income,
      incomeDelta:    effectiveDelta,
      savingsDelta:   sav,
      stressDelta:    str,
      verdict:        verdictLabel,
      savingsVerdict: sav >= 0 ? `▲ ${fmt(sav)} more saved` : `▼ ${fmt(Math.abs(sav))} less saved (savings deployed into business)`,
      stressVerdict:  str < 0 ? `${Math.abs(str)} pts less stressful` : str > 0 ? `${str} pts more stressful` : 'Same stress',
      worthIt: alwaysPositive && inc >= 0 ? '✅ Total income higher than just pension'
        : isStudentOrUnemployed && b5.income === 0 && y5.income > 0 ? '✅ Earning income — better than staying at zero'
        : effectiveDelta >= 0 && sav >= 0 && str <= 1 ? '✅ Better across the board'
        : effectiveDelta >= 0 && str <= 3             ? '📈 Higher income — stress is the trade-off'
        : effectiveDelta < 0 && Math.abs(effectiveDelta) < 200000 ? '⚖️ Marginal — non-financial gains matter here'
        :                                    '⚠️ Significantly worse than staying in this scenario',
    }
  })

  return { baseline, currentSalary, scenarios }
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────

export async function generateTimelines(form) {
  await new Promise(r => setTimeout(r, 1800 + Math.random() * 1400))
  const CURRENT_YEAR = new Date().getFullYear()
  const END_YEAR = CURRENT_YEAR + 4

  const savingsUsagePct = parseInt(form.savingsUsagePct) || 50
  const currentSalary   = parseSalary(form.currentSalary)
  const savings         = parseSalary(form.savings)
  const age             = parseInt(form.age) || 26
  const yearsExp        = parseInt(form.yearsOfExperience) || 3

  const analysis = analyseDecision(form.careerDecision, form.currentSituation)
  const city     = getCity(form.city || 'Bangalore')

  const loanAmount     = parseSalary(form.loanAmount)
  const externalAmount = parseSalary(form.externalAmount)

  // Skill analysis
  const skillText     = (form.skills || '') + ' ' + (form.resumeText || '')
  const skillsAnalysis = parseSkills(skillText)

  const params = {
    age, yearsExp, savings, currentSalary, city,
    riskTolerance:    parseInt(form.riskTolerance) || 5,
    relPriority:      form.relationshipPriority || 'Balanced',
    savingsUsagePct,
    fundingType:      form.fundingType || 'savings',
    loanAmount,
    externalAmount,
    employmentStatus: form.employmentStatus || 'employed',
    currentJob:       form.currentJob || '',
    currentCompany:   form.currentCompany || '',
    name:             form.name || '',
    rawDecision:      form.careerDecision || '',
    skillsAnalysis,
    skillFitScore:    0.5,  // placeholder, computed after analysis
  }

  const qualityScore = scoreDecisionQuality(analysis, params)
  const skillFit     = scoreSkillFit(skillsAnalysis, analysis, params)
  // Now update skillFitScore in params for recommendation
  params.skillFitScore = skillFit.score

  const timelines = {
    optimistic: simulate('optimistic', analysis, city, params, qualityScore),
    realistic:  simulate('realistic',  analysis, city, params, qualityScore),
    risky:      simulate('risky',      analysis, city, params, qualityScore),
  }

  // ── Hard ordering enforcement ──────────────────────────────────────────
  // Ensure: optimistic >= realistic >= risky at every year
  // This prevents the risky path from ever looking better than realistic
  for (let i = 0; i < 5; i++) {
    const opt  = timelines.optimistic[i]
    const real = timelines.realistic[i]
    const risk = timelines.risky[i]

    // Risky income must be <= realistic income
    if (risk.income > real.income) {
      timelines.risky[i] = { ...risk, income: Math.round(real.income * 0.75 / 1000) * 1000 }
    }
    // Realistic income must be <= optimistic income
    if (real.income > opt.income) {
      timelines.realistic[i] = { ...real, income: Math.round(opt.income * 0.90 / 1000) * 1000 }
    }
    // Risky savings must be <= realistic savings (after year 1 crash)
    if (i >= 1 && risk.savings > real.savings) {
      timelines.risky[i] = { ...timelines.risky[i], savings: Math.round(real.savings * 0.70 / 10000) * 10000 }
    }
  }

  const bstLabels = {
    micro_retail: 'Local Retail / Small Shop',
    food_biz: 'Food & Restaurant Business',
    agency: 'Agency / Service Business',
    tech_startup: 'Tech / SaaS Startup',
    ecommerce: 'E-commerce / Online Business',
    manufacturing: 'Manufacturing / Production',
    creator: 'Content Creator / Influencer',
    real_estate_biz: 'Real Estate Development',
    franchise: 'Franchise Business',
    acquisition: 'Company Acquisition',
  }

  // Build motivation profile for UI display
  const motScores = analysis.motivationScores || {}
  const motivDrives = [
    { key: 'passion',  icon: '🔥', name: 'Passion / Love for the work',
      note: motScores.passion  > 0 ? 'Strongly present in your words' : 'Not clearly expressed — worth reflecting on',
      score: Math.min(10, 3 + (motScores.passion || 0) * 2) },
    { key: 'freedom',  icon: '🕊️', name: 'Freedom / Autonomy',
      note: motScores.freedom  > 0 ? 'A key driver for you' : 'Not a primary driver',
      score: Math.min(10, 3 + (motScores.freedom || 0) * 2) },
    { key: 'growth',   icon: '📈', name: 'Growth / Challenge',
      note: motScores.growth   > 0 ? 'You want to keep learning and building' : 'Not explicitly mentioned',
      score: Math.min(10, 3 + (motScores.growth || 0) * 2) },
    { key: 'money',    icon: '💰', name: 'Financial Gain',
      note: motScores.money    > 0 ? 'Income is a clear motivator' : 'Not the primary stated reason',
      score: Math.min(10, 3 + (motScores.money || 0) * 2) },
    { key: 'escape',   icon: '🚪', name: 'Escape / Relief from current role',
      note: motScores.escape   > 0 ? "Strong desire to leave — validate this isn't the main reason" : 'Not primarily about escaping',
      score: Math.min(10, 3 + (motScores.escape || 0) * 2) },
    { key: 'family',   icon: '🏠', name: 'Family / Life balance',
      note: motScores.family   > 0 ? 'Important personal dimension here' : 'Not a stated factor',
      score: Math.min(10, 2 + (motScores.family || 0) * 2) },
  ].filter(d => d.score > 3)  // only show relevant ones

  const motivType = analysis.motivationType || 'mixed'
  const motivLabel =
    motivType === 'aspiration' ? "You're pulled toward this by genuine interest — the strongest kind of motivation."
    : motivType === 'escape'   ? "You're primarily pushed by dissatisfaction. Make sure the destination is something you want, not just away from this."
    : "You have a mix of push and pull factors. Both are valid — just be clear on which will sustain you through the hard months."

  // ── Career Intelligence enrichment ────────────────────────────────────
  let careerIntel = null
  try {
    careerIntel = getCareerIntelligence(analysis.industry, form.city, yearsExp)
    const trajectory = getCareerTrajectory(analysis.industry, yearsExp)
    const salaryIntel = getIntelligentSalaryRef(analysis.industry, currentSalary, form.city, yearsExp, age)
    careerIntel = { ...careerIntel, trajectory, salaryIntel }
  } catch (e) { /* non-critical */ }

  return {
    qualityScore,
    skillFit,
    businessType: analysis.businessSubtype
      ? bstLabels[analysis.businessSubtype.key] || analysis.businessSubtype.key
      : null,
    motivationProfile: {
      type: motivType,
      label: motivLabel,
      drivers: motivDrives,
    },
    summary:        buildSummaries(timelines, analysis, params, qualityScore),
    timelines,
    keyInsights:    buildInsights(timelines, params, qualityScore, analysis),
    recommendation: buildRecommendation(analysis, params, timelines, qualityScore),
    careerIntelligence: careerIntel,
  }
}
