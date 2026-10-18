
import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Target,
  Clock3,
  CheckCircle2,
  Pencil,
} from 'lucide-react'
import type { CareerProfileData } from './types'

type ProfileReviewPageProps = {
  profile: CareerProfileData
  onBackToEdit: () => void
}

export default function ProfileReviewPage({
  profile,
  onBackToEdit,
}: ProfileReviewPageProps) {
  const [confirmed, setConfirmed] = useState(false)

  const sections = [
    {
      title: 'Current background',
      icon: BriefcaseBusiness,
      fields: [
        { label: 'Current role or situation', value: profile.currentRole },
        { label: 'Experience', value: profile.experience },
        {
          label: 'Skills and responsibilities',
          value: profile.currentSkills,
        },
      ],
    },
    {
      title: 'Career direction',
      icon: Target,
      fields: [
        { label: 'Target role', value: profile.targetRole },
        { label: 'Main career goal', value: profile.careerGoal },
        { label: 'Target timeline', value: profile.targetTimeline },
      ],
    },
    {
      title: 'Learning schedule',
      icon: Clock3,
      fields: [
        { label: 'Time available', value: profile.weeklyHours },
      ],
    },
  ]

  return (
    <section className="mx-auto max-w-3xl py-4 sm:py-8">
      <button
        type="button"
        onClick={onBackToEdit}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-[#292D29] px-3 py-2 text-sm text-[#A1A7A1] transition-colors hover:bg-[#191C19] hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to edit
      </button>

      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#24442F] bg-[#14251B]">
          <CheckCircle2 size={23} className="text-[#00E676]" />
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#00E676]">
          Step 2 · Review
        </p>

        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Does this look right?
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#A1A7A1]">
          Review the details below before moving forward. You can go back
          and make changes at any time.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map(({ title, icon: Icon, fields }) => (
          <div
            key={title}
            className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <Icon size={19} className="text-[#00E676]" />
              <h3 className="font-semibold">{title}</h3>
            </div>

            <div className="space-y-5">
              {fields.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-[#858B85]">
                    {label}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-[#E5E7E5]">
                    {value.trim() || 'Not provided'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {confirmed && (
        <div
          role="status"
          className="mt-5 flex items-start gap-3 rounded-xl border border-[#285238] bg-[#142019] p-4"
        >
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#00E676]" />
          <div>
            <p className="text-sm font-semibold">Details confirmed</p>
            <p className="mt-1 text-sm leading-6 text-[#A1A7A1]">
              Your confirmation is held in this session only. Your profile
              has not been saved to a database yet.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#292D29] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBackToEdit}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#353A35] px-5 py-3 text-sm font-semibold text-[#D5D9D5] transition-colors hover:bg-[#191C19]"
        >
          <Pencil size={16} />
          Back to edit
        </button>

        <button
          type="button"
          onClick={() => setConfirmed(true)}
          disabled={confirmed}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00E676] px-5 py-3 text-sm font-semibold text-[#080A09] transition-colors hover:bg-[#35F18E] disabled:cursor-default disabled:opacity-60"
        >
          {confirmed ? 'Confirmed' : 'Looks good'}
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  )
}
