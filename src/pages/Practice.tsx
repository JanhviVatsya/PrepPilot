import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Filter,
  RotateCcw,
  Search,
  Target,
} from 'lucide-react'

type Difficulty = 'Easy' | 'Medium' | 'Hard'

type Problem = {
  id: string
  title: string
  topic: string
  difficulty: Difficulty
  duration: number
}

type RevisionItem = {
  id: string
  title: string
  topic: string
  description: string
}

const problems: Problem[] = [
  { id: 'p1', title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', duration: 20 },
  { id: 'p2', title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', duration: 25 },
  { id: 'p3', title: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', duration: 30 },
  { id: 'p4', title: 'Container With Most Water', topic: 'Two Pointers', difficulty: 'Medium', duration: 30 },
  { id: 'p5', title: '3Sum', topic: 'Two Pointers', difficulty: 'Medium', duration: 35 },
  { id: 'p6', title: 'Binary Search', topic: 'Binary Search', difficulty: 'Easy', duration: 20 },
  { id: 'p7', title: 'Search in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'Medium', duration: 35 },
  { id: 'p8', title: 'Reverse Linked List', topic: 'Linked Lists', difficulty: 'Easy', duration: 20 },
  { id: 'p9', title: 'Linked List Cycle', topic: 'Linked Lists', difficulty: 'Easy', duration: 25 },
  { id: 'p10', title: 'Valid Parentheses', topic: 'Stacks', difficulty: 'Easy', duration: 20 },
  { id: 'p11', title: 'Daily Temperatures', topic: 'Stacks', difficulty: 'Medium', duration: 35 },
  { id: 'p12', title: 'Subsets', topic: 'Recursion', difficulty: 'Medium', duration: 30 },
  { id: 'p13', title: 'Combination Sum', topic: 'Recursion', difficulty: 'Medium', duration: 35 },
  { id: 'p14', title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', duration: 20 },
  { id: 'p15', title: 'Validate Binary Search Tree', topic: 'Trees', difficulty: 'Medium', duration: 30 },
  { id: 'p16', title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', duration: 35 },
  { id: 'p17', title: 'Course Schedule', topic: 'Graphs', difficulty: 'Medium', duration: 40 },
  { id: 'p18', title: 'Longest Increasing Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', duration: 40 },
  { id: 'p19', title: 'Trapping Rain Water', topic: 'Two Pointers', difficulty: 'Hard', duration: 45 },
  { id: 'p20', title: 'Median of Two Sorted Arrays', topic: 'Binary Search', difficulty: 'Hard', duration: 50 },
]

const initialRevisionItems: RevisionItem[] = [
  {
    id: 'r1',
    title: 'HashMap and HashSet',
    topic: 'Java Collections',
    description: 'Review lookup complexity, duplicates, and common use cases.',
  },
  {
    id: 'r2',
    title: 'Recursion fundamentals',
    topic: 'Recursion',
    description: 'Practise base cases, recursive calls, and call-stack tracing.',
  },
  {
    id: 'r3',
    title: 'Binary search boundaries',
    topic: 'Binary Search',
    description: 'Review low/high updates and loop termination conditions.',
  },
]

const topics = [
  'All topics',
  ...Array.from(new Set(problems.map((problem) => problem.topic))),
]

const difficulties: Array<'All difficulties' | Difficulty> = [
  'All difficulties',
  'Easy',
  'Medium',
  'Hard',
]

const difficultyStyles: Record<Difficulty, string> = {
  Easy: 'border-[#285338] bg-[#122318] text-[#70D995]',
  Medium: 'border-[#65512A] bg-[#282115] text-[#E8C879]',
  Hard: 'border-[#693A3A] bg-[#291919] text-[#F08D8D]',
}

function readSaved<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : fallback
  } catch {
    return fallback
  }
}

export default function Practice() {
  const [solvedIds, setSolvedIds] = useState<string[]>(() =>
    readSaved<string[]>('preppilot-practice-solved', []),
  )

  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>(() =>
    readSaved<RevisionItem[]>('preppilot-revision-items', initialRevisionItems),
  )

  const [reviewedIds, setReviewedIds] = useState<string[]>(() =>
    readSaved<string[]>('preppilot-revision-reviewed', []),
  )

  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('All topics')
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<'All difficulties' | Difficulty>('All difficulties')
  const [activeTab, setActiveTab] = useState<'practice' | 'revision'>('practice')

  useEffect(() => {
    localStorage.setItem('preppilot-practice-solved', JSON.stringify(solvedIds))
  }, [solvedIds])

  useEffect(() => {
    localStorage.setItem('preppilot-revision-items', JSON.stringify(revisionItems))
  }, [revisionItems])

  useEffect(() => {
    localStorage.setItem('preppilot-revision-reviewed', JSON.stringify(reviewedIds))
  }, [reviewedIds])

  const filteredProblems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return problems.filter((problem) => {
      const matchesSearch =
        !query ||
        problem.title.toLowerCase().includes(query) ||
        problem.topic.toLowerCase().includes(query)

      const matchesTopic =
        selectedTopic === 'All topics' || problem.topic === selectedTopic

      const matchesDifficulty =
        selectedDifficulty === 'All difficulties' ||
        problem.difficulty === selectedDifficulty

      return matchesSearch && matchesTopic && matchesDifficulty
    })
  }, [search, selectedTopic, selectedDifficulty])

  const solvedCount = solvedIds.filter((id) =>
    problems.some((problem) => problem.id === id),
  ).length

  const totalMinutes = problems
    .filter((problem) => solvedIds.includes(problem.id))
    .reduce((total, problem) => total + problem.duration, 0)

  const revisionDue = revisionItems.filter(
    (item) => !reviewedIds.includes(item.id),
  ).length

  const toggleSolved = (id: string) => {
    setSolvedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    )
  }

  const toggleReviewed = (id: string) => {
    setReviewedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    )
  }

  const addRevisionItem = () => {
    const title = window.prompt('Which concept would you like to revise?')

    if (!title?.trim()) return

    const item: RevisionItem = {
      id: `r-${Date.now()}`,
      title: title.trim(),
      topic: 'Personal revision',
      description: 'Added by you. Revisit this concept when you are ready.',
    }

    setRevisionItems((previous) => [...previous, item])
    setReviewedIds((previous) => previous.filter((id) => id !== item.id))
  }

  const removeRevisionItem = (id: string) => {
    setRevisionItems((previous) => previous.filter((item) => item.id !== id))
    setReviewedIds((previous) => previous.filter((item) => item !== id))
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <section>
        <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[#00E676]">
          LEARN BY DOING
        </p>

        <h2 className="text-3xl font-bold sm:text-4xl">
          Practice &amp; Revision
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#858B85]">
          Build problem-solving confidence through deliberate practice and
          revisit important concepts regularly.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#858B85]">Problems solved</p>
            <CheckCircle2 size={19} className="text-[#00E676]" />
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-3xl font-semibold">{solvedCount}</p>
            <p className="text-xs text-[#858B85]">of {problems.length} sample problems</p>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#292D29]">
            <div
              className="h-full rounded-full bg-[#00E676] transition-all"
              style={{ width: `${(solvedCount / problems.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#858B85]">Practice time logged</p>
            <Clock3 size={19} className="text-[#00E676]" />
          </div>

          <p className="mt-3 text-3xl font-semibold">
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </p>

          <p className="mt-2 text-sm text-[#858B85]">
            Estimated time for solved problems
          </p>
        </div>

        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#858B85]">Revision remaining</p>
            <RotateCcw size={19} className="text-[#00E676]" />
          </div>

          <p className="mt-3 text-3xl font-semibold">{revisionDue}</p>

          <p className="mt-2 text-sm text-[#858B85]">
            Concepts waiting for review
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="rounded-xl border border-[#292D29] bg-[#111311] p-4 sm:p-6">
        <div className="flex flex-wrap gap-2 border-b border-[#292D29] pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('practice')}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'practice'
                ? 'bg-[#173020] text-[#00E676]'
                : 'text-[#858B85] hover:bg-[#202320] hover:text-[#E5E7E5]'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Target size={16} />
              Practice problems
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('revision')}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'revision'
                ? 'bg-[#173020] text-[#00E676]'
                : 'text-[#858B85] hover:bg-[#202320] hover:text-[#E5E7E5]'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <RotateCcw size={16} />
              Revision queue
              {revisionDue > 0 && (
                <span className="rounded-full bg-[#292D29] px-2 py-0.5 text-xs">
                  {revisionDue}
                </span>
              )}
            </span>
          </button>
        </div>

        {activeTab === 'practice' ? (
          <div className="pt-5">
            <div className="mb-5">
              <h3 className="text-lg font-semibold">Problem workspace</h3>
              <p className="mt-1 text-sm text-[#858B85]">
                Search and filter the sample problem set. Mark a problem solved
                when you have completed it.
              </p>
            </div>

            {/* Search and filters */}
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px]">
              <label className="flex min-w-0 items-center gap-3 rounded-lg border border-[#292D29] bg-[#171917] px-3">
                <Search size={17} className="shrink-0 text-[#858B85]" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search problems or topics..."
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#E5E7E5] outline-none placeholder:text-[#656B65]"
                />
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-[#292D29] bg-[#171917] px-3">
                <Filter size={15} className="shrink-0 text-[#858B85]" />
                <select
                  value={selectedTopic}
                  onChange={(event) => setSelectedTopic(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#D5DAD5] outline-none"
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic} className="bg-[#171917]">
                      {topic}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-[#292D29] bg-[#171917] px-3">
                <BookOpen size={15} className="shrink-0 text-[#858B85]" />
                <select
                  value={selectedDifficulty}
                  onChange={(event) =>
                    setSelectedDifficulty(
                      event.target.value as 'All difficulties' | Difficulty,
                    )
                  }
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#D5DAD5] outline-none"
                >
                  {difficulties.map((difficulty) => (
                    <option
                      key={difficulty}
                      value={difficulty}
                      className="bg-[#171917]"
                    >
                      {difficulty}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="mt-4 text-xs text-[#858B85]">
              Showing {filteredProblems.length} of {problems.length} problems
            </p>

            {/* Problem list */}
            <div className="mt-3 space-y-2">
              {filteredProblems.map((problem) => {
                const isSolved = solvedIds.includes(problem.id)

                return (
                  <div
                    key={problem.id}
                    className={`flex flex-wrap items-center gap-3 rounded-lg border p-4 transition-colors sm:flex-nowrap ${
                      isSolved
                        ? 'border-[#285338] bg-[#121D15]'
                        : 'border-[#292D29] bg-[#171917]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSolved(problem.id)}
                      aria-label={
                        isSolved
                          ? `Mark ${problem.title} as unsolved`
                          : `Mark ${problem.title} as solved`
                      }
                      aria-pressed={isSolved}
                      className="shrink-0"
                    >
                      <CheckCircle2
                        size={20}
                        className={
                          isSolved ? 'text-[#00E676]' : 'text-[#656B65]'
                        }
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          isSolved
                            ? 'text-[#858B85] line-through'
                            : 'text-[#E5E7E5]'
                        }`}
                      >
                        {problem.title}
                      </p>

                      <p className="mt-1 text-xs text-[#858B85]">
                        {problem.topic}
                      </p>
                    </div>

                    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                      <span
                        className={`rounded-md border px-2.5 py-1 text-xs ${
                          difficultyStyles[problem.difficulty]
                        }`}
                      >
                        {problem.difficulty}
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs text-[#858B85]">
                        <Clock3 size={13} />
                        {problem.duration} min
                      </span>
                    </div>
                  </div>
                )
              })}

              {filteredProblems.length === 0 && (
                <div className="rounded-lg border border-dashed border-[#303630] p-8 text-center">
                  <Search size={22} className="mx-auto text-[#656B65]" />
                  <p className="mt-3 text-sm font-medium">
                    No matching problems
                  </p>
                  <p className="mt-1 text-xs text-[#858B85]">
                    Try another search term or change your filters.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch('')
                      setSelectedTopic('All topics')
                      setSelectedDifficulty('All difficulties')
                    }}
                    className="mt-4 text-sm font-medium text-[#00E676] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="pt-5">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Revision queue</h3>
                <p className="mt-1 text-sm text-[#858B85]">
                  Keep important concepts fresh by revisiting them regularly.
                </p>
              </div>

              <button
                type="button"
                onClick={addRevisionItem}
                className="rounded-lg border border-[#285338] bg-[#14251A] px-3 py-2 text-sm font-medium text-[#00E676] transition-colors hover:bg-[#1A3422]"
              >
                + Add concept
              </button>
            </div>

            {revisionItems.length > 0 ? (
              <div className="space-y-3">
                {revisionItems.map((item) => {
                  const isReviewed = reviewedIds.includes(item.id)

                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-4 ${
                        isReviewed
                          ? 'border-[#285338] bg-[#121D15]'
                          : 'border-[#292D29] bg-[#171917]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => toggleReviewed(item.id)}
                          aria-pressed={isReviewed}
                          aria-label={
                            isReviewed
                              ? `Mark ${item.title} as needing review`
                              : `Mark ${item.title} as reviewed`
                          }
                          className="mt-0.5 shrink-0"
                        >
                          <CheckCircle2
                            size={20}
                            className={
                              isReviewed
                                ? 'text-[#00E676]'
                                : 'text-[#656B65]'
                            }
                          />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4
                              className={`text-sm font-semibold ${
                                isReviewed ? 'text-[#858B85]' : ''
                              }`}
                            >
                              {item.title}
                            </h4>

                            {isReviewed && (
                              <span className="rounded-md bg-[#14251A] px-2 py-1 text-[10px] font-medium text-[#00E676]">
                                REVIEWED
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-[#00E676]">
                            {item.topic}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-[#858B85]">
                            {item.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeRevisionItem(item.id)}
                          className="shrink-0 text-xs text-[#858B85] hover:text-[#F08D8D]"
                          aria-label={`Remove ${item.title} from revision queue`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#303630] p-8 text-center">
                <CheckCircle2
                  size={24}
                  className="mx-auto text-[#00E676]"
                />
                <p className="mt-3 text-sm font-medium">
                  Your revision queue is empty
                </p>
                <p className="mt-1 text-xs text-[#858B85]">
                  Add a concept whenever you want to revisit something.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <p className="text-xs leading-5 text-[#656B65]">
        Demonstration problem set. Solved status and revision items are saved
        in this browser. External coding-platform links, spaced-repetition
        scheduling, and cross-page synchronization will be added separately.
      </p>
    </div>
  )
}