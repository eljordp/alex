import { CATEGORIES, IMPORTANCE_CONFIG, CATEGORY_COLORS } from '../../types'
import type { CategoryId, Importance } from '../../types'
import type { TaskDraft } from '../../screens/AddTaskScreen'
import { IconGrape, IconHome, IconCalendar, IconX } from '../ui/Icons'

const CATEGORY_ICONS: Record<CategoryId, typeof IconGrape> = {
  vineyard: IconGrape,
  personal: IconHome,
  scheduling: IconCalendar,
}

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
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-vine-500 uppercase tracking-wide mb-2">Task</label>
        <input
          type="text"
          value={draft.title}
          onChange={e => set('title', e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3.5 rounded-xl bg-white border border-vine-200 text-vine-700 text-base focus:outline-none focus:ring-2 focus:ring-vine-300/50 focus:border-vine-300 placeholder:text-vine-300"
          autoFocus
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-vine-500 uppercase tracking-wide mb-2">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map(cat => {
            const CatIcon = CATEGORY_ICONS[cat.id]
            const isSelected = draft.category === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => set('category', cat.id as CategoryId)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl font-medium transition-all ${
                  isSelected
                    ? 'text-white shadow-md scale-[1.02]'
                    : 'bg-white border border-vine-200 text-vine-500 hover:border-vine-300'
                }`}
                style={isSelected ? { backgroundColor: CATEGORY_COLORS[cat.id] } : undefined}
              >
                <CatIcon size={20} className={isSelected ? 'text-white/90' : 'text-vine-400'} />
                <span className="text-xs">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Importance */}
      <div>
        <label className="block text-xs font-semibold text-vine-500 uppercase tracking-wide mb-2">Priority</label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(IMPORTANCE_CONFIG) as [Importance, typeof IMPORTANCE_CONFIG[Importance]][]).map(([key, config]) => {
            const isSelected = draft.importance === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => set('importance', key)}
                className={`py-2.5 rounded-xl text-center font-medium text-xs transition-all ${
                  isSelected
                    ? 'text-white shadow-md scale-[1.02]'
                    : 'bg-white border border-vine-200 text-vine-500 hover:border-vine-300'
                }`}
                style={isSelected ? { backgroundColor: config.color } : undefined}
              >
                <div
                  className={`w-2 h-2 rounded-full mx-auto mb-1 ${isSelected ? 'bg-white/60' : ''}`}
                  style={!isSelected ? { backgroundColor: config.color } : undefined}
                />
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-xs font-semibold text-vine-500 uppercase tracking-wide mb-2">Due Date</label>
        <input
          type="date"
          value={draft.dueDate}
          onChange={e => set('dueDate', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white border border-vine-200 text-vine-700 text-base focus:outline-none focus:ring-2 focus:ring-vine-300/50 focus:border-vine-300"
        />
      </div>

      {/* Due Time */}
      <div>
        <label className="block text-xs font-semibold text-vine-500 uppercase tracking-wide mb-2">Time (optional)</label>
        <div className="flex gap-2">
          <input
            type="time"
            value={draft.dueTime || ''}
            onChange={e => set('dueTime', e.target.value || null)}
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-vine-200 text-vine-700 text-base focus:outline-none focus:ring-2 focus:ring-vine-300/50 focus:border-vine-300"
          />
          {draft.dueTime && (
            <button
              type="button"
              onClick={() => set('dueTime', null)}
              className="w-12 h-12 rounded-xl bg-vine-100 text-vine-500 flex items-center justify-center hover:bg-vine-200"
            >
              <IconX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Reminder */}
      <div>
        <label className="block text-xs font-semibold text-vine-500 uppercase tracking-wide mb-2">Reminder</label>
        <select
          value={draft.reminderMinutesBefore}
          onChange={e => set('reminderMinutesBefore', parseInt(e.target.value))}
          className="w-full px-4 py-3 rounded-xl bg-white border border-vine-200 text-vine-700 text-base focus:outline-none focus:ring-2 focus:ring-vine-300/50 focus:border-vine-300"
        >
          {REMINDER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-vine-500 uppercase tracking-wide mb-2">Notes</label>
        <textarea
          value={draft.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Additional details..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white border border-vine-200 text-vine-700 text-sm focus:outline-none focus:ring-2 focus:ring-vine-300/50 focus:border-vine-300 resize-none placeholder:text-vine-300"
        />
      </div>
    </div>
  )
}
