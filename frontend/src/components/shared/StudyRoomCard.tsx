import { ShieldCheck } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { StudyRoom } from '../../types'

interface StudyRoomCardProps {
  room: StudyRoom
}

export function StudyRoomCard({ room }: StudyRoomCardProps) {
  return (
    <Card className="space-y-4 border-white/10 bg-slate-950/80 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Room</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{room.name}</h3>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-400">{room.status}</span>
      </div>
      <p className="text-sm leading-6 text-slate-400">{room.description}</p>
      <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
        <span>{room.participants} participants</span>
        <span>Owner: {room.owner}</span>
      </div>
      <Button variant="secondary" className="w-full">Join room</Button>
    </Card>
  )
}
