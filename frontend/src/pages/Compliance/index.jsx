import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield, FileCheck, ArrowLeft, Download, RefreshCw, AlertCircle, FileText,
  Search, Plus, Trash2, Edit, ExternalLink, CheckCircle, Clock, Sparkles, Filter,
  Award, Calendar, AlertTriangle
} from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Input from '../../components/Input'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'
import { COMPLIANCE_DATA } from '../../data/mockModuleData'

export default function Compliance() {
  const { result, generateKit, isGenerating, error } = useStartup()
  const navigate = useNavigate()

  // Active sub-tab: 'score', 'registrations', 'licenses', 'schemes', 'updates'
  const [activeTab, setActiveTab] = useState('score')

  // Search & Filter state for Registration & Schemes
  const [regSearch, setRegSearch] = useState('')
  const [regPriorityFilter, setRegPriorityFilter] = useState('All')

  const [schemeSearch, setSchemeSearch] = useState('')
  const [schemeCategoryFilter, setSchemeCategoryFilter] = useState('All')

  // 2. License Expiry Tracker State
  const [licenses, setLicenses] = useState(COMPLIANCE_DATA.initialLicenses)
  const [licenseViewMode, setLicenseViewMode] = useState('table') // 'table' or 'cards'
  const [licenseFilter, setLicenseFilter] = useState('All')

  // Add License Modal/Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newLicenseName, setNewLicenseName] = useState('')
  const [newIssueDate, setNewIssueDate] = useState('')
  const [newExpiryDate, setNewExpiryDate] = useState('')

  // Dynamic Registrations from AI kit or mock fallback
  const registrationsList = useMemo(() => {
    if (result?.compliance?.checklist?.length) {
      return result.compliance.checklist.map((item, idx) => ({
        id: item.id || `reg_${idx}`,
        name: item.title || item.name,
        reason: item.reason || 'Required statutory registration',
        docs: item.requiredDocs || ['PAN Card', 'Address Proof'],
        govtFee: item.estimatedFee || 'Free',
        time: item.processingTime || '3-7 Days',
        priority: item.priority || 'High',
        portal: 'Official Govt Portal',
        category: 'Mandatory',
      }))
    }
    return COMPLIANCE_DATA.registrations
  }, [result])

  // Filtered Registrations
  const filteredRegistrations = useMemo(() => {
    return registrationsList.filter((reg) => {
      const matchesSearch = (reg.name || '').toLowerCase().includes(regSearch.toLowerCase()) ||
        (reg.reason || '').toLowerCase().includes(regSearch.toLowerCase())
      const matchesPriority = regPriorityFilter === 'All' || reg.priority === regPriorityFilter
      return matchesSearch && matchesPriority
    })
  }, [registrationsList, regSearch, regPriorityFilter])

  // Filtered Schemes
  const filteredSchemes = useMemo(() => {
    return COMPLIANCE_DATA.schemes.filter((sch) => {
      const matchesSearch = sch.name.toLowerCase().includes(schemeSearch.toLowerCase()) ||
        sch.description.toLowerCase().includes(schemeSearch.toLowerCase())
      const matchesCategory = schemeCategoryFilter === 'All' || sch.category === schemeCategoryFilter
      return matchesSearch && matchesCategory
    })
  }, [schemeSearch, schemeCategoryFilter])

  // Filtered Licenses
  const filteredLicenses = useMemo(() => {
    return licenses.filter((lic) => {
      if (licenseFilter === 'All') return true
      return lic.status === licenseFilter
    })
  }, [licenses, licenseFilter])

  // License Handlers
  function handleAddLicense(e) {
    e.preventDefault()
    if (!newLicenseName || !newExpiryDate) return

    const today = new Date()
    const expiry = new Date(newExpiryDate)
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))

    let status = 'Active'
    if (diffDays <= 0) status = 'Expired'
    else if (diffDays <= 30) status = 'Expiring Soon'

    const newLic = {
      id: Date.now(),
      name: newLicenseName,
      issueDate: newIssueDate || new Date().toISOString().split('T')[0],
      expiryDate: newExpiryDate,
      status: status,
    }

    setLicenses([newLic, ...licenses])
    setNewLicenseName('')
    setNewIssueDate('')
    setNewExpiryDate('')
    setIsAddModalOpen(false)
  }

  function handleDeleteLicense(id) {
    setLicenses(licenses.filter((lic) => lic.id !== id))
  }

  function getDaysRemaining(expiryDateStr) {
    const today = new Date()
    const expiry = new Date(expiryDateStr)
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    return diffDays
  }

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

  return (
    <div className="space-y-6 animate-fade-in pb-12">
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
              <Shield className="text-rose-600" size={24} />
              Startup Legal & Compliance Management Portal
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Automated business registrations, license expiry tracking, government schemes, and compliance health score.
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
              Export Audit Report
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'score', label: 'Compliance Health Score', icon: Award },
          { id: 'registrations', label: '1. Recommended Registrations', icon: FileCheck },
          { id: 'licenses', label: '2. License Expiry Tracker', icon: Calendar },
          { id: 'schemes', label: '3. Government Scheme Finder', icon: Sparkles },
          { id: 'updates', label: '4. AI Regulation Updates', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg transition-all shrink-0 ${
                isActive
                  ? 'border-b-2 border-rose-600 text-rose-700 bg-rose-50/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* TAB 1: COMPLIANCE HEALTH SCORE */}
      {activeTab === 'score' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Score Wheel Card */}
            <Card className="bg-gradient-to-br from-slate-900 to-rose-950 text-white text-center flex flex-col justify-center items-center p-8">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-widest">Compliance Health Score</span>
              <div className="relative my-6 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-8 border-rose-500/20 flex items-center justify-center bg-white/5 shadow-2xl">
                  <span className="text-5xl font-black text-white">{COMPLIANCE_DATA.healthScore.overall}</span>
                  <span className="text-xs text-rose-400 font-bold self-end mb-4">/100</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                🟢 Audit Status: Highly Compliant
              </span>
            </Card>

            {/* Score Breakdown Progress Bars */}
            <Card className="md:col-span-2">
              <Card.Header>
                <Card.Title>Compliance Category Breakdown</Card.Title>
              </Card.Header>
              <Card.Body className="space-y-4">
                {COMPLIANCE_DATA.healthScore.breakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{item.category}</span>
                      <span className="text-slate-900 font-bold">{item.score}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.score >= 90 ? 'bg-emerald-500' : item.score >= 75 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </div>

          {/* AI Score Recommendations */}
          <Card className="bg-amber-50/60 border-amber-200">
            <Card.Header>
              <Card.Title className="flex items-center gap-2 text-amber-900">
                <Sparkles size={18} className="text-amber-600" /> AI Score Improvement Recommendations
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <ul className="space-y-2 text-xs text-amber-900 font-medium">
                {COMPLIANCE_DATA.healthScore.aiRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* TAB 2: RECOMMENDED REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-80">
              <Input
                placeholder="Search GST, MSME, Trademark..."
                icon={Search}
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filter Priority:</span>
              <select
                value={regPriorityFilter}
                onChange={(e) => setRegPriorityFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
              >
                <option value="All">All Priorities</option>
                <option value="Required">Required</option>
                <option value="Recommended">Recommended</option>
                <option value="Optional">Optional</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredRegistrations.map((reg) => (
              <Card key={reg.id} className="flex flex-col justify-between">
                <Card.Header className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {reg.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                        reg.priority === 'Required'
                          ? 'bg-rose-100 text-rose-800'
                          : reg.priority === 'Recommended'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {reg.priority}
                    </span>
                  </div>
                  <Card.Title className="text-lg font-bold text-slate-900 mt-2">{reg.name}</Card.Title>
                </Card.Header>

                <Card.Body className="space-y-3 text-xs text-slate-700 pt-3">
                  <div>
                    <span className="font-bold text-slate-900">Why It Is Required: </span>
                    <span>{reg.reason}</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Required Documents:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {reg.documents.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100 font-medium text-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Government Fee</span>
                      <span>{reg.govFee}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Processing SLA</span>
                      <span>{reg.processingTime}</span>
                    </div>
                  </div>
                </Card.Body>

                <Card.Footer className="border-t border-slate-100 pt-3">
                  <a
                    href={reg.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    Official Portal Website <ExternalLink size={14} />
                  </a>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LICENSE EXPIRY TRACKER */}
      {activeTab === 'licenses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <select
                value={licenseFilter}
                onChange={(e) => setLicenseFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Active">🟢 Active</option>
                <option value="Expiring Soon">🟡 Expiring Soon</option>
                <option value="Expired">🔴 Expired</option>
              </select>

              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setLicenseViewMode('table')}
                  className={`px-3 py-1 text-xs font-bold rounded ${licenseViewMode === 'table' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                >
                  Table View
                </button>
                <button
                  onClick={() => setLicenseViewMode('cards')}
                  className={`px-3 py-1 text-xs font-bold rounded ${licenseViewMode === 'cards' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                >
                  Card View
                </button>
              </div>
            </div>

            <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
              Add New License
            </Button>
          </div>

          {/* Add License Inline Form / Card */}
          {isAddModalOpen && (
            <Card className="border-2 border-blue-500 bg-blue-50/20">
              <Card.Header>
                <Card.Title className="text-sm">Register New Business License</Card.Title>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleAddLicense} className="grid sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">License Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Municipal Trade License"
                      value={newLicenseName}
                      onChange={(e) => setNewLicenseName(e.target.value)}
                      required
                      className="w-full mt-1 p-2 text-xs border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Issue Date</label>
                    <input
                      type="date"
                      value={newIssueDate}
                      onChange={(e) => setNewIssueDate(e.target.value)}
                      className="w-full mt-1 p-2 text-xs border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Expiry Date</label>
                    <input
                      type="date"
                      value={newExpiryDate}
                      onChange={(e) => setNewExpiryDate(e.target.value)}
                      required
                      className="w-full mt-1 p-2 text-xs border rounded bg-white"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button type="submit" variant="primary" size="sm">Save License</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          )}

          {/* License Table View */}
          {licenseViewMode === 'table' ? (
            <Card>
              <Card.Body className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase">
                    <tr>
                      <th className="p-3.5">License Name</th>
                      <th className="p-3.5">Issue Date</th>
                      <th className="p-3.5">Expiry Date</th>
                      <th className="p-3.5">Days Remaining</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLicenses.map((lic) => {
                      const days = getDaysRemaining(lic.expiryDate)
                      return (
                        <tr key={lic.id} className="hover:bg-slate-50/50">
                          <td className="p-3.5 font-bold text-slate-900">{lic.name}</td>
                          <td className="p-3.5">{lic.issueDate}</td>
                          <td className="p-3.5">{lic.expiryDate}</td>
                          <td className="p-3.5 font-semibold">
                            {days < 0 ? '0 (Expired)' : `${days} Days`}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                                lic.status === 'Active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : lic.status === 'Expiring Soon'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {lic.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleDeleteLicense(lic.id)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                              title="Delete License"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          ) : (
            /* License Card View */
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredLicenses.map((lic) => {
                const days = getDaysRemaining(lic.expiryDate)
                return (
                  <Card key={lic.id}>
                    <Card.Header className="pb-2">
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lic.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lic.status === 'Expiring Soon'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {lic.status}
                        </span>
                        <button onClick={() => handleDeleteLicense(lic.id)} className="text-slate-400 hover:text-rose-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <Card.Title className="text-base mt-2">{lic.name}</Card.Title>
                    </Card.Header>
                    <Card.Body className="text-xs text-slate-600 space-y-1 pt-0">
                      <p><span className="font-semibold text-slate-700">Expiry: </span>{lic.expiryDate}</p>
                      <p><span className="font-semibold text-slate-700">Days Left: </span>{days < 0 ? 'Expired' : days}</p>
                    </Card.Body>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GOVERNMENT SCHEME FINDER */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-80">
              <Input
                placeholder="Search Startup India, MSME, Grants..."
                icon={Search}
                value={schemeSearch}
                onChange={(e) => setSchemeSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Scheme Category:</span>
              <select
                value={schemeCategoryFilter}
                onChange={(e) => setSchemeCategoryFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium"
              >
                <option value="All">All Categories</option>
                <option value="Grants & Equity">Grants & Equity</option>
                <option value="Bank Loans">Bank Loans</option>
                <option value="Venture Capital">Venture Capital</option>
                <option value="Women Founders">Women Founders</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredSchemes.map((sch) => (
              <Card key={sch.id} className="flex flex-col justify-between">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {sch.category}
                    </span>
                  </div>
                  <Card.Title className="text-lg font-bold text-slate-900 mt-2">{sch.name}</Card.Title>
                </Card.Header>

                <Card.Body className="space-y-3 text-xs text-slate-700 pt-0">
                  <p>{sch.description}</p>
                  <div className="p-3 bg-slate-50 rounded-lg border space-y-1">
                    <p><span className="font-bold text-slate-900">Eligibility: </span>{sch.eligibility}</p>
                    <p><span className="font-bold text-emerald-700">Key Benefits: </span>{sch.benefits}</p>
                  </div>
                </Card.Body>

                <Card.Footer className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <a
                    href={sch.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    Official Portal <ExternalLink size={14} />
                  </a>
                  <Button variant="primary" size="sm" onClick={() => window.open(sch.website, '_blank')}>
                    Apply Now
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AI REGULATION UPDATES */}
      {activeTab === 'updates' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Latest Regulatory & Tax Policy Updates</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {COMPLIANCE_DATA.regulationUpdates.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-rose-500">
                <Card.Header>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="font-bold text-rose-600">{item.category}</span>
                    <span>{item.effectiveDate}</span>
                  </div>
                  <Card.Title className="text-base mt-2">{item.title}</Card.Title>
                </Card.Header>
                <Card.Body className="text-xs text-slate-600 pt-0">
                  <p>{item.summary}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
