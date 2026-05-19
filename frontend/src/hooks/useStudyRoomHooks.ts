import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyRooms, getRecommendedRooms, getStudyRoom, getStudyRooms, studyRoomsAPI } from '@/api/studyRooms'
import type { CreateStudyRoomPayload, StudyRoom, StudyRoomStats } from '@/types/models'

export const useStudyRooms = (params?: { limit?: number }) =>
  useQuery<StudyRoom[]>({
    queryKey: ['studyRooms', params],
    queryFn: () => getStudyRooms(params),
    retry: 1,
  })

export const useStudyRoom = (id: string) =>
  useQuery<{ room: StudyRoom; stats: StudyRoomStats }>({
    queryKey: ['studyRoom', id],
    queryFn: () => getStudyRoom(id),
    enabled: Boolean(id),
  })

export const useCreateStudyRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateStudyRoomPayload) => (await studyRoomsAPI.create(payload)).data.room,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studyRooms'] }),
  })
}

export const useJoinStudyRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (roomId: string) => (await studyRoomsAPI.join(roomId)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studyRooms'] }),
  })
}

export const useLeaveStudyRoom = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (roomId: string) => (await studyRoomsAPI.leave(roomId)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studyRooms'] }),
  })
}

export const useStartStudyRoomSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (roomId: string) => (await studyRoomsAPI.startSession(roomId)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studyRooms'] }),
  })
}

export const useEndStudyRoomSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (roomId: string) => (await studyRoomsAPI.endSession(roomId)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['studyRooms'] }),
  })
}

export const useUserStudyRooms = () =>
  useQuery<StudyRoom[]>({
    queryKey: ['myStudyRooms'],
    queryFn: getMyRooms,
  })

export const useRecommendedStudyRooms = () =>
  useQuery<StudyRoom[]>({
    queryKey: ['recommendedStudyRooms'],
    queryFn: getRecommendedRooms,
  })
