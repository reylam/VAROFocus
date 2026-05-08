import apiClient from './apiClient';
import type { Achievement, Badge } from '@/types/models';

export const achievementsAPI = {
  list: () =>
    apiClient.get<Achievement[]>('/achievements'),

  getUserAchievements: () =>
    apiClient.get<Achievement[]>('/achievements/user-achievements'),

  getProgress: () =>
    apiClient.get('/achievements/progress'),

  checkAndUnlock: () =>
    apiClient.post('/achievements/check-unlock'),

  get: (id: string) =>
    apiClient.get<Achievement>(`/achievements/${id}`),
};

export const badgesAPI = {
  list: () =>
    apiClient.get<Badge[]>('/badges'),

  getByRarity: (rarity: string) =>
    apiClient.get<Badge[]>(`/badges/by-rarity/${rarity}`),

  getStats: () =>
    apiClient.get('/badges/stats'),

  getUserBadges: () =>
    apiClient.get<Badge[]>('/badges/user-badges'),

  get: (id: string) =>
    apiClient.get<Badge>(`/badges/${id}`),
};
