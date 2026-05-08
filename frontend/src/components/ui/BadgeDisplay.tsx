import type { BadgeRarity } from '../../types'
import clsx from '../../utils/clsx'

interface BadgeDisplayProps {
  name: string
  rarity: BadgeRarity
  iconUrl?: string
  size?: 'sm' | 'md' | 'lg'
  locked?: boolean
}

const rarityColors = {
  common: 'border-slate-500 bg-slate-500/12 text-slate-200',
  rare: 'border-blue-500 bg-blue-500/12 text-blue-200',
  epic: 'border-purple-500 bg-purple-500/12 text-purple-200',
  legendary: 'border-yellow-500 bg-yellow-500/12 text-yellow-200',
}

const rarityGlows = {
  common: 'group-hover:shadow-slate-500/50',
  rare: 'group-hover:shadow-blue-500/50',
  epic: 'group-hover:shadow-purple-500/50',
  legendary: 'group-hover:shadow-yellow-500/50',
}

const sizeClasses = {
  sm: 'h-12 w-12 text-xs',
  md: 'h-16 w-16 text-sm',
  lg: 'h-24 w-24 text-base',
}

export function BadgeDisplay({
  name,
  rarity,
  iconUrl,
  size = 'md',
  locked = false,
}: BadgeDisplayProps) {
  return (
    <div className="group flex flex-col items-center gap-2">
      <div
        className={clsx(
          'flex items-center justify-center rounded-2xl border transition-all',
          sizeClasses[size],
          rarityColors[rarity],
          !locked && rarityGlows[rarity],
          locked && 'opacity-50',
        )}
      >
        {iconUrl ? (
          <img src={iconUrl} alt={name} className="h-full w-full object-cover rounded-lg" />
        ) : (
          <span className="text-2xl">⭐</span>
        )}
      </div>
      <span className="text-center text-xs font-semibold text-slate-300">{name}</span>
    </div>
  )
}
