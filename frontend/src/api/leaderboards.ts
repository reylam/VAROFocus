import apiClient from './apiClient';
import type { Leaderboard, LeaderboardEntry } from '@/types/models';

export const leaderboardAPI = {
  list: () => apiClient.get<Leaderboard[]>('/leaderboards'),

  getGlobal: (limit: number = 20) =>
    apiClient.get<{ leaderboard: Leaderboard; entries: LeaderboardEntry[] }>('/leaderboards/global', {
      params: { limit },
    }),

  getWeekly: (limit: number = 20) =>
    apiClient.get<{ leaderboard: Leaderboard; entries: LeaderboardEntry[] }>('/leaderboards/weekly', {
      params: { limit },
    }),

  getMonthly: (limit: number = 20) =>
    apiClient.get<{ leaderboard: Leaderboard; entries: LeaderboardEntry[] }>('/leaderboards/monthly', {
      params: { limit },
    }),

  getByMetric: (metric: string, limit: number = 20) =>
    apiClient.get<{ leaderboard: Leaderboard; entries: LeaderboardEntry[] }>(`/leaderboards/by-metric/${metric}`, {
      params: { limit },
    }),

  getUserRank: () => apiClient.get<{ rank: number; leaderboard: Leaderboard }>('/leaderboards/user-rank'),

  getTop10: () => apiClient.get<LeaderboardEntry[]>('/leaderboards/top-10'),
};
