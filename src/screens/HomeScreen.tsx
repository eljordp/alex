import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { TaskList } from '../components/tasks/TaskList'
import { VoiceButton } from '../components/voice/VoiceButton'
import { useTasks } from '../hooks/useTasks'
import { useVoiceOutput } from '../hooks/useVoiceOutput'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function HomeScreen() {
  const { todayTasks, overdueTasks, loading, complete, uncomplete } = useTasks()
  const { speak, isSpeaking, stop } = useVoiceOutput()
  const navigate = useNavigate()
  const name = localStorage.getItem('vinatask-name') || ''

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
        <div className="text-vine-400 text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      <Header
        title="VinaTask"
        rightAction={
          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-vine-100 text-xl"
          >
            ⚙️
          </button>
        }
      />

      <div className="px-4 pt-4 pb-2">
        <p className="text-vine-500 text-lg">
          {getGreeting()}{name ? `, ${name}` : ''}.
        </p>
        <p className="text-vine-400 text-sm mt-1">
          {todayTasks.filter(t => t.status !== 'completed').length === 0
            ? 'No tasks for today!'
            : `You have ${todayTasks.filter(t => t.status !== 'completed').length} task${todayTasks.filter(t => t.status !== 'completed').length > 1 ? 's' : ''} today.`
          }
        </p>
      </div>

      {overdueTasks.length > 0 && (
        <div className="mx-4 mb-3 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 font-semibold text-sm">
            ⚠️ {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="px-4 mb-3">
        <button
          onClick={readTasks}
          className="w-full py-3 rounded-xl bg-vine-100 text-vine-600 font-medium text-base active:bg-vine-200 transition-colors"
        >
          {isSpeaking ? '⏹ Stop Reading' : '🔊 Read My Tasks'}
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
