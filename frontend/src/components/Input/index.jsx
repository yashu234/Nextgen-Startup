import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

// ─── Text Input ──────────────────────────────────────────────
export const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    required,
    icon: Icon,
    className = '',
    containerClassName = '',
    id,
    ...rest
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
          />
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full h-10 rounded-lg border bg-surface text-sm text-text-primary transition-colors duration-200',
            'placeholder:text-text-tertiary transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:bg-surface-secondary disabled:text-text-tertiary disabled:cursor-not-allowed',
            Icon ? 'pl-9 pr-3' : 'px-3',
            error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-border hover:border-border-strong',
            className,
          ].join(' ')}
          {...rest}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-tertiary">{hint}</p>
      )}
    </div>
  )
})

// ─── Textarea ────────────────────────────────────────────────
export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    hint,
    required,
    rows = 4,
    className = '',
    containerClassName = '',
    id,
    ...rest
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={[
          'w-full rounded-lg border bg-surface text-sm text-text-primary px-3 py-2.5 transition-colors duration-200',
          'placeholder:text-text-tertiary transition-colors duration-150 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-surface-secondary disabled:text-text-tertiary disabled:cursor-not-allowed',
          error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-border hover:border-border-strong',
          className,
        ].join(' ')}
        {...rest}
      />
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-tertiary">{hint}</p>
      )}
    </div>
  )
})

// ─── Select ──────────────────────────────────────────────────
export const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    required,
    options = [],
    placeholder = 'Select an option',
    className = '',
    containerClassName = '',
    id,
    ...rest
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={[
          'w-full h-10 rounded-lg border bg-surface text-sm text-text-primary px-3 transition-colors duration-200',
          'transition-colors duration-150 appearance-none cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-surface-secondary disabled:text-text-tertiary disabled:cursor-not-allowed',
          error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-border hover:border-border-strong',
          className,
        ].join(' ')}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          paddingRight: '36px',
        }}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface text-text-primary">
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-tertiary">{hint}</p>
      )}
    </div>
  )
})

export default Input

