import { Header } from '../components/layout/Header'
import { TaskList } from '../components/tasks/TaskList'
import { VoiceButton } from '../components/voice/VoiceButton'
import { useTasks } from '../hooks/useTasks'
import { useVoiceOutput } from '../hooks/useVoiceOutput'
import { IconVolume, IconVolumeOff, IconAlertTriangle, IconSun } from '../components/ui/Icons'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function HomeScreen() {
  const { todayTasks, overdueTasks, loading, complete, uncomplete } = useTasks()
  const { speak, isSpeaking, stop } = useVoiceOutput()
  const name = localStorage.getItem('vinatask-name') || ''

  const pendingCount = todayTasks.filter(t => t.status !== 'completed').length

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
      <Header title="VinaTask" />

      {/* Greeting section */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <IconSun size={18} className="text-vine-300" />
          <p className="text-vine-500 text-base font-medium">
            {getGreeting()}{name ? `, ${name}` : ''}.
          </p>
        </div>
        <p className="text-vine-400 text-sm pl-7">
          {pendingCount === 0
            ? 'No tasks for today. Enjoy your day!'
            : `${pendingCount} task${pendingCount > 1 ? 's' : ''} on your plate today.`
          }
        </p>
      </div>

      {/* Overdue banner */}
      {overdueTasks.length > 0 && (
        <div className="mx-4 mb-3 p-3.5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <IconAlertTriangle size={16} className="text-red-500" />
          </div>
          <div>
            <p className="text-red-700 font-semibold text-sm">
              {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
            </p>
            <p className="text-red-400 text-xs">
              These need your attention
            </p>
          </div>
        </div>
      )}

      {/* Read tasks button */}
      <div className="px-4 mb-4">
        <button
          onClick={readTasks}
          className="w-full py-3 rounded-xl bg-white border border-vine-200 text-vine-600 font-medium text-sm flex items-center justify-center gap-2.5 active:bg-vine-50 transition-all hover:border-vine-300"
        >
          {isSpeaking ? (
            <>
              <IconVolumeOff size={18} />
              Stop Reading
            </>
          ) : (
            <>
              <IconVolume size={18} />
              Read My Tasks
            </>
          )}
        </button>
      </div>

      <TaskList
        tasks={todayTasks}
        onComplete={complete}
        onUncomplete={uncomplete}
        emptyMessage="No tasks for today. Tap the mic to add one!"
      />

      <VoiceButton />
    </div>
  )
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}
