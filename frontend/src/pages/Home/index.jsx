import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap, ArrowRight, FileText, Palette, Globe, Megaphone,
  TrendingUp, Shield, Presentation, CheckCircle, Star,
  Sparkles, Users, BarChart3, ChevronDown, ChevronUp, HelpCircle
} from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'

const FEATURES = [
  {
    icon: FileText,
    title: 'Business Plan',
    description: 'Executive summary, market analysis, SWOT, milestones — structured and investor-ready.',
    color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'Brand name, tagline, color palette, typography, and your brand voice guide.',
    color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
  },
  {
    icon: Globe,
    title: 'Website Copy',
    description: 'Hero, about, services, CTA, and testimonials — ready to drop into any website builder.',
    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Megaphone,
    title: 'Marketing Strategy',
    description: 'Content calendar, social media plan, SEO keywords, email campaigns, and ad copy.',
    color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  },
  {
    icon: TrendingUp,
    title: 'Finance Projections',
    description: 'Startup costs, revenue forecasts, expense breakdown, and break-even analysis.',
    color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: Shield,
    title: 'Compliance Checklist',
    description: 'Registration steps, licenses, tax obligations, and legal requirements for your industry.',
    color: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
  },
  {
    icon: Presentation,
    title: 'Pitch Deck',
    description: 'Slide-by-slide investor pitch: problem, solution, market, model, traction, team, ask.',
    color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
  },
]

const STEPS = [
  {
    step: '01',
    title: 'Describe Your Idea',
    description: 'Tell us about your startup idea, industry, target audience, and budget in a simple form.',
  },
  {
    step: '02',
    title: 'AI Generates Your Kit',
    description: 'Our AI analyzes your inputs and generates a comprehensive startup launch kit in minutes.',
  },
  {
    step: '03',
    title: 'Launch With Confidence',
    description: 'Download, review, and act on your personalized business plan, branding, and strategy.',
  },
]

const TESTIMONIALS = [
  {
    quote: "Startup Forge cut down our launch planning time from 4 weeks to 5 minutes. The pitch deck was pivotal for our angel round.",
    author: "Elena Rostova",
    role: "Founder, EcoPulse",
    avatar: "ER"
  },
  {
    quote: "The business plan and financial forecasting gave us clear runway insights before spending a dime.",
    author: "Marcus Chen",
    role: "Co-Founder, ByteFlow SaaS",
    avatar: "MC"
  },
  {
    quote: "Having website copy, branding, and marketing strategy generated in one cohesive kit is a game changer for solo founders.",
    author: "Amara Johnson",
    role: "Solo Entrepreneur",
    avatar: "AJ"
  }
]

const FAQS = [
  {
    question: "What is Startup Forge?",
    answer: "Startup Forge is an AI-powered platform that converts a startup idea into a full 7-module launch kit including a Business Plan, Branding, Website Copy, Marketing Strategy, Finance Projections, Compliance Checklist, and Pitch Deck."
  },
  {
    question: "How long does it take to generate a startup kit?",
    answer: "Generation typically takes less than 2 minutes once you submit your startup details."
  },
  {
    question: "Can I customize the generated outputs?",
    answer: "Yes! All generated modules are interactive and stored in your account history so you can review, iterate, and export them."
  },
  {
    question: "Is there a free trial or no-credit-card option?",
    answer: "Yes, you can register and start exploring Startup Forge without entering any payment information."
  }
]

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [openFaq, setOpenFaq] = useState(null)

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface border-b border-border transition-colors duration-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-medium mb-8 transition-colors duration-200">
            <Sparkles size={13} />
            AI-Powered Startup Launch Kit
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-text-primary tracking-tight leading-tight mb-6 text-balance">
            Turn Your Idea Into a{' '}
            <span className="text-blue-600 dark:text-blue-500">Complete Business</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            Startup Forge generates a full launch kit — business plan, branding, marketing strategy,
            finance projections, compliance checklist, and investor pitch deck — all from your idea.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={isAuthenticated ? ROUTES.NEW : ROUTES.SIGNUP}>
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Generate My Startup Kit
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline" size="lg">Sign In</Button>
              </Link>
            )}
          </div>

          <div className="flex items-center justify-center gap-8 mt-14 text-sm text-text-tertiary">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-emerald-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-emerald-500" />
              Ready in minutes
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-emerald-500" />
              7 modules included
            </div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="bg-surface-secondary border-b border-border py-5 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              <span><strong className="text-text-primary">500+</strong> startups generated</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-amber-500" />
              <span><strong className="text-text-primary">4.9 / 5</strong> founder rating</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-emerald-500" />
              <span><strong className="text-text-primary">7</strong> modules per kit</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-indigo-500" />
              <span>Built in <strong className="text-text-primary">&lt; 2 minutes</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-surface transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              One submission. Seven comprehensive modules. All tailored to your specific idea,
              industry, and market.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl border border-border bg-surface hover:shadow-md transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-surface-secondary border-y border-border transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-text-secondary text-lg">
              Three steps from idea to launch kit.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">{s.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-20 bg-surface transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Loved by Early Founders
            </h2>
            <p className="text-text-secondary text-lg">
              See how entrepreneurs use Startup Forge to launch faster.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-border bg-surface-secondary/50 flex flex-col justify-between transition-colors duration-200">
                <p className="text-sm text-text-secondary italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">{t.author}</h4>
                    <p className="text-xs text-text-tertiary">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-surface-secondary border-t border-border transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-3 transition-colors duration-200">
              <HelpCircle size={14} /> FAQ
            </div>
            <h2 className="text-3xl font-bold text-text-primary">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-surface rounded-xl border border-border overflow-hidden transition-colors duration-200">
                <button
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openFaq === idx}
                  aria-controls={`faq-panel-${idx}`}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-text-primary text-sm hover:bg-surface-secondary transition-colors duration-200"
                >
                  <span>{faq.question}</span>
                  {openFaq === idx ? <ChevronUp size={18} className="text-blue-600 dark:text-blue-400" /> : <ChevronDown size={18} className="text-text-tertiary" />}
                </button>
                {openFaq === idx && (
                  <div id={`faq-panel-${idx}`} className="p-5 pt-0 text-sm text-text-secondary border-t border-border/50 leading-relaxed bg-surface-secondary/50 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Forge Your Startup?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Join hundreds of founders who have launched faster with Startup Forge.
          </p>
          <Link to={isAuthenticated ? ROUTES.NEW : ROUTES.SIGNUP}>
            <Button
              variant="outline"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="bg-white text-blue-600 border-white hover:bg-blue-50 hover:border-blue-50"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
