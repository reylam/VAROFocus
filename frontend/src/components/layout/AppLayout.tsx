import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Timer, Trophy, Users, Calendar, LayoutDashboard, Settings, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

interface AppLayoutProps {
  children: ReactNode;
}

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Timer, label: 'Pomodoro', path: '/pomodoro' },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
  { icon: Users, label: 'Study Rooms', path: '/social' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
];

export function AppLayout({ children }: AppLayoutProps) {
  const { theme, toggleTheme, user } = useAppStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass-card m-4 rounded-3xl flex flex-col border-r border-white/5">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/50 shadow-glow-primary">
            <Trophy className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            VAROFocus
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-glow-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button 
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          {/* Mini User Profile in Sidebar */}
          {user && (
            <div className="mt-4 flex items-center gap-3 px-4 py-2 rounded-xl bg-background/50 border border-border/50">
              <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full bg-secondary/20" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-foreground">{user.username}</p>
                <p className="text-xs text-primary font-medium">Lvl {user.level}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 pl-2 relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
