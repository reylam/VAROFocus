import { Outlet, Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'
import { ToastProvider } from '../components/shared/ToastProvider'
import useAuthStore from '../store/authStore'
import useUiStore from '../store/uiStore'
import { Button } from '../components/ui/Button'
import { useEffect } from 'react'

export function MainLayout() {
  const user = useAuthStore((state) => state.user)
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen)

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }, [])

  return (
    <div className="min-h-screen bg-[#f6fbfa] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col pl-72">
          <header className="sticky top-0 z-20 flex flex-col gap-4 border-b border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#17937f]">Mission control</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">Live focus cockpit</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)} icon={<Menu size={16} />}>
                Menu
              </Button>
              <Link to="/dashboard" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-[#17937f] hover:text-[#17937f]">
                {user?.username || 'Profile'}
              </Link>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
      <ToastProvider />
    </div>
  )
}
