import type { CreatePomodoroSessionPayload, PaginatedResponse, PomodoroSession } from '@/types/models'

// Mock storage for local development
const getSessions = (): PomodoroSession[] => JSON.parse(localStorage.getItem('mock_pomodoro_sessions') || '[]');
const saveSessions = (sessions: PomodoroSession[]) => localStorage.setItem('mock_pomodoro_sessions', JSON.stringify(sessions));

export const pomodoroAPI = {
  list: async () => {
    const sessions = getSessions();
    return { data: { data: sessions, meta: { total: sessions.length } } as unknown as PaginatedResponse<PomodoroSession> };
  },
  create: async (payload: CreatePomodoroSessionPayload) => {
    const sessions = getSessions();
    const session: PomodoroSession = {
      id: Math.random().toString(36).substring(7),
      user_id: '1',
      task_id: payload.task_id || null,
      duration_minutes: payload.duration_minutes || 25,
      break_minutes: payload.break_minutes || 5,
      status: 'running',
      started_at: new Date().toISOString(),
      ended_at: null,
      completed_pomodoros: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    sessions.push(session);
    saveSessions(sessions);
    return { data: { message: 'Session created', session } };
  },
  complete: async (id: string) => {
    const sessions = getSessions();
    const session = sessions.find(s => s.id === id);
    let xpEarned = 25;
    if (session) {
      session.status = 'completed';
      session.ended_at = new Date().toISOString();
      session.completed_pomodoros += 1;
      saveSessions(sessions);

      // 1. Award XP to the mock user
      const userStr = localStorage.getItem('mock_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          user.xp += xpEarned;
          if (user.xp >= (user.next_level_xp || 400)) {
            user.xp -= (user.next_level_xp || 400);
            user.level += 1;
            user.next_level_xp = user.level * 150 + 250;
          }
          localStorage.setItem('mock_user', JSON.stringify(user));
        } catch (e) {}
      }

      // 2. Deal damage to the associated task monster
      if (session.task_id) {
        const tasksStr = localStorage.getItem('mock_tasks');
        if (tasksStr) {
          try {
            const tasks = JSON.parse(tasksStr);
            const task = tasks.find((t: any) => t.id === session.task_id);
            if (task) {
              task.current_hp = Math.max(0, task.current_hp - 25);
              if (task.monster && !Array.isArray(task.monster)) {
                task.monster.current_hp = task.current_hp;
              }
              if (task.current_hp === 0) {
                task.status = 'completed';
                task.completed_at = new Date().toISOString();
              }
              localStorage.setItem('mock_tasks', JSON.stringify(tasks));
            }
          } catch (e) {}
        }
      }
    }
    return { data: { message: 'Session completed', session: session!, xp_earned: xpEarned } };
  },
  cancel: async (id: string) => {
    const sessions = getSessions();
    const session = sessions.find(s => s.id === id);
    if (session) {
      session.status = 'cancelled';
      session.ended_at = new Date().toISOString();
      saveSessions(sessions);
    }
    return { data: { message: 'Session cancelled', session: session! } };
  },
  todayStats: async () => {
    const sessions = getSessions();
    const todayStr = new Date().toISOString().split('T')[0];
    const completedToday = sessions.filter(
      s => s.status === 'completed' && s.ended_at && s.ended_at.startsWith(todayStr)
    );
    const totalMinutes = completedToday.reduce((acc, curr) => acc + curr.duration_minutes, 0);
    return {
      data: {
        total_minutes: totalMinutes,
        sessions_completed: completedToday.length,
        completed_sessions: completedToday.length,
        xp_earned: completedToday.length * 25
      }
    };
  },
  weeklyStats: async () => ({ data: {} }),
  streak: async () => {
    const userStr = localStorage.getItem('mock_user');
    let currentStreak = 1;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        currentStreak = user.streak || user.streak_count || 1;
      } catch (e) {}
    }
    return { data: { current_streak: currentStreak, max_streak: 10 } };
  },
}

export const startPomodoroSession = async (payload: CreatePomodoroSessionPayload) => (await pomodoroAPI.create(payload)).data.session
export const completePomodoroSession = async (id: string) => (await pomodoroAPI.complete(id)).data
export const cancelPomodoroSession = async (id: string) => (await pomodoroAPI.cancel(id)).data
export const getTodayStats = async () => (await pomodoroAPI.todayStats()).data

export default pomodoroAPI
