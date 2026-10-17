
import { Menu } from 'lucide-react'

type HeaderProps = {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-18 items-center justify-between border-b border-[#292D29] bg-[#0B0D0B] px-5 sm:px-8">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-[#A1A7A1] hover:bg-[#202320] md:hidden"
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      <p className="hidden text-sm text-[#858B85] sm:block">
        Your career, one step at a time.
      </p>

      <div className="ml-auto flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">Your workspace</p>
          <p className="text-xs text-[#858B85]">Career preparation</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#303630] bg-[#1A201B] font-semibold text-[#00E676]">
          Y
        </div>
      </div>
    </header>
  )
}
