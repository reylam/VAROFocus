import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { friendsAPI } from '@/api/friends'
import type { Friend } from '@/types/models'

export const useFriends = () =>
  useQuery<Friend[]>({
    queryKey: ['friends'],
    queryFn: async () => {
      const response = await friendsAPI.getFriends()
      // Backend returns a Laravel paginator ({ data: [...] }); normalize to a plain array
      const payload = response.data as Friend[] | { data?: Friend[] }
      return Array.isArray(payload) ? payload : payload?.data ?? []
    },
  })

export const useFriendRequests = () =>
  useQuery({
    queryKey: ['friendRequests'],
    queryFn: async () => {
      const response = await friendsAPI.getFriendRequests()
      return response.data
    },
  })

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => friendsAPI.sendFriendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] })
    },
  })
}

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) => friendsAPI.acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] })
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] })
    },
  })
}

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) => friendsAPI.rejectFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] })
    },
  })
}

export const useRemoveFriend = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (friendId: string) => friendsAPI.removeFriend(friendId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] })
    },
  })
}