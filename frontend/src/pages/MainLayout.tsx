import { Outlet, Link } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'
import { ToastProvider } from '../components/shared/ToastProvider'
import useAuthStore from '../store/authStore'
import useUiStore from '../store/uiStore'
import { Button } from '../components/ui/Button'
import { useEffect } from 'react'

export function MainLayout() {
  const user = useAuthStore((state) => state.user)
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.14),transparent_32%),#05060b] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1700px] gap-6 px-4 py-6 lg:px-8">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col gap-6">
          <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 shadow-soft backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Mission control</p>
              <h1 className="mt-2 text-2xl font-semibold text-white">Live focus cockpit</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="ghost" size="sm" onClick={toggleTheme} icon={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}>
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </Button>
              <Link to="/profile" className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-primary hover:text-white">
                {user?.username || 'Profile'}
              </Link>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-6">
            <Outlet />
          </div>
        </div>
      </div>
      <ToastProvider />
    </div>
  )
}
