import { useState } from 'react'
import { Play, Pause, X } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import useUiStore from '../../store/uiStore'

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

export function PomodoroPage() {
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const addToast = useUiStore((state) => state.addToast)

  const startTimer = () => {
    setRunning(true)
    addToast({ title: 'Pomodoro started', description: 'Focus mode engaged.', variant: 'success' })
  }

  const pauseTimer = () => {
    setRunning(false)
    addToast({ title: 'Paused', description: 'Your session is still live.', variant: 'info' })
  }

  const resetTimer = () => {
    setRunning(false)
    setSeconds(25 * 60)
    addToast({ title: 'Reset', description: 'Timer restored for the next round.', variant: 'warning' })
  }

  return (
    <main className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Focus engine</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Pomodoro drive</h1>
          <p className="mt-2 text-sm text-slate-500">Launch a session, track streaks, and push XP onto the leaderboard.</p>
        </div>
      </header>

      <Card className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Current session</p>
          <div className="mt-8 flex items-center justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-slate-900 text-5xl font-semibold text-white shadow-glow">
              {formatTime(seconds)}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={running ? pauseTimer : startTimer} size="lg" icon={running ? <Pause size={16} /> : <Play size={16} />}>
              {running ? 'Pause' : 'Start'}
            </Button>
            <Button variant="ghost" size="lg" icon={<X size={16} />} onClick={resetTimer}>
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-5 rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-8">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Streak bonus</p>
            <h2 className="text-2xl font-semibold text-white">Multiplier active</h2>
            <p className="text-sm text-slate-400">Complete consecutive sessions to stack XP and reward boosts.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Current streak', value: '3 sessions' },
              { label: 'Next bonus', value: 'x1.5 XP' },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </main>
  )
}
