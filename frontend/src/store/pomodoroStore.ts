import { create } from 'zustand';

interface PomodoroState {
  activeSessionId: string | null;
  timeRemaining: number;
  isRunning: boolean;
  sessionDuration: number;

  startSession: (sessionId: string, duration: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  tick: () => void;
  endSession: () => void;
}

const usePomodoroStore = create<PomodoroState>((set) => ({
  activeSessionId: null,
  timeRemaining: 25 * 60,
  isRunning: false,
  sessionDuration: 25 * 60,

  startSession: (sessionId, duration) =>
    set({
      activeSessionId: sessionId,
      timeRemaining: duration * 60,
      sessionDuration: duration * 60,
      isRunning: true,
    }),

  pauseSession: () => set({ isRunning: false }),

  resumeSession: () => set({ isRunning: true }),

  tick: () =>
    set((state) => {
      const newTime = Math.max(0, state.timeRemaining - 1);
      if (newTime === 0) {
        return { timeRemaining: newTime, isRunning: false };
      }
      return { timeRemaining: newTime };
    }),

  endSession: () =>
    set({
      activeSessionId: null,
      timeRemaining: 0,
      isRunning: false,
    }),
}));

export default usePomodoroStore;
