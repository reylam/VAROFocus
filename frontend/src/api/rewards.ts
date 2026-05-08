import apiClient from './apiClient';
import type { DailyReward, SpinReward } from '@/types/models';

export const rewardsAPI = {
  // Daily Rewards
  claimDaily: () =>
    apiClient.post('/daily-rewards/claim'),

  getDailyStatus: () =>
    apiClient.get<DailyReward>('/daily-rewards/status'),

  getDailyStreak: () =>
    apiClient.get('/daily-rewards/streak'),

  // Spin Rewards
  listSpinRewards: () =>
    apiClient.get<SpinReward[]>('/spin-rewards'),

  spinWheel: () =>
    apiClient.post('/spin-rewards/spin'),

  getSpinHistory: () =>
    apiClient.get('/spin-rewards/history'),

  getSpinStats: () =>
    apiClient.get('/spin-rewards/stats'),

  getRewardStats: () =>
    apiClient.get('/spin-rewards/reward-stats'),

  // User Spin Logs
  listSpinLogs: () =>
    apiClient.get('/user-spin-logs'),

  getTodaySpins: () =>
    apiClient.get('/user-spin-logs/today'),

  getWeeklySpins: () =>
    apiClient.get('/user-spin-logs/weekly'),

  getSpinDistribution: () =>
    apiClient.get('/user-spin-logs/distribution'),

  getMostRecentSpins: () =>
    apiClient.get('/user-spin-logs/recent'),

  deleteSpinLog: (id: string) =>
    apiClient.delete(`/user-spin-logs/${id}`),
};
