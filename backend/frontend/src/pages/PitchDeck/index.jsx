import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Presentation, ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, ArrowLeft, RefreshCw } from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'

const SLIDE_KEYS = ['slide1', 'slide2', 'slide3', 'slide4', 'slide5', 'slide6', 'slide7', 'slide8', 'slide9', 'slide10']

export default function PitchDeck() {
  const { result, generateKit, isGenerating, error } = useStartup()
  const navigate = useNavigate()

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const pitch = result?.pitchDeck
  if (isGenerating) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-8 w-72 rounded-md animate-shimmer" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (error && !result) {
    return (
      <ErrorState
        title="Could not load pitch deck"
        message={error}
        onRetry={generateKit}
      />
    )
  }

  if (!pitch) {
    return (
      <EmptyState
        icon={Presentation}
        title="No Pitch Deck Generated"
        description="Please generate a startup kit to view your investor pitch slides."
        actionLabel="Generate Startup Kit"
        action={() => navigate(ROUTES.NEW)}
      />
    )
  }
  const currentSlideKey = SLIDE_KEYS[currentSlideIndex]
  const currentSlide = pitch[currentSlideKey] || { title: `Slide ${currentSlideIndex + 1}`, content: "Content unavailable." }

  function nextSlide() {
    if (currentSlideIndex < SLIDE_KEYS.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1)
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1)
    }
  }

  function toggleFullscreen() {
    setIsFullscreen((prev) => !prev)
  }

  return (
    <div className={`space-y-6 animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between' : ''}`}>
      {/* Breadcrumb & Top Bar */}
      {!isFullscreen && (
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <Link to={ROUTES.DASHBOARD} className="hover:text-slate-600 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-700">Pitch Deck</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Presentation className="text-indigo-600" size={24} />
                10-Slide Investor Pitch Deck
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Interactive 10-slide deck covering problem, solution, market, financials, and investment ask.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(ROUTES.DASHBOARD)}>
                Dashboard
              </Button>
              <Button variant="outline" size="sm" icon={RefreshCw} loading={isGenerating} onClick={generateKit}>
                Regenerate
              </Button>
              <Button variant="outline" size="sm" icon={Maximize2} onClick={toggleFullscreen}>
                Fullscreen
              </Button>
              <Button variant="primary" size="sm" icon={Download} onClick={() => window.print()}>
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Pitch Deck Presentation Container */}
      <div className={`bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden min-h-[420px] flex flex-col justify-between p-8 sm:p-12 border border-slate-800 ${isFullscreen ? 'flex-1 my-4' : ''}`}>
        {/* Slide Header */}
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-widest border-b border-slate-800 pb-4">
          <span>Startup Forge Deck</span>
          <div className="flex items-center gap-4">
            <span>Slide {currentSlideIndex + 1} of 10</span>
            {isFullscreen && (
              <button onClick={toggleFullscreen} className="text-slate-400 hover:text-white flex items-center gap-1">
                <Minimize2 size={14} /> Exit Fullscreen
              </button>
            )}
          </div>
        </div>

        {/* Slide Body */}
        <div className="my-8 max-w-2xl animate-fade-in" key={currentSlideIndex}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            {typeof currentSlide === 'object' ? currentSlide.title : `Slide ${currentSlideIndex + 1}`}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {typeof currentSlide === 'object' ? currentSlide.content : currentSlide}
          </p>
        </div>

        {/* Slide Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            icon={ChevronLeft}
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className="text-slate-400 hover:text-white disabled:opacity-30"
          >
            Previous
          </Button>

          {/* Jump to Slide Dots */}
          <div className="flex gap-1.5 flex-wrap justify-center">
            {SLIDE_KEYS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlideIndex ? 'bg-blue-500 w-6' : 'bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={ChevronRight}
            iconPosition="right"
            onClick={nextSlide}
            disabled={currentSlideIndex === SLIDE_KEYS.length - 1}
            className="text-slate-400 hover:text-white disabled:opacity-30"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Grid Overview of all 10 Slides */}
      {!isFullscreen && (
        <Card>
          <Card.Header>
            <Card.Title>10-Slide Overview & Jump Controls</Card.Title>
          </Card.Header>
          <Card.Body className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {SLIDE_KEYS.map((key, idx) => {
              const slideObj = pitch[key] || { title: `Slide ${idx + 1}`, content: "" }
              const titleText = typeof slideObj === 'object' ? slideObj.title : `Slide ${idx + 1}`
              const bodyText = typeof slideObj === 'object' ? slideObj.content : slideObj

              return (
                <div
                  key={key}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    idx === currentSlideIndex
                      ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-400 uppercase block truncate">{titleText}</span>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{bodyText}</p>
                </div>
              )
            })}
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
