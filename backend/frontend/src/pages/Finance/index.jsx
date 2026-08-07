import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  TrendingUp, DollarSign, PieChart, ArrowLeft, Download,
  RefreshCw, Calculator, Check, AlertTriangle, Users, Layers,
  Zap, Target, Heart, BarChart2, ChevronDown, ChevronUp,
} from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { useToast } from '../../context/ToastContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import {
  RevenueExpenseChart,
  CostDistributionChart,
  InvestmentAllocationChart,
  ProfitBarChart,
  GrowthProjectionChart,
} from '../../components/Charts'
import { formatCurrency, calculateFinancials, parseBudgetValue } from '../../utils/financeCalculator'
import { generateStartupKitPDF } from '../../utils/pdfGenerator'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'

// ─── Scenario Presets ─────────────────────────────────────────────────────────
const SCENARIOS = {
  conservative: {
    label: 'Conservative',
    icon: '🛡️',
    color: 'amber',
    description: 'Lower risk, slower growth',
    overrides: { monthlyCustomers: 400, monthlyGrowthRate: 4, monthlyExpenses: 150000 },
  },
  moderate: {
    label: 'Moderate',
    icon: '⚖️',
    color: 'blue',
    description: 'Balanced realistic target',
    overrides: { monthlyCustomers: 800, monthlyGrowthRate: 8, monthlyExpenses: 120000 },
  },
  aggressive: {
    label: 'Aggressive',
    icon: '🚀',
    color: 'emerald',
    description: 'High growth, higher spend',
    overrides: { monthlyCustomers: 1500, monthlyGrowthRate: 15, monthlyExpenses: 200000 },
  },
}

// ─── Financial Health Score Badge ────────────────────────────────────────────
function HealthScoreBadge({ score }) {
  let label, color, bg, bar
  if (score >= 70) {
    label = 'Excellent'
    color = 'text-emerald-700'
    bg = 'bg-emerald-50 border-emerald-200'
    bar = 'bg-emerald-500'
  } else if (score >= 45) {
    label = 'Moderate'
    color = 'text-amber-700'
    bg = 'bg-amber-50 border-amber-200'
    bar = 'bg-amber-400'
  } else if (score >= 20) {
    label = 'Weak'
    color = 'text-orange-700'
    bg = 'bg-orange-50 border-orange-200'
    bar = 'bg-orange-400'
  } else {
    label = 'Critical'
    color = 'text-red-700'
    bg = 'bg-red-50 border-red-200'
    bar = 'bg-red-500'
  }

  return (
    <div className={`rounded-xl border px-4 py-3 flex items-center gap-4 ${bg}`}>
      <div className="flex-shrink-0 text-center">
        <Heart size={18} className={color} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-bold uppercase tracking-wide ${color}`}>
            Financial Health Score
          </span>
          <span className={`text-xl font-black ${color}`}>{Math.max(0, score)}/100</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${bar}`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
        <p className={`text-[11px] font-semibold mt-1 ${color}`}>{label} — based on profit margin & annual ROI</p>
      </div>
    </div>
  )
}

// ─── Projections Table ────────────────────────────────────────────────────────
function ProjectionsTable({ projections = [], showAll }) {
  const displayRows = showAll ? projections : projections.slice(0, 3)
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="px-3 py-2.5 text-left font-semibold">Month</th>
            <th className="px-3 py-2.5 text-right font-semibold">Customers</th>
            <th className="px-3 py-2.5 text-right font-semibold">Revenue</th>
            <th className="px-3 py-2.5 text-right font-semibold">Expenses</th>
            <th className="px-3 py-2.5 text-right font-semibold">Net Profit</th>
            <th className="px-3 py-2.5 text-right font-semibold">Margin</th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, idx) => {
            const margin = row.revenue > 0 ? ((row.profit / row.revenue) * 100).toFixed(1) : '0.0'
            const isProfit = row.profit >= 0
            return (
              <tr
                key={idx}
                className={`border-t border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-blue-50/30 transition-colors`}
              >
                <td className="px-3 py-2 font-semibold text-slate-700">{row.month}</td>
                <td className="px-3 py-2 text-right text-slate-600">{(row.customers || 0).toLocaleString('en-IN')}</td>
                <td className="px-3 py-2 text-right font-semibold text-blue-700">{formatCurrency(row.revenue)}</td>
                <td className="px-3 py-2 text-right text-red-600">{formatCurrency(row.expenses)}</td>
                <td className={`px-3 py-2 text-right font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isProfit ? '+' : ''}{formatCurrency(row.profit)}
                </td>
                <td className={`px-3 py-2 text-right font-semibold ${isProfit ? 'text-emerald-700' : 'text-red-600'}`}>
                  {margin}%
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function Finance() {
  const { result, setResult, generateKit, isGenerating, error } = useStartup()
  const { toast } = useToast()
  const navigate = useNavigate()

  const fin = result?.finance

  // Calculator Form State initialized from active startup kit or realistic defaults
  const [calcInputs, setCalcInputs] = useState({
    investment: 500000,
    pricePerUnit: 250,
    monthlyCustomers: 800,
    monthlyExpenses: 120000,
    employeeCount: 2,
    costPerEmployee: 25000,
    monthlyGrowthRate: 8,
  })

  const [activeScenario, setActiveScenario] = useState('moderate')
  const [showAllProjections, setShowAllProjections] = useState(false)

  // Sync state when kit result loads or changes
  useEffect(() => {
    if (fin) {
      setCalcInputs({
        investment: fin.investment || parseBudgetValue(result?._budget || result?.budget) || 500000,
        pricePerUnit: fin.pricePerUnit || 250,
        monthlyCustomers: fin.monthlyCustomers || 800,
        monthlyExpenses: fin.monthlyExpenses || fin.expenses || 120000,
        employeeCount: fin.employeeCount !== undefined ? fin.employeeCount : 2,
        costPerEmployee: fin.costPerEmployee || 25000,
        monthlyGrowthRate: fin.monthlyGrowthRate || 8,
      })
    }
  }, [fin, result])

  // Real-time calculation output
  const calcOutput = calculateFinancials(calcInputs)

  // Compute health score from profit margin + annualised ROI
  const marginPct = calcOutput.revenue > 0
    ? Math.max(0, (calcOutput.profit / calcOutput.revenue) * 100)
    : 0
  const healthScore = Math.round(
    (Math.min(100, Math.max(0, calcOutput.roiPercentage)) * 0.5) +
    (Math.min(100, Math.max(0, marginPct)) * 0.5)
  )

  // Handle Input Change
  function handleInputChange(field, val) {
    const num = Math.max(0, Number(val) || 0)
    setCalcInputs((prev) => ({ ...prev, [field]: num }))
    setActiveScenario(null)
  }

  // Apply a preset scenario
  function applyScenario(key) {
    setActiveScenario(key)
    setCalcInputs((prev) => ({ ...prev, ...SCENARIOS[key].overrides }))
    toast.info(`Applied ${SCENARIOS[key].label} scenario`)
  }

  // Apply calculations to current kit
  function handleApplyCalculations() {
    if (!result) return
    const updatedKit = {
      ...result,
      finance: {
        ...result.finance,
        ...calcOutput,
        fundingNeeded: calcOutput.investment,
        breakEven: calcOutput.breakEvenMonths,
        roiEstimated: `${calcOutput.roiPercentage}% Annual ROI`,
      },
    }
    setResult(updatedKit)
    toast.success('Financial model recalculated and saved to startup kit!')
  }

  // Download PDF Report
  function handleExportPDF() {
    try {
      generateStartupKitPDF(result || { finance: calcOutput, _idea: 'Startup Plan' })
      toast.success('PDF report downloaded successfully!')
    } catch (err) {
      toast.error('Failed to export PDF: ' + err.message)
    }
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

  if (!result && !fin) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No Startup Kit Loaded"
        description="Please generate or load a startup kit to view your financial projections."
        actionLabel="Generate Startup Kit"
        action={() => navigate(ROUTES.NEW)}
      />
    )
  }

  const activeFin = fin || calcOutput

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-700">Finance</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={24} />
              Financial Calculator & Projections
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Member 4 Module: Real-time revenue, expense, profit, break-even, ROI, and growth modeling.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(ROUTES.DASHBOARD)}>
              Dashboard
            </Button>
            <Button variant="outline" size="sm" icon={RefreshCw} loading={isGenerating} onClick={generateKit}>
              Regenerate AI
            </Button>
            <Button variant="primary" size="sm" icon={Download} onClick={handleExportPDF}>
              Download Startup Kit PDF
            </Button>
          </div>
        </div>
      </div>

      {/* ── MODULE 1: INTERACTIVE FINANCE CALCULATOR ──────────────────────────── */}
      <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
        <Card.Header>
          <Card.Title className="flex items-center gap-2 text-blue-900">
            <Calculator size={20} className="text-blue-600" />
            Module 1 — Interactive Finance Calculator
          </Card.Title>
        </Card.Header>
        <Card.Body className="space-y-6">

          {/* Scenario Presets */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
              <Target size={13} /> Quick Scenario Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SCENARIOS).map(([key, s]) => (
                <button
                  key={key}
                  id={`scenario-${key}`}
                  onClick={() => applyScenario(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeScenario === key
                      ? s.color === 'amber'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : s.color === 'emerald'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-blue-500 text-white border-blue-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                  <span className="opacity-70">— {s.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Investment (₹)
              </label>
              <input
                type="number"
                value={calcInputs.investment}
                onChange={(e) => handleInputChange('investment', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">Total capital needed to launch</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product/Service Price (₹)
              </label>
              <input
                type="number"
                value={calcInputs.pricePerUnit}
                onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">Average revenue per order/user</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Customers / Volume
              </label>
              <input
                type="number"
                value={calcInputs.monthlyCustomers}
                onChange={(e) => handleInputChange('monthlyCustomers', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">Expected orders per month</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Operating Expenses (₹)
              </label>
              <input
                type="number"
                value={calcInputs.monthlyExpenses}
                onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">Rent, tech, marketing & logistics</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Users size={12} /> Number of Employees (Optional)
              </label>
              <input
                type="number"
                value={calcInputs.employeeCount}
                onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">@ ₹25,000 avg salary/staff</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Customer Growth (%)
              </label>
              <input
                type="number"
                value={calcInputs.monthlyGrowthRate}
                onChange={(e) => handleInputChange('monthlyGrowthRate', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">Compounding monthly growth rate</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" icon={Check} onClick={handleApplyCalculations}>
              Update & Save Financial Model
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* ── CALCULATOR OUTPUT KPI CARDS ────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-blue-50/80 border-blue-100">
          <p className="text-xs font-semibold text-blue-700 uppercase">Monthly Revenue</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(calcOutput.revenue)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {calcInputs.pricePerUnit} × {calcInputs.monthlyCustomers} customers
          </p>
        </Card>

        <Card className="bg-red-50/80 border-red-100">
          <p className="text-xs font-semibold text-red-700 uppercase">Monthly Expenses</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(calcOutput.totalExpenses)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Ops + {calcInputs.employeeCount} staff salaries
          </p>
        </Card>

        <Card className={calcOutput.isProfitable ? 'bg-emerald-50/80 border-emerald-100' : 'bg-amber-50/80 border-amber-100'}>
          <p className={`text-xs font-semibold uppercase ${calcOutput.isProfitable ? 'text-emerald-700' : 'text-amber-700'}`}>
            Estimated Monthly Profit
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(calcOutput.profit)}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-semibold mt-1">
            {calcOutput.isProfitable ? (
              <span className="text-emerald-600 flex items-center gap-0.5">
                <Check size={12} /> Net Profitable
              </span>
            ) : (
              <span className="text-amber-700 flex items-center gap-0.5">
                <AlertTriangle size={12} /> Operating Loss
              </span>
            )}
          </div>
        </Card>

        <Card className="bg-purple-50/80 border-purple-100">
          <p className="text-xs font-semibold text-purple-700 uppercase">Break-Even Point</p>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {calcOutput.breakEvenMonths}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Time to recover initial investment
          </p>
        </Card>

        <Card className="bg-indigo-50/80 border-indigo-100">
          <p className="text-xs font-semibold text-indigo-700 uppercase">Estimated ROI</p>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {calcOutput.roiPercentage}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Annual profit / investment ratio
          </p>
        </Card>
      </div>

      {/* Financial Health Score */}
      <HealthScoreBadge score={healthScore} />

      {/* ── MODULE 3: VISUAL DASHBOARD CHARTS ──────────────────────────────────── */}
      <Card>
        <Card.Header>
          <Card.Title>6-Month Revenue vs. Expenses Forecast</Card.Title>
        </Card.Header>
        <Card.Body>
          <RevenueExpenseChart data={activeFin.projections || activeFin.revenueProjections} />
        </Card.Body>
      </Card>

      {/* Growth Projection Chart — NEW */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Zap size={18} className="text-purple-600" /> Customer & Revenue Growth Trajectory
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <GrowthProjectionChart data={calcOutput.projections} />
        </Card.Body>
      </Card>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Cost Distribution Chart */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <PieChart size={18} className="text-purple-600" /> Expense Breakdown
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <CostDistributionChart data={activeFin.costDistribution} />
          </Card.Body>
        </Card>

        {/* Investment Allocation Chart */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Layers size={18} className="text-blue-600" /> Initial Investment Allocation
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <InvestmentAllocationChart data={activeFin.investmentAllocation} />
          </Card.Body>
        </Card>
      </div>

      {/* Profit Trend Chart */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-600" /> Net Profit Trend Forecast
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <ProfitBarChart data={activeFin.projections || activeFin.revenueProjections} />
        </Card.Body>
      </Card>

      {/* ── GROWTH PROJECTIONS TABLE — NEW ─────────────────────────────────────── */}
      <Card className="border-indigo-200 bg-gradient-to-br from-white to-indigo-50/20">
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title className="flex items-center gap-2">
              <BarChart2 size={18} className="text-indigo-600" /> 6-Month Growth Projections Table
            </Card.Title>
            <button
              onClick={() => setShowAllProjections((v) => !v)}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              {showAllProjections ? (
                <><ChevronUp size={14} /> Show Less</>
              ) : (
                <><ChevronDown size={14} /> Show All Months</>
              )}
            </button>
          </div>
        </Card.Header>
        <Card.Body>
          <ProjectionsTable
            projections={calcOutput.projections}
            showAll={showAllProjections}
          />
          {!showAllProjections && calcOutput.projections.length > 3 && (
            <p className="text-center text-xs text-slate-400 mt-2">
              Showing 3 of {calcOutput.projections.length} months — click "Show All Months" to expand
            </p>
          )}
        </Card.Body>
      </Card>

      {/* 3-Year Outlook Table */}
      <Card>
        <Card.Header>
          <Card.Title>3-Year Long-Term Financial Outlook</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <span className="text-xs font-semibold text-slate-400 uppercase">Year 1 Revenue</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(activeFin.yearlyProjection?.year1)}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <span className="text-xs font-semibold text-slate-400 uppercase">Year 2 Revenue</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(activeFin.yearlyProjection?.year2)}
              </p>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-xl text-center border border-blue-200">
              <span className="text-xs font-semibold text-blue-600 uppercase">Year 3 Target</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(activeFin.yearlyProjection?.year3)}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
