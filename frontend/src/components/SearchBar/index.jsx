import { Search } from 'lucide-react'
import { forwardRef, useId } from 'react'

const SearchBar = forwardRef(function SearchBar(
  { label, value, onChange, placeholder = 'Search…', className = '', id, ...rest },
  ref
) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
      )}
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
      />
      <input
        ref={ref}
        id={inputId}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={label || placeholder}
        className={[
          'w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface',
          'text-sm text-text-primary placeholder:text-text-tertiary transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-colors duration-150',
        ].join(' ')}
        {...rest}
      />

    </div>
  )
})

export default SearchBar
