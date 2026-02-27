import { useState } from 'react'
import { TaskList } from '../components/tasks/TaskList'
import { useTasks } from '../hooks/useTasks'
import { CATEGORIES, CATEGORY_COLORS, type CategoryId } from '../types'
import { IconGrape, IconHome, IconCalendar, IconList } from '../components/ui/Icons'

const CATEGORY_ICONS: Record<CategoryId, typeof IconGrape> = {
  vineyard: IconGrape,
  personal: IconHome,
  scheduling: IconCalendar,
}

export function AllTasksScreen() {
  const { tasks, loading, complete, uncomplete } = useTasks()
  const [filter, setFilter] = useState<CategoryId | 'all'>('all')
  const [showCompleted, setShowCompleted] = useState(true)

  let filtered = filter === 'all'
    ? tasks
    : tasks.filter(t => t.category === filter)

  if (!showCompleted) {
    filtered = filtered.filter(t => t.status !== 'completed')
  }

  const activeCount = tasks.filter(t => t.status !== 'completed').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-vine-300 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-vine-800">All Tasks</h1>
        <p className="text-vine-400 text-sm mt-1">{activeCount} active task{activeCount !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters */}
      <div className="px-5 py-4">
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          <FilterChip
            label="All"
            count={tasks.length}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            icon={<IconList size={14} />}
          />
          {CATEGORIES.map(cat => {
            const CatIcon = CATEGORY_ICONS[cat.id]
            const count = tasks.filter(t => t.category === cat.id).length
            return (
              <FilterChip
                key={cat.id}
                label={cat.label}
                count={count}
                active={filter === cat.id}
                onClick={() => setFilter(cat.id)}
                icon={<CatIcon size={14} />}
                activeColor={CATEGORY_COLORS[cat.id]}
              />
            )
          })}
        </div>
      </div>

      {/* Toggle completed */}
      <div className="px-5 mb-4 flex items-center justify-between">
        <span className="text-xs text-vine-400 font-medium">
          {filtered.length} task{filtered.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="text-xs text-vine-400 font-medium hover:text-vine-600"
        >
          {showCompleted ? 'Hide completed' : 'Show completed'}
        </button>
      </div>

      <TaskList
        tasks={filtered}
        onComplete={complete}
        onUncomplete={uncomplete}
        emptyMessage="No tasks in this category yet."
      />
    </div>
  )
}

function FilterChip({ label, count, active, onClick, icon, activeColor }: {
  label: string
  count: number
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  activeColor?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pl-3 pr-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
        active
          ? 'text-white shadow-sm'
          : 'bg-white text-vine-500'
      }`}
      style={active ? { backgroundColor: activeColor || '#342a1a' } : { boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <span className={active ? 'text-white/70' : 'text-vine-300'}>{icon}</span>
      {label}
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
        active ? 'bg-white/20 text-white' : 'bg-vine-100 text-vine-400'
      }`}>
        {count}
      </span>
    </button>
  )
}
