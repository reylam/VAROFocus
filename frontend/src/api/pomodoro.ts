import apiClient from './apiClient';
import type { PomodoroSession, CreatePomodoroSessionPayload, PomodoroStreak } from '@/types/models';

export const pomodoroAPI = {
  listSessions: () =>
    apiClient.get<PomodoroSession[]>('/pomodoro-sessions'),

  createSession: (data: CreatePomodoroSessionPayload) =>
    apiClient.post<PomodoroSession>('/pomodoro-sessions', data),

  getSession: (id: string) =>
    apiClient.get<PomodoroSession>(`/pomodoro-sessions/${id}`),

  updateSession: (id: string, data: Partial<PomodoroSession>) =>
    apiClient.put<PomodoroSession>(`/pomodoro-sessions/${id}`, data),

  deleteSession: (id: string) =>
    apiClient.delete(`/pomodoro-sessions/${id}`),

  completeSession: (id: string) =>
    apiClient.post(`/pomodoro-sessions/${id}/complete`),

  cancelSession: (id: string) =>
    apiClient.post(`/pomodoro-sessions/${id}/cancel`),

  getTodayStats: () =>
    apiClient.get('/pomodoro-sessions/today-stats'),

  getWeeklyStats: () =>
    apiClient.get('/pomodoro-sessions/weekly-stats'),

  getStreak: () =>
    apiClient.get<PomodoroStreak>('/pomodoro-streaks/streak'),

  resetStreak: () =>
    apiClient.post('/pomodoro-streaks/reset'),
};
