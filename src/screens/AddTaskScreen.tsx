import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { TaskForm } from '../components/tasks/TaskForm'
import { QuickAdd } from '../components/tasks/QuickAdd'
import { VoiceButton } from '../components/voice/VoiceButton'
import { useTasks } from '../hooks/useTasks'
import { useVoiceOutput } from '../hooks/useVoiceOutput'
import { IconCheck, IconMic } from '../components/ui/Icons'
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
  const isFromVoice = searchParams.get('via') === 'voice'

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
  const [showForm, setShowForm] = useState(isFromVoice || false)

  const handleSave = async () => {
    if (!draft.title.trim()) return
    setSaving(true)
    await add(draft)
    speak('Task saved.')
    navigate('/')
  }

  const handleQuickAdd = (template: TaskDraft) => {
    setDraft(template)
    setShowForm(true)
  }

  return (
    <div className="min-h-full">
      <Header title="New Task" showBack />

      <div className="px-5 py-5">
        {/* Voice prompt */}
        {!showForm && !isFromVoice && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="w-14 h-14 rounded-full bg-vine-100 flex items-center justify-center mx-auto mb-4">
                <IconMic size={24} className="text-vine-500" />
              </div>
              <p className="text-vine-700 font-bold text-base mb-1">Add by voice</p>
              <p className="text-vine-400 text-sm mb-4">Tap the mic and describe your task</p>
              <VoiceButton inline />
            </div>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-vine-200" />
              <span className="text-vine-300 text-xs font-medium">or type it out</span>
              <div className="flex-1 h-px bg-vine-200" />
            </div>
          </div>
        )}

        {/* Quick add templates */}
        {!showForm && (
          <div className="mb-6">
            <p className="text-xs font-bold text-vine-400 uppercase tracking-[0.1em] mb-3">Quick Add</p>
            <QuickAdd onSelect={handleQuickAdd} />

            <button
              onClick={() => setShowForm(true)}
              className="w-full mt-4 py-3.5 rounded-xl bg-white text-vine-600 font-semibold text-sm active:bg-vine-50"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              Custom task...
            </button>
          </div>
        )}

        {/* Full form */}
        {showForm && (
          <div className="animate-fade-in">
            <TaskForm draft={draft} onChange={setDraft} />

            <button
              onClick={handleSave}
              disabled={!draft.title.trim() || saving}
              className="w-full mt-8 py-4 rounded-2xl bg-green-600 text-white font-bold text-base flex items-center justify-center gap-2.5 active:bg-green-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ boxShadow: '0 2px 8px rgba(22,163,74,0.3)' }}
            >
              <IconCheck size={20} strokeWidth={3} />
              {saving ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
