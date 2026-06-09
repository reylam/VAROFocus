import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pomodoroAPI } from '@/api/pomodoro'
import type { CreatePomodoroSessionPayload, PomodoroSession } from '@/types/models'

export const usePomodoroSessions = () =>
  useQuery({
    queryKey: ['pomodoroSessions'],
    queryFn: async () => (await pomodoroAPI.list()).data,
  })

export const useStartPomodoro = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreatePomodoroSessionPayload) => (await pomodoroAPI.create(payload)).data.session,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pomodoroSessions'] }),
  })
}

export const useCompletePomodoro = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => (await pomodoroAPI.complete(id)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomodoroSessions'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export const useCancelPomodoro = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => (await pomodoroAPI.cancel(id)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pomodoroSessions'] }),
  })
}

export const usePomodoroStreak = () =>
  useQuery({
    queryKey: ['pomodoroStreak'],
    queryFn: async () => (await pomodoroAPI.streak()).data,
  })

export type PomodoroList = PomodoroSession[]
