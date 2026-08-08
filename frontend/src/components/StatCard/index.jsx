import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  iconColor = 'text-blue-600 dark:text-blue-400',
  iconBg = 'bg-blue-50 dark:bg-blue-950/40',
  loading = false,
  className = '',
}) {
  const trendPositive = trend > 0
  const trendNeutral = trend === 0 || trend === undefined

  return (
    <div
      className={[
        'bg-surface rounded-xl border border-border shadow-sm p-6 transition-colors duration-200',
        'flex flex-col gap-4',
        className,
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${iconBg}`}>
            <Icon size={20} className={iconColor} />
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-8 w-24 rounded-md animate-shimmer" />
      ) : (
        <p className="text-2xl font-bold text-text-primary leading-none">{value}</p>
      )}

      {trend !== undefined && !loading && (
        <div className="flex items-center gap-1.5">
          {trendNeutral ? (
            <Minus size={14} className="text-text-tertiary" />
          ) : trendPositive ? (
            <TrendingUp size={14} className="text-emerald-500" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
          <span
            className={`text-xs font-medium ${
              trendNeutral
                ? 'text-text-tertiary'
                : trendPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            {trendLabel ?? `${Math.abs(trend)}%`}
          </span>
        </div>
      )}
    </div>
  )
}

