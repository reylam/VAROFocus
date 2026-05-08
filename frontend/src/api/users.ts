import apiClient from './apiClient';
import type {
  User,
  UserStats,
  PaginatedResponse,
  SuccessResponse,
} from '@/types/models';

export const usersAPI = {
  list: (limit: number = 10) =>
    apiClient.get<PaginatedResponse<User>>('/users', { params: { limit } }),

  get: (id: string) => apiClient.get<User>(`/users/${id}`),

  update: (id: string, data: Partial<User>) =>
    apiClient.put<SuccessResponse<User>>(`/users/${id}`, data),

  getStats: (id: string) =>
    apiClient.get<UserStats>(`/users/${id}/stats`),

  getActivityFeed: (id: string, limit: number = 20) =>
    apiClient.get(`/users/${id}/activity-feed`, { params: { limit } }),

  topUsers: (limit: number = 10) =>
    apiClient.get<User[]>('/users/top-users', { params: { limit } }),

  search: (query: string) =>
    apiClient.get<PaginatedResponse<User>>('/users/search', { params: { search: query } }),

  updatePassword: (id: string, data: { current_password: string; new_password: string; new_password_confirmation: string }) =>
    apiClient.post(`/users/${id}/update-password`, data),
};
