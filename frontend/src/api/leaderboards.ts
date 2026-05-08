import apiClient from './apiClient';
import type { Leaderboard, LeaderboardEntry, PaginatedResponse } from '@/types/models';

export const leaderboardAPI = {
  list: () =>
    apiClient.get<Leaderboard[]>('/leaderboards'),

  getGlobal: (limit: number = 20) =>
    apiClient.get<PaginatedResponse<LeaderboardEntry>>('/leaderboards/global', { params: { limit } }),

  getWeekly: (limit: number = 20) =>
    apiClient.get<PaginatedResponse<LeaderboardEntry>>('/leaderboards/weekly', { params: { limit } }),

  getMonthly: (limit: number = 20) =>
    apiClient.get<PaginatedResponse<LeaderboardEntry>>('/leaderboards/monthly', { params: { limit } }),

  getByMetric: (metric: string, limit: number = 20) =>
    apiClient.get<PaginatedResponse<LeaderboardEntry>>(`/leaderboards/by-metric/${metric}`, {
      params: { limit },
    }),

  getUserRank: () =>
    apiClient.get('/leaderboards/user-rank'),

  getTop10: () =>
    apiClient.get<LeaderboardEntry[]>('/leaderboards/top-10'),
};
