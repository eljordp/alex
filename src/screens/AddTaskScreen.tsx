import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { TaskForm } from '../components/tasks/TaskForm'
import { QuickAdd } from '../components/tasks/QuickAdd'
import { useTasks } from '../hooks/useTasks'
import { useVoiceOutput } from '../hooks/useVoiceOutput'
import { IconCheck } from '../components/ui/Icons'
import type { CategoryId, Importance } from '../types'

export interface TaskDraft {
  title: string
  notes: string
  category: CategoryId
  importance: Importance
  dueDate: string
  dueTime: string | null
  reminderMinutesBefore: number
  createdVia: 'voice' | 'manual' | 'quick-add'
}

const today = () => new Date().toISOString().split('T')[0]

export function AddTaskScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { add } = useTasks()
  const { speak } = useVoiceOutput()

  const [draft, setDraft] = useState<TaskDraft>({
    title: searchParams.get('title') || '',
    notes: '',
    category: (searchParams.get('category') as CategoryId) || 'vineyard',
    importance: (searchParams.get('importance') as Importance) || 'medium',
    dueDate: searchParams.get('dueDate') || today(),
    dueTime: searchParams.get('dueTime') || null,
    reminderMinutesBefore: 30,
    createdVia: (searchParams.get('via') as TaskDraft['createdVia']) || 'manual',
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!draft.title.trim()) return
    setSaving(true)
    await add(draft)
    speak('Task saved.')
    navigate('/')
  }

  const handleQuickAdd = (template: TaskDraft) => {
    setDraft(template)
  }

  return (
    <div className="min-h-full">
      <Header title="New Task" showBack />

      <div className="px-5 py-5">
        <TaskForm draft={draft} onChange={setDraft} />

        <button
          onClick={handleSave}
          disabled={!draft.title.trim() || saving}
          className="w-full mt-8 py-4 rounded-xl bg-green-600 text-white font-semibold text-base flex items-center justify-center gap-2 active:bg-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <IconCheck size={18} strokeWidth={3} />
          {saving ? 'Saving...' : 'Save Task'}
        </button>

        <div className="mt-10">
          <p className="text-xs font-semibold text-vine-400 uppercase tracking-widest mb-3">Quick Add</p>
          <QuickAdd onSelect={handleQuickAdd} />
        </div>
      </div>
    </div>
  )
}
