import { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  FolderKanban,
  CircleCheck,
  Clock3,
  CircleDashed,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  CalendarDays,
  Code2,
  Target,
} from 'lucide-react'

type ProjectStatus = 'Planned' | 'In Progress' | 'Completed'
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

type Milestone = {
  id: string
  title: string
  completed: boolean
}

type Project = {
  id: string
  name: string
  description: string
  techStack: string[]
  difficulty: Difficulty
  status: ProjectStatus
  deadline: string
  milestones: Milestone[]
  createdAt: string
}

type ProjectForm = {
  name: string
  description: string
  techStack: string
  difficulty: Difficulty
  status: ProjectStatus
  deadline: string
  milestones: string
}

const STORAGE_KEY = 'preppilot-projects'

const initialProjects: Project[] = [
  {
    id: 'recursion-visualizer',
    name: 'Recursion Visualizer',
    description:
      'Build a tool that executes C++ code in a sandbox and visualizes recursion trees.',
    techStack: ['Java', 'Spring Boot', 'Docker', 'React'],
    difficulty: 'Advanced',
    status: 'In Progress',
    deadline: '',
    milestones: [
      { id: 'rv-1', title: 'Set up Spring Boot backend', completed: true },
      { id: 'rv-2', title: 'Create Docker execution sandbox', completed: true },
      { id: 'rv-3', title: 'Capture execution output', completed: false },
      { id: 'rv-4', title: 'Generate recursion tree visualization', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-management-api',
    name: 'Task Management API',
    description:
      'Create a REST API with authentication, task management, validation, and database persistence.',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'JWT'],
    difficulty: 'Intermediate',
    status: 'Planned',
    deadline: '',
    milestones: [
      { id: 'tm-1', title: 'Design database schema', completed: false },
      { id: 'tm-2', title: 'Implement CRUD endpoints', completed: false },
      { id: 'tm-3', title: 'Add authentication', completed: false },
      { id: 'tm-4', title: 'Write tests and deploy', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'preppilot',
    name: 'PrepPilot',
    description:
      'Build a personalized interview preparation dashboard with learning plans, practice tracking, and career planning.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    difficulty: 'Intermediate',
    status: 'In Progress',
    deadline: '',
    milestones: [
      { id: 'pp-1', title: 'Build the application layout', completed: true },
      { id: 'pp-2', title: 'Implement learning and practice pages', completed: true },
      { id: 'pp-3', title: 'Build the projects workspace', completed: false },
      { id: 'pp-4', title: 'Connect the backend', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
]

const emptyForm: ProjectForm = {
  name: '',
  description: '',
  techStack: '',
  difficulty: 'Beginner',
  status: 'Planned',
  deadline: '',
  milestones: '',
}

const statusStyles: Record<ProjectStatus, string> = {
  Planned: 'border-[#454945] bg-[#202320] text-[#A1A7A1]',
  'In Progress': 'border-[#14532D] bg-[#052E16] text-[#4ADE80]',
  Completed: 'border-[#166534] bg-[#14532D] text-[#BBF7D0]',
}

function getProjectProgress(project: Project) {
  if (project.milestones.length === 0) {
    return project.status === 'Completed' ? 100 : 0
  }

  return Math.round(
    (project.milestones.filter((milestone) => milestone.completed).length /
      project.milestones.length) *
      100,
  )
}

function getInitialProjects(): Project[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved !== null) {
      const parsed: unknown = JSON.parse(saved)

      if (Array.isArray(parsed)) {
        return parsed as Project[]
      }
    }
  } catch {
    // Fall back to the example projects if stored data cannot be read.
  }

  return initialProjects
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>(getInitialProjects)
  const [filter, setFilter] = useState<'All' | ProjectStatus>('All')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [expandedProject, setExpandedProject] = useState<string | null>(
    'recursion-visualizer',
  )
  const [form, setForm] = useState<ProjectForm>(emptyForm)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }, [projects])

  const stats = useMemo(
    () => ({
      total: projects.length,
      inProgress: projects.filter((project) => project.status === 'In Progress')
        .length,
      completed: projects.filter((project) => project.status === 'Completed')
        .length,
      planned: projects.filter((project) => project.status === 'Planned').length,
    }),
    [projects],
  )

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesStatus = filter === 'All' || project.status === filter
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.techStack.some((tech) => tech.toLowerCase().includes(query))

      return matchesStatus && matchesSearch
    })
  }, [projects, filter, search])

  function updateProjectStatus(id: string, status: ProjectStatus) {
    setProjects((current) =>
      current.map((project) => (project.id === id ? { ...project, status } : project)),
    )
  }

  function toggleMilestone(projectId: string, milestoneId: string) {
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) return project

        const milestones = project.milestones.map((milestone) =>
          milestone.id === milestoneId
            ? { ...milestone, completed: !milestone.completed }
            : milestone,
        )

        const allComplete =
          milestones.length > 0 && milestones.every((milestone) => milestone.completed)

        return {
          ...project,
          milestones,
          status: allComplete ? 'Completed' : project.status === 'Completed' ? 'In Progress' : project.status,
        }
      }),
    )
  }

  function deleteProject(id: string) {
    const confirmed = window.confirm(
      'Delete this project and all its milestones?',
    )

    if (!confirmed) return

    setProjects((current) => current.filter((project) => project.id !== id))
  }

  function addProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    if (!form.name.trim()) {
      setFormError('Please enter a project name.')
      return
    }

    const milestones: Milestone[] = form.milestones
      .split('\n')
      .map((title) => title.trim())
      .filter(Boolean)
      .map((title, index) => ({
        id: `${Date.now()}-${index}`,
        title,
        completed: false,
      }))

    const project: Project = {
      id: `${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      techStack: form.techStack
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean),
      difficulty: form.difficulty,
      status: form.status,
      deadline: form.deadline,
      milestones,
      createdAt: new Date().toISOString(),
    }

    setProjects((current) => [project, ...current])
    setExpandedProject(project.id)
    setFilter('All')
    setSearch('')
    setForm(emptyForm)
    setShowForm(false)
  }

  return (
    <section className="space-y-7 pb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#00E676]">
            BUILD YOUR SKILLS
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#E5E7E5]">
            Projects
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[#858B85]">
            Turn what you learn into demonstrable experience. Plan projects,
            track milestones, and make consistent progress.
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm)
            setFormError('')
            setShowForm(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00E676] px-4 py-2.5 text-sm font-semibold text-[#071109] transition hover:bg-[#32F58C]"
        >
          <Plus size={17} />
          Add project
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: 'Total projects',
            value: stats.total,
            icon: FolderKanban,
            note: 'In your workspace',
          },
          {
            label: 'In progress',
            value: stats.inProgress,
            icon: Clock3,
            note: 'Currently building',
          },
          {
            label: 'Completed',
            value: stats.completed,
            icon: CircleCheck,
            note: 'Ready to showcase',
          },
          {
            label: 'Planned',
            value: stats.planned,
            icon: CircleDashed,
            note: 'Up next',
          },
        ].map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[#292D29] bg-[#111311] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-[#858B85] sm:text-sm">
                  {stat.label}
                </span>
                <Icon size={18} className="shrink-0 text-[#00E676]" />
              </div>
              <p className="mt-4 text-3xl font-bold text-[#E5E7E5]">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-[#858B85]">{stat.note}</p>
            </div>
          )
        })}
      </div>

      {showForm && (
        <div className="rounded-xl border border-[#292D29] bg-[#111311] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-[#E5E7E5]">
                Create a project
              </h3>
              <p className="mt-1 text-sm text-[#858B85]">
                Define the project and break it into manageable milestones.
              </p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              aria-label="Close project form"
              className="rounded-lg p-2 text-[#858B85] transition hover:bg-[#191C19] hover:text-white"
            >
              <X size={19} />
            </button>
          </div>

          <form onSubmit={addProject} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-[#A1A7A1]">
                Project name *
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Expense Tracker API"
                  className="mt-2 w-full rounded-lg border border-[#292D29] bg-[#080A09] px-3 py-2.5 text-sm text-[#E5E7E5] outline-none transition placeholder:text-[#626862] focus:border-[#00E676]"
                />
              </label>

              <label className="block text-sm text-[#A1A7A1]">
                Tech stack
                <input
                  value={form.techStack}
                  onChange={(event) =>
                    setForm({ ...form, techStack: event.target.value })
                  }
                  placeholder="Java, Spring Boot, MySQL"
                  className="mt-2 w-full rounded-lg border border-[#292D29] bg-[#080A09] px-3 py-2.5 text-sm text-[#E5E7E5] outline-none transition placeholder:text-[#626862] focus:border-[#00E676]"
                />
                <span className="mt-1 block text-xs text-[#626862]">
                  Separate technologies with commas.
                </span>
              </label>

              <label className="block text-sm text-[#A1A7A1]">
                Difficulty
                <select
                  value={form.difficulty}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      difficulty: event.target.value as Difficulty,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-[#292D29] bg-[#080A09] px-3 py-2.5 text-sm text-[#E5E7E5] outline-none focus:border-[#00E676]"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>

              <label className="block text-sm text-[#A1A7A1]">
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value as ProjectStatus,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-[#292D29] bg-[#080A09] px-3 py-2.5 text-sm text-[#E5E7E5] outline-none focus:border-[#00E676]"
                >
                  <option>Planned</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </label>

              <label className="block text-sm text-[#A1A7A1] sm:col-span-2">
                Description
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="What will this project do?"
                  className="mt-2 w-full resize-y rounded-lg border border-[#292D29] bg-[#080A09] px-3 py-2.5 text-sm text-[#E5E7E5] outline-none placeholder:text-[#626862] focus:border-[#00E676]"
                />
              </label>

              <label className="block text-sm text-[#A1A7A1]">
                Target date (optional)
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(event) =>
                    setForm({ ...form, deadline: event.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-[#292D29] bg-[#080A09] px-3 py-2.5 text-sm text-[#E5E7E5] outline-none focus:border-[#00E676]"
                />
              </label>

              <label className="block text-sm text-[#A1A7A1]">
                Milestones
                <textarea
                  rows={3}
                  value={form.milestones}
                  onChange={(event) =>
                    setForm({ ...form, milestones: event.target.value })
                  }
                  placeholder={'Design database schema\nBuild REST endpoints\nDeploy the API'}
                  className="mt-2 w-full resize-y rounded-lg border border-[#292D29] bg-[#080A09] px-3 py-2.5 text-sm text-[#E5E7E5] outline-none placeholder:text-[#626862] focus:border-[#00E676]"
                />
                <span className="mt-1 block text-xs text-[#626862]">
                  Enter one milestone per line.
                </span>
              </label>
            </div>

            {formError && (
              <p role="alert" className="text-sm text-red-400">
                {formError}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-3 border-t border-[#292D29] pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-[#292D29] px-4 py-2.5 text-sm text-[#A1A7A1] transition hover:bg-[#191C19]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-[#00E676] px-4 py-2.5 text-sm font-semibold text-[#071109] transition hover:bg-[#32F58C]"
              >
                <Plus size={16} />
                Create project
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects or technologies..."
          aria-label="Search projects"
          className="min-w-0 flex-1 rounded-lg border border-[#292D29] bg-[#111311] px-4 py-3 text-sm text-[#E5E7E5] outline-none placeholder:text-[#626862] focus:border-[#00E676]"
        />

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['All', 'Planned', 'In Progress', 'Completed'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  filter === status
                    ? 'border-[#00E676] bg-[#00E676]/10 text-[#00E676]'
                    : 'border-[#292D29] bg-[#111311] text-[#858B85] hover:text-[#E5E7E5]'
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-[#E5E7E5]">
          Your workspace
          <span className="ml-2 text-sm font-normal text-[#626862]">
            ({filteredProjects.length})
          </span>
        </h3>
        <p className="hidden items-center gap-1 text-xs text-[#626862] sm:flex">
          <Target size={14} />
          Progress based on milestones
        </p>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#292D29] bg-[#111311] px-5 py-12 text-center">
          <FolderKanban size={32} className="mx-auto text-[#626862]" />
          <h3 className="mt-3 font-semibold text-[#E5E7E5]">
            No projects found
          </h3>
          <p className="mt-1 text-sm text-[#858B85]">
            Try a different search or create a new project.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setFilter('All')
              setShowForm(true)
            }}
            className="mt-4 text-sm font-medium text-[#00E676] hover:underline"
          >
            Create a project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredProjects.map((project) => {
            const progress = getProjectProgress(project)
            const isExpanded = expandedProject === project.id

            return (
              <article
                key={project.id}
                className="overflow-hidden rounded-xl border border-[#292D29] bg-[#111311] transition hover:border-[#3B443B]"
              >
                <div className="space-y-4 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#14532D] bg-[#052E16]">
                        <Code2 size={20} className="text-[#00E676]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="break-words font-semibold text-[#E5E7E5]">
                          {project.name}
                        </h4>
                        <p className="mt-1 text-xs text-[#858B85]">
                          {project.difficulty}
                          {project.deadline && (
                            <>
                              <span className="mx-2">·</span>
                              <CalendarDays
                                size={12}
                                className="mr-1 inline"
                              />
                              {project.deadline}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteProject(project.id)}
                      aria-label={`Delete ${project.name}`}
                      title="Delete project"
                      className="shrink-0 rounded-lg p-2 text-[#626862] transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-sm leading-relaxed text-[#A1A7A1]">
                    {project.description || 'No description added yet.'}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.length > 0 ? (
                      project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-[#292D29] bg-[#191C19] px-2 py-1 text-xs text-[#A1A7A1]"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#626862]">
                        No technologies added
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#858B85]">Milestone progress</span>
                      <span className="font-semibold text-[#E5E7E5]">
                        {progress}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 overflow-hidden rounded-full bg-[#292D29]"
                      role="progressbar"
                      aria-label={`${project.name} progress`}
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-[#00E676] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#292D29] pt-4">
                    <select
                      aria-label={`Status for ${project.name}`}
                      value={project.status}
                      onChange={(event) =>
                        updateProjectStatus(
                          project.id,
                          event.target.value as ProjectStatus,
                        )
                      }
                      className={`max-w-full rounded-full border px-3 py-1.5 text-xs font-medium outline-none ${statusStyles[project.status]}`}
                    >
                      <option>Planned</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>

                    <button
                      onClick={() =>
                        setExpandedProject(isExpanded ? null : project.id)
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#A1A7A1] transition hover:text-[#00E676]"
                    >
                      {project.milestones.length} milestones
                      {isExpanded ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-[#292D29] bg-[#0C0E0C] p-4 sm:p-5">
                    <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#858B85]">
                      Project milestones
                    </h5>

                    {project.milestones.length === 0 ? (
                      <p className="text-sm text-[#626862]">
                        No milestones yet. Add milestones when creating a
                        project.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {project.milestones.map((milestone) => (
                          <button
                            key={milestone.id}
                            onClick={() =>
                              toggleMilestone(project.id, milestone.id)
                            }
                            className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition hover:bg-[#191C19]"
                          >
                            <span
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                milestone.completed
                                  ? 'border-[#00E676] bg-[#00E676] text-[#071109]'
                                  : 'border-[#454945] text-transparent'
                              }`}
                            >
                              {milestone.completed && <Check size={11} />}
                            </span>
                            <span
                              className={`text-sm ${
                                milestone.completed
                                  ? 'text-[#626862] line-through'
                                  : 'text-[#C5CAC5]'
                              }`}
                            >
                              {milestone.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}

      <p className="text-center text-xs text-[#626862]">
        Project data is saved in this browser only. Backend synchronization will
        be added later.
      </p>
    </section>
  )
}

export default Projects