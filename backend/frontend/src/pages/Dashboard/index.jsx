import { useEffect, useState } from 'react'
import {
  Sparkles, FileText, History, TrendingUp,
  BarChart3, FolderOpen, ArrowRight, Download, Shield, PieChart, Layers
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useStartup } from '../../context/StartupContext'
import { useToast } from '../../context/ToastContext'
import historyService from '../../services/historyService'
import { parseApiError } from '../../utils/formatters'
import { ROUTES } from '../../constants/routes'
import StatCard from '../../components/StatCard'
import Card from '../../components/Card'
import { Link, useNavigate } from 'react-router-dom'
import StartupCard from '../../components/StartupCard'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'
import {
  RevenueExpenseChart,
  CostDistributionChart,
  InvestmentAllocationChart
} from '../../components/Charts'
import { formatCurrency } from '../../utils/financeCalculator'
import { generateStartupKitPDF } from '../../utils/pdfGenerator'

export default function Dashboard() {
  const { user } = useAuth()
  const { result, setResult, hasResult } = useStartup()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState(null)

  useEffect(() => {
    async function fetchHistory() {
      setHistoryLoading(true)
      setHistoryError(null)
      try {
        const data = await historyService.getAll()
        setHistory(data)
      } catch (error) {
        setHistoryError(error.message || 'Could not load recent projects.')
      } finally {
        setHistoryLoading(false)
      }
    }
    fetchHistory()
  }, [toast])

  async function handleViewKit(id) {
    try {
      const kit = await historyService.getById(id)
      setResult(kit)
      toast.success('Startup kit loaded!')
    } catch (error) {
      toast.error(parseApiError(error))
    }
  }

  function handleDownloadPDF() {
    if (!result) {
      toast.error('No active startup kit loaded to export.')
      return
    }
    try {
      generateStartupKitPDF(result)
      toast.success('PDF Startup Kit exported!')
    } catch (err) {
      toast.error('Failed to export PDF: ' + err.message)
    }
  }

  const recentProjects = history.slice(0, 3)
  const totalProjects = history.length

  const fin = result?.finance || {
    investment: 500000,
    revenue: 200000,
    profit: 80000,
    breakEven: '7 Months',
    projections: [
      { month: 'Month 1', revenue: 200000, expenses: 120000, profit: 80000 },
      { month: 'Month 2', revenue: 216000, expenses: 125000, profit: 91000 },
      { month: 'Month 3', revenue: 233250, expenses: 130000, profit: 103250 },
      { month: 'Month 6', revenue: 293750, expenses: 145000, profit: 148750 },
    ],
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(' ')[0] || 'Founder'} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Overview of your active startup kit financial metrics & analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasResult && (
            <Button variant="outline" icon={Download} onClick={handleDownloadPDF}>
              Export PDF
            </Button>
          )}
          <Link to={ROUTES.NEW}>
            <Button variant="primary" icon={Sparkles}>
              Generate New Kit
            </Button>
          </Link>
        </div>
      </div>

      {/* ── MODULE 3: DASHBOARD ANALYTICS CARDS ────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Initial Investment"
          value={formatCurrency(fin.investment || fin.fundingNeeded || 500000)}
          icon={BarChart3}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(fin.revenue || 200000)}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Estimated Monthly Profit"
          value={formatCurrency(fin.profit || 80000)}
          icon={FileText}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Break-even Point"
          value={fin.breakEven || fin.breakEvenMonths || '7 Months'}
          icon={History}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Active kit quick banner */}
      {hasResult && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Active Startup Kit</span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {result?.branding?.name || result?._idea || 'Generated Startup Project'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore business plan, financial modeling, compliance checklist, and pitch deck.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to={ROUTES.FINANCE}>
              <Button variant="outline" size="sm" icon={TrendingUp}>
                Finance Model
              </Button>
            </Link>
            <Link to={ROUTES.COMPLIANCE}>
              <Button variant="outline" size="sm" icon={Shield}>
                Compliance
              </Button>
            </Link>
            <Button variant="primary" size="sm" icon={Download} onClick={handleDownloadPDF}>
              Download PDF Kit
            </Button>
          </div>
        </div>
      )}

      {/* ── MODULE 3: DASHBOARD CHARTS ────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-600" /> Revenue vs Expenses Trend
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <RevenueExpenseChart data={fin.projections || fin.revenueProjections} />
            </Card.Body>
          </Card>
        </div>

        <div>
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <PieChart size={18} className="text-purple-600" /> Cost Distribution
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <CostDistributionChart data={fin.costDistribution} />
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Layers size={18} className="text-indigo-600" /> Initial Capital Allocation
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <InvestmentAllocationChart data={fin.investmentAllocation} />
        </Card.Body>
      </Card>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Projects History</h2>
          {totalProjects > 3 && (
            <Link to={ROUTES.HISTORY}>
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                View All ({totalProjects})
              </Button>
            </Link>
          )}
        </div>

        {historyLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : historyError ? (
          <ErrorState
            title="Could not load recent projects"
            message={historyError}
            onRetry={() => window.location.reload()}
          />
        ) : recentProjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((kit) => (
              <StartupCard
                key={kit._id}
                startup={kit}
                onView={() => handleViewKit(kit._id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="No startup kits yet"
            description="Generate your first AI-powered startup kit to get started."
            action={() => navigate(ROUTES.NEW)}
            actionLabel="Generate Now"
          />
        )}
      </div>
    </div>
  )
}
