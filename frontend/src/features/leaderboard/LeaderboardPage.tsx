import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { LeaderboardEntry } from '../../types'
import { Button } from '../../components/ui/Button'

const board: LeaderboardEntry[] = [
  { id: 1, name: 'Ava', score: 9260, rank: 1, avatar_url: '', is_current_user: false },
  { id: 2, name: 'Milo', score: 8790, rank: 2, avatar_url: '', is_current_user: false },
  { id: 3, name: 'Luna', score: 8180, rank: 3, avatar_url: '', is_current_user: true },
  { id: 4, name: 'Zane', score: 7250, rank: 4, avatar_url: '', is_current_user: false },
  { id: 5, name: 'Nova', score: 6890, rank: 5, avatar_url: '', is_current_user: false },
]

export function LeaderboardPage() {
  const [mode, setMode] = useState('Daily')

  return (
    <main className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Leaderboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Top achievers</h1>
          <p className="mt-2 text-sm text-slate-500">Track performance across daily, weekly, and global formats.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['Daily', 'Weekly', 'Monthly', 'Global'].map((option) => (
            <Button
              key={option}
              variant={option === mode ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setMode(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </header>

      <Card>
        <div className="grid gap-4">
          {board.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between gap-4 rounded-3xl border p-5 transition ${
                entry.is_current_user ? 'border-primary bg-primary/10 text-white' : 'border-white/10 bg-slate-950/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-slate-200">{entry.rank}</div>
                <div>
                  <p className="font-semibold">{entry.name}</p>
                  <p className="text-xs text-slate-500">Score {entry.score}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="text-amber-300" />
                <span className="font-semibold">{entry.score}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </main>
  )
}
