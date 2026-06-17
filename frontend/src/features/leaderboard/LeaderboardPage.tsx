import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from 'framer-motion'
import {
  Crown,
  Flame,
  Medal,
  Minus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { useLeaderboardEntries } from '../../hooks/useLeaderboardHooks'
import type { LeaderboardMode } from '../../hooks/useLeaderboardHooks'

/* ----------------------------------------------------------------------- */
/* Types                                                                    */
/* ----------------------------------------------------------------------- */

type TrendDirection = 'up' | 'down' | 'stable'

interface LeaderboardUser {
  id?: string | number
  username: string
  avatarUrl?: string
  level?: number
}

/**
 * Structural shape the UI relies on. Your `useLeaderboardEntries` hook can
 * return more fields than this — only the ones below are read.
 * `previousRank`, `trend`, and `badges` are optional: if the API doesn't
 * provide them yet, everything still renders correctly with sane defaults.
 */
interface LeaderboardEntry {
  id: string | number
  rank: number
  score: number
  user?: LeaderboardUser
  previousRank?: number
  trend?: TrendDirection
  badges?: string[]
}

/* ----------------------------------------------------------------------- */
/* Small pure helpers                                                       */
/* ----------------------------------------------------------------------- */

function resolveTrend(entry: Pick<LeaderboardEntry, 'rank' | 'previousRank' | 'trend'>): TrendDirection {
  if (entry.trend) return entry.trend
  if (typeof entry.previousRank === 'number') {
    if (entry.previousRank > entry.rank) return 'up'
    if (entry.previousRank < entry.rank) return 'down'
  }
  return 'stable'
}

function getInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return initials || '?'
}

const BADGE_META: Record<string, { label: string; Icon: LucideIcon; className: string }> = {
  champion: {
    label: 'Champion',
    Icon: Crown,
    className: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300',
  },
  streak: {
    label: 'On a streak',
    Icon: Flame,
    className: 'bg-rose-50 text-rose-500 dark:bg-rose-400/10 dark:text-rose-300',
  },
  rising: {
    label: 'Rising star',
    Icon: Sparkles,
    className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300',
  },
  consistent: {
    label: 'Consistent',
    Icon: ShieldCheck,
    className: 'bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300',
  },
}

/**
 * Derives which badges to show for an entry. Explicit `badges` from the API
 * are kept as-is; rank #1 always earns "champion" so the podium never looks
 * empty even before any badge data exists upstream.
 */
function resolveBadges(entry: { rank: number; badges?: string[] }, max = 2) {
  const badges = new Set(entry.badges ?? [])
  if (entry.rank === 1) badges.add('champion')
  return Array.from(badges).slice(0, max)
}

/* ----------------------------------------------------------------------- */
/* RankBadge                                                                 */
/* ----------------------------------------------------------------------- */

const RANK_BADGE_SIZE: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}

function RankBadge({ rank, size = 'md' }: { rank: number; size?: 'sm' | 'md' | 'lg' }) {
  const base = `flex shrink-0 items-center justify-center rounded-2xl font-bold ring-1 ${RANK_BADGE_SIZE[size]}`

  if (rank === 1) {
    return (
      <div className={`${base} bg-amber-50 text-amber-500 ring-amber-300/60 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30`}>
        <Crown className="h-1/2 w-1/2" strokeWidth={2.25} />
      </div>
    )
  }

  if (rank === 2) {
    return (
      <div className={`${base} bg-slate-100 text-slate-500 ring-slate-300/60 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/30`}>
        <Medal className="h-1/2 w-1/2" strokeWidth={2.25} />
      </div>
    )
  }

  if (rank === 3) {
    return (
      <div className={`${base} bg-orange-50 text-orange-500 ring-orange-300/60 dark:bg-orange-400/10 dark:text-orange-300 dark:ring-orange-400/30`}>
        <Medal className="h-1/2 w-1/2" strokeWidth={2.25} />
      </div>
    )
  }

  return (
    <div className={`${base} bg-slate-50 text-slate-500 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:ring-slate-700`}>
      {rank}
    </div>
  )
}

/* ----------------------------------------------------------------------- */
/* TrendIndicator                                                            */
/* ----------------------------------------------------------------------- */

const TREND_CONFIG: Record<TrendDirection, { Icon: LucideIcon; className: string; label: string }> = {
  up: { Icon: TrendingUp, className: 'text-emerald-500 dark:text-emerald-400', label: 'Climbing the ranks' },
  down: { Icon: TrendingDown, className: 'text-rose-500 dark:text-rose-400', label: 'Lost ground' },
  stable: { Icon: Minus, className: 'text-slate-400 dark:text-slate-500', label: 'Holding steady' },
}

function TrendIndicator({ trend }: { trend: TrendDirection }) {
  const { Icon, className, label } = TREND_CONFIG[trend]
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${className}`} title={label}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
    </span>
  )
}

/* ----------------------------------------------------------------------- */
/* AchievementBadge                                                          */
/* ----------------------------------------------------------------------- */

function AchievementBadge({ id }: { id: string }) {
  const meta = BADGE_META[id]
  if (!meta) return null
  const { Icon } = meta

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {meta.label}
    </span>
  )
}

/* ----------------------------------------------------------------------- */
/* AnimatedNumber                                                            */
/* ----------------------------------------------------------------------- */

/**
 * Ticks a number up to its target value, like a results screen. Uses a
 * MotionValue as the child of the motion.span so the DOM text updates
 * directly on the animation frame instead of re-rendering React each tick.
 */
function AnimatedNumber({ value, className, duration = 0.8 }: { value: number; className?: string; duration?: number }) {
  const prefersReducedMotion = useReducedMotion()
  const motionValue = useMotionValue(0)
  const display = useTransform(motionValue, (latest) => Math.round(latest).toLocaleString())
  const hasMounted = useRef(false)

  useEffect(() => {
    if (prefersReducedMotion) {
      motionValue.set(value)
      return
    }

    const controls = animate(motionValue, value, {
      duration: hasMounted.current ? duration : duration * 1.2,
      ease: [0.16, 1, 0.3, 1],
    })
    hasMounted.current = true

    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReducedMotion])

  return <motion.span className={className}>{display}</motion.span>
}

/* ----------------------------------------------------------------------- */
/* PlayerCard (top-3 podium card)                                            */
/* ----------------------------------------------------------------------- */

function PlayerCard({
  entry,
  emphasis = 'secondary',
  isCurrentUser,
}: {
  entry: LeaderboardEntry
  emphasis?: 'primary' | 'secondary'
  isCurrentUser?: boolean
}) {
  const isPrimary = emphasis === 'primary'
  const badges = resolveBadges({ rank: entry.rank, badges: entry.badges })
  const username = entry.user?.username ?? `Player ${entry.rank}`
  const level = entry.user?.level

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`relative flex flex-col items-center rounded-3xl border px-6 pb-6 pt-9 text-center shadow-sm ${
        isPrimary
          ? 'border-amber-200 bg-gradient-to-b from-amber-50/80 to-white shadow-amber-100 dark:border-amber-400/25 dark:from-amber-400/[0.06] dark:to-slate-900 dark:shadow-none'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      } ${isCurrentUser ? 'ring-2 ring-[#129181]/50' : ''}`}
    >
      {isCurrentUser && (
        <span className="absolute right-4 top-4 rounded-full bg-[#129181] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          You
        </span>
      )}

      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
        <RankBadge rank={entry.rank} size={isPrimary ? 'lg' : 'md'} />
      </div>

      <div
        className={`mt-3 flex items-center justify-center overflow-hidden rounded-full font-semibold text-white ${
          isPrimary ? 'h-20 w-20 bg-[#129181] text-2xl' : 'h-16 w-16 bg-slate-400 text-lg dark:bg-slate-700'
        }`}
      >
        {entry.user?.avatarUrl ? (
          <img src={entry.user.avatarUrl} alt={username} className="h-full w-full object-cover" />
        ) : (
          getInitials(username)
        )}
      </div>

      <p className={`mt-4 max-w-full truncate font-semibold text-slate-900 dark:text-slate-50 ${isPrimary ? 'text-lg' : 'text-base'}`}>
        {username}
      </p>

      {typeof level === 'number' && (
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Level {level}
        </p>
      )}

      <div className="mt-3 flex items-center gap-1.5 text-[#129181] dark:text-emerald-300">
        <Trophy className="h-4 w-4" strokeWidth={2.25} />
        <AnimatedNumber
          value={entry.score}
          className={`font-bold tabular-nums text-slate-900 dark:text-slate-50 ${isPrimary ? 'text-2xl' : 'text-lg'}`}
        />
      </div>

      {badges.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {badges.map((badge) => (
            <AchievementBadge key={badge} id={badge} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ----------------------------------------------------------------------- */
/* TopThreePodium                                                            */
/* ----------------------------------------------------------------------- */

const podiumContainerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const podiumItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

/**
 * Podium for ranks 1–3. Visual order on larger screens is 2 / 1 / 3 (the
 * classic podium read), with rank 1 sized up and the other two pushed down
 * slightly so it reads as physically elevated, not just bigger.
 */
function TopThreePodium({ entries, currentUsername }: { entries: LeaderboardEntry[]; currentUsername?: string }) {
  const [first, second, third] = entries
  if (!first) return null

  const isCurrent = (entry: LeaderboardEntry) => Boolean(currentUsername) && entry.user?.username === currentUsername

  return (
    <motion.div
      variants={podiumContainerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3 sm:gap-6"
    >
      {second && (
        <motion.div variants={podiumItemVariants} className="order-2 sm:order-1 sm:translate-y-4">
          <PlayerCard entry={second} isCurrentUser={isCurrent(second)} />
        </motion.div>
      )}

      <motion.div variants={podiumItemVariants} className="order-1 sm:order-2">
        <PlayerCard entry={first} emphasis="primary" isCurrentUser={isCurrent(first)} />
      </motion.div>

      {third && (
        <motion.div variants={podiumItemVariants} className="order-3 sm:order-3 sm:translate-y-7">
          <PlayerCard entry={third} isCurrentUser={isCurrent(third)} />
        </motion.div>
      )}
    </motion.div>
  )
}

/* ----------------------------------------------------------------------- */
/* LeaderboardRow (rank 4+)                                                  */
/* ----------------------------------------------------------------------- */

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

function LeaderboardRow({
  entry,
  maxScore,
  isCurrentUser,
}: {
  entry: LeaderboardEntry
  maxScore: number
  isCurrentUser?: boolean
}) {
  const trend = resolveTrend(entry)
  const badges = resolveBadges({ rank: entry.rank, badges: entry.badges })
  const username = entry.user?.username ?? `Player ${entry.rank}`
  const level = entry.user?.level
  const fillPercent = maxScore > 0 ? Math.min(100, Math.max(4, Math.round((entry.score / maxScore) * 100))) : 0

  return (
    <motion.div
      layout="position"
      variants={rowVariants}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className={`grid grid-cols-[auto_auto_1fr_auto] items-center gap-4 rounded-2xl border p-4 transition-shadow sm:gap-5 sm:p-5 ${
        isCurrentUser
          ? 'border-[#129181]/40 bg-[#129181]/[0.06] dark:border-emerald-400/30 dark:bg-emerald-400/[0.06]'
          : 'border-slate-200 bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30'
      }`}
    >
      <RankBadge rank={entry.rank} size="sm" />

      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {entry.user?.avatarUrl ? (
          <img src={entry.user.avatarUrl} alt={username} className="h-full w-full object-cover" />
        ) : (
          getInitials(username)
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-slate-900 dark:text-slate-50">{username}</p>
          {isCurrentUser && (
            <span className="rounded-full bg-[#129181] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              You
            </span>
          )}
        </div>

        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          {typeof level === 'number' && <span>Level {level}</span>}
          {badges.length > 0 && (
            <span className="hidden items-center gap-1.5 sm:flex">
              {badges.map((badge) => (
                <AchievementBadge key={badge} id={badge} />
              ))}
            </span>
          )}
        </div>

        <div className="mt-2 hidden h-1.5 w-full max-w-[180px] overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 sm:block">
          <motion.div
            className="h-full rounded-full bg-[#129181] dark:bg-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${fillPercent}%` }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <AnimatedNumber value={entry.score} className="font-bold tabular-nums text-slate-900 dark:text-slate-50" />
        <TrendIndicator trend={trend} />
      </div>
    </motion.div>
  )
}

/* ----------------------------------------------------------------------- */
/* LeaderboardSkeleton (loading state)                                      */
/* ----------------------------------------------------------------------- */

function LeaderboardSkeleton() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3 sm:gap-6">
        {[{ lift: false }, { lift: true }, { lift: true }].map((card, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 ${
              card.lift ? 'sm:translate-y-5' : ''
            } ${idx === 0 ? 'order-1 sm:order-2' : idx === 1 ? 'order-2 sm:order-1' : 'order-3'}`}
          >
            <div className="h-16 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-4 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-3 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-2.5 w-20 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-4 w-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------- */
/* EmptyState                                                                */
/* ----------------------------------------------------------------------- */

function EmptyState({ query }: { query?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/40"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <Trophy className="h-6 w-6" strokeWidth={2} />
      </div>
      <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">
        {query ? `No players match "${query}"` : 'No rankings yet'}
      </p>
      <p className="mt-1 max-w-xs text-sm text-slate-400 dark:text-slate-500">
        {query ? 'Try a different name or clear the search.' : 'Once players start scoring, they will show up here.'}
      </p>
    </motion.div>
  )
}

/* ----------------------------------------------------------------------- */
/* ModeTabs                                                                  */
/* ----------------------------------------------------------------------- */

/**
 * Segmented control with a sliding active pill (shared layoutId), instead of
 * three separate buttons fading in and out independently.
 */
function ModeTabs({
  options,
  value,
  onChange,
}: {
  options: LeaderboardMode[]
  value: LeaderboardMode
  onChange: (mode: LeaderboardMode) => void
}) {
  return (
    <div className="inline-flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/60" role="tablist">
      {options.map((option) => {
        const isActive = option === value
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option)}
            className={`relative rounded-xl px-4 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#129181]/50 ${
              isActive ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="leaderboard-mode-pill"
                className="absolute inset-0 rounded-xl bg-[#129181]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ----------------------------------------------------------------------- */
/* LeaderboardPage                                                           */
/* ----------------------------------------------------------------------- */

const modeOptions: LeaderboardMode[] = ['Weekly', 'Monthly', 'Global']

interface LeaderboardPageProps {
  /** Username of the signed-in player, used to highlight their own row/card. */
  currentUsername?: string
}

export function LeaderboardPage({ currentUsername }: LeaderboardPageProps = {}) {
  const [mode, setMode] = useState<LeaderboardMode>('Weekly')
  const [query, setQuery] = useState('')
  const { data: entries, isLoading } = useLeaderboardEntries(mode, 10)

  const filteredEntries = useMemo(() => {
    if (!entries) return []
    const needle = query.trim().toLowerCase()
    if (!needle) return entries
    return entries.filter((entry) => (entry.user?.username ?? '').toLowerCase().includes(needle))
  }, [entries, query])

  const isSearching = query.trim().length > 0
  const topThree = useMemo(() => filteredEntries.filter((entry) => entry.rank <= 3), [filteredEntries])
  const rest = useMemo(() => filteredEntries.filter((entry) => entry.rank > 3), [filteredEntries])
  const maxScore = entries?.[0]?.score ?? 0

  const showPodium = topThree.length > 0 && !isSearching
  const listEntries = showPodium ? rest : filteredEntries

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 pb-12"
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#129181] dark:text-emerald-400">
            Leaderboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Top achievers
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Track performance across weekly, monthly, and global leaderboards.
          </p>
        </div>

        <ModeTabs options={modeOptions} value={mode} onChange={setMode} />
      </header>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search players..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#129181] focus:ring-2 focus:ring-[#129181]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500"
        />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LeaderboardSkeleton />
          </motion.div>
        ) : filteredEntries.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState query={isSearching ? query.trim() : undefined} />
          </motion.div>
        ) : (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {showPodium && <TopThreePodium entries={topThree} currentUsername={currentUsername} />}

            {listEntries.length > 0 && (
              <div className="space-y-3">
                {showPodium && (
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    More rankings
                  </p>
                )}

                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                  className="space-y-3"
                >
                  {listEntries.map((entry) => (
                    <LeaderboardRow
                      key={entry.id}
                      entry={entry}
                      maxScore={maxScore}
                      isCurrentUser={Boolean(currentUsername) && entry.user?.username === currentUsername}
                    />
                  ))}
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}