import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Code2,
  Flame,
  FolderKanban,
  Target,
  TrendingUp,
} from 'lucide-react'

type ProjectStatus = 'Planned' | 'In Progress' | 'Completed'

type Project = {
  id: string
  name: string
  status: ProjectStatus
  milestones?: { completed: boolean }[]
}

type PracticeTopic = {
  name: string
  total: number
  completed: number
}

type DailyActivity = {
  date: string
  minutes: number
}

const PROJECTS_KEY = 'preppilot-projects'
const SOLVED_KEY = 'preppilot-practice-solved'
const ACTIVITY_KEY = 'preppilot-study-activity'

const topics: PracticeTopic[] = [
  { name: 'Arrays & Hashing', total: 18, completed: 0 },
  { name: 'Two Pointers', total: 12, completed: 0 },
  { name: 'Sliding Window', total: 10, completed: 0 },
  { name: 'Binary Search', total: 12, completed: 0 },
  { name: 'Recursion & Backtracking', total: 15, completed: 0 },
  { name: 'Trees & Graphs', total: 20, completed: 0 },
]

function readArray<T>(key: string): T[] {
  try {
    const value = localStorage.getItem(key)

    if (!value) return []

    const parsed: unknown = JSON.parse(value)

    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

function getStudyActivity(): DailyActivity[] {
  try {
    const value = localStorage.getItem(ACTIVITY_KEY)

    if (!value) return []

    const parsed: unknown = JSON.parse(value)

    return Array.isArray(parsed) ? (parsed as DailyActivity[]) : []
  } catch {
    return []
  }
}

function getDayKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getWeekDays() {
  const today = new Date()
  const day = today.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(today)

  monday.setDate(today.getDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)

    date.setDate(monday.getDate() + index)

    return {
      key: getDayKey(date),
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
    }
  })
}

function getProjectProgress(project: Project) {
  const milestones = project.milestones ?? []

  if (milestones.length === 0) {
    return project.status === 'Completed' ? 100 : 0
  }

  return Math.round(
    (milestones.filter((milestone) => milestone.completed).length /
      milestones.length) *
      100,
  )
}

export default function Analytics() {
  const [projects, setProjects] = useState<Project[]>([])
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [activity, setActivity] = useState<DailyActivity[]>([])
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  useEffect(() => {
    function loadData() {
      setProjects(readArray<Project>(PROJECTS_KEY))

      const savedSolved = localStorage.getItem(SOLVED_KEY)

      try {
        const parsed: unknown = savedSolved
          ? JSON.parse(savedSolved)
          : []

        setSolvedIds(
          Array.isArray(parsed)
            ? parsed.filter((id): id is string => typeof id === 'string')
            : [],
        )
      } catch {
        setSolvedIds([])
      }

      setActivity(getStudyActivity())
      setLastUpdated(Date.now())
    }

    loadData()

    window.addEventListener('focus', loadData)
    window.addEventListener('storage', loadData)

    return () => {
      window.removeEventListener('focus', loadData)
      window.removeEventListener('storage', loadData)
    }
  }, [])

  const weekDays = useMemo(() => getWeekDays(), [lastUpdated])

  const weekActivity = useMemo(
    () =>
      weekDays.map((day) => ({
        ...day,
        minutes:
          activity.find((entry) => entry.date === day.key)?.minutes ?? 0,
      })),
    [weekDays, activity],
  )

  const totalStudyMinutes = activity.reduce(
    (total, entry) => total + Math.max(0, Number(entry.minutes) || 0),
    0,
  )

  const weeklyMinutes = weekActivity.reduce(
    (total, day) => total + day.minutes,
    0,
  )

  const activeDays = activity.filter((entry) => entry.minutes > 0).length

  const completedProjects = projects.filter(
    (project) => project.status === 'Completed',
  ).length

  const inProgressProjects = projects.filter(
    (project) => project.status === 'In Progress',
  ).length

  const projectProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce(
            (total, project) => total + getProjectProgress(project),
            0,
          ) / projects.length,
        )
      : 0

  const solvedCount = solvedIds.length

  const maxDailyMinutes = Math.max(
    60,
    ...weekActivity.map((day) => day.minutes),
  )

  const hours = Math.floor(totalStudyMinutes / 60)
  const minutes = totalStudyMinutes % 60

  const statCards = [
    {
      title: 'Problems solved',
      value: solvedCount.toString(),
      description: 'From your Practice workspace',
      icon: Brain,
      color: 'text-[#00E676]',
      iconBg: 'bg-[#00E676]/10',
    },
    {
      title: 'Study time tracked',
      value: `${hours}h ${minutes}m`,
      description: 'Recorded study activity',
      icon: Clock3,
      color: 'text-sky-400',
      iconBg: 'bg-sky-400/10',
    },
    {
      title: 'Active study days',
      value: activeDays.toString(),
      description: 'Days with recorded study time',
      icon: Flame,
      color: 'text-orange-400',
      iconBg: 'bg-orange-400/10',
    },
    {
      title: 'Projects completed',
      value: completedProjects.toString(),
      description: `${inProgressProjects} currently in progress`,
      icon: FolderKanban,
      color: 'text-purple-400',
      iconBg: 'bg-purple-400/10',
    },
  ]

  const topicProgress = topics.map((topic) => {
    const completed = Math.min(
      topic.total,
      solvedIds.filter((id) =>
        id.toLowerCase().includes(topic.name.toLowerCase()),
      ).length,
    )

    return {
      ...topic,
      completed,
      percentage: Math.round((completed / topic.total) * 100),
    }
  })

  return (
    <section className="space-y-7 pb-8">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#00E676]">
          MEASURE YOUR PROGRESS
        </p>

        <h2 className="text-3xl font-bold tracking-tight text-[#E5E7E5]">
          Analytics
        </h2>

        <p className="mt-2 max-w-xl text-sm text-[#858B85]">
          Understand your consistency, see what you have accomplished, and
          decide what deserves your attention next.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-[#292D29] bg-[#111311] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs leading-relaxed text-[#858B85] sm:text-sm">
                  {stat.title}
                </p>

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <Icon size={18} className={stat.color} />
                </div>
              </div>

              <p className="mt-4 text-2xl font-bold text-[#E5E7E5] sm:text-3xl">
                {stat.value}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-[#626862]">
                {stat.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Weekly activity */}
      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-[#E5E7E5]">
                Weekly study activity
              </h3>
              <p className="mt-1 text-xs text-[#858B85]">
                Your recorded study minutes this week
              </p>
            </div>

            <div className="rounded-lg border border-[#292D29] bg-[#191C19] px-3 py-2">
              <p className="text-xs text-[#858B85]">This week</p>
              <p className="mt-1 text-lg font-bold text-[#00E676]">
                {(weeklyMinutes / 60).toFixed(1)}h
              </p>
            </div>
          </div>

          <div className="mt-7 flex h-48 items-end justify-between gap-2 sm:gap-4">
            {weekActivity.map((day) => {
              const height =
                day.minutes > 0
                  ? Math.max(
                      8,
                      Math.round((day.minutes / maxDailyMinutes) * 100),
                    )
                  : 3

              const isToday = day.key === getDayKey(new Date())

              return (
                <div
                  key={day.key}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                >
                  <span className="text-[10px] text-[#858B85] sm:text-xs">
                    {day.minutes > 0 ? `${day.minutes}m` : ''}
                  </span>

                  <div className="flex h-full w-full items-end justify-center">
                    <div
                      title={`${day.label}: ${day.minutes} minutes`}
                      className={`w-full max-w-10 rounded-t-md transition-all ${
                        isToday
                          ? 'bg-[#00E676]'
                          : day.minutes > 0
                            ? 'bg-[#00E676]/40'
                            : 'bg-[#292D29]'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>

                  <span
                    className={`text-xs ${
                      isToday ? 'font-semibold text-[#00E676]' : 'text-[#858B85]'
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-[#292D29] pt-4 text-xs text-[#626862]">
            <span className="h-2 w-2 rounded-full bg-[#00E676]" />
            Study minutes appear when activity tracking is implemented.
          </div>
        </div>

        {/* Project overview */}
        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/10">
              <FolderKanban size={20} className="text-purple-400" />
            </div>

            <div>
              <h3 className="font-semibold text-[#E5E7E5]">
                Project overview
              </h3>
              <p className="text-xs text-[#858B85]">
                Across your project workspace
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-bold text-[#E5E7E5]">
                  {projectProgress}%
                </p>
                <p className="mt-1 text-xs text-[#858B85]">
                  Average milestone completion
                </p>
              </div>

              <TrendingUp size={23} className="mb-1 text-[#00E676]" />
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#292D29]">
              <div
                className="h-full rounded-full bg-[#00E676] transition-all"
                style={{ width: `${projectProgress}%` }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {[
              {
                label: 'Completed',
                count: completedProjects,
                color: 'bg-[#00E676]',
              },
              {
                label: 'In progress',
                count: inProgressProjects,
                color: 'bg-sky-400',
              },
              {
                label: 'Planned',
                count: projects.filter((p) => p.status === 'Planned').length,
                color: 'bg-[#626862]',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${item.color}`} />
                  <span className="text-sm text-[#A1A7A1]">{item.label}</span>
                </div>

                <span className="text-sm font-semibold text-[#E5E7E5]">
                  {item.count}
                </span>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <p className="mt-4 text-xs text-[#626862]">
              Add a project in Projects to start tracking milestones.
            </p>
          )}
        </div>
      </div>

      {/* DSA progress */}
      <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-[#E5E7E5]">
              DSA topic progress
            </h3>
            <p className="mt-1 text-xs text-[#858B85]">
              A topic-level overview of your practice
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#292D29] bg-[#191C19] px-3 py-2">
            <Code2 size={15} className="text-[#00E676]" />
            <span className="text-xs text-[#A1A7A1]">
              {solvedCount} solved
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
          {topicProgress.map((topic) => (
            <div key={topic.name}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm text-[#C5CAC5]">{topic.name}</span>
                <span className="shrink-0 text-xs text-[#858B85]">
                  {topic.completed}/{topic.total}
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-[#292D29]">
                <div
                  className="h-full rounded-full bg-[#00E676] transition-all"
                  style={{ width: `${topic.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-[#292D29] bg-[#191C19] p-3">
          <p className="text-xs leading-relaxed text-[#858B85]">
            Topic-level completion is illustrative until Practice records
            explicit topic metadata for each solved problem. The overall solved
            count above uses your saved Practice data.
          </p>
        </div>
      </div>

      {/* Consistency and next steps */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-400/10">
              <Activity size={20} className="text-orange-400" />
            </div>

            <div>
              <h3 className="font-semibold text-[#E5E7E5]">
                Learning consistency
              </h3>
              <p className="text-xs text-[#858B85]">
                Build a sustainable routine
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-[#292D29] bg-[#191C19] p-4">
              <p className="text-2xl font-bold text-[#E5E7E5]">
                {activeDays}
              </p>
              <p className="mt-1 text-xs text-[#858B85]">
                Active days recorded
              </p>
            </div>

            <div className="rounded-lg border border-[#292D29] bg-[#191C19] p-4">
              <p className="text-2xl font-bold text-[#E5E7E5]">
                {weeklyMinutes > 0
                  ? `${Math.round(weeklyMinutes / 60)}h`
                  : '—'}
              </p>
              <p className="mt-1 text-xs text-[#858B85]">
                Study time this week
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-[#626862]">
            Study streaks and daily study time will become meaningful once
            PrepPilot records study sessions consistently.
          </p>
        </div>

        <div className="rounded-xl border border-[#14532D] bg-gradient-to-br from-[#052E16]/60 to-[#111311] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00E676]/10">
              <Target size={20} className="text-[#00E676]" />
            </div>

            <div>
              <h3 className="font-semibold text-[#E5E7E5]">
                Keep moving forward
              </h3>
              <p className="text-xs text-[#858B85]">
                Small steps compound over time
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#00E676]" />
              <div>
                <p className="text-sm text-[#E5E7E5]">Practice consistently</p>
                <p className="mt-1 text-xs leading-relaxed text-[#858B85]">
                  Focus on understanding patterns rather than chasing a high
                  problem count.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen size={17} className="mt-0.5 shrink-0 text-[#00E676]" />
              <div>
                <p className="text-sm text-[#E5E7E5]">Review what you learned</p>
                <p className="mt-1 text-xs leading-relaxed text-[#858B85]">
                  Revisit difficult problems and strengthen weak topics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays size={17} className="mt-0.5 shrink-0 text-[#00E676]" />
              <div>
                <p className="text-sm text-[#E5E7E5]">Protect your routine</p>
                <p className="mt-1 text-xs leading-relaxed text-[#858B85]">
                  A realistic weekly plan is more valuable than an intense
                  schedule you cannot maintain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-center text-xs text-[#626862]">
        <ArrowUpRight size={13} />
        <span>
          Analytics uses browser data where available. Some metrics are
          illustrative until activity tracking is connected.
        </span>
        <ArrowDownRight size={13} />
      </div>
    </section>
  )
}