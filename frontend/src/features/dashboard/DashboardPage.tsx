import { ArrowRight, X, CheckCircle, AlertCircle, Target, Flame, Clock, Users, Trophy, Calendar, Plus, Shield } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useTasks, useCreateTask } from '../../hooks/useTaskHooks'
import { useRecentActivity } from '../../hooks/useActivityHooks'
import { useLeaderboardEntries } from '../../hooks/useLeaderboardHooks'
import { Link } from 'react-router-dom'

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
  const dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  const currentDate = new Date().getDate()

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center mb-3">
        {days.map((day, idx) => (
          <div key={idx} className="text-xs text-slate-500 font-medium py-1">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {dates.slice(0, 35).map((date, idx) => (
          <div
            key={idx}
            className={`text-xs py-1.5 rounded-full cursor-pointer transition ${date === currentDate ? 'bg-[#17937f] text-white' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  )
}

// Todo Item Component
const TodoItem = ({ title, isCompleted = false }: { title: string; isCompleted?: boolean }) => (
  <div className="flex items-center gap-3 py-2">
    <input type="checkbox" checked={isCompleted} readOnly className="w-4 h-4 rounded border-slate-300 text-[#17937f]" />
    <span className={`text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>{title}</span>
  </div>
)

// Monster Card Component
const MonsterCardComponent = ({ title, hp, currentHp, xpReward, difficulty = 'MEDIUM' }: { title: string; hp: number; currentHp: number; xpReward: number; difficulty?: string }) => {
  const percentage = (currentHp / hp) * 100

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
      <Button size="sm" className="w-full bg-[#f99f1e] hover:bg-[#e88e0d] text-white text-sm">
        Attack
      </Button>
    </div>
  )
}

// Friend Card
const FriendCard = ({ username, level }: { username: string; level: number }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#17937f] to-[#0f6658] flex items-center justify-center text-white font-semibold text-sm">
      {username.charAt(0).toUpperCase()}
    </div>
    <div>
      <p className="font-medium text-slate-900 text-sm">{username}</p>
      <p className="text-xs text-slate-500">Level {level}</p>
    </div>
  </div>
)

// Study Room Card
const StudyRoomCard = ({ name, members }: { name: string; members: number }) => (
  <div className="bg-slate-50 rounded-xl p-3">
    <p className="font-medium text-slate-900 text-sm">{name}</p>
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
  const { data: tasksResponse } = useTasks()
  const { data: recentActivity } = useRecentActivity(6)
  const { data: leaderboardEntries } = useLeaderboardEntries('Global', 5)
  const createTask = useCreateTask()

  const tasks = tasksResponse?.data ?? []
  const username = user?.username || user?.name || 'Varoooo'

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
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Failed to create task', 'error')
    }
  }

  const getXpReward = (difficulty: string) => {
    const rewards = { easy: 25, medium: 50, hard: 100, boss: 250 }
    return rewards[difficulty as keyof typeof rewards] || 50
  }

  // Dummy data
  const friends = [
    { username: 'focus_master', level: 10 },
    { username: 'productivity_guru', level: 7 },
    { username: 'study_king', level: 3 },
  ]

  const studyRooms = [
    { name: 'Focus Room #1', members: 12 },
    { name: 'Study Hall', members: 8 },
  ]

  const todoItems = [
    'Watch video',
    'Exercise',
    'Self Evaluate'
  ]

  return (
    <div className="min-h-screen bg-[#f6fbfa]">
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

      <main className='pt-8'>
        {/* Hello User */}
        {/* <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Hello, {username}!</h1>
        </div> */}

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Quest / To Do */}
          <div className="col-span-8 space-y-6">

            <div className='flex gap-6'>
              {/* Friends */}
              <Card className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Friends</h2>
                  <Button variant="ghost" size="sm">
                    See More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {friends.map((friend, idx) => (
                    <FriendCard key={idx} username={friend.username} level={friend.level} />
                  ))}
                </div>
              </Card>

              {/* Study Rooms */}
              <Card className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Study Rooms</h2>
                  <Button variant="ghost" size="sm">
                    See More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {studyRooms.map((room, idx) => (
                    <StudyRoomCard key={idx} name={room.name} members={room.members} />
                  ))}
                </div>
              </Card>
            </div>

            {/* Calendar */}
            <Card className='flex'>
              {/* My Schedule / Calendar */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">My Schedule</h2>
                  <Button variant="ghost" size="sm">
                    See More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <SimpleCalendar />
              </Card>

              {/* ScheduleCard Deadline */}
              <div className='flex flex-col flex-1 p-5 gap-6'>
                {/* Items */}
                <div className='flex items-center w-full gap-6 border border-slate-200 rounded-full py-2'>
                  <div className="w-14 scale-125 h-14 rounded-full bg-gradient-to-br from-[#17937f] to-[#0f6658] flex items-center justify-center text-white font-semibold text-sm">
                    1
                  </div>
                  <div className="flex flex-col">
                    <p>Lorem ipsum dolor sit amet.</p>
                    <p className='text-slate-500 text-sm'>Lorem, ipsum.</p>
                  </div>
                </div>
                <div className='flex items-center w-full gap-6 border border-slate-200 rounded-full py-2'>
                  <div className="w-14 scale-125 h-14 rounded-full bg-gradient-to-br from-[#17937f] to-[#0f6658] flex items-center justify-center text-white font-semibold text-sm">
                    1
                  </div>
                  <div className="flex flex-col">
                    <p>Lorem ipsum dolor sit amet.</p>
                    <p className='text-slate-500 text-sm'>Lorem, ipsum.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Subject Name / Active Monsters */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">SUBJECT NAME</p>
                  <h2 className="text-xl font-semibold text-slate-900">Monster</h2>
                </div>
                <Button variant="ghost" size="sm">
                  See More <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {tasks && tasks.length > 0 ? (
                  tasks.slice(0, 4).map((task) => (
                    <MonsterCardComponent
                      key={task.id}
                      title={task.title}
                      hp={task.hp}
                      currentHp={task.current_hp}
                      xpReward={task.xp_reward}
                      difficulty={task.difficulty?.toUpperCase() || 'MEDIUM'}
                    />
                  ))
                ) : (
                  <>
                    <MonsterCardComponent title="Kerjakan PR" hp={100} currentHp={100} xpReward={50} />
                    <MonsterCardComponent title="Math Exercise" hp={150} currentHp={75} xpReward={75} />
                  </>
                )}
              </div>
            </Card>

            {/* Pomodoro Quick Section */}
            {/* <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">QUICK FOCUS</p>
                  <h2 className="text-xl font-semibold text-slate-900">Pomodoro Quick</h2>
                </div>
                <Button variant="ghost" size="sm">
                  See More <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#17937f]/10 to-[#17937f]/5 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-[#17937f] flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Start a focus session</p>
                  <p className="text-sm text-slate-500">25 minutes of focused work</p>
                </div>
                <Button className="bg-[#17937f] hover:bg-[#0f6658]">Start</Button>
              </div>
            </Card> */}
          </div>

          {/* Right Column - Friends, Study Rooms, Activity, Schedule */}
          <div className="col-span-4 space-y-6">
            {/* Activity Feed */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Activity Feed</h2>
                <Button variant="ghost" size="sm">
                  See More <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-2">
                {!recentActivity?.length ? (
                  <ActivityItem message="Complete your first task to see activity!" time="Just now" />
                ) : (
                  recentActivity.slice(0, 5).map((item) => (
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
                  <h2 className="text-xl font-semibold text-slate-900">To do</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={handleOpenModal}>
                  <Plus className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </div>
              <div className="flex justify-between">
                <div className="divide-y divide-slate-100">
                  {todoItems.map((item, idx) => (
                    <TodoItem key={idx} title={item} />
                  ))}
                </div>
                <div className='flex flex-col items-center gap-4'>
                  <p>Monster Name</p>
                  <div className="w-20 h-20 rounded-full bg-[#17937f] flex items-center justify-center">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full mb-3">
                    <div className="h-full bg-red-500 rounded-full transition-all w-1/2" />
                  </div>
                </div>
              </div>
            </Card>


            {/* Pomodoro Quick Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">QUICK FOCUS</p>
                  {/* <h2 className="text-xl font-semibold text-slate-900">Pomodoro Quick</h2> */}
                </div>
              </div>
              <div className="flex justify-center items-center gap-4 p-4 rounded-xl">
                <Card className='flex flex-col items-center gap-2 font-semibold'>
                  <h2>Pomodoro</h2>
                  <Link to={"/pomodoro"} className="w-16 h-16 rounded-full bg-[#17937f] flex items-center justify-center">
                    <Clock className="h-8 w-8 text-white" />
                  </Link>
                </Card>
                <Card className='flex flex-col items-center gap-2 font-semibold'>
                  <h2>Leaderboard</h2>
                  <Link to={"/leaderboard"} className="w-16 h-16 rounded-full bg-[#17937f] flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-white" />
                  </Link>
                </Card>
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
                <label className="mb-1 block text-sm font-medium text-slate-700">Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3">
                  <option value="easy">Easy - 25 XP</option>
                  <option value="medium">Medium - 50 XP</option>
                  <option value="hard">Hard - 100 XP</option>
                  <option value="boss">Boss - 250 XP</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={createTask.isPending}>
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