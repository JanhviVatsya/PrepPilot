
import { useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Target,
  Clock3,
} from 'lucide-react'
import type { CareerProfileData } from './types'

type ManualEntryPageProps = {
  onBack: () => void
  onReview: (profile: CareerProfileData) => void
  initialData: CareerProfileData
}

type CareerForm = {
  currentRole: string
  experience: string
  currentSkills: string
  targetRole: string
  careerGoal: string
  targetTimeline: string
  weeklyHours: string
}

export default function ManualEntryPage({
  onBack,
  onReview,
  initialData,
}: ManualEntryPageProps) {
  const [form, setForm] = useState<CareerForm>(initialData)
  const [errors, setErrors] = useState<string[]>([])
  // const [submitted, setSubmitted] = useState(false)

  function updateField(field: keyof CareerForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }))
    // setSubmitted(false)
    setErrors([])
  }


function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const missing: string[] = []

  if (!form.currentRole.trim()) missing.push('Current role')
  if (!form.targetRole.trim()) missing.push('Target role')
  if (!form.careerGoal) missing.push('Career goal')

  if (missing.length > 0) {
    setErrors(missing)
    return
  }

  setErrors([])
  onReview(form)
}


  const inputClass =
    'mt-2 w-full rounded-lg border border-[#353A35] bg-[#111311] px-3 py-3 text-sm text-[#E5E7E5] outline-none transition-colors placeholder:text-[#777D77] focus:border-[#00E676]'

  const labelClass = 'text-sm font-medium text-[#D5D9D5]'

  return (
    <section className="mx-auto max-w-3xl py-4 sm:py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-[#292D29] px-3 py-2 text-sm text-[#A1A7A1] transition-colors hover:bg-[#191C19] hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to options
      </button>

      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#24442F] bg-[#14251B]">
          <BriefcaseBusiness size={23} className="text-[#00E676]" />
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#00E676]">
          Your experience, your ambitions
        </p>

        <h2 className="text-3xl font-bold tracking-tight">
          Tell us about yourself.
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#A1A7A1]">
          Share what you do today and what you'd like to achieve.
          You can refine these details as your career plans evolve.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <BriefcaseBusiness size={19} className="text-[#00E676]" />
            <h3 className="font-semibold">Current background</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="currentRole" className={labelClass}>
                Current role or situation <span className="text-[#00E676]">*</span>
              </label>
              <input
                id="currentRole"
                value={form.currentRole}
                onChange={(event) => updateField('currentRole', event.target.value)}
                placeholder="e.g. SQL Developer, Student, Support Engineer"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="experience" className={labelClass}>
                Years of experience
              </label>
              <select
                id="experience"
                value={form.experience}
                onChange={(event) => updateField('experience', event.target.value)}
                className={inputClass}
              >
                <option value="">Select experience</option>
                <option value="Student / Fresher">Student / Fresher</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1–2 years">1–2 years</option>
                <option value="3–5 years">3–5 years</option>
                <option value="6+ years">6+ years</option>
              </select>
            </div>

            <div>
              <label htmlFor="currentSkills" className={labelClass}>
                Current skills and responsibilities
              </label>
              <textarea
                id="currentSkills"
                value={form.currentSkills}
                onChange={(event) => updateField('currentSkills', event.target.value)}
                placeholder="Technologies you know, tasks you handle, projects you've worked on..."
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Target size={19} className="text-[#00E676]" />
            <h3 className="font-semibold">Career direction</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="targetRole" className={labelClass}>
                Role you're working towards <span className="text-[#00E676]">*</span>
              </label>
              <input
                id="targetRole"
                value={form.targetRole}
                onChange={(event) => updateField('targetRole', event.target.value)}
                placeholder="e.g. Backend Developer, Data Engineer"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="careerGoal" className={labelClass}>
                What's your main goal? <span className="text-[#00E676]">*</span>
              </label>
              <select
                id="careerGoal"
                value={form.careerGoal}
                onChange={(event) => updateField('careerGoal', event.target.value)}
                className={inputClass}
              >
                <option value="">Choose your main goal</option>
                <option value="Switch roles">Switch to a different role</option>
                <option value="Grow in current role">Grow in my current role</option>
                <option value="Prepare for interviews">Prepare for interviews</option>
                <option value="Explore career options">Explore possible career paths</option>
                <option value="Deepen technical skills">Deepen my technical skills</option>
              </select>
            </div>

            <div>
              <label htmlFor="targetTimeline" className={labelClass}>
                When would you like to make progress?
              </label>
              <select
                id="targetTimeline"
                value={form.targetTimeline}
                onChange={(event) => updateField('targetTimeline', event.target.value)}
                className={inputClass}
              >
                <option value="">I'm flexible / not sure yet</option>
                <option value="Within 3 months">Within 3 months</option>
                <option value="Within 6 months">Within 6 months</option>
                <option value="Within 12 months">Within 12 months</option>
                <option value="Just exploring">Just exploring for now</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Clock3 size={19} className="text-[#00E676]" />
            <h3 className="font-semibold">Your learning schedule</h3>
          </div>

          <div>
            <label htmlFor="weeklyHours" className={labelClass}>
              Time available for preparation
            </label>
            <select
              id="weeklyHours"
              value={form.weeklyHours}
              onChange={(event) => updateField('weeklyHours', event.target.value)}
              className={inputClass}
            >
              <option value="">Not decided yet</option>
              <option value="1–3 hours/week">1–3 hours per week</option>
              <option value="4–7 hours/week">4–7 hours per week</option>
              <option value="8–12 hours/week">8–12 hours per week</option>
              <option value="12+ hours/week">12+ hours per week</option>
            </select>
          </div>
        </div>

        {errors.length > 0 && (
          <div
            role="alert"
            className="rounded-lg border border-red-900/60 bg-red-950/20 p-4 text-sm text-red-300"
          >
            Please complete these required fields: {errors.join(', ')}.
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-[#292D29] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#777D77]">
            Fields marked * are required.
          </p>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00E676] px-5 py-3 text-sm font-semibold text-[#080A09] transition-colors hover:bg-[#35F18E]"
          >
            Review details
            <ArrowRight size={17} />
          </button>
        </div>
      </form>
    </section>
  )
}
