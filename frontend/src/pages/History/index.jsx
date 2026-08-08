import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { History as HistoryIcon, Trash2, FolderOpen, Download, RefreshCw, Eye, Loader } from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { useToast } from '../../context/ToastContext'
import historyService from '../../services/historyService'
import { ROUTES } from '../../constants/routes'
import { INDUSTRIES, BUSINESS_TYPES } from '../../constants'
import SearchBar from '../../components/SearchBar'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import { SkeletonCard } from '../../components/Loader'
import { parseApiError, formatRelativeTime } from '../../utils/formatters'
import ErrorState from '../../components/ErrorState'
import useAsync from '../../hooks/useAsync'
import { generateStartupKitPDF } from '../../utils/pdfGenerator'

export default function History() {
  const { setResult, generateKit } = useStartup()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedBusinessType, setSelectedBusinessType] = useState('')
  const [sortOption, setSortOption] = useState('newest')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // Delete modal state
  const [targetDeleteId, setTargetDeleteId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Download state — tracks which item ID is currently being downloaded
  const [downloadingId, setDownloadingId] = useState(null)

  const { isLoading: loading, data: historyItemsData, error: loadError, execute: loadHistory } = useAsync(historyService.getAll)

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const historyItems = useMemo(() => historyItemsData || [], [historyItemsData])

  async function handleView(id) {
    try {
      const item = await historyService.getById(id)
      setResult(item)
      toast.success('Loaded startup kit!')
      navigate(ROUTES.BUSINESS_PLAN)
    } catch (error) {
      toast.error(parseApiError(error))
    }
  }

  function confirmDelete(id) {
    setTargetDeleteId(id)
  }

  async function executeDelete() {
    if (!targetDeleteId) return
    setDeleteLoading(true)
    try {
      await historyService.remove(targetDeleteId)
      await loadHistory()
      toast.success('Startup project deleted.')
    } catch (error) {
      toast.error(parseApiError(error))
    } finally {
      setDeleteLoading(false)
      setTargetDeleteId(null)
    }
  }

  async function handleRegenerate(item) {
    toast.info('Regenerating project...')
    setResult(item)
    await generateKit()
    navigate(ROUTES.BUSINESS_PLAN)
  }

  async function handleDownloadPDF(id) {
    if (downloadingId) return // prevent double-click
    setDownloadingId(id)
    try {
      const fullKit = await historyService.getById(id)
      generateStartupKitPDF(fullKit)
      toast.success('Startup Kit PDF downloaded!')
    } catch (error) {
      toast.error('Failed to download PDF: ' + parseApiError(error))
    } finally {
      setDownloadingId(null)
    }
  }

  // Filter & Sort Logic
  const processedItems = useMemo(() => {
    let result = [...historyItems]

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase()
      result = result.filter(
        (i) =>
          i.idea?.toLowerCase().includes(query) ||
          i.industry?.toLowerCase().includes(query) ||
          i.branding?.name?.toLowerCase().includes(query)
      )
    }

    if (selectedIndustry) {
      result = result.filter((i) => i.industry === selectedIndustry)
    }

    if (selectedBusinessType) {
      result = result.filter((i) => i.businessType === selectedBusinessType)
    }

    if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortOption === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortOption === 'alphabetical') {
      result.sort((a, b) => (a.idea || '').localeCompare(b.idea || ''))
    }

    return result
  }, [historyItems, searchTerm, selectedIndustry, selectedBusinessType, sortOption])

  // Pagination Slicing
  const totalPages = Math.ceil(processedItems.length / pageSize) || 1
  const paginatedItems = processedItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HistoryIcon className="text-blue-600" size={24} />
            Startup Projects History
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Access, filter, and export all your previously generated startup kits.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate(ROUTES.NEW)}>
          Generate New Project
        </Button>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="w-full md:w-72">
          <SearchBar
            label="Search startup history"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by startup name or idea..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="">All Industries</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind.value} value={ind.value}>{ind.label}</option>
            ))}
          </select>

          <select
            value={selectedBusinessType}
            onChange={(e) => setSelectedBusinessType(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="">All Business Types</option>
            {BUSINESS_TYPES.map((bt) => (
              <option key={bt.value} value={bt.value}>{bt.label}</option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="alphabetical">Sort: Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : loadError && historyItems.length === 0 ? (
        <ErrorState
          title="Could not load startup history"
          message={loadError}
          onRetry={loadHistory}
        />
      ) : paginatedItems.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedItems.map((item) => {
            const title = item.branding?.name || item.idea
            return (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {item.industry || 'General'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm line-clamp-1 mb-1">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {item.businessPlan?.executiveSummary || item.idea}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button variant="outline" size="sm" icon={Eye} onClick={() => handleView(item._id)}>
                    View
                  </Button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRegenerate(item)}
                      title="Regenerate"
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded"
                    >
                      <RefreshCw size={15} />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(item._id)}
                      disabled={downloadingId === item._id}
                      title="Download PDF"
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingId === item._id
                        ? <Loader size={15} className="animate-spin" />
                        : <Download size={15} />}
                    </button>
                    <button
                      onClick={() => confirmDelete(item._id)}
                      title="Delete"
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={FolderOpen}
          title={searchTerm || selectedIndustry ? "No matching projects found" : "No startup projects yet"}
          description={
            searchTerm || selectedIndustry
              ? "Try adjusting your search or filters."
              : "Generate your first AI-powered startup kit to view it in your history."
          }
          action={() => navigate(ROUTES.NEW)}
          actionLabel="Generate Startup Kit"
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!targetDeleteId}
        onClose={() => setTargetDeleteId(null)}
        title="Delete Startup Project"
        description="Are you sure you want to delete this startup kit? This action cannot be undone."
        loading={deleteLoading}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setTargetDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={deleteLoading} onClick={executeDelete}>
              Confirm Delete
            </Button>
          </>
        }
      />
    </div>
  )
}
