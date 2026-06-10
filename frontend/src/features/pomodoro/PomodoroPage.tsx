import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pause, Play, RotateCcw, Swords } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import useUiStore from '../../store/uiStore'
import { useTasks, useAttackMonster } from '../../hooks/useTaskHooks'
import useTaskStore from '../../store/taskStore'
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

  const selectedTask = useMemo(() => activeTasks.find((t) => t.id === taskId), [activeTasks, taskId])

  const attackMutation = useAttackMonster()
  const setAttacking = useTaskStore((s) => s.setAttacking)
  const attackingTaskId = useTaskStore((s) => s.attackingTaskId)
  const isAttacking = !!selectedTask && attackingTaskId === selectedTask.id

  const handleAttack = () => {
    if (!selectedTask) return
    setAttacking(selectedTask.id)
    
    attackMutation.mutate(
      { id: selectedTask.id, damage: 25, source: 'manual' },
      {
        onSuccess: (res) => {
          const payload = (res as { data?: { is_dead?: boolean; task_completed?: boolean; xp_earned?: number } })?.data
          if (payload?.is_dead || payload?.task_completed) {
            addToast({ title: 'Monster defeated!', description: `You earned ${payload?.xp_earned ?? 0} XP.`, variant: 'success' })
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
          } else {
            addToast({ title: 'Hit landed', description: '-25 HP.', variant: 'info' })
          }
        },
        onError: () => addToast({ title: 'Attack failed', description: 'Try again in a moment.', variant: 'warning' }),
        onSettled: () => setAttacking(null),
      }
    )
  }

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

  const mConfig = useMemo(() => {
    if (selectedTask) {
      const rawMonster = selectedTask.monster
      const monsterObj = Array.isArray(rawMonster) ? rawMonster[0] : rawMonster
      const type = monsterObj?.type || (selectedTask.difficulty === 'boss' ? 'dragon' : selectedTask.difficulty === 'hard' ? 'orc' : selectedTask.difficulty === 'medium' ? 'goblin' : 'slime')

      switch (type) {
        case 'slime':
          return { emoji: '🟢', color: 'from-emerald-400 to-teal-500', name: selectedTask.title, hp: selectedTask.current_hp, maxHp: selectedTask.hp }
        case 'goblin':
          return { emoji: '👺', color: 'from-amber-400 to-orange-500', name: selectedTask.title, hp: selectedTask.current_hp, maxHp: selectedTask.hp }
        case 'orc':
          return { emoji: '👹', color: 'from-red-400 to-rose-600', name: selectedTask.title, hp: selectedTask.current_hp, maxHp: selectedTask.hp }
        case 'dragon':
          return { emoji: '🐉', color: 'from-indigo-500 to-purple-700', name: selectedTask.title, hp: selectedTask.current_hp, maxHp: selectedTask.hp }
        default:
          return { emoji: '👾', color: 'from-slate-400 to-slate-600', name: selectedTask.title, hp: selectedTask.current_hp, maxHp: selectedTask.hp }
      }
    } else {
      return { emoji: '👾', color: 'from-slate-500 to-slate-700', name: 'Wild Focus Spirit', hp: 100, maxHp: 100 }
    }
  }, [selectedTask])

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

          <AnimatePresence>
            {status !== 'idle' && mConfig && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 w-full max-w-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Battle Session Live</span>
                </div>

                <div className="flex items-center gap-4 w-full">
                  <motion.div
                    animate={
                      isAttacking
                        ? { x: [0, -8, 8, -6, 6, 0] }
                        : status === 'running'
                        ? {
                            y: [0, -12, 0],
                            scale: [1, 1.08, 1],
                          }
                        : {
                            y: [0, -3, 0],
                            scale: [1, 1.02, 1],
                          }
                    }
                    transition={
                      isAttacking
                        ? { duration: 0.6, ease: 'easeOut' }
                        : {
                            repeat: Infinity,
                            duration: status === 'running' ? 0.8 : 2.0,
                            ease: 'easeInOut',
                          }
                    }
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${mConfig.color} shadow-md text-3xl`}
                  >
                    {mConfig.emoji}
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 text-sm truncate">{mConfig.name}</h4>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                      <span>Monster HP</span>
                      <span className="font-medium">{mConfig.hp}/{mConfig.maxHp}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(0, Math.min(100, (mConfig.hp / mConfig.maxHp) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {selectedTask && mConfig.hp > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAttack}
                      disabled={isAttacking}
                      className="shrink-0 flex h-10 w-10 items-center justify-center p-0 rounded-xl bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-600"
                      title="Attack Monster"
                    >
                      <Swords size={18} />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
