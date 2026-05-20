  import api from './api'
  import type { Challenge, ChallengeParticipant } from '../types'

  export async function fetchChallenges() {
    const { data } = await api.get<Challenge[]>('/challenges')
    return data
  }

  export async function fetchChallengeDetails(id: string) {
    const { data } = await api.get<Challenge>(`/challenges/${id}`)
    return data
  }

  export async function joinChallenge(id: string) {
    const { data } = await api.post<ChallengeParticipant>(`/challenges/${id}/join`)
    return data
  }

  export async function leaveChallenge(id: string) {
    await api.post(`/challenges/${id}/leave`)
  }

  export async function fetchChallengeLeaderboard(challengeId: string) {
    const { data } = await api.get<ChallengeParticipant[]>(`/challenges/${challengeId}/leaderboard`)
    return data
  }

  export async function fetchUserChallenges() {
    const { data } = await api.get<Challenge[]>('/challenges/user-challenges')
    return data
  }
