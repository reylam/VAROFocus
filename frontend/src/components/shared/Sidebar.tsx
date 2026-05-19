import { NavLink } from 'react-router-dom'
import { Activity, Sparkles, ShieldCheck, Clock3, Trophy, Users2, LogOut } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { Button } from '../ui/Button'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <Activity size={18} /> },
  { to: '/tasks', label: 'Monsters', icon: <ShieldCheck size={18} /> },
  { to: '/pomodoro', label: 'Pomodoro', icon: <Clock3 size={18} /> },
  { to: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
  { to: '/achievements', label: 'Achievements', icon: <Sparkles size={18} /> },
  { to: '/study-rooms', label: 'Study Rooms', icon: <Users2 size={18} /> },
]

export function Sidebar() {
  const logout = useAuthStore((state) => state.logout)

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-72 flex-col border-r border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        <div className="rounded-2xl border border-[#17937f]/20 bg-[#eaf8f4] p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">VAROFocus</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Command Center</h2>
        </div>
        <div className="text-sm text-slate-600">Navigate your mission, collect XP, and keep the streak going in one place.</div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-[#17937f] text-white shadow-[0_0_20px_rgba(23,147,127,0.2)]' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Button variant="secondary" className="mt-auto w-full" icon={<LogOut size={16} />} onClick={logout}>
        Sign out
      </Button>
    </aside>
  )
}
