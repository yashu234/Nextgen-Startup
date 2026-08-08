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
      <div className="w-16 h-16 rounded-2xl bg-danger-bg flex items-center justify-center transition-colors duration-200">
        <AlertTriangle size={28} className="text-danger" />
      </div>
      <div className="max-w-xs">
        <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
        {message && (
          <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
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
