/**
 * AI Service — Startup Kit Generation Bridge
 *
 * This is the single point of contact between the backend (Member 2)
 * and the AI engine (Member 3).
 *
 * Current implementation:
 *   → Uses Google Gemini API if GEMINI_API_KEY is set in .env
 *   → Falls back to a structured mock response for development/testing
 *     when the API key is not yet configured
 *
 * Member 3 Integration Note:
 *   Replace the contents of `callGemini()` with Member 3's final
 *   Gemini prompt logic. The function must return the structured
 *   startup kit object shown in `buildFallbackKit()`.
 *
 * Expected return shape (consumed directly by the frontend):
 * {
 *   businessPlan:  { executiveSummary, problem, solution, marketAnalysis, revenueModel, growthStrategy, milestones, conclusion },
 *   branding:      { name, tagline, mission, values[], colors: { primary, secondary, accent }, typography },
 *   website:       { heroHeadline, heroSubtitle, features[], cta, aboutSection },
 *   marketing:     { channels[], launchChecklist[], keywords[], adCampaigns[] },
 *   finance:       { projections[], unitEconomics, breakEven, roi },
 *   compliance:    { checklist[], legalDocs[], registrations[] },
 *   pitchDeck:     { problem, solution, market, businessModel, traction, team, ask }
 * }
 */

const { GoogleGenerativeAI } = (() => {
  try { return require('@google/generative-ai') } catch { return {} }
})()

/**
 * Build the Gemini prompt from form data.
 * Member 3 should replace this with their optimised prompt.
 */
function buildPrompt(formData) {
  const { idea, industry, budget, businessType, targetAudience, location } = formData
  return `
You are an expert startup consultant. Generate a comprehensive startup launch kit in valid JSON format only.
No markdown, no explanation — only pure JSON.

Startup Details:
- Idea: ${idea}
- Industry: ${industry}
- Budget: ${budget}
- Business Type: ${businessType || 'Not specified'}
- Target Audience: ${targetAudience || 'General consumers'}
- Location: ${location || 'Global'}

Return a JSON object with EXACTLY these top-level keys:
businessPlan, branding, website, marketing, finance, compliance, pitchDeck

businessPlan must include: executiveSummary, problem, solution, marketAnalysis, revenueModel, growthStrategy, milestones (array of {title, timeline, status}), conclusion
branding must include: name, tagline, mission, values (array), colors ({primary, secondary, accent} as hex), typography
website must include: heroHeadline, heroSubtitle, features (array of {title, description}), cta, aboutSection
marketing must include: channels (array of {name, strategy}), launchChecklist (array), keywords (array), adCampaigns (array of {name, platform, budget})
finance must include: projections (array of {month, revenue, expenses, profit}), unitEconomics ({cac, ltv, margin}), breakEven, roi
compliance must include: checklist (array of {item, status, priority}), legalDocs (array), registrations (array)
pitchDeck must include: problem, solution, market, businessModel, traction, team, ask
`.trim()
}

/**
 * Call the Gemini API.
 * Returns parsed JSON startup kit object.
 */
async function callGemini(formData) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent(buildPrompt(formData))
  const text = result.response.text()

  // Strip markdown code fences if Gemini wraps the JSON
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

/**
 * Structured fallback kit used when:
 *   - GEMINI_API_KEY is not set
 *   - Gemini call fails
 *   - Running in a dev/test environment without AI
 *
 * This allows the frontend to be tested end-to-end without needing
 * a live AI response. Member 3 will replace the real logic above.
 */
function buildFallbackKit(formData) {
  const name = formData.idea
    ? formData.idea.split(' ').slice(0, 2).join('') + 'AI'
    : 'StartupForge'

  return {
    businessPlan: {
      executiveSummary: `${name} is an innovative ${formData.industry || 'technology'} startup targeting ${formData.targetAudience || 'general consumers'} with a budget of ${formData.budget || 'TBD'}.`,
      problem: `Current solutions in the ${formData.industry || 'market'} are inefficient, expensive, or inaccessible to the target audience.`,
      solution: `${name} provides a seamless, affordable, and scalable solution that directly addresses these pain points.`,
      marketAnalysis: `The global ${formData.industry || 'technology'} market is valued at $500B and growing at 15% YoY. ${formData.location || 'Global'} presents a significant opportunity.`,
      revenueModel: `${formData.businessType === 'saas' ? 'Monthly & annual SaaS subscriptions with tiered pricing.' : 'Direct sales, partnerships, and premium service tiers.'}`,
      growthStrategy: 'Phase 1: MVP launch & early adopters. Phase 2: Marketing scale-up & partnerships. Phase 3: Geographic expansion.',
      milestones: [
        { title: 'MVP Launch', timeline: 'Month 1-2', status: 'Planned' },
        { title: 'First 100 Users', timeline: 'Month 3', status: 'Planned' },
        { title: 'Revenue Positive', timeline: 'Month 6', status: 'Planned' },
        { title: 'Series A Funding', timeline: 'Month 12', status: 'Planned' },
      ],
      conclusion: `${name} is positioned to capture a significant share of the market through rapid execution and a customer-first approach.`,
    },
    branding: {
      name,
      tagline: `Innovating ${formData.industry || 'the future'}, one step at a time.`,
      mission: `To empower ${formData.targetAudience || 'users'} with cutting-edge ${formData.industry || 'technology'} solutions.`,
      values: ['Innovation', 'Transparency', 'Customer First', 'Scalability'],
      colors: { primary: '#6366F1', secondary: '#8B5CF6', accent: '#F59E0B' },
      typography: 'Inter for UI, Merriweather for headings',
    },
    website: {
      heroHeadline: `The Future of ${formData.industry || 'Business'} Starts Here`,
      heroSubtitle: `${name} helps you ${formData.idea || 'achieve your goals'} faster than ever before.`,
      features: [
        { title: 'AI-Powered', description: 'Leverage intelligent automation to stay ahead of the competition.' },
        { title: 'Lightning Fast', description: 'Built for speed and reliability at any scale.' },
        { title: 'Secure by Default', description: 'Enterprise-grade security baked in from day one.' },
      ],
      cta: 'Get Started Free',
      aboutSection: `Founded with a mission to transform ${formData.industry || 'the industry'}, ${name} brings together expert engineering and bold vision.`,
    },
    marketing: {
      channels: [
        { name: 'Social Media', strategy: 'Weekly content on LinkedIn, Instagram & X targeting early adopters.' },
        { name: 'Content Marketing', strategy: 'SEO-driven blog and video tutorials to build organic traffic.' },
        { name: 'Paid Ads', strategy: 'Google Ads & Meta Ads targeting high-intent keywords.' },
      ],
      launchChecklist: [
        'Set up social media profiles',
        'Launch landing page with email capture',
        'Reach out to 50 beta users',
        'Submit to Product Hunt',
        'Launch email drip campaign',
      ],
      keywords: [`${formData.industry} startup`, `best ${formData.industry} app`, `${formData.targetAudience} tools`],
      adCampaigns: [
        { name: 'Launch Campaign', platform: 'Google Ads', budget: '$500/month' },
        { name: 'Awareness Campaign', platform: 'Meta Ads', budget: '$300/month' },
      ],
    },
    finance: {
      investment: 500000,
      pricePerUnit: 250,
      monthlyCustomers: 800,
      monthlyExpenses: 120000,
      employeeCount: 2,
      costPerEmployee: 25000,
      monthlyGrowthRate: 8,
      fundingNeeded: 500000,
      revenue: 200000,
      expenses: 120000,
      profit: 80000,
      breakEven: '7 Months',
      breakEvenMonths: '7 Months',
      roiEstimated: '192% Annual ROI',
      roiPercentage: 192,
      projections: [
        { month: 'Month 1', customers: 800, revenue: 200000, expenses: 120000, profit: 80000 },
        { month: 'Month 2', customers: 864, revenue: 216000, expenses: 125000, profit: 91000 },
        { month: 'Month 3', customers: 933, revenue: 233250, expenses: 130000, profit: 103250 },
        { month: 'Month 4', customers: 1007, revenue: 251750, expenses: 135000, profit: 116750 },
        { month: 'Month 5', customers: 1088, revenue: 272000, expenses: 140000, profit: 132000 },
        { month: 'Month 6', customers: 1175, revenue: 293750, expenses: 145000, profit: 148750 },
      ],
      revenueProjections: [
        { month: 'Month 1', revenue: 200000, expenses: 120000, profit: 80000 },
        { month: 'Month 2', revenue: 216000, expenses: 125000, profit: 91000 },
        { month: 'Month 3', revenue: 233250, expenses: 130000, profit: 103250 },
        { month: 'Month 4', revenue: 251750, expenses: 135000, profit: 116750 },
        { month: 'Month 5', revenue: 272000, expenses: 140000, profit: 132000 },
        { month: 'Month 6', revenue: 293750, expenses: 145000, profit: 148750 },
      ],
      costDistribution: [
        { name: 'Employee Salaries', value: 50000 },
        { name: 'Marketing & CAC', value: 35000 },
        { name: 'Operations & Logistics', value: 20000 },
        { name: 'Tech Infrastructure', value: 10000 },
        { name: 'Legal & Admin', value: 5000 },
      ],
      investmentAllocation: [
        { name: 'Product Development', value: 175000 },
        { name: 'Launch Marketing', value: 125000 },
        { name: 'Working Capital Reserve', value: 100000 },
        { name: 'Licenses & Legal', value: 50000 },
        { name: 'Equipment & Hardware', value: 50000 },
      ],
      yearlyProjection: { year1: 2400000, year2: 3840000, year3: 6720000 },
      unitEconomics: { cac: '₹350', ltv: '₹2,800', margin: '40%' },
    },
    compliance: {
      checklist: [
        {
          id: 'gst',
          title: 'GST Registration',
          reason: 'Mandatory for statutory tax compliance and selling products or services across state lines.',
          requiredDocs: ['PAN Card of Founder/Entity', 'Incorporation Certificate', 'Bank Account Cancelled Cheque', 'Premises Address Proof'],
          estimatedFee: '₹0 (Govt Fee)',
          processingTime: '3 - 7 Business Days',
          priority: 'High',
          status: 'Pending',
        },
        {
          id: 'fssai',
          title: 'FSSAI License / Registration',
          reason: 'Food safety and standards certification mandatory for any food production, distribution, or delivery venture.',
          requiredDocs: ['Founder Aadhaar & PAN', 'Address Proof of Kitchen/Store', 'Food Safety Plan'],
          estimatedFee: '₹100 - ₹7,500',
          processingTime: '7 - 30 Business Days',
          priority: 'High',
          status: 'Pending',
        },
        {
          id: 'msme',
          title: 'MSME / Udyam Registration',
          reason: 'Eligible for government benefits, interest subsidies on bank credit, and collateral-free loans.',
          requiredDocs: ['Aadhaar Card', 'PAN Card'],
          estimatedFee: '₹0 (Free on Govt Portal)',
          processingTime: '1 - 2 Business Days',
          priority: 'Medium',
          status: 'Pending',
        },
        {
          id: 'startup_india',
          title: 'Startup India DPIIT Recognition',
          reason: 'Access to 80IAC tax exemption for 3 consecutive years and fast-tracked patent applications.',
          requiredDocs: ['Incorporation Certificate', 'Writeup on Innovation', 'Pitch Deck Link'],
          estimatedFee: '₹0 (Free Portal)',
          processingTime: '10 - 15 Business Days',
          priority: 'Medium',
          status: 'Pending',
        },
        {
          id: 'shop_act',
          title: 'Shop & Establishment Act',
          reason: 'Local municipal registration required to operate commercial premises and employ staff.',
          requiredDocs: ['Rent Agreement & Landlord NOC', 'PAN Card', 'Employee Count List'],
          estimatedFee: '₹500 - ₹2,500',
          processingTime: '5 - 10 Business Days',
          priority: 'High',
          status: 'Pending',
        },
      ],
      governmentRegistrations: [
        { title: 'GST Registration', status: 'Pending', priority: 'High', fee: '₹0', time: '3-7 Days' },
        { title: 'FSSAI License', status: 'Pending', priority: 'High', fee: '₹100 - ₹7,500', time: '7-30 Days' },
        { title: 'MSME Registration', status: 'Pending', priority: 'Medium', fee: '₹0', time: '1-2 Days' },
        { title: 'Startup India DPIIT', status: 'Pending', priority: 'Medium', fee: '₹0', time: '10-15 Days' },
      ],
      licenses: [
        'Shop & Establishment Registration',
        'Local Municipal Health & Trade License',
        'Fire Safety NOC (if premises > 50 sq m)',
      ],
      legalDocs: [
        'Terms of Service & User Agreement',
        'Privacy Policy & Data Security Plan',
        'Founder / Co-founder Agreement',
        'Non-Disclosure Agreement (NDA)',
      ],
      registrationSteps: [
        'Incorporate Business Entity (Pvt Ltd / LLP / OPC)',
        'Apply for Company PAN & Corporate Net Banking',
        'Obtain GST & Industry-Specific Registrations (FSSAI/MSME)',
        'Register for Startup India Recognition & Trademarks',
      ],
      legalRecommendations: 'Ensure FSSAI certification and GST registration are completed prior to commercial product launch.',
    },
    pitchDeck: {
      problem: `${formData.targetAudience || 'Users'} in the ${formData.industry || 'market'} face significant challenges with existing solutions that are too slow, costly, or complex.`,
      solution: `${name} solves this with a ${formData.businessType || 'product'} that is fast, affordable, and easy to use.`,
      market: `Total Addressable Market: $50B | Serviceable Market: $5B | Target: $500M in 3 years.`,
      businessModel: `${formData.businessType === 'saas' ? 'SaaS subscription: $29/month (Starter), $99/month (Pro), $299/month (Enterprise).' : 'Revenue through direct sales, commissions, and premium features.'}`,
      traction: 'Pre-launch: 200 waitlist signups, 5 LOI from enterprise clients, 3 strategic partnerships.',
      team: 'Experienced team of founders with backgrounds in tech, business, and design.',
      ask: `Raising $500K seed round to fund 12 months of product development, team growth, and initial marketing.`,
    },
  }
}

/**
 * Main exported function — called by startupController.
 *
 * @param {object} formData - { idea, industry, budget, businessType, targetAudience, location }
 * @returns {object} - Full structured startup kit
 */
const generateStartupKit = async (formData) => {
  // Use Gemini only when API key is available
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' && GoogleGenerativeAI) {
    try {
      console.log('[AI Service] Calling Gemini API...')
      const kit = await callGemini(formData)
      console.log('[AI Service] Gemini response received ✅')
      return kit
    } catch (error) {
      console.warn('[AI Service] Gemini call failed, using fallback:', error.message)
    }
  } else {
    console.log('[AI Service] GEMINI_API_KEY not set — using structured fallback kit (dev mode)')
  }

  // Fallback: return structured mock data
  return buildFallbackKit(formData)
}

module.exports = { generateStartupKit }
