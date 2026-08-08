import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { TOAST_TYPES } from '../../constants'

const CONFIG = {
  [TOAST_TYPES.SUCCESS]: {
    icon: CheckCircle,
    classes: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    iconClass: 'text-emerald-500',
  },
  [TOAST_TYPES.ERROR]: {
    icon: AlertCircle,
    classes: 'bg-red-50 border-red-200 text-red-800',
    iconClass: 'text-red-500',
  },
  [TOAST_TYPES.WARNING]: {
    icon: AlertTriangle,
    classes: 'bg-amber-50 border-amber-200 text-amber-800',
    iconClass: 'text-amber-500',
  },
  [TOAST_TYPES.INFO]: {
    icon: Info,
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClass: 'text-blue-500',
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
