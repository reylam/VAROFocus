import { ArrowRight, Flame } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { Card } from '../../components/ui/Card'
import { XPBar } from '../../components/shared/XPBar'
import { TaskCard } from '../../components/shared/TaskCard'
import { Button } from '../../components/ui/Button'
import { useTasks } from '../../hooks/useTaskHooks'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { data: tasksResponse } = useTasks()
  const tasks = tasksResponse?.data ?? []
  const username = user?.username || 'Champion'

  return (
    <main className="space-y-8 pb-12">
      <section className="grid gap-6 xl:grid-cols-[1.5fr 1fr]">
        <Card className="bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.18),transparent_36%),bg-slate-950/95] border-white/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Warrior profile</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Welcome back, {username}</h1>
              <p className="mt-3 max-w-2xl text-slate-300">Your focus guild is ready. Attack monsters, claim rewards, and keep the streak alive.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5 text-center shadow-soft">
              <div className="flex items-center justify-center gap-3 text-slate-300">
                <Flame />
                <span>Current streak</span>
              </div>
              <p className="mt-4 text-5xl font-semibold text-white">{user?.streak || 0}🔥</p>
              <p className="mt-2 text-sm text-slate-400">Consecutive focus sessions</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-slate-950/90 p-5">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Level</p>
              <p className="mt-3 text-3xl font-semibold text-white">{user?.level || 1}</p>
              <XPBar current={user?.xp || 0} nextLevel={user?.next_level_xp || 1200} />
            </div>
            <div className="rounded-[1.5rem] bg-gradient-to-br from-primary to-accent p-5 text-white shadow-glow">
              <p className="text-sm uppercase tracking-[0.32em]">Daily reward</p>
              <p className="mt-3 text-3xl font-semibold">Claim today&apos;s bonus</p>
              <p className="mt-3 text-sm text-slate-100/80">Level progress resets with a strong session, not an early stop.</p>
              <Button className="mt-5 w-full" size="lg">Claim reward</Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Leaderboard pulse</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Top 5</h2>
              </div>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((rank) => (
                <div key={rank} className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-xs text-slate-300">{rank}</div>
                    <div>
                      <p className="text-sm font-semibold text-white">Player {rank}</p>
                      <p className="text-xs text-slate-500">Score {Math.max(4200 - rank * 200, 1200)}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-300">+{50 - rank * 2}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-950/90">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Activity</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Recent progress</h2>
              </div>
              <ArrowRight className="text-slate-400" />
            </div>
            <div className="mt-5 space-y-4">
              {['Defeated a boss task', 'Finished a Pomodoro session', 'Unlocked a badge'].map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Active monsters</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Task battlefield</h2>
          </div>
          <Button variant="secondary">Add task</Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {tasks && tasks.length > 0 ? (
            tasks?.slice(0, 4).map((task) => (
              <TaskCard key={task.id} task={task} onAttack={() => undefined} />
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-8 text-slate-400">No active tasks</div>
          )}
        </div>
      </section>
    </main>
  )
}
