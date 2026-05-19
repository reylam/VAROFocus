import apiClient from './apiClient'
import type {
  CreateTaskPayload,
  PaginatedResponse,
  SuccessResponse,
  Task,
  TaskFilters,
  UpdateTaskPayload,
} from '@/types/models'

export const tasksAPI = {
  list: (filters?: TaskFilters) => apiClient.get<PaginatedResponse<Task>>('/tasks', { params: filters }),
  create: (data: CreateTaskPayload) => apiClient.post<{ message: string; task: Task }>('/tasks', data),
  get: (id: string) => apiClient.get<{ task: Task; stats: Record<string, unknown> }>(`/tasks/${id}`),
  update: (id: string, data: UpdateTaskPayload) => apiClient.put<{ message: string; task: Task }>(`/tasks/${id}`, data),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/tasks/${id}`),
  start: (id: string) => apiClient.post<{ message: string; task: Task }>(`/tasks/${id}/start`),
  complete: (id: string) => apiClient.post<{ message: string; task: Task; xp_earned: number }>(`/tasks/${id}/complete`),
  fail: (id: string) => apiClient.post<{ message: string; task: Task }>(`/tasks/${id}/fail`),
  attackMonster: (id: string, payload: { damage: number; source: 'pomodoro' | 'manual' | 'skill' }) =>
    apiClient.post<{
      message: string
      monster_hp: number
      monster_hp_percentage: number
      is_dead: boolean
      task_completed?: boolean
      xp_earned?: number
    }>(`/tasks/${id}/attack-monster`, payload),
  overdue: () => apiClient.get<Task[]>('/tasks/overdue'),
  dueSoon: (days = 7) => apiClient.get<Task[]>('/tasks/due-soon', { params: { days } }),
  public: (limit = 20) => apiClient.get<PaginatedResponse<Task>>('/tasks/public', { params: { limit } }),
}

export const getTasks = async (params?: TaskFilters) => (await tasksAPI.list(params)).data
export const getTask = async (id: string) => (await tasksAPI.get(id)).data
export const createTask = async (payload: CreateTaskPayload) => (await tasksAPI.create(payload)).data
export const updateTask = async (id: string, payload: UpdateTaskPayload) => (await tasksAPI.update(id, payload)).data
export const deleteTask = async (id: string) => (await tasksAPI.delete(id)).data
export const startTask = async (id: string) => (await tasksAPI.start(id)).data
export const completeTask = async (id: string) => (await tasksAPI.complete(id)).data
export const attackMonster = async (id: string, damage: number, source: 'pomodoro' | 'manual' | 'skill' = 'manual') =>
  (await tasksAPI.attackMonster(id, { damage, source })).data
export const addCheer = async (id: string) => (await apiClient.post<SuccessResponse<never>>(`/tasks/${id}/add-cheer`)).data
