import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, Building2, MapPin, ChevronRight, ChevronLeft } from 'lucide-react'
import { useStartup } from '../../context/StartupContext'
import { useToast } from '../../context/ToastContext'
import { validateStartupForm } from '../../utils/validators'
import { ROUTES } from '../../constants/routes'
import { INDUSTRIES, BUSINESS_TYPES, BUDGET_RANGES, TARGET_AUDIENCES, FORM_STEPS } from '../../constants'
import { Input, Textarea, Select } from '../../components/Input'
import Button from '../../components/Button'
import { GenerationLoader } from '../../components/Loader'

const FUNDING_STAGES = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'prototype', label: 'Prototype / MVP' },
  { value: 'pre_seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series_a', label: 'Series A+' },
  { value: 'bootstrapped', label: 'Self-Funded / Bootstrapped' }
]

function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {FORM_STEPS.map((s) => (
          <div key={s.step} className="flex items-center gap-2">
            <div
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200',
                currentStep >= s.step
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-400',
              ].join(' ')}
            >
              {s.step}
            </div>
            <span
              className={`text-sm font-medium hidden sm:block ${
                currentStep >= s.step ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
            {s.step < totalSteps && (
              <div
                className={`h-0.5 w-12 sm:w-24 mx-2 rounded transition-colors duration-200 ${
                  currentStep > s.step ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const TOTAL_STEPS = 3

export default function StartupForm() {
  const { formData, setFormData, generateKit, isGenerating } = useStartup()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ [name]: value })
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
  }

  function validateStep() {
    const allErrors = validateStartupForm(formData)
    const stepFields = {
      1: ['idea', 'industry'],
      2: ['businessType', 'budget'],
      3: ['targetAudience', 'location'],
    }
    const relevantErrors = {}
    for (const field of stepFields[step]) {
      if (allErrors[field]) relevantErrors[field] = allErrors[field]
    }
    setErrors(relevantErrors)
    return Object.keys(relevantErrors).length === 0
  }

  function handleNext() {
    if (validateStep()) setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1))
    setErrors({})
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateStep()) return

    const { success, error } = await generateKit()

    if (success) {
      toast.success('Startup kit generated successfully!')
      navigate(ROUTES.BUSINESS_PLAN)
    } else {
      toast.error(error || 'Failed to generate startup kit.')
    }
  }

  if (isGenerating) {
    return <GenerationLoader />
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Generate Your Startup Kit</h1>
        <p className="text-slate-500 mt-1">
          Fill in the details below and we&apos;ll build your complete launch kit.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

        <form onSubmit={handleSubmit} noValidate>
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <Lightbulb size={18} className="text-amber-500" />
                  Your Idea & Problem Statement
                </h2>
                <p className="text-sm text-slate-500 mb-5">
                  Describe your startup concept, problem statement, and industry.
                </p>
              </div>

              <Textarea
                label="Startup Idea & Description"
                name="idea"
                placeholder="Describe your startup idea in a few sentences. What problem does it solve? Who is it for?"
                rows={4}
                value={formData.idea}
                onChange={handleChange}
                error={errors.idea}
                hint="Be as specific as possible for better AI results."
                required
              />

              <Input
                label="Unique Selling Proposition (USP)"
                name="usp"
                type="text"
                placeholder="e.g. 10x faster generation with zero prompt engineering"
                value={formData.usp || ''}
                onChange={handleChange}
                hint="What makes your startup unique compared to existing solutions?"
              />

              <Select
                label="Industry"
                name="industry"
                options={INDUSTRIES}
                placeholder="Select your industry"
                value={formData.industry}
                onChange={handleChange}
                error={errors.industry}
                required
              />
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <Building2 size={18} className="text-blue-500" />
                  Business & Funding Details
                </h2>
                <p className="text-sm text-slate-500 mb-5">
                  Tell us about your business model, stage, and available budget.
                </p>
              </div>

              <Select
                label="Business Type / Model"
                name="businessType"
                options={BUSINESS_TYPES}
                placeholder="Select business type"
                value={formData.businessType}
                onChange={handleChange}
                error={errors.businessType}
                required
              />

              <Select
                label="Current Stage"
                name="fundingStage"
                options={FUNDING_STAGES}
                placeholder="Select funding/development stage"
                value={formData.fundingStage || ''}
                onChange={handleChange}
              />

              <Select
                label="Estimated Budget Range"
                name="budget"
                options={BUDGET_RANGES}
                placeholder="Select your budget"
                value={formData.budget}
                onChange={handleChange}
                error={errors.budget}
                required
              />
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-500" />
                  Target Audience & Location
                </h2>
                <p className="text-sm text-slate-500 mb-5">
                  Define your target market and primary operating location.
                </p>
              </div>

              <Select
                label="Target Audience"
                name="targetAudience"
                options={TARGET_AUDIENCES}
                placeholder="Select target audience"
                value={formData.targetAudience}
                onChange={handleChange}
                error={errors.targetAudience}
                required
              />

              <Input
                label="Business Location (City / State / Country)"
                name="location"
                type="text"
                placeholder="e.g. San Francisco, CA, USA or Remote / Global"
                icon={MapPin}
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                hint="City, state, country or 'Global' for online-only businesses."
                required
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                icon={ChevronLeft}
                onClick={handleBack}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                variant="primary"
                icon={ChevronRight}
                iconPosition="right"
                onClick={handleNext}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                icon={ChevronRight}
                iconPosition="right"
                loading={isGenerating}
              >
                Generate My Kit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
