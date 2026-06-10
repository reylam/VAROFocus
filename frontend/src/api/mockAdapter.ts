import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { 
  User, Task, StudyRoom, Challenge, Achievement, Badge, 
  PomodoroSession, DailyReward, SpinReward, Friend, FriendRequest,
  TaskComment, TaskCheer
} from '@/types/models';

// --- INITIAL MOCK DATA ---
const DEFAULT_USER: User = {
  id: 'user_1',
  username: 'VaroFocusHero',
  email: 'hero@varofocus.com',
  avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=VaroFocusHero',
  level: 3,
  xp: 150,
  next_level_xp: 400,
  streak: 5,
  streak_count: 5,
  title: 'Focused Novice',
  settings: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_active_at: new Date().toISOString()
};

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task_1',
    user_id: 'user_1',
    category_id: 'cat_1',
    title: 'Learn React Query',
    description: 'Implement cache queries and mutations in study room features.',
    difficulty: 'medium',
    hp: 100,
    current_hp: 75,
    xp_reward: 50,
    estimated_minutes: 50,
    due_date: new Date(Date.now() + 86400000).toISOString(),
    priority: 2,
    status: 'in_progress',
    is_public: true,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    monster: {
      id: 'monster_1',
      task_id: 'task_1',
      type: 'goblin',
      max_hp: 100,
      current_hp: 75,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'task_2',
    user_id: 'user_1',
    category_id: 'cat_2',
    title: 'Deploy Frontend to Vercel',
    description: 'Build production bundle and deploy.',
    difficulty: 'easy',
    hp: 50,
    current_hp: 50,
    xp_reward: 20,
    estimated_minutes: 25,
    due_date: new Date().toISOString(),
    priority: 1,
    status: 'pending',
    is_public: false,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    monster: {
      id: 'monster_2',
      task_id: 'task_2',
      type: 'slime',
      max_hp: 50,
      current_hp: 50,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'task_3',
    user_id: 'user_1',
    category_id: 'cat_3',
    title: 'Defeat the Final Boss Project',
    description: 'Complete the entire HCI final project documentation and presentation.',
    difficulty: 'boss',
    hp: 500,
    current_hp: 500,
    xp_reward: 300,
    estimated_minutes: 180,
    due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    priority: 3,
    status: 'pending',
    is_public: true,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    monster: {
      id: 'monster_3',
      task_id: 'task_3',
      type: 'dragon',
      max_hp: 500,
      current_hp: 500,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
];

const DEFAULT_ROOMS: StudyRoom[] = [
  {
    id: 'room_1',
    name: 'Dragon Slayers Focus',
    owner_id: 'user_2',
    description: 'A place for quiet focus and heavy grinds. Strictly pomodoro!',
    is_private: false,
    max_members: 10,
    members_count: 5,
    active_session: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: {
      id: 'user_2',
      username: 'DragonSlayer99',
      email: 'slayer@varofocus.com',
      avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=DragonSlayer99',
      level: 15,
      xp: 200,
      streak_count: 22,
      title: 'Veteran Hunter',
      settings: {},
      created_at: '',
      updated_at: '',
      last_active_at: ''
    },
    members: [
      {
        user_id: 'user_2',
        role: 'owner',
        joined_at: new Date().toISOString(),
        user: {
          id: 'user_2',
          username: 'DragonSlayer99',
          email: 'slayer@varofocus.com',
          avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=DragonSlayer99',
          level: 15,
          xp: 200,
          streak_count: 22,
          title: 'Veteran Hunter',
          settings: {},
          created_at: '',
          updated_at: '',
          last_active_at: ''
        }
      },
      {
        user_id: 'user_1',
        role: 'member',
        joined_at: new Date().toISOString(),
        user: DEFAULT_USER
      }
    ],
    monster: {
      id: 'monster_room_1',
      task_id: '',
      type: 'dragon',
      max_hp: 500,
      current_hp: 350,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'room_2',
    name: 'Chill Study & Lo-Fi',
    owner_id: 'user_3',
    description: 'Low pressure study room. Open for everyone.',
    is_private: false,
    max_members: 5,
    members_count: 2,
    active_session: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: {
      id: 'user_3',
      username: 'LofiCoder',
      email: 'lofi@varofocus.com',
      avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=LofiCoder',
      level: 5,
      xp: 120,
      streak_count: 3,
      title: 'Slime Tamer',
      settings: {},
      created_at: '',
      updated_at: '',
      last_active_at: ''
    },
    monster: {
      id: 'monster_room_2',
      task_id: '',
      type: 'slime',
      max_hp: 100,
      current_hp: 80,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
];

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'challenge_1',
    creator_id: 'admin',
    title: 'Weekly Dragon Slayer',
    description: 'Defeat at least 3 boss/hard difficulty monsters this week.',
    challenge_type: 'boss_kills',
    target_value: 3,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 86400000 * 7).toISOString(),
    reward_xp: 250,
    reward_badge_id: 'badge_epic_1',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'challenge_2',
    creator_id: 'admin',
    title: '100 Minutes Focus Streak',
    description: 'Perform Pomodoro sessions totaling 100 minutes.',
    challenge_type: 'pomodoro_time',
    target_value: 100,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    reward_xp: 150,
    reward_badge_id: 'badge_rare_1',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1',
    name: 'First Blood',
    description: 'Defeat your first monster.',
    icon: '⚔️',
    condition_type: 'task_count',
    condition_value: 1,
    xp_reward: 50,
    badge_id: 'badge_common_1',
    unlocked_at: new Date().toISOString()
  },
  {
    id: 'ach_2',
    name: 'Centurion',
    description: 'Accumulate 100 minutes of focus sessions.',
    icon: '⏳',
    condition_type: 'pomodoro_count',
    condition_value: 4,
    xp_reward: 100,
    badge_id: 'badge_rare_1'
  }
];

const DEFAULT_BADGES: Badge[] = [
  {
    id: 'badge_common_1',
    name: 'Slayer Initiate',
    description: 'Awarded for defeating your first monster.',
    icon: '🛡️',
    rarity: 'common'
  },
  {
    id: 'badge_rare_1',
    name: 'Time Bender',
    description: 'Awarded for completing 4 Pomodoro sessions.',
    icon: '🔮',
    rarity: 'rare'
  },
  {
    id: 'badge_epic_1',
    name: 'Dragon Bane',
    description: 'Completed the Weekly Dragon Slayer challenge.',
    icon: '🐉',
    rarity: 'epic'
  }
];

const DEFAULT_FRIENDS: Friend[] = [
  {
    id: 'fr_1',
    user_id: 'user_1',
    friend_id: 'user_2',
    status: 'accepted',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    friend: {
      id: 'user_2',
      username: 'DragonSlayer99',
      email: 'slayer@varofocus.com',
      avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=DragonSlayer99',
      level: 15,
      xp: 200,
      streak_count: 22,
      title: 'Veteran Hunter',
      settings: {},
      created_at: '',
      updated_at: '',
      last_active_at: ''
    }
  },
  {
    id: 'fr_2',
    user_id: 'user_1',
    friend_id: 'user_3',
    status: 'accepted',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    friend: {
      id: 'user_3',
      username: 'LofiCoder',
      email: 'lofi@varofocus.com',
      avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=LofiCoder',
      level: 5,
      xp: 120,
      streak_count: 3,
      title: 'Slime Tamer',
      settings: {},
      created_at: '',
      updated_at: '',
      last_active_at: ''
    }
  }
];

const DEFAULT_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'req_1',
    sender_id: 'user_4',
    receiver_id: 'user_1',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sender: {
      id: 'user_4',
      username: 'ShadowNinja',
      email: 'ninja@varofocus.com',
      avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ShadowNinja',
      level: 8,
      xp: 220,
      streak_count: 7,
      title: 'Silent Shadow',
      settings: {},
      created_at: '',
      updated_at: '',
      last_active_at: ''
    }
  },
  {
    id: 'req_2',
    sender_id: 'user_5',
    receiver_id: 'user_1',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sender: {
      id: 'user_5',
      username: 'CodeWizard',
      email: 'wizard@varofocus.com',
      avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CodeWizard',
      level: 12,
      xp: 450,
      streak_count: 14,
      title: 'Grand Magus',
      settings: {},
      created_at: '',
      updated_at: '',
      last_active_at: ''
    }
  }
];

const DEFAULT_RECOMMENDED_USERS: User[] = [
  {
    id: 'user_6',
    username: 'PixelWarrior',
    email: 'pixel@varofocus.com',
    avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelWarrior',
    level: 4,
    xp: 90,
    streak_count: 2,
    title: 'Pixel Knight',
    settings: {},
    created_at: '',
    updated_at: '',
    last_active_at: ''
  },
  {
    id: 'user_7',
    username: 'TaskMaster',
    email: 'taskmaster@varofocus.com',
    avatar_url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=TaskMaster',
    level: 10,
    xp: 150,
    streak_count: 8,
    title: 'Efficiency Expert',
    settings: {},
    created_at: '',
    updated_at: '',
    last_active_at: ''
  }
];

const DEFAULT_SPIN_REWARDS: SpinReward[] = [
  { id: 'spin_1', name: 'Small XP Potion', description: 'Gain 20 XP instantly', type: 'xp_boost', value: { xp: 20 }, probability: 0.4, is_active: true },
  { id: 'spin_2', name: 'Medium XP Elixir', description: 'Gain 50 XP instantly', type: 'xp_boost', value: { xp: 50 }, probability: 0.25, is_active: true },
  { id: 'spin_3', name: 'Focused Mage Title', description: 'Unlock a cool title', type: 'badge', value: { title: 'Focused Mage' }, probability: 0.1, is_active: true },
  { id: 'spin_4', name: 'Dark Mode Theme', description: 'Unlock Premium Theme', type: 'theme', value: { theme: 'dark' }, probability: 0.15, is_active: true }
];

const DEFAULT_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_1',
    user_id: 'user_1',
    type: 'task_completed',
    message: 'Completed task "Learn React Query" and defeated the Goblin! 👺',
    metadata: { task_id: 'task_1', xp_earned: 50 },
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'act_2',
    user_id: 'user_1',
    type: 'streak_increment',
    message: 'Maintained a 5-day focus streak! 🔥',
    metadata: { streak: 5 },
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'act_3',
    user_id: 'user_1',
    type: 'room_joined',
    message: 'Joined study room "Dragon Slayers Focus" 🐉',
    metadata: { room_id: 'room_1' },
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'act_4',
    user_id: 'user_1',
    type: 'spin_reward',
    message: 'Won "Small XP Potion" (+20 XP) in the Spin reward! 🔮',
    metadata: { reward: 'Small XP Potion' },
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// --- LOCAL STORAGE HELPERS ---
function getItem<T>(key: string, defaultVal: T): T {
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(val);
  } catch {
    return defaultVal;
  }
}

function setItem<T>(key: string, val: T): void {
  localStorage.setItem(key, JSON.stringify(val));
}

// --- CONTROLLERS ---
export const mockAdapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  const method = (config.method || 'get').toLowerCase();
  const url = config.url || '';
  const path = url.replace(/.*\/api/, ''); // Get relative path from /api

  // Helper to extract JSON body
  let body: any = {};
  if (config.data) {
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      body = {};
    }
  }

  // Helper to simulate a paginated response
  const paginated = <T>(items: T[]) => ({
    data: items,
    links: { first: '', last: '', prev: null, next: null },
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      per_page: 100,
      to: items.length,
      total: items.length
    }
  });

  // Helper for success response
  const success = (data: any, status = 200): AxiosResponse => ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config,
    request: {}
  });

  // Helper for error response
  const error = (message: string, status = 400): Promise<AxiosResponse> => {
    return Promise.reject({
      response: {
        data: { message },
        status,
        statusText: 'Bad Request',
        headers: {},
        config
      }
    });
  };

  // --- GET DATA STORES ---
  const user = getItem<User>('mock_user', DEFAULT_USER);
  const tasks = getItem<Task[]>('mock_tasks', DEFAULT_TASKS);
  const rooms = getItem<StudyRoom[]>('mock_study_rooms', DEFAULT_ROOMS);
  const challenges = getItem<Challenge[]>('mock_challenges', DEFAULT_CHALLENGES);
  const achievements = getItem<Achievement[]>('mock_achievements', DEFAULT_ACHIEVEMENTS);
  const badges = getItem<Badge[]>('mock_badges', DEFAULT_BADGES);
  const friends = getItem<Friend[]>('mock_friends', DEFAULT_FRIENDS);
  const friendRequests = getItem<FriendRequest[]>('mock_friend_requests', DEFAULT_FRIEND_REQUESTS);
  const recommendedUsers = getItem<User[]>('mock_recommended_users', DEFAULT_RECOMMENDED_USERS);
  const spinRewards = getItem<SpinReward[]>('mock_spin_rewards', DEFAULT_SPIN_REWARDS);
  const pomodoroSessions = getItem<PomodoroSession[]>('mock_pomodoro_sessions', []);
  const activityLogs = getItem<ActivityLog[]>('mock_activity_logs', DEFAULT_ACTIVITY_LOGS);

  const logActivity = (type: string, message: string, metadata: any = {}) => {
    const newLog: ActivityLog = {
      id: 'act_' + Math.random().toString(36).substring(7),
      user_id: user.id,
      type,
      message,
      metadata,
      created_at: new Date().toISOString()
    };
    activityLogs.unshift(newLog);
    setItem('mock_activity_logs', activityLogs);
  };
  const dailyReward = getItem<DailyReward>('mock_daily_reward', {
    id: 'dr_1',
    user_id: user.id,
    last_claimed_at: null,
    streak: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // --- ROUTING ---

  // AUTH ENDPOINTS
  if (path.startsWith('/auth/login')) {
    setItem('auth_token', 'mock_jwt_token_hero');
    return success({ token: 'mock_jwt_token_hero', user });
  }
  if (path.startsWith('/auth/register')) {
    setItem('auth_token', 'mock_jwt_token_hero');
    const newUser = { ...user, username: body.username || 'new_user', email: body.email || 'new@varofocus.com' };
    setItem('mock_user', newUser);
    return success({ token: 'mock_jwt_token_hero', user: newUser });
  }
  if (path.startsWith('/auth/logout')) {
    localStorage.removeItem('auth_token');
    return success({ message: 'Logged out successfully' });
  }
  if (path.startsWith('/auth/me')) {
    return success({
      user,
      progress_to_next_level: {
        current_xp: user.xp,
        required_xp: user.next_level_xp || 400,
        percentage: Math.min(100, Math.floor((user.xp / (user.next_level_xp || 400)) * 100))
      }
    });
  }
  if (path.startsWith('/auth/refresh-token')) {
    return success({ token: 'mock_jwt_token_hero', message: 'Token refreshed' });
  }

  // TASK ENDPOINTS
  if (path === '/tasks') {
    if (method === 'get') {
      return success(paginated(tasks));
    }
    if (method === 'post') {
      const id = 'task_' + Math.random().toString(36).substring(7);
      const diffHp = body.difficulty === 'boss' ? 500 : body.difficulty === 'hard' ? 200 : body.difficulty === 'medium' ? 100 : 50;
      const xpReward = body.difficulty === 'boss' ? 300 : body.difficulty === 'hard' ? 150 : body.difficulty === 'medium' ? 50 : 20;
      
      const newTask: Task = {
        id,
        user_id: user.id,
        category_id: body.category_id || null,
        title: body.title || 'Untitled Task',
        description: body.description || null,
        difficulty: body.difficulty || 'easy',
        hp: diffHp,
        current_hp: diffHp,
        xp_reward: xpReward,
        estimated_minutes: body.estimated_minutes || 25,
        due_date: body.due_date || null,
        priority: body.priority || 1,
        status: 'pending',
        is_public: !!body.is_public,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        monster: {
          id: 'monster_' + id,
          task_id: id,
          type: body.difficulty === 'boss' ? 'dragon' : body.difficulty === 'hard' ? 'orc' : body.difficulty === 'medium' ? 'goblin' : 'slime',
          max_hp: diffHp,
          current_hp: diffHp,
          image_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
      
      tasks.push(newTask);
      setItem('mock_tasks', tasks);
      logActivity('task_created', `Summoned a new monster: "${newTask.title}" (${newTask.difficulty}) ⚔️`, { task_id: id });
      return success({ message: 'Task created', task: newTask });
    }
  }

  if (path === '/tasks/overdue') {
    return success(tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'));
  }
  if (path.startsWith('/tasks/due-soon')) {
    return success(tasks.filter(t => t.status !== 'completed'));
  }
  if (path.startsWith('/tasks/public')) {
    return success(paginated(tasks.filter(t => t.is_public)));
  }

  // TASK SPECIFIC DETAILS & ACTIONS
  const taskMatch = path.match(/^\/tasks\/([^/]+)$/);
  if (taskMatch) {
    const id = taskMatch[1];
    const task = tasks.find(t => t.id === id);
    if (!task) return error('Task not found', 404);

    if (method === 'get') {
      return success({ task, stats: {} });
    }
    if (method === 'put') {
      Object.assign(task, body);
      task.updated_at = new Date().toISOString();
      setItem('mock_tasks', tasks);
      return success({ message: 'Task updated', task });
    }
    if (method === 'delete') {
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) tasks.splice(idx, 1);
      setItem('mock_tasks', tasks);
      return success({ message: 'Task deleted' });
    }
  }

  // Task state triggers
  const taskActionMatch = path.match(/^\/tasks\/([^/]+)\/(start|complete|fail|attack-monster)$/);
  if (taskActionMatch) {
    const id = taskActionMatch[1];
    const action = taskActionMatch[2];
    const task = tasks.find(t => t.id === id);
    if (!task) return error('Task not found', 404);

    if (action === 'start') {
      task.status = 'in_progress';
      setItem('mock_tasks', tasks);
      return success({ message: 'Task started', task });
    }
    if (action === 'complete') {
      task.status = 'completed';
      task.completed_at = new Date().toISOString();
      if (task.monster && !Array.isArray(task.monster)) {
        task.monster.current_hp = 0;
      }
      task.current_hp = 0;
      
      // Award XP
      user.xp += task.xp_reward;
      if (user.xp >= (user.next_level_xp || 400)) {
        user.xp -= (user.next_level_xp || 400);
        user.level += 1;
        user.next_level_xp = user.level * 150 + 250;
      }
      setItem('mock_user', user);
      setItem('mock_tasks', tasks);
      logActivity('task_completed', `Completed task "${task.title}" and defeated the monster! 🏆`, { task_id: id, xp_earned: task.xp_reward });
      return success({ message: 'Task completed!', task, xp_earned: task.xp_reward });
    }
    if (action === 'fail') {
      task.status = 'failed';
      setItem('mock_tasks', tasks);
      return success({ message: 'Task marked failed', task });
    }
    if (action === 'attack-monster') {
      const damage = body.damage || 25;
      let hp = task.current_hp;
      hp = Math.max(0, hp - damage);
      task.current_hp = hp;
      
      let monster = task.monster;
      if (monster && !Array.isArray(monster)) {
        monster.current_hp = hp;
      }
      
      let isDead = hp === 0;
      let completed = false;
      let xpEarned = 0;
      if (isDead) {
        task.status = 'completed';
        task.completed_at = new Date().toISOString();
        completed = true;
        xpEarned = task.xp_reward;
        
        user.xp += xpEarned;
        if (user.xp >= (user.next_level_xp || 400)) {
          user.xp -= (user.next_level_xp || 400);
          user.level += 1;
          user.next_level_xp = user.level * 150 + 250;
        }
        setItem('mock_user', user);
        logActivity('task_completed', `Defeated the monster in "${task.title}"! 🏆`, { task_id: id, xp_earned: xpEarned });
      } else {
        logActivity('monster_attacked', `Attacked "${task.title}" dealing ${damage} damage! ⚔️`, { task_id: id, damage });
      }
      
      setItem('mock_tasks', tasks);
      return success({
        message: isDead ? 'Monster defeated!' : `Dealt ${damage} damage!`,
        monster_hp: hp,
        monster_hp_percentage: Math.floor((hp / task.hp) * 100),
        is_dead: isDead,
        task_completed: completed,
        xp_earned: xpEarned
      });
    }
  }

  // CHEERS & COMMENTS
  const cheersMatch = path.match(/^\/tasks\/([^/]+)\/cheers\/has-cheered$/);
  if (cheersMatch) {
    return success({ has_cheer: false });
  }
  const cheersAddMatch = path.match(/^\/tasks\/([^/]+)\/cheers$/);
  if (cheersAddMatch) {
    return success({ message: 'Cheered successfully' });
  }
  const commentsMatch = path.match(/^\/tasks\/([^/]+)\/comments$/);
  if (commentsMatch) {
    return success(paginated([]));
  }

  // POMODORO ENDPOINTS
  if (path === '/pomodoro-sessions' || path === '/pomodoros') {
    if (method === 'get') {
      return success(paginated(pomodoroSessions));
    }
    if (method === 'post') {
      const newSession: PomodoroSession = {
        id: 'pomo_' + Math.random().toString(36).substring(7),
        user_id: user.id,
        task_id: body.task_id || null,
        duration_minutes: body.duration_minutes || 25,
        break_minutes: body.break_minutes || 5,
        status: 'running',
        started_at: new Date().toISOString(),
        ended_at: null,
        completed_pomodoros: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      pomodoroSessions.push(newSession);
      setItem('mock_pomodoro_sessions', pomodoroSessions);
      logActivity('pomodoro_started', 'Started a new focus session! ⏱️');
      return success({ message: 'Session created', session: newSession });
    }
  }

  const pomoActionMatch = path.match(/^\/(pomodoro-sessions|pomodoros)\/([^/]+)\/(complete|cancel)$/);
  if (pomoActionMatch) {
    const id = pomoActionMatch[2];
    const action = pomoActionMatch[3];
    const session = pomodoroSessions.find(p => p.id === id);
    if (!session) return error('Session not found', 404);

    if (action === 'complete') {
      session.status = 'completed';
      session.ended_at = new Date().toISOString();
      session.completed_pomodoros += 1;
      
      // Complete associated task monster damage
      if (session.task_id) {
        const task = tasks.find(t => t.id === session.task_id);
        if (task) {
          task.current_hp = Math.max(0, task.current_hp - 25);
          if (task.monster && !Array.isArray(task.monster)) {
            task.monster.current_hp = task.current_hp;
          }
          if (task.current_hp === 0) {
            task.status = 'completed';
            task.completed_at = new Date().toISOString();
            logActivity('task_completed', `Defeated the monster in "${task.title}"! 🏆`, { task_id: task.id, xp_earned: task.xp_reward });
          }
          setItem('mock_tasks', tasks);
        }
      }

      user.xp += 25;
      if (user.xp >= (user.next_level_xp || 400)) {
        user.xp -= (user.next_level_xp || 400);
        user.level += 1;
        user.next_level_xp = user.level * 150 + 250;
      }
      setItem('mock_user', user);
      setItem('mock_pomodoro_sessions', pomodoroSessions);
      logActivity('pomodoro_completed', 'Successfully completed a 25-minute focus session! ⏱️', { xp_earned: 25 });
      return success({ message: 'Session completed', session, xp_earned: 25 });
    }
    if (action === 'cancel') {
      session.status = 'cancelled';
      session.ended_at = new Date().toISOString();
      setItem('mock_pomodoro_sessions', pomodoroSessions);
      logActivity('pomodoro_cancelled', 'Cancelled a focus session.');
      return success({ message: 'Session cancelled', session });
    }
  }

  if (path.startsWith('/pomodoro-sessions/today') || path.startsWith('/pomodoros/today')) {
    const completedToday = pomodoroSessions.filter(p => p.status === 'completed');
    const totalMinutes = completedToday.reduce((acc, curr) => acc + curr.duration_minutes, 0);
    return success({
      total_minutes: totalMinutes,
      sessions_completed: completedToday.length,
      xp_earned: completedToday.length * 25
    });
  }
  if (path.includes('/streak')) {
    return success({ current_streak: user.streak, max_streak: 10 });
  }

  // STUDY ROOMS
  if (path === '/study-rooms') {
    if (method === 'get') return success(paginated(rooms));
    if (method === 'post') {
      const id = 'room_' + Math.random().toString(36).substring(7);
      const newRoom: StudyRoom = {
        id,
        name: body.name || 'Anonymous Room',
        owner_id: user.id,
        description: body.description || null,
        is_private: !!body.is_private,
        max_members: body.max_members || 5,
        members_count: 1,
        active_session: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner: user,
        members: [{ user_id: user.id, role: 'owner', joined_at: new Date().toISOString(), user }],
        monster: {
          id: 'monster_room_' + id,
          task_id: '',
          type: ['slime', 'goblin', 'orc', 'dragon'][Math.floor(Math.random() * 4)] as any,
          max_hp: 200,
          current_hp: 200,
          image_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
      rooms.push(newRoom);
      setItem('mock_study_rooms', rooms);
      logActivity('room_created', `Created a new study room: "${newRoom.name}" 🏛️`, { room_id: id });
      return success({ message: 'Study room created', room: newRoom });
    }
  }

  if (path === '/study-rooms/recommended') {
    return success(rooms);
  }
  if (path === '/study-rooms/my-rooms') {
    return success(rooms.filter(r => r.owner_id === user.id || r.members?.some(m => m.user_id === user.id)));
  }

  const roomMatch = path.match(/^\/study-rooms\/([^/]+)$/);
  if (roomMatch) {
    const id = roomMatch[1];
    const room = rooms.find(r => r.id === id);
    if (!room) return error('Study room not found', 404);

    if (method === 'get') return success({ room });
    if (method === 'put') {
      Object.assign(room, body);
      setItem('mock_study_rooms', rooms);
      return success(room);
    }
    if (method === 'delete') {
      const idx = rooms.findIndex(r => r.id === id);
      if (idx !== -1) rooms.splice(idx, 1);
      setItem('mock_study_rooms', rooms);
      return success({ message: 'Room deleted' });
    }
  }

  const roomActionMatch = path.match(/^\/study-rooms\/([^/]+)\/(join|leave|start-session|end-session|update-status)$/);
  if (roomActionMatch) {
    const id = roomActionMatch[1];
    const action = roomActionMatch[2];
    const room = rooms.find(r => r.id === id);
    if (!room) return error('Room not found', 404);

    if (action === 'join') {
      if (!room.members) room.members = [];
      if (!room.members.some(m => m.user_id === user.id)) {
        room.members.push({ user_id: user.id, role: 'member', joined_at: new Date().toISOString(), user });
        room.members_count = room.members.length;
      }
      setItem('mock_study_rooms', rooms);
      return success({ message: 'Joined room', room });
    }
    if (action === 'leave') {
      if (room.members) {
        room.members = room.members.filter(m => m.user_id !== user.id);
        room.members_count = room.members.length;
      }
      setItem('mock_study_rooms', rooms);
      return success({ message: 'Left room' });
    }
    if (action === 'start-session') {
      room.active_session = true;
      setItem('mock_study_rooms', rooms);
      return success({ id: 'sess_' + id, room_id: id, started_at: new Date().toISOString(), ended_at: null });
    }
    if (action === 'end-session') {
      room.active_session = false;
      setItem('mock_study_rooms', rooms);
      return success({ message: 'Session ended' });
    }
    if (action === 'update-status') {
      return success({ message: 'Status updated' });
    }
  }

  // CHALLENGES
  if (path === '/challenges') {
    if (method === 'get') return success(paginated(challenges));
    if (method === 'post') {
      const id = 'challenge_' + Math.random().toString(36).substring(7);
      const newChallenge: Challenge = {
        id,
        creator_id: user.id,
        title: body.title || 'New Challenge',
        description: body.description || null,
        challenge_type: body.challenge_type || 'tasks',
        target_value: body.target_value || 5,
        start_date: body.start_date || new Date().toISOString(),
        end_date: body.end_date || new Date(Date.now() + 86400000 * 7).toISOString(),
        reward_xp: body.reward_xp || 100,
        reward_badge_id: body.reward_badge_id || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        creator: user
      };
      challenges.push(newChallenge);
      setItem('mock_challenges', challenges);
      return success({ message: 'Challenge created', challenge: newChallenge });
    }
  }
  if (path === '/challenges/active') {
    return success(paginated(challenges.filter(c => c.is_active)));
  }
  if (path === '/challenges/my-challenges') {
    return success(paginated(challenges));
  }
  const challengeMatch = path.match(/^\/challenges\/([^/]+)$/);
  if (challengeMatch) {
    const id = challengeMatch[1];
    const challenge = challenges.find(c => c.id === id);
    if (!challenge) return error('Challenge not found', 404);
    if (method === 'get') {
      return success({ challenge, participant_count: 5, completed_count: 2 });
    }
  }
  const challengeActionMatch = path.match(/^\/challenges\/([^/]+)\/(join|leave)$/);
  if (challengeActionMatch) {
    return success({ message: 'Challenge action successful' });
  }

  // ACHIEVEMENTS & BADGES
  if (path === '/achievements') {
    return success(achievements);
  }
  if (path === '/achievements/user-achievements') {
    return success(achievements.filter(a => a.unlocked_at));
  }
  if (path === '/achievements/progress') {
    return success({ unlocked_count: 1, total_count: achievements.length });
  }
  if (path === '/badges') {
    return success(badges);
  }
  if (path === '/badges/user-badges') {
    return success(badges.slice(0, 2).map(b => ({ id: 'ub_' + b.id, badge_id: b.id, obtained_at: new Date().toISOString(), badge: b })));
  }

  // LEADERBOARDS
  if (path === '/leaderboards') {
    return success([
      { id: 'leader_1', type: 'global', category: null, season_start: '', season_end: '', is_active: true, created_at: '' }
    ]);
  }
  if (path.includes('/leaderboards/global') || path.includes('/leaderboards/weekly') || path.includes('/leaderboards/monthly')) {
    const entries = [
      { id: 'le_1', leaderboard_id: 'leader_1', user_id: 'user_2', score: 1200, rank: 1, updated_at: '', user: DEFAULT_ROOMS[0].owner },
      { id: 'le_2', leaderboard_id: 'leader_1', user_id: 'user_1', score: user.xp + (user.level * 500), rank: 2, updated_at: '', user },
      { id: 'le_3', leaderboard_id: 'leader_1', user_id: 'user_3', score: 320, rank: 3, updated_at: '', user: DEFAULT_ROOMS[1].owner }
    ];
    return success({
      leaderboard: { id: 'leader_1', type: 'global', category: null, season_start: '', season_end: '', is_active: true, created_at: '' },
      entries: entries.sort((a, b) => b.score - a.score).map((e, index) => ({ ...e, rank: index + 1 }))
    });
  }
  if (path === '/leaderboards/user-rank') {
    return success({
      rank: 2,
      leaderboard: { id: 'leader_1', type: 'global', category: null, season_start: '', season_end: '', is_active: true, created_at: '' }
    });
  }
  if (path === '/leaderboards/top-10') {
    return success([
      { id: 'le_1', leaderboard_id: 'leader_1', user_id: 'user_2', score: 1200, rank: 1, updated_at: '', user: DEFAULT_ROOMS[0].owner },
      { id: 'le_2', leaderboard_id: 'leader_1', user_id: 'user_1', score: user.xp + (user.level * 500), rank: 2, updated_at: '', user }
    ]);
  }

  // SOCIAL / FRIENDS
  if (path === '/friends') {
    if (method === 'get') {
      return success(friends);
    }
  }
  const deleteFriendMatch = path.match(/^\/friends\/([^/]+)$/);
  if (deleteFriendMatch && method === 'delete') {
    const friendId = deleteFriendMatch[1];
    const updated = friends.filter(f => f.id !== friendId && f.friend_id !== friendId);
    setItem('mock_friends', updated);
    return success({ message: 'Friend removed' });
  }

  if (path === '/friend-requests') {
    if (method === 'get') {
      return success(friendRequests);
    }
    if (method === 'post') {
      const { user_id } = body;
      const targetUser = recommendedUsers.find(u => u.id === user_id);
      if (targetUser) {
        const newReq: FriendRequest = {
          id: 'req_' + Math.random().toString(36).substring(7),
          sender_id: 'user_1',
          receiver_id: user_id,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          receiver: targetUser
        };
        friendRequests.push(newReq);
        setItem('mock_friend_requests', friendRequests);
        return success({ message: 'Friend request sent', request: newReq });
      }
      return error('User not found', 404);
    }
  }
  if (path === '/friend-requests/pending-count') {
    return success({ count: friendRequests.length });
  }
  const acceptRequestMatch = path.match(/^\/friend-requests\/([^/]+)\/accept$/);
  if (acceptRequestMatch && method === 'post') {
    const reqId = acceptRequestMatch[1];
    const req = friendRequests.find(r => r.id === reqId);
    if (req) {
      const updatedReqs = friendRequests.filter(r => r.id !== reqId);
      setItem('mock_friend_requests', updatedReqs);
      
      const newFriendUser = req.sender || req.receiver;
      if (newFriendUser) {
        const newFriend: Friend = {
          id: 'fr_' + Math.random().toString(36).substring(7),
          user_id: 'user_1',
          friend_id: newFriendUser.id,
          status: 'accepted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          friend: newFriendUser
        };
        friends.push(newFriend);
        setItem('mock_friends', friends);
      }
      return success({ message: 'Friend request accepted' });
    }
    return error('Request not found', 404);
  }
  const rejectRequestMatch = path.match(/^\/friend-requests\/([^/]+)\/reject$/);
  if (rejectRequestMatch && method === 'post') {
    const reqId = rejectRequestMatch[1];
    const updatedReqs = friendRequests.filter(r => r.id !== reqId);
    setItem('mock_friend_requests', updatedReqs);
    return success({ message: 'Friend request rejected' });
  }

  if (path.startsWith('/users/search')) {
    const q = new URLSearchParams(path.split('?')[1] || '').get('q') || '';
    if (q) {
      const filtered = recommendedUsers.filter(u => u.username.toLowerCase().includes(q.toLowerCase()));
      return success(filtered);
    }
    return success(recommendedUsers);
  }

  // REWARDS / DAILY / SPIN
  if (path === '/daily-rewards/status') {
    return success(dailyReward);
  }
  if (path === '/daily-rewards/claim') {
    dailyReward.last_claimed_at = new Date().toISOString();
    dailyReward.streak += 1;
    setItem('mock_daily_reward', dailyReward);
    
    // Reward XP
    user.xp += 50;
    if (user.xp >= (user.next_level_xp || 400)) {
      user.xp -= (user.next_level_xp || 400);
      user.level += 1;
      user.next_level_xp = user.level * 150 + 250;
    }
    setItem('mock_user', user);
    logActivity('daily_reward_claimed', `Claimed daily reward! Streak is now ${dailyReward.streak} days 🔥`, { streak: dailyReward.streak });
    return success({ message: 'Claimed successfully!', reward: { xp: 50 }, daily_reward: dailyReward });
  }
  if (path === '/spin-rewards') {
    return success(spinRewards);
  }
  if (path === '/spin-rewards/spin') {
    const rolled = spinRewards[Math.floor(Math.random() * spinRewards.length)];
    if (rolled.type === 'xp_boost') {
      user.xp += rolled.value.xp;
      if (user.xp >= (user.next_level_xp || 400)) {
        user.xp -= (user.next_level_xp || 400);
        user.level += 1;
        user.next_level_xp = user.level * 150 + 250;
      }
      setItem('mock_user', user);
    }
    logActivity('spin_reward_claimed', `Spun the wheel and won ${rolled.name}! 🎁`, { reward: rolled.name });
    return success({
      reward: rolled,
      message: `You won: ${rolled.name}!`,
      value_granted: rolled.value
    });
  }

  // ACTIVITY LOGS
  if (path.startsWith('/activity-logs')) {
    if (path === '/activity-logs') {
      return success(paginated(activityLogs));
    }
    if (path.startsWith('/activity-logs/recent')) {
      const limit = Number(new URLSearchParams(path.split('?')[1] || '').get('limit') || '10');
      return success(activityLogs.slice(0, limit));
    }
    if (path === '/activity-logs/today') {
      const todayLogs = activityLogs.filter(log => {
        const date = new Date(log.created_at);
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
      });
      return success(todayLogs);
    }
    if (path.startsWith('/activity-logs/weekly')) {
      const days = Number(new URLSearchParams(path.split('?')[1] || '').get('days') || '7');
      const limitDate = new Date(Date.now() - days * 86400000);
      const weeklyLogs = activityLogs.filter(log => new Date(log.created_at) >= limitDate);
      return success(weeklyLogs);
    }
    if (path === '/activity-logs/summary') {
      return success({
        total_activities: activityLogs.length,
        today_activities: activityLogs.filter(log => {
          const date = new Date(log.created_at);
          const today = new Date();
          return date.getDate() === today.getDate() &&
                 date.getMonth() === today.getMonth() &&
                 date.getFullYear() === today.getFullYear();
        }).length
      });
    }
  }

  // Fallback for unhandled endpoints
  return success({ message: 'Mock endpoint' });
};
