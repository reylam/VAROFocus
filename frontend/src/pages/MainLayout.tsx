import { Outlet, Link, useLocation } from 'react-router-dom'
import { Search, Bell, User, Settings, LogOut } from 'lucide-react'
import { Sidebar } from '../components/shared/Sidebar'
import { ToastProvider } from '../components/shared/ToastProvider'
import useAuthStore from '../store/authStore'
import useUiStore from '../store/uiStore'
import { Button } from '../components/ui/Button'
import { useEffect, useState } from 'react'

export function MainLayout() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen)
  const location = useLocation()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }, [])

  // Halaman yang tidak menampilkan header (dashboard)
  const hideHeaderPaths = ['/dashboard']
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname)

  return (
    <div className="min-h-screen bg-[#f6fbfa] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header - hanya muncul jika bukan dashboard */}
          {!shouldHideHeader && (
            <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur lg:px-8">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {location.pathname === '/tasks' && 'Task Management'}
                  {location.pathname === '/pomodoro' && 'Pomodoro Timer'}
                  {location.pathname === '/leaderboard' && 'Leaderboard'}
                  {location.pathname === '/study-rooms' && 'Study Rooms'}
                  {location.pathname === '/friends' && 'Friends'}
                  {location.pathname === '/achievements' && 'Achievements'}
                  {location.pathname === '/settings' && 'Settings'}
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {location.pathname === '/tasks' && 'Manage your quests and defeat monsters'}
                  {location.pathname === '/pomodoro' && 'Stay focused with Pomodoro technique'}
                  {location.pathname === '/leaderboard' && 'See top performers and your rank'}
                  {location.pathname === '/study-rooms' && 'Study together with friends'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-64 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm focus:border-[#17937f] focus:outline-none focus:ring-2 focus:ring-[#17937f]/20"
                  />
                </div>

                {/* Notification Bell */}
                <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:border-[#17937f] hover:text-[#17937f]"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#17937f] to-[#0f6658] flex items-center justify-center text-white text-xs">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span>{user?.username || 'Profile'}</span>
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <hr className="my-1 border-slate-100" />
                      <button 
                        onClick={() => {
                          logout()
                          setShowProfileMenu(false)
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>
          )}

          <div className="flex flex-1 flex-col gap-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
      <ToastProvider />
    </div>
  )
}