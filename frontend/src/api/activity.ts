import apiClient from './apiClient'
import type { ActivityLog, PaginatedResponse } from '@/types/models'

export const activityAPI = {
  list: (params?: { limit?: number }) =>
    apiClient.get<PaginatedResponse<ActivityLog>>('/activity-logs', { params }),

  recent: (limit = 10) =>
    apiClient.get<ActivityLog[]>(`/activity-logs/recent`, { params: { limit } }),

  today: () =>
    apiClient.get('/activity-logs/today'),

  weekly: (days = 7) =>
    apiClient.get('/activity-logs/weekly', { params: { days } }),

  summary: () =>
    apiClient.get('/activity-logs/summary'),
}
