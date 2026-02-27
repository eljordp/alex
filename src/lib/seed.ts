import type { CategoryId, Importance } from '../types'

interface TaskInput {
  title: string
  notes: string
  category: CategoryId
  importance: Importance
  dueDate: string
  dueTime: string | null
  reminderMinutesBefore: number
  createdVia: 'voice' | 'manual' | 'quick-add'
}

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

const today = () => addDays(0)

const SAMPLE_TASKS: TaskInput[] = [
  {
    title: 'Spray Block A - fungicide application',
    notes: 'Use copper-based fungicide. Check wind conditions first.',
    category: 'vineyard',
    importance: 'critical',
    dueDate: today(),
    dueTime: '07:00',
    reminderMinutesBefore: 60,
    createdVia: 'manual',
  },
  {
    title: 'Check irrigation lines in east vineyard',
    notes: 'Several drip lines reported low pressure last week.',
    category: 'vineyard',
    importance: 'high',
    dueDate: today(),
    dueTime: '10:00',
    reminderMinutesBefore: 30,
    createdVia: 'manual',
  },
  {
    title: 'Meet with Caymus rep about harvest timeline',
    notes: 'Conference call. Dial-in number in email.',
    category: 'scheduling',
    importance: 'high',
    dueDate: today(),
    dueTime: '14:00',
    reminderMinutesBefore: 15,
    createdVia: 'manual',
  },
  {
    title: 'Order replacement trellis wire',
    notes: '12.5 gauge, 4000ft roll. Check Home Depot or Orchard Supply.',
    category: 'vineyard',
    importance: 'medium',
    dueDate: addDays(1),
    dueTime: null,
    reminderMinutesBefore: 1440,
    createdVia: 'manual',
  },
  {
    title: 'Doctor appointment - annual checkup',
    notes: 'Dr. Martinez office. Bring insurance card.',
    category: 'scheduling',
    importance: 'high',
    dueDate: addDays(2),
    dueTime: '09:30',
    reminderMinutesBefore: 1440,
    createdVia: 'manual',
  },
  {
    title: 'Water new plantings in Block C',
    notes: 'Young vines need extra water during establishment. Run for 2 hours.',
    category: 'vineyard',
    importance: 'critical',
    dueDate: addDays(-1),
    dueTime: '06:00',
    reminderMinutesBefore: 60,
    createdVia: 'manual',
  },
  {
    title: 'Pick up feed and supplies',
    notes: '',
    category: 'personal',
    importance: 'low',
    dueDate: addDays(3),
    dueTime: null,
    reminderMinutesBefore: 1440,
    createdVia: 'manual',
  },
  {
    title: 'Call back equipment rental company',
    notes: 'About the mechanical harvester for October.',
    category: 'scheduling',
    importance: 'medium',
    dueDate: addDays(-2),
    dueTime: null,
    reminderMinutesBefore: 30,
    createdVia: 'manual',
  },
]

type AddFn = (task: TaskInput) => Promise<unknown>

export async function seedSampleTasks(add: AddFn) {
  for (const task of SAMPLE_TASKS) {
    await add(task)
  }
}
