import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50',
  loading = false,
  className = '',
}) {
  const trendPositive = trend > 0
  const trendNeutral = trend === 0 || trend === undefined

  return (
    <div
      className={[
        'bg-white rounded-xl border border-slate-200 shadow-sm p-6',
        'flex flex-col gap-4',
        className,
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
            <Icon size={20} className={iconColor} />
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-8 w-24 rounded-md animate-shimmer" />
      ) : (
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
      )}

      {trend !== undefined && !loading && (
        <div className="flex items-center gap-1.5">
          {trendNeutral ? (
            <Minus size={14} className="text-slate-400" />
          ) : trendPositive ? (
            <TrendingUp size={14} className="text-emerald-500" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
          <span
            className={`text-xs font-medium ${
              trendNeutral
                ? 'text-slate-400'
                : trendPositive
                ? 'text-emerald-600'
                : 'text-red-500'
            }`}
          >
            {trendLabel ?? `${Math.abs(trend)}%`}
          </span>
        </div>
      )}
    </div>
  )
}
