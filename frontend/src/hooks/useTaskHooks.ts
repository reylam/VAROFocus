import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '@/api/tasks';
import type { CreateTaskPayload, Task, TaskFilters } from '@/types/models';

export const useTasks = (filters?: TaskFilters) =>
  useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksAPI.list(filters),
  });

export const useTask = (id: string) =>
  useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksAPI.get(id),
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
    mutationFn: (data: Partial<Task>) => tasksAPI.update(id, data),
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

export const useAttackMonster = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => tasksAPI.attackMonster(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
    },
  });
};
