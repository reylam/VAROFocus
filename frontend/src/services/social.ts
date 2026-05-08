import api from './api'
import type { Friend, FriendRequest, FriendStats } from '../types'

export async function fetchFriends() {
  const { data } = await api.get<Friend[]>('/friends')
  return data
}

export async function addFriend(userId: string) {
  const { data } = await api.post<Friend>('/friends', { friend_id: userId })
  return data
}

export async function removeFriend(friendId: string) {
  await api.delete(`/friends/${friendId}`)
}

export async function acceptFriendRequest(requestId: string) {
  const { data } = await api.post<Friend>(`/friend-requests/${requestId}/accept`)
  return data
}

export async function rejectFriendRequest(requestId: string) {
  await api.post(`/friend-requests/${requestId}/reject`)
}

export async function fetchFriendRequests() {
  const { data } = await api.get<FriendRequest[]>('/friend-requests')
  return data
}

export async function getPendingFriendRequestCount() {
  const { data } = await api.get<{ count: number }>('/friend-requests/pending-count')
  return data
}

export async function blockFriend(friendId: string) {
  await api.post(`/friends/${friendId}/block`)
}

export async function unblockFriend(friendId: string) {
  await api.post(`/friends/${friendId}/unblock`)
}

export async function fetchBlockedFriends() {
  const { data } = await api.get<Friend[]>('/friends/blocked')
  return data
}

export async function fetchFriendStats(friendId: string) {
  const { data } = await api.get<FriendStats>(`/friends/${friendId}/stats`)
  return data
}

export async function searchUsers(query: string) {
  const { data } = await api.get(`/users/search?q=${encodeURIComponent(query)}`)
  return data
}
