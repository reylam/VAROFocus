import { useQuery } from '@tanstack/react-query'
import { activityAPI } from '@/api/activity'
import type { ActivityLog } from '@/types/models'

export const useActivityLogs = (limit = 20) =>
  useQuery({
    queryKey: ['activityLogs', limit],
    queryFn: async () => {
      const response = await activityAPI.list({ limit })
      return response.data
    },
  })

export const useRecentActivity = (limit = 10) =>
  useQuery<ActivityLog[]>({
    queryKey: ['recentActivity', limit],
    queryFn: async () => {
      const response = await activityAPI.recent(limit)
      return response.data
    },
  })

export const useTodayActivity = () =>
  useQuery({
    queryKey: ['todayActivity'],
    queryFn: async () => {
      const response = await activityAPI.today()
      return response.data
    },
  })

export const useWeeklyActivity = (days = 7) =>
  useQuery({
    queryKey: ['weeklyActivity', days],
    queryFn: async () => {
      const response = await activityAPI.weekly(days)
      return response.data
    },
  })

export const useActivitySummary = () =>
  useQuery({
    queryKey: ['activitySummary'],
    queryFn: async () => {
      const response = await activityAPI.summary()
      return response.data
    },
  })
