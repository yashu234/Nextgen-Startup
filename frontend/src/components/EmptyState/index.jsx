import Button from '../Button'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
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
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center transition-colors duration-200">
          <Icon size={28} className="text-text-tertiary" />
        </div>
      )}
      <div className="max-w-xs">
        {title && (
          <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
        )}
      </div>

      {action && actionLabel && (
        <Button variant="primary" onClick={action} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
