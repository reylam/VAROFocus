import api from './api'
import type { StudyRoom, RoomMember, RoomSession } from '../types'

export async function fetchStudyRooms() {
  const { data } = await api.get<StudyRoom[]>('/study-rooms')
  return data
}

export async function fetchRecommendedRooms() {
  const { data } = await api.get<StudyRoom[]>('/study-rooms/recommended')
  return data
}

export async function fetchUserRooms() {
  const { data } = await api.get<StudyRoom[]>('/study-rooms/my-rooms')
  return data
}

export async function fetchRoomDetails(id: string) {
  const { data } = await api.get<StudyRoom>(`/study-rooms/${id}`)
  return data
}

export async function createRoom(room: {
  name: string
  description: string
  capacity: number
  is_public: boolean
}) {
  const { data } = await api.post<StudyRoom>('/study-rooms', room)
  return data
}

export async function joinRoom(id: string) {
  const { data } = await api.post<StudyRoom>(`/study-rooms/${id}/join`)
  return data
}

export async function leaveRoom(id: string) {
  await api.post(`/study-rooms/${id}/leave`)
}

export async function updateRoom(id: string, updates: Partial<StudyRoom>) {
  const { data } = await api.put<StudyRoom>(`/study-rooms/${id}`, updates)
  return data
}

export async function deleteRoom(id: string) {
  await api.delete(`/study-rooms/${id}`)
}

export async function startRoomSession(id: string) {
  const { data } = await api.post<RoomSession>(`/study-rooms/${id}/start-session`)
  return data
}

export async function endRoomSession(id: string) {
  await api.post(`/study-rooms/${id}/end-session`)
}

export async function updateMemberStatus(roomId: string, status: 'idle' | 'ready' | 'focusing') {
  const { data } = await api.post<RoomMember>(`/study-rooms/${roomId}/update-status`, { status })
  return data
}

export async function kickMember(roomId: string, userId: string) {
  await api.post(`/study-rooms/${roomId}/kick-member`, { user_id: userId })
}

export async function promoteMember(roomId: string, userId: string, role: 'moderator' | 'member') {
  const { data } = await api.post<RoomMember>(`/study-rooms/${roomId}/promote-member`, {
    user_id: userId,
    role
  })
  return data
}
