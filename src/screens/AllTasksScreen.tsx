import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { TaskList } from '../components/tasks/TaskList'
import { VoiceButton } from '../components/voice/VoiceButton'
import { useTasks } from '../hooks/useTasks'
import { CATEGORIES, CATEGORY_COLORS, type CategoryId } from '../types'
import { IconGrape, IconHome, IconCalendar } from '../components/ui/Icons'

const CATEGORY_ICONS: Record<CategoryId, typeof IconGrape> = {
  vineyard: IconGrape,
  personal: IconHome,
  scheduling: IconCalendar,
}

export function AllTasksScreen() {
  const { tasks, loading, complete, uncomplete } = useTasks()
  const [filter, setFilter] = useState<CategoryId | 'all'>('all')

  const filtered = filter === 'all'
    ? tasks
    : tasks.filter(t => t.category === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-vine-300 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-full">
      <Header title="All Tasks" />

      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-vine-700 text-white shadow-sm'
              : 'bg-white border border-vine-200 text-vine-500 hover:border-vine-300'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => {
          const CatIcon = CATEGORY_ICONS[cat.id]
          const isActive = filter === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'bg-white border border-vine-200 text-vine-500 hover:border-vine-300'
              }`}
              style={isActive ? { backgroundColor: CATEGORY_COLORS[cat.id] } : undefined}
            >
              <CatIcon size={14} className={isActive ? 'text-white/80' : 'text-vine-400'} />
              {cat.label}
            </button>
          )
        })}
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
