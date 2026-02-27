import { useEffect } from 'react'
import { TaskList } from '../components/tasks/TaskList'
import { useTasks } from '../hooks/useTasks'
import { useVoiceOutput } from '../hooks/useVoiceOutput'
import { IconVolume, IconVolumeOff, IconAlertTriangle, IconCheck, IconClock } from '../components/ui/Icons'
import { seedSampleTasks } from '../lib/seed'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function HomeScreen() {
  const { tasks, todayTasks, overdueTasks, loading, complete, uncomplete, add, refresh } = useTasks()
  const { speak, isSpeaking, stop } = useVoiceOutput()
  const name = localStorage.getItem('vinatask-name') || ''

  const pendingToday = todayTasks.filter(t => t.status !== 'completed')
  const completedToday = todayTasks.filter(t => t.status === 'completed')
  const totalActive = tasks.filter(t => t.status !== 'completed').length

  // Seed sample tasks on first ever load
  useEffect(() => {
    if (!loading && tasks.length === 0 && !localStorage.getItem('vinatask-seeded')) {
      localStorage.setItem('vinatask-seeded', '1')
      seedSampleTasks(add).then(() => refresh())
    }
  }, [loading, tasks.length, add, refresh])

  const readTasks = () => {
    if (isSpeaking) { stop(); return }
    const pending = todayTasks.filter(t => t.status !== 'completed')
    if (pending.length === 0) {
      speak('You have no tasks for today. Enjoy your day!')
      return
    }
    const text = pending.map((t, i) =>
      `Task ${i + 1}: ${t.title}. ${t.importance} priority. ${t.dueTime ? `Due at ${formatTime(t.dueTime)}.` : ''}`
    ).join(' ')
    speak(`You have ${pending.length} task${pending.length > 1 ? 's' : ''} today. ${text}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-vine-300 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-full">
      {/* Header area */}
      <div className="px-6 pt-6 pb-4">
        <p className="text-vine-300 text-sm font-medium">{getFormattedDate()}</p>
        <h1 className="text-2xl font-bold text-vine-800 mt-1">
          {getGreeting()}{name ? `, ${name}` : ''}
        </h1>
      </div>

      {/* Stats row */}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            value={pendingToday.length}
            label="Due Today"
            color="#8B6914"
            icon={<IconClock size={16} className="text-vine-300" />}
          />
          <StatCard
            value={overdueTasks.length}
            label="Overdue"
            color="#dc2626"
            icon={<IconAlertTriangle size={16} className="text-red-300" />}
          />
          <StatCard
            value={completedToday.length}
            label="Done Today"
            color="#059669"
            icon={<IconCheck size={16} className="text-green-300" />}
          />
        </div>
      </div>

      {/* Overdue banner */}
      {overdueTasks.length > 0 && (
        <div className="mx-5 mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <IconAlertTriangle size={20} className="text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-red-700 font-bold text-sm">
              {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
            </p>
            <p className="text-red-400 text-xs mt-0.5">
              These need your attention right away
            </p>
          </div>
        </div>
      )}

      {/* Read aloud */}
      <div className="px-5 mb-5">
        <button
          onClick={readTasks}
          className="w-full py-3.5 rounded-2xl bg-white text-vine-600 font-semibold text-sm flex items-center justify-center gap-2.5 active:bg-vine-50 transition-all"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)' }}
        >
          {isSpeaking ? (
            <><IconVolumeOff size={18} /> Stop Reading</>
          ) : (
            <><IconVolume size={18} /> Read My Tasks Aloud</>
          )}
        </button>
      </div>

      {/* Task list */}
      <div className="mb-2">
        <div className="px-5 mb-1">
          <h2 className="text-base font-bold text-vine-700">
            Today's Tasks
            {totalActive > 0 && (
              <span className="text-vine-300 font-normal text-sm ml-2">
                {totalActive} total active
              </span>
            )}
          </h2>
        </div>
      </div>

      <TaskList
        tasks={todayTasks}
        onComplete={complete}
        onUncomplete={uncomplete}
        emptyMessage="Nothing due today. Enjoy the calm!"
      />
    </div>
  )
}

function StatCard({ value, label, color, icon }: {
  value: number
  label: string
  color: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl p-3.5 text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="flex justify-center mb-1.5">{icon}</div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-[10px] text-vine-400 font-semibold uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  )
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}
