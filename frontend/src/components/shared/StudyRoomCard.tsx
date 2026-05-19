import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import type { StudyRoom } from '../../types'

interface StudyRoomCardProps {
  room: StudyRoom
}

export function StudyRoomCard({ room }: StudyRoomCardProps) {
  return (
    <Card className="space-y-4 border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Room</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{room.name}</h3>
        </div>
        {!room.is_private && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Public</span>
        )}
      </div>
      <p className="text-sm leading-6 text-slate-600">{room.description}</p>
      <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
        <span>{room.members_count ?? room.members?.length ?? 0}/{room.max_members} members</span>
      </div>
      <Button variant="secondary" className="w-full">Join room</Button>
    </Card>
  )
}
