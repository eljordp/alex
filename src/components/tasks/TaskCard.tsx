import { useNavigate } from 'react-router-dom'
import { CATEGORIES, IMPORTANCE_CONFIG, CATEGORY_COLORS } from '../../types'
import type { Task } from '../../types'

interface TaskCardProps {
  task: Task
  onComplete: (id: string) => void
  onUncomplete: (id: string) => void
}

export function TaskCard({ task, onComplete, onUncomplete }: TaskCardProps) {
  const navigate = useNavigate()
  const imp = IMPORTANCE_CONFIG[task.importance]
  const cat = CATEGORIES.find(c => c.id === task.category)
  const isCompleted = task.status === 'completed'
  const isOverdue = task.status === 'overdue'

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCompleted) {
      onUncomplete(task.id)
    } else {
      onComplete(task.id)
    }
  }

  return (
    <div
      onClick={() => navigate(`/task/${task.id}`)}
      className={`relative flex items-center gap-3 p-4 bg-white rounded-xl border transition-all active:scale-[0.98] ${
        isOverdue ? 'border-red-200 bg-red-50/50' : 'border-vine-100'
      } ${isCompleted ? 'opacity-60' : ''}`}
    >
      {/* Importance stripe */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
        style={{ backgroundColor: imp.color }}
      />

      {/* Checkbox */}
      <button
        onClick={handleCheck}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 ${
          isCompleted
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-vine-300'
        }`}
      >
        {isCompleted && <span className="text-sm">✓</span>}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-base ${isCompleted ? 'line-through text-vine-400' : 'text-vine-700'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className="text-xs px-1.5 py-0.5 rounded-md font-medium text-white"
            style={{ backgroundColor: CATEGORY_COLORS[task.category] }}
          >
            {cat?.icon} {cat?.label}
          </span>
          {task.dueTime && (
            <span className="text-xs text-vine-400">{formatTime(task.dueTime)}</span>
          )}
          {isOverdue && (
            <span className="text-xs text-red-600 font-semibold">Overdue!</span>
          )}
        </div>
      </div>

      {/* Importance badge */}
      <span
        className="text-xs px-2 py-1 rounded-full font-bold text-white flex-shrink-0"
        style={{ backgroundColor: imp.color }}
      >
        {imp.label}
      </span>
    </div>
  )
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}
