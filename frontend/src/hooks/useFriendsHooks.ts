import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { friendsAPI } from '@/api/friends'

export const useFriends = () =>
  useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const response = await friendsAPI.getFriends()
      return response.data
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