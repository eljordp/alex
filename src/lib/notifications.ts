import type { Task } from '../types'

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function scheduleNotification(task: Task): number | null {
  if (!task.dueTime || !task.dueDate) return null
  if (Notification.permission !== 'granted') return null

  const [hours, minutes] = task.dueTime.split(':').map(Number)
  const dueDateTime = new Date(task.dueDate + 'T00:00:00')
  dueDateTime.setHours(hours, minutes, 0, 0)

  const reminderTime = new Date(dueDateTime.getTime() - task.reminderMinutesBefore * 60000)
  const delay = reminderTime.getTime() - Date.now()

  if (delay <= 0) return null

  const timerId = window.setTimeout(() => {
    new Notification(`VinaTask: ${task.title}`, {
      body: `Due at ${formatTime(task.dueTime!)}`,
      icon: '/icons/icon-192.png',
      tag: task.id,
      requireInteraction: true,
    })
    // Also vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200])
    }
  }, delay)

  return timerId
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  const today = new Date().toISOString().split('T')[0]
  return tasks.filter(t =>
    t.status !== 'completed' && t.dueDate < today
  )
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}
