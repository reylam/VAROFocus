import { create } from 'zustand'
import { PomodoroSession, PomodoroStreak } from '../types'

interface PomodoroState {
  activeSession: PomodoroSession | null
  streak: PomodoroStreak | null
  isRunning: boolean
  timeRemaining: number
  sessionsToday: number
  setActiveSession: (session: PomodoroSession | null) => void
  setStreak: (streak: PomodoroStreak | null) => void
  setIsRunning: (running: boolean) => void
  setTimeRemaining: (time: number) => void
  setSessionsToday: (count: number) => void
  resetSession: () => void
  incrementSessionsToday: () => void
}

const usePomodoroStore = create<PomodoroState>((set) => ({
  activeSession: null,
  streak: null,
  isRunning: false,
  timeRemaining: 25 * 60, // 25 minutes in seconds
  sessionsToday: 0,
  setActiveSession: (session) => set({ activeSession: session }),
  setStreak: (streak) => set({ streak }),
  setIsRunning: (running) => set({ isRunning: running }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setSessionsToday: (count) => set({ sessionsToday: count }),
  resetSession: () =>
    set({
      activeSession: null,
      isRunning: false,
      timeRemaining: 25 * 60,
    }),
  incrementSessionsToday: () =>
    set((state) => ({
      sessionsToday: state.sessionsToday + 1,
    })),
}))

export default usePomodoroStore
