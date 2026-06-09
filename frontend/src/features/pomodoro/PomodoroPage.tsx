import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import useUiStore from '../../store/uiStore'
import { useTasks } from '../../hooks/useTaskHooks'
import {
  cancelPomodoroSession,
  completePomodoroSession,
  getTodayStats,
  startPomodoroSession,
} from '../../services/pomodoro'
import type { Task } from '@/types/models'

const DURATION_PRESETS = [15, 25, 50]

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

type Status = 'idle' | 'running' | 'paused'

export function PomodoroPage() {
  const queryClient = useQueryClient()
  const addToast = useUiStore((state) => state.addToast)

  const [durationMinutes, setDurationMinutes] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [status, setStatus] = useState<Status>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string>('')

  const { data: tasksResponse } = useTasks({ limit: 50 })
  const activeTasks = useMemo<Task[]>(
    () => (tasksResponse?.data ?? []).filter((t) => t.status !== 'completed' && t.status !== 'failed'),
    [tasksResponse],
  )

  const { data: stats } = useQuery({
    queryKey: ['pomodoro-today'],
    queryFn: getTodayStats,
  })

  const totalSeconds = durationMinutes * 60
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0

  const startMutation = useMutation({
    mutationFn: () => startPomodoroSession({ duration_minutes: durationMinutes, task_id: taskId || undefined }),
    onSuccess: (session) => {
      setSessionId(session.id)
      setSecondsLeft(totalSeconds)
      setStatus('running')
      addToast({ title: 'Focus mode on', description: `${durationMinutes} minutes. You've got this.`, variant: 'success' })
    },
    onError: () => addToast({ title: 'Could not start', description: 'Please try again.', variant: 'warning' }),
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => completePomodoroSession(id),
    onSuccess: (data) => {
      setStatus('idle')
      setSessionId(null)
      setSecondsLeft(totalSeconds)
      queryClient.invalidateQueries({ queryKey: ['pomodoro-today'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      addToast({
        title: 'Session complete',
        description: `You earned ${data.xp_earned ?? 25} XP${taskId ? ' and struck your monster.' : '.'}`,
        variant: 'success',
      })
    },
    onError: () => addToast({ title: 'Could not save', description: 'Session finished but failed to sync.', variant: 'warning' }),
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelPomodoroSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomodoro-today'] })
    },
  })

  // Countdown ticks only while running.
  useEffect(() => {
    if (status !== 'running') return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          if (sessionId) completeMutation.mutate(sessionId)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [status, sessionId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePrimary = () => {
    if (status === 'idle') startMutation.mutate()
    else if (status === 'running') setStatus('paused')
    else setStatus('running')
  }

  const handleFinishNow = () => {
    if (sessionId) completeMutation.mutate(sessionId)
  }

  const handleReset = () => {
    if (sessionId) cancelMutation.mutate(sessionId)
    setStatus('idle')
    setSessionId(null)
    setSecondsLeft(totalSeconds)
    addToast({ title: 'Session cancelled', description: 'Timer reset.', variant: 'info' })
  }

  const selectDuration = (minutes: number) => {
    if (status !== 'idle') return
    setDurationMinutes(minutes)
    setSecondsLeft(minutes * 60)
  }

  // Ring geometry
  const radius = 86
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  const todaySessions = stats?.completed_sessions ?? 0
  const todayMinutes = stats?.total_minutes ?? 0
  const todayXp = stats?.xp_earned ?? 0

  return (
    <main className="space-y-8 pb-12">
      <header>
        <p className="text-sm uppercase tracking-[0.32em] text-[#17937f]">Focus engine</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Pomodoro drive</h1>
        <p className="mt-2 text-sm text-slate-500">Run a focus session. Finish it to earn XP and strike the monster you're focusing on.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="flex flex-col items-center gap-6 py-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {DURATION_PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => selectDuration(m)}
                disabled={status !== 'idle'}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  durationMinutes === m ? 'bg-[#17937f] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                } ${status !== 'idle' ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {m} min
              </button>
            ))}
          </div>

          <div className="relative flex h-56 w-56 items-center justify-center">
            <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#17937f"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="text-center">
              <div className="text-5xl font-semibold tabular-nums text-slate-900">{formatTime(secondsLeft)}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.32em] text-slate-400">
                {status === 'running' ? 'Focusing' : status === 'paused' ? 'Paused' : 'Ready'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={handlePrimary}
              size="lg"
              icon={status === 'running' ? <Pause size={16} /> : <Play size={16} />}
              disabled={startMutation.isPending}
            >
              {status === 'idle' ? (startMutation.isPending ? 'Starting...' : 'Start') : status === 'running' ? 'Pause' : 'Resume'}
            </Button>
            {status !== 'idle' && (
              <>
                <Button variant="secondary" size="lg" onClick={handleFinishNow}>Finish now</Button>
                <Button variant="ghost" size="lg" icon={<RotateCcw size={16} />} onClick={handleReset}>Reset</Button>
              </>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-3">
            <p className="text-sm font-semibold text-slate-700">Focus on a monster (optional)</p>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              disabled={status !== 'idle'}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-[#17937f] focus:outline-none focus:ring-2 focus:ring-[#17937f]/20 disabled:opacity-50"
            >
              <option value="">No specific task</option>
              {activeTasks.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400">Completing a session deals damage to the selected monster.</p>
          </Card>

          <Card className="space-y-4">
            <p className="text-sm font-semibold text-slate-700">Today</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-2xl font-semibold text-slate-900">{todaySessions}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">Sessions</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-2xl font-semibold text-slate-900">{todayMinutes}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">Minutes</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-2xl font-semibold text-[#17937f]">{todayXp}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">XP</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
