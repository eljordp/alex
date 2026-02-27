import { useNavigate } from 'react-router-dom'
import { CATEGORIES, IMPORTANCE_CONFIG, CATEGORY_COLORS } from '../../types'
import type { Task } from '../../types'
import { IconCheck, IconClock, IconAlertTriangle } from '../ui/Icons'

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
      className={`relative flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-[0.98] shadow-sm ${
        isOverdue
          ? 'bg-red-50 border border-red-100'
          : 'bg-white border border-transparent'
      } ${isCompleted ? 'opacity-50' : ''}`}
    >
      {/* Importance stripe */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
        style={{ backgroundColor: imp.color }}
      />

      {/* Checkbox */}
      <button
        onClick={handleCheck}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ml-1.5 transition-all ${
          isCompleted
            ? 'bg-green-500 border-green-500'
            : `border-vine-300 hover:border-vine-400`
        }`}
      >
        {isCompleted && <IconCheck size={14} className="text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-[15px] leading-tight ${isCompleted ? 'line-through text-vine-400' : 'text-vine-700'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium text-white"
            style={{ backgroundColor: CATEGORY_COLORS[task.category] }}
          >
            {cat?.label}
          </span>
          {task.dueTime && (
            <span className="inline-flex items-center gap-1 text-[11px] text-vine-400">
              <IconClock size={11} />
              {formatTime(task.dueTime)}
            </span>
          )}
          {isOverdue && (
            <span className="inline-flex items-center gap-1 text-[11px] text-red-500 font-semibold">
              <IconAlertTriangle size={11} />
              Overdue
            </span>
          )}
        </div>
      </div>

      {/* Importance dot */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: imp.color }}
        />
        <span className="text-[9px] font-semibold text-vine-400 uppercase tracking-wide">
          {imp.label}
        </span>
      </div>
    </div>
  )
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}
