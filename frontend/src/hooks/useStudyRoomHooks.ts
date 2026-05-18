import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { studyRoomAPI } from '@/api/studyRooms'
import type { CreateStudyRoomPayload, StudyRoom } from '@/types/models'

export const useStudyRooms = (params?: { limit?: number; is_private?: boolean }) =>
  useQuery({
    queryKey: ['studyRooms', params],
    queryFn: async () => {
      const response = await studyRoomAPI.list(params)
      return response.data
    },
  })

export const useStudyRoom = (id: string) =>
  useQuery({
    queryKey: ['studyRoom', id],
    queryFn: async () => {
      const response = await studyRoomAPI.get(id)
      return response.data.room
    },
  })

export const useCreateStudyRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateStudyRoomPayload) => studyRoomAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyRooms'] })
      queryClient.invalidateQueries({ queryKey: ['studyRoom'] })
    },
  })
}

export const useJoinStudyRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (roomId: string) => studyRoomAPI.join(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyRooms'] })
      queryClient.invalidateQueries({ queryKey: ['studyRoom'] })
    },
  })
}

export const useLeaveStudyRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (roomId: string) => studyRoomAPI.leave(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyRooms'] })
      queryClient.invalidateQueries({ queryKey: ['studyRoom'] })
    },
  })
}

export const useUserStudyRooms = () =>
  useQuery({
    queryKey: ['myStudyRooms'],
    queryFn: async () => {
      const response = await studyRoomAPI.getUserRooms()
      return response.data
    },
  })
