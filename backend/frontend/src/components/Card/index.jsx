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
        'bg-white rounded-xl border border-slate-200 shadow-sm',
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
    <div className={`mb-4 pb-4 border-b border-slate-100 ${className}`}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-slate-900 ${className}`}>
      {children}
    </h3>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-100 ${className}`}>
      {children}
    </div>
  )
}
