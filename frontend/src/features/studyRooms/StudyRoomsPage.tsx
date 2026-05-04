import { useMemo } from 'react'
import { Card } from '../../components/ui/Card'
import { StudyRoomCard } from '../../components/shared/StudyRoomCard'
import { Button } from '../../components/ui/Button'

const rooms = [
  { id: 1, name: 'Focus Forge', description: 'A busy room for fast-paced study sessions.', participants: 12, status: 'ready', owner: 'Raya' },
  { id: 2, name: 'Quiet Quarry', description: 'Slow and steady zone for deep work.', participants: 8, status: 'idle', owner: 'Theo' },
  { id: 3, name: 'Boss Raid', description: 'Team room for collaborative mission runs.', participants: 4, status: 'focusing', owner: 'Mira' },
]

export function StudyRoomsPage() {
  const activeRooms = useMemo(() => rooms.filter((room) => room.status !== 'idle'), [])

  return (
    <main className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Study rooms</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Join a live room</h1>
          <p className="mt-2 text-sm text-slate-500">Real-time focus lobbies with status and owner controls.</p>
        </div>
        <Button variant="primary" size="lg">Create room</Button>
      </header>

      <div className="grid gap-4 xl:grid-cols-3">
        {rooms.map((room) => (
          <StudyRoomCard key={room.id} room={room} />
        ))}
      </div>

      <Card className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6">
        <h2 className="text-lg font-semibold text-white">Room activity</h2>
        <p className="mt-3 text-sm text-slate-400">Keep track of ready status, timer triggers, and live room updates for your team.</p>
      </Card>
    </main>
  )
}
