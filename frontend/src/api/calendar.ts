import apiClient from './apiClient';
import type { Schedule, Reminder, CalendarEvent } from '@/types/models';

export const schedulesAPI = {
  list: () =>
    apiClient.get<Schedule[]>('/schedules'),

  create: (data: Partial<Schedule>) =>
    apiClient.post<Schedule>('/schedules', data),

  get: (id: string) =>
    apiClient.get<Schedule>(`/schedules/${id}`),

  update: (id: string, data: Partial<Schedule>) =>
    apiClient.put<Schedule>(`/schedules/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/schedules/${id}`),

  getToday: () =>
    apiClient.get<Schedule[]>('/schedules/today'),

  getUpcoming: () =>
    apiClient.get<Schedule[]>('/schedules/upcoming'),

  getByPriority: (priority: number) =>
    apiClient.get<Schedule[]>(`/schedules/by-priority/${priority}`),

  getStats: () =>
    apiClient.get('/schedules/stats'),

  autoSchedule: () =>
    apiClient.post('/schedules/auto-schedule'),

  bulkUpdate: (data: any) =>
    apiClient.post('/schedules/bulk-update', data),
};

export const remindersAPI = {
  list: () =>
    apiClient.get<Reminder[]>('/reminders'),

  create: (data: Partial<Reminder>) =>
    apiClient.post<Reminder>('/reminders', data),

  get: (id: string) =>
    apiClient.get<Reminder>(`/reminders/${id}`),

  update: (id: string, data: Partial<Reminder>) =>
    apiClient.put<Reminder>(`/reminders/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/reminders/${id}`),

  getUpcoming: () =>
    apiClient.get<Reminder[]>('/reminders/upcoming'),

  getPending: () =>
    apiClient.get<Reminder[]>('/reminders/pending'),

  getByType: (type: string) =>
    apiClient.get<Reminder[]>(`/reminders/by-type/${type}`),

  getStats: () =>
    apiClient.get('/reminders/stats'),

  send: (id: string) =>
    apiClient.post(`/reminders/${id}/send`),
};

export const calendarAPI = {
  list: () =>
    apiClient.get<CalendarEvent[]>('/calendar-events'),

  create: (data: Partial<CalendarEvent>) =>
    apiClient.post<CalendarEvent>('/calendar-events', data),

  get: (id: string) =>
    apiClient.get<CalendarEvent>(`/calendar-events/${id}`),

  update: (id: string, data: Partial<CalendarEvent>) =>
    apiClient.put<CalendarEvent>(`/calendar-events/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/calendar-events/${id}`),

  getToday: () =>
    apiClient.get<CalendarEvent[]>('/calendar-events/today'),

  getUpcoming: () =>
    apiClient.get<CalendarEvent[]>('/calendar-events/upcoming'),

  getByDate: (date: string) =>
    apiClient.get<CalendarEvent[]>(`/calendar-events/by-date/${date}`),

  getByDateRange: (startDate: string, endDate: string) =>
    apiClient.post<CalendarEvent[]>('/calendar-events/by-date-range', {
      start_date: startDate,
      end_date: endDate,
    }),

  getSyncStats: () =>
    apiClient.get('/calendar-events/sync-stats'),

  syncGoogle: () =>
    apiClient.post('/calendar-events/sync-google'),

  syncApple: () =>
    apiClient.post('/calendar-events/sync-apple'),

  syncOutlook: () =>
    apiClient.post('/calendar-events/sync-outlook'),
};
