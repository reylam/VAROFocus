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
  type Context = { previousTasks: unknown; previousTask: unknown }
  return useMutation<unknown, Error, { id: string; damage?: number; source?: 'manual' | 'pomodoro' | 'skill' }, Context>({
    mutationFn: async ({ id, damage = 10, source = 'manual' }: { id: string; damage?: number; source?: 'manual' | 'pomodoro' | 'skill' }) =>
      tasksAPI.attackMonster(id, { damage, source }),
    // Optimistic update: decrement HP locally then reconcile with server
    onMutate: async ({ id, damage = 10 }: { id: string; damage?: number }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['task', id] });

      const previousTasks = queryClient.getQueryData(['tasks'])
      const previousTask = queryClient.getQueryData(['task', id])

      // Update tasks list cache
      queryClient.setQueryData(['tasks'], (old: unknown) => {
        if (!old) return old
        const updated = { ...old as Record<string, unknown> }
        const dataArr = Array.isArray(updated.data) ? updated.data : []
        updated.data = dataArr.map((t: Record<string, unknown>) => {
          if (t.id !== id) return t
          const monster = Array.isArray(t.monster) ? t.monster[0] : t.monster as Record<string, unknown>
          if (monster && typeof monster === 'object') {
            monster.current_hp = Math.max(0, (monster.current_hp as number) - (damage ?? 10))
          }
          return t
        })
        return updated
      })

      // Update single task cache
      queryClient.setQueryData(['task', id], (old: unknown) => {
        if (!old) return old
        const t = { ...old as Record<string, unknown> }
        const monster = Array.isArray(t.monster) ? t.monster[0] : t.monster as Record<string, unknown>
        if (monster && typeof monster === 'object') {
          monster.current_hp = Math.max(0, (monster.current_hp as number) - (damage ?? 10))
        }
        return t
      })

      return { previousTasks, previousTask }
    },
    onError: (_err: Error, variables: { id: string; damage?: number; source?: 'manual' | 'pomodoro' | 'skill' }, context?: Context) => {
      // rollback
      if (context?.previousTasks) queryClient.setQueryData(['tasks'], context.previousTasks)
      if (context?.previousTask) queryClient.setQueryData(['task', variables.id], context.previousTask)
    },
    onSettled: (data: unknown, error: Error | null, variables: { id: string; damage?: number; source?: 'manual' | 'pomodoro' | 'skill' }) => {
      // Re-fetch to reconcile server state
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] })
    },
  });
};
