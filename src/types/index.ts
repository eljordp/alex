export type Importance = 'critical' | 'high' | 'medium' | 'low'

export type CategoryId = 'vineyard' | 'personal' | 'scheduling'

export type TaskStatus = 'pending' | 'completed' | 'overdue'

export interface Task {
  id: string
  title: string
  notes: string
  category: CategoryId
  importance: Importance
  status: TaskStatus
  dueDate: string
  dueTime: string | null
  reminderMinutesBefore: number
  createdAt: string
  completedAt: string | null
  createdVia: 'voice' | 'manual' | 'quick-add'
}

export interface Category {
  id: CategoryId
  label: string
  color: string
}

export const CATEGORIES: Category[] = [
  { id: 'vineyard', label: 'Vineyard', color: 'emerald' },
  { id: 'personal', label: 'Personal', color: 'amber' },
  { id: 'scheduling', label: 'Appointments', color: 'sky' },
]

export const IMPORTANCE_CONFIG: Record<Importance, {
  label: string
  color: string
  sortOrder: number
}> = {
  critical: { label: 'Critical', color: '#dc2626', sortOrder: 0 },
  high: { label: 'High', color: '#f59e0b', sortOrder: 1 },
  medium: { label: 'Medium', color: '#8B6914', sortOrder: 2 },
  low: { label: 'Low', color: '#9ca3af', sortOrder: 3 },
}

export const CATEGORY_COLORS: Record<CategoryId, string> = {
  vineyard: '#059669',
  personal: '#d97706',
  scheduling: '#0284c7',
}
