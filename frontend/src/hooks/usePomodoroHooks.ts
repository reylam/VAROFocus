  import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pomodoroAPI } from '@/api/pomodoro';
import type { CreatePomodoroSessionPayload } from '@/types/models';

export const usePomodoroSessions = () =>
  useQuery({
    queryKey: ['pomodoroSessions'],
    queryFn: async () => {
      const response = await pomodoroAPI.listSessions()
      return response.data
    },
  });

export const usePomodoroSession = (id: string) =>
  useQuery({
    queryKey: ['pomodoroSession', id],
    queryFn: async () => {
      const response = await pomodoroAPI.getSession(id)
      return response.data
    },
  });

export const useCreatePomodoroSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePomodoroSessionPayload) => pomodoroAPI.createSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomodoroSessions'] });
    },
  });
};

export const useCompletePomodoroSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pomodoroAPI.completeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomodoroSessions'] });
      queryClient.invalidateQueries({ queryKey: ['task'] });
    },
  });
};

export const usePomodoroStreak = () =>
  useQuery({
    queryKey: ['pomodoroStreak'],
    queryFn: () => pomodoroAPI.getStreak(),
  });

export const useResetPomodoroStreak = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => pomodoroAPI.resetStreak(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomodoroStreak'] });
    },
  });
};
