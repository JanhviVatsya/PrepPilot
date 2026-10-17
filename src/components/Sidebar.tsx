
import {
  LayoutDashboard,
  CalendarDays,
  Brain,
  FolderKanban,
  ChartNoAxesColumn,
  Settings,
  UserRound,
  X,
} from 'lucide-react'

export type PageName =
  | 'Today'
  | 'My Plan'
  | 'Practice & Revision'
  | 'Projects'
  | 'Career Profile'
  | 'Analytics'
  | 'Settings'

const navItems = [
  { label: 'Today', icon: LayoutDashboard },
  { label: 'My Plan', icon: CalendarDays },
  { label: 'Practice & Revision', icon: Brain },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Career Profile', icon: UserRound },
  { label: 'Analytics', icon: ChartNoAxesColumn },
  { label: 'Settings', icon: Settings },
] as const

type SidebarProps = {
  activePage: PageName
  onNavigate: (page: PageName) => void
  mobileOpen: boolean
  onClose: () => void
}

export default function Sidebar({
  activePage,
  onNavigate,
  mobileOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#292D29] bg-[#0D0F0D] p-5 transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="mb-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/preppilot-logo.png"
              alt="PrepPilot"
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div>
              <h1 className="text-lg font-bold">PrepPilot</h1>
              <p className="text-xs text-[#858B85]">
                Prepare with purpose
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#A1A7A1] hover:bg-[#202320] md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777D77]">
          Workspace
        </p>

        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                onNavigate(label)
                onClose()
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors ${
                activePage === label
                  ? 'bg-[#1B251E] font-semibold text-[#00E676]'
                  : 'text-[#A1A7A1] hover:bg-[#191C19] hover:text-white'
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-[#292D29] bg-[#141714] p-4">
          <p className="text-sm font-semibold">Small steps count.</p>
          <p className="mt-2 text-xs leading-5 text-[#858B85]">
            Consistency beats an unrealistic perfect plan.
          </p>
        </div>
      </aside>
    </>
  )
}
