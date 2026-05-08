import api from './api'
import type { LeaderboardEntry, LeaderboardStats } from '../types'

export async function fetchLeaderboard(type: 'global' | 'daily' | 'weekly' | 'monthly' = 'global') {
  const { data } = await api.get<LeaderboardEntry[]>(`/leaderboards/${type}`)
  return data
}

export async function fetchLeaderboardStats() {
  const { data } = await api.get<LeaderboardStats>('/leaderboards/stats')
  return data
}

export async function fetchUserRank(userId: string) {
  const { data } = await api.get<{ rank: number; score: number }>(`/leaderboards/user-rank/${userId}`)
  return data
}
