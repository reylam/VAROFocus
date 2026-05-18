import apiClient from './apiClient';
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilters,
  PaginatedResponse,
  SuccessResponse,
} from '@/types/models';

export const tasksAPI = {
  list: (filters?: TaskFilters) =>
    apiClient.get<PaginatedResponse<Task>>('/tasks', { params: filters }),

  create: (data: CreateTaskPayload) =>
    apiClient.post<SuccessResponse<Task>>('/tasks', data),

  get: (id: string) =>
    apiClient.get<{ task: Task; stats?: Record<string, any> }>(`/tasks/${id}`),

  update: (id: string, data: UpdateTaskPayload) =>
    apiClient.put<SuccessResponse<Task>>(`/tasks/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/tasks/${id}`),

  start: (id: string) =>
    apiClient.post<SuccessResponse<Task>>(`/tasks/${id}/start`),

  complete: (id: string) =>
    apiClient.post<SuccessResponse<Task>>(`/tasks/${id}/complete`),

  fail: (id: string) =>
    apiClient.post<SuccessResponse<Task>>(`/tasks/${id}/fail`),

  attackMonster: (id: string, payload: { damage?: number; source?: string } = {}) =>
    apiClient.post(`/tasks/${id}/attack-monster`, {
      damage: payload.damage ?? 10,
      source: payload.source ?? 'manual',
    }),

  getOverdue: () =>
    apiClient.get<Task[]>('/tasks/overdue'),

  getDueSoon: () =>
    apiClient.get<Task[]>('/tasks/due-soon'),

  getPublic: () =>
    apiClient.get<PaginatedResponse<Task>>('/tasks/public'),
};
