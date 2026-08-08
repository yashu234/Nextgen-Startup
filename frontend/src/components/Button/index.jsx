import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus-visible:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800',
  secondary: 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 focus-visible:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-800',
  outline: 'border border-border bg-surface text-text-secondary hover:bg-surface-secondary focus-visible:ring-slate-400 disabled:opacity-50',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-secondary focus-visible:ring-slate-400 disabled:opacity-50',
  danger: 'bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 focus-visible:ring-red-400 disabled:bg-red-300 dark:disabled:bg-red-800',
}

const SIZES = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...rest
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed select-none',
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={16} className="shrink-0" />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={16} className="shrink-0" />
      )}
    </button>
  )
}
