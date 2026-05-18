import apiClient from './apiClient'
import type { CreateStudyRoomPayload, PaginatedResponse, StudyRoom } from '@/types/models'

export const studyRoomAPI = {
  list: (params?: { limit?: number; is_private?: boolean }) =>
    apiClient.get<PaginatedResponse<StudyRoom>>('/study-rooms', { params }),

  get: (id: string) =>
    apiClient.get<{ room: StudyRoom; stats?: Record<string, any> }>(`/study-rooms/${id}`),

  create: (data: CreateStudyRoomPayload) =>
    apiClient.post<{ message: string; room: StudyRoom }>('/study-rooms', data),

  join: (id: string) =>
    apiClient.post(`/study-rooms/${id}/join`),

  leave: (id: string) =>
    apiClient.post(`/study-rooms/${id}/leave`),

  getUserRooms: (limit = 10) =>
    apiClient.get<PaginatedResponse<StudyRoom>>('/study-rooms/my-rooms', { params: { limit } }),

  getMembers: (id: string, limit = 20) =>
    apiClient.get(`/study-rooms/${id}/members`, { params: { limit } }),

  getRecommended: (limit = 20) =>
    apiClient.get<PaginatedResponse<StudyRoom>>('/study-rooms/recommended', { params: { limit } }),
}
