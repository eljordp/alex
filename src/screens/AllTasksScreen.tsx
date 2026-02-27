import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { TaskList } from '../components/tasks/TaskList'
import { VoiceButton } from '../components/voice/VoiceButton'
import { useTasks } from '../hooks/useTasks'
import { CATEGORIES, type CategoryId } from '../types'

export function AllTasksScreen() {
  const { tasks, loading, complete, uncomplete } = useTasks()
  const [filter, setFilter] = useState<CategoryId | 'all'>('all')

  const filtered = filter === 'all'
    ? tasks
    : tasks.filter(t => t.category === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-vine-400 text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      <Header title="All Tasks" />

      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-vine-600 text-white'
              : 'bg-vine-100 text-vine-500'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === cat.id
                ? 'bg-vine-600 text-white'
                : 'bg-vine-100 text-vine-500'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <TaskList
        tasks={filtered}
        onComplete={complete}
        onUncomplete={uncomplete}
        emptyMessage="No tasks found. Add one with the mic!"
      />

      <VoiceButton />
    </div>
  )
}
