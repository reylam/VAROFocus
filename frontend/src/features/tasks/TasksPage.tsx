import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTasks, useAttackMonster } from '../../hooks/useTaskHooks'
import { TaskCard } from '../../components/shared/TaskCard'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import useUiStore from '../../store/uiStore'
import useTaskStore from '../../store/taskStore'

export function TasksPage() {
  const { data: tasksResponse } = useTasks()
  const addToast = useUiStore((state) => state.addToast)
  const mutation = useAttackMonster()
  const setAttacking = useTaskStore((s) => s.setAttacking)

  const activeTasks = useMemo(() => tasksResponse?.data?.filter((task) => task.status !== 'completed') ?? [], [tasksResponse])

  const handleAttack = (taskId: string) => {
    // start local attack animation
    setAttacking(taskId)
    mutation.mutate(
      { id: taskId, damage: 10, source: 'manual' },
      {
        onSuccess: () => {
          addToast({ title: 'Attack landed', description: 'Monster HP updated.', variant: 'success' })
        },
        onError: () => {
          addToast({ title: 'Attack failed', description: 'Try again later.', variant: 'warning' })
        },
        onSettled: () => {
          // clear animation state
          setAttacking(null)
        },
      }
    )
  }

  return (
    <main className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-[#17937f]">Monster ledger</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Your active task monsters</h1>
          <p className="mt-2 text-sm text-slate-500">Manage, attack, and finish each challenge with momentum.</p>
        </div>
        <Button variant="primary" size="lg">
          New monster
        </Button>
      </header>

      <Card className="grid gap-4 lg:grid-cols-2">
        {activeTasks.length === 0 ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-8 text-slate-600">No active monsters right now. Create one to start your quest.</div>
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

      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Task flow tips</h2>
            <p className="mt-2 text-sm text-slate-500">Focus on one boss at a time, then clear the rest with a Pomodoro strike.</p>
          </div>
          <ArrowRight className="text-slate-400" />
        </div>
      </div>
    </main>
  )
}
