import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: {
    username: string;
    level: number;
    xp: number;
    maxXp: number;
    streak: number;
    avatar: string;
  } | null;
  addXp: (amount: number) => void;
  setUser: (user: AppState['user']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  user: {
    username: 'HeroPlayer1',
    level: 5,
    xp: 450,
    maxXp: 1000,
    streak: 12,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HeroPlayer1'
  },
  addXp: (amount) => set((state) => {
    if (!state.user) return state;
    let newXp = state.user.xp + amount;
    let newLevel = state.user.level;
    let newMaxXp = state.user.maxXp;

    if (newXp >= newMaxXp) {
      newLevel += 1;
      newXp = newXp - newMaxXp;
      newMaxXp = Math.floor(newMaxXp * 1.5);
      // Trigger level up effect later
    }

    return {
      user: {
        ...state.user,
        xp: newXp,
        level: newLevel,
        maxXp: newMaxXp,
      }
    };
  }),
  setUser: (user) => set({ user }),
}));
