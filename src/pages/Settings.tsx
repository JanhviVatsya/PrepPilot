import { useEffect, useState } from 'react'
import {
  Target,
  BriefcaseBusiness,
  Clock3,
  Bell,
  Palette,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  Info,
  Moon,
  Sun,
  BookOpen,
  AlertTriangle,
} from 'lucide-react'

type Preferences = {
  dailyStudyHours: number
  studyDays: string[]
  targetRole: string
  experienceLevel: string
  preparationTimeline: string
  preferredStudyTime: string
  weeklyFocus: string
  studyReminders: boolean
  weeklySummary: boolean
  theme: 'dark' | 'light'
}

const STORAGE_KEY = 'preppilot-settings'

const defaultPreferences: Preferences = {
  dailyStudyHours: 2,
  studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  targetRole: 'Java Backend Developer',
  experienceLevel: 'Early Career',
  preparationTimeline: '3 months',
  preferredStudyTime: 'Evening',
  weeklyFocus: 'Balanced preparation',
  studyReminders: false,
  weeklySummary: true,
  theme: 'dark',
}

const studyDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const inputClass =
  'mt-2 w-full rounded-lg border border-[#292D29] bg-[#080A09] px-3 py-2.5 text-sm text-[#E5E7E5] outline-none transition focus:border-[#00E676]'

const labelClass = 'block text-sm font-medium text-[#A1A7A1]'

function loadPreferences(): Preferences {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return defaultPreferences

    const parsed = JSON.parse(saved) as Partial<Preferences>

    return {
      ...defaultPreferences,
      ...parsed,
      studyDays: Array.isArray(parsed.studyDays)
        ? parsed.studyDays.filter((day) => studyDays.includes(day))
        : defaultPreferences.studyDays,
      theme: 'dark',
    }
  } catch {
    return defaultPreferences
  }
}

function Settings() {
  const [preferences, setPreferences] =
    useState<Preferences>(loadPreferences)
  const [savedMessage, setSavedMessage] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetMessage, setResetMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  }, [preferences])

  function updatePreference<K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }))

    setSavedMessage('')
  }

  function toggleStudyDay(day: string) {
    const selected = preferences.studyDays.includes(day)

    updatePreference(
      'studyDays',
      selected
        ? preferences.studyDays.filter((item) => item !== day)
        : [...preferences.studyDays, day],
    )
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    setSavedMessage('Your preferences have been saved.')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  function resetPreferences() {
    setPreferences(defaultPreferences)
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultPreferences),
    )
    setShowReset(false)
    setResetMessage('Your preferences have been restored to their defaults.')
    setTimeout(() => setResetMessage(''), 4000)
  }

  function resetProgress() {
    const confirmed = window.confirm(
      'This will permanently clear saved PrepPilot progress in this browser, including practice results, projects, daily tasks, and study activity. Your career profile and settings will not be cleared. Continue?',
    )

    if (!confirmed) return

    const keysToRemove = [
      'preppilot-practice-solved',
      'preppilot-projects',
      'preppilot-study-activity',
    ]

    keysToRemove.forEach((key) => localStorage.removeItem(key))

    Object.keys(localStorage)
      .filter((key) => key.startsWith('preppilot-tasks-'))
      .forEach((key) => localStorage.removeItem(key))

    setResetMessage(
      'Saved practice, project, and daily-task progress has been cleared.',
    )
    setTimeout(() => setResetMessage(''), 5000)
  }

  return (
    <section className="space-y-7 pb-8">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#00E676]">
          PERSONALIZE YOUR EXPERIENCE
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-[#E5E7E5]">
          Settings
        </h2>

        <p className="mt-2 max-w-xl text-sm text-[#858B85]">
          Shape PrepPilot around your goals, available time, and preferred
          learning routine.
        </p>
      </div>

      {savedMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-lg border border-[#14532D] bg-[#052E16] p-3 text-sm text-[#4ADE80]"
        >
          <CheckCircle2 size={17} />
          {savedMessage}
        </div>
      )}

      {resetMessage && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-[#14532D] bg-[#052E16] p-3 text-sm text-[#4ADE80]"
        >
          <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
          <span>{resetMessage}</span>
        </div>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          {/* Study goals */}
          <section className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00E676]/10">
                <Target size={20} className="text-[#00E676]" />
              </div>

              <div>
                <h3 className="font-semibold text-[#E5E7E5]">
                  Study goals
                </h3>
                <p className="mt-1 text-sm text-[#858B85]">
                  Set a realistic routine that you can maintain.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Daily study goal
                <select
                  value={preferences.dailyStudyHours}
                  onChange={(event) =>
                    updatePreference(
                      'dailyStudyHours',
                      Number(event.target.value),
                    )
                  }
                  className={inputClass}
                >
                  <option value={0.5}>30 minutes</option>
                  <option value={1}>1 hour</option>
                  <option value={1.5}>1.5 hours</option>
                  <option value={2}>2 hours</option>
                  <option value={3}>3 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={5}>5 hours</option>
                </select>
              </label>

              <label className={labelClass}>
                Preferred study time
                <select
                  value={preferences.preferredStudyTime}
                  onChange={(event) =>
                    updatePreference(
                      'preferredStudyTime',
                      event.target.value,
                    )
                  }
                  className={inputClass}
                >
                  <option>Early morning</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Late night</option>
                  <option>Flexible</option>
                </select>
              </label>
            </div>

            <div className="mt-6">
              <p className={labelClass}>Study days</p>
              <p className="mt-1 text-xs text-[#626862]">
                Choose the days you want to dedicate to preparation.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {studyDays.map((day) => {
                  const selected = preferences.studyDays.includes(day)

                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleStudyDay(day)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        selected
                          ? 'border-[#00E676] bg-[#00E676]/10 text-[#00E676]'
                          : 'border-[#292D29] bg-[#080A09] text-[#858B85] hover:text-[#E5E7E5]'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Career preferences */}
          <section className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-400/10">
                <BriefcaseBusiness size={20} className="text-sky-400" />
              </div>

              <div>
                <h3 className="font-semibold text-[#E5E7E5]">
                  Career preferences
                </h3>
                <p className="mt-1 text-sm text-[#858B85]">
                  Define what you are preparing for.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Target role
                <select
                  value={preferences.targetRole}
                  onChange={(event) =>
                    updatePreference('targetRole', event.target.value)
                  }
                  className={inputClass}
                >
                  <option>Java Backend Developer</option>
                  <option>Backend Software Engineer</option>
                  <option>Software Development Engineer</option>
                  <option>Full Stack Developer</option>
                  <option>DevOps Engineer</option>
                  <option>Database Engineer</option>
                  <option>Other</option>
                </select>
              </label>

              <label className={labelClass}>
                Experience level
                <select
                  value={preferences.experienceLevel}
                  onChange={(event) =>
                    updatePreference('experienceLevel', event.target.value)
                  }
                  className={inputClass}
                >
                  <option>Student</option>
                  <option>Early Career</option>
                  <option>Mid-Level</option>
                  <option>Experienced</option>
                </select>
              </label>

              <label className={labelClass}>
                Preparation timeline
                <select
                  value={preferences.preparationTimeline}
                  onChange={(event) =>
                    updatePreference(
                      'preparationTimeline',
                      event.target.value,
                    )
                  }
                  className={inputClass}
                >
                  <option>1 month</option>
                  <option>2 months</option>
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                  <option>Flexible</option>
                </select>
              </label>

              <label className={labelClass}>
                Weekly focus
                <select
                  value={preferences.weeklyFocus}
                  onChange={(event) =>
                    updatePreference('weeklyFocus', event.target.value)
                  }
                  className={inputClass}
                >
                  <option>Balanced preparation</option>
                  <option>DSA and problem solving</option>
                  <option>Backend development</option>
                  <option>Core CS subjects</option>
                  <option>Projects and portfolio</option>
                  <option>Interview revision</option>
                </select>
              </label>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-400/10">
                <Bell size={20} className="text-orange-400" />
              </div>

              <div>
                <h3 className="font-semibold text-[#E5E7E5]">
                  Notifications
                </h3>
                <p className="mt-1 text-sm text-[#858B85]">
                  Choose the reminders you would like to enable later.
                </p>
              </div>
            </div>

            {[
              {
                key: 'studyReminders' as const,
                title: 'Study reminders',
                description: 'A reminder to begin your planned study session.',
                value: preferences.studyReminders,
              },
              {
                key: 'weeklySummary' as const,
                title: 'Weekly progress summary',
                description: 'A summary of your learning activity each week.',
                value: preferences.weeklySummary,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 border-t border-[#292D29] py-4 first:border-t-0"
              >
                <div>
                  <p className="text-sm font-medium text-[#E5E7E5]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#858B85]">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={item.value}
                  aria-label={item.title}
                  onClick={() =>
                    updatePreference(item.key, !item.value)
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    item.value ? 'bg-[#00E676]' : 'bg-[#454945]'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      item.value ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}

            <div className="flex items-start gap-2 rounded-lg border border-[#292D29] bg-[#191C19] p-3">
              <Info size={15} className="mt-0.5 shrink-0 text-[#858B85]" />
              <p className="text-xs leading-relaxed text-[#858B85]">
                These switches save your preferences only. Actual reminders
                and scheduled summaries are not implemented yet.
              </p>
            </div>
          </section>
        </div>

        {/* Appearance and data management */}
        <aside className="space-y-5">
          <section className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
            <div className="flex items-center gap-3">
              <Palette size={19} className="text-[#00E676]" />
              <h3 className="font-semibold text-[#E5E7E5]">Appearance</h3>
            </div>

            <p className="mt-3 text-sm text-[#858B85]">
              Choose how PrepPilot looks.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                aria-pressed={preferences.theme === 'dark'}
                onClick={() => updatePreference('theme', 'dark')}
                className={`rounded-lg border p-3 text-left transition ${
                  preferences.theme === 'dark'
                    ? 'border-[#00E676] bg-[#00E676]/5'
                    : 'border-[#292D29] bg-[#191C19]'
                }`}
              >
                <Moon size={18} className="text-[#00E676]" />
                <p className="mt-3 text-sm font-medium text-[#E5E7E5]">
                  Dark
                </p>
                <p className="mt-1 text-xs text-[#858B85]">Current theme</p>
              </button>

              <button
                type="button"
                aria-pressed={preferences.theme === 'light'}
                onClick={() =>
                  setSavedMessage(
                    'Light theme is not available yet. PrepPilot remains in dark mode.',
                  )
                }
                className="cursor-not-allowed rounded-lg border border-[#292D29] bg-[#191C19] p-3 text-left opacity-60"
              >
                <Sun size={18} className="text-[#A1A7A1]" />
                <p className="mt-3 text-sm font-medium text-[#E5E7E5]">
                  Light
                </p>
                <p className="mt-1 text-xs text-[#858B85]">Coming later</p>
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
            <div className="flex items-center gap-3">
              <Clock3 size={19} className="text-[#00E676]" />
              <h3 className="font-semibold text-[#E5E7E5]">Your schedule</h3>
            </div>

            <p className="mt-4 text-3xl font-bold text-[#E5E7E5]">
              {preferences.dailyStudyHours}
              <span className="ml-2 text-sm font-medium text-[#858B85]">
                {preferences.dailyStudyHours === 1 ? 'hour' : 'hours'} / day
              </span>
            </p>

            <p className="mt-2 text-sm text-[#858B85]">
              {preferences.studyDays.length} selected study days per week
            </p>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#292D29]">
              <div
                className="h-full rounded-full bg-[#00E676] transition-all"
                style={{
                  width: `${(preferences.studyDays.length / 7) * 100}%`,
                }}
              />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#858B85]">
              <BookOpen size={14} />
              <span>{preferences.weeklyFocus}</span>
            </div>
          </section>

          <section className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
            <div className="flex items-center gap-3">
              <Database size={19} className="text-[#00E676]" />
              <h3 className="font-semibold text-[#E5E7E5]">Data management</h3>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-[#858B85]">
              Your current preferences and learning progress are stored in
              this browser.
            </p>

            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#454945] px-3 py-2.5 text-sm font-medium text-[#A1A7A1] transition hover:border-[#00E676] hover:text-[#00E676]"
            >
              <RotateCcw size={15} />
              Reset preferences
            </button>

            <button
              type="button"
              onClick={resetProgress}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-900/60 px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
            >
              <AlertTriangle size={15} />
              Clear learning progress
            </button>
          </section>
        </aside>
      </div>

      {/* Reset preferences confirmation */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-dialog-title"
            className="w-full max-w-md rounded-xl border border-[#292D29] bg-[#111311] p-6 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-400/10">
              <AlertTriangle size={21} className="text-orange-400" />
            </div>

            <h3
              id="reset-dialog-title"
              className="mt-4 text-lg font-semibold text-[#E5E7E5]"
            >
              Reset preferences?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-[#858B85]">
              Your study goals, career preferences, and notification
              selections will return to their default values. Your projects
              and practice progress will remain untouched.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="rounded-lg border border-[#292D29] px-4 py-2 text-sm text-[#A1A7A1] hover:bg-[#191C19]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={resetPreferences}
                className="rounded-lg bg-[#00E676] px-4 py-2 text-sm font-semibold text-[#071109] hover:bg-[#32F58C]"
              >
                Reset preferences
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#292D29] pt-5">
        <p className="text-xs text-[#626862]">
          Preferences are saved in this browser. Backend synchronization will
          be added later.
        </p>

        <button
          type="button"
          onClick={saveSettings}
          className="inline-flex items-center gap-2 rounded-lg bg-[#00E676] px-5 py-2.5 text-sm font-semibold text-[#071109] transition hover:bg-[#32F58C]"
        >
          <Save size={16} />
          Save preferences
        </button>
      </div>
    </section>
  )
}

export default Settings