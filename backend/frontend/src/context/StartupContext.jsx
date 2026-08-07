/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { STORAGE_KEYS } from '../constants'
import startupService from '../services/startupService'

const StartupContext = createContext(null)

const DEFAULT_DEMO_KIT = {
  _idea: 'Food Delivery & Cloud Kitchen Startup',
  _industry: 'Food & Beverage',
  _budget: '₹5,00,000',
  _businessType: 'B2C Delivery App',
  businessPlan: {
    executiveSummary: 'Food Delivery & Cloud Kitchen Startup is an innovative food tech platform connecting home chefs and dark kitchens with urban consumers seeking fresh, fast, affordable meals.',
    problem: 'Current food delivery options in suburban areas are expensive, slow, and lack authentic home-style meal choices.',
    solution: 'A tech-driven cloud kitchen network delivering high-quality meals in under 30 minutes at 40% lower operational costs.',
    marketAnalysis: 'The Indian food delivery market is projected to reach $15B by 2026, growing at 28% CAGR.',
    revenueModel: 'Direct sales per order, delivery fee margins, and cloud kitchen partner commissions.',
  },
  branding: {
    name: 'FoodForge Kitchens',
    tagline: 'Fresh, Fast & Affordable Meals Delivered',
    mission: 'To make healthy, chef-prepared meals accessible to every household.',
    values: ['Quality First', 'Speed & Reliability', 'Hygiene Standards', 'Affordability'],
    colors: { primary: '#3b82f6', secondary: '#1e293b', accent: '#f59e0b' },
  },
  website: {
    heroHeadline: 'Delicious Cloud Kitchen Meals Delivered in 25 Minutes',
    heroSubtitle: 'Order fresh, chef-prepared meals starting at just ₹150 with instant tracking.',
    features: [
      { title: 'Ultra Fast Delivery', description: 'Optimized rider routes ensuring hot delivery in 25 mins.' },
      { title: 'FSSAI Certified Kitchens', description: 'Highest hygiene standards and fresh ingredients daily.' },
      { title: 'Affordable Subscriptions', description: 'Daily meal plans tailored for students and working professionals.' },
    ],
  },
  marketing: {
    channels: [
      { name: 'Instagram & Reels', strategy: 'Hyper-local food influencer reviews and behind-the-scenes kitchen videos.' },
      { name: 'Google Local & Maps SEO', strategy: 'Targeting "food delivery near me" and local office lunch keywords.' },
      { name: 'First-Order Referral Rewards', strategy: 'Give ₹50, Get ₹50 referral incentive for early adopters.' },
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
  },
  compliance: {
    checklist: [
      {
        id: 'fssai',
        title: 'FSSAI License / Registration',
        reason: 'Food safety and standards compliance mandatory for all food manufacturing and delivery businesses.',
        requiredDocs: ['PAN Card of Founder/Entity', 'Aadhaar Card', 'Premises Address Proof', 'Food Safety Plan'],
        estimatedFee: '₹100 - ₹7,500',
        processingTime: '7 - 30 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'gst',
        title: 'GST Registration',
        reason: 'Mandatory for food aggregators, e-commerce sales, and selling across state lines.',
        requiredDocs: ['PAN Card of Business', 'Incorporation Certificate', 'Bank Cancelled Cheque', 'Premises Proof'],
        estimatedFee: '₹0 (Govt Fee)',
        processingTime: '3 - 7 Business Days',
        priority: 'High',
        status: 'Pending',
      },
      {
        id: 'msme',
        title: 'MSME / Udyam Registration',
        reason: 'Provides government scheme eligibility, priority sector bank lending, and collateral-free loans.',
        requiredDocs: ['Aadhaar Card', 'PAN Card'],
        estimatedFee: '₹0 (Free Portal)',
        processingTime: '1 - 2 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'startup_india',
        title: 'Startup India DPIIT Recognition',
        reason: 'Offers 3-year income tax exemption (80IAC) and fast-tracked patent examination.',
        requiredDocs: ['Incorporation Certificate', 'Write-up on Innovation', 'Pitch Deck Link'],
        estimatedFee: '₹0 (Free Portal)',
        processingTime: '10 - 15 Business Days',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        id: 'shop_act',
        title: 'Shop & Establishment Act',
        reason: 'Local municipal registration required to legally open commercial premises and hire staff.',
        requiredDocs: ['Rent Agreement & NOC', 'PAN & Aadhaar', 'Employee List'],
        estimatedFee: '₹500 - ₹2,500',
        processingTime: '5 - 10 Business Days',
        priority: 'High',
        status: 'Pending',
      },
    ],
    registrationSteps: [
      'Incorporate Business Entity (Pvt Ltd / LLP / OPC)',
      'Apply for Company PAN & Corporate Net Banking',
      'Obtain GST & FSSAI Licenses',
      'Apply for Startup India Recognition & Trademarks',
    ],
    licenses: ['Eating House License', 'Fire Safety NOC', 'Health & Trade License'],
    legalDocs: ['Food Partner Agreement', 'Hygiene SOPs', 'Customer Terms of Service', 'Privacy Policy'],
    legalRecommendations: 'Prioritize obtaining FSSAI license and GST registration before launching commercial food delivery operations.',
  },
  pitchDeck: {
    problem: 'Current food delivery solutions are expensive with high restaurant commission markups.',
    solution: 'Tech-enabled cloud kitchen network delivering high quality meals at 40% lower prices.',
    market: 'Total Addressable Market: $15B | Target: $100M in 3 years.',
    businessModel: 'Direct food sales, subscription delivery passes, and cloud kitchen franchising.',
    ask: 'Seeking ₹5,00,000 seed investment to scale kitchen locations and marketing.',
  },
}

function tryParseResult() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_RESULT)
    return raw ? JSON.parse(raw) : DEFAULT_DEMO_KIT
  } catch {
    return DEFAULT_DEMO_KIT
  }
}

const initialState = {
  formData: {
    idea: '',
    industry: '',
    budget: '',
    businessType: '',
    targetAudience: '',
    location: '',
  },
  result: tryParseResult(),
  isGenerating: false,
  error: null,
}

function startupReducer(state, action) {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } }

    case 'GENERATE_START':
      return { ...state, isGenerating: true, error: null }

    case 'GENERATE_SUCCESS':
      return {
        ...state,
        result: action.payload,
        isGenerating: false,
        error: null,
      }

    case 'GENERATE_FAILURE':
      return { ...state, isGenerating: false, error: action.payload }

    case 'SET_RESULT':
      return { ...state, result: action.payload }

    case 'RESET_RESULT':
      return { ...state, result: null, error: null }

    case 'RESET_FORM':
      return { ...state, formData: initialState.formData }

    default:
      return state
  }
}

export function StartupProvider({ children }) {
  const [state, dispatch] = useReducer(startupReducer, initialState)

  const setFormData = useCallback((data) => {
    dispatch({ type: 'SET_FORM_DATA', payload: data })
  }, [])

  const generateKit = useCallback(async () => {
    dispatch({ type: 'GENERATE_START' })
    try {
      const result = await startupService.generate(state.formData)
      localStorage.setItem(STORAGE_KEYS.LAST_RESULT, JSON.stringify(result))
      dispatch({ type: 'GENERATE_SUCCESS', payload: result })
      return { success: true, data: result }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate startup kit. Please try again.'
      dispatch({ type: 'GENERATE_FAILURE', payload: message })
      return { success: false, error: message }
    }
  }, [state.formData])

  const setResult = useCallback((result) => {
    localStorage.setItem(STORAGE_KEYS.LAST_RESULT, JSON.stringify(result))
    dispatch({ type: 'SET_RESULT', payload: result })
  }, [])

  const resetResult = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.LAST_RESULT)
    dispatch({ type: 'RESET_RESULT' })
  }, [])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
  }, [])

  const value = {
    formData: state.formData,
    result: state.result,
    isGenerating: state.isGenerating,
    error: state.error,
    hasResult: !!state.result,
    setFormData,
    generateKit,
    setResult,
    resetResult,
    resetForm,
  }

  return (
    <StartupContext.Provider value={value}>{children}</StartupContext.Provider>
  )
}

export function useStartup() {
  const context = useContext(StartupContext)
  if (!context) {
    throw new Error('useStartup must be used within StartupProvider')
  }
  return context
}

export default StartupContext
