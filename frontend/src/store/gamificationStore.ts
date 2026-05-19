import { create } from 'zustand'
import type { Achievement, Badge, UserBadge } from '../types'

interface GamificationState {
  achievements: Achievement[]
  unlockedAchievements: Achievement[]
  badges: Badge[]
  userBadges: UserBadge[]
  showLevelUpModal: boolean
  newLevel: number
  setAchievements: (achievements: Achievement[]) => void
  setUnlockedAchievements: (achievements: Achievement[]) => void
  setBadges: (badges: Badge[]) => void
  setUserBadges: (badges: UserBadge[]) => void
  unlockAchievement: (achievement: Achievement) => void
  unlockBadge: (badge: Badge) => void
  showLevelUp: (level: number) => void
  hideLevelUp: () => void
}

const useGamificationStore = create<GamificationState>((set) => ({
  achievements: [],
  unlockedAchievements: [],
  badges: [],
  userBadges: [],
  showLevelUpModal: false,
  newLevel: 0,
  setAchievements: (achievements) => set({ achievements }),
  setUnlockedAchievements: (achievements) => set({ unlockedAchievements: achievements }),
  setBadges: (badges) => set({ badges }),
  setUserBadges: (badges) => set({ userBadges: badges }),
  unlockAchievement: (achievement) =>
    set((state) => ({
      unlockedAchievements: [...state.unlockedAchievements, achievement],
    })),
  unlockBadge: (badge) =>
    set((state) => ({
      userBadges: [
        ...state.userBadges,
        {
          id: crypto.randomUUID(),
          user_id: '',
          badge_id: badge.id,
          badge,
          obtained_at: new Date().toISOString(),
        },
      ],
    })),
  showLevelUp: (level) =>
    set({
      showLevelUpModal: true,
      newLevel: level,
    }),
  hideLevelUp: () =>
    set({
      showLevelUpModal: false,
      newLevel: 0,
    }),
}))

export default useGamificationStore
