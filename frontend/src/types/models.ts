// User & Auth
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  next_level_xp?: number;
  streak?: number;
  total_streak_days?: number;
  title: string | null;
  streak_count: number;
  role?: string;
  theme?: 'light' | 'dark';
  last_active_at: string | null;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  level: number;
  xp: number;
  title: string | null;
  streak_count: number;
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  pending_tasks: number;
  total_xp_earned: number;
  pomodoro_count: number;
  achievements_unlocked: number;
  badges_earned: number;
  friends_count: number;
  progress_to_next_level: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Task
export interface Task {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | 'boss';
  hp: number;
  current_hp: number;
  xp_reward: number;
  estimated_minutes: number | null;
  due_date: string | null;
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  is_public: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;

  category?: Category;
  monster?: Monster | Monster[];
  subTasks?: SubTask[];
  cheers?: TaskCheer[];
  comments?: TaskComment[];
  cheers_count?: number;
  comments_count?: number;
  max_hp?: number;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  category_id?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'boss';
  due_date?: string;
  estimated_minutes?: number;
  priority?: number;
  is_public?: boolean;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  category_id?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'boss';
  due_date?: string;
  estimated_minutes?: number;
  priority?: number;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed';
  is_public?: boolean;
}

export interface TaskFilters {
  status?: string;
  difficulty?: string;
  category_id?: string;
  limit?: number;
  page?: number;
}

// Monster
export interface Monster {
  id: string;
  task_id: string;
  type: 'slime' | 'goblin' | 'orc' | 'dragon' | 'phantom' | 'skeleton';
  max_hp: number;
  current_hp: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonsterAttack {
  id: string;
  user_id: string;
  monster_id: string;
  damage: number;
  source: string;
  created_at: string;
}

// Category
export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryPayload {
  name: string;
  icon?: string;
  color?: string;
}

// SubTask
export interface SubTask {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSubTaskPayload {
  task_id: string;
  title: string;
}

// Achievement & Badge
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  condition_type: 'task_count' | 'streak' | 'level' | 'xp' | 'pomodoro_count';
  condition_value: number;
  xp_reward: number;
  badge_id: string | null;
  unlocked_at?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Pomodoro
export interface PomodoroSession {
  id: string;
  user_id: string;
  task_id: string | null;
  duration_minutes: number;
  break_minutes: number;
  status: 'running' | 'completed' | 'cancelled';
  started_at: string;
  ended_at: string | null;
  completed_pomodoros: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePomodoroSessionPayload {
  task_id?: string;
  duration_minutes?: number;
  break_minutes?: number;
}

export interface PomodoroStreak {
  id: string;
  user_id: string;
  current_streak: number;
  max_streak: number;
  last_session_at: string;
  updated_at: string;
}

// Daily & Spin Rewards
export interface DailyReward {
  id: string;
  user_id: string;
  last_claimed_at: string | null;
  streak: number;
  created_at: string;
  updated_at: string;
}

export interface SpinReward {
  id: string;
  name: string;
  description: string;
  type: 'xp_boost' | 'theme' | 'item' | 'badge';
  value: Record<string, any>;
  probability: number;
  is_active: boolean;
}

export interface SpinResult {
  reward: SpinReward;
  message: string;
  value_granted: any;
}

// Comments & Cheers
export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  parent_comment_id: string | null;
  comment: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;

  user?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  replies?: TaskComment[];
}

export interface CreateCommentPayload {
  comment: string;
}

export interface TaskCheer {
  id: string;
  task_id: string;
  user_id: string;
  created_at: string;

  user?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

// Study Room
export interface StudyRoom {
  id: string;
  name: string;
  owner_id: string;
  description: string | null;
  is_private: boolean;
  max_members: number;
  created_at: string;
  updated_at: string;

  owner?: User;
  members?: User[];
  sessions?: RoomSession[];
}

export interface CreateStudyRoomPayload {
  name: string;
  description?: string;
  is_private?: boolean;
  max_members?: number;
}

export interface RoomSession {
  id: string;
  room_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

// Leaderboard
export interface LeaderboardEntry {
  id: string;
  leaderboard_id: string;
  user_id: string;
  score: number;
  rank: number;
  updated_at: string;

  user?: User;
}

export interface Leaderboard {
  id: string;
  type: 'global' | 'weekly' | 'monthly' | 'daily';
  category: string | null;
  season_start: string;
  season_end: string;
  is_active: boolean;
  created_at: string;
  entries?: LeaderboardEntry[];
}

// Challenge
export interface Challenge {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  challenge_type: string;
  target_value: number;
  start_date: string;
  end_date: string;
  reward_xp: number;
  reward_badge_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  creator?: User;
  participants?: User[];
}

export interface CreateChallengePayload {
  title: string;
  description?: string;
  challenge_type: string;
  target_value: number;
  start_date: string;
  end_date: string;
  reward_xp?: number;
  reward_badge_id?: string;
}

// Schedule
export interface Schedule {
  id: string;
  user_id: string;
  task_id: string;
  scheduled_start: string;
  scheduled_end: string | null;
  source: string;
  created_at: string;
  updated_at: string;

  task?: Task;
}

// Reminder
export interface Reminder {
  id: string;
  user_id: string;
  task_id: string | null;
  remind_at: string;
  type: string;
  is_sent: boolean;
  created_at: string;

  task?: Task;
}

// Calendar Event
export interface CalendarEvent {
  id: string;
  user_id: string;
  task_id: string | null;
  external_id: string | null;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  provider: 'google' | 'apple' | 'outlook';
  sync_token: string | null;
  created_at: string;
  updated_at: string;
}

// Activity Log
export interface ActivityLog {
  id: string;
  user_id: string;
  type: string;
  message: string;
  metadata: Record<string, any>;
  created_at: string;
}

export type Notification = ActivityLog;

// Friends
export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'accepted' | 'pending' | 'blocked';
  created_at: string;
  updated_at: string;

  friend?: User;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;

  sender?: User;
  receiver?: User;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

// API Responses
export interface SuccessResponse<T> {
  message: string;
  data?: T;
  [key: string]: any;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
