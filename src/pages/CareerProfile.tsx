
import { useState } from 'react'
import {
  MessageCircle,
  FileUp,
  ClipboardList,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

import AIChatPage from './career-profile/AIChatPage'
import ResumeUploadPage from './career-profile/ResumeUploadPage'
import ManualEntryPage from './career-profile/ManualEntryPage'

type EntryMethod = 'chat' | 'resume' | 'manual'

export default function CareerProfile() {
  const [selectedMethod, setSelectedMethod] =
    useState<EntryMethod | null>(null)

const [currentStep, setCurrentStep] = useState<EntryMethod | null>(null)

  const entryOptions = [
    {
      id: 'chat' as const,
      icon: MessageCircle,
      title: 'Chat with AI',
      description:
        'Talk through your experience, ambitions, and challenges in a guided conversation.',
      tag: 'Recommended',
    },
    {
      id: 'resume' as const,
      icon: FileUp,
      title: 'Upload resume',
      description:
        'Start with your existing resume and build your profile from your experience.',
      tag: null,
    },
    {
      id: 'manual' as const,
      icon: ClipboardList,
      title: 'Enter manually',
      description:
        'Fill in your current role, skills, career goals, and learning preferences yourself.',
      tag: null,
    },
  ]

  function handleContinue() {
  if (!selectedMethod) return
  setCurrentStep(selectedMethod)
}

if (currentStep === 'chat') {
  return <AIChatPage onBack={() => setCurrentStep(null)} />
}
if (currentStep === 'resume') {
  return <ResumeUploadPage onBack={() => setCurrentStep(null)} />
}
// if (currentStep === 'resume') return <ResumeUploadPage />
if (currentStep === 'manual') {
  return <ManualEntryPage onBack={() => setCurrentStep(null)} />
}
// if (currentStep === 'manual') return <ManualEntryPage />

  return (
    <section className="mx-auto max-w-4xl py-4 sm:py-8">
      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#24442F] bg-[#14251B]">
          <Sparkles size={23} className="text-[#00E676]" />
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#00E676]">
          Your career, your direction
        </p>

        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Let's build your career profile.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A1A7A1] sm:text-base">
          Before creating your preparation plan, let's understand where
          you are today, where you want to go, and what it will take to
          get there.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-[#292D29] bg-[#111311] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B251E]">
            <MessageCircle size={18} className="text-[#00E676]" />
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              Start wherever you're comfortable
            </h3>
            <p className="mt-1 text-sm leading-6 text-[#858B85]">
              You don't need a resume or a perfectly defined goal.
              You can explore possible career paths and refine your
              goals as your circumstances change.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          How would you like to begin?
        </h3>
        <p className="mt-1 text-sm text-[#858B85]">
          Choose one. You can update your profile later.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {entryOptions.map(({ id, icon: Icon, title, description, tag }) => {
          const isSelected = selectedMethod === id

          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedMethod(id)}
              aria-pressed={isSelected}
              className={`relative flex min-h-56 flex-col rounded-xl border p-5 text-left transition-colors ${
                isSelected
                  ? 'border-[#00E676] bg-[#142019]'
                  : 'border-[#292D29] bg-[#111311] hover:border-[#454B45] hover:bg-[#151815]'
              }`}
            >
              {tag && (
                <span className="mb-4 self-start rounded-full border border-[#285238] bg-[#1B3022] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#00E676]">
                  {tag}
                </span>
              )}

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#292D29] bg-[#191C19]">
                <Icon size={21} className="text-[#00E676]" />
              </div>

              <h4 className="text-base font-semibold">{title}</h4>

              <p className="mt-2 text-sm leading-6 text-[#A1A7A1]">
                {description}
              </p>

              <div className="mt-auto flex justify-end pt-4">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    isSelected
                      ? 'border-[#00E676] bg-[#00E676] text-[#080A09]'
                      : 'border-[#454B45]'
                  }`}
                >
                  {isSelected && <span className="text-xs font-bold">✓</span>}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#292D29] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#777D77]">
          Your resume is optional. Start with what you know.
        </p>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedMethod}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00E676] px-5 py-3 text-sm font-semibold text-[#080A09] transition-colors hover:bg-[#35F18E] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  )
}
