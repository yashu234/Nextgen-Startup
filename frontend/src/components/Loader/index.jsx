import { Loader2, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

const GENERATION_MESSAGES = [
  'Analyzing your startup idea…',
  'Crafting your business plan…',
  'Designing your brand identity…',
  'Building your marketing strategy…',
  'Projecting your financials…',
  'Checking compliance requirements…',
  'Preparing your pitch deck…',
  'Assembling your website copy…',
  'Polishing the final details…',
  'Almost ready…',
]

// ─── Full-page Generation Loader ─────────────────────────────
export function GenerationLoader() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % GENERATION_MESSAGES.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface/90 dark:bg-surface-secondary/90 backdrop-blur-sm transition-colors duration-200">
      <div className="flex flex-col items-center gap-6 max-w-sm text-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center transition-colors duration-200">
            <Sparkles size={36} className="text-blue-600 dark:text-blue-400 animate-pulse-soft" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-950/60 border-t-blue-600 dark:border-t-blue-500 animate-spin-slow" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Generating Your Startup Kit
          </h2>
          <p className="text-sm text-text-secondary animate-fade-in" key={messageIndex}>
            {GENERATION_MESSAGES[messageIndex]}
          </p>
        </div>

        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 animate-pulse-soft"
              style={{ animationDelay: `${i * 300}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Inline Spinner ──────────────────────────────────────────
export function Spinner({ size = 20, className = '' }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-blue-600 dark:text-blue-400 ${className}`}
      aria-label="Loading"
    />
  )
}

// ─── Skeleton Block ──────────────────────────────────────────
export function Skeleton({ className = '', width, height }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-md animate-shimmer ${className}`}
      style={{ width, height: height || '1rem' }}
    />
  )
}

// ─── Card Skeleton ───────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-4 transition-colors duration-200">
      <Skeleton className="w-1/3 h-4" />
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-5/6 h-3" />
      <Skeleton className="w-4/6 h-3" />
    </div>
  )
}

// ─── Page Loader ─────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spinner size={32} />
    </div>
  )
}

export default GenerationLoader

