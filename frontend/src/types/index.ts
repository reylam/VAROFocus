// ==================== ENUMS ====================
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed'
export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'boss'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type RoomMemberStatus = 'idle' | 'ready' | 'focusing'
export type RoomMemberRole = 'owner' | 'moderator' | 'member'
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type AchievementCondition = 'task_count' | 'streak' | 'level' | 'xp' | 'pomodoro_count'
export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

// ==================== AUTH & USER ====================
export interface AuthUser {
  id: string
  name: string
  email: string
  avatar_url: string
  level: number
  xp: number
  next_level_xp: number
  streak: number
  total_streak_days: number
  role: string
  theme: 'light' | 'dark'
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface UserStats {
  total_tasks: number
  completed_tasks: number
  failed_tasks: number
  total_xp: number
  current_level: number
  total_achievements: number
  total_badges: number
  longest_streak: number
  current_streak: number
  pomodoro_count: number
  friend_count: number
}

export interface ActivityLogEntry {
  id: string
  user_id: string
  action: string
  description: string
  data: Record<string, unknown>
  created_at: string
}

// ==================== TASKS ====================
export interface SubTask {
  id: string
  task_id: string
  title: string
  completed: boolean
  order: number
  created_at: string
}

export interface TaskComment {
  id: string
  task_id: string
  user_id: string
  user: { name: string; avatar_url: string }
  content: string
  replies?: TaskComment[]
  likes_count: number
  created_at: string
  updated_at: string
}

export interface TaskCheer {
  id: string
  task_id: string
  user_id: string
  user: { name: string; avatar_url: string }
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  category_id: string
  category?: { name: string; color: string }
  title: string
  description: string
  status: TaskStatus
  difficulty: TaskDifficulty
  priority: TaskPriority
  due_date: string | null
  hp: number
  max_hp: number
  xp_reward: number
  is_public: boolean
  subtasks?: SubTask[]
  comments?: TaskComment[]
  cheers?: TaskCheer[]
  cheers_count: number
  comments_count: number
  created_at: string
  updated_at: string
}

export interface TaskTemplate {
  id: string
  category_id: string
  title: string
  description: string
  difficulty: TaskDifficulty
  xp_reward: number
  max_hp: number
  is_system: boolean
}

// ==================== GAMIFICATION ====================
export interface XpLog {
  id: string
  user_id: string
  amount: number
  source: 'task_complete' | 'pomodoro' | 'daily_reward' | 'achievement' | 'bonus'
  source_id?: string
  created_at: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon_url: string
  condition_type: AchievementCondition
  condition_value: number
  xp_reward: number
  badge_id?: string
  is_locked: boolean
  unlocked_at?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon_url: string
  rarity: BadgeRarity
  achievements?: Achievement[]
}

export interface UserBadge {
  badge_id: string
  badge: Badge
  unlocked_at: string
}

export interface DailyReward {
  id: string
  day: number
  xp_reward: number
  streak_multiplier: number
}

export interface SpinReward {
  id: string
  name: string
  icon_url: string
  rarity: BadgeRarity
  probability: number
}

export interface UserSpinLog {
  id: string
  user_id: string
  reward_id: string
  reward: SpinReward
  claimed_at: string
}

// ==================== POMODORO ====================
export interface PomodoroSession {
  id: string
  user_id: string
  task_id?: string
  started_at: string
  completed_at?: string
  cancelled_at?: string
  duration_minutes: number
  break_minutes: number
  status: 'active' | 'completed' | 'cancelled'
  xp_earned?: number
}

export interface PomodoroStreak {
  user_id: string
  current_streak: number
  longest_streak: number
  last_session_date: string
}

export interface PomodoroStats {
  today_sessions: number
  today_minutes: number
  weekly_sessions: number
  weekly_minutes: number
  total_sessions: number
  average_session_length: number
}

// ==================== SOCIAL ====================
export interface Friend {
  id: string
  user_id: string
  friend_id: string
  friend: AuthUser
  status: 'accepted' | 'pending' | 'blocked'
  created_at: string
}

export interface FriendRequest {
  id: string
  sender_id: string
  sender: AuthUser
  receiver_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
}

export interface FriendStats {
  user: AuthUser
  level: number
  xp: number
  streak: number
  completed_tasks: number
}

// ==================== STUDY ROOMS ====================
export interface RoomMember {
  user_id: string
  user: AuthUser
  role: RoomMemberRole
  status: RoomMemberStatus
  is_ready: boolean
  joined_at: string
}

export interface StudyRoom {
  id: string
  owner_id: string
  name: string
  description: string
  capacity: number
  members: RoomMember[]
  members_count: number
  active_session?: RoomSession
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface RoomSession {
  id: string
  room_id: string
  started_at: string
  ended_at?: string
  duration_minutes: number
  participants_count: number
  status: 'active' | 'completed' | 'cancelled'
}

// ==================== CHALLENGES ====================
export interface Challenge {
  id: string
  creator_id: string
  title: string
  description: string
  icon_url: string
  difficulty: TaskDifficulty
  duration_days: number
  participant_count: number
  reward_xp: number
  is_joined: boolean
  progress?: number
  status: 'active' | 'upcoming' | 'completed'
  start_date: string
  end_date: string
  created_at: string
}

export interface ChallengeParticipant {
  id: string
  challenge_id: string
  user_id: string
  user: AuthUser
  score: number
  rank: number
  joined_at: string
}

// ==================== LEADERBOARD ====================
export interface LeaderboardEntry {
  user_id: string
  user: AuthUser
  rank: number
  score: number
  level: number
  xp: number
  is_current_user?: boolean
}

export interface LeaderboardStats {
  global: LeaderboardEntry[]
  daily: LeaderboardEntry[]
  weekly: LeaderboardEntry[]
  monthly: LeaderboardEntry[]
}

// ==================== CALENDAR & SCHEDULING ====================
export interface Schedule {
  id: string
  user_id: string
  task_id: string
  date: string
  time?: string
  recurring: 'none' | 'daily' | 'weekly' | 'monthly'
}

export interface Reminder {
  id: string
  user_id: string
  task_id?: string
  title: string
  type: 'email' | 'push' | 'in_app'
  status: 'pending' | 'sent'
  remind_at: string
}

export interface CalendarEvent {
  id: string
  user_id: string
  task_id: string
  date: string
  type: 'deadline' | 'reminder' | 'session'
}

// ==================== UI & STATE ====================
export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  meta?: PaginationMeta
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}
