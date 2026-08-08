import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Megaphone, Search, Share2, Mail, FileText, ArrowLeft, Download, RefreshCw, Zap, Users, Target, Rocket, BarChart2, Calendar } from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { useToast } from '../../context/ToastContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'
import { generateStartupKitPDF } from '../../utils/pdfGenerator'

export default function Marketing() {
  const { result, generateKit, isGenerating, error } = useStartup()
  const { toast } = useToast()
  const navigate = useNavigate()

  const rawMkt = result?.marketing

  const mkt = useMemo(() => {
    if (!rawMkt) return null
    return {
      targetAudience: rawMkt.targetAudience || result?.businessPlan?.marketAnalysis?.targetMarket || 'Target audience looking for innovative startup solutions.',
      marketingStrategy: rawMkt.marketingStrategy || 'Multi-channel digital strategy combining SEO, social media outreach, and direct sales.',
      socialMedia: Array.isArray(rawMkt.socialMedia) && rawMkt.socialMedia.length
        ? rawMkt.socialMedia
        : (rawMkt.channels?.map(c => `${c.name}: ${c.strategy}`) || ['LinkedIn: Weekly case studies', 'Twitter/X: Founder updates', 'Instagram: Visual branding']),
      emailCampaign: Array.isArray(rawMkt.emailCampaign) && rawMkt.emailCampaign.length
        ? rawMkt.emailCampaign
        : ['Welcome Series: Onboarding & demo', 'Value Pitch: Product features', 'Special Offer: Conversion discount'],
      contentStrategy: rawMkt.contentStrategy || 'SEO technical blog posts, video tutorials, and industry case studies.',
      seoStrategy: rawMkt.seoStrategy || 'Targeting high-intent transactional long-tail keywords.',
      growthHacks: Array.isArray(rawMkt.growthHacks) && rawMkt.growthHacks.length
        ? rawMkt.growthHacks
        : ['Product Hunt launch', 'Referral reward program', 'Direct B2B outreach'],
      launchPlan: rawMkt.launchPlan || '30-day waitlist push followed by public launch.',
      customerAcquisition: rawMkt.customerAcquisition || 'Inbound organic search, referral program, and direct sales outreach.',
      kpis: Array.isArray(rawMkt.kpis) && rawMkt.kpis.length ? rawMkt.kpis : ['Customer Acquisition Cost (CAC)', 'Monthly Recurring Revenue (MRR)', 'Active Users (MAU)'],
      timeline: rawMkt.timeline || 'Months 1-3: MVP Launch & Beta. Months 4-6: Growth & Scaling.',
    }
  }, [rawMkt, result])

  if (isGenerating) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-8 w-80 rounded-md animate-shimmer" />
        <div className="grid gap-4">
          {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
        </div>
      </div>
    )
  }

  if (error && !result) {
    return (
      <ErrorState
        title="Could not load marketing strategy"
        message={error}
        onRetry={generateKit}
      />
    )
  }

  if (!mkt) {
    return (
      <EmptyState
        icon={Megaphone}
        title="No Marketing Strategy Generated"
        description="Please generate a startup kit to view your marketing plan."
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
          <span className="text-slate-700">Marketing</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="text-amber-600" size={24} />
              Marketing & Customer Acquisition Strategy
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Multi-channel acquisition roadmap, social distribution, SEO strategy, growth hacks, and launch timeline.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(ROUTES.DASHBOARD)}>
              Dashboard
            </Button>
            <Button variant="outline" size="sm" icon={RefreshCw} loading={isGenerating} onClick={generateKit}>
              Regenerate
            </Button>
            <Button variant="primary" size="sm" icon={Download} onClick={() => {
              if (!result) { toast.error('No startup kit loaded to export.'); return }
              try { generateStartupKitPDF(result); toast.success('Marketing Strategy PDF downloaded!') }
              catch (err) { toast.error('Failed to generate PDF: ' + err.message) }
            }}>
              Export Strategy
            </Button>
          </div>
        </div>
      </div>

      {/* Target Audience & High Level Strategy */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Users size={18} className="text-blue-600" /> Target Audience Profile
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-slate-700 leading-relaxed">{mkt.targetAudience}</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Target size={18} className="text-emerald-600" /> Core Marketing Strategy
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-slate-700 leading-relaxed">{mkt.marketingStrategy}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Social Media, Email & Content */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Share2 size={18} className="text-indigo-600" /> Social Media Plan
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <ul className="space-y-2 text-xs text-slate-700">
              {mkt.socialMedia?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">• <span>{item}</span></li>
              ))}
            </ul>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Mail size={18} className="text-emerald-600" /> Email Campaign
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <ul className="space-y-2 text-xs text-slate-700">
              {mkt.emailCampaign?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">• <span>{item}</span></li>
              ))}
            </ul>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <FileText size={18} className="text-amber-600" /> Content Strategy
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-xs text-slate-700 leading-relaxed">{mkt.contentStrategy}</p>
          </Card.Body>
        </Card>
      </div>

      {/* SEO Strategy & Ad Ideas */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Search size={18} className="text-purple-600" /> SEO Strategy
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-slate-700 leading-relaxed">{mkt.seoStrategy}</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Zap size={18} className="text-amber-500" /> Growth Hacks
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <ul className="space-y-2 text-xs text-slate-700">
              {mkt.growthHacks?.map((gh, idx) => (
                <li key={idx} className="flex items-start gap-1.5">• <span>{gh}</span></li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      </div>

      {/* Launch Plan, Acquisition, KPIs, Timeline */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-50">
          <span className="text-xs font-semibold text-blue-600 uppercase flex items-center gap-1"><Rocket size={14} /> Launch Plan</span>
          <p className="text-xs text-slate-700 mt-2">{mkt.launchPlan}</p>
        </Card>

        <Card className="bg-slate-50">
          <span className="text-xs font-semibold text-emerald-600 uppercase flex items-center gap-1"><Users size={14} /> Acquisition Channels</span>
          <p className="text-xs text-slate-700 mt-2">{mkt.customerAcquisition}</p>
        </Card>

        <Card className="bg-slate-50">
          <span className="text-xs font-semibold text-purple-600 uppercase flex items-center gap-1"><BarChart2 size={14} /> Core KPIs</span>
          <ul className="space-y-1 text-xs text-slate-700 mt-2">
            {mkt.kpis?.map((k, i) => <li key={i}>• {k}</li>)}
          </ul>
        </Card>

        <Card className="bg-slate-50">
          <span className="text-xs font-semibold text-indigo-600 uppercase flex items-center gap-1"><Calendar size={14} /> Timeline</span>
          <p className="text-xs text-slate-700 mt-2">{mkt.timeline}</p>
        </Card>
      </div>
    </div>
  )
}
