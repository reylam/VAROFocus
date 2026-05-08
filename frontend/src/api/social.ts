import apiClient from './apiClient';
import type {
  Friend,
  FriendRequest,
  StudyRoom,
  CreateStudyRoomPayload,
  RoomSession,
  Challenge,
  CreateChallengePayload,
  PaginatedResponse,
} from '@/types/models';

export const friendsAPI = {
  list: () =>
    apiClient.get<Friend[]>('/friends'),

  add: (userId: string) =>
    apiClient.post('/friends', { friend_id: userId }),

  remove: (id: string) =>
    apiClient.delete(`/friends/${id}`),

  block: (id: string) =>
    apiClient.post(`/friends/${id}/block`),

  unblock: (id: string) =>
    apiClient.post(`/friends/${id}/unblock`),

  getBlocked: () =>
    apiClient.get<Friend[]>('/friends/blocked'),

  getFriendStats: (id: string) =>
    apiClient.get(`/friends/${id}/stats`),
};

export const friendRequestsAPI = {
  list: () =>
    apiClient.get<FriendRequest[]>('/friend-requests'),

  accept: (id: string) =>
    apiClient.post(`/friend-requests/${id}/accept`),

  reject: (id: string) =>
    apiClient.post(`/friend-requests/${id}/reject`),

  getPendingCount: () =>
    apiClient.get('/friend-requests/pending-count'),
};

export const studyRoomsAPI = {
  list: () =>
    apiClient.get<StudyRoom[]>('/study-rooms'),

  create: (data: CreateStudyRoomPayload) =>
    apiClient.post<StudyRoom>('/study-rooms', data),

  get: (id: string) =>
    apiClient.get<StudyRoom>(`/study-rooms/${id}`),

  update: (id: string, data: Partial<StudyRoom>) =>
    apiClient.put<StudyRoom>(`/study-rooms/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/study-rooms/${id}`),

  join: (id: string) =>
    apiClient.post(`/study-rooms/${id}/join`),

  leave: (id: string) =>
    apiClient.post(`/study-rooms/${id}/leave`),

  invite: (id: string, userId: string) =>
    apiClient.post(`/study-rooms/${id}/invite`, { user_id: userId }),

  removeMember: (id: string, userId: string) =>
    apiClient.post(`/study-rooms/${id}/remove-member`, { user_id: userId }),

  setMemberRole: (id: string, userId: string, role: string) =>
    apiClient.post(`/study-rooms/${id}/set-role`, { user_id: userId, role }),

  getMembers: (id: string) =>
    apiClient.get(`/study-rooms/${id}/members`),

  getSessions: (id: string) =>
    apiClient.get<RoomSession[]>(`/study-rooms/${id}/sessions`),

  getRecommended: () =>
    apiClient.get<StudyRoom[]>('/study-rooms/recommended'),

  getUserRooms: () =>
    apiClient.get<StudyRoom[]>('/study-rooms/my-rooms'),
};

export const roomSessionsAPI = {
  list: () =>
    apiClient.get<RoomSession[]>('/room-sessions'),

  create: (roomId: string) =>
    apiClient.post<RoomSession>('/room-sessions', { room_id: roomId }),

  get: (id: string) =>
    apiClient.get<RoomSession>(`/room-sessions/${id}`),

  end: (id: string) =>
    apiClient.post(`/room-sessions/${id}/end`),

  delete: (id: string) =>
    apiClient.delete(`/room-sessions/${id}`),

  getActive: () =>
    apiClient.get<RoomSession[]>('/room-sessions/active'),

  getStats: () =>
    apiClient.get('/room-sessions/stats'),

  getToday: () =>
    apiClient.get<RoomSession[]>('/room-sessions/today'),

  getPeakHours: () =>
    apiClient.get('/room-sessions/peak-hours'),
};

export const challengesAPI = {
  list: () =>
    apiClient.get<PaginatedResponse<Challenge>>('/challenges'),

  create: (data: CreateChallengePayload) =>
    apiClient.post<Challenge>('/challenges', data),

  get: (id: string) =>
    apiClient.get<Challenge>(`/challenges/${id}`),

  update: (id: string, data: Partial<Challenge>) =>
    apiClient.put<Challenge>(`/challenges/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/challenges/${id}`),

  join: (id: string) =>
    apiClient.post(`/challenges/${id}/join`),

  leave: (id: string) =>
    apiClient.post(`/challenges/${id}/leave`),

  getActive: () =>
    apiClient.get<Challenge[]>('/challenges/active'),

  getUserChallenges: () =>
    apiClient.get<Challenge[]>('/challenges/my-challenges'),

  getParticipants: (id: string) =>
    apiClient.get(`/challenges/${id}/participants`),

  getRankings: (id: string) =>
    apiClient.get(`/challenges/${id}/rankings`),
};
