import type { TaskDraft } from '../../screens/AddTaskScreen'

interface QuickAddProps {
  onSelect: (template: TaskDraft) => void
}

const today = () => new Date().toISOString().split('T')[0]

const TEMPLATES: { label: string; icon: string; draft: Partial<TaskDraft> }[] = [
  {
    label: 'Water Vines',
    icon: '💧',
    draft: { title: 'Water vines', category: 'vineyard', importance: 'high' },
  },
  {
    label: 'Spray Program',
    icon: '🧪',
    draft: { title: 'Spray program', category: 'vineyard', importance: 'critical' },
  },
  {
    label: 'Check Irrigation',
    icon: '🔧',
    draft: { title: 'Check irrigation', category: 'vineyard', importance: 'high' },
  },
  {
    label: 'Harvest Prep',
    icon: '🍇',
    draft: { title: 'Harvest prep', category: 'vineyard', importance: 'critical' },
  },
  {
    label: 'Doctor Appt',
    icon: '🏥',
    draft: { title: 'Doctor appointment', category: 'scheduling', importance: 'high' },
  },
  {
    label: 'Call Back',
    icon: '📞',
    draft: { title: 'Return phone call', category: 'scheduling', importance: 'medium' },
  },
  {
    label: 'Meeting',
    icon: '🤝',
    draft: { title: 'Meeting', category: 'scheduling', importance: 'high' },
  },
  {
    label: 'Groceries',
    icon: '🛒',
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
          className="flex items-center gap-2 p-3 bg-white border border-vine-200 rounded-xl text-left active:bg-vine-100 transition-colors"
        >
          <span className="text-xl">{t.icon}</span>
          <span className="text-sm font-medium text-vine-600">{t.label}</span>
        </button>
      ))}
    </div>
  )
}
