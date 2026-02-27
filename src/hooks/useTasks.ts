import { useState, useEffect, useCallback } from 'react'
import type { Task, CategoryId } from '../types'
import * as db from '../db/database'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const all = await db.getAllTasks()
    // Mark overdue tasks
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const updated = all.map(t => {
      if (t.status === 'pending' && t.dueDate < today) {
        return { ...t, status: 'overdue' as const }
      }
      return t
    })
    // Persist overdue status updates
    for (const t of updated) {
      const original = all.find(o => o.id === t.id)
      if (original && original.status !== t.status) {
        await db.updateTask(t)
      }
    }
    // Sort: overdue first, then by importance, then by date
    updated.sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1
      if (b.status === 'overdue' && a.status !== 'overdue') return 1
      if (a.status === 'completed' && b.status !== 'completed') return 1
      if (b.status === 'completed' && a.status !== 'completed') return -1
      const importanceOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      const impDiff = importanceOrder[a.importance] - importanceOrder[b.importance]
      if (impDiff !== 0) return impDiff
      return a.dueDate.localeCompare(b.dueDate)
    })
    setTasks(updated)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const add = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    await db.addTask(newTask)
    await refresh()
    return newTask
  }, [refresh])

  const update = useCallback(async (task: Task) => {
    await db.updateTask(task)
    await refresh()
  }, [refresh])

  const remove = useCallback(async (id: string) => {
    await db.deleteTask(id)
    await refresh()
  }, [refresh])

  const complete = useCallback(async (id: string) => {
    const task = await db.getTaskById(id)
    if (task) {
      await db.updateTask({
        ...task,
        status: 'completed',
        completedAt: new Date().toISOString(),
      })
      await refresh()
    }
  }, [refresh])

  const uncomplete = useCallback(async (id: string) => {
    const task = await db.getTaskById(id)
    if (task) {
      const today = new Date().toISOString().split('T')[0]
      await db.updateTask({
        ...task,
        status: task.dueDate < today ? 'overdue' : 'pending',
        completedAt: null,
      })
      await refresh()
    }
  }, [refresh])

  const getByCategory = useCallback((category: CategoryId) => {
    return tasks.filter(t => t.category === category)
  }, [tasks])

  const todayTasks = tasks.filter(t => {
    const today = new Date().toISOString().split('T')[0]
    return t.dueDate === today || t.status === 'overdue'
  })

  const overdueTasks = tasks.filter(t => t.status === 'overdue')

  return {
    tasks,
    loading,
    todayTasks,
    overdueTasks,
    add,
    update,
    remove,
    complete,
    uncomplete,
    getByCategory,
    refresh,
  }
}
