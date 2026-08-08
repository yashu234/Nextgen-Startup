import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from '../Button'

export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center',
        'py-16 px-6 gap-4',
        className,
      ].join(' ')}
    >
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <div className="max-w-xs">
        <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
        {message && (
          <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
        )}
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          onClick={onRetry}
          className="mt-2"
        >
          Try Again
        </Button>
      )}
    </div>
  )
}
