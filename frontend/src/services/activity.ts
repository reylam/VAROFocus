import api from './api'
import type { ActivityLogEntry } from '../types'

export async function fetchActivityFeed(userId?: string, page = 1) {
  const endpoint = userId ? `/users/${userId}/activity-feed` : '/activity-logs'
  const { data } = await api.get<{
    data: ActivityLogEntry[]
    meta: { current_page: number; last_page: number; total: number }
  }>(`${endpoint}?page=${page}`)
  return data
}

export async function fetchUserActivityFeed(userId: string, page = 1) {
  const { data } = await api.get<{
    data: ActivityLogEntry[]
    meta: { current_page: number; last_page: number; total: number }
  }>(`/users/${userId}/activity-feed?page=${page}`)
  return data
}
