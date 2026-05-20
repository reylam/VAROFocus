import { ArrowRight, X, CheckCircle, AlertCircle, Target, Clock, Users, Trophy, Calendar, Plus, Shield, Flame, Award, BookOpen, Coffee, Zap, Star, Sword } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import useAuthStore from '../../store/authStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useTasks, useCreateTask, useAttackMonster, useCompleteTask } from '../../hooks/useTaskHooks'
import { useRecentActivity } from '../../hooks/useActivityHooks'
import { useLeaderboardEntries } from '../../hooks/useLeaderboardHooks'
import { useStudyRooms } from '../../hooks/useStudyRoomHooks'
import { useFriends } from '../../hooks/useFriendsHooks'
import { Link } from 'react-router-dom'
import useTaskStore from '../../store/taskStore'
import useUiStore from '../../store/uiStore'

// Component Notification
const Notification = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg animate-in slide-in-from-top-2 ${type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
      }`}>
      {type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Simple Calendar Component
const SimpleCalendar = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const currentDate = new Date()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  
  const calendarDays = []
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center mb-3">
        {days.map((day, idx) => (
          <div key={idx} className="text-xs text-slate-500 font-medium py-1">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((date, idx) => (
          <div
            key={idx}
            className={`text-xs py-1.5 rounded-full cursor-pointer transition ${date === currentDate.getDate() ? 'bg-[#17937f] text-white' : date ? 'text-slate-700 hover:bg-slate-100' : ''
              }`}
          >
            {date || ''}
          </div>
        ))}
      </div>
    </div>
  )
}

// Todo Item Component
const TodoItem = ({ title, isCompleted = false, onToggle }: { title: string; isCompleted?: boolean; onToggle?: () => void }) => (
  <div className="flex items-center gap-3 py-2">
    <input 
      type="checkbox" 
      checked={isCompleted} 
      onChange={onToggle}
      className="w-4 h-4 rounded border-slate-300 text-[#17937f] cursor-pointer" 
    />
    <span className={`text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>{title}</span>
  </div>
)

// Monster Card Component
const MonsterCardComponent = ({ id, title, hp, currentHp, xpReward, difficulty = 'MEDIUM', onAttack, isAttacking }: { id: string; title: string; hp: number; currentHp: number; xpReward: number; difficulty?: string; onAttack: (id: string) => void; isAttacking: boolean }) => {
  const percentage = (currentHp / hp) * 100
  const isDead = currentHp <= 0

  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-medium text-slate-500">{difficulty}</span>
        </div>
        <span className="text-xs text-[#f99f1e] font-semibold">+{xpReward} XP</span>
      </div>
      <p className="font-semibold text-slate-900 text-sm mb-2">{title}</p>
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
        <span>Monster HP</span>
        <span>{currentHp}/{hp}</span>
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full mb-3">
        <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />
      </div>
      <Button 
        size="sm" 
        className="w-full bg-[#f99f1e] hover:bg-[#e88e0d] text-white text-sm"
        onClick={() => onAttack(id)}
        disabled={isDead || isAttacking}
      >
        {isAttacking ? 'Attacking...' : isDead ? 'Defeated' : 'Attack'}
      </Button>
    </div>
  )
}

// Friend Card
const FriendCard = ({ username, level, avatar }: { username: string; level: number; avatar?: string }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#17937f] to-[#0f6658] flex items-center justify-center text-white font-semibold text-sm">
      {avatar ? <img src={avatar} alt={username} className="w-full h-full rounded-full object-cover" /> : username.charAt(0).toUpperCase()}
    </div>
    <div>
      <p className="font-medium text-slate-900 text-sm">{username}</p>
      <p className="text-xs text-slate-500">Level {level}</p>
    </div>
  </div>
)

// Study Room Card
const StudyRoomCard = ({ name, members, isOnline }: { name: string; members: number; isOnline?: boolean }) => (
  <div className="bg-slate-50 rounded-xl p-3">
    <div className="flex items-center justify-between">
      <p className="font-medium text-slate-900 text-sm">{name}</p>
      {isOnline && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
    </div>
    <p className="text-xs text-slate-500">{members} members online</p>
  </div>
)

// Activity Item
const ActivityItem = ({ message, time }: { message: string; time: string }) => (
  <div className="py-2 border-b border-slate-100 last:border-0">
    <p className="text-sm text-slate-700">{message}</p>
    <p className="text-xs text-slate-400 mt-1">{time}</p>
  </div>
)

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const { data: tasksResponse, refetch: refetchTasks, isLoading: tasksLoading } = useTasks()
  const { data: recentActivity, refetch: refetchActivity, isLoading: activityLoading } = useRecentActivity(10)
  const { data: leaderboardEntries, isLoading: leaderboardLoading } = useLeaderboardEntries('Global', 5)
  const { data: studyRoomsData, isLoading: studyRoomsLoading } = useStudyRooms()
  const { data: friendsData, isLoading: friendsLoading } = useFriends()
  
  const createTask = useCreateTask()
  const attackMonster = useAttackMonster()
  const completeTask = useCompleteTask('')
  const addToast = useUiStore((state) => state.addToast)
  const setAttacking = useTaskStore((s) => s.setAttacking)
  const attackingTaskId = useTaskStore((s) => s.attackingTaskId)

  const tasks = tasksResponse?.data ?? []
  const studyRooms = studyRoomsData ?? []
  const friends = friendsData ?? []
  
  const username = user?.username || user?.name || 'Warrior'
  const userLevel = user?.level || 1
  const userXp = user?.xp || 0
  const streakCount = user?.streak_count || 0
  
  const pendingTasks = useMemo(() => tasks.filter(t => t.status === 'pending'), [tasks])
  const activeMonsters = useMemo(() => tasks.filter(t => t.status !== 'completed' && t.current_hp > 0), [tasks])
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'), [tasks])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    due_date: '',
    estimated_minutes: 30,
    priority: 1,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({
      title: '',
      description: '',
      difficulty: 'medium',
      due_date: '',
      estimated_minutes: 30,
      priority: 1,
    })
    setErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      showNotification('Please fill in all required fields', 'error')
      return
    }

    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        difficulty: formData.difficulty as 'easy' | 'medium' | 'hard' | 'boss',
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined,
        estimated_minutes: Number(formData.estimated_minutes),
        priority: Number(formData.priority),
        is_public: false,
      })
      showNotification(`Task "${formData.title}" created! 🎉`, 'success')
      handleCloseModal()
      refetchTasks()
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to create task', 'error')
    }
  }

  const handleAttack = (taskId: string) => {
    setAttacking(taskId)
    attackMonster.mutate(
      { id: taskId, damage: 15, source: 'manual' },
      {
        onSuccess: (data: any) => {
          if (data?.is_dead) {
            addToast({ title: 'Monster Defeated!', description: `You earned ${data.xp_earned || 50} XP!`, variant: 'success' })
            refetchTasks()
            refetchActivity()
          } else {
            addToast({ title: 'Attack landed!', description: `Dealt 15 damage!`, variant: 'success' })
            refetchTasks()
          }
        },
        onError: () => {
          addToast({ title: 'Attack failed', description: 'Try again later.', variant: 'error' })
        },
        onSettled: () => {
          setAttacking(null)
        },
      }
    )
  }

  const handleCompleteTask = (taskId: string) => {
    completeTask.mutate(undefined, {
      onSuccess: () => {
        addToast({ title: 'Task completed!', description: 'Great job!', variant: 'success' })
        refetchTasks()
        refetchActivity()
      },
      onError: () => {
        addToast({ title: 'Failed', description: 'Could not complete task', variant: 'error' })
      }
    })
  }

  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter(t => t.due_date && t.status !== 'completed')
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .slice(0, 3)
  }, [tasks])

  const mainMonster = useMemo(() => activeMonsters[0], [activeMonsters])
  const topThree = useMemo(() => leaderboardEntries?.slice(0, 3) || [], [leaderboardEntries])

  // Display loading states
  if (tasksLoading || activityLoading || leaderboardLoading || studyRoomsLoading || friendsLoading) {
    return (
      <div className="min-h-screen bg-[#f6fbfa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#17937f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6fbfa]">
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <main className='pt-6 px-8 pb-8'>
        {/* Welcome Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Hello, {username}!</h1>
              <p className="text-slate-500 text-sm mt-1">Level {userLevel} • {userXp} XP</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-600">{streakCount} day streak</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#17937f] to-[#0f6658] flex items-center justify-center text-white font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - 8 cols */}
          <div className="col-span-8 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Sword className="h-6 w-6 text-[#17937f] mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">{activeMonsters.length}</p>
                <p className="text-xs text-slate-500">Active Monsters</p>
              </Card>
              <Card className="p-4 text-center">
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">{completedTasks.length}</p>
                <p className="text-xs text-slate-500">Completed Tasks</p>
              </Card>
              <Card className="p-4 text-center">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">{userLevel}</p>
                <p className="text-xs text-slate-500">Current Level</p>
              </Card>
            </div>

            {/* Friends & Leaderboard Row */}
            <div className='flex gap-6'>
              <Card className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#17937f]" />
                    <h2 className="text-lg font-semibold text-slate-900">Friends</h2>
                  </div>                  <Button variant="ghost" size="sm">
                    <Link to={"/dashboard/friends"} className='flex'>
                      See More <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <div className="space-y-2">
                  {friends.length === 0 ? (
                    <p className="text-center text-slate-500 py-4">No friends yet</p>
                  ) : (
                    friends.slice(0, 3).map((friend: any) => (
                      <FriendCard key={friend.id} username={friend.username} level={friend.level} />
                    ))
                  )}
                </div>
              </Card>

              <Card className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[#17937f]" />
                    <h2 className="text-lg font-semibold text-slate-900">Top 3 Leaderboard</h2>
                  </div>
                  <Link to="/leaderboard">
                    <Button variant="ghost" size="sm">
                      See More <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {topThree.length === 0 ? (
                    <p className="text-center text-slate-500 py-4">No leaderboard data yet</p>
                  ) : (
                    topThree.map((entry, idx) => (
                      <div key={entry.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 text-sm">{entry.user?.username || 'Player'}</p>
                          <p className="text-xs text-slate-500">Level {entry.user?.level || 1}</p>
                        </div>
                        <p className="font-semibold text-[#17937f]">{entry.score} XP</p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Study Rooms & Schedule Row */}
            <div className='flex gap-6'>
              <Card className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#17937f]" />
                    <h2 className="text-lg font-semibold text-slate-900">Study Rooms</h2>
                  </div>
                  <Link to="/study-rooms">
                    <Button variant="ghost" size="sm">
                      See More <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {studyRooms.length === 0 ? (
                    <p className="text-center text-slate-500 py-4">No study rooms available</p>
                  ) : (
                    studyRooms.slice(0, 2).map((room: any) => (
                      <StudyRoomCard key={room.id} name={room.name} members={room.members_count || 0} isOnline={true} />
                    ))
                  )}
                </div>
              </Card>

              <Card className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#17937f]" />
                    <h2 className="text-lg font-semibold text-slate-900">My Schedule</h2>
                  </div>
                  <Link to="/calendar">
                    <Button variant="ghost" size="sm">
                      See More <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <SimpleCalendar />
              </Card>
            </div>

            {/* Upcoming Deadlines */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#17937f]" />
                  <h2 className="text-lg font-semibold text-slate-900">Upcoming Deadlines</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={handleOpenModal}>
                  <Plus className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </div>
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No upcoming deadlines. Create a task to get started!</p>
              ) : (
                <div className="space-y-3">
                  {upcomingDeadlines.map((task, idx) => (
                    <div key={task.id} className='flex items-center w-full gap-4 border border-slate-200 rounded-lg p-3'>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#17937f] to-[#0f6658] flex items-center justify-center text-white font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className='text-slate-500 text-xs'>{new Date(task.due_date).toLocaleDateString()}</p>
                      </div>
                      <div className="w-24">
                        <div className="w-full h-1.5 bg-slate-200 rounded-full">
                          <div className="h-full bg-[#f99f1e] rounded-full" style={{ width: `${(task.current_hp / task.hp) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Active Monsters Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">BATTLEFIELD</p>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    <h2 className="text-xl font-semibold text-slate-900">Active Monsters</h2>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handleOpenModal}>
                    <Plus className="h-4 w-4 mr-1" /> Add Task
                  </Button>
                  <Link to="/tasks">
                    <Button variant="ghost" size="sm">
                      See More <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {activeMonsters.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-slate-500">
                    <Sword className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p>No active monsters.</p>
                    <Button variant="primary" size="sm" className="mt-3" onClick={handleOpenModal}>
                      <Plus className="h-4 w-4 mr-1" /> Create a Task
                    </Button>
                  </div>
                ) : (
                  activeMonsters.slice(0, 4).map((task) => (
                    <MonsterCardComponent
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      hp={task.hp}
                      currentHp={task.current_hp}
                      xpReward={task.xp_reward}
                      difficulty={task.difficulty?.toUpperCase() || 'MEDIUM'}
                      onAttack={handleAttack}
                      isAttacking={attackingTaskId === task.id}
                    />
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - 4 cols */}
          <div className="col-span-4 space-y-6">
            {/* Activity Feed */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#17937f]" />
                  <h2 className="text-lg font-semibold text-slate-900">Activity Feed</h2>
                </div>
                <Link to="/activities">
                  <Button variant="ghost" size="sm">
                    See More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {!recentActivity?.length ? (
                  <div className="text-center py-8 text-slate-500">
                    <Coffee className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm">Complete your first task to see activity!</p>
                  </div>
                ) : (
                  recentActivity.slice(0, 8).map((item) => (
                    <ActivityItem
                      key={item.id}
                      message={item.message}
                      time={new Date(item.created_at).toLocaleString()}
                    />
                  ))
                )}
              </div>
            </Card>

            {/* Quest Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">QUEST</p>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-[#17937f]" />
                    <h2 className="text-xl font-semibold text-slate-900">To Do</h2>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleOpenModal}>
                  <Plus className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </div>
              <div className="flex gap-6">
                <div className="flex-1">
                  {pendingTasks.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No pending tasks ✨</p>
                  ) : (
                    pendingTasks.slice(0, 5).map((task) => (
                      <TodoItem 
                        key={task.id} 
                        title={task.title} 
                        onToggle={() => handleCompleteTask(task.id)}
                      />
                    ))
                  )}
                </div>
                
                {mainMonster && (
                  <div className='flex flex-col items-center gap-3 min-w-[100px]'>
                    <p className="text-sm font-medium text-slate-700 text-center line-clamp-2">{mainMonster.title}</p>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                    <div className="w-full">
                      <div className="w-full h-2 bg-slate-200 rounded-full">
                        <div 
                          className="h-full bg-red-500 rounded-full transition-all" 
                          style={{ width: `${(mainMonster.current_hp / mainMonster.hp) * 100}%` }} 
                        />
                      </div>
                      <p className="text-xs text-center mt-1 text-slate-500">
                        {mainMonster.current_hp}/{mainMonster.hp} HP
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-[#f99f1e] hover:bg-[#e88e0d] text-white"
                      onClick={() => handleAttack(mainMonster.id)}
                      disabled={mainMonster.current_hp <= 0 || attackingTaskId === mainMonster.id}
                    >
                      {attackingTaskId === mainMonster.id ? 'Attacking...' : 'Attack'}
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Access Section */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 text-center">Quick Access</h2>
              <div className="flex justify-center items-center gap-6">
                <Link to="/pomodoro" className='flex flex-col items-center gap-2 font-semibold group'>
                  <div className="w-16 h-16 rounded-full bg-[#17937f] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm">Pomodoro</span>
                </Link>
                <Link to="/leaderboard" className='flex flex-col items-center gap-2 font-semibold group'>
                  <div className="w-16 h-16 rounded-full bg-[#17937f] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm">Leaderboard</span>
                </Link>
                <Link to="/tasks" className='flex flex-col items-center gap-2 font-semibold group'>
                  <div className="w-16 h-16 rounded-full bg-[#17937f] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Sword className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm">Tasks</span>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal Create Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Create New Task</h2>
              <button onClick={handleCloseModal} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3 focus:border-[#17937f] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full rounded-lg border border-slate-200 p-3 focus:border-[#17937f] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3">
                  <option value="easy">Easy - 25 XP</option>
                  <option value="medium">Medium - 50 XP</option>
                  <option value="hard">Hard - 100 XP</option>
                  <option value="boss">Boss - 250 XP</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Due Date (Optional)</label>
                <input type="datetime-local" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Est. Minutes</label>
                  <input type="number" name="estimated_minutes" value={formData.estimated_minutes} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3">
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                    <option value="4">Urgent</option>
                    <option value="5">Critical</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-[#17937f] hover:bg-[#0f6658]" disabled={createTask.isPending}>
                  {createTask.isPending ? 'Creating...' : 'Create Task'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}