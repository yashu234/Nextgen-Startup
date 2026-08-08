export default function Card({
  children,
  className = '',
  padding = true,
  hover = false,
  ...rest
}) {
  return (
    <div
      className={[
        'bg-surface rounded-xl border border-border shadow-sm transition-colors duration-200',
        padding ? 'p-6' : '',
        hover ? 'transition-shadow duration-200 hover:shadow-md cursor-pointer' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 pb-4 border-b border-border/50 ${className}`}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-text-primary ${className}`}>
      {children}
    </h3>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-border/50 ${className}`}>
      {children}
    </div>
  )
}

