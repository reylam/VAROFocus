import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { Users, Plus, Search, Clock, Zap } from 'lucide-react'
import {
  useStudyRooms,
  useRecommendedStudyRooms,
  useUserStudyRooms,
  useStudyRoom,
  useCreateStudyRoom,
  useJoinStudyRoom,
  useLeaveStudyRoom,
  useStartStudyRoomSession,
  useEndStudyRoomSession
} from '../../hooks/useStudyRoomHooks'
import type { StudyRoom } from '@/types/models'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import useAuthStore from '../../store/authStore'
import useUiStore from '../../store/uiStore'
import clsx from '../../utils/clsx'

interface StudyRoomCardProps {
  room: StudyRoom
  onJoin: (roomId: string) => void
  onViewDetails: (roomId: string) => void
}

function StudyRoomCard({ room, onJoin, onViewDetails }: StudyRoomCardProps) {
  const user = useAuthStore((state) => state.user)
  const isMember = room.members?.some((member) => member.user_id === user?.id) ?? false

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-teal-300"
      onClick={() => onViewDetails(room.id)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
            <span
              className={clsx(
                'rounded-full px-2 py-1 text-xs font-semibold',
                room.is_private ? 'bg-orange-100 text-orange-700' : 'bg-teal-100 text-teal-700'
              )}
            >
              {room.is_private ? 'Private' : 'Public'}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-2">{room.description}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-slate-400" />
              <span>{room.members_count ?? room.members?.length ?? 0}/{room.max_members}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              <span>{new Date(room.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {room.active_session && (
            <div className="flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
              <Zap size={12} />
              Active session
            </div>
          )}
          {!isMember ? (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onJoin(room.id)
              }}
            >
              Join
            </Button>
          ) : (
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">Member</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface RoomLobbyProps {
  room: StudyRoom
  stats: {
    member_count: number
    is_full: boolean
    active_session: boolean
  }
  onClose: () => void
}

function RoomLobby({ room, stats, onClose }: RoomLobbyProps) {
  const user = useAuthStore((state) => state.user)
  const addToast = useUiStore((state) => state.addToast)
  const queryClient = useQueryClient()

  const isOwner = room.owner_id === user?.id
  const currentMember = room.members?.find((member) => member.user_id === user?.id)
  const sessionActive = stats.active_session || room.active_session
  const memberCount = stats.member_count ?? room.members?.length ?? 0

  const leaveRoom = useLeaveStudyRoom()
  const startSession = useStartStudyRoomSession()
  const endSession = useEndStudyRoomSession()

  const handleLeave = () => {
    if (!room.id) return

    leaveRoom.mutate(room.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['studyRooms'] })
        queryClient.invalidateQueries({ queryKey: ['studyRoom', room.id] })
        addToast({
          title: 'Left study room',
          description: 'You are no longer a room member.',
          variant: 'warning'
        })
        onClose()
      },
      onError: () => {
        addToast({
          title: 'Unable to leave',
          description: 'Please try again later.',
          variant: 'error'
        })
      }
    })
  }

  const handleStartSession = () => {
    startSession.mutate(room.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['studyRoom', room.id] })
        addToast({
          title: 'Session started',
          description: 'Your room session is live.',
          variant: 'success'
        })
      },
      onError: () => {
        addToast({
          title: 'Unable to start session',
          description: 'Try again in a moment.',
          variant: 'error'
        })
      }
    })
  }

  const handleEndSession = () => {
    endSession.mutate(room.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['studyRoom', room.id] })
        addToast({
          title: 'Session ended',
          description: 'Focus session has been stopped.',
          variant: 'success'
        })
      },
      onError: () => {
        addToast({
          title: 'Unable to stop session',
          description: 'Try again in a moment.',
          variant: 'error'
        })
      }
    })
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={room.name} size="lg">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm text-slate-500">{room.description}</p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-xl bg-slate-100 px-3 py-2">Owner: {room.owner?.name ?? 'Unknown'}</span>
              <span className="rounded-xl bg-slate-100 px-3 py-2">Members: {memberCount}/{room.max_members}</span>
              <span className="rounded-xl bg-slate-100 px-3 py-2">Created: {new Date(room.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              className={clsx(
                'rounded-2xl px-4 py-3 text-sm font-semibold',
                sessionActive ? 'bg-orange-100 text-orange-800' : 'bg-teal-100 text-teal-800'
              )}
            >
              {sessionActive ? 'Active session' : 'No session live'}
            </div>
            {isOwner && (
              <Button
                onClick={sessionActive ? handleEndSession : handleStartSession}
                disabled={startSession.isPending || endSession.isPending}
              >
                {sessionActive ? 'End Session' : 'Start Session'}
              </Button>
            )}
            {currentMember && (
              <Button variant="ghost" onClick={handleLeave} disabled={leaveRoom.isPending}>
                Leave room
              </Button>
            )}
          </div>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Members</h3>
            <span className="text-sm text-slate-500">{memberCount} joined</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {room.members?.map((member) => (
              <div key={member.user_id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                  {(member.user.name ?? member.user.username).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{member.user.name ?? member.user.username}</p>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900">Activity</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-100 p-4">
              <p>Room created. Ready to start studying.</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <p>Members can join and stay focused together.</p>
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
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'my-rooms'>('all')

  const addToast = useUiStore((state) => state.addToast)
  const queryClient = useQueryClient()

  const { data: allRooms = [], isFetching: loadingAll } = useStudyRooms({ limit: 20 })
  const { data: recommendedRooms = [], isFetching: loadingRecommended } = useRecommendedStudyRooms()
  const { data: userRooms = [], isFetching: loadingUser } = useUserStudyRooms()
  const studyRoomQuery = useStudyRoom(selectedRoomId ?? '')

  const createRoomMutation = useCreateStudyRoom()
  const joinRoomMutation = useJoinStudyRoom()

  const selectedRoom = studyRoomQuery.data?.room
  const roomStats = studyRoomQuery.data?.stats

  const rooms = useMemo(() => {
    const source = activeTab === 'recommended' ? recommendedRooms : activeTab === 'my-rooms' ? userRooms : allRooms
    return source.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [activeTab, allRooms, recommendedRooms, userRooms, searchQuery])

  const isLoading = activeTab === 'all' ? loadingAll : activeTab === 'recommended' ? loadingRecommended : loadingUser

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    createRoomMutation.mutate(
      {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        max_members: parseInt(formData.get('max_members') as string, 10) || 10,
        is_private: formData.get('is_private') === 'on'
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['studyRooms'] })
          setShowCreateModal(false)
          addToast({
            title: 'Room created!',
            description: 'Your study room is ready.',
            variant: 'success'
          })
        },
        onError: () => {
          addToast({
            title: 'Could not create room',
            description: 'Please try again.',
            variant: 'error'
          })
        }
      }
    )
  }

  const handleJoinRoom = (roomId: string) => {
    joinRoomMutation.mutate(roomId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['studyRooms'] })
        queryClient.invalidateQueries({ queryKey: ['studyRoom', roomId] })
        addToast({
          title: 'Joined room',
          description: 'You can now participate in the room.',
          variant: 'success'
        })
      },
      onError: () => {
        addToast({
          title: 'Unable to join room',
          description: 'Please try again.',
          variant: 'error'
        })
      }
    })
  }

  return (
    <main className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Study rooms</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Join a live room</h1>
          <p className="mt-2 text-sm text-slate-600">
            Real-time rooms and collaboration for focused study sessions.
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Create room
        </Button>
      </header>

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

        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Rooms' },
            { key: 'recommended', label: 'Recommended' },
            { key: 'my-rooms', label: 'My Rooms' }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key as 'all' | 'recommended' | 'my-rooms')}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {isLoading ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="text-slate-500">Loading rooms...</div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="text-slate-500">
              {searchQuery ? 'No rooms match your search.' : 'No rooms found.'}
            </div>
          </div>
        ) : (
          rooms.map((room) => (
            <StudyRoomCard
              key={room.id}
              room={room}
              onJoin={handleJoinRoom}
              onViewDetails={setSelectedRoomId}
            />
          ))
        )}
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Study Room">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input name="name" label="Room Name" placeholder="e.g., Morning Focus Squad" required />
          <Input name="description" label="Description" placeholder="Describe your room" required />
          <Input name="max_members" label="Max Members" type="number" placeholder="10" min="2" max="50" />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_private" id="is_private" className="rounded border-slate-300 text-teal-700" />
            <label htmlFor="is_private" className="text-sm text-slate-600">Keep room private</label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={createRoomMutation.isPending}>
              Create Room
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {selectedRoom && roomStats && (
        <RoomLobby room={selectedRoom} stats={roomStats} onClose={() => setSelectedRoomId(null)} />
      )}
    </main>
  )
}
