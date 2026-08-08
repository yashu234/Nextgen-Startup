import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, ArrowLeft, Copy, Check, Download, RefreshCw, Star, CheckCircle, Mail } from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { useToast } from '../../context/ToastContext'
import { ROUTES } from '../../constants/routes'
// Card component not required in this preview page
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'
import { generateStartupKitPDF } from '../../utils/pdfGenerator'

export default function WebsitePreview() {
  const { result, generateKit, isGenerating, error } = useStartup()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [copiedSection, setCopiedSection] = useState(null)
  const site = result?.websiteContent

  if (isGenerating) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-8 w-80 rounded-md animate-shimmer" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (error && !result) {
    return (
      <ErrorState
        title="Could not load website copy"
        message={error}
        onRetry={generateKit}
      />
    )
  }

  if (!site) {
    return (
      <EmptyState
        icon={Globe}
        title="No Website Content Generated"
        description="Please generate a startup kit to view your landing page copy."
        actionLabel="Generate Startup Kit"
        action={() => navigate(ROUTES.NEW)}
      />
    )
  }

  function handleCopy(text, sectionLabel) {
    const copyText = typeof text === 'string' ? text : JSON.stringify(text, null, 2)
    navigator.clipboard.writeText(copyText)
    setCopiedSection(sectionLabel)
    toast.success(`Copied ${sectionLabel} copy to clipboard!`)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Top Bar */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-700">Website Content</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Globe className="text-emerald-600" size={24} />
              Website Copy & Landing Page Content
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Complete landing page copy sections ready to copy into Webflow, Framer, WordPress, or React.
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
              try { generateStartupKitPDF(result); toast.success('Startup Kit PDF downloaded!') }
              catch (err) { toast.error('Failed to generate PDF: ' + err.message) }
            }}>
              Export Copy
            </Button>
          </div>
        </div>
      </div>

      {/* Simulated Browser Preview Frame */}
      <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-md">
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="mx-auto bg-white text-xs font-mono text-slate-400 px-4 py-1 rounded-md border border-slate-200 w-full max-w-sm text-center">
            https://your-startup-landing.com
          </div>
        </div>

        {/* Hero Section */}
        <div className="p-8 sm:p-12 text-center bg-gradient-to-b from-blue-50/50 to-white relative group">
          <button
            onClick={() => handleCopy(site.hero, 'Hero Section')}
            className="absolute top-4 right-4 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
          >
            {copiedSection === 'Hero Section' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            Copy Hero
          </button>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight max-w-2xl mx-auto">
            {site.hero?.title}
          </h2>
          <p className="text-slate-600 mt-4 max-w-xl mx-auto text-base">
            {site.hero?.subtitle}
          </p>
          <div className="mt-6">
            <button className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition-colors">
              {site.hero?.ctaText}
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 text-center relative">
          <button
            onClick={() => handleCopy(site.about, 'About Section')}
            className="absolute top-4 right-4 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
          >
            {copiedSection === 'About Section' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            Copy About
          </button>
          <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">About Our Solution</h3>
          <p className="text-slate-700 mt-2 max-w-2xl mx-auto text-sm leading-relaxed">
            {site.about}
          </p>
        </div>

        {/* Services & Features */}
        <div className="p-8 border-t border-slate-100">
          <h3 className="text-center text-lg font-bold text-slate-900 mb-6">Core Features & Services</h3>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {site.services?.map((svc, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white">
                <CheckCircle size={18} className="text-emerald-500 mb-2" />
                <h4 className="font-semibold text-slate-800 text-sm">{svc.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 border-t border-slate-100 bg-blue-600 text-white text-center relative">
          <h3 className="text-2xl font-bold">{site.cta?.heading || "Ready to get started?"}</h3>
          <p className="text-blue-100 text-sm mt-2 max-w-md mx-auto">{site.cta?.subheading || "Join today and build your startup faster."}</p>
          <button className="mt-4 bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg text-sm hover:bg-blue-50">
            {site.cta?.buttonLabel || "Get Started Free"}
          </button>
        </div>

        {/* Testimonials */}
        {site.testimonials?.length > 0 && (
          <div className="p-8 border-t border-slate-100 bg-slate-50">
            <div className="max-w-md mx-auto text-center">
              <div className="flex justify-center text-amber-400 gap-1 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-sm italic text-slate-700">&ldquo;{site.testimonials[0].text}&rdquo;</p>
              <p className="text-xs font-semibold text-slate-900 mt-2">{site.testimonials[0].name}</p>
              <p className="text-xs text-slate-400">{site.testimonials[0].role}</p>
            </div>
          </div>
        )}

        {/* Contact & Footer Content */}
        <div className="p-6 border-t border-slate-200 bg-slate-900 text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Mail size={12} /> {site.contact?.email || 'contact@startup.com'}</span>
          </div>
          <p>{site.footerContent}</p>
        </div>
      </div>
    </div>
  )
}
