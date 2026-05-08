import api from './api'
import type { PomodoroSession, PomodoroStreak, PomodoroStats } from '../types'

export async function fetchPomodoroSessions() {
  const { data } = await api.get<PomodoroSession[]>('/pomodoro-sessions')
  return data
}

export async function startPomodoroSession(session: {
  task_id?: string
  duration_minutes?: number
  break_minutes?: number
}) {
  const { data } = await api.post<PomodoroSession>('/pomodoro-sessions', session)
  return data
}

export async function completePomodoroSession(id: string) {
  const { data } = await api.post<PomodoroSession>(`/pomodoro-sessions/${id}/complete`)
  return data
}

export async function cancelPomodoroSession(id: string) {
  const { data } = await api.post<PomodoroSession>(`/pomodoro-sessions/${id}/cancel`)
  return data
}

export async function getPomodoroStreak() {
  const { data } = await api.get<PomodoroStreak>('/pomodoro-streaks/streak')
  return data
}

export async function getTodayStats() {
  const { data } = await api.get<PomodoroStats>('/pomodoro-sessions/today-stats')
  return data
}

export async function getWeeklyStats() {
  const { data } = await api.get<PomodoroStats>('/pomodoro-sessions/weekly-stats')
  return data
}
