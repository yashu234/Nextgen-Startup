import { useEffect, useCallback, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  size = 'md',
  loading = false,
}) {
  const dialogRef = useRef(null)
  const previousActiveElementRef = useRef(null)

  const focusFirstElement = useCallback(() => {
    const focusableSelectors =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusableElements = dialogRef.current?.querySelectorAll(focusableSelectors)
    if (focusableElements?.length) {
      focusableElements[0].focus()
    } else {
      dialogRef.current?.focus()
    }
  }, [])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && !loading) onClose()

      if (e.key !== 'Tab' || !dialogRef.current) return

      const focusableSelectors =
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      const focusableElements = Array.from(dialogRef.current.querySelectorAll(focusableSelectors))
      if (focusableElements.length === 0) {
        e.preventDefault()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    },
    [onClose, loading]
  )

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(focusFirstElement)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previousActiveElementRef.current?.focus?.()
    }
  }, [isOpen, handleKeyDown, focusFirstElement])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={!loading ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        ref={dialogRef}
        className={[
          'relative w-full bg-white rounded-2xl shadow-xl',
          'animate-fade-in-scale',
          sizeClasses[size] ?? sizeClasses.md,
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
          {!loading && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="ml-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        {children && (
          <div className="px-6 pb-4">{children}</div>
        )}

        {/* Actions */}
        {actions && (
          <div className="flex justify-end gap-3 px-6 pb-6 pt-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
