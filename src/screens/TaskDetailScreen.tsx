import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { TaskForm } from '../components/tasks/TaskForm'
import { useTasks } from '../hooks/useTasks'
import { useVoiceOutput } from '../hooks/useVoiceOutput'
import { CATEGORIES, IMPORTANCE_CONFIG } from '../types'
import type { Task } from '../types'
import type { TaskDraft } from './AddTaskScreen'

export function TaskDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, update, remove, complete, uncomplete, loading } = useTasks()
  const { speak, isSpeaking, stop } = useVoiceOutput()
  const [editing, setEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const task = tasks.find(t => t.id === id)

  const [draft, setDraft] = useState<TaskDraft | null>(null)

  useEffect(() => {
    if (task && !draft) {
      setDraft({
        title: task.title,
        notes: task.notes,
        category: task.category,
        importance: task.importance,
        dueDate: task.dueDate,
        dueTime: task.dueTime,
        reminderMinutesBefore: task.reminderMinutesBefore,
        createdVia: task.createdVia,
      })
    }
  }, [task, draft])

  if (loading) {
    return <div className="flex items-center justify-center h-full"><p className="text-vine-400">Loading...</p></div>
  }

  if (!task || !draft) {
    return (
      <div className="min-h-full">
        <Header title="Task" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-vine-400">Task not found.</p>
        </div>
      </div>
    )
  }

  const readAloud = () => {
    if (isSpeaking) { stop(); return }
    const cat = CATEGORIES.find(c => c.id === task.category)?.label || task.category
    const imp = IMPORTANCE_CONFIG[task.importance].label
    speak(`${task.title}. Category: ${cat}. Priority: ${imp}. Due: ${formatDate(task.dueDate)}${task.dueTime ? ` at ${formatTime(task.dueTime)}` : ''}. ${task.notes ? `Notes: ${task.notes}` : ''}`)
  }

  const handleSave = async () => {
    await update({ ...task, ...draft } as Task)
    setEditing(false)
  }

  const handleDelete = async () => {
    await remove(task.id)
    navigate('/')
  }

  const handleComplete = async () => {
    if (task.status === 'completed') {
      await uncomplete(task.id)
    } else {
      await complete(task.id)
    }
  }

  const cat = CATEGORIES.find(c => c.id === task.category)
  const imp = IMPORTANCE_CONFIG[task.importance]

  return (
    <div className="min-h-full bg-vine-50">
      <Header
        title="Task Details"
        showBack
        rightAction={
          <button
            onClick={() => setEditing(!editing)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-vine-600 hover:bg-vine-100"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        }
      />

      {editing ? (
        <div className="px-4 py-4">
          <TaskForm draft={draft} onChange={setDraft} />
          <button
            onClick={handleSave}
            className="w-full mt-4 py-4 rounded-xl bg-vine-600 text-white font-bold text-lg active:bg-vine-700"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-vine-100">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-xl font-bold text-vine-700 flex-1">{task.title}</h2>
              <span
                className="ml-2 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: imp.color }}
              >
                {imp.label}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{cat?.icon}</span>
              <span className="text-sm text-vine-500">{cat?.label}</span>
              <span className="text-vine-300">·</span>
              <span className="text-sm text-vine-500">{formatDate(task.dueDate)}</span>
              {task.dueTime && (
                <>
                  <span className="text-vine-300">·</span>
                  <span className="text-sm text-vine-500">{formatTime(task.dueTime)}</span>
                </>
              )}
            </div>

            {task.notes && (
              <p className="text-vine-500 text-sm bg-vine-50 rounded-xl p-3">{task.notes}</p>
            )}

            <p className="text-xs text-vine-300 mt-3">
              Created {new Date(task.createdAt).toLocaleDateString()} via {task.createdVia}
            </p>
          </div>

          <button
            onClick={readAloud}
            className="w-full py-3 rounded-xl bg-vine-100 text-vine-600 font-medium text-base active:bg-vine-200"
          >
            {isSpeaking ? '⏹ Stop' : '🔊 Read Aloud'}
          </button>

          <button
            onClick={handleComplete}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
              task.status === 'completed'
                ? 'bg-vine-200 text-vine-600 active:bg-vine-300'
                : 'bg-green-600 text-white active:bg-green-700'
            }`}
          >
            {task.status === 'completed' ? '↩ Mark Incomplete' : '✓ Mark Complete'}
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-medium text-base active:bg-red-100"
          >
            Delete Task
          </button>

          {showDelete && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                <p className="text-lg font-bold text-vine-700 mb-2">Delete this task?</p>
                <p className="text-vine-500 mb-6">"{task.title}" will be permanently removed.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDelete(false)}
                    className="flex-1 py-3 rounded-xl bg-vine-100 text-vine-600 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string): string {
  const date = new Date(iso + 'T00:00:00')
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (iso === today.toISOString().split('T')[0]) return 'Today'
  if (iso === tomorrow.toISOString().split('T')[0]) return 'Tomorrow'

  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}
