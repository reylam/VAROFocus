import apiClient from './apiClient';
import type { Friend, FriendRequest } from '@/types/models'

export const friendsAPI = {
  getFriends: () => apiClient.get<Friend[]>('/friends'),

  getFriendRequests: () => apiClient.get<FriendRequest[]>('/friend-requests'),

  sendFriendRequest: (userId: string) => apiClient.post('/friend-requests', { user_id: userId }),

  acceptFriendRequest: (requestId: string) => apiClient.post(`/friend-requests/${requestId}/accept`),

  rejectFriendRequest: (requestId: string) => apiClient.post(`/friend-requests/${requestId}/reject`),

  removeFriend: (friendId: string) => apiClient.delete(`/friends/${friendId}`),

  getPendingRequestCount: () => apiClient.get<{ count: number }>('/friend-requests/pending-count'),

  searchUsers: (query: string) => apiClient.get(`/users/search?q=${encodeURIComponent(query)}`),
}

export default friendsAPI