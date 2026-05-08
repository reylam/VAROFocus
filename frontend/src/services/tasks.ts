import type { Task } from '../types'
import api from './api'

export async function fetchTasks() {
  const { data } = await api.get<Task[]>('/tasks')
  return data
}

export async function createTask(task: Partial<Task>) {
  const { data } = await api.post<Task>('/tasks', task)
  return data
}

export async function attackMonster(id: string) {
  const { data } = await api.post<Task>(`/tasks/${id}/attack-monster`)
  return data
}

export async function completeTask(id: string) {
  const { data } = await api.post<Task>(`/tasks/${id}/complete`)
  return data
}
