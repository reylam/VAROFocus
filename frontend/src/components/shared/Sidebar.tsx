import { NavLink } from 'react-router-dom'
import { Activity, Sparkles, ShieldCheck, Clock3, Trophy, Users2, Fire } from 'lucide-react'
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
    <aside className="flex h-full w-full max-w-[280px] flex-col gap-6 rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-soft backdrop-blur-xl">
      <div className="space-y-3">
        <div className="rounded-3xl bg-gradient-to-br from-primary/30 via-slate-900/30 to-slate-950/80 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">VAROFocus</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Command Center</h2>
        </div>
        <div className="text-sm text-slate-400">Navigate your mission, collect XP, and hit your streak targets in a single flow.</div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-primary text-white shadow-glow' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Button variant="ghost" className="mt-auto" onClick={logout}>
        Sign out
      </Button>
    </aside>
  )
}
