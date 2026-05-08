import apiClient from './apiClient';
import type { TaskComment, TaskCheer, CreateCommentPayload, PaginatedResponse } from '@/types/models';

export const commentsAPI = {
  list: (taskId: string, limit: number = 20) =>
    apiClient.get<PaginatedResponse<TaskComment>>(`/tasks/${taskId}/comments`, {
      params: { limit },
    }),

  create: (taskId: string, data: CreateCommentPayload) =>
    apiClient.post<TaskComment>(`/tasks/${taskId}/comments`, data),

  get: (taskId: string, commentId: string) =>
    apiClient.get<TaskComment>(`/tasks/${taskId}/comments/${commentId}`),

  update: (taskId: string, commentId: string, data: CreateCommentPayload) =>
    apiClient.put<TaskComment>(`/tasks/${taskId}/comments/${commentId}`, data),

  delete: (taskId: string, commentId: string) =>
    apiClient.delete(`/tasks/${taskId}/comments/${commentId}`),

  getCount: (taskId: string) =>
    apiClient.get(`/tasks/${taskId}/comments/count`),

  getReplies: (taskId: string, commentId: string) =>
    apiClient.get<TaskComment[]>(`/tasks/${taskId}/comments/${commentId}/replies`),

  addReply: (taskId: string, commentId: string, data: CreateCommentPayload) =>
    apiClient.post<TaskComment>(`/tasks/${taskId}/comments/${commentId}/replies`, data),
};

export const cheersAPI = {
  list: (taskId: string, limit: number = 20) =>
    apiClient.get<PaginatedResponse<TaskCheer>>(`/tasks/${taskId}/cheers`, {
      params: { limit },
    }),

  add: (taskId: string) =>
    apiClient.post(`/tasks/${taskId}/cheers`),

  delete: (taskId: string, cheerId: string) =>
    apiClient.delete(`/tasks/${taskId}/cheers/${cheerId}`),

  hasCheer: (taskId: string) =>
    apiClient.get<{ has_cheer: boolean }>(`/tasks/${taskId}/cheers/has-cheered`),
};
