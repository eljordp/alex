import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { TaskForm } from '../components/tasks/TaskForm'
import { useTasks } from '../hooks/useTasks'
import { useVoiceOutput } from '../hooks/useVoiceOutput'
import { CATEGORIES, IMPORTANCE_CONFIG, CATEGORY_COLORS } from '../types'
import type { Task, CategoryId } from '../types'
import type { TaskDraft } from './AddTaskScreen'
import {
  IconVolume, IconVolumeOff, IconCheck, IconUndo, IconTrash,
  IconEdit, IconX, IconClock, IconCalendar, IconGrape, IconHome,
} from '../components/ui/Icons'

const CATEGORY_ICONS: Record<CategoryId, typeof IconGrape> = {
  vineyard: IconGrape,
  personal: IconHome,
  scheduling: IconCalendar,
}

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
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-vine-300 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!task || !draft) {
    return (
      <div className="min-h-full">
        <Header title="Task" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-vine-400 text-sm">Task not found.</p>
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
  const CatIcon = CATEGORY_ICONS[task.category]

  return (
    <div className="min-h-full">
      <Header
        title="Task Details"
        showBack
        rightAction={
          <button
            onClick={() => setEditing(!editing)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-vine-100 text-vine-500"
          >
            {editing ? <IconX size={18} /> : <IconEdit size={18} />}
          </button>
        }
      />

      {editing ? (
        <div className="px-5 py-5">
          <TaskForm draft={draft} onChange={setDraft} />
          <button
            onClick={handleSave}
            className="w-full mt-6 py-4 rounded-xl bg-vine-700 text-white font-semibold text-base flex items-center justify-center gap-2 active:bg-vine-800 shadow-sm"
          >
            <IconCheck size={18} strokeWidth={3} />
            Save Changes
          </button>
        </div>
      ) : (
        <div className="px-5 py-5 space-y-4 animate-fade-in">
          {/* Task card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-vine-800 flex-1 leading-tight">{task.title}</h2>
              <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: imp.color }} />
                <span className="text-xs font-semibold text-vine-500">{imp.label}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: CATEGORY_COLORS[task.category] + '18' }}
                >
                  <CatIcon size={13} className="text-vine-500" />
                </div>
                <span className="text-sm text-vine-500">{cat?.label}</span>
              </div>
              <div className="flex items-center gap-1.5 text-vine-400">
                <IconCalendar size={13} />
                <span className="text-sm">{formatDate(task.dueDate)}</span>
              </div>
              {task.dueTime && (
                <div className="flex items-center gap-1.5 text-vine-400">
                  <IconClock size={13} />
                  <span className="text-sm">{formatTime(task.dueTime)}</span>
                </div>
              )}
            </div>

            {task.notes && (
              <div className="bg-vine-50/80 rounded-xl p-3.5 mb-4">
                <p className="text-vine-500 text-sm leading-relaxed">{task.notes}</p>
              </div>
            )}

            <p className="text-[11px] text-vine-300">
              Created {new Date(task.createdAt).toLocaleDateString()} via {task.createdVia}
            </p>
          </div>

          {/* Action buttons */}
          <button
            onClick={readAloud}
            className="w-full py-3.5 rounded-xl bg-white border border-vine-200 text-vine-600 font-medium text-sm flex items-center justify-center gap-2.5 active:bg-vine-50 hover:border-vine-300"
          >
            {isSpeaking ? <IconVolumeOff size={18} /> : <IconVolume size={18} />}
            {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
          </button>

          <button
            onClick={handleComplete}
            className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2.5 transition-all shadow-sm ${
              task.status === 'completed'
                ? 'bg-vine-100 text-vine-600 active:bg-vine-200'
                : 'bg-green-600 text-white active:bg-green-700'
            }`}
          >
            {task.status === 'completed' ? (
              <>
                <IconUndo size={18} />
                Mark Incomplete
              </>
            ) : (
              <>
                <IconCheck size={18} strokeWidth={3} />
                Mark Complete
              </>
            )}
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="w-full py-3.5 rounded-xl bg-white border border-red-100 text-red-500 font-medium text-sm flex items-center justify-center gap-2 active:bg-red-50 hover:border-red-200"
          >
            <IconTrash size={16} />
            Delete Task
          </button>

          {/* Delete modal */}
          {showDelete && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <IconTrash size={20} className="text-red-500" />
                </div>
                <p className="text-lg font-bold text-vine-800 text-center mb-1">Delete this task?</p>
                <p className="text-vine-400 text-sm text-center mb-6">"{task.title}" will be permanently removed.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDelete(false)}
                    className="flex-1 py-3 rounded-xl bg-vine-100 text-vine-600 font-medium active:bg-vine-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold active:bg-red-700"
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
