import { CATEGORIES, IMPORTANCE_CONFIG } from '../../types'
import type { CategoryId, Importance } from '../../types'
import type { TaskDraft } from '../../screens/AddTaskScreen'

interface TaskFormProps {
  draft: TaskDraft
  onChange: (draft: TaskDraft) => void
}

const REMINDER_OPTIONS = [
  { value: 0, label: 'At time' },
  { value: 15, label: '15 min before' },
  { value: 30, label: '30 min before' },
  { value: 60, label: '1 hour before' },
  { value: 1440, label: '1 day before' },
]

export function TaskForm({ draft, onChange }: TaskFormProps) {
  const set = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) => {
    onChange({ ...draft, [key]: value })
  }

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-vine-500 mb-1.5">What needs to be done?</label>
        <input
          type="text"
          value={draft.title}
          onChange={e => set('title', e.target.value)}
          placeholder="e.g. Spray block A"
          className="w-full px-4 py-3 rounded-xl bg-white border border-vine-200 text-vine-700 text-lg focus:outline-none focus:ring-2 focus:ring-vine-300"
          autoFocus
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-vine-500 mb-1.5">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => set('category', cat.id as CategoryId)}
              className={`py-3 rounded-xl text-center font-medium transition-all ${
                draft.category === cat.id
                  ? 'bg-vine-600 text-white scale-105 shadow-md'
                  : 'bg-white border border-vine-200 text-vine-500'
              }`}
            >
              <span className="text-xl block">{cat.icon}</span>
              <span className="text-xs">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Importance */}
      <div>
        <label className="block text-sm font-medium text-vine-500 mb-1.5">Priority</label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(IMPORTANCE_CONFIG) as [Importance, typeof IMPORTANCE_CONFIG[Importance]][]).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => set('importance', key)}
              className={`py-3 rounded-xl text-center font-medium text-sm transition-all ${
                draft.importance === key
                  ? 'text-white scale-105 shadow-md'
                  : 'bg-white border border-vine-200 text-vine-500'
              }`}
              style={draft.importance === key ? { backgroundColor: config.color } : undefined}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-vine-500 mb-1.5">Due Date</label>
        <input
          type="date"
          value={draft.dueDate}
          onChange={e => set('dueDate', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white border border-vine-200 text-vine-700 text-lg focus:outline-none focus:ring-2 focus:ring-vine-300"
        />
      </div>

      {/* Due Time */}
      <div>
        <label className="block text-sm font-medium text-vine-500 mb-1.5">Time (optional)</label>
        <div className="flex gap-2">
          <input
            type="time"
            value={draft.dueTime || ''}
            onChange={e => set('dueTime', e.target.value || null)}
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-vine-200 text-vine-700 text-lg focus:outline-none focus:ring-2 focus:ring-vine-300"
          />
          {draft.dueTime && (
            <button
              type="button"
              onClick={() => set('dueTime', null)}
              className="px-4 py-3 rounded-xl bg-vine-100 text-vine-500 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Reminder */}
      <div>
        <label className="block text-sm font-medium text-vine-500 mb-1.5">Reminder</label>
        <select
          value={draft.reminderMinutesBefore}
          onChange={e => set('reminderMinutesBefore', parseInt(e.target.value))}
          className="w-full px-4 py-3 rounded-xl bg-white border border-vine-200 text-vine-700 text-lg focus:outline-none focus:ring-2 focus:ring-vine-300"
        >
          {REMINDER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-vine-500 mb-1.5">Notes (optional)</label>
        <textarea
          value={draft.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Any extra details..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white border border-vine-200 text-vine-700 text-base focus:outline-none focus:ring-2 focus:ring-vine-300 resize-none"
        />
      </div>
    </div>
  )
}
