import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import type { LeaderboardEntry } from '../../types'
import { Button } from '../../components/ui/Button'

const board: LeaderboardEntry[] = [
  { user_id: '1', user: { id: '1', name: 'Ava', email: 'ava@test.com', avatar_url: '', level: 15, xp: 9260, next_level_xp: 10000, streak: 5, total_streak_days: 10, role: 'user', theme: 'dark', created_at: '', updated_at: '' }, rank: 1, score: 9260, level: 15, xp: 9260, is_current_user: false },
  { user_id: '2', user: { id: '2', name: 'Milo', email: 'milo@test.com', avatar_url: '', level: 14, xp: 8790, next_level_xp: 10000, streak: 4, total_streak_days: 8, role: 'user', theme: 'dark', created_at: '', updated_at: '' }, rank: 2, score: 8790, level: 14, xp: 8790, is_current_user: false },
  { user_id: '3', user: { id: '3', name: 'Luna', email: 'luna@test.com', avatar_url: '', level: 13, xp: 8180, next_level_xp: 10000, streak: 8, total_streak_days: 15, role: 'user', theme: 'dark', created_at: '', updated_at: '' }, rank: 3, score: 8180, level: 13, xp: 8180, is_current_user: true },
  { user_id: '4', user: { id: '4', name: 'Zane', email: 'zane@test.com', avatar_url: '', level: 12, xp: 7250, next_level_xp: 10000, streak: 3, total_streak_days: 6, role: 'user', theme: 'dark', created_at: '', updated_at: '' }, rank: 4, score: 7250, level: 12, xp: 7250, is_current_user: false },
  { user_id: '5', user: { id: '5', name: 'Nova', email: 'nova@test.com', avatar_url: '', level: 11, xp: 6890, next_level_xp: 10000, streak: 2, total_streak_days: 4, role: 'user', theme: 'dark', created_at: '', updated_at: '' }, rank: 5, score: 6890, level: 11, xp: 6890, is_current_user: false },
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
              key={entry.user_id}
              className={`flex items-center justify-between gap-4 rounded-3xl border p-5 transition ${
                entry.is_current_user ? 'border-primary bg-primary/10 text-white' : 'border-white/10 bg-slate-950/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-slate-200">{entry.rank}</div>
                <div>
                  <p className="font-semibold">{entry.user.name}</p>
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
