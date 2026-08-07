import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  TrendingUp, DollarSign, PieChart as PieChartIcon, ArrowLeft, Download, RefreshCw,
  Calculator, AlertTriangle, CheckCircle, HelpCircle, Send, Sparkles, MessageSquare,
  BarChart3, Percent, ShieldAlert, ArrowUpRight, ShieldCheck, Wallet
} from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { RevenueExpenseChart, CostDistributionChart, ProfitBarChart } from '../../components/Charts'
import { formatCurrency } from '../../utils/formatters'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'
import { INITIAL_FINANCE_DATA } from '../../data/mockModuleData'

export default function Finance() {
  const { result, generateKit, isGenerating, error } = useStartup()
  const navigate = useNavigate()

  // Active section tab: 'overview', 'estimator', 'forecast', 'pnl', 'breakeven', 'roi', 'advisor'
  const [activeTab, setActiveTab] = useState('overview')

  // 1. Startup Cost Estimator State
  const [oneTimeCosts, setOneTimeCosts] = useState(INITIAL_FINANCE_DATA.oneTimeCosts)
  const [monthlyCosts, setMonthlyCosts] = useState(INITIAL_FINANCE_DATA.monthlyCosts)

  // 2. Revenue Forecast State
  const [forecastInputs, setForecastInputs] = useState(INITIAL_FINANCE_DATA.forecastInputs)

  // 6. AI Advisor Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Financial Advisor. Ask me anything about your startup's costs, pricing strategy, profit margins, or runway.",
      timestamp: '10:00 AM',
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Sync state with AI generated finance kit if available
  useEffect(() => {
    if (result?.finance) {
      const fin = result.finance
      if (fin.pricePerUnit || fin.monthlyCustomers) {
        setForecastInputs((prev) => ({
          ...prev,
          productPrice: fin.pricePerUnit || prev.productPrice,
          initialCustomers: fin.monthlyCustomers || prev.initialCustomers,
          monthlyGrowthRate: fin.monthlyGrowthRate || prev.monthlyGrowthRate,
        }))
      }
      if (fin.expenses || fin.monthlyExpenses) {
        const exp = Number(fin.expenses || fin.monthlyExpenses) || 120000
        setMonthlyCosts({
          salaries: Math.round(exp * 0.5),
          marketing: Math.round(exp * 0.25),
          servers: Math.round(exp * 0.15),
          officeRent: Math.round(exp * 0.1),
        })
      }
    }
  }, [result])

  // Calculations for Cost Estimator
  const totalOneTime = useMemo(() => {
    return Object.values(oneTimeCosts).reduce((acc, val) => acc + (Number(val) || 0), 0)
  }, [oneTimeCosts])

  const totalMonthlyOps = useMemo(() => {
    return Object.values(monthlyCosts).reduce((acc, val) => acc + (Number(val) || 0), 0)
  }, [monthlyCosts])

  // Hidden Costs (approx ~15% of monthly ops + gateway fees)
  const estimatedHiddenCosts = useMemo(() => {
    return Math.round(totalMonthlyOps * 0.12)
  }, [totalMonthlyOps])

  // Recommended Emergency Reserve (6 Months)
  const emergencyReserve = useMemo(() => {
    return totalMonthlyOps * 6
  }, [totalMonthlyOps])

  // Total Initial Investment Needed
  const totalInitialInvestment = useMemo(() => {
    return totalOneTime + (totalMonthlyOps * 3) + estimatedHiddenCosts
  }, [totalOneTime, totalMonthlyOps, estimatedHiddenCosts])

  // Cost Distribution Chart Data for Cost Estimator
  const costDistributionPieData = useMemo(() => {
    return [
      { name: 'One-Time Dev & Branding', value: totalOneTime },
      { name: 'Monthly Salaries & Rent', value: totalMonthlyOps * 3 },
      { name: 'Hidden Gateway & Taxes', value: estimatedHiddenCosts },
      { name: 'Emergency Fund', value: emergencyReserve },
    ]
  }, [totalOneTime, totalMonthlyOps, estimatedHiddenCosts, emergencyReserve])

  // Dynamic Revenue Forecast Calculations
  const calculatedForecast = useMemo(() => {
    const { productPrice, initialCustomers, monthlyGrowthRate } = forecastInputs
    let customers = Number(initialCustomers) || 10
    const price = Number(productPrice) || 1000
    const growth = (Number(monthlyGrowthRate) || 10) / 100

    const monthlyData = []
    let accumulatedRevenue = 0

    for (let month = 1; month <= 12; month++) {
      const monthRevenue = Math.round(customers * price)
      const monthOps = totalMonthlyOps
      const monthNetProfit = monthRevenue - monthOps

      accumulatedRevenue += monthRevenue
      monthlyData.push({
        month: `M${month}`,
        revenue: monthRevenue,
        expenses: monthOps,
        profit: monthNetProfit,
        customers: Math.round(customers),
      })

      customers = customers * (1 + growth)
    }

    const year1Revenue = accumulatedRevenue
    const quarter1Revenue = monthlyData.slice(0, 3).reduce((a, b) => a + b.revenue, 0)
    const currentMonthlyRevenue = monthlyData[0].revenue

    return {
      monthlyData,
      year1Revenue,
      quarter1Revenue,
      currentMonthlyRevenue,
    }
  }, [forecastInputs, totalMonthlyOps])

  // Profit & Loss Calculations
  const pnlMetrics = useMemo(() => {
    const revenue = calculatedForecast.currentMonthlyRevenue
    const expenses = totalMonthlyOps + estimatedHiddenCosts
    const grossProfit = Math.max(0, revenue - Math.round(expenses * 0.4))
    const netProfit = revenue - expenses
    const profitMargin = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : '0.0'
    const cashRemaining = Math.max(0, totalInitialInvestment - (expenses * 2))

    return {
      revenue,
      expenses,
      grossProfit,
      netProfit,
      profitMargin,
      cashRemaining,
    }
  }, [calculatedForecast, totalMonthlyOps, estimatedHiddenCosts, totalInitialInvestment])

  // Break-even Calculations
  const breakEvenMetrics = useMemo(() => {
    const price = Number(forecastInputs.productPrice) || 1000
    const fixedCostsMonthly = totalMonthlyOps
    const breakEvenUnits = price > 0 ? Math.ceil(fixedCostsMonthly / price) : 0
    const breakEvenRevenue = breakEvenUnits * price

    const currentRevenue = calculatedForecast.currentMonthlyRevenue
    const progressPercent = Math.min(100, Math.round((currentRevenue / (breakEvenRevenue || 1)) * 100))

    let monthsToBreakEven = 1
    let tempRev = calculatedForecast.monthlyData[0]?.revenue || 0
    for (let i = 0; i < calculatedForecast.monthlyData.length; i++) {
      if (calculatedForecast.monthlyData[i].revenue >= fixedCostsMonthly) {
        monthsToBreakEven = i + 1
        break
      }
    }

    return {
      breakEvenRevenue,
      breakEvenUnits,
      breakEvenMonths: monthsToBreakEven,
      progressPercent,
      currentRevenue,
    }
  }, [forecastInputs, totalMonthlyOps, calculatedForecast])

  // ROI Calculations
  const roiMetrics = useMemo(() => {
    const investment = totalInitialInvestment || 100000
    const annualNetProfit = calculatedForecast.monthlyData.reduce((a, b) => a + b.profit, 0)
    const roiPercentage = investment > 0 ? ((annualNetProfit / investment) * 100).toFixed(1) : '0.0'
    const paybackMonths = annualNetProfit > 0 ? Math.max(1, Math.round((investment / (annualNetProfit / 12)))) : 'N/A'

    return {
      investment,
      annualNetProfit,
      roiPercentage,
      paybackMonths,
    }
  }, [totalInitialInvestment, calculatedForecast])

  // Chat Submission Handler
  function handleSendMessage(textToSend) {
    const text = textToSend || chatInput
    if (!text.trim()) return

    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setChatMessages((prev) => [...prev, userMsg])
    if (!textToSend) setChatInput('')
    setIsTyping(true)

    // Simulate intelligent AI financial guidance response
    setTimeout(() => {
      let aiResponseText = `Based on your startup's numbers (Initial Investment: ${formatCurrency(totalInitialInvestment)}, Monthly Ops: ${formatCurrency(totalMonthlyOps)}):\n\n`

      if (text.toLowerCase().includes('2 lakh') || text.toLowerCase().includes('launch')) {
        aiResponseText += "• Financial Analysis: Launching with ₹2 Lakh is viable if you focus strictly on MVP product development and remote operations. Your estimated 1-time setup is " + formatCurrency(totalOneTime) + ".\n• Recommendation: Postpone office rent and keep marketing lean until initial revenue starts flowing."
      } else if (text.toLowerCase().includes('pricing') || text.toLowerCase().includes('low')) {
        aiResponseText += "• Pricing Review: Your current unit price is " + formatCurrency(forecastInputs.productPrice) + ". If your gross margin is below 50%, consider value-based tier pricing to accelerate break-even."
      } else if (text.toLowerCase().includes('marketing') || text.toLowerCase().includes('budget')) {
        aiResponseText += "• Marketing Advisory: Currently marketing is set to " + formatCurrency(monthlyCosts.marketing) + "/mo. Increase marketing only when Customer Acquisition Cost (CAC) is less than 1/3rd of customer Lifetime Value (LTV)."
      } else {
        aiResponseText += "• Strengths: Low fixed burn rate.\n• Risk: Make sure to maintain a 6-month emergency reserve (" + formatCurrency(emergencyReserve) + ").\n• Funding Advice: Target break-even within " + breakEvenMetrics.breakEvenMonths + " months before seeking Seed capital."
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setIsTyping(false)
    }, 1000)
  }

  if (isGenerating) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-8 w-80 rounded-md animate-shimmer" />
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((n) => <SkeletonCard key={n} />)}
        </div>
        <SkeletonCard />
      </div>
    )
  }

  if (error && !result) {
    return (
      <ErrorState
        title="Could not load finance projections"
        message={error}
        onRetry={generateKit}
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-700">Finance Module</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={24} />
              Startup Financial Suite & AI Forecasting
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Interactive SaaS financial modeling: Cost Estimator, Revenue Forecast, P&L, Break-even, ROI, & AI Financial Advisor.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(ROUTES.DASHBOARD)}>
              Dashboard
            </Button>
            <Button variant="outline" size="sm" icon={RefreshCw} loading={isGenerating} onClick={generateKit}>
              Regenerate
            </Button>
            <Button variant="primary" size="sm" icon={Download} onClick={() => window.print()}>
              Export Projections
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Financial Overview', icon: BarChart3 },
          { id: 'estimator', label: '1. Cost Estimator', icon: Calculator },
          { id: 'forecast', label: '2. Revenue Forecast', icon: TrendingUp },
          { id: 'pnl', label: '3. Profit & Loss', icon: DollarSign },
          { id: 'breakeven', label: '4. Break-even Calc', icon: Percent },
          { id: 'roi', label: '5. ROI Calculator', icon: Wallet },
          { id: 'advisor', label: '6. AI Financial Advisor', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg transition-all shrink-0 ${
                isActive
                  ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* OVERVIEW / SUMMARY CARDS */}
      {(activeTab === 'overview' || activeTab === 'estimator') && (
        <div className="grid sm:grid-cols-5 gap-4">
          <Card className="bg-blue-50 border-blue-100">
            <p className="text-xs font-semibold text-blue-600 uppercase">One-Time Setup</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalOneTime)}</p>
          </Card>
          <Card className="bg-purple-50 border-purple-100">
            <p className="text-xs font-semibold text-purple-600 uppercase">Monthly Operating</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalMonthlyOps)}</p>
          </Card>
          <Card className="bg-amber-50 border-amber-100">
            <p className="text-xs font-semibold text-amber-600 uppercase">Hidden Expenses</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(estimatedHiddenCosts)}</p>
          </Card>
          <Card className="bg-emerald-50 border-emerald-100">
            <p className="text-xs font-semibold text-emerald-600 uppercase">Emergency Reserve</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(emergencyReserve)}</p>
          </Card>
          <Card className="bg-indigo-50 border-indigo-100">
            <p className="text-xs font-semibold text-indigo-600 uppercase">Initial Capital Needed</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalInitialInvestment)}</p>
          </Card>
        </div>
      )}

      {/* 1. STARTUP COST ESTIMATOR TAB */}
      {activeTab === 'estimator' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Calculator size={18} className="text-blue-600" /> Interactive Cost Adjuster
              </Card.Title>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">One-Time Expenses (₹)</h4>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium">Product Dev</label>
                    <input
                      type="number"
                      value={oneTimeCosts.productDev}
                      onChange={(e) => setOneTimeCosts({ ...oneTimeCosts, productDev: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Website/App</label>
                    <input
                      type="number"
                      value={oneTimeCosts.webAppDev}
                      onChange={(e) => setOneTimeCosts({ ...oneTimeCosts, webAppDev: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Branding & Design</label>
                    <input
                      type="number"
                      value={oneTimeCosts.brandingDesign}
                      onChange={(e) => setOneTimeCosts({ ...oneTimeCosts, brandingDesign: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Legal & Registration</label>
                    <input
                      type="number"
                      value={oneTimeCosts.legalRegistration}
                      onChange={(e) => setOneTimeCosts({ ...oneTimeCosts, legalRegistration: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Monthly Recurring Costs (₹)</h4>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium">Salaries</label>
                    <input
                      type="number"
                      value={monthlyCosts.salaries}
                      onChange={(e) => setMonthlyCosts({ ...monthlyCosts, salaries: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Marketing</label>
                    <input
                      type="number"
                      value={monthlyCosts.marketing}
                      onChange={(e) => setMonthlyCosts({ ...monthlyCosts, marketing: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Rent & Office</label>
                    <input
                      type="number"
                      value={monthlyCosts.rent}
                      onChange={(e) => setMonthlyCosts({ ...monthlyCosts, rent: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium">Software Subscriptions</label>
                    <input
                      type="number"
                      value={monthlyCosts.software}
                      onChange={(e) => setMonthlyCosts({ ...monthlyCosts, software: e.target.value })}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card flex>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <PieChartIcon size={18} className="text-purple-600" /> Capital Allocation Pie Chart
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <CostDistributionChart data={costDistributionPieData} />
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck size={14} /> AI Recommendation: Emergency Reserve
                </p>
                <p>
                  Maintain at least 6 months of operating expenses ({formatCurrency(emergencyReserve)}) in liquid bank fixed deposits before hiring full-time staff.
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* 2. REVENUE FORECAST TAB */}
      {(activeTab === 'overview' || activeTab === 'forecast') && (
        <div className="space-y-6">
          <Card>
            <Card.Header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <Card.Title className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600" /> Revenue Forecast Engine
                </Card.Title>
                <p className="text-xs text-slate-500 mt-0.5">Tweak pricing and customer growth to project monthly & annual revenue.</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold bg-slate-100 p-2 rounded-lg">
                <span>Price: ₹{forecastInputs.productPrice}</span>
                <span>Growth: {forecastInputs.monthlyGrowthRate}%/mo</span>
              </div>
            </Card.Header>
            <Card.Body className="space-y-6">
              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Product Unit Price (₹)</label>
                  <input
                    type="number"
                    value={forecastInputs.productPrice}
                    onChange={(e) => setForecastInputs({ ...forecastInputs, productPrice: e.target.value })}
                    className="w-full mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Starting Monthly Customers</label>
                  <input
                    type="number"
                    value={forecastInputs.initialCustomers}
                    onChange={(e) => setForecastInputs({ ...forecastInputs, initialCustomers: e.target.value })}
                    className="w-full mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Expected Monthly Growth (%)</label>
                  <input
                    type="number"
                    value={forecastInputs.monthlyGrowthRate}
                    onChange={(e) => setForecastInputs({ ...forecastInputs, monthlyGrowthRate: e.target.value })}
                    className="w-full mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="subModel"
                    checked={forecastInputs.isSubscription}
                    onChange={(e) => setForecastInputs({ ...forecastInputs, isSubscription: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="subModel" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Subscription SaaS Model
                  </label>
                </div>
              </div>

              {/* Forecast Projections Chart */}
              <RevenueExpenseChart data={calculatedForecast.monthlyData} />

              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Q1 Revenue Projection</span>
                  <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(calculatedForecast.quarter1Revenue)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Year 1 Total Revenue</span>
                  <p className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(calculatedForecast.year1Revenue)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Projected Month 12 Customers</span>
                  <p className="text-xl font-bold text-emerald-600 mt-1">
                    {calculatedForecast.monthlyData[11]?.customers || 0} active users
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* 3. PROFIT & LOSS DASHBOARD TAB */}
      {(activeTab === 'overview' || activeTab === 'pnl') && (
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-600" /> Profit & Loss (P&L) Statement
              </Card.Title>
            </Card.Header>
            <Card.Body className="space-y-6">
              <div className="grid sm:grid-cols-6 gap-3">
                <div className="p-3 rounded-xl border bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Revenue</span>
                  <p className="text-base font-bold text-slate-900 mt-1">{formatCurrency(pnlMetrics.revenue)}</p>
                </div>
                <div className="p-3 rounded-xl border bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Operating Exp.</span>
                  <p className="text-base font-bold text-rose-600 mt-1">{formatCurrency(pnlMetrics.expenses)}</p>
                </div>
                <div className="p-3 rounded-xl border bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Gross Profit</span>
                  <p className="text-base font-bold text-slate-800 mt-1">{formatCurrency(pnlMetrics.grossProfit)}</p>
                </div>
                <div className="p-3 rounded-xl border bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Net Profit</span>
                  <p className={`text-base font-bold mt-1 ${pnlMetrics.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatCurrency(pnlMetrics.netProfit)}
                  </p>
                </div>
                <div className="p-3 rounded-xl border bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Profit Margin</span>
                  <p className={`text-base font-bold mt-1 ${Number(pnlMetrics.profitMargin) >= 20 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {pnlMetrics.profitMargin}%
                  </p>
                </div>
                <div className="p-3 rounded-xl border bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Cash Remaining</span>
                  <p className="text-base font-bold text-blue-600 mt-1">{formatCurrency(pnlMetrics.cashRemaining)}</p>
                </div>
              </div>

              <ProfitBarChart data={calculatedForecast.monthlyData} />
            </Card.Body>
          </Card>
        </div>
      )}

      {/* 4. BREAK-EVEN CALCULATOR TAB */}
      {(activeTab === 'overview' || activeTab === 'breakeven') && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Percent size={18} className="text-blue-600" /> Break-even Analysis
              </Card.Title>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-3 text-center">
                <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-600 uppercase">Target Revenue</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(breakEvenMetrics.breakEvenRevenue)}</p>
                </div>
                <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                  <span className="text-[11px] font-bold text-purple-600 uppercase">Target Units</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">{breakEvenMetrics.breakEvenUnits} sales</p>
                </div>
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase">Break-even Timeline</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">{breakEvenMetrics.breakEvenMonths} Months</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Current Progress Toward Break-even</span>
                  <span>{breakEvenMetrics.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${breakEvenMetrics.progressPercent}%` }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900 to-slate-900 text-white">
            <Card.Header>
              <Card.Title className="text-white flex items-center gap-2">
                <Sparkles className="text-amber-400" size={18} /> AI Break-even Guidance
              </Card.Title>
            </Card.Header>
            <Card.Body className="space-y-3">
              <p className="text-sm text-slate-200 leading-relaxed">
                "At your current pricing of <span className="font-bold text-white">₹{forecastInputs.productPrice}</span> and monthly operating expenses of <span className="font-bold text-white">{formatCurrency(totalMonthlyOps)}</span>, your startup is expected to achieve break-even in approximately <span className="font-bold text-emerald-400">{breakEvenMetrics.breakEvenMonths} months</span>."
              </p>
              <div className="p-3 bg-white/10 rounded-xl text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white">Faster Break-even Tips:</p>
                <p>• Increase product price by 15% to reduce required sales units to {Math.round(breakEvenMetrics.breakEvenUnits * 0.85)}.</p>
                <p>• Offer annual billing upfront to boost immediate cash reserves.</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* 5. ROI CALCULATOR TAB */}
      {(activeTab === 'overview' || activeTab === 'roi') && (
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Wallet size={18} className="text-purple-600" /> Return on Investment (ROI) Calculator
            </Card.Title>
          </Card.Header>
          <Card.Body className="grid sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-xl border">
              <span className="text-xs font-bold text-slate-400 uppercase">Estimated 1-Year ROI</span>
              <p className="text-2xl font-extrabold text-purple-600 mt-1">{roiMetrics.roiPercentage}%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Initial Capital</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(roiMetrics.investment)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border">
              <span className="text-xs font-bold text-slate-400 uppercase">Projected Year 1 Profit</span>
              <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(roiMetrics.annualNetProfit)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border">
              <span className="text-xs font-bold text-slate-400 uppercase">Investment Payback Period</span>
              <p className="text-xl font-bold text-blue-600 mt-1">{roiMetrics.paybackMonths} Months</p>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* 6. AI FINANCIAL ADVISOR CHAT TAB */}
      {activeTab === 'advisor' && (
        <Card className="max-w-4xl mx-auto">
          <Card.Header className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <Card.Title className="flex items-center gap-2 text-slate-900">
                <Sparkles className="text-blue-600" size={20} /> AI Financial Advisor Chat
              </Card.Title>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                Online • Trained on your financial data
              </span>
            </div>
          </Card.Header>

          <Card.Body className="space-y-4">
            {/* Quick Prompt Pills */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Sample Founder Questions:</p>
              <div className="flex flex-wrap gap-2">
                {INITIAL_FINANCE_DATA.advisorPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Conversation History */}
            <div className="bg-slate-50 rounded-xl p-4 min-h-[300px] max-h-[420px] overflow-y-auto space-y-4 border border-slate-200">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                  <Sparkles size={14} className="animate-spin text-blue-600" /> AI Financial Advisor is analyzing...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about expenses, pricing, break-even, or funding..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button variant="primary" size="md" icon={Send} onClick={() => handleSendMessage()}>
                Send
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
