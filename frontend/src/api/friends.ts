import apiClient from './apiClient';
import type { Friend, FriendRequest } from '@/types/models'

export const friendsAPI = {
  getFriends: () => api.get<Friend[]>('/friends'),
  
  getFriendRequests: () => api.get<FriendRequest[]>('/friend-requests'),
  
  sendFriendRequest: (userId: string) => api.post('/friend-requests', { user_id: userId }),
  
  acceptFriendRequest: (requestId: string) => api.post(`/friend-requests/${requestId}/accept`),
  
  rejectFriendRequest: (requestId: string) => api.post(`/friend-requests/${requestId}/reject`),
  
  removeFriend: (friendId: string) => api.delete(`/friends/${friendId}`),
  
  getPendingRequestCount: () => api.get<{ count: number }>('/friend-requests/pending-count'),
  
  searchUsers: (query: string) => api.get(`/users/search?q=${encodeURIComponent(query)}`),
}

export default friendsAPI