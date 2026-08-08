import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FileText, Target, Award, CheckCircle2, Milestone, ArrowLeft,
  Copy, Download, RefreshCw, ChevronDown, ChevronUp, Check
} from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { useToast } from '../../context/ToastContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'
import { generateStartupKitPDF } from '../../utils/pdfGenerator'

export default function BusinessPlan() {
  const { result, generateKit, isGenerating, error } = useStartup()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [copiedSection, setCopiedSection] = useState(null)
  const [collapsedCards, setCollapsedCards] = useState({})

  const plan = result?.businessPlan
  const startupName = result?.branding?.name || 'Your Startup'

  if (isGenerating) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-8 w-72 rounded-md animate-shimmer" />
        <div className="grid gap-4">
          {[1, 2, 3].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      </div>
    )
  }

  if (error && !result) {
    return (
      <ErrorState
        title="Could not load business plan"
        message={error}
        onRetry={generateKit}
      />
    )
  }

  if (!plan) {
    return (
      <EmptyState
        icon={FileText}
        title="No Business Plan Generated"
        description="Please generate a startup kit to view your personalized business plan."
        actionLabel="Generate Startup Kit"
        action={() => navigate(ROUTES.NEW)}
      />
    )
  }

  function toggleCard(cardKey) {
    setCollapsedCards((prev) => ({ ...prev, [cardKey]: !prev[cardKey] }))
  }

  function handleCopy(text, label) {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2))
    setCopiedSection(label)
    toast.success(`Copied ${label} to clipboard!`)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  async function handleRegenerate() {
    toast.info('Regenerating startup kit...')
    await generateKit()
  }

  function handleDownloadPDF() {
    if (!result) {
      toast.error('No startup kit loaded to export.')
      return
    }
    try {
      generateStartupKitPDF(result)
      toast.success('Startup Kit PDF downloaded!')
    } catch (err) {
      toast.error('Failed to generate PDF: ' + err.message)
    }
  }

  if (!result && !plan) {
    return (
      <EmptyState
        icon={FileText}
        title="No Business Plan Generated"
        description="Please generate a startup kit to view your personalized business plan."
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
          <span className="text-slate-700">Business Plan</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-blue-600" size={24} />
              Business Plan — {startupName}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Complete investor-ready business plan covering executive summary, SWOT, and financial strategy.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(ROUTES.DASHBOARD)}>
              Dashboard
            </Button>
            <Button variant="outline" size="sm" icon={RefreshCw} loading={isGenerating} onClick={handleRegenerate}>
              Regenerate
            </Button>
            <Button variant="primary" size="sm" icon={Download} onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <Card.Header className="flex items-center justify-between">
          <Card.Title>Executive Summary</Card.Title>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(plan.executiveSummary, 'Executive Summary')}
              className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
            >
              {copiedSection === 'Executive Summary' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copiedSection === 'Executive Summary' ? 'Copied' : 'Copy'}
            </button>
            <button onClick={() => toggleCard('exec')} className="text-slate-400 hover:text-slate-700">
              {collapsedCards.exec ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
        </Card.Header>
        {!collapsedCards.exec && (
          <Card.Body>
            <p className="text-slate-700 text-sm leading-relaxed">{plan.executiveSummary}</p>
          </Card.Body>
        )}
      </Card>

      {/* Problem & Solution */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title className="text-red-900">Problem Statement</Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-slate-700 text-sm leading-relaxed">{plan.problemStatement}</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title className="text-emerald-900">Solution Summary</Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-slate-700 text-sm leading-relaxed">{plan.solutionSummary}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Mission & Vision */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold text-sm">
            <Target size={18} /> Mission Statement
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">{plan.mission}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2 text-indigo-600 font-semibold text-sm">
            <Award size={18} /> Vision Statement
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">{plan.vision}</p>
        </Card>
      </div>

      {/* Market & Competitor Analysis */}
      {plan.marketAnalysis && (
        <Card>
          <Card.Header>
            <Card.Title>Market & Competitive Analysis</Card.Title>
          </Card.Header>
          <Card.Body className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase">Target Market</span>
                <p className="text-sm font-medium text-slate-800 mt-1">{plan.marketAnalysis.targetMarket}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase">Market Size (TAM)</span>
                <p className="text-sm font-medium text-slate-800 mt-1">{plan.marketAnalysis.marketSize}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <span className="text-xs font-semibold text-slate-400 uppercase">Competitive Advantage</span>
                <p className="text-sm font-medium text-slate-800 mt-1">{plan.marketAnalysis.competitiveAdvantage}</p>
              </div>
            </div>
            {plan.competitorAnalysis && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase">Competitor Positioning</span>
                <p className="text-sm text-slate-700 mt-1">{plan.competitorAnalysis}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* SWOT Matrix */}
      {plan.swot && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <h4 className="font-semibold text-emerald-900 text-sm mb-2">Strengths</h4>
            <ul className="space-y-1 text-xs text-emerald-800">
              {plan.swot.strengths?.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
            <h4 className="font-semibold text-amber-900 text-sm mb-2">Weaknesses</h4>
            <ul className="space-y-1 text-xs text-amber-800">
              {plan.swot.weaknesses?.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <h4 className="font-semibold text-blue-900 text-sm mb-2">Opportunities</h4>
            <ul className="space-y-1 text-xs text-blue-800">
              {plan.swot.opportunities?.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <h4 className="font-semibold text-red-900 text-sm mb-2">Threats</h4>
            <ul className="space-y-1 text-xs text-red-800">
              {plan.swot.threats?.map((item, i) => <li key={i}>• {item}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Revenue, Business Model & Marketing Summaries */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <span className="text-xs font-semibold text-blue-600 uppercase">Revenue Model</span>
          <p className="text-sm text-slate-700 mt-2">{plan.revenueModel}</p>
        </Card>
        <Card>
          <span className="text-xs font-semibold text-indigo-600 uppercase">Business Model</span>
          <p className="text-sm text-slate-700 mt-2">{plan.businessModel}</p>
        </Card>
        <Card>
          <span className="text-xs font-semibold text-emerald-600 uppercase">Growth Strategy</span>
          <p className="text-sm text-slate-700 mt-2">{plan.growthStrategy}</p>
        </Card>
      </div>

      {/* Milestones */}
      {plan.milestones && (
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Milestone size={18} className="text-blue-600" /> Key Milestones & Roadmap
            </Card.Title>
          </Card.Header>
          <Card.Body className="space-y-3">
            {plan.milestones.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-blue-500" />
                  <span className="text-sm font-medium text-slate-800">{m.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{m.timeline}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">{m.status}</span>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
      )}

      {/* Conclusion */}
      {plan.conclusion && (
        <Card className="bg-slate-900 text-white">
          <Card.Header>
            <Card.Title className="text-white">Conclusion</Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-slate-300 text-sm leading-relaxed">{plan.conclusion}</p>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
