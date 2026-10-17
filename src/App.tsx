
import { useState } from 'react'
import Sidebar, { type PageName } from './components/Sidebar'
import Header from './components/Header'

import Today from './pages/Today'
import MyPlan from './pages/MyPlan'
import Practice from './pages/Practice'
import Projects from './pages/Projects'
import CareerProfile from './pages/CareerProfile'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

export default function App() {
  const [activePage, setActivePage] = useState<PageName>('Today')
  const [mobileOpen, setMobileOpen] = useState(false)

  function renderPage() {
    switch (activePage) {
      case 'Today':
        return <Today />
      case 'My Plan':
        return <MyPlan />
      case 'Practice & Revision':
        return <Practice />
      case 'Projects':
        return <Projects />
      case 'Career Profile':
        return <CareerProfile />
      case 'Analytics':
        return <Analytics />
      case 'Settings':
        return <Settings />
      default:
        return <Today />
    }
  }

  return (
    <div className="min-h-screen bg-[#080A09] text-[#E5E7E5]">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <main className="min-h-screen md:ml-64">
        <Header onMenuClick={() => setMobileOpen((prev) => !prev)} />

        <div className="mx-auto max-w-6xl p-5 sm:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}
