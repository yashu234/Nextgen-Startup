import { useEffect, useState } from 'react'
import {
  Sparkles, FileText, History, TrendingUp,
  BarChart3, FolderOpen, ArrowRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useStartup } from '../../context/StartupContext'
import { useToast } from '../../context/ToastContext'
import historyService from '../../services/historyService'
import { parseApiError } from '../../utils/formatters'
import { ROUTES } from '../../constants/routes'
import StatCard from '../../components/StatCard'
import { Link, useNavigate } from 'react-router-dom'
import StartupCard from '../../components/StartupCard'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'

export default function Dashboard() {
  const { user } = useAuth()
  const { setResult, hasResult } = useStartup()
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

  const recentProjects = history.slice(0, 3)
  const totalProjects = history.length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Here&apos;s an overview of your startup kits.
          </p>
        </div>
        <Link to={ROUTES.NEW}>
          <Button variant="primary" icon={Sparkles}>
            Generate New Kit
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Kits Generated"
          value={historyLoading ? '—' : totalProjects}
          icon={BarChart3}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          loading={historyLoading}
        />
        <StatCard
          title="Business Plans"
          value={historyLoading ? '—' : totalProjects}
          icon={FileText}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          loading={historyLoading}
        />
        <StatCard
          title="Pitch Decks"
          value={historyLoading ? '—' : totalProjects}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          loading={historyLoading}
        />
        <StatCard
          title="Finance Reports"
          value={historyLoading ? '—' : totalProjects}
          icon={History}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          loading={historyLoading}
        />
      </div>

      {/* Quick actions */}
      {hasResult && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-900">You have a startup kit loaded</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Continue exploring your business plan, branding, and more.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to={ROUTES.BUSINESS_PLAN}>
              <Button variant="outline" size="sm" icon={FileText}>
                Business Plan
              </Button>
            </Link>
            <Link to={ROUTES.PITCH_DECK}>
              <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                Pitch Deck
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Projects</h2>
          {totalProjects > 3 && (
            <Link to={ROUTES.HISTORY}>
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                View All
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
