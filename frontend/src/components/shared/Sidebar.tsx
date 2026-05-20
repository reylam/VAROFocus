import { NavLink, useNavigate } from 'react-router-dom'
import { Activity, Sparkles, ShieldCheck, Clock3, Trophy, Users2, LogOut, Settings, UserCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { Button } from '../ui/Button'
import varoLogo from '../../assets/varo_logo.png'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <Activity size={18} /> },
  { to: '/tasks', label: 'Task', icon: <ShieldCheck size={18} /> },
  { to: '/pomodoro', label: 'Pomodoro', icon: <Clock3 size={18} /> },
  { to: '/study-rooms', label: 'Study Room', icon: <Users2 size={18} /> },
  { to: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
]

export function Sidebar() {
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sticky  left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo Section */}
      <div className="flex items-center gap-2 px-6 py-6 border-b border-slate-100">
        <img src={varoLogo} alt="VAROFocus" className="h-8 w-8" />
        <span className="text-lg font-bold text-[#17937f]">VAROFocus</span>
      </div>

      {/* Profile Section */}
      <div className="px-4 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#17937f] to-[#0f6658] flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900 text-sm">{user?.username || 'User'}</p>
            <p className="text-xs text-slate-500">Level {user?.level || 1}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-[#17937f] text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Menu */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive 
                ? 'bg-[#17937f] text-white' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          <Settings size={18} />
          <span>Setting</span>
        </NavLink>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}