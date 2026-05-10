import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { TelegramFab } from './TelegramFab'

export function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (mobileNavOpen) {
      root.style.overflow = 'hidden'
    } else {
      root.style.overflow = ''
    }
    return () => {
      root.style.overflow = ''
    }
  }, [mobileNavOpen])

  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-page">
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-[color:var(--app-overlay)] backdrop-blur-[1px] transition-opacity lg:hidden"
          aria-label="Menuni yopish"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <Sidebar
        mobileOpen={mobileNavOpen}
        onNavigate={() => setMobileNavOpen(false)}
      />

      <div className="flex min-h-screen min-h-[100dvh] min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 pb-28 pt-1 sm:px-5 sm:pb-16 sm:pt-2 md:px-6 md:pb-12 lg:pb-10">
          <Outlet />
        </main>
      </div>
      <TelegramFab />
    </div>
  )
}
