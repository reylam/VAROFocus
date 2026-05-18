import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/api/tasks';
import type { CreateTaskPayload, TaskFilters, UpdateTaskPayload } from '@/types/models';

export const useTasks = (filters?: TaskFilters) =>
  useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const response = await tasksAPI.list(filters);
      return response.data;
    },
  });

export const useTask = (id: string) =>
  useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const response = await tasksAPI.get(id);
      return response.data.task;
    },
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskPayload) => tasksAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTaskPayload) => tasksAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useCompleteTask = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => tasksAPI.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useAttackMonster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, damage = 10, source = 'manual' }: { id: string; damage?: number; source?: string }) =>
      tasksAPI.attackMonster(id, { damage, source }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task'] });
    },
  });
};
