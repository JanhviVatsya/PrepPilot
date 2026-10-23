
import { useEffect, useState } from 'react'
import { CheckCircle2, Clock3, Flame } from 'lucide-react'

const tasks = [
  { title: 'Solve one DSA problem', detail: 'Arrays · 25 min', tag: 'DSA' },
  {
    title: 'Revise Java collections',
    detail: 'HashMap and HashSet · 15 min',
    tag: 'Revision',
  },
  {
    title: 'Build a REST endpoint',
    detail: 'Spring Boot · 20 min',
    tag: 'Project',
  },
]

export default function Today() {
  const todayKey = `preppilot-tasks-${new Date().toLocaleDateString('en-CA')}`

const [completed, setCompleted] = useState<number[]>(() => {
  try {
    const saved = localStorage.getItem(todayKey)
    return saved ? (JSON.parse(saved) as number[]) : []
  } catch {
    return []
  }
})

useEffect(() => {
  localStorage.setItem(todayKey, JSON.stringify(completed))
}, [todayKey, completed])

const progress = Math.round((completed.length / tasks.length) * 100)

  return (
    <div className="space-y-7">
      <section>
        <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[#00E676]">
          YOUR DAILY DASHBOARD
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">Today’s focus</h2>
        <p className="mt-2 text-sm text-[#858B85]">
          Make progress you can sustain.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
          <p className="text-sm text-[#858B85]">Daily progress</p>
          <div className="mt-3 flex items-end justify-between">
            <p className="text-3xl font-semibold">{progress}%</p>
            <p className="text-xs text-[#858B85]">
              {completed.length}/{tasks.length} tasks
            </p>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#292D29]">
            <div
              className="h-full rounded-full bg-[#00E676] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
          <p className="text-sm text-[#858B85]">Planned study time</p>
          <p className="mt-3 text-3xl font-semibold">60 min</p>
          <p className="mt-2 text-sm text-[#858B85]">
            A focused session is enough.
          </p>
        </div>

        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
          <p className="text-sm text-[#858B85]">Current focus</p>
          <p className="mt-3 text-xl font-semibold">Backend foundations</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-[#00E676]">
            <Flame size={16} /> Keep moving
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Today’s tasks</h3>
            <p className="mt-1 text-sm text-[#858B85]">
              One task at a time. No pressure to be perfect.
            </p>
          </div>
          <Clock3 size={21} className="text-[#00E676]" />
        </div>

        <div className="space-y-3">
          {tasks.map((task, index) => {
            const isDone = completed.includes(index)

            return (
              <button
                key={task.title}
                onClick={() =>
                  setCompleted((previous) =>
                    isDone
                      ? previous.filter((item) => item !== index)
                      : [...previous, index],
                  )
                }
                className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                  isDone
                    ? 'border-[#285338] bg-[#121D15]'
                    : 'border-[#292D29] bg-[#171917] hover:border-[#465047]'
                }`}
              >
                <CheckCircle2
                  size={20}
                  className={`mt-0.5 shrink-0 ${
                    isDone ? 'text-[#00E676]' : 'text-[#777D77]'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isDone ? 'text-[#858B85] line-through' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="mt-1 text-xs text-[#858B85]">
                    {task.detail}
                  </p>
                </div>
                <span className="rounded-md border border-[#303630] bg-[#202320] px-2 py-1 text-[11px] text-[#B2B8B2]">
                  {task.tag}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 rounded-lg border border-[#292D29] bg-[#171917] p-4">
          <p className="text-sm font-semibold">Your mentor’s note</p>
          <p className="mt-2 text-sm leading-6 text-[#A1A7A1]">
            You don’t need to finish everything today. Complete the next
            meaningful task, then reassess.
          </p>
        </div>
      </section>
    </div>
  )
}
