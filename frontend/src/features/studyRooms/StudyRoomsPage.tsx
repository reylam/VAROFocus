import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Search,
  Lock,
  Globe,
  ArrowLeft,
  Crown,
  Users,
  Zap,
  LogOut,
  Play,
  Square,
  Gift,
  Swords,
  ShieldCheck,
  User
} from 'lucide-react'
import {
  useStudyRooms,
  useRecommendedStudyRooms,
  useUserStudyRooms,
  useCreateStudyRoom,
  useJoinStudyRoom,
  useStudyRoom,
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

/* ==================================================================
   SHARED TYPES
================================================================== */

type PresenceStatus = 'live' | 'active' | 'idle' | 'studying' | 'break' | 'offline'

interface RoomMemberDisplay {
  id: string
  name: string
  role: string
  level?: number
  presence?: PresenceStatus
}

interface ActivityItem {
  id: string
  message: string
  timestamp?: string
}

/* ==================================================================
   MONSTER CONFIG
================================================================== */

const MONSTER_CONFIG: Record<string, { name: string; emoji: string; accent: string }> = {
  slime: { name: 'Study Slime', emoji: '🟢', accent: 'bg-emerald-50 text-emerald-700' },
  goblin: { name: 'Lobby Goblin', emoji: '👺', accent: 'bg-amber-50 text-amber-700' },
  orc: { name: 'Orc Overlord', emoji: '👹', accent: 'bg-orange-50 text-orange-700' },
  dragon: { name: 'Apex Red Dragon', emoji: '🐉', accent: 'bg-indigo-50 text-indigo-700' }
}

function getMonsterConfig(type: string) {
  return MONSTER_CONFIG[type] ?? { name: 'Room Spirit', emoji: '👾', accent: 'bg-slate-100 text-slate-700' }
}

/* ==================================================================
   STATUS DOT — presence / live indicator, used everywhere below
================================================================== */

const STATUS_STYLES: Record<PresenceStatus, { dot: string; ring: string; label: string; pulse: boolean }> = {
  live: { dot: 'bg-emerald-500', ring: 'bg-emerald-500/40', label: 'Live', pulse: true },
  active: { dot: 'bg-teal-500', ring: 'bg-teal-500/40', label: 'Active session', pulse: true },
  studying: { dot: 'bg-emerald-500', ring: 'bg-emerald-500/40', label: 'Studying', pulse: false },
  break: { dot: 'bg-amber-500', ring: 'bg-amber-500/40', label: 'On break', pulse: false },
  idle: { dot: 'bg-slate-400', ring: 'bg-slate-400/30', label: 'Idle', pulse: false },
  offline: { dot: 'bg-slate-300', ring: 'bg-slate-300/0', label: 'Offline', pulse: false }
}

function StatusDot({ status, showLabel = false, className }: { status: PresenceStatus; showLabel?: boolean; className?: string }) {
  const style = STATUS_STYLES[status]
  return (
    <span className={clsx('inline-flex items-center gap-1.5', className)}>
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {style.pulse && (
          <motion.span
            className={clsx('absolute inset-0 rounded-full', style.ring)}
            animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className={clsx('relative h-2.5 w-2.5 rounded-full', style.dot)} />
      </span>
      {showLabel && <span className="text-xs font-medium text-slate-500">{style.label}</span>}
    </span>
  )
}

/* ==================================================================
   ROLE BADGE — Owner / Moderator / Member
================================================================== */

type RoomRole = 'owner' | 'moderator' | 'member'

const ROLE_CONFIG: Record<RoomRole, { label: string; icon: typeof Crown; classes: string }> = {
  owner: { label: 'Owner', icon: Crown, classes: 'bg-amber-100 text-amber-700' },
  moderator: { label: 'Moderator', icon: ShieldCheck, classes: 'bg-teal-100 text-teal-700' },
  member: { label: 'Member', icon: User, classes: 'bg-slate-100 text-slate-600' }
}

function RoleBadge({ role, className }: { role: string; className?: string }) {
  const normalized = role?.toLowerCase()
  const key: RoomRole = normalized === 'owner' || normalized === 'moderator' ? normalized : 'member'
  const config = ROLE_CONFIG[key]
  const Icon = config.icon
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        config.classes,
        className
      )}
    >
      <Icon size={11} />
      {config.label}
    </span>
  )
}

/* ==================================================================
   AVATAR STACK — overlapping avatars, "N joined"
================================================================== */

const AVATAR_COLOR_CYCLE = ['bg-teal-500', 'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-violet-500']

function AvatarStack({ members, max = 4, size = 'sm' }: { members: { id: string; name: string }[]; max?: number; size?: 'sm' | 'md' }) {
  const visible = members.slice(0, max)
  const overflow = members.length - visible.length
  const dimension = size === 'sm' ? 'h-7 w-7 text-[11px]' : 'h-9 w-9 text-xs'

  return (
    <div className="flex items-center">
      {visible.map((member, index) => (
        <div
          key={member.id}
          title={member.name}
          className={clsx(
            'flex items-center justify-center rounded-full border-2 border-white font-semibold text-white',
            dimension,
            AVATAR_COLOR_CYCLE[index % AVATAR_COLOR_CYCLE.length]
          )}
          style={{ marginLeft: index === 0 ? 0 : -8, zIndex: visible.length - index }}
        >
          {member.name.charAt(0).toUpperCase()}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={clsx('flex items-center justify-center rounded-full border-2 border-white bg-slate-200 font-semibold text-slate-600', dimension)}
          style={{ marginLeft: -8 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}

/* ==================================================================
   MONSTER HP BAR — signature animated boss bar
================================================================== */

const HP_SEGMENT_COUNT = 20

function MonsterHpBar({ currentHp, maxHp, size = 'lg' }: { currentHp: number; maxHp: number; size?: 'sm' | 'lg' }) {
  const pct = maxHp > 0 ? Math.max(0, Math.min(100, (currentHp / maxHp) * 100)) : 0
  const height = size === 'lg' ? 'h-3' : 'h-1.5'

  return (
    <div className={clsx('relative w-full overflow-hidden rounded-full bg-slate-200/80', height)}>
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rose-500 to-rose-600"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="absolute inset-0 flex">
        {Array.from({ length: HP_SEGMENT_COUNT }).map((_, i) => (
          <div key={i} className="flex-1 border-r border-white/40 last:border-r-0" />
        ))}
      </div>
    </div>
  )
}

/* ==================================================================
   MONSTER CARD — room boss panel for the detail page center column
================================================================== */

function MonsterCard({
  type,
  level,
  currentHp,
  maxHp,
  reward,
  contributionPct
}: {
  type: string
  level?: number
  currentHp: number
  maxHp: number
  reward?: string
  contributionPct?: number
}) {
  const config = getMonsterConfig(type)

  return (
    <motion.div layout className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={clsx('flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl', config.accent)}>
          {config.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-rose-700">
              <Swords size={11} />
              Room boss
            </span>
            {level !== undefined && <span className="text-xs font-medium text-slate-400">Lv. {level}</span>}
          </div>

          <h3 className="mt-1.5 text-lg font-semibold text-slate-900">{config.name}</h3>

          <div className="mt-3 flex items-center justify-between font-mono text-xs font-medium text-slate-500">
            <span>HP</span>
            <span>
              {currentHp.toLocaleString()} / {maxHp.toLocaleString()}
            </span>
          </div>
          <div className="mt-1.5">
            <MonsterHpBar currentHp={currentHp} maxHp={maxHp} />
          </div>

          {(reward || contributionPct !== undefined) && (
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              {reward && (
                <span className="inline-flex items-center gap-1.5">
                  <Gift size={13} className="text-slate-400" />
                  {reward}
                </span>
              )}
              {contributionPct !== undefined && <span className="font-medium text-teal-700">Your hits: {contributionPct}%</span>}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ==================================================================
   ACTIVITY FEED
================================================================== */

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
          >
            <div className="flex items-center justify-between gap-3">
              <span>{item.message}</span>
              {item.timestamp && <span className="shrink-0 text-xs text-slate-400">{item.timestamp}</span>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <div className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
          No activity yet. Be the first to start a session.
        </div>
      )}
    </div>
  )
}

/* ==================================================================
   ROOM MEMBER ITEM / LIST — right sidebar on the detail page
================================================================== */

function RoomMemberItem({ member, isNew = false }: { member: RoomMemberDisplay; isNew?: boolean }) {
  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, scale: 0.92 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-slate-50"
    >
      <div className="relative shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
          {member.name.charAt(0).toUpperCase()}
        </div>
        {member.presence && (
          <span className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white bg-white">
            <StatusDot status={member.presence} />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-slate-900">{member.name}</p>
          {member.level !== undefined && <span className="font-mono text-[11px] text-slate-400">Lv.{member.level}</span>}
        </div>
        <RoleBadge role={member.role} className="mt-1" />
      </div>
    </motion.div>
  )
}

function RoomMemberList({ members, newestMemberId }: { members: RoomMemberDisplay[]; newestMemberId?: string }) {
  return (
    <div className="space-y-1">
      <AnimatePresence initial={false}>
        {members.map((member) => (
          <RoomMemberItem key={member.id} member={member} isNew={member.id === newestMemberId} />
        ))}
      </AnimatePresence>
      {members.length === 0 && <p className="px-2 py-6 text-center text-sm text-slate-400">No members yet.</p>}
    </div>
  )
}

/* ==================================================================
   STUDY ROOM CARD — Discord channel-row style, used on the list page
================================================================== */

function getRoomStatus(room: StudyRoom, memberCount: number): { status: PresenceStatus; label: string } {
  if (room.active_session) return { status: 'active', label: 'Active session' }
  if (memberCount > 0) return { status: 'live', label: 'Live' }
  return { status: 'idle', label: 'Idle' }
}

function StudyRoomCard({
  room,
  onJoin,
  onViewDetails
}: {
  room: StudyRoom
  onJoin: (roomId: string) => void
  onViewDetails: (roomId: string) => void
}) {
  const user = useAuthStore((state) => state.user)
  const isMember = room.members?.some((member) => member.user_id === user?.id) ?? false

  const memberCount = room.members_count ?? room.members?.length ?? 0
  const avatarMembers = (room.members ?? []).map((m) => ({
    id: m.user_id,
    name: m.user?.name ?? m.user?.username ?? '?'
  }))
  const { status, label } = getRoomStatus(room, memberCount)

  return (
    <motion.div
      layout
      whileHover={{ x: 4 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={() => onViewDetails(room.id)}
      className="group flex cursor-pointer items-center gap-4 bg-white px-4 py-3.5 transition-colors hover:bg-slate-50"
    >
      <StatusDot status={status} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[15px] font-semibold text-slate-900">{room.name}</h3>
          {room.is_private ? <Lock size={13} className="text-slate-400" /> : <Globe size={13} className="text-slate-400" />}
        </div>
        <p className="mt-0.5 truncate text-sm text-slate-500">{room.description}</p>

        {room.monster && (
          <div className="mt-2 max-w-[220px]">
            <MonsterHpBar currentHp={room.monster.current_hp} maxHp={room.monster.max_hp} size="sm" />
          </div>
        )}
      </div>

      <div className="hidden items-center gap-4 sm:flex">
        <AvatarStack members={avatarMembers} />
        <span className="font-mono text-xs font-medium text-slate-400">
          {memberCount}/{room.max_members}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={clsx(
            'hidden text-xs font-medium md:inline',
            status === 'active' ? 'text-teal-600' : status === 'live' ? 'text-emerald-600' : 'text-slate-400'
          )}
        >
          {label}
        </span>
        {!isMember ? (
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onJoin(room.id)
            }}
          >
            Join
          </Button>
        ) : (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">Member</span>
        )}
      </div>
    </motion.div>
  )
}

/* ==================================================================
   PAGE 1 — StudyRoomsPage (list), route: /study-rooms
================================================================== */

const ROOM_TABS = [
  { key: 'all', label: 'All rooms' },
  { key: 'recommended', label: 'Recommended' },
  { key: 'my-rooms', label: 'My rooms' }
] as const

type RoomTabKey = (typeof ROOM_TABS)[number]['key']

export function StudyRoomsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<RoomTabKey>('all')

  const navigate = useNavigate()
  const addToast = useUiStore((state) => state.addToast)
  const queryClient = useQueryClient()

  const { data: allRooms = [], isFetching: loadingAll } = useStudyRooms({ limit: 20 })
  const { data: recommendedRooms = [], isFetching: loadingRecommended } = useRecommendedStudyRooms()
  const { data: userRooms = [], isFetching: loadingUser } = useUserStudyRooms()

  const createRoomMutation = useCreateStudyRoom()
  const joinRoomMutation = useJoinStudyRoom()

  const rooms = useMemo(() => {
    const source = activeTab === 'recommended' ? recommendedRooms : activeTab === 'my-rooms' ? userRooms : allRooms
    return source.filter(
      (room) =>
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
          addToast({ title: 'Room created!', description: 'Your study room is ready.', variant: 'success' })
        },
        onError: () => addToast({ title: 'Could not create room', description: 'Please try again.', variant: 'error' })
      }
    )
  }

  const handleJoinRoom = (roomId: string) => {
    joinRoomMutation.mutate(roomId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['studyRooms'] })
        queryClient.invalidateQueries({ queryKey: ['studyRoom', roomId] })
        addToast({ title: 'Joined room', description: 'You can now participate in the room.', variant: 'success' })
      },
      onError: () => addToast({ title: 'Unable to join room', description: 'Please try again.', variant: 'error' })
    })
  }

  return (
    <main className="space-y-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Study rooms</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Join a live room</h1>
          <p className="mt-2 text-sm text-slate-600">Real-time rooms and collaboration for focused study sessions.</p>
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

        <div className="relative flex gap-1 rounded-lg bg-slate-100 p-1">
          {ROOM_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                'relative rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
                activeTab === tab.key ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {activeTab === tab.key && (
                <motion.span
                  layoutId="study-room-tab-pill"
                  className="absolute inset-0 rounded-md bg-white shadow-sm"
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-slate-400">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            {searchQuery ? 'No rooms match your search.' : 'No rooms found.'}
          </div>
        ) : (
          <motion.div layout className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {rooms.map((room) => (
                <StudyRoomCard
                  key={room.id}
                  room={room}
                  onJoin={handleJoinRoom}
                  onViewDetails={(roomId) => navigate(`/study-rooms/${roomId}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create study room">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input name="name" label="Room name" placeholder="e.g., Morning Focus Squad" required />
          <Input name="description" label="Description" placeholder="Describe your room" required />
          <Input name="max_members" label="Max members" type="number" placeholder="10" min="2" max="50" />
          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_private" id="is_private" className="rounded border-slate-300 text-teal-700" />
            <label htmlFor="is_private" className="text-sm text-slate-600">
              Keep room private
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={createRoomMutation.isPending}>
              Create room
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </main>
  )
}

/* ==================================================================
   PAGE 2 — StudyRoomDetailPage, route: /study-rooms/:id
================================================================== */

export function StudyRoomDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const addToast = useUiStore((state) => state.addToast)
  const queryClient = useQueryClient()

  const [localActivity, setLocalActivity] = useState<ActivityItem[]>([])
  const [justJoinedId, setJustJoinedId] = useState<string | undefined>(undefined)

  const { data, isFetching } = useStudyRoom(id ?? '')
  const room = data?.room
  const stats = data?.stats

  const joinRoom = useJoinStudyRoom()
  const leaveRoom = useLeaveStudyRoom()
  const startSession = useStartStudyRoomSession()
  const endSession = useEndStudyRoomSession()

  const isOwner = room?.owner_id === user?.id
  const currentMember = room?.members?.find((m) => m.user_id === user?.id)
  const sessionActive = Boolean(stats?.active_session ?? room?.active_session)
  const memberCount = stats?.member_count ?? room?.members?.length ?? 0

  // NOTE: level and live presence aren't on the member payload this was built from.
  // `level` is read defensively in case your API already has it; presence falls back to a
  // session-based guess until a real per-member presence field/endpoint is wired in.
  const members: RoomMemberDisplay[] = useMemo(() => {
    return (room?.members ?? []).map((m) => ({
      id: m.user_id,
      name: m.user?.name ?? m.user?.username ?? 'Member',
      role: m.role,
      level: (m.user as { level?: number } | undefined)?.level,
      presence: sessionActive ? 'studying' : 'offline'
    }))
  }, [room?.members, sessionActive])

  const handleJoin = () => {
    if (!id) return
    joinRoom.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['studyRoom', id] })
        queryClient.invalidateQueries({ queryKey: ['studyRooms'] })
        if (user?.id) setJustJoinedId(user.id)
        setLocalActivity((prev) => [{ id: `join-${Date.now()}`, message: `${user?.name ?? 'You'} joined the room` }, ...prev])
        addToast({ title: 'Joined room', description: 'You can now participate in the room.', variant: 'success' })
      },
      onError: () => addToast({ title: 'Unable to join room', description: 'Please try again.', variant: 'error' })
    })
  }

  const handleLeave = () => {
    if (!id) return
    leaveRoom.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['studyRooms'] })
        queryClient.invalidateQueries({ queryKey: ['studyRoom', id] })
        addToast({ title: 'Left study room', description: 'You are no longer a room member.', variant: 'warning' })
        navigate('/study-rooms')
      },
      onError: () => addToast({ title: 'Unable to leave', description: 'Please try again later.', variant: 'error' })
    })
  }

  const handleStartSession = () => {
    if (!id) return
    startSession.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['studyRoom', id] })
        setLocalActivity((prev) => [{ id: `start-${Date.now()}`, message: 'Focus session started' }, ...prev])
        addToast({ title: 'Session started', description: 'Your room session is live.', variant: 'success' })
      },
      onError: () => addToast({ title: 'Unable to start session', description: 'Try again in a moment.', variant: 'error' })
    })
  }

  const handleEndSession = () => {
    if (!id) return
    endSession.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['studyRoom', id] })
        setLocalActivity((prev) => [{ id: `end-${Date.now()}`, message: 'Focus session ended' }, ...prev])
        addToast({ title: 'Session ended', description: 'Focus session has been stopped.', variant: 'success' })
      },
      onError: () => addToast({ title: 'Unable to stop session', description: 'Try again in a moment.', variant: 'error' })
    })
  }

  if (isFetching && !room) {
    return (
      <main className="flex h-[60vh] items-center justify-center">
        <div className="text-sm text-slate-400">Loading room...</div>
      </main>
    )
  }

  if (!room) {
    return (
      <main className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-slate-500">This room couldn&apos;t be found.</p>
        <Button variant="ghost" onClick={() => navigate('/study-rooms')}>
          <ArrowLeft size={16} />
          Back to rooms
        </Button>
      </main>
    )
  }

  return (
    <main className="grid gap-6 pb-12 lg:grid-cols-[260px_1fr_280px]">
      {/* LEFT — room info */}
      <aside className="space-y-4 lg:order-1">
        <button
          onClick={() => navigate('/study-rooms')}
          className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          All rooms
        </button>

        <Card className="space-y-4 p-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900">{room.name}</h1>
              <StatusDot status={sessionActive ? 'active' : 'idle'} />
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">{room.description}</p>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1.5">
                <Crown size={14} className="text-amber-500" />
                Owner
              </span>
              <span className="font-medium text-slate-900">{room.owner?.name ?? 'Unknown'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                Members
              </span>
              <span className="font-mono font-medium text-slate-900">
                {memberCount}/{room.max_members}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            {currentMember ? (
              <Button variant="ghost" size="sm" className="w-full" onClick={handleLeave} disabled={leaveRoom.isPending}>
                <LogOut size={14} />
                Leave room
              </Button>
            ) : (
              <Button size="sm" className="w-full" onClick={handleJoin} disabled={joinRoom.isPending}>
                Join room
              </Button>
            )}
          </div>

          {isOwner && (
            <div className="border-t border-slate-100 pt-4">
              <Button
                size="sm"
                variant={sessionActive ? 'ghost' : 'primary'}
                className="w-full"
                onClick={sessionActive ? handleEndSession : handleStartSession}
                disabled={startSession.isPending || endSession.isPending}
              >
                {sessionActive ? <Square size={14} /> : <Play size={14} />}
                {sessionActive ? 'End session' : 'Start session'}
              </Button>
            </div>
          )}
        </Card>
      </aside>

      {/* CENTER — focus session, monster, activity */}
      <section className="space-y-6 lg:order-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Current focus session</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">{sessionActive ? 'In progress' : 'No session live'}</h2>
            </div>
            <div className={sessionActive ? 'text-teal-600' : 'text-slate-400'}>
              <Zap size={22} />
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {sessionActive
              ? 'Stay with the room every focus block chips away at the room boss below.'
              : 'Waiting on the room owner to start the next focus block.'}
          </p>
        </Card>

        {room.monster && (
          <MonsterCard type={room.monster.type} currentHp={room.monster.current_hp} maxHp={room.monster.max_hp} />
        )}

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-900">Room activity</h3>
          <div className="mt-3">
            <ActivityFeed
              items={localActivity.length > 0 ? localActivity : [{ id: 'seed', message: 'Room created. Ready to start studying.' }]}
            />
          </div>
        </Card>
      </section>

      {/* RIGHT — members */}
      <aside className="space-y-3 lg:order-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-slate-900">Members</h3>
          <span className="text-xs text-slate-400">{memberCount}</span>
        </div>
        <Card className="p-3">
          <RoomMemberList members={members} newestMemberId={justJoinedId} />
        </Card>
      </aside>
    </main>
  )
}