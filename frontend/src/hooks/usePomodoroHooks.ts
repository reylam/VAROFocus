import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pomodoroAPI } from '@/api/pomodoro'

export const usePomodoroList = (filters?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['pomodoro-sessions', filters],
    queryFn: async () => {
      const res = await pomodoroAPI.list(filters)
      return res.data
    },
  })

export const usePomodoro = (id: string) =>
  useQuery({
    queryKey: ['pomodoro-session', id],
    queryFn: async () => {
      const res = await pomodoroAPI.get(id)
      return res.data
    },
  })

export const useStartPomodoro = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { task_id?: string; duration_minutes: number; break_minutes?: number }) => pomodoroAPI.start(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pomodoro-sessions'] })
    },
  })
}

export const useCompletePomodoro = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => pomodoroAPI.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pomodoro-session', id] })
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export default {
  usePomodoroList,
  usePomodoro,
  useStartPomodoro,
  useCompletePomodoro,
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pomodoroAPI } from '@/api/pomodoro'
import type { CreatePomodoroSessionPayload, PomodoroSession } from '@/types/models'

export const usePomodoroSessions = () =>
  useQuery({
    queryKey: ['pomodoroSessions'],
    queryFn: async () => (await pomodoroAPI.list()).data,
  })

export const useCreatePomodoroSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreatePomodoroSessionPayload) => (await pomodoroAPI.create(payload)).data.session,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pomodoroSessions'] }),
  })
}

export const useCompletePomodoroSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => (await pomodoroAPI.complete(id)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomodoroSessions'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export const usePomodoroStreak = () =>
  useQuery({
    queryKey: ['pomodoroStreak'],
    queryFn: async () => (await pomodoroAPI.streak()).data,
  })

export type PomodoroList = PomodoroSession[]
