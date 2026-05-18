import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTasks, useAttackMonster } from '../../hooks/useTaskHooks'
import { TaskCard } from '../../components/shared/TaskCard'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import useUiStore from '../../store/uiStore'

export function TasksPage() {
  const { data: tasksResponse } = useTasks()
  const addToast = useUiStore((state) => state.addToast)
  const mutation = useAttackMonster()

  const activeTasks = useMemo(() => tasksResponse?.data?.filter((task) => task.status !== 'completed') ?? [], [tasksResponse])

  const handleAttack = (taskId: string) => {
    mutation.mutate(
      { id: taskId, damage: 10, source: 'manual' },
      {
        onSuccess: () => {
          addToast({ title: 'Attack landed', description: 'Monster HP updated.', variant: 'success' })
        },
        onError: () => {
          addToast({ title: 'Attack failed', description: 'Try again later.', variant: 'warning' })
        },
      }
    )
  }

  return (
    <main className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Monster ledger</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Your active task monsters</h1>
          <p className="mt-2 text-sm text-slate-500">Manage, attack, and finish each challenge with momentum.</p>
        </div>
        <Button variant="primary" size="lg">
          New monster
        </Button>
      </header>

      <Card className="grid gap-4 lg:grid-cols-2">
        {activeTasks.length === 0 ? (
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-8 text-slate-400">No active monsters right now. Create one to start your quest.</div>
        ) : (
          activeTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onAttack={handleAttack}
            />
          ))
        )}
      </Card>

      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 text-slate-300">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Task flow tips</h2>
            <p className="mt-2 text-sm text-slate-500">Focus on one boss at a time, then clear the rest with a Pomodoro strike.</p>
          </div>
          <ArrowRight className="text-slate-400" />
        </div>
      </div>
    </main>
  )
}
