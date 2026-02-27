import { TaskCard } from './TaskCard'
import type { Task } from '../../types'

interface TaskListProps {
  tasks: Task[]
  onComplete: (id: string) => void
  onUncomplete: (id: string) => void
  emptyMessage?: string
}

export function TaskList({ tasks, onComplete, onUncomplete, emptyMessage }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <span className="text-5xl mb-4">🍇</span>
        <p className="text-vine-400 text-center text-base">
          {emptyMessage || 'No tasks yet.'}
        </p>
      </div>
    )
  }

  const overdue = tasks.filter(t => t.status === 'overdue')
  const pending = tasks.filter(t => t.status === 'pending')
  const completed = tasks.filter(t => t.status === 'completed')

  return (
    <div className="px-4 space-y-3 pb-4">
      {overdue.length > 0 && (
        <Section label="Overdue" tasks={overdue} onComplete={onComplete} onUncomplete={onUncomplete} />
      )}
      {pending.length > 0 && (
        <Section label="Pending" tasks={pending} onComplete={onComplete} onUncomplete={onUncomplete} />
      )}
      {completed.length > 0 && (
        <Section label="Completed" tasks={completed} onComplete={onComplete} onUncomplete={onUncomplete} />
      )}
    </div>
  )
}

function Section({ label, tasks, onComplete, onUncomplete }: {
  label: string
  tasks: Task[]
  onComplete: (id: string) => void
  onUncomplete: (id: string) => void
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-vine-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onComplete={onComplete} onUncomplete={onUncomplete} />
        ))}
      </div>
    </div>
  )
}
