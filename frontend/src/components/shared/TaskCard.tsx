import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { Task } from '../../types'
import { Button } from '../ui/Button'
import clsx from '../../utils/clsx'

interface TaskCardProps {
  task: Task
  onAttack: (id: number) => void
}

const difficultyStyles = {
  easy: 'bg-emerald-500/12 text-emerald-200',
  medium: 'bg-amber-500/12 text-amber-200',
  hard: 'bg-orange-500/12 text-orange-200',
  boss: 'bg-fuchsia-500/12 text-fuchsia-200',
}

export function TaskCard({ task, onAttack }: TaskCardProps) {
  const hpProgress = Math.max(0, Math.round((task.hp / task.max_hp) * 100))

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      className="group rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5 shadow-soft backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-400">
            <ShieldCheck size={14} />
            {task.difficulty}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white">{task.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{task.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2 text-right text-xs uppercase tracking-[0.24em] text-slate-500">
          <span>{task.cheers} cheers</span>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">Priority {task.priority}</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Monster HP</span>
          <span>{task.hp}/{task.max_hp}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            initial={false}
            animate={{ width: `${hpProgress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-xp"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className={clsx(
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
            difficultyStyles[task.difficulty],
          )}>
            <Sparkles size={14} />
            +{task.xp_reward} XP
          </div>
          <Button variant="secondary" size="sm" onClick={() => onAttack(task.id)}>
            Attack
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
