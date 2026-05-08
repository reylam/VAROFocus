import { BadgeCheck, Star } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

const achievements = [
  { title: 'First Strike', description: 'Complete your first task', progress: 100, unlocked: true },
  { title: 'Focus Chain', description: 'Keep a 3-day streak', progress: 80, unlocked: false },
  { title: 'Boss Slayer', description: 'Finish a boss task', progress: 60, unlocked: false },
]

export function AchievementsPage() {
  return (
    <main className="space-y-8 pb-12">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Achievements</p>
        <h1 className="text-3xl font-semibold text-white">Unlock your next milestone</h1>
        <p className="max-w-2xl text-sm text-slate-500">Track locked and unlocked achievements to drive your gamified progress.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="space-y-5 p-6">
          {achievements.map((achievement) => (
            <div key={achievement.title} className="space-y-3 rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">{achievement.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{achievement.description}</p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] ${achievement.unlocked ? 'bg-emerald-500/15 text-emerald-200' : 'bg-slate-700/60 text-slate-300'}`}>
                  {achievement.unlocked ? 'Unlocked' : 'Locked'}
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                <div className="h-full rounded-full bg-gradient-to-r from-xp to-primary" style={{ width: `${achievement.progress}%` }} />
              </div>
            </div>
          ))}
        </Card>

        <Card className="space-y-6 p-6">
          <div className="flex items-center gap-3 text-white">
            <span className="rounded-3xl bg-primary px-3 py-2">✨</span>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Badge vault</p>
              <h2 className="text-2xl font-semibold">Epic rewards</h2>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center gap-3">
                <BadgeCheck className="text-primary" />
                <div>
                  <h3 className="font-semibold text-white">Starter Champion</h3>
                  <p className="text-sm text-slate-400">Unlocked after your first five tasks.</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center gap-3">
                <Star className="text-xp" />
                <div>
                  <h3 className="font-semibold text-white">Focus Star</h3>
                  <p className="text-sm text-slate-400">Earned for a 7-day Pomodoro streak.</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="w-full">Explore reward tiers</Button>
        </Card>
      </div>
    </main>
  )
}
