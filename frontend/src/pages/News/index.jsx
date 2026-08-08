import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Newspaper, Search, Filter, Bookmark, CheckCircle2, Share2, Download,
  TrendingUp, DollarSign, Building2, ShieldAlert, Sparkles, ExternalLink, Mail, Clock
} from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { useToast } from '../../context/ToastContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { NEWS_INTELLIGENCE_DATA } from '../../data/mockModuleData'
import { generateStartupKitPDF } from '../../utils/pdfGenerator'

export default function NewsIntelligence() {
  const { result } = useStartup()
  const { toast } = useToast()
  const activeIndustry = result?.formData?.industry || 'All'

  const [activeTab, setActiveTab] = useState('all') // 'all', 'trends', 'funding', 'competitors', 'regulations', 'saved', 'newsletter'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState(activeIndustry)
  const [selectedImpact, setSelectedImpact] = useState('All')

  // Saved/Bookmarked news state
  const [savedNewsIds, setSavedNewsIds] = useState([1])
  const [readNewsIds, setReadNewsIds] = useState([2])
  const [isGeneratingNewsletter, setIsGeneratingNewsletter] = useState(false)
  const [newsletterGenerated, setNewsletterGenerated] = useState(false)

  const data = NEWS_INTELLIGENCE_DATA

  // Filtered trends
  const filteredTrends = useMemo(() => {
    return data.trends.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesIndustry = selectedIndustry === 'All' || item.industry.includes(selectedIndustry)
      const matchesImpact = selectedImpact === 'All' || item.impact === selectedImpact
      return matchesSearch && matchesIndustry && matchesImpact
    })
  }, [data.trends, searchQuery, selectedIndustry, selectedImpact])

  // Filtered funding
  const filteredFunding = useMemo(() => {
    return data.fundingAnnouncements.filter((item) => {
      const matchesSearch = item.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.investors.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesIndustry = selectedIndustry === 'All' || item.industry.includes(selectedIndustry)
      return matchesSearch && matchesIndustry
    })
  }, [data.fundingAnnouncements, searchQuery, selectedIndustry])

  function toggleSave(id) {
    setSavedNewsIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function toggleRead(id) {
    setReadNewsIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function handleShare(title) {
    if (navigator.share) {
      navigator.share({ title: title, url: window.location.href }).catch(() => {})
    } else {
      alert(`Copied link to: "${title}"`)
    }
  }

  function handleGenerateNewsletter() {
    setIsGeneratingNewsletter(true)
    setTimeout(() => {
      setIsGeneratingNewsletter(false)
      setNewsletterGenerated(true)
    }, 1200)
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-700">AI News Intelligence</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Newspaper className="text-blue-600" size={24} />
              AI News & Business Intelligence
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Curated industry trends, funding signals, competitor updates, and regulatory insights tailored for founders.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Mail}
              onClick={() => setActiveTab('newsletter')}
            >
              Weekly Digest
            </Button>
            <Button variant="primary" size="sm" icon={Download} onClick={() => {
              if (!result) { toast.error('No startup kit loaded to export.'); return }
              try { generateStartupKitPDF(result); toast.success('Startup Kit PDF downloaded!') }
              catch (err) { toast.error('Failed to generate PDF: ' + err.message) }
            }}>
              Export Intelligence
            </Button>
          </div>
        </div>
      </div>

      {/* AI Business Insight Digest Card */}
      <Card className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border-none shadow-xl">
        <Card.Header className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <Card.Title className="text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} /> AI Market Sentiment Digest
            </Card.Title>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {data.insights.sentiment}
            </span>
          </div>
        </Card.Header>
        <Card.Body className="grid sm:grid-cols-3 gap-6 pt-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Top Opportunity</p>
            <p className="text-sm text-slate-200 mt-1 font-medium">{data.insights.opportunity}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">Key Threat / Risk</p>
            <p className="text-sm text-slate-200 mt-1 font-medium">{data.insights.threat}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Recommended Founder Action</p>
            <p className="text-sm text-slate-200 mt-1 font-medium">{data.insights.recommendation}</p>
          </div>
        </Card.Body>
      </Card>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search news, funding, competitors..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 shrink-0">
            <Filter size={14} /> Filter:
          </div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Industries</option>
            <option value="Artificial Intelligence">AI & ML</option>
            <option value="FinTech">FinTech</option>
            <option value="SaaS">SaaS</option>
            <option value="RegTech">RegTech</option>
          </select>

          <select
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Impact Levels</option>
            <option value="High">High Impact</option>
            <option value="Medium">Medium Impact</option>
            <option value="Low">Low Impact</option>
          </select>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Intel', icon: Newspaper },
          { id: 'trends', label: 'Industry Trends', icon: TrendingUp },
          { id: 'funding', label: 'Funding Radar', icon: DollarSign },
          { id: 'competitors', label: 'Competitor News', icon: Building2 },
          { id: 'regulations', label: 'Regulations', icon: ShieldAlert },
          { id: 'saved', label: `Saved (${savedNewsIds.length})`, icon: Bookmark },
          { id: 'newsletter', label: 'Weekly Digest', icon: Mail },
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

      {/* TAB CONTENT 1: ALL / INDUSTRY TRENDS */}
      {(activeTab === 'all' || activeTab === 'trends') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} /> Latest Industry Trends
            </h2>
            <span className="text-xs text-slate-400 font-medium">Updated 2 hours ago</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {filteredTrends.map((trend) => {
              const isSaved = savedNewsIds.includes(trend.id)
              const isRead = readNewsIds.includes(trend.id)

              return (
                <Card key={trend.id} className={`flex flex-col justify-between ${isRead ? 'opacity-85 bg-slate-50/50' : 'bg-white'}`}>
                  <Card.Header className="pb-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {trend.industry}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          trend.impact === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {trend.impact} Impact
                      </span>
                    </div>
                    <Card.Title className="text-base font-bold text-slate-900 leading-snug">
                      {trend.title}
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="space-y-3 pt-0">
                    <p className="text-xs text-slate-600 leading-relaxed">{trend.summary}</p>

                    <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200/60 text-xs">
                      <span className="font-bold text-amber-900">Why It Matters to You: </span>
                      <span className="text-amber-800">{trend.whyItMatters}</span>
                    </div>
                  </Card.Body>
                  <Card.Footer className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock size={12} /> {trend.publishedDate}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleRead(trend.id)}
                        className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${isRead ? 'text-emerald-600' : 'text-slate-400'}`}
                        title={isRead ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        onClick={() => toggleSave(trend.id)}
                        className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${isSaved ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`}
                        title={isSaved ? 'Remove Bookmark' : 'Bookmark'}
                      >
                        <Bookmark size={16} />
                      </button>
                      <button
                        onClick={() => handleShare(trend.title)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                        title="Share"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </Card.Footer>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: FUNDING ANNOUNCEMENTS */}
      {(activeTab === 'all' || activeTab === 'funding') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="text-emerald-600" size={20} /> Funding & Investment Radar
            </h2>
            <span className="text-xs text-slate-400 font-medium">Recent Deals</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {filteredFunding.map((funding) => (
              <Card key={funding.id} className="border-l-4 border-l-emerald-500">
                <Card.Header className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {funding.round} Round
                    </span>
                    <span className="text-xs text-slate-400">{funding.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{funding.startupName}</h3>
                  <p className="text-xl font-extrabold text-emerald-600">{funding.amount}</p>
                </Card.Header>
                <Card.Body className="text-xs text-slate-600 space-y-2 pt-0">
                  <p>{funding.description}</p>
                  <p className="text-slate-500">
                    <span className="font-semibold text-slate-700">Investors: </span>
                    {funding.investors}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: COMPETITOR NEWS */}
      {(activeTab === 'all' || activeTab === 'competitors') && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="text-purple-600" size={20} /> Competitor Movements & AI Analysis
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {data.competitorNews.map((comp) => (
              <Card key={comp.id}>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {comp.company} • {comp.updateType}
                    </span>
                    <span className="text-xs text-slate-400">{comp.date}</span>
                  </div>
                  <Card.Title className="text-base mt-2">{comp.title}</Card.Title>
                </Card.Header>
                <Card.Body className="space-y-3 pt-0">
                  <p className="text-xs text-slate-600">{comp.summary}</p>
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs">
                    <span className="font-bold text-purple-900">AI Competitive Strategy Impact: </span>
                    <span className="text-purple-800">{comp.impactOnStartup}</span>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: REGULATIONS */}
      {(activeTab === 'all' || activeTab === 'regulations') && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="text-rose-600" size={20} /> Regulatory & Legal Compliance Updates
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {data.regulationUpdates.map((reg) => (
              <Card key={reg.id} className="border-l-4 border-l-rose-500">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded uppercase">
                      Impact: {reg.impactLevel}
                    </span>
                    <span className="text-xs text-slate-400">Effective: {reg.effectiveDate}</span>
                  </div>
                  <Card.Title className="text-base mt-2">{reg.title}</Card.Title>
                </Card.Header>
                <Card.Body className="space-y-3 pt-0">
                  <p className="text-xs text-slate-600">{reg.summary}</p>
                  <a
                    href={reg.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Official Portal Gazette <ExternalLink size={13} />
                  </a>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: SAVED / BOOKMARKS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Your Saved Bookmarks</h2>
          {savedNewsIds.length === 0 ? (
            <Card className="text-center p-8 text-slate-500 text-sm">
              No bookmarked news items yet. Click the bookmark icon on any article to save it here.
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {data.trends
                .filter((item) => savedNewsIds.includes(item.id))
                .map((item) => (
                  <Card key={item.id}>
                    <Card.Header>
                      <Card.Title className="text-base">{item.title}</Card.Title>
                    </Card.Header>
                    <Card.Body className="text-xs text-slate-600">
                      <p>{item.summary}</p>
                    </Card.Body>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 6: WEEKLY AI NEWSLETTER DIGEST */}
      {activeTab === 'newsletter' && (
        <Card className="max-w-3xl mx-auto">
          <Card.Header className="text-center pb-4 border-b border-slate-100">
            <Mail className="mx-auto text-blue-600 mb-2" size={32} />
            <Card.Title className="text-xl">Weekly AI Founder Intelligence Digest</Card.Title>
            <p className="text-xs text-slate-500 mt-1">
              Personalized weekly summary report curated for your startup category.
            </p>
          </Card.Header>
          <Card.Body className="space-y-6">
            {!newsletterGenerated ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-sm text-slate-600">
                  Click below to synthesize this week's industry trends, funding deals, and regulatory changes into a single executive digest.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  icon={Sparkles}
                  loading={isGeneratingNewsletter}
                  onClick={handleGenerateNewsletter}
                  className="mx-auto"
                >
                  Generate Weekly Executive Digest
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-400">
                    <span>Issue #34 • Week of August 2026</span>
                    <span className="text-emerald-400 font-semibold">Generated for Founders</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">This Week's Executive Briefing</h3>
                  <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                    <li>AI Agent Adoption accelerates in B2B SaaS workflows.</li>
                    <li>Tier-2 founders lead 45% of new MSME registrations in Q3.</li>
                    <li>CBIC clarifies quarterly GSTR-3B filings for small enterprises.</li>
                    <li>Seed round deals average ₹12.5 Cr in the FinTech space.</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" size="sm" icon={Download} onClick={() => {
                    if (!result) { toast.error('No startup kit loaded to export.'); return }
                    try { generateStartupKitPDF(result); toast.success('Startup Kit PDF downloaded!') }
                    catch (err) { toast.error('Failed to generate PDF: ' + err.message) }
                  }}>
                    Download PDF Digest
                  </Button>
                  <Button variant="primary" size="sm" icon={Share2} onClick={() => handleShare('Weekly Founder Digest')}>
                    Share Digest
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
