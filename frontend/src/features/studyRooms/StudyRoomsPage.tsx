import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Users,
  Crown,
  Shield,
  User,
  Play,
  Plus,
  Search,
  Clock,
  MessageCircle,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react'
import {
  fetchStudyRooms,
  fetchRecommendedRooms,
  fetchUserRooms,
  joinRoom,
  createRoom,
  startRoomSession,
  updateMemberStatus
} from '../../services/studyRooms'
import type { StudyRoom, RoomMember, RoomMemberStatus } from '../../types'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { HPBar } from '../../components/ui/HPBar'
import useAuthStore from '../../store/authStore'
import useUiStore from '../../store/uiStore'
import clsx from '../../utils/clsx'

interface StudyRoomCardProps {
  room: StudyRoom
  onJoin: (roomId: string) => void
  onViewDetails: (room: StudyRoom) => void
}

function StudyRoomCard({ room, onJoin, onViewDetails }: StudyRoomCardProps) {
  const user = useAuthStore((state) => state.user)
  const isMember = room.members.some(member => member.user_id === user?.id)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group cursor-pointer rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-soft backdrop-blur-xl transition-all hover:border-primary/30"
      onClick={() => onViewDetails(room)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{room.name}</h3>
            {room.is_public && (
              <div className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
                Public
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-400 line-clamp-2">{room.description}</p>

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Users size={16} />
              {room.members_count}/{room.capacity}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              {new Date(room.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {room.active_session && (
            <div className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">
              <Zap size={12} />
              Active Session
            </div>
          )}
          {!isMember && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onJoin(room.id)
              }}
            >
              Join Room
            </Button>
          )}
          {isMember && (
            <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
              Member
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface MemberAvatarProps {
  member: RoomMember
  size?: 'sm' | 'md' | 'lg'
  showStatus?: boolean
}

function MemberAvatar({ member, size = 'md', showStatus = true }: MemberAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  const statusColors = {
    idle: 'bg-slate-500',
    ready: 'bg-emerald-500',
    focusing: 'bg-primary'
  }

  const roleIcons = {
    owner: Crown,
    moderator: Shield,
    member: User
  }

  const RoleIcon = roleIcons[member.role]

  return (
    <div className="relative">
      <div className={clsx(
        'relative overflow-hidden rounded-full border-2 border-white/10',
        sizeClasses[size]
      )}>
        {member.user.avatar_url ? (
          <img
            src={member.user.avatar_url}
            alt={member.user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-accent text-white">
            {member.user.name.charAt(0).toUpperCase()}
          </div>
        )}

        {showStatus && (
          <div className={clsx(
            'absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-950',
            statusColors[member.status]
          )} />
        )}
      </div>

      <div className="absolute -top-1 -right-1 rounded-full bg-slate-950 p-1">
        <RoleIcon size={12} className="text-slate-400" />
      </div>
    </div>
  )
}

interface RoomLobbyProps {
  room: StudyRoom
  onClose: () => void
}

function RoomLobby({ room, onClose }: RoomLobbyProps) {
  const user = useAuthStore((state) => state.user)
  const addToast = useUiStore((state) => state.addToast)
  const queryClient = useQueryClient()

  const [sessionTime, setSessionTime] = useState(0)
  const [isConnected] = useState(true)

  const isOwner = room.owner_id === user?.id
  const currentMember = room.members.find(m => m.user_id === user?.id)

  const updateStatusMutation = useMutation({
    mutationFn: (status: RoomMemberStatus) => updateMemberStatus(room.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-room', room.id] })
        addToast({
          title: 'Status updated',
          description: 'Your status has been updated for the room.',
          variant: 'success'
        })
      },
      onError: () => {
        addToast({
          title: 'Failed to update status',
          description: 'Please try again.',
          variant: 'warning'
        })
      }
    }
  )

  const startSessionMutation = useMutation({
    mutationFn: () => startRoomSession(room.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-room', room.id] })
        addToast({
          title: 'Session started!',
          description: 'The focus session has begun.',
          variant: 'success'
        })
      }
    }
  )

  // Simulate real-time updates (in real app, use WebSocket/Pusher)
  useEffect(() => {
    const interval = setInterval(() => {
      if (room.active_session) {
        setSessionTime(prev => prev + 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [room.active_session])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const readyMembers = room.members.filter(m => m.status === 'ready').length

  return (
    <Modal isOpen={true} onClose={onClose} title={room.name} size="lg">
      <div className="space-y-6">
        {/* Room Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{room.description}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Users size={16} />
                {room.members_count}/{room.capacity} members
              </div>
              <div className="flex items-center gap-1">
                {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>

          {room.active_session && (
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-primary">
                {formatTime(sessionTime)}
              </div>
              <p className="text-xs text-slate-400">Session Time</p>
            </div>
          )}
        </div>

        {/* Session Controls */}
        {isOwner && !room.active_session && (
          <Card className="border-primary/30 bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Ready to start?</h3>
                <p className="text-sm text-slate-400">
                  {readyMembers} of {room.members_count} members are ready
                </p>
              </div>
              <Button
                onClick={() => startSessionMutation.mutate()}
                disabled={readyMembers === 0}
                className="gap-2"
              >
                <Play size={16} />
                Start Session
              </Button>
            </div>

            <div className="mt-4">
              <HPBar
                current={readyMembers}
                max={room.members_count}
                label="Ready Progress"
              />
            </div>
          </Card>
        )}

        {/* Member Status Controls */}
        {currentMember && (
          <Card>
            <h3 className="font-semibold text-white">Your Status</h3>
            <div className="mt-3 flex gap-2">
              {(['idle', 'ready', 'focusing'] as RoomMemberStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={currentMember.status === status ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => updateStatusMutation.mutate(status)}
                  disabled={updateStatusMutation.isPending}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Members Grid */}
        <Card>
          <h3 className="font-semibold text-white">Room Members</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {room.members.map((member) => (
                <motion.div
                  key={member.user_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/50 p-3"
                >
                  <MemberAvatar member={member} size="md" />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{member.user.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{member.status}</p>
                  </div>
                  {member.is_ready && (
                    <div className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
                      Ready
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card>
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <MessageCircle size={18} />
            Activity Feed
          </h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-white/10 bg-slate-950/50 p-3">
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-primary">Alex</span> joined the room
              </p>
              <p className="text-xs text-slate-500">2 minutes ago</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/50 p-3">
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-emerald-400">Sarah</span> is now ready
              </p>
              <p className="text-xs text-slate-500">1 minute ago</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/50 p-3">
              <p className="text-sm text-slate-300">
                Session started by room owner
              </p>
              <p className="text-xs text-slate-500">30 seconds ago</p>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  )
}

export function StudyRoomsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<StudyRoom | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'my-rooms'>('all')

  const addToast = useUiStore((state) => state.addToast)
  const queryClient = useQueryClient()

  const { data: allRooms = [], isPending: loadingAll } = useQuery({
    queryKey: ['study-rooms'],
    queryFn: fetchStudyRooms,
    enabled: activeTab === 'all'
  })

  const { data: recommendedRooms = [], isPending: loadingRecommended } = useQuery({
    queryKey: ['study-rooms-recommended'],
    queryFn: fetchRecommendedRooms,
    enabled: activeTab === 'recommended'
  })

  const { data: userRooms = [], isPending: loadingUser } = useQuery({
    queryKey: ['study-rooms-user'],
    queryFn: fetchUserRooms,
    enabled: activeTab === 'my-rooms'
  })

  const joinRoomMutation = useMutation({
    mutationFn: joinRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-rooms'] })
      addToast({
        title: 'Joined room successfully!',
        description: 'Welcome to the study room.',
        variant: 'success'
      })
    },
    onError: () => {
      addToast({
        title: 'Failed to join room',
        description: 'Please try again.',
        variant: 'warning'
      })
    }
  })

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-rooms'] })
      setShowCreateModal(false)
      addToast({
        title: 'Room created!',
        description: 'Your study room is ready.',
        variant: 'success'
      })
    }
  })

  const currentRooms = activeTab === 'all' ? allRooms :
                      activeTab === 'recommended' ? recommendedRooms :
                      userRooms

  const isLoading = loadingAll || loadingRecommended || loadingUser

  const filteredRooms = currentRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Study rooms</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Join a live room</h1>
          <p className="mt-2 text-sm text-slate-500">
            Real-time focus lobbies with status and owner controls. Study together, stay accountable.
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Create room
        </Button>
      </header>

      {/* Search and Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All Rooms' },
            { key: 'recommended', label: 'Recommended' },
            { key: 'my-rooms', label: 'My Rooms' }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-4 xl:grid-cols-2">
        {isLoading ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-slate-950/80 p-12 text-center">
            <div className="text-slate-400">Loading rooms...</div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-slate-950/80 p-12 text-center">
            <div className="text-slate-400">
              {searchQuery ? 'No rooms match your search.' : 'No rooms available right now.'}
            </div>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <StudyRoomCard
              key={room.id}
              room={room}
              onJoin={(roomId) => joinRoomMutation.mutate(roomId)}
              onViewDetails={setSelectedRoom}
            />
          ))
        )}
      </div>

      {/* Create Room Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Study Room"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            createRoomMutation.mutate({
              name: formData.get('name') as string,
              description: formData.get('description') as string,
              capacity: parseInt(formData.get('capacity') as string) || 10,
              is_public: formData.get('is_public') === 'on'
            })
          }}
          className="space-y-4"
        >
          <Input
            name="name"
            label="Room Name"
            placeholder="e.g., Morning Focus Squad"
            required
          />
          <Input
            name="description"
            label="Description"
            placeholder="Describe your room's focus and goals"
            required
          />
          <Input
            name="capacity"
            label="Capacity"
            type="number"
            placeholder="10"
            min="2"
            max="50"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_public"
              id="is_public"
              className="rounded border-slate-700 bg-slate-950"
            />
            <label htmlFor="is_public" className="text-sm text-slate-300">
              Make room public
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={createRoomMutation.isPending}>
              Create Room
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Room Lobby Modal */}
      {selectedRoom && (
        <RoomLobby
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </main>
  )
}
