import { ArrowRight, Flame } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { Card } from '../../components/ui/Card'
import { XPBar } from '../../components/shared/XPBar'
import { TaskCard } from '../../components/shared/TaskCard'
import { Button } from '../../components/ui/Button'
import { useTasks } from '../../hooks/useTaskHooks'
import { useRecentActivity } from '../../hooks/useActivityHooks'
import { useLeaderboardEntries } from '../../hooks/useLeaderboardHooks'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { data: tasksResponse } = useTasks()
  const { data: recentActivity } = useRecentActivity(4)
  const { data: leaderboardEntries } = useLeaderboardEntries('Global', 5)
  const tasks = tasksResponse?.data ?? []
  const username = user?.username || user?.name || 'Champion'
  const streakCount = user?.streak_count ?? user?.streak ?? 0

  return (
    <main className="space-y-8 pb-12 text-slate-900">
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="bg-gradient-to-br from-[#eaf8f4] via-white to-[#fff7e7] border-slate-200">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Warrior profile</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">Welcome back, {username}</h1>
              <p className="mt-3 max-w-2xl text-slate-700">Your focus guild is ready. Attack monsters, claim rewards, and keep the streak alive.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="flex items-center justify-center gap-3 text-slate-600">
                <Flame className="h-5 w-5 text-[#17937f]" />
                <span>Current streak</span>
              </div>
              <p className="mt-4 text-5xl font-semibold text-slate-900">{streakCount}</p>
              <p className="mt-2 text-sm text-slate-500">Consecutive focus sessions</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Level</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{user?.level || 1}</p>
              <XPBar current={user?.xp || 0} nextLevel={user?.next_level_xp || 1200} />
            </div>
            <div className="rounded-[1.5rem] border border-[#f99f1e] bg-[#fff5e0] p-5 text-slate-900 shadow-sm">
              <p className="text-sm uppercase tracking-[0.32em]">Daily reward</p>
              <p className="mt-3 text-3xl font-semibold">{user?.title ?? 'Focus seeker'}</p>
              <p className="mt-3 text-sm text-slate-700">Next reward unlocks as you keep your streak for {streakCount + 1} sessions.</p>
              <Button className="mt-5 w-full" size="lg">Claim reward</Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Leaderboard pulse</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Top 5</h2>
              </div>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
            <div className="space-y-3">
              {!leaderboardEntries?.length ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Loading leaderboard...</div>
              ) : (
                leaderboardEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-700">{entry.rank}</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{entry.user?.username ?? `Player ${entry.rank}`}</p>
                        <p className="text-xs text-slate-500">Score {entry.score}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#f99f1e]">+{entry.score}</span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Activity</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent progress</h2>
              </div>
              <ArrowRight className="text-slate-500" />
            </div>
            <div className="mt-5 space-y-4">
              {!recentActivity?.length ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">No activity recorded yet.</div>
              ) : (
                recentActivity.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                    <p className="font-medium text-slate-900">{item.message}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Active monsters</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Task battlefield</h2>
          </div>
          <Button variant="secondary">Add task</Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {tasks && tasks.length > 0 ? (
            tasks?.slice(0, 4).map((task) => (
              <TaskCard key={task.id} task={task} onAttack={() => undefined} />
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-8 text-slate-500">No active tasks</div>
          )}
        </div>
      </section>
    </main>
  )
}
