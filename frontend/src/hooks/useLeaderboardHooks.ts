import { useQuery } from '@tanstack/react-query'
import { leaderboardAPI } from '@/api/leaderboards'
import type { LeaderboardEntry } from '@/types/models'

export type LeaderboardMode = 'Weekly' | 'Monthly' | 'Global'

export const useLeaderboardEntries = (mode: LeaderboardMode, limit = 5) =>
  useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboardEntries', mode, limit],
    queryFn: async () => {
      if (mode === 'Weekly') {
        const response = await leaderboardAPI.getWeekly(limit)
        return response.data.entries
      }

      if (mode === 'Monthly') {
        const response = await leaderboardAPI.getMonthly(limit)
        return response.data.entries
      }

      const response = await leaderboardAPI.getGlobal(limit)
      return response.data.entries
    },
    staleTime: 1000 * 60 * 2,
  })
