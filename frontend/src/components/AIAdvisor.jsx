import { useState } from 'react'
import styles from './AIAdvisor.module.css'

const fmt = v => {
  if (!v && v !== 0) return '₹0'
  const n = Math.abs(v)
  const s = v < 0 ? '-' : ''
  if (n >= 10000000) return `${s}₹${(n/10000000).toFixed(1)}Cr`
  if (n >= 100000)   return `${s}₹${(n/100000).toFixed(1)}L`
  return `${s}₹${n.toLocaleString('en-IN')}`
}

// ─── SKILL + CITY BASED ALTERNATIVE RECOMMENDATIONS ──────────────────────
function buildAlternativeRecommendations(result, form) {
  const skills    = (form.skills || '').toLowerCase()
  const city      = (form.city   || '').toLowerCase()
  const industry  = result.careerIntelligence?.salaryIntel
  const traj      = result.careerIntelligence?.trajectory
  const empStatus = form.employmentStatus || 'employed'
  const yearsExp  = parseInt(form.yearsOfExperience) || 0
  const age       = parseInt(form.age) || 28
  const currentSal = parseFloat(String(form.currentSalary||'0').replace(/[,₹\s]/g,'').replace(/l$/i,'')) || 0
  const currentSalNum = currentSal > 1000 ? currentSal : currentSal * 100000
  const ci = result.careerIntelligence

  const recs = []

  // ── SKILL-BASED RECOMMENDATIONS ──────────────────────────────────────────
  const hasTech     = /python|javascript|react|java|coding|software|developer|sql|data|ml|ai/.test(skills)
  const hasFinance  = /finance|ca|accounting|cfa|banking|investment|equity|audit/.test(skills)
  const hasMarketing= /marketing|seo|social media|content|brand|digital|growth/.test(skills)
  const hasSales    = /sales|business development|bd|client|negotiation|crm/.test(skills)
  const hasDesign   = /design|ui|ux|figma|photoshop|graphic|creative|branding/.test(skills)
  const hasTeaching = /teaching|training|coaching|faculty|education|curriculum/.test(skills)
  const hasLegal    = /law|legal|advocate|llb|compliance|contract/.test(skills)
  const hasHealthcare=/doctor|medical|mbbs|nurse|pharma|clinical|healthcare/.test(skills)
  const hasMgmt     = /management|leadership|operations|project manager|strategy/.test(skills)
  const hasLogistics= /logistics|supply chain|procurement|warehouse|transport/.test(skills)

  // Gulf opportunity — always high value if relevant skills
  const gulfCities = ['dubai','abu dhabi','riyadh','doha','muscat','bahrain','kuwait']
  const isInGulf   = gulfCities.some(c => city.includes(c))
  const isInMetro  = ['bangalore','mumbai','delhi','hyderabad','pune','chennai'].some(c => city.includes(c))
  const isInTier2  = !isInMetro && !isInGulf

  if (!isInGulf) {
    if (hasTech && yearsExp >= 3) {
      recs.push({
        icon: '🌍',
        title: 'Move to Dubai / Singapore — 3–4x salary, tax-free',
        why: `With ${yearsExp}+ years of tech experience, you qualify for Employment Pass (Singapore) or Employment Visa (Dubai). Tax-free salary means ₹${Math.round(currentSalNum * 3.5 / 100000)}L–${Math.round(currentSalNum * 5 / 100000)}L equivalent take-home. Indian tech community in both cities is massive.`,
        effort: 'medium',
        timeline: '3–6 months to land offer',
        badge: '💰 2–4x income',
      })
    }
    if (hasHealthcare) {
      recs.push({
        icon: '🏥',
        title: 'Gulf countries are desperately seeking Indian doctors',
        why: `DHA (Dubai), HAAD (Abu Dhabi), and Saudi MOH are all actively recruiting. A doctor earning ₹${Math.round(currentSalNum/100000)}L in India typically earns ₹${Math.round(currentSalNum * 4 / 100000)}L+ tax-free in UAE. MBBS + 2yr experience qualifies for most positions.`,
        effort: 'medium',
        timeline: '4–8 months (license transfer)',
        badge: '🚀 4x income',
      })
    }
    if (hasTeaching) {
      recs.push({
        icon: '📚',
        title: 'International school teacher in UAE/Qatar — package deal',
        why: `KHDA-approved schools in Dubai pay ₹${Math.round(currentSalNum * 4 / 100000)}L–${Math.round(currentSalNum * 5 / 100000)}L equivalent with furnished housing, flight allowance, and health insurance included. Indian curriculum schools are always hiring. IELTS 7+ needed.`,
        effort: 'low',
        timeline: '2–4 months',
        badge: '✈️ Full expat package',
      })
    }
  }

  // Canada pathway for tech/engineering
  if (hasTech && !isInGulf && age < 40) {
    recs.push({
      icon: '🍁',
      title: 'Canada Express Entry — PR in 12–18 months',
      why: `Tech professionals with ${yearsExp}+ years and IELTS 7+ typically score 460–480 CRS points, above the current cutoff. Unlike US H-1B, there's no lottery. PR within 12–18 months, citizenship in 4 years. Toronto tech market paying ${Math.round(currentSalNum * 4 / 100000)}L–${Math.round(currentSalNum * 5 / 100000)}L equivalent.`,
      effort: 'medium',
      timeline: '12–18 months for PR',
      badge: '🛂 PR pathway',
    })
  }

  // Freelancing upside based on skills
  if ((hasTech || hasDesign || hasMarketing || hasLegal) && yearsExp >= 2) {
    const freelanceEstimate = hasTech
      ? `₹${Math.round(currentSalNum * 1.5 / 100000)}L–${Math.round(currentSalNum * 2.5 / 100000)}L`
      : hasDesign ? `₹${Math.round(currentSalNum * 1.3 / 100000)}L–${Math.round(currentSalNum * 2 / 100000)}L`
      : `₹${Math.round(currentSalNum * 1.2 / 100000)}L–${Math.round(currentSalNum * 1.8 / 100000)}L`

    recs.push({
      icon: '💻',
      title: `Freelance ${hasTech ? 'development' : hasDesign ? 'design' : hasMarketing ? 'marketing' : 'consulting'} alongside current job`,
      why: `${hasTech ? 'Upwork, Toptal, and direct client outreach' : hasDesign ? '99designs, Dribbble Pro, direct brands' : hasMarketing ? 'Performance marketing contracts' : 'Contract consulting'} for Indian professionals with your background typically generates ${freelanceEstimate}/yr within 6 months. Weekends only to start — de-risks the leap.`,
      effort: 'low',
      timeline: '1–3 months to first client',
      badge: '⚡ Side income first',
    })
  }

  // MBA / higher education upgrade
  if (hasMgmt || hasSales || hasFinance) {
    if (age < 35 && yearsExp >= 3) {
      recs.push({
        icon: '🎓',
        title: 'Executive MBA or IIM Executive Programme',
        why: `IIM Executive/Certificate programmes (₹8–15L, 1 year, weekends) for working professionals give the IIM brand without leaving your job. Post-programme salary jump is typically 40–70% for management roles. CAT not required for executive tracks — work experience is the entry criterion.`,
        effort: 'high',
        timeline: '1 year programme',
        badge: '📈 40–70% salary jump',
      })
    }
  }

  // City-specific recommendations
  if (isInTier2) {
    recs.push({
      icon: '🏙️',
      title: `Move to Bangalore or Hyderabad — same field, 40–60% salary jump`,
      why: `${city.charAt(0).toUpperCase() + city.slice(1)} salaries are typically 20–30% below Bangalore/Hyderabad for the same role. Remote work is hard to sustain long-term. Relocating to a Tier-1 city typically unlocks ₹${Math.round(currentSalNum * 1.4 / 100000)}L–${Math.round(currentSalNum * 1.6 / 100000)}L for equivalent experience. Hyderabad has lower CoL than Bangalore with near-equal salaries.`,
      effort: 'medium',
      timeline: '1–3 months job search',
      badge: '💼 40–60% raise',
    })
  }

  // Certification-based quick wins
  if (hasTech) {
    recs.push({
      icon: '☁️',
      title: 'AWS Solutions Architect Certification — 20–30% salary bump',
      why: `Cloud certifications are one of the few credentials that demonstrably add salary without a degree. AWS SAA (3 months prep, ₹15,000 exam fee) adds ₹${Math.round(currentSalNum * 0.25 / 100000)}L–${Math.round(currentSalNum * 0.3 / 100000)}L to offers immediately. Associates with cloud cert are treated as mid-senior. Most hireable cert in 2024.`,
      effort: 'low',
      timeline: '2–3 months to certify',
      badge: '🎯 Quick ROI',
    })
  }

  if (hasMarketing) {
    recs.push({
      icon: '📊',
      title: 'Performance marketing specialisation — highest-paid marketing niche',
      why: `Performance marketers who manage ₹5Cr+ monthly Meta/Google ad budgets earn 2–3x brand marketers. Google Ads + Meta Blueprint certifications (free) + 3 months managing real budgets transforms your profile. Demand is near-infinite — every D2C brand in India needs this.`,
      effort: 'low',
      timeline: '3–6 months to specialise',
      badge: '🔥 2–3x marketing salary',
    })
  }

  // Startup equity play
  if (hasTech && yearsExp >= 5 && isInMetro) {
    recs.push({
      icon: '🦄',
      title: 'Join a Series A/B startup as early employee — equity upside',
      why: `At 5+ years experience, joining a well-funded startup as employee #15–50 gives real equity (0.1–0.5% ESOP). If the company reaches Series C or IPO, that's ₹50L–2Cr+ liquidity event. Base salary is typically 80–90% of big tech, but total comp beats it within 3 years. AngelList, LinkedIn, and direct founder outreach are the best channels.`,
      effort: 'medium',
      timeline: '2–6 months to join',
      badge: '💎 Equity upside',
    })
  }

  // If no skills entered
  if (!skills.trim()) {
    recs.push({
      icon: '🛠️',
      title: 'Add your skills to unlock personalised recommendations',
      why: 'Go back and edit your profile to add your skill set. The recommendation engine uses skills + city + experience to suggest specific career moves that are likely to work for you.',
      effort: 'low',
      timeline: 'Immediate',
      badge: '⚡ Unlock more insights',
    })
  }

  return recs.slice(0, 5) // max 5 recommendations
}

// ─── MAIN REPORT BUILDER ──────────────────────────────────────────────────
function buildAdvisorReport(result, form, comparison) {
  const CY = new Date().getFullYear()
  const EY = CY + 4
  const q    = result.qualityScore || 0
  const empStatus = form.employmentStatus || 'employed'
  const hasPassiveBase = ['retired', 'parttime'].includes(empStatus)
  const isRetiredPerson = empStatus === 'retired'
  const sf   = result.skillFit
  const opt  = result.timelines?.optimistic || []
  const real = result.timelines?.realistic  || []
  const risk = result.timelines?.risky      || []
  const stay = comparison?.baseline         || []

  const stayY5  = stay[4]?.income    || 0
  const realY5  = real[4]?.income    || 0
  const optY5   = opt[4]?.income     || 0
  const riskY5  = risk[4]?.income    || 0
  const riskY2  = risk[1]?.income    || 0

  const realSav = real[4]?.savings   || 0
  const riskSav = risk[4]?.savings   || 0
  const staySav = stay[4]?.savings   || 0

  const peakStress = Math.max(...risk.map(y => y.stress || 5))
  const realLife   = real[4]?.lifeScore  || 5
  const realPurpose= real[4]?.purpose    || 5

  const savings      = parseFloat(String(form.savings || '0').replace(/[,₹\s]/g, '').replace(/l$/i, '')) || 0
  const savingsNum   = savings > 1000 ? savings : savings * 100000
  const currentSal   = parseFloat(String(form.currentSalary || '0').replace(/[,₹\s]/g, '').replace(/l$/i, '')) || 0
  const currentSalNum= currentSal > 1000 ? currentSal : currentSal * 100000
  const deployed     = savingsNum * ((form.savingsUsagePct || 50) / 100)
  const buffer       = savingsNum - deployed
  const monthlyReference = isRetiredPerson
    ? Math.max(currentSalNum * 0.08 / 12, 15000)
    : currentSalNum > 0 ? currentSalNum / 12 : 25000
  const runway    = buffer > 0 ? buffer / monthlyReference : 0
  const loanAmt   = parseFloat(String(form.loanAmount || '0').replace(/[,₹\s]/g, '').replace(/l$/i, '')) || 0
  const loanNum   = loanAmt > 1000 ? loanAmt : loanAmt * 100000
  const monthlyEMI= loanNum * 0.012

  const age          = parseInt(form.age) || 28
  const motivType    = result.motivationProfile?.type || 'mixed'
  const bizType      = result.businessType || null
  const skillPct     = sf?.percentMatch || 0
  const missingSkills= sf?.missingCritical || []
  const fundingType  = form.fundingType || 'savings'
  const empStatus2   = form.employmentStatus || 'employed'
  const isZeroBase   = currentSalNum === 0 || ['student','unemployed','homemaker'].includes(empStatus2)
  const effectiveStayY5 = isZeroBase ? 0 : stayY5

  const incomeGainReal = realY5 - effectiveStayY5
  const incomeGainOpt  = optY5  - effectiveStayY5

  // Market health from career intel
  const mh = result.careerIntelligence?.salaryIntel?.marketHealth
  const cityInsight = result.careerIntelligence?.cityInsight

  // ── VERDICT ────────────────────────────────────────────────────────────────
  let verdictEmoji, verdictTitle, verdictColor, verdictSummary

  if (q > 0.4 && incomeGainReal >= 0 && realLife >= 7) {
    verdictEmoji = '✅'; verdictColor = 'opt'; verdictTitle = 'Strong Move'
    verdictSummary = `Finances and life quality both point in the right direction. Solid fundamentals — execution is now your main variable.`
  } else if (q > 0.1 && incomeGainReal >= 0) {
    verdictEmoji = '📈'; verdictColor = 'gold'; verdictTitle = 'Decent Bet'
    verdictSummary = `Reasonable move — income improves and fundamentals are decent. Watch execution closely, especially in year 2.`
  } else if (q > 0.1 && incomeGainReal < 0 && realLife >= 7) {
    verdictEmoji = '💛'; verdictColor = 'gold'; verdictTitle = 'Life Win, Money Trade-off'
    verdictSummary = `You give something up financially vs staying, but life quality improves. Only worth it if money isn't your primary driver right now.`
  } else if (q < -0.2 && incomeGainReal < 0) {
    verdictEmoji = '⚠️'; verdictColor = 'risk'; verdictTitle = 'Serious Concerns'
    verdictSummary = `Both finances and life quality trail the "stay" path. This needs rethinking — or at minimum, fixing the fundamentals first.`
  } else if (q < 0 && fundingType === 'loan') {
    verdictEmoji = '🚨'; verdictColor = 'risk'; verdictTitle = 'High Risk'
    verdictSummary = `Weak fundamentals + loan funding is a dangerous combination. The risky path is very bad here — improve the plan before committing.`
  } else if (empStatus2 === 'unemployed' && q >= 0) {
    verdictEmoji = '🔍'; verdictColor = 'gold'; verdictTitle = 'Good Timing to Try'
    verdictSummary = `Nothing to lose and something to build toward. The urgency is real but so is the opportunity.`
  } else {
    verdictEmoji = '⚖️'; verdictColor = 'gold'; verdictTitle = 'Balanced Risk'
    verdictSummary = `Mixed signals — some things work, some don't. Execution quality will determine which path this becomes.`
  }

  // ── PROS ──────────────────────────────────────────────────────────────────
  const pros = []

  if (isZeroBase && realY5 > 0)
    pros.push({ icon: '💰', title: `Building to ${fmt(realY5)}/yr from ₹0`, body: `You're starting from zero. The realistic path creates entirely new income that wouldn't exist if you stayed put.` })
  else if (incomeGainReal > 0 && !isRetiredPerson)
    pros.push({ icon: '💰', title: `Income upside of ${fmt(incomeGainReal)} by ${EY}`, body: `Realistic path ends at ${fmt(realY5)}/yr vs ${fmt(effectiveStayY5)} if you stay. That's real financial progress.` })
  if (isRetiredPerson) {
    pros.push({ icon: '💰', title: `Pension + business = ${fmt(realY5)}/yr by ${EY}`, body: `Your pension continues at ${fmt(currentSalNum)}/yr. Business adds on top — total reaches ${fmt(realY5)} vs ${fmt(stayY5)} on pension alone.` })
    pros.push({ icon: '🛡️', title: 'Pension is your safety net', body: `You never rely on business income to survive. You can be patient without existential financial pressure.` })
  }
  if (incomeGainOpt > 0 && optY5 > effectiveStayY5 * 1.5)
    pros.push({ icon: '🚀', title: `Best case reaches ${fmt(optY5)} by ${EY}`, body: `If execution goes well, you hit ${fmt(optY5)} — significantly above staying.` })
  if (realLife >= 7)
    pros.push({ icon: '✨', title: `Life quality improves to ${realLife}/10`, body: `Happiness (${real[4]?.happiness}/10) and purpose (${realPurpose}/10) both score higher in the realistic path.` })
  if (real[4]?.stress <= 5)
    pros.push({ icon: '😌', title: `Stress stays manageable at ${real[4]?.stress}/10`, body: `Even in the realistic path, stress levels are reasonable — no burnout trajectory.` })
  if (motivType === 'aspiration')
    pros.push({ icon: '🔥', title: 'Passion-driven move', body: `Your decision is pulled by genuine interest. Aspiration-driven decisions have much higher follow-through rates.` })
  if (skillPct >= 65)
    pros.push({ icon: '🛠️', title: `Strong skill fit (${skillPct}%)`, body: `Your background aligns well with what this move requires. Skill fit reduces execution risk.` })
  if (runway >= 12)
    pros.push({ icon: '🛡️', title: `${runway.toFixed(0)}-month safety runway`, body: `${fmt(buffer)} buffer gives real breathing room. You won't make decisions from desperation.` })
  if (mh?.currentDemand >= 8)
    pros.push({ icon: '📈', title: `Market demand is ${mh.currentDemand}/10 — hiring actively`, body: `${mh.note || 'Strong sector demand reduces execution risk — the market is working with you, not against you.'}` })
  if (fundingType === 'parttime')
    pros.push({ icon: '⚡', title: 'Hedged — keeping income', body: `Running this alongside income dramatically reduces catastrophic risk. You can test without betting everything.` })
  if (fundingType === 'investor' && form.externalAmount)
    pros.push({ icon: '🤝', title: 'External validation', body: `Someone else has already assessed this idea and put money behind it. That's meaningful signal.` })

  while (pros.length < 2) pros.push({ icon: '📊', title: 'Structured planning done', body: `You ran a full simulation before committing. Most people who make these decisions do so without any numbers at all.` })

  // ── CONS ──────────────────────────────────────────────────────────────────
  const cons = []

  if (incomeGainReal < 0 && !hasPassiveBase && !isZeroBase)
    cons.push({ icon: '📉', title: `Realistic path earns ${fmt(Math.abs(incomeGainReal))} LESS than staying`, body: `By ${EY}, if things go normally, you'll have ${fmt(Math.abs(incomeGainReal))} less than staying. Make sure you know why you're accepting that.` })
  if (incomeGainReal < 0 && isRetiredPerson)
    cons.push({ icon: '💸', title: 'Business not yet covering its costs', body: `Pension is always safe. But the business in the realistic path is not yet self-sustaining — watch the break-even point.` })
  if (riskY2 < currentSalNum * 0.4 && riskY2 > 0 && !hasPassiveBase && !isZeroBase)
    cons.push({ icon: '📉', title: `Year 2 crash income: ${fmt(riskY2)}`, body: `In the risky scenario, year 2 is brutal. If early momentum doesn't build, this is what it looks like.` })
  if (peakStress >= 8)
    cons.push({ icon: '😤', title: `Stress peaks at ${peakStress}/10 in the risky path`, body: `High sustained stress affects health, relationships, and decision quality. Not just a number — it means sleepless nights.` })
  if (riskSav < 0 || (riskSav < staySav * 0.3 && staySav > 0))
    cons.push({ icon: '💸', title: `Risky path savings: ${fmt(riskSav)}`, body: `If the bad scenario plays out, savings by ${EY} are ${fmt(riskSav)} — ${riskSav < 0 ? 'negative' : 'far below staying'}.` })
  if (runway < 6 && !isRetiredPerson)
    cons.push({ icon: '⏳', title: `Only ${runway.toFixed(1)} months of runway`, body: `${fmt(buffer)} left after deployment is dangerously thin. Any delay and you're making decisions under financial stress.` })
  if (fundingType === 'loan' && monthlyEMI > 0) {
    const emiToIncome = currentSalNum > 0 ? (monthlyEMI * 12 / currentSalNum * 100).toFixed(0) : '—'
    cons.push({ icon: '🏦', title: `EMI of ${fmt(monthlyEMI)}/month regardless of revenue`, body: `Loan repayment continues even when income drops. ${emiToIncome !== '—' ? `That's ${emiToIncome}% of your current salary every year.` : 'This obligation persists through every down month.'}` })
  }
  if (missingSkills.length > 0)
    cons.push({ icon: '🛠️', title: `Critical skill gaps: ${missingSkills.slice(0,2).join(', ')}`, body: `These aren't nice-to-haves — they're core requirements for ${bizType || 'this type of work'}. Learn, hire, or find a co-founder.` })
  if (skillPct < 40 && skillPct > 0)
    cons.push({ icon: '📚', title: `Skill fit is only ${skillPct}%`, body: `Your background has limited overlap with what this move requires. Low skill fit is one of the most common reasons realistic scenarios underperform.` })
  if (motivType === 'escape')
    cons.push({ icon: '🚪', title: 'Mostly running away, not toward something', body: `Your language suggests you want to escape more than you're pulled toward this specific thing. Escape-driven decisions often recreate the same problems in a new context.` })
  if (mh?.saturation === 'high' || mh?.saturation === 'very_high')
    cons.push({ icon: '⚠️', title: `Market saturation: ${mh.saturation.replace('_',' ')}`, body: `High competition in this field means differentiation matters more. Being good isn't enough — you need to be visibly better.` })

  while (cons.length < 2) cons.push({ icon: '🎲', title: 'All decisions carry uncertainty', body: `Even strong decisions carry execution risk. Stay alert to early signals — pivot fast if the data turns negative.` })

  // ── CONSEQUENCES ──────────────────────────────────────────────────────────
  const consequences = []

  if (isRetiredPerson) {
    consequences.push({ when: 'Immediately', what: 'Pension continues, business adds on top', why: `Your pension of ${fmt(currentSalNum)}/yr never stops. Year 1 business income is additional. Risk here is savings loss, not income loss.` })
  } else if (empStatus2 === 'unemployed') {
    consequences.push({ when: 'Immediately', what: `Income starts at ${fmt(real[0]?.income)}/yr`, why: `Starting from zero. First year is almost always the hardest financially — plan for it explicitly.` })
  } else {
    consequences.push({ when: 'Month 1–3', what: 'Income gap vs current salary', why: `Most transitions have a lag before new income stabilises. Plan for this gap — it's where most people panic and make bad decisions.` })
  }
  if (fundingType === 'loan' && loanNum > 0)
    consequences.push({ when: 'Month 1', what: `EMI begins: ${fmt(monthlyEMI)}/month`, why: `Loan repayment starts before revenue does. This is the most dangerous early-stage pressure point — keep 3 months EMI as hard reserve.` })
  consequences.push({ when: `Year 1 (${CY})`, what: `${fmt(real[0]?.income)} realistic income`, why: `Year 1 is survival and validation. The question isn't "am I rich yet" — it's "am I still in the game with a learning curve ahead of me."` })
  consequences.push({ when: `Year 2 (${CY+1})`, what: peakStress >= 8 ? `Peak stress ${peakStress}/10` : 'Make-or-break moment', why: `Year 2 is when most ventures succeed or fail. Risky path shows ${fmt(riskY2)} — optimistic shows ${fmt(opt[1]?.income)}. Your response to adversity this year defines everything.` })
  consequences.push({ when: `Year 3 (${CY+2})`, what: 'Recovery or plateau', why: `If you made it through year 2, year 3 shows whether the model works. Realistic path: ${fmt(real[2]?.income)}. This is when you'll know if the decision was right.` })
  consequences.push({ when: `Year 5 (${EY})`, what: `${fmt(realY5)} realistic, ${fmt(optY5)} best case`, why: `Five years out — spread between optimistic (${fmt(optY5)}) and risky (${fmt(riskY5)}) is ${fmt(optY5 - riskY5)}. That's the full range of outcomes you're signing up for.` })

  // ── ACTION PLAN ───────────────────────────────────────────────────────────
  const actions = []
  if (runway < 9 && !isZeroBase)
    actions.push({ priority: 'urgent', text: `Build savings to ${fmt(currentSalNum * 0.75)} before starting — you need 9+ months runway, you currently have ${runway.toFixed(1)} months` })
  if (missingSkills.length > 0)
    actions.push({ priority: 'high', text: `Address skill gaps: ${missingSkills.join(', ')} — learn, hire, or find a co-founder who covers these before committing` })
  if (motivType === 'escape')
    actions.push({ priority: 'high', text: `Write down specifically what you want to build and why you'd do it even if it paid the same as staying. Validate the pull, not just the push.` })
  if (fundingType === 'loan' && q < 0)
    actions.push({ priority: 'urgent', text: `Reconsider loan funding given weak fundamentals. Improve the plan first, then take the loan when quality score improves.` })
  actions.push({ priority: 'high', text: `Set a hard 12-month checkpoint: if you haven't hit ${fmt(realY5 * 0.35)} annual run-rate by end of ${CY+1}, activate your exit plan without emotion` })
  actions.push({ priority: 'medium', text: `Keep ${fmt(Math.max(buffer, currentSalNum * 0.25))} completely untouched as emergency reserve — this is non-negotiable regardless of how good things look` })
  if (bizType === 'tech_startup' || bizType === 'ecommerce')
    actions.push({ priority: 'medium', text: `Validate with 5 paying customers before fully committing — revenue evidence changes everything about the risk profile` })
  if (bizType === 'food_biz' || bizType === 'micro_retail')
    actions.push({ priority: 'medium', text: `Model your break-even unit economics first: how many customers per day at what price covers all costs including your own salary` })
  if (mh?.automationRisk === 'high')
    actions.push({ priority: 'medium', text: `Automation risk is high in this field — build skills in the human+AI hybrid layer (prompt engineering, AI workflow design) to stay ahead` })

  return {
    verdictEmoji, verdictTitle, verdictColor, verdictSummary,
    pros, cons, consequences, actions,
    alternatives: buildAlternativeRecommendations(result, form),
    q, realY5, stayY5: effectiveStayY5, incomeGainReal, realLife,
    cityInsight, mh,
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────
export default function AIAdvisor({ result, form, comparison, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('verdict')
  const EY = new Date().getFullYear() + 4

  if (!isOpen) return null

  const report = buildAdvisorReport(result, form, comparison)
  const { verdictEmoji, verdictTitle, verdictColor, verdictSummary,
          pros, cons, consequences, actions, alternatives,
          q, realY5, stayY5, incomeGainReal, realLife, cityInsight, mh } = report

  const TABS = [
    { id: 'verdict',  label: '🎯 Verdict'                    },
    { id: 'pros',     label: `✅ Pros (${pros.length})`       },
    { id: 'cons',     label: `⚠️ Cons (${cons.length})`       },
    { id: 'timeline', label: '📅 Timeline'                   },
    { id: 'plan',     label: '✏️ Action Plan'                 },
    { id: 'alts',     label: `💡 For You (${alternatives.length})` },
  ]

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>AI</div>
            <div>
              <div className={styles.title}>Decision Advisor</div>
              <div className={styles.subtitle}>
                {form.name ? `For ${form.name} · ` : ''}
                Score {Math.round(q * 100)}/100 · {form.city}
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Verdict stripe */}
        <div className={styles.verdictStripe} data-color={verdictColor}>
          <div className={styles.verdictEmoji}>{verdictEmoji}</div>
          <div>
            <div className={styles.verdictTitle}>{verdictTitle}</div>
            <div className={styles.verdictSub}>{verdictSummary}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button key={t.id}
              className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.content}>

          {/* ── Verdict ── */}
          {activeTab === 'verdict' && (
            <div className={styles.verdictContent}>
              <div className={styles.scoreRow}>
                {[
                  { num: Math.round(q * 100), label: 'Quality Score', color: verdictColor === 'opt' ? 'var(--opt)' : verdictColor === 'risk' ? 'var(--risk)' : 'var(--gold)' },
                  { num: `${incomeGainReal >= 0 ? '+' : ''}${(incomeGainReal/100000).toFixed(1)}L`, label: `vs Staying ${EY}`, color: incomeGainReal >= 0 ? 'var(--opt)' : 'var(--risk)' },
                  { num: `${realLife}/10`, label: 'Life Score', color: realLife >= 7 ? 'var(--opt)' : realLife >= 5 ? 'var(--gold)' : 'var(--risk)' },
                  { num: result.skillFit?.percentMatch ? `${result.skillFit.percentMatch}%` : '—', label: 'Skill Fit', color: (result.skillFit?.percentMatch || 0) >= 60 ? 'var(--opt)' : 'var(--gold)' },
                ].map((s,i) => (
                  <div key={i} className={styles.scoreBox}>
                    <div className={styles.scoreNum} style={{ color: s.color }}>{s.num}</div>
                    <div className={styles.scoreLabel}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* City insight from DB */}
              {cityInsight && (
                <div className={styles.cityInsightBox}>
                  <span className={styles.cityInsightTag}>📍 {form.city}</span>
                  <p>{cityInsight}</p>
                </div>
              )}

              {/* Market health */}
              {mh && (
                <div className={styles.marketRow}>
                  <div className={styles.mhItem}>
                    <span className={styles.mhLabel}>Market Demand</span>
                    <span className={styles.mhVal} style={{ color: mh.currentDemand >= 8 ? 'var(--opt)' : mh.currentDemand >= 6 ? 'var(--gold)' : 'var(--risk)' }}>
                      {mh.currentDemand}/10
                    </span>
                  </div>
                  <div className={styles.mhItem}>
                    <span className={styles.mhLabel}>Trend</span>
                    <span className={styles.mhVal} style={{ color: mh.trend === 'growing' || mh.trend === 'strong_growth' ? 'var(--opt)' : mh.trend === 'declining' ? 'var(--risk)' : 'var(--real)' }}>
                      {mh.trend?.replace('_',' ')}
                    </span>
                  </div>
                  <div className={styles.mhItem}>
                    <span className={styles.mhLabel}>Saturation</span>
                    <span className={styles.mhVal} style={{ color: mh.saturation === 'low' || mh.saturation === 'very_low' ? 'var(--opt)' : mh.saturation === 'high' ? 'var(--risk)' : 'var(--gold)' }}>
                      {mh.saturation?.replace('_',' ')}
                    </span>
                  </div>
                  <div className={styles.mhItem}>
                    <span className={styles.mhLabel}>Automation Risk</span>
                    <span className={styles.mhVal} style={{ color: mh.automationRisk === 'low' ? 'var(--opt)' : mh.automationRisk === 'high' ? 'var(--risk)' : 'var(--gold)' }}>
                      {mh.automationRisk || 'medium'}
                    </span>
                  </div>
                </div>
              )}

              <p className={styles.verdictBody}>{verdictSummary}</p>

              <div className={styles.verdictDetails}>
                {[
                  { label: `📈 Realistic ${EY}`, val: `${(realY5/100000).toFixed(1)}L/yr`, note: incomeGainReal >= 0 ? `▲ ${(incomeGainReal/100000).toFixed(1)}L more than staying` : `▼ ${(Math.abs(incomeGainReal)/100000).toFixed(1)}L less than staying` },
                  { label: '🎯 Motivation', val: result.motivationProfile?.type === 'aspiration' ? 'Aspiration' : result.motivationProfile?.type === 'escape' ? 'Escape' : 'Mixed', note: result.motivationProfile?.type === 'aspiration' ? 'Pulled toward — strong signal' : result.motivationProfile?.type === 'escape' ? 'Pushing away — validate the pull' : 'Both push and pull factors' },
                  { label: '⚡ Top concern', val: cons[0]?.title?.slice(0,28) + '…' || 'Execution risk', note: 'See Cons tab' },
                  { label: '🏆 Top advantage', val: pros[0]?.title?.slice(0,28) + '…' || 'Clear upside', note: 'See Pros tab' },
                ].map((d,i) => (
                  <div key={i} className={styles.vdSection}>
                    <div className={styles.vdLabel}>{d.label}</div>
                    <div className={styles.vdValue}>{d.val}</div>
                    <div className={styles.vdNote}>{d.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Pros ── */}
          {activeTab === 'pros' && (
            <div className={styles.cardList}>
              {pros.map((p, i) => (
                <div key={i} className={styles.proCard}>
                  <div className={styles.cardIcon}>{p.icon}</div>
                  <div><div className={styles.cardTitle}>{p.title}</div><div className={styles.cardBody}>{p.body}</div></div>
                </div>
              ))}
            </div>
          )}

          {/* ── Cons ── */}
          {activeTab === 'cons' && (
            <div className={styles.cardList}>
              {cons.map((c, i) => (
                <div key={i} className={styles.conCard}>
                  <div className={styles.cardIcon}>{c.icon}</div>
                  <div><div className={styles.cardTitle}>{c.title}</div><div className={styles.cardBody}>{c.body}</div></div>
                </div>
              ))}
            </div>
          )}

          {/* ── Timeline ── */}
          {activeTab === 'timeline' && (
            <div className={styles.timeline}>
              {consequences.map((c, i) => (
                <div key={i} className={styles.timelineItem}>
                  <div className={styles.timelineLeft}>
                    <div className={styles.timelineDot} />
                    {i < consequences.length - 1 && <div className={styles.timelineLine} />}
                  </div>
                  <div className={styles.timelineRight}>
                    <div className={styles.timelineWhen}>{c.when}</div>
                    <div className={styles.timelineWhat}>{c.what}</div>
                    <div className={styles.timelineWhy}>{c.why}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Action Plan ── */}
          {activeTab === 'plan' && (
            <div className={styles.actionList}>
              {actions.map((a, i) => (
                <div key={i} className={`${styles.actionItem} ${styles['action_' + a.priority]}`}>
                  <div className={styles.actionPriority}>
                    {a.priority === 'urgent' ? '🚨 Urgent' : a.priority === 'high' ? '🔴 High' : '🟡 Medium'}
                  </div>
                  <div className={styles.actionText}>{a.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Alternatives / For You ── */}
          {activeTab === 'alts' && (
            <div>
              <div className={styles.altsHeader}>
                Based on your skills, city, and experience — other paths worth considering:
              </div>
              {alternatives.length === 0 ? (
                <div className={styles.altsEmpty}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🛠️</div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Add your skills to unlock recommendations</div>
                  <p style={{ fontFamily: 'var(--fm)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
                    Edit your profile and add your skill set. The engine uses skills + city + experience to suggest specific career moves likely to work for you.
                  </p>
                </div>
              ) : (
                alternatives.map((alt, i) => (
                  <div key={i} className={styles.altCard}>
                    <div className={styles.altHeader}>
                      <span className={styles.altIcon}>{alt.icon}</span>
                      <div className={styles.altTitle}>{alt.title}</div>
                      <span className={styles.altBadge}>{alt.badge}</span>
                    </div>
                    <p className={styles.altWhy}>{alt.why}</p>
                    <div className={styles.altMeta}>
                      <span>⏱ {alt.timeline}</span>
                      <span className={`${styles.altEffort} ${styles['effort_' + alt.effort]}`}>
                        {alt.effort === 'low' ? '🟢 Low effort' : alt.effort === 'medium' ? '🟡 Medium effort' : '🔴 High effort'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
