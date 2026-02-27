import { openDB, type IDBPDatabase, type DBSchema } from 'idb'
import type { Task, CategoryId, TaskStatus } from '../types'

interface VinaTaskDB extends DBSchema {
  tasks: {
    key: string
    value: Task
    indexes: {
      'by-due-date': string
      'by-category': CategoryId
      'by-status': TaskStatus
    }
  }
}

let dbPromise: Promise<IDBPDatabase<VinaTaskDB>> | null = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<VinaTaskDB>('vinatask-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('tasks', { keyPath: 'id' })
        store.createIndex('by-due-date', 'dueDate')
        store.createIndex('by-category', 'category')
        store.createIndex('by-status', 'status')
      },
    })
  }
  return dbPromise
}

export async function getAllTasks(): Promise<Task[]> {
  const db = await getDB()
  return db.getAll('tasks')
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  const db = await getDB()
  return db.get('tasks', id)
}

export async function addTask(task: Task): Promise<void> {
  const db = await getDB()
  await db.put('tasks', task)
}

export async function updateTask(task: Task): Promise<void> {
  const db = await getDB()
  await db.put('tasks', task)
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('tasks', id)
}

export async function getTasksByCategory(category: CategoryId): Promise<Task[]> {
  const db = await getDB()
  return db.getAllFromIndex('tasks', 'by-category', category)
}

export async function getTasksByStatus(status: TaskStatus): Promise<Task[]> {
  const db = await getDB()
  return db.getAllFromIndex('tasks', 'by-status', status)
}
