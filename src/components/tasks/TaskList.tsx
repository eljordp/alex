import { TaskCard } from './TaskCard'
import { IconGrape, IconMic } from '../ui/Icons'
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
      <div className="flex flex-col items-center justify-center py-24 px-8">
        <div className="w-20 h-20 rounded-2xl bg-vine-100/80 flex items-center justify-center mb-5">
          <IconGrape size={36} className="text-vine-300" />
        </div>
        <p className="text-vine-500 text-center text-base font-medium mb-1">No tasks here</p>
        <p className="text-vine-300 text-center text-sm leading-relaxed mb-6">
          {emptyMessage || 'Your task list is empty.'}
        </p>
        <div className="flex items-center gap-2 text-vine-400 text-xs">
          <IconMic size={14} />
          <span>Tap the + button or use voice to add a task</span>
        </div>
      </div>
    )
  }

  const overdue = tasks.filter(t => t.status === 'overdue')
  const pending = tasks.filter(t => t.status === 'pending')
  const completed = tasks.filter(t => t.status === 'completed')

  return (
    <div className="px-5 space-y-6 pb-6">
      {overdue.length > 0 && (
        <Section label={`Overdue (${overdue.length})`} tasks={overdue} onComplete={onComplete} onUncomplete={onUncomplete} />
      )}
      {pending.length > 0 && (
        <Section label={`Upcoming (${pending.length})`} tasks={pending} onComplete={onComplete} onUncomplete={onUncomplete} />
      )}
      {completed.length > 0 && (
        <Section label={`Done (${completed.length})`} tasks={completed} onComplete={onComplete} onUncomplete={onUncomplete} />
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
      <p className="text-[11px] font-bold text-vine-400 uppercase tracking-[0.1em] mb-3">{label}</p>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onComplete={onComplete} onUncomplete={onUncomplete} />
        ))}
      </div>
    </div>
  )
}
