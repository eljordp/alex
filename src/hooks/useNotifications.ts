import { useRef, useCallback, useEffect } from 'react'
import { scheduleNotification, requestNotificationPermission } from '../lib/notifications'
import type { Task } from '../types'

export function useNotifications(tasks: Task[]) {
  const timerIds = useRef<Map<string, number>>(new Map())

  const scheduleAll = useCallback((taskList: Task[]) => {
    // Clear existing timers
    timerIds.current.forEach(id => clearTimeout(id))
    timerIds.current.clear()

    // Schedule new ones
    taskList
      .filter(t => t.status === 'pending' && t.dueTime)
      .forEach(task => {
        const id = scheduleNotification(task)
        if (id !== null) {
          timerIds.current.set(task.id, id)
        }
      })
  }, [])

  const requestPermission = useCallback(async () => {
    return requestNotificationPermission()
  }, [])

  // Schedule on mount and when tasks change
  useEffect(() => {
    scheduleAll(tasks)
    return () => {
      timerIds.current.forEach(id => clearTimeout(id))
    }
  }, [tasks, scheduleAll])

  return { requestPermission, scheduleAll }
}
