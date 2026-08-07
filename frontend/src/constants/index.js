// Startup form options — drives all dropdowns in StartupForm

export const INDUSTRIES = [
  { value: 'technology', label: 'Technology & Software' },
  { value: 'ecommerce', label: 'E-Commerce & Retail' },
  { value: 'healthcare', label: 'Healthcare & Wellness' },
  { value: 'education', label: 'Education & EdTech' },
  { value: 'finance', label: 'Finance & FinTech' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'real_estate', label: 'Real Estate & PropTech' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'travel', label: 'Travel & Tourism' },
  { value: 'sustainability', label: 'Sustainability & GreenTech' },
  { value: 'logistics', label: 'Logistics & Supply Chain' },
  { value: 'agriculture', label: 'Agriculture & AgriTech' },
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'sports', label: 'Sports & Fitness' },
  { value: 'other', label: 'Other' },
]

export const BUSINESS_TYPES = [
  { value: 'saas', label: 'SaaS (Software as a Service)' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'ecommerce', label: 'E-Commerce Store' },
  { value: 'service', label: 'Service Business' },
  { value: 'product', label: 'Physical Product' },
  { value: 'consulting', label: 'Consulting / Agency' },
  { value: 'subscription', label: 'Subscription Box' },
  { value: 'nonprofit', label: 'Non-Profit / Social Enterprise' },
  { value: 'franchise', label: 'Franchise' },
  { value: 'other', label: 'Other' },
]

export const BUDGET_RANGES = [
  { value: 'under_5k', label: 'Under $5,000' },
  { value: '5k_25k', label: '$5,000 – $25,000' },
  { value: '25k_100k', label: '$25,000 – $100,000' },
  { value: '100k_500k', label: '$100,000 – $500,000' },
  { value: '500k_1m', label: '$500,000 – $1,000,000' },
  { value: 'over_1m', label: 'Over $1,000,000' },
]

export const TARGET_AUDIENCES = [
  { value: 'b2c_general', label: 'General Consumers (B2C)' },
  { value: 'b2b_smb', label: 'Small & Medium Businesses (B2B)' },
  { value: 'b2b_enterprise', label: 'Enterprise Companies (B2B)' },
  { value: 'students', label: 'Students & Young Adults' },
  { value: 'seniors', label: 'Seniors & Retirees' },
  { value: 'parents', label: 'Parents & Families' },
  { value: 'professionals', label: 'Working Professionals' },
  { value: 'creatives', label: 'Creatives & Freelancers' },
  { value: 'healthcare', label: 'Healthcare Professionals' },
  { value: 'government', label: 'Government & Public Sector' },
  { value: 'other', label: 'Other' },
]

// API endpoint paths (relative to base URL)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',

  // Startup generation
  GENERATE: '/generate',

  // History
  HISTORY: '/history',
  HISTORY_ITEM: (id) => `/history/${id}`,
}

// Local storage keys — prevents typos across the codebase
export const STORAGE_KEYS = {
  TOKEN: 'sf_token',
  USER: 'sf_user',
  LAST_RESULT: 'sf_last_result',
}

// Sidebar navigation items
export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Generate Kit', path: '/new', icon: 'Sparkles' },
  { label: 'Business Plan', path: '/business-plan', icon: 'FileText' },
  { label: 'Branding', path: '/branding', icon: 'Palette' },
  { label: 'Website', path: '/website', icon: 'Globe' },
  { label: 'Marketing', path: '/marketing', icon: 'Megaphone' },
  { label: 'Finance', path: '/finance', icon: 'TrendingUp' },
  { label: 'Compliance', path: '/compliance', icon: 'Shield' },
  { label: 'Pitch Deck', path: '/pitch-deck', icon: 'Presentation' },
  { label: 'History', path: '/history', icon: 'History' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
]

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

// Form step labels
export const FORM_STEPS = [
  { step: 1, label: 'Your Idea' },
  { step: 2, label: 'Business Details' },
  { step: 3, label: 'Target & Location' },
]

// Pitch deck slide order
export const PITCH_DECK_SLIDES = [
  'problem',
  'solution',
  'market',
  'businessModel',
  'traction',
  'team',
  'ask',
]

export const PITCH_SLIDE_LABELS = {
  problem: 'The Problem',
  solution: 'Our Solution',
  market: 'Market Opportunity',
  businessModel: 'Business Model',
  traction: 'Traction & Milestones',
  team: 'The Team',
  ask: 'The Ask',
}
