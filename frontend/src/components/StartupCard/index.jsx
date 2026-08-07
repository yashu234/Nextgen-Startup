import { Calendar, Tag, ArrowRight, Trash2 } from 'lucide-react'
import { formatRelativeTime } from '../../utils/formatters'
import Button from '../Button'

const INDUSTRY_COLORS = {
  technology: 'bg-blue-100 text-blue-700',
  ecommerce: 'bg-purple-100 text-purple-700',
  healthcare: 'bg-green-100 text-green-700',
  education: 'bg-amber-100 text-amber-700',
  finance: 'bg-indigo-100 text-indigo-700',
  food: 'bg-orange-100 text-orange-700',
  default: 'bg-slate-100 text-slate-600',
}

export default function StartupCard({
  startup,
  onView,
  onDelete,
  loading = false,
  className = '',
}) {
  const { idea, industry, createdAt } = startup
  const industryColor = INDUSTRY_COLORS[industry] ?? INDUSTRY_COLORS.default

  return (
    <div
      className={[
        'bg-white rounded-xl border border-slate-200 shadow-sm p-5',
        'flex flex-col gap-4 transition-shadow duration-200 hover:shadow-md',
        className,
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
            {idea}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {industry && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${industryColor}`}
          >
            <Tag size={11} />
            {industry}
          </span>
        )}
        {createdAt && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} />
            {formatRelativeTime(createdAt)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={onView}
          className="flex-1"
        >
          View Kit
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            loading={loading}
            onClick={onDelete}
            aria-label="Delete startup kit"
            className="text-slate-400 hover:text-red-500"
          />
        )}
      </div>
    </div>
  )
}
