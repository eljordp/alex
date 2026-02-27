import { useNavigate } from 'react-router-dom'
import { CATEGORIES, IMPORTANCE_CONFIG, CATEGORY_COLORS } from '../../types'
import type { Task, CategoryId } from '../../types'
import { IconCheck, IconClock, IconAlertTriangle, IconCalendar, IconGrape, IconHome } from '../ui/Icons'

const CATEGORY_ICONS: Record<CategoryId, typeof IconGrape> = {
  vineyard: IconGrape,
  personal: IconHome,
  scheduling: IconCalendar,
}

interface TaskCardProps {
  task: Task
  onComplete: (id: string) => void
  onUncomplete: (id: string) => void
}

export function TaskCard({ task, onComplete, onUncomplete }: TaskCardProps) {
  const navigate = useNavigate()
  const imp = IMPORTANCE_CONFIG[task.importance]
  const cat = CATEGORIES.find(c => c.id === task.category)
  const CatIcon = CATEGORY_ICONS[task.category]
  const isCompleted = task.status === 'completed'
  const isOverdue = task.status === 'overdue'
  const dueDateLabel = getDueDateLabel(task.dueDate)

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCompleted) onUncomplete(task.id)
    else onComplete(task.id)
  }

  return (
    <div
      onClick={() => navigate(`/task/${task.id}`)}
      className={`relative bg-white rounded-2xl overflow-hidden transition-all active:scale-[0.98] ${
        isOverdue ? 'ring-1 ring-red-200' : ''
      } ${isCompleted ? 'opacity-40' : ''}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      {/* Priority color bar */}
      <div className="h-[3px]" style={{ backgroundColor: imp.color }} />

      <div className="flex items-start gap-3.5 px-4 py-4">
        {/* Checkbox */}
        <button
          onClick={handleCheck}
          className={`w-7 h-7 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            isCompleted
              ? 'bg-green-500 border-green-500'
              : 'border-vine-300 hover:border-vine-400'
          }`}
        >
          {isCompleted && <IconCheck size={14} className="text-white" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-[15px] leading-snug ${
            isCompleted ? 'line-through text-vine-400' : 'text-vine-800'
          }`}>
            {task.title}
          </p>

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 mt-2.5">
            {/* Category chip */}
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded flex items-center justify-center"
                style={{ backgroundColor: CATEGORY_COLORS[task.category] + '18' }}
              >
                <CatIcon size={11} style={{ color: CATEGORY_COLORS[task.category] }} />
              </div>
              <span className="text-xs text-vine-500 font-medium">{cat?.label}</span>
            </div>

            {/* Due date */}
            <div className={`flex items-center gap-1 text-xs font-medium ${
              isOverdue ? 'text-red-500' : 'text-vine-400'
            }`}>
              {isOverdue ? <IconAlertTriangle size={12} /> : <IconCalendar size={12} />}
              <span>{isOverdue ? `Overdue · ${dueDateLabel}` : dueDateLabel}</span>
            </div>

            {/* Time */}
            {task.dueTime && (
              <div className="flex items-center gap-1 text-xs text-vine-400">
                <IconClock size={12} />
                <span>{formatTime(task.dueTime)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Priority badge */}
        <div
          className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white flex-shrink-0 mt-0.5"
          style={{ backgroundColor: imp.color }}
        >
          {imp.label}
        </div>
      </div>
    </div>
  )
}

function getDueDateLabel(iso: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(iso + 'T00:00:00')
  const diffMs = date.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`
  if (diffDays <= 7) return `In ${diffDays} days`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}
