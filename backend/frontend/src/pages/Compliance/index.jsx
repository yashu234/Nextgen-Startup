import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield, FileCheck, ArrowLeft, Download, RefreshCw, AlertCircle,
  FileText, Clock, DollarSign, CheckCircle2, Search, Filter,
  BarChart2, ChevronDown, ChevronRight
} from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { useToast } from '../../context/ToastContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'
import { getComplianceRequirements, getAllIndustries } from '../../utils/complianceEngine'
import { generateStartupKitPDF } from '../../utils/pdfGenerator'

// ─── Compliance Progress Bar ───────────────────────────────────────────────────
function ComplianceProgressBar({ items }) {
  const total = items.length
  const completed = items.filter((i) => i.status === 'Completed').length
  const inProgress = items.filter((i) => i.status === 'In Progress').length
  const pending = items.filter((i) => i.status === 'Pending').length
  const highPriority = items.filter((i) => i.priority === 'High').length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  let barColor = 'bg-red-500'
  if (pct >= 80) barColor = 'bg-emerald-500'
  else if (pct >= 50) barColor = 'bg-blue-500'
  else if (pct >= 25) barColor = 'bg-amber-400'

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={18} className="text-blue-600" />
          <span className="font-bold text-slate-900 text-sm">Compliance Completion Progress</span>
        </div>
        <span className="text-2xl font-black text-slate-900">{pct}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total</p>
          <p className="text-xl font-black text-slate-900">{total}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-2.5 border border-emerald-200">
          <p className="text-xs font-semibold text-emerald-600 uppercase">Completed</p>
          <p className="text-xl font-black text-emerald-700">{completed}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-200">
          <p className="text-xs font-semibold text-blue-600 uppercase">In Progress</p>
          <p className="text-xl font-black text-blue-700">{inProgress}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-2.5 border border-red-200">
          <p className="text-xs font-semibold text-red-600 uppercase">High Priority</p>
          <p className="text-xl font-black text-red-700">{highPriority}</p>
        </div>
      </div>

      {pct === 100 && (
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-sm font-semibold">
          <CheckCircle2 size={16} /> 🎉 All registrations marked complete! You're legally ready to launch.
        </div>
      )}
    </div>
  )
}

export default function Compliance() {
  const { result, generateKit, isGenerating, error } = useStartup()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [industryOverride, setIndustryOverride] = useState('')

  const allIndustries = getAllIndustries()

  // Generate dynamic requirements based on startup industry / idea if kit exists
  const dynamicEngineData = useMemo(() => {
    const industry = industryOverride || result?._industry || result?.industry
    const idea = result?._idea || result?.idea || result?.branding?.name
    const businessType = result?._businessType || result?.businessType
    if (!industry && !idea) return null
    return getComplianceRequirements(industry, idea, businessType)
  }, [result, industryOverride])

  // If industry override is set, always use the dynamic engine data for that industry
  const activeCompliance = useMemo(() => {
    if (industryOverride && dynamicEngineData) return dynamicEngineData
    return result?.compliance || dynamicEngineData
  }, [result, dynamicEngineData, industryOverride])

  // Combined checklist items with fallback schema handling
  const [items, setItems] = useState(() => {
    const rawList = activeCompliance?.checklist || activeCompliance?.registrations || dynamicEngineData?.checklist || []
    return rawList.map((r, idx) => {
      if (typeof r === 'string') {
        return {
          id: `item_${idx}`,
          title: r,
          reason: 'Statutory compliance requirement for company setup.',
          requiredDocs: ['PAN Card', 'Aadhaar Card', 'Address Proof'],
          estimatedFee: '₹0 - ₹1,500',
          processingTime: '7 - 14 Days',
          priority: 'Medium',
          status: 'Pending',
        }
      }
      return {
        id: r.id || `item_${idx}`,
        title: r.title || r.item || 'Registration',
        reason: r.reason || 'Statutory legal requirement.',
        requiredDocs: r.requiredDocs || ['PAN Card', 'Aadhaar Card', 'Address Proof'],
        estimatedFee: r.estimatedFee || r.fee || '₹0',
        processingTime: r.processingTime || r.time || '3-7 Days',
        priority: r.priority || 'Medium',
        status: r.status || 'Pending',
      }
    })
  })

  // When industry override changes, reload checklist items
  const refreshedItems = useMemo(() => {
    if (!activeCompliance) return []
    const rawList = activeCompliance.checklist || activeCompliance.registrations || []
    return rawList.map((r, idx) => {
      if (typeof r === 'string') {
        return {
          id: `item_${idx}`,
          title: r,
          reason: 'Statutory compliance requirement.',
          requiredDocs: ['PAN Card', 'Aadhaar Card', 'Address Proof'],
          estimatedFee: '₹0 - ₹1,500',
          processingTime: '7 - 14 Days',
          priority: 'Medium',
          status: 'Pending',
        }
      }
      return {
        id: r.id || `item_${idx}`,
        title: r.title || r.item || 'Registration',
        reason: r.reason || 'Statutory legal requirement.',
        requiredDocs: r.requiredDocs || ['PAN Card', 'Aadhaar Card', 'Address Proof'],
        estimatedFee: r.estimatedFee || r.fee || '₹0',
        processingTime: r.processingTime || r.time || '3-7 Days',
        priority: r.priority || 'Medium',
        status: r.status || 'Pending',
      }
    })
  }, [activeCompliance])

  // Keep a mutable copy of the items for status toggling
  const [localItems, setLocalItems] = useState(refreshedItems)

  // When industry changes, reset to refreshed items
  useMemo(() => {
    setLocalItems(refreshedItems)
  }, [refreshedItems])

  const displayItems = localItems.length > 0 ? localItems : items

  // Cycle status tag between Pending → In Progress → Completed
  function toggleItemStatus(id) {
    const statuses = ['Pending', 'In Progress', 'Completed']
    setLocalItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextIdx = (statuses.indexOf(item.status) + 1) % statuses.length
          return { ...item, status: statuses[nextIdx] }
        }
        return item
      })
    )
    toast.info('Registration status updated')
  }

  // Handle industry override change
  function handleIndustryOverride(key) {
    setIndustryOverride(key)
    if (key) {
      toast.info(`Switched compliance view to: ${allIndustries.find((i) => i.key === key)?.label || key}`)
    }
  }

  // PDF Export
  function handleExportPDF() {
    try {
      generateStartupKitPDF(result || { compliance: { checklist: displayItems }, _idea: 'Compliance Checklist' })
      toast.success('Compliance roadmap exported as PDF!')
    } catch (err) {
      toast.error('Failed to export PDF: ' + err.message)
    }
  }

  // Filtered registrations
  const filteredItems = useMemo(() => {
    return displayItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPriority = filterPriority === 'All' || item.priority === filterPriority
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus
      return matchesSearch && matchesPriority && matchesStatus
    })
  }, [displayItems, searchTerm, filterPriority, filterStatus])

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
        title="Could not load compliance checklist"
        message={error}
        onRetry={generateKit}
      />
    )
  }

  if (!result && displayItems.length === 0) {
    return (
      <EmptyState
        icon={Shield}
        title="No Compliance Roadmap Generated"
        description="Please generate a startup kit to view your personalized government compliance checklist."
        actionLabel="Generate Startup Kit"
        action={() => navigate(ROUTES.NEW)}
      />
    )
  }

  const steps = activeCompliance?.registrationSteps || dynamicEngineData?.registrationSteps || []
  const licenses = activeCompliance?.licenses || dynamicEngineData?.licenses || []
  const legalDocs = activeCompliance?.legalDocs || dynamicEngineData?.legalDocs || []
  const detectedIndustry = activeCompliance?.detectedIndustry || dynamicEngineData?.detectedIndustry

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
          <Link to={ROUTES.DASHBOARD} className="hover:text-slate-600 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-700">Compliance</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="text-red-600" size={24} />
              Module 2 — Government & Statutory Compliance Engine
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Automated checklist of required registrations (GST, FSSAI, MSME, Startup India), reasons, fees, and docs.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(ROUTES.DASHBOARD)}>
              Dashboard
            </Button>
            <Button variant="outline" size="sm" icon={RefreshCw} loading={isGenerating} onClick={generateKit}>
              Regenerate
            </Button>
            <Button variant="primary" size="sm" icon={Download} onClick={handleExportPDF}>
              Export Compliance PDF
            </Button>
          </div>
        </div>
      </div>

      {/* ── COMPLIANCE PROGRESS BAR — NEW ────────────────────────────────────── */}
      <ComplianceProgressBar items={displayItems} />

      {/* ── INDUSTRY OVERRIDE SELECTOR — NEW ─────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <ChevronRight size={16} className="text-blue-600" />
            <span className="text-xs font-semibold text-slate-700">Industry Compliance View:</span>
            {detectedIndustry && !industryOverride && (
              <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                Auto-detected: {detectedIndustry}
              </span>
            )}
            {industryOverride && (
              <span className="text-[11px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-semibold">
                Override: {industryOverride}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleIndustryOverride('')}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                !industryOverride
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
              }`}
            >
              🤖 Auto-detect
            </button>
            {allIndustries.map((ind) => (
              <button
                key={ind.key}
                onClick={() => handleIndustryOverride(ind.key)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                  industryOverride === ind.key
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                }`}
              >
                {ind.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search registrations or documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter size={14} /> Filter Status:
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
          </select>
        </div>
      </div>

      {/* ── REQUIRED REGISTRATIONS CARDS LIST ────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center justify-between">
          <span>Required Government Registrations ({filteredItems.length})</span>
          <span className="text-xs text-slate-500 font-normal">Click status pill to cycle completion</span>
        </h2>

        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:border-blue-300 transition-colors">
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <FileCheck size={20} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      {item.title}
                      {item.priority === 'High' && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                          Mandatory / High
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => toggleItemStatus(item.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    item.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : item.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  <CheckCircle2 size={14} />
                  {item.status}
                </button>
              </div>

              {/* Reason / Why Needed */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  Why it is needed:
                </p>
                <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {item.reason}
                </p>
              </div>

              {/* Required Documents */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                  <FileText size={13} /> Required Documents:
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.requiredDocs.map((doc, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs"
                    >
                      📄 {doc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fee & Timeline Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <DollarSign size={14} className="text-emerald-600" />
                  <span>Estimated Fee: </span>
                  <span className="text-slate-900">{item.estimatedFee}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-blue-600" />
                  <span>Processing Time: </span>
                  <span className="text-slate-900">{item.processingTime}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── STEP-BY-STEP REGISTRATION ROADMAP ────────────────────────────────── */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <FileCheck size={18} className="text-blue-600" /> Statutory Business Setup Roadmap
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <ol className="space-y-3 text-sm text-slate-700">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="pt-0.5 font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </Card.Body>
      </Card>

      {/* ── PERMITS & LEGAL CONTRACTS ────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>Permits & Municipal Licenses</Card.Title>
          </Card.Header>
          <Card.Body>
            <ul className="space-y-2 text-sm text-slate-700">
              {licenses.map((lic, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{lic}</span>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" /> Mandatory Legal Contracts
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <ul className="space-y-2 text-sm text-slate-700">
              {legalDocs.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
