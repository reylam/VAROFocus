import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useLeaderboardEntries } from '../../hooks/useLeaderboardHooks'
import type { LeaderboardMode } from '../../hooks/useLeaderboardHooks'

const modeOptions: LeaderboardMode[] = ['Weekly', 'Monthly', 'Global']

export function LeaderboardPage() {
  const [mode, setMode] = useState<LeaderboardMode>('Weekly')
  const { data: entries, isLoading } = useLeaderboardEntries(mode, 10)

  return (
    <main className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-600">Leaderboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Top achievers</h1>
          <p className="mt-2 text-sm text-slate-600">Track performance across weekly, monthly, and global leaderboards.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {modeOptions.map((option) => (
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

      <Card className="space-y-4 bg-white text-slate-900">
        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">Loading leaderboard...</div>
        ) : !entries?.length ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">No leaderboard entries available.</div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => {
              const isTopRank = entry.rank === 1
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between gap-4 rounded-3xl border p-5 transition ${
                    isTopRank ? 'border-[#17937f] bg-[#e6f7f3] text-slate-900' : 'border-slate-200 bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">{entry.rank}</div>
                    <div>
                      <p className="font-semibold text-slate-900">{entry.user?.username ?? `Player ${entry.rank}`}</p>
                      <p className="text-xs text-slate-500">Score {entry.score}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#f99f1e]">
                    <Trophy className="h-4 w-4" />
                    <span className="font-semibold text-slate-900">{entry.score}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </main>
  )
}
