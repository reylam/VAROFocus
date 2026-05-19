import apiClient from './apiClient'
import type { CreateStudyRoomPayload, PaginatedResponse, StudyRoom, StudyRoomStats, User } from '@/types/models'

export const studyRoomsAPI = {
  list: (params?: { limit?: number }) => apiClient.get<PaginatedResponse<StudyRoom> | StudyRoom[]>('/study-rooms', { params }),
  create: (payload: CreateStudyRoomPayload) => apiClient.post<{ message: string; room: StudyRoom }>('/study-rooms', payload),
  get: (id: string) => apiClient.get<{ room: StudyRoom; stats: StudyRoomStats }>(`/study-rooms/${id}`),
  update: (id: string, payload: Partial<CreateStudyRoomPayload>) => apiClient.put<{ message: string; room: StudyRoom }>(`/study-rooms/${id}`, payload),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/study-rooms/${id}`),
  join: (id: string) => apiClient.post<{ message: string }>(`/study-rooms/${id}/join`),
  leave: (id: string) => apiClient.post<{ message: string }>(`/study-rooms/${id}/leave`),
  startSession: (id: string) => apiClient.post<{ message: string }>(`/study-rooms/${id}/start-session`),
  endSession: (id: string) => apiClient.post<{ message: string }>(`/study-rooms/${id}/end-session`),
  recommended: () => apiClient.get<StudyRoom[]>('/study-rooms/recommended'),
  mine: () => apiClient.get<StudyRoom[]>('/study-rooms/my-rooms'),
  members: (id: string) => apiClient.get<User[]>(`/study-rooms/${id}/members`),
}

const unwrapRooms = (payload: PaginatedResponse<StudyRoom> | StudyRoom[]) => (Array.isArray(payload) ? payload : payload.data)

export const getStudyRooms = async (params?: { limit?: number }) => unwrapRooms((await studyRoomsAPI.list(params)).data)
export const getRecommendedRooms = async () => (await studyRoomsAPI.recommended()).data
export const getMyRooms = async () => (await studyRoomsAPI.mine()).data
export const createStudyRoom = async (payload: CreateStudyRoomPayload) => (await studyRoomsAPI.create(payload)).data.room
export const getStudyRoom = async (id: string) => (await studyRoomsAPI.get(id)).data
export const joinStudyRoom = async (id: string) => (await studyRoomsAPI.join(id)).data
export const leaveStudyRoom = async (id: string) => (await studyRoomsAPI.leave(id)).data
