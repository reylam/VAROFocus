import apiClient from './apiClient';
import type { Schedule, Reminder, CalendarEvent, PaginatedResponse } from '@/types/models';

export const schedulesAPI = {
  list: (params?: { limit?: number; page?: number }) =>
    apiClient.get<PaginatedResponse<Schedule>>('/schedules', { params }),

  create: (data: Partial<Schedule>) =>
    apiClient.post<{ message: string; data: Schedule }>('/schedules', data),

  get: (id: string) =>
    apiClient.get<Schedule>(`/schedules/${id}`),

  update: (id: string, data: Partial<Schedule>) =>
    apiClient.put<{ message: string; data: Schedule }>(`/schedules/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/schedules/${id}`),

  getToday: () =>
    apiClient.get<Schedule[]>('/schedules/today'),

  getUpcoming: (days?: number) =>
    apiClient.get<Schedule[]>('/schedules/upcoming', { params: { days } }),

  getByPriority: (priority: string, limit = 20) =>
    apiClient.get<PaginatedResponse<Schedule>>(`/schedules/by-priority/${priority}`, { params: { limit } }),

  getStats: () =>
    apiClient.get('/schedules/stats'),

  autoSchedule: () =>
    apiClient.post('/schedules/auto-schedule'),

  bulkUpdate: (data: any) =>
    apiClient.post('/schedules/bulk-update', data),
};

export const remindersAPI = {
  list: (params?: { limit?: number; sent?: boolean }) =>
    apiClient.get<PaginatedResponse<Reminder>>('/reminders', { params }),

  create: (data: Partial<Reminder>) =>
    apiClient.post<{ message: string; data: Reminder }>('/reminders', data),

  get: (id: string) =>
    apiClient.get<Reminder>(`/reminders/${id}`),

  update: (id: string, data: Partial<Reminder>) =>
    apiClient.put<{ message: string; data: Reminder }>(`/reminders/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/reminders/${id}`),

  getUpcoming: (hours?: number) =>
    apiClient.get<Reminder[]>('/reminders/upcoming', { params: { hours } }),

  getPending: () =>
    apiClient.get<Reminder[]>('/reminders/pending'),

  getByType: (type: string, limit = 20) =>
    apiClient.get<PaginatedResponse<Reminder>>(`/reminders/by-type/${type}`, { params: { limit } }),

  getStats: () =>
    apiClient.get('/reminders/stats'),

  send: (id: string) =>
    apiClient.post(`/reminders/${id}/send`),
};

export const calendarAPI = {
  list: (params?: { limit?: number; sync_service?: string }) =>
    apiClient.get<PaginatedResponse<CalendarEvent>>('/calendar-events', { params }),

  create: (data: Partial<CalendarEvent>) =>
    apiClient.post<{ message: string; data: CalendarEvent }>('/calendar-events', data),

  get: (id: string) =>
    apiClient.get<CalendarEvent>(`/calendar-events/${id}`),

  update: (id: string, data: Partial<CalendarEvent>) =>
    apiClient.put<{ message: string; data: CalendarEvent }>(`/calendar-events/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/calendar-events/${id}`),

  getToday: () =>
    apiClient.get<CalendarEvent[]>('/calendar-events/today'),

  getUpcoming: (days?: number) =>
    apiClient.get<CalendarEvent[]>('/calendar-events/upcoming', { params: { days } }),

  getByDate: (date: string) =>
    apiClient.get<CalendarEvent[]>(`/calendar-events/by-date/${date}`),

  getByDateRange: (startDate: string, endDate: string) =>
    apiClient.post<CalendarEvent[]>('/calendar-events/by-date-range', {
      start_date: startDate,
      end_date: endDate,
    }),

  getSyncStats: () =>
    apiClient.get('/calendar-events/sync-stats'),

  syncGoogle: (token: string) =>
    apiClient.post('/calendar-events/sync-google', { access_token: token }),

  syncApple: () =>
    apiClient.post('/calendar-events/sync-apple'),

  syncOutlook: (token: string) =>
    apiClient.post('/calendar-events/sync-outlook', { access_token: token }),
};
