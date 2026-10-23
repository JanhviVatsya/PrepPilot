import { useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Code2,
  Flame,
  Layers3,
  Target,
} from 'lucide-react'

type Topic = {
  id: string
  title: string
  duration: string
}

type Subject = {
  name: string
  topics: Topic[]
}

type Phase = {
  id: number
  title: string
  description: string
  duration: string
  subjects: Subject[]
}

const phases: Phase[] = [
  {
    id: 1,
    title: 'Programming Foundations',
    description: 'Build a strong foundation in Java and object-oriented programming.',
    duration: '2 weeks',
    subjects: [
      {
        name: 'Java Fundamentals',
        topics: [
          { id: 'java-1', title: 'Variables, data types and control flow', duration: '2 hrs' },
          { id: 'java-2', title: 'Methods, arrays and strings', duration: '3 hrs' },
          { id: 'java-3', title: 'Object-oriented programming', duration: '4 hrs' },
          { id: 'java-4', title: 'Collections and generics', duration: '3 hrs' },
        ],
      },
      {
        name: 'Problem Solving',
        topics: [
          { id: 'problem-1', title: 'Time and space complexity', duration: '2 hrs' },
          { id: 'problem-2', title: 'Basic problem-solving patterns', duration: '3 hrs' },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Data Structures & Algorithms',
    description: 'Develop problem-solving skills for technical interviews.',
    duration: '4 weeks',
    subjects: [
      {
        name: 'Core Data Structures',
        topics: [
          { id: 'dsa-1', title: 'Arrays and strings', duration: '4 hrs' },
          { id: 'dsa-2', title: 'Binary search', duration: '3 hrs' },
          { id: 'dsa-3', title: 'Linked lists and stacks', duration: '4 hrs' },
          { id: 'dsa-4', title: 'Queues and hash maps', duration: '3 hrs' },
        ],
      },
      {
        name: 'Algorithms',
        topics: [
          { id: 'algo-1', title: 'Recursion and backtracking', duration: '5 hrs' },
          { id: 'algo-2', title: 'Trees and binary search trees', duration: '5 hrs' },
          { id: 'algo-3', title: 'Sorting and greedy algorithms', duration: '4 hrs' },
          { id: 'algo-4', title: 'Graphs and dynamic programming', duration: '8 hrs' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Backend Development',
    description: 'Learn to design and build production-style backend applications.',
    duration: '3 weeks',
    subjects: [
      {
        name: 'Spring Boot',
        topics: [
          { id: 'spring-1', title: 'Spring Boot fundamentals', duration: '3 hrs' },
          { id: 'spring-2', title: 'REST APIs and HTTP methods', duration: '4 hrs' },
          { id: 'spring-3', title: 'Dependency injection and layers', duration: '3 hrs' },
          { id: 'spring-4', title: 'Validation and exception handling', duration: '3 hrs' },
        ],
      },
      {
        name: 'Backend Essentials',
        topics: [
          { id: 'backend-1', title: 'Authentication and authorization', duration: '4 hrs' },
          { id: 'backend-2', title: 'Testing backend APIs', duration: '3 hrs' },
          { id: 'backend-3', title: 'Docker and application deployment', duration: '4 hrs' },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Databases & Computer Science',
    description: 'Strengthen your understanding of data and core engineering concepts.',
    duration: '2 weeks',
    subjects: [
      {
        name: 'Database Systems',
        topics: [
          { id: 'db-1', title: 'SQL queries and joins', duration: '3 hrs' },
          { id: 'db-2', title: 'Indexes and query optimization', duration: '3 hrs' },
          { id: 'db-3', title: 'Normalization and transactions', duration: '3 hrs' },
        ],
      },
      {
        name: 'Computer Science Fundamentals',
        topics: [
          { id: 'cs-1', title: 'Operating systems', duration: '3 hrs' },
          { id: 'cs-2', title: 'Computer networks', duration: '3 hrs' },
          { id: 'cs-3', title: 'DBMS interview revision', duration: '2 hrs' },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Projects & Interview Preparation',
    description: 'Apply your knowledge and prepare to demonstrate it in interviews.',
    duration: '3 weeks',
    subjects: [
      {
        name: 'Practical Projects',
        topics: [
          { id: 'project-1', title: 'Build a complete REST API project', duration: '6 hrs' },
          { id: 'project-2', title: 'Add database integration and validation', duration: '4 hrs' },
          { id: 'project-3', title: 'Containerize and deploy the application', duration: '4 hrs' },
        ],
      },
      {
        name: 'Interview Readiness',
        topics: [
          { id: 'interview-1', title: 'Object-oriented design and SOLID', duration: '3 hrs' },
          { id: 'interview-2', title: 'System design fundamentals', duration: '4 hrs' },
          { id: 'interview-3', title: 'Mock interviews and project walkthroughs', duration: '4 hrs' },
        ],
      },
    ],
  },
]

const totalTopics = phases.reduce(
  (total, phase) =>
    total +
    phase.subjects.reduce(
      (subjectTotal, subject) => subjectTotal + subject.topics.length,
      0,
    ),
  0,
)

export default function MyPlan() {
  const [completedTopics, setCompletedTopics] = useState<string[]>([])
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1)

  const completedCount = completedTopics.length
  const overallProgress = Math.round((completedCount / totalTopics) * 100)

  const getPhaseProgress = (phase: Phase) => {
    const topicIds = phase.subjects.flatMap((subject) =>
      subject.topics.map((topic) => topic.id),
    )

    const completed = topicIds.filter((id) =>
      completedTopics.includes(id),
    ).length

    return {
      completed,
      total: topicIds.length,
      percentage: Math.round((completed / topicIds.length) * 100),
    }
  }

  const toggleTopic = (topicId: string) => {
    setCompletedTopics((previous) =>
      previous.includes(topicId)
        ? previous.filter((id) => id !== topicId)
        : [...previous, topicId],
    )
  }

  const currentPhase =
    phases.find((phase) => getPhaseProgress(phase).percentage < 100) ??
    phases[phases.length - 1]

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <section>
        <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[#00E676]">
          YOUR ROADMAP
        </p>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">My Plan</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#858B85]">
              A structured path from learning the fundamentals to becoming
              interview-ready. Progress at a pace you can sustain.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-lg border border-[#285338] bg-[#121D15] px-3 py-2 text-xs font-medium text-[#00E676]">
            <Target size={15} />
            Backend Developer
          </span>
        </div>
      </section>

      {/* Progress overview */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#858B85]">Overall progress</p>
            <CheckCircle2 size={19} className="text-[#00E676]" />
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold">{overallProgress}%</p>
            <p className="text-xs text-[#858B85]">
              {completedCount}/{totalTopics} topics
            </p>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#292D29]">
            <div
              className="h-full rounded-full bg-[#00E676] transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#858B85]">Current phase</p>
            <Layers3 size={19} className="text-[#00E676]" />
          </div>

          <p className="mt-3 text-xl font-semibold">
            {currentPhase.title}
          </p>

          <p className="mt-2 text-sm text-[#858B85]">
            Phase {currentPhase.id} of {phases.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#858B85]">Weekly study target</p>
            <Clock3 size={19} className="text-[#00E676]" />
          </div>

          <p className="mt-3 text-3xl font-semibold">7 hours</p>

          <p className="mt-2 flex items-center gap-2 text-sm text-[#858B85]">
            <Flame size={15} className="text-[#00E676]" />
            Consistency over intensity
          </p>
        </div>
      </section>

      {/* Roadmap */}
      <section className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Your learning roadmap</h3>
          <p className="mt-1 text-sm text-[#858B85]">
            Expand a phase to explore its subjects and mark topics as complete.
          </p>
        </div>

        <div className="space-y-3">
          {phases.map((phase) => {
            const progress = getPhaseProgress(phase)
            const isExpanded = expandedPhase === phase.id
            const isComplete = progress.percentage === 100

            return (
              <div
                key={phase.id}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  isExpanded
                    ? 'border-[#3B5140] bg-[#141714]'
                    : 'border-[#292D29] bg-[#171917]'
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedPhase(isExpanded ? null : phase.id)
                  }
                  aria-expanded={isExpanded}
                  className="flex w-full items-start gap-3 p-4 text-left sm:gap-4 sm:p-5"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold ${
                      isComplete
                        ? 'border-[#285338] bg-[#122318] text-[#00E676]'
                        : 'border-[#303630] bg-[#202320] text-[#B2B8B2]'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      String(phase.id).padStart(2, '0')
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold sm:text-base">
                        {phase.title}
                      </h4>

                      {isComplete && (
                        <span className="rounded-md bg-[#14251A] px-2 py-1 text-[10px] font-medium text-[#00E676]">
                          COMPLETED
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-[#858B85] sm:text-sm">
                      {phase.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#858B85]">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} />
                        {phase.duration}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen size={13} />
                        {progress.completed}/{progress.total} topics
                      </span>
                    </div>

                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#292D29]">
                      <div
                        className="h-full rounded-full bg-[#00E676] transition-all"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-1 shrink-0 text-[#858B85]">
                    {isExpanded ? (
                      <ChevronDown size={19} />
                    ) : (
                      <ChevronRight size={19} />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-[#292D29] px-4 py-4 sm:px-5">
                    <div className="space-y-5">
                      {phase.subjects.map((subject) => (
                        <div key={subject.name}>
                          <h5 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A1A7A1]">
                            <Code2 size={14} className="text-[#00E676]" />
                            {subject.name}
                          </h5>

                          <div className="space-y-2">
                            {subject.topics.map((topic) => {
                              const isDone = completedTopics.includes(topic.id)

                              return (
                                <button
                                  key={topic.id}
                                  type="button"
                                  onClick={() => toggleTopic(topic.id)}
                                  aria-pressed={isDone}
                                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                                    isDone
                                      ? 'border-[#285338] bg-[#121D15]'
                                      : 'border-[#292D29] bg-[#111311] hover:border-[#465047]'
                                  }`}
                                >
                                  <CheckCircle2
                                    size={18}
                                    className={`shrink-0 ${
                                      isDone
                                        ? 'text-[#00E676]'
                                        : 'text-[#656B65]'
                                    }`}
                                  />

                                  <span
                                    className={`min-w-0 flex-1 text-sm ${
                                      isDone
                                        ? 'text-[#858B85] line-through'
                                        : 'text-[#D5DAD5]'
                                    }`}
                                  >
                                    {topic.title}
                                  </span>

                                  <span className="shrink-0 text-[11px] text-[#858B85]">
                                    {topic.duration}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Weekly focus */}
      <section className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#285338] bg-[#122318]">
            <Clock3 size={19} className="text-[#00E676]" />
          </div>

          <div>
            <h3 className="font-semibold">Your weekly focus</h3>
            <p className="mt-1 text-sm leading-6 text-[#858B85]">
              Aim for a manageable mix of problem-solving, backend development,
              and revision. Adjust the workload around your actual availability.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { day: 'Focus 01', subject: 'DSA practice', time: '3 sessions' },
            { day: 'Focus 02', subject: 'Spring Boot', time: '2 sessions' },
            { day: 'Focus 03', subject: 'Revision', time: '2 sessions' },
          ].map((item) => (
            <div
              key={item.day}
              className="rounded-lg border border-[#292D29] bg-[#171917] p-4"
            >
              <p className="text-xs font-medium text-[#00E676]">
                {item.day}
              </p>
              <p className="mt-2 text-sm font-semibold">{item.subject}</p>
              <p className="mt-1 text-xs text-[#858B85]">{item.time}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs leading-5 text-[#656B65]">
        Sample roadmap for demonstration. Your personalized roadmap, study
        schedule, and saved progress will be connected in a later integration step.
      </p>
    </div>
  )
}