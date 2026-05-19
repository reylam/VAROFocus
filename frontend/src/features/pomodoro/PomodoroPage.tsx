import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Play, Pause, X } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import useUiStore from '../../store/uiStore'
import { startPomodoroSession, completePomodoroSession, getTodayStats } from '../../services/pomodoro'

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

export function PomodoroPage() {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const addToast = useUiStore((state) => state.addToast)

  const { data: todayStats = { today_sessions: 0, today_minutes: 0, weekly_sessions: 0, weekly_minutes: 0, total_sessions: 0, average_session_length: 0 } } = useQuery({
    queryKey: ['pomodoro-today'],
    queryFn: getTodayStats,
  })

  const startMutation = useMutation({
    mutationFn: () => startPomodoroSession({ duration_minutes: 25, break_minutes: 5 }),
    onSuccess: (data) => {
      setSessionId(data.id)
      setRunning(true)
      addToast({ title: 'Pomodoro started', description: 'Focus mode engaged. 25 minutes begins now.', variant: 'success' })
    },
    onError: () => {
      addToast({ title: 'Start failed', description: 'Could not start session.', variant: 'warning' })
    },
  })

  const completeMutation = useMutation({
    mutationFn: () => completePomodoroSession(sessionId!),
    onSuccess: (data) => {
      setRunning(false)
      setTimeRemaining(25 * 60)
      setSessionId(null)
      addToast({ 
        title: 'Session complete', 
        description: `You earned ${data.xp_earned ?? 25} XP.`, 
        variant: 'success' 
      })
    },
    onError: () => {
      addToast({ title: 'Complete failed', description: 'Could not complete the session.', variant: 'warning' })
    },
  })

  useEffect(() => {
    if (!running) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false)
          if (sessionId) completeMutation.mutate()
          return 25 * 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [running, sessionId, completeMutation])

  const startTimer = () => {
    if (running) {
      setRunning(false)
      addToast({ title: 'Paused', description: 'Your session is paused.', variant: 'info' })
    } else {
      startMutation.mutate()
    }
  }

  const pauseTimer = () => {
    setRunning(false)
    addToast({ title: 'Paused', description: 'Your session is paused.', variant: 'info' })
  }

  const resetTimer = () => {
    setRunning(false)
    setTimeRemaining(25 * 60)
    setSessionId(null)
    addToast({ title: 'Reset', description: 'Timer restored.', variant: 'warning' })
  }

  return (
    <main className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-[#17937f]">Focus engine</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Pomodoro drive</h1>
          <p className="mt-2 text-sm text-slate-500">Launch a session, track streaks, and push XP onto the leaderboard.</p>
        </div>
      </header>

      <Card className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Current session</p>
          <div className="mt-8 flex items-center justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-[#17937f] text-5xl font-semibold text-white shadow-[0_20px_50px_rgba(23,147,127,0.2)]">
              {formatTime(timeRemaining)}
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

        <div className="space-y-5 rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Streak bonus</p>
            <h2 className="text-2xl font-semibold text-slate-900">Multiplier active</h2>
            <p className="text-sm text-slate-600">Complete consecutive sessions to stack XP and reward boosts.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Today sessions', value: `${todayStats.today_sessions ?? 0}` },
              { label: 'Minutes today', value: `${todayStats.today_minutes ?? 0}` },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </main>
  )
}
