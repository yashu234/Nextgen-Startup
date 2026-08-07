import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Palette, Sparkles, Volume2, Type, ArrowLeft, Download, RefreshCw, Copy, Check, Heart, Smile } from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { useToast } from '../../context/ToastContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'

export default function Branding() {
  const { result, generateKit, isGenerating, error } = useStartup()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [copiedField, setCopiedField] = useState(null)
  const brand = result?.branding

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
        title="Could not load branding"
        message={error}
        onRetry={generateKit}
      />
    )
  }

  if (!brand) {
    return (
      <EmptyState
        icon={Palette}
        title="No Branding Generated"
        description="Please generate a startup kit to view your personalized brand identity."
        actionLabel="Generate Startup Kit"
        action={() => navigate(ROUTES.NEW)}
      />
    )
  }

  function handleCopy(text, label) {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2))
    setCopiedField(label)
    toast.success(`Copied ${label} to clipboard!`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Top Bar */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-700">Branding</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Palette className="text-purple-600" size={24} />
              Brand Identity System
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Visual brand tokens, color palettes, brand story, personality, and tone guidelines.
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
              Export Brand Kit
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Brand Identity Header */}
      <Card className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-blue-300 font-semibold">Suggested Brand Name</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">{brand.name}</h2>
            <p className="text-blue-100 text-lg italic mt-2">&ldquo;{brand.tagline}&rdquo;</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => handleCopy(`${brand.name} — ${brand.tagline}`, 'Brand Name')}
          >
            {copiedField === 'Brand Name' ? <Check size={14} /> : <Copy size={14} />}
            Copy Title
          </Button>
        </div>
      </Card>

      {/* Brand Story & Core Values */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="sm:col-span-2">
          <Card.Header>
            <Card.Title>Brand Story</Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-slate-700 leading-relaxed">{brand.brandStory}</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Core Values</Card.Title>
          </Card.Header>
          <Card.Body>
            <ul className="space-y-2 text-sm text-slate-700">
              {brand.coreValues?.map((val, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                  <span className="font-medium">{val}</span>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      </div>

      {/* Color Palette (Primary & Secondary) */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Palette size={18} className="text-purple-600" /> Color System (Primary & Secondary)
          </Card.Title>
        </Card.Header>
        <Card.Body className="space-y-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Primary Colors</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {brand.primaryColors?.map((c, i) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="h-20 w-full" style={{ backgroundColor: c.hex }} />
                  <div className="p-3 bg-white flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{c.name}</p>
                      <p className="text-xs font-mono text-slate-500">{c.hex}</p>
                    </div>
                    <button onClick={() => handleCopy(c.hex, c.name)} className="text-slate-400 hover:text-slate-700">
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Secondary & Neutral Colors</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {brand.secondaryColors?.map((c, i) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="h-20 w-full" style={{ backgroundColor: c.hex }} />
                  <div className="p-3 bg-white flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{c.name}</p>
                      <p className="text-xs font-mono text-slate-500">{c.hex}</p>
                    </div>
                    <button onClick={() => handleCopy(c.hex, c.name)} className="text-slate-400 hover:text-slate-700">
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Personality & Emotion */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Volume2 size={18} className="text-blue-600" /> Brand Voice
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-slate-700 leading-relaxed">{brand.brandVoice}</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Smile size={18} className="text-indigo-600" /> Brand Personality
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-slate-700 leading-relaxed">{brand.brandPersonality}</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Heart size={18} className="text-red-500" /> Target Emotion
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-slate-700 leading-relaxed">{brand.targetEmotion}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Typography & Logo Description */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Type size={18} className="text-blue-600" /> Typography Recommendations
            </Card.Title>
          </Card.Header>
          <Card.Body className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Headings</span>
              <p className="font-semibold text-slate-800">{brand.typography?.headingFont}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Body Copy</span>
              <p className="text-slate-700">{brand.typography?.bodyFont}</p>
            </div>
            <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
              {brand.typography?.recommendation}
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" /> Logo & Visual Prompt Description
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-slate-700 leading-relaxed">{brand.logoDescription}</p>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
