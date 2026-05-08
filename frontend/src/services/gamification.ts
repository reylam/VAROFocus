import api from './api'
import type { Achievement, Badge, UserBadge, XpLog } from '../types'

export async function fetchAchievements() {
  const { data } = await api.get<Achievement[]>('/achievements')
  return data
}

export async function fetchUserAchievements() {
  const { data } = await api.get<Achievement[]>('/achievements/user-achievements')
  return data
}

export async function fetchAchievementProgress() {
  const { data } = await api.get('/achievements/progress')
  return data
}

export async function checkAndUnlockAchievements() {
  const { data } = await api.post<Achievement[]>('/achievements/check-unlock')
  return data
}

export async function fetchBadges() {
  const { data } = await api.get<Badge[]>('/badges')
  return data
}

export async function fetchBadgesByRarity(rarity: string) {
  const { data } = await api.get<Badge[]>(`/badges/by-rarity/${rarity}`)
  return data
}

export async function fetchUserBadges() {
  const { data } = await api.get<UserBadge[]>('/badges/user-badges')
  return data
}

export async function fetchXpLogs() {
  const { data } = await api.get<XpLog[]>('/xp-logs')
  return data
}

export async function fetchTodayXp() {
  const { data } = await api.get<XpLog[]>('/xp-logs/today')
  return data
}

export async function fetchWeeklyXp() {
  const { data } = await api.get<XpLog[]>('/xp-logs/weekly')
  return data
}

export async function claimDailyReward() {
  const { data } = await api.post('/daily-rewards/claim')
  return data
}

export async function getDailyRewardStatus() {
  const { data } = await api.get('/daily-rewards/status')
  return data
}

export async function spinWheel() {
  const { data } = await api.post('/spin-rewards/spin')
  return data
}

export async function fetchSpinHistory() {
  const { data } = await api.get('/spin-rewards/history')
  return data
}
