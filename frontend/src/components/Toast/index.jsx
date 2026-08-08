import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { TOAST_TYPES } from '../../constants'

const CONFIG = {
  [TOAST_TYPES.SUCCESS]: {
    icon: CheckCircle,
    classes: 'bg-success-bg border-success/20 text-emerald-800 dark:text-emerald-200',
    iconClass: 'text-success',
  },
  [TOAST_TYPES.ERROR]: {
    icon: AlertCircle,
    classes: 'bg-danger-bg border-danger/20 text-red-800 dark:text-red-200',
    iconClass: 'text-danger',
  },
  [TOAST_TYPES.WARNING]: {
    icon: AlertTriangle,
    classes: 'bg-warning-bg border-warning/20 text-amber-800 dark:text-amber-200',
    iconClass: 'text-warning',
  },
  [TOAST_TYPES.INFO]: {
    icon: Info,
    classes: 'bg-info-bg border-info/20 text-blue-800 dark:text-blue-200',
    iconClass: 'text-info',
  },
}

function ToastItem({ id, message, type }) {
  const { removeToast } = useToast()
  const { icon: Icon, classes, iconClass } = CONFIG[type] ?? CONFIG[TOAST_TYPES.INFO]

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        'flex items-start gap-3 w-full max-w-sm px-4 py-3',
        'rounded-xl border shadow-lg animate-slide-in-right',
        classes,
      ].join(' ')}
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${iconClass}`} />
      <p className="text-sm font-medium flex-1 leading-snug">{message}</p>
      <button
        onClick={() => removeToast(id)}
        aria-label="Dismiss notification"
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={15} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  )
}
