import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Presentation, ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, ArrowLeft,
  RefreshCw, Sparkles, MessageSquare, ShieldAlert, Award, FileCheck, Edit3, Send, Check, Play
} from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { ROUTES } from '../../constants/routes'
import Card from '../../components/Card'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { SkeletonCard } from '../../components/Loader'
import { PITCH_DECK_MODULE_DATA } from '../../data/mockModuleData'

export default function PitchDeck() {
  const { result, generateKit, isGenerating, error } = useStartup()
  const navigate = useNavigate()

  // Active Sub-Module Tab: 'deck', 'storytelling', 'practice', 'objections', 'sharktank', 'reviewer'
  const [activeTab, setActiveTab] = useState('deck')

  // 1. Deck Generator State
  const [slides, setSlides] = useState(PITCH_DECK_MODULE_DATA.slides)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isEditingSlide, setIsEditingSlide] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editBulletsText, setEditBulletsText] = useState('')

  // 2. Storytelling Coach State
  const [storyInputText, setStoryInputText] = useState('We built a web app that helps founders with finance and compliance.')
  const [selectedStoryStyle, setSelectedStoryStyle] = useState('Investor Meeting')
  const [storyResult, setStoryResult] = useState(PITCH_DECK_MODULE_DATA.storytellingExamples[0])
  const [isTransformingStory, setIsTransformingStory] = useState(false)

  // 3. AI Pitch Practice Chat State
  const [practiceQuestionIndex, setPracticeQuestionIndex] = useState(0)
  const [practiceAnswer, setPracticeAnswer] = useState('')
  const [practiceFeedback, setPracticeFeedback] = useState(null)
  const [isEvaluatingPractice, setIsEvaluatingPractice] = useState(false)

  // 4. Objection Simulator State
  const [objectionDifficulty, setObjectionDifficulty] = useState('Venture Capitalist')
  const [objectionAnswer, setObjectionAnswer] = useState('')
  const [objectionEvaluation, setObjectionEvaluation] = useState(null)
  const [isEvaluatingObjection, setIsEvaluatingObjection] = useState(false)

  // 5. Shark Tank Mode State
  const [sharkAnswers, setSharkAnswers] = useState(['', '', ''])
  const [sharkReport, setSharkReport] = useState(null)
  const [isAnalyzingShark, setIsAnalyzingShark] = useState(false)

  // 6. Slide Reviewer State
  const [isReviewingDeck, setIsReviewingDeck] = useState(false)
  const [deckReviewReport, setDeckReviewReport] = useState(null)

  const currentSlide = slides[currentSlideIndex] || slides[0]

  // Slide Edit Handlers
  function startEditSlide() {
    setEditTitle(currentSlide.title)
    setEditBulletsText(currentSlide.bullets.join('\n'))
    setIsEditingSlide(true)
  }

  function saveEditSlide() {
    const updatedBullets = editBulletsText.split('\n').filter((b) => b.trim())
    setSlides((prev) =>
      prev.map((s, idx) => (idx === currentSlideIndex ? { ...s, title: editTitle, bullets: updatedBullets } : s))
    )
    setIsEditingSlide(false)
  }

  // Story Transformation Handler
  function handleTransformStory() {
    setIsTransformingStory(true)
    setTimeout(() => {
      setStoryResult({
        id: Date.now(),
        style: selectedStoryStyle,
        original: storyInputText,
        improved: `Every day, thousands of founders struggle to build financial viability. With our ${selectedStoryStyle} pitch narrative, Startup Forge transforms complex spreadsheets into a 1-click AI platform that turns early ideas into fundable startups in days.`,
        tips: [
          'Lead with a strong emotional hook about founder struggle.',
          'Emphasize speed and institutional quality.',
          'Keep your verbal pitch under 25 seconds.',
        ],
        emotionalImpact: 94,
        clarityScore: 97,
      })
      setIsTransformingStory(false)
    }, 800)
  }

  // Practice Pitch Handler
  function handleEvaluatePractice() {
    if (!practiceAnswer.trim()) return
    setIsEvaluatingPractice(true)
    setTimeout(() => {
      setPracticeFeedback({
        confidenceScore: 88,
        clarityScore: 92,
        feedback: "Strong response! You clearly highlighted how Startup Forge solves financial and legal roadblocks. To make it bulletproof, mention your expected LTV:CAC ratio.",
        suggestedAnswer: "We win founders because we combine financial calculation engines, Indian compliance databases, and Shark Tank pitch practice into one seamless suite, saving them 200+ hours.",
        communicationTip: "Maintain steady eye contact and pause after stating your core competitive advantage.",
      })
      setIsEvaluatingPractice(false)
    }, 900)
  }

  // Objection Simulator Handler
  function handleEvaluateObjection() {
    if (!objectionAnswer.trim()) return
    setIsEvaluatingObjection(true)
    setTimeout(() => {
      setObjectionEvaluation({
        responseScore: 91,
        persuasivenessScore: 89,
        investorConfidence: "High",
        missedPoints: ["Could have cited university incubator partnerships to demonstrate B2B expansion."],
        suggestedImprovement: "Highlight that Indian startups represent a $2.1B SAM market with over 50,000 active projects needing compliance & pitch tools.",
      })
      setIsEvaluatingObjection(false)
    }, 900)
  }

  // Shark Tank Report Handler
  function handleRunSharkTank() {
    setIsAnalyzingShark(true)
    setTimeout(() => {
      setSharkReport({
        overallPitchScore: 92,
        investorConfidenceScore: 90,
        fundingRecommendation: "FUNDABLE - Highly Recommended for Seed Capital",
        strengths: ["Strong financial unit economics", "Deep understanding of founder pain points"],
        weaknesses: ["Need to accelerate partner onboarding with university E-Cells"],
        finalFeedback: "You delivered a compelling pitch under high pressure. The Shark Tank panel gives an offer of ₹50 Lakhs for 10% equity!",
      })
      setIsAnalyzingShark(false)
    }, 1200)
  }

  // Deck Reviewer Handler
  function handleRunDeckReview() {
    setIsReviewingDeck(true)
    setTimeout(() => {
      setDeckReviewReport({
        overallDeckScore: 93,
        designScore: 90,
        contentScore: 95,
        storytellingScore: 92,
        investorReadinessScore: 95,
        slideIssues: [
          { slideNum: 2, issue: "Problem Slide: Slightly text-heavy", fix: "Convert paragraphs into 3 bold stat callouts." },
          { slideNum: 5, issue: "Market Opportunity: Needs TAM breakdown", fix: "Add TAM/SAM/SOM nested circle graphic." },
        ],
      })
      setIsReviewingDeck(false)
    }, 1000)
  }

  if (isGenerating) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-8 w-72 rounded-md animate-shimmer" />
        <SkeletonCard />
      </div>
    )
  }

  if (error && !result) {
    return (
      <ErrorState title="Could not load pitch deck" message={error} onRetry={generateKit} />
    )
  }

  return (
    <div className={`space-y-6 animate-fade-in pb-12 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 flex flex-col justify-between overflow-y-auto' : ''}`}>
      {/* Top Header & Breadcrumbs */}
      {!isFullscreen && (
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <Link to={ROUTES.DASHBOARD} className="hover:text-slate-600 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-700">Pitch Deck & Investor Prep</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Presentation className="text-indigo-600" size={24} />
                AI Pitch Deck & Investor Accelerator
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Generate investor slides, practice pitches with AI VCs, simulate Shark Tank interviews, and review your deck.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(ROUTES.DASHBOARD)}>
                Dashboard
              </Button>
              <Button variant="outline" size="sm" icon={RefreshCw} loading={isGenerating} onClick={generateKit}>
                Regenerate
              </Button>
              <Button variant="outline" size="sm" icon={Maximize2} onClick={() => setIsFullscreen(!isFullscreen)}>
                Fullscreen
              </Button>
              <Button variant="primary" size="sm" icon={Download} onClick={() => window.print()}>
                Export Deck (PDF/PPTX)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      {!isFullscreen && (
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          {[
            { id: 'deck', label: '1. Pitch Deck Builder', icon: Presentation },
            { id: 'storytelling', label: '2. Storytelling Coach', icon: Sparkles },
            { id: 'practice', label: '3. AI Pitch Practice', icon: MessageSquare },
            { id: 'objections', label: '4. Objection Simulator', icon: ShieldAlert },
            { id: 'sharktank', label: '5. Shark Tank Mode', icon: Award },
            { id: 'reviewer', label: '6. AI Slide Reviewer', icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg transition-all shrink-0 ${
                  isActive
                    ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      )}

      {/* TAB 1: PITCH DECK BUILDER / GENERATOR */}
      {activeTab === 'deck' && (
        <div className="space-y-6">
          {/* Main Slide Viewer */}
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden min-h-[420px] flex flex-col justify-between p-8 sm:p-12 border border-slate-800 relative">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-widest border-b border-slate-800 pb-4">
              <span className="flex items-center gap-2 text-indigo-400 font-bold">
                <Sparkles size={14} /> Startup Forge AI Deck
              </span>
              <div className="flex items-center gap-4">
                <span>Slide {currentSlideIndex + 1} of {slides.length}</span>
                <button onClick={startEditSlide} className="text-indigo-400 hover:text-white flex items-center gap-1 font-semibold">
                  <Edit3 size={14} /> Edit Slide
                </button>
                {isFullscreen && (
                  <button onClick={() => setIsFullscreen(false)} className="text-slate-400 hover:text-white flex items-center gap-1">
                    <Minimize2 size={14} /> Exit Fullscreen
                  </button>
                )}
              </div>
            </div>

            {/* Slide Body View or Inline Edit Mode */}
            {!isEditingSlide ? (
              <div className="my-8 max-w-3xl animate-fade-in space-y-4" key={currentSlideIndex}>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {currentSlide.title}
                </h2>
                <ul className="space-y-3 text-slate-200 text-base sm:text-lg leading-relaxed list-disc list-inside">
                  {currentSlide.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="my-6 space-y-4 animate-fade-in bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-sm font-bold text-indigo-400 uppercase">Editing Slide {currentSlideIndex + 1}</h3>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Slide Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 text-white rounded font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Bullet Points (One per line)</label>
                  <textarea
                    rows={4}
                    value={editBulletsText}
                    onChange={(e) => setEditBulletsText(e.target.value)}
                    className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 text-white rounded text-xs font-mono"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingSlide(false)} className="text-slate-300">Cancel</Button>
                  <Button variant="primary" size="sm" onClick={saveEditSlide}>Save Changes</Button>
                </div>
              </div>
            )}

            {/* Speaker Notes & AI Design Tip Drawer */}
            <div className="grid sm:grid-cols-2 gap-4 my-2 p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="font-bold text-indigo-400 block mb-1">Speaker Notes:</span>
                <p className="text-slate-300 italic">{currentSlide.speakerNotes}</p>
              </div>
              <div>
                <span className="font-bold text-amber-400 block mb-1">AI Design & Layout Suggestion:</span>
                <p className="text-slate-300">{currentSlide.designSuggestion}</p>
              </div>
            </div>

            {/* Slide Navigation Footer Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                icon={ChevronLeft}
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="text-slate-400 hover:text-white disabled:opacity-30"
              >
                Previous
              </Button>

              <div className="flex gap-1.5 flex-wrap justify-center">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentSlideIndex ? 'bg-indigo-500 w-6' : 'bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={ChevronRight}
                iconPosition="right"
                onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                disabled={currentSlideIndex === slides.length - 1}
                className="text-slate-400 hover:text-white disabled:opacity-30"
              >
                Next
              </Button>
            </div>
          </div>

          {/* Grid Thumbnail Preview of All Slides */}
          {!isFullscreen && (
            <Card>
              <Card.Header>
                <Card.Title>All {slides.length} Investor Slides Overview</Card.Title>
              </Card.Header>
              <Card.Body className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      idx === currentSlideIndex
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Slide {idx + 1}</span>
                    <p className="text-xs font-bold text-slate-800 truncate mt-1">{slide.title}</p>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: AI STORYTELLING COACH */}
      {activeTab === 'storytelling' && (
        <Card className="max-w-4xl mx-auto">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-600" /> AI Storytelling Coach
            </Card.Title>
            <p className="text-xs text-slate-500 mt-1">Transform plain tech speak into high-impact investor narrative.</p>
          </Card.Header>
          <Card.Body className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Your Plain Description:</label>
              <textarea
                rows={3}
                value={storyInputText}
                onChange={(e) => setStoryInputText(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Storytelling Tone:</span>
                <select
                  value={selectedStoryStyle}
                  onChange={(e) => setSelectedStoryStyle(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-700"
                >
                  <option value="Investor Meeting">Investor Meeting</option>
                  <option value="Startup Competition">Startup Competition</option>
                  <option value="Inspirational">Inspirational Keynote</option>
                  <option value="TED Talk Style">TED Talk Style</option>
                </select>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={Sparkles}
                loading={isTransformingStory}
                onClick={handleTransformStory}
              >
                Transform Narrative
              </Button>
            </div>

            {storyResult && (
              <div className="p-6 bg-slate-900 text-white rounded-xl space-y-4 animate-fade-in border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase">Transformed Pitch Narrative</span>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="text-emerald-400">Emotional Impact: {storyResult.emotionalImpact}%</span>
                    <span className="text-blue-400">Clarity: {storyResult.clarityScore}%</span>
                  </div>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-slate-200">{storyResult.improved}</p>
                <div className="p-3 bg-white/5 rounded-lg text-xs space-y-1 text-slate-300">
                  <span className="font-bold text-amber-400">Storytelling Delivery Tips:</span>
                  {storyResult.tips.map((tip, i) => (
                    <p key={i}>• {tip}</p>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* TAB 3: AI PITCH PRACTICE CHAT */}
      {activeTab === 'practice' && (
        <Card className="max-w-4xl mx-auto">
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title className="flex items-center gap-2">
                <MessageSquare className="text-blue-600" size={20} /> AI Investor Pitch Practice
              </Card.Title>
              <span className="text-xs font-bold text-slate-400">
                Question {practiceQuestionIndex + 1} of {PITCH_DECK_MODULE_DATA.investorQuestions.length}
              </span>
            </div>
          </Card.Header>

          <Card.Body className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
              <span className="text-xs font-bold text-blue-700 uppercase">Investor Question:</span>
              <p className="text-base font-bold text-slate-900">
                "{PITCH_DECK_MODULE_DATA.investorQuestions[practiceQuestionIndex].question}"
              </p>
              <p className="text-xs text-blue-600 italic">
                Hint: {PITCH_DECK_MODULE_DATA.investorQuestions[practiceQuestionIndex].hint}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Your Answer:</label>
              <textarea
                rows={4}
                placeholder="Type your response to the investor..."
                value={practiceAnswer}
                onChange={(e) => setPracticeAnswer(e.target.value)}
                className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setPracticeQuestionIndex((prev) =>
                    (prev + 1) % PITCH_DECK_MODULE_DATA.investorQuestions.length
                  )
                }
              >
                Skip Question
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Send}
                loading={isEvaluatingPractice}
                onClick={handleEvaluatePractice}
              >
                Submit Answer for Evaluation
              </Button>
            </div>

            {practiceFeedback && (
              <div className="p-5 bg-slate-50 rounded-xl border space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Investor Feedback</span>
                  <div className="flex gap-2 font-bold">
                    <span className="text-emerald-600">Confidence: {practiceFeedback.confidenceScore}%</span>
                    <span className="text-blue-600">Clarity: {practiceFeedback.clarityScore}%</span>
                  </div>
                </div>
                <p className="text-slate-700">{practiceFeedback.feedback}</p>
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-lg">
                  <span className="font-bold">Stronger Alternative Answer: </span>
                  {practiceFeedback.suggestedAnswer}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* TAB 4: OBJECTION SIMULATOR */}
      {activeTab === 'objections' && (
        <Card className="max-w-4xl mx-auto">
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title className="flex items-center gap-2 text-rose-700">
                <ShieldAlert size={20} /> AI Investor Objection Simulator
              </Card.Title>
              <select
                value={objectionDifficulty}
                onChange={(e) => setObjectionDifficulty(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 font-bold text-slate-700"
              >
                <option value="Beginner Investor">Beginner Investor</option>
                <option value="Angel Investor">Angel Investor</option>
                <option value="Venture Capitalist">Venture Capitalist</option>
                <option value="Shark Tank Judge">Shark Tank Judge</option>
              </select>
            </div>
          </Card.Header>

          <Card.Body className="space-y-6">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-rose-700 uppercase">Skeptical Investor Challenge:</span>
              <p className="text-base font-bold text-slate-900">
                "{PITCH_DECK_MODULE_DATA.objections[0].objection}"
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Defend Your Startup:</label>
              <textarea
                rows={4}
                placeholder="Explain why this objection is invalid..."
                value={objectionAnswer}
                onChange={(e) => setObjectionAnswer(e.target.value)}
                className="w-full p-3 text-xs border rounded-xl"
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              loading={isEvaluatingObjection}
              onClick={handleEvaluateObjection}
              className="ml-auto"
            >
              Evaluate Defense
            </Button>

            {objectionEvaluation && (
              <div className="p-5 bg-slate-900 text-white rounded-xl space-y-3 text-xs animate-fade-in">
                <div className="flex justify-between font-bold border-b border-slate-800 pb-2">
                  <span>Defense Score: {objectionEvaluation.responseScore}/100</span>
                  <span className="text-emerald-400">Confidence: {objectionEvaluation.investorConfidence}</span>
                </div>
                <p className="text-slate-300">{objectionEvaluation.suggestedImprovement}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* TAB 5: SHARK TANK MODE */}
      {activeTab === 'sharktank' && (
        <Card className="max-w-4xl mx-auto bg-slate-950 text-white border-slate-800">
          <Card.Header className="border-b border-slate-800 pb-4">
            <Card.Title className="text-white flex items-center gap-2">
              <Award className="text-amber-400" size={24} /> Shark Tank Interview Mode
            </Card.Title>
            <p className="text-xs text-slate-400">High-intensity 3-question interview simulation with tough VC Sharks.</p>
          </Card.Header>

          <Card.Body className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase">Shark Question 1:</span>
                <p className="text-sm font-bold text-white">"I'm out unless you convince me in 30 seconds why your competitors won't crush you tomorrow."</p>
                <input
                  type="text"
                  placeholder="Your 30-second answer..."
                  value={sharkAnswers[0]}
                  onChange={(e) => setSharkAnswers([e.target.value, sharkAnswers[1], sharkAnswers[2]])}
                  className="w-full mt-2 p-2 bg-slate-900 border border-slate-700 text-xs rounded text-white"
                />
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase">Shark Question 2:</span>
                <p className="text-sm font-bold text-white">"If I invest ₹1 Crore today, how and when do I get my money back?"</p>
                <input
                  type="text"
                  placeholder="Your payback timeline..."
                  value={sharkAnswers[1]}
                  onChange={(e) => setSharkAnswers([sharkAnswers[0], e.target.value, sharkAnswers[2]])}
                  className="w-full mt-2 p-2 bg-slate-900 border border-slate-700 text-xs rounded text-white"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={Play}
              loading={isAnalyzingShark}
              onClick={handleRunSharkTank}
              className="w-full"
            >
              Get Final Shark Tank Investment Report
            </Button>

            {sharkReport && (
              <div className="p-6 bg-slate-900 rounded-xl border border-amber-500/40 space-y-4 animate-fade-in text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-lg font-bold text-amber-400">{sharkReport.fundingRecommendation}</span>
                  <span className="text-2xl font-black text-white">{sharkReport.overallPitchScore}/100</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{sharkReport.finalFeedback}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* TAB 6: AI SLIDE REVIEWER */}
      {activeTab === 'reviewer' && (
        <Card className="max-w-4xl mx-auto">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <FileCheck size={20} className="text-blue-600" /> AI Pitch Deck Reviewer
            </Card.Title>
            <p className="text-xs text-slate-500">Automated audit of slide design, storytelling, and financial data clarity.</p>
          </Card.Header>

          <Card.Body className="space-y-6">
            {!deckReviewReport ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-xs text-slate-600">Run an automated AI scan on your 14 investor slides to find text overload or weak business models.</p>
                <Button variant="primary" size="md" icon={Sparkles} loading={isReviewingDeck} onClick={handleRunDeckReview} className="mx-auto">
                  Scan Deck for Investor Readiness
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="grid sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <span className="text-xs font-bold text-slate-400 uppercase">Overall Score</span>
                    <p className="text-2xl font-black text-blue-600 mt-1">{deckReviewReport.overallDeckScore}/100</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <span className="text-xs font-bold text-slate-400 uppercase">Design Score</span>
                    <p className="text-xl font-bold text-slate-800 mt-1">{deckReviewReport.designScore}%</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <span className="text-xs font-bold text-slate-400 uppercase">Content Score</span>
                    <p className="text-xl font-bold text-slate-800 mt-1">{deckReviewReport.contentScore}%</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border">
                    <span className="text-xs font-bold text-slate-400 uppercase">Readiness</span>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{deckReviewReport.investorReadinessScore}%</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800">Actionable Per-Slide Improvement Suggestions:</h4>
                  {deckReviewReport.slideIssues.map((iss, i) => (
                    <div key={i} className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                      <span className="font-bold">Slide {iss.slideNum} - {iss.issue}: </span>
                      <span>{iss.fix}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
