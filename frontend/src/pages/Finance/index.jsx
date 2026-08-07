import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, DollarSign, PieChart, ArrowLeft, Download, RefreshCw } from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { RevenueExpenseChart, CostDistributionChart, ProfitBarChart } from '../../components/Charts'
import { formatCurrency } from '../../utils/formatters'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'

export default function Finance() {
  const { result, generateKit, isGenerating, error } = useStartup()
  const navigate = useNavigate()

  const fin = result?.finance

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

  if (!fin) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No Finance Report Generated"
        description="Please generate a startup kit to view your financial projections."
        actionLabel="Generate Startup Kit"
        action={() => navigate(ROUTES.NEW)}
      />
    )
  }

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
              Financial Projections & Modeling
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Backend financial forecast: revenue, expenses, profit, investment, ROI, and break-even point.
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

      {/* KPI Highlights */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <p className="text-xs font-semibold text-blue-600 uppercase">Funding Needed</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(fin.fundingNeeded)}</p>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <p className="text-xs font-semibold text-emerald-600 uppercase">Break-Even Point</p>
          <p className="text-sm font-bold text-slate-900 mt-2">{fin.breakEven}</p>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <p className="text-xs font-semibold text-purple-600 uppercase">Estimated ROI</p>
          <p className="text-sm font-bold text-slate-900 mt-2">{fin.roiEstimated}</p>
        </Card>
        <Card className="bg-indigo-50 border-indigo-100">
          <p className="text-xs font-semibold text-indigo-600 uppercase">Year 3 Revenue Goal</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(fin.yearlyProjection?.year3 || 1420000)}</p>
        </Card>
      </div>

      {/* Monthly Projections Area Chart */}
      <Card>
        <Card.Header>
          <Card.Title>6-Month Revenue vs. Expenses Forecast</Card.Title>
        </Card.Header>
        <Card.Body>
          <RevenueExpenseChart data={fin.revenueProjections} />
        </Card.Body>
      </Card>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Cost Distribution Pie Chart */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <PieChart size={18} className="text-purple-600" /> Expense Breakdown (%)
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <CostDistributionChart data={fin.costDistribution} />
          </Card.Body>
        </Card>

        {/* Profit Bar Chart */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <DollarSign size={18} className="text-emerald-600" /> Net Profit Forecast ($)
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <ProfitBarChart data={fin.revenueProjections} />
          </Card.Body>
        </Card>
      </div>

      {/* Yearly Projections Table */}
      <Card>
        <Card.Header>
          <Card.Title>3-Year Long-Term Financial Outlook</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">Year 1 Revenue</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(fin.yearlyProjection?.year1)}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase">Year 2 Revenue</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(fin.yearlyProjection?.year2)}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-blue-200 bg-blue-50/30">
              <span className="text-xs font-semibold text-blue-600 uppercase">Year 3 Revenue</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(fin.yearlyProjection?.year3)}</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
