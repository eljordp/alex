import type { TaskDraft } from '../../screens/AddTaskScreen'
import {
  IconDroplet, IconFlask, IconWrench, IconGrape,
  IconMedical, IconPhone, IconUsers, IconShoppingCart,
} from '../ui/Icons'

interface QuickAddProps {
  onSelect: (template: TaskDraft) => void
}

const today = () => new Date().toISOString().split('T')[0]

const TEMPLATES: { label: string; Icon: typeof IconDroplet; draft: Partial<TaskDraft> }[] = [
  {
    label: 'Water Vines',
    Icon: IconDroplet,
    draft: { title: 'Water vines', category: 'vineyard', importance: 'high' },
  },
  {
    label: 'Spray Program',
    Icon: IconFlask,
    draft: { title: 'Spray program', category: 'vineyard', importance: 'critical' },
  },
  {
    label: 'Check Irrigation',
    Icon: IconWrench,
    draft: { title: 'Check irrigation', category: 'vineyard', importance: 'high' },
  },
  {
    label: 'Harvest Prep',
    Icon: IconGrape,
    draft: { title: 'Harvest prep', category: 'vineyard', importance: 'critical' },
  },
  {
    label: 'Doctor Appt',
    Icon: IconMedical,
    draft: { title: 'Doctor appointment', category: 'scheduling', importance: 'high' },
  },
  {
    label: 'Call Back',
    Icon: IconPhone,
    draft: { title: 'Return phone call', category: 'scheduling', importance: 'medium' },
  },
  {
    label: 'Meeting',
    Icon: IconUsers,
    draft: { title: 'Meeting', category: 'scheduling', importance: 'high' },
  },
  {
    label: 'Groceries',
    Icon: IconShoppingCart,
    draft: { title: 'Get groceries', category: 'personal', importance: 'medium' },
  },
]

export function QuickAdd({ onSelect }: QuickAddProps) {
  const handleSelect = (template: typeof TEMPLATES[number]) => {
    onSelect({
      title: template.draft.title || '',
      notes: '',
      category: template.draft.category || 'vineyard',
      importance: template.draft.importance || 'medium',
      dueDate: today(),
      dueTime: null,
      reminderMinutesBefore: 30,
      createdVia: 'quick-add',
    })
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {TEMPLATES.map(t => (
        <button
          key={t.label}
          onClick={() => handleSelect(t)}
          className="flex items-center gap-3 p-3.5 bg-white border border-vine-100 rounded-xl text-left active:bg-vine-50 transition-all hover:border-vine-200 hover:shadow-sm"
        >
          <div className="w-8 h-8 rounded-lg bg-vine-50 flex items-center justify-center flex-shrink-0">
            <t.Icon size={16} className="text-vine-500" />
          </div>
          <span className="text-sm font-medium text-vine-600">{t.label}</span>
        </button>
      ))}
    </div>
  )
}
