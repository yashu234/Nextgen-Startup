import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, FileCheck, ArrowLeft, Download, RefreshCw, AlertCircle, FileText } from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'

function ComplianceChecklist({ checklist, onToggle }) {
  const [items, setItems] = useState(() => checklist || [])

  function cycleStatus(index) {
    const statuses = ['Pending', 'Completed', 'Recommended']
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const nextIdx = (statuses.indexOf(item.status) + 1) % statuses.length
          return { ...item, status: statuses[nextIdx] }
        }
        return item
      })
    )
    onToggle?.()
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title className="flex items-center justify-between">
          <span>Interactive Legal & Compliance Checklist</span>
          <span className="text-xs text-slate-500 font-normal">Click status tag to cycle state</span>
        </Card.Title>
      </Card.Header>
      <Card.Body className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-slate-400" />
              <span className="text-sm text-slate-800 font-medium">{item.task}</span>
            </div>
            <button
              onClick={() => cycleStatus(idx)}
              className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                item.status === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : item.status === 'Pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {item.status}
            </button>
          </div>
        ))}
      </Card.Body>
    </Card>
  )
}

export default function Compliance() {
  const { result, generateKit, isGenerating, error } = useStartup()
  const navigate = useNavigate()

  const comp = result?.compliance

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

  if (!comp) {
    return (
      <EmptyState
        icon={Shield}
        title="No Compliance Checklist Generated"
        description="Please generate a startup kit to view your compliance roadmap."
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
          <span className="text-slate-700">Compliance</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="text-red-600" size={24} />
              Legal & Government Compliance Roadmap
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Business registration, licenses, tax requirements, GST/Trademark, and legal checklist.
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
              Export Checklist
            </Button>
          </div>
        </div>
      </div>

      {/* Registration Steps */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <FileCheck size={18} className="text-blue-600" /> Business Registration Steps
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <ol className="space-y-3 text-sm text-slate-700">
            {comp.registrationSteps?.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </Card.Body>
      </Card>

      {/* Government Registrations (GST, Trademark) */}
      <Card>
        <Card.Header>
          <Card.Title>Government & Tax Registrations (GST / Trademark)</Card.Title>
        </Card.Header>
        <Card.Body className="grid sm:grid-cols-3 gap-4">
          {comp.governmentRegistrations?.map((reg, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">{reg.title}</span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  reg.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : reg.status === 'Pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {reg.status}
              </span>
            </div>
          ))}
        </Card.Body>
      </Card>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Licenses */}
        <Card>
          <Card.Header>
            <Card.Title>Permits & Industry Licenses</Card.Title>
          </Card.Header>
          <Card.Body>
            <ul className="space-y-2 text-sm text-slate-700">
              {comp.licenses?.map((lic, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{lic}</span>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>

        {/* Legal Recommendations */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" /> Legal Recommendations
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-slate-700 leading-relaxed">{comp.legalRecommendations}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Interactive Legal Action Checklist with status tags */}
      <ComplianceChecklist key={result?._id || 'default'} checklist={comp.legalChecklist} />
    </div>
  )
}
