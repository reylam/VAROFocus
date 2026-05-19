import apiClient from './apiClient'
import type { CreatePomodoroSessionPayload, PaginatedResponse, PomodoroSession } from '@/types/models'

export const pomodoroAPI = {
  list: () => apiClient.get<PaginatedResponse<PomodoroSession>>('/pomodoro-sessions'),
  create: (payload: CreatePomodoroSessionPayload) => apiClient.post<{ message: string; session: PomodoroSession }>('/pomodoro-sessions', payload),
  complete: (id: string) => apiClient.post<{ message: string; session: PomodoroSession; xp_earned?: number }>(`/pomodoro-sessions/${id}/complete`),
  cancel: (id: string) => apiClient.post<{ message: string; session: PomodoroSession }>(`/pomodoro-sessions/${id}/cancel`),
  todayStats: () => apiClient.get<Record<string, number>>('/pomodoro-sessions/today-stats'),
  weeklyStats: () => apiClient.get<Record<string, unknown>>('/pomodoro-sessions/weekly-stats'),
  streak: () => apiClient.get<Record<string, unknown>>('/pomodoro-streaks/streak'),
}

export const startPomodoroSession = async (payload: CreatePomodoroSessionPayload) => (await pomodoroAPI.create(payload)).data.session
export const completePomodoroSession = async (id: string) => (await pomodoroAPI.complete(id)).data
export const cancelPomodoroSession = async (id: string) => (await pomodoroAPI.cancel(id)).data
export const getTodayStats = async () => (await pomodoroAPI.todayStats()).data

export default pomodoroAPI
