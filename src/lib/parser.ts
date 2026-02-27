import type { CategoryId, Importance } from '../types'

interface ParsedTask {
  title: string
  category: CategoryId
  importance: Importance
  dueDate: string
  dueTime: string | null
}

export function parseVoiceInput(transcript: string): ParsedTask {
  const result: ParsedTask = {
    title: transcript,
    category: 'vineyard',
    importance: 'medium',
    dueDate: todayISO(),
    dueTime: null,
  }

  // --- Importance ---
  if (/\b(critical|urgent|emergency|asap)\b/i.test(transcript)) {
    result.importance = 'critical'
  } else if (/\b(high priority|important|high)\b/i.test(transcript)) {
    result.importance = 'high'
  } else if (/\b(low priority|whenever|no rush|low)\b/i.test(transcript)) {
    result.importance = 'low'
  }

  // --- Category ---
  if (/\b(doctor|dentist|appointment|meeting|call|schedule|barber|lawyer)\b/i.test(transcript)) {
    result.category = 'scheduling'
  } else if (/\b(personal|home|family|gym|groceries|house|kids|wife)\b/i.test(transcript)) {
    result.category = 'personal'
  }
  // else stays vineyard

  // --- Date ---
  if (/\btomorrow\b/i.test(transcript)) {
    result.dueDate = addDaysISO(1)
  } else if (/\bnext week\b/i.test(transcript)) {
    result.dueDate = addDaysISO(7)
  } else if (/\bnext month\b/i.test(transcript)) {
    result.dueDate = addDaysISO(30)
  }

  const daysMatch = transcript.match(/\bin (\d+) days?\b/i)
  if (daysMatch) {
    result.dueDate = addDaysISO(parseInt(daysMatch[1]))
  }

  const weeksMatch = transcript.match(/\bin (\d+) weeks?\b/i)
  if (weeksMatch) {
    result.dueDate = addDaysISO(parseInt(weeksMatch[1]) * 7)
  }

  const dayMatch = transcript.match(/\b(?:next |on )?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i)
  if (dayMatch) {
    result.dueDate = nextDayOfWeekISO(dayMatch[1])
  }

  // --- Time ---
  const timeMatch = transcript.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i)
  if (timeMatch) {
    let hours = parseInt(timeMatch[1])
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0
    if (timeMatch[3].toLowerCase() === 'pm' && hours !== 12) hours += 12
    if (timeMatch[3].toLowerCase() === 'am' && hours === 12) hours = 0
    result.dueTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  } else if (/\bmorning\b/i.test(transcript)) {
    result.dueTime = '08:00'
  } else if (/\bafternoon\b/i.test(transcript)) {
    result.dueTime = '14:00'
  } else if (/\bevening\b/i.test(transcript)) {
    result.dueTime = '18:00'
  } else if (/\bnoon\b/i.test(transcript)) {
    result.dueTime = '12:00'
  }

  // --- Clean title ---
  result.title = cleanTitle(transcript)

  return result
}

function cleanTitle(text: string): string {
  return text
    .replace(/\b(critical|urgent|emergency|asap|high priority|important|low priority|whenever|no rush)\b/gi, '')
    .replace(/\b(high|low|medium)\s*priority\b/gi, '')
    .replace(/\b(tomorrow|next week|next month|today)\b/gi, '')
    .replace(/\bin \d+ (days?|weeks?)\b/gi, '')
    .replace(/\b(?:next |on )?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '')
    .replace(/\b\d{1,2}(?::\d{2})?\s*(am|pm)\b/gi, '')
    .replace(/\b(morning|afternoon|evening|noon)\b/gi, '')
    .replace(/\b(remind me to|remind me|don't forget to|don't forget)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s,]+|[\s,]+$/g, '')
    .trim()
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

function addDaysISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function nextDayOfWeekISO(dayName: string): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const target = days.indexOf(dayName.toLowerCase())
  const today = new Date()
  const current = today.getDay()
  let daysUntil = target - current
  if (daysUntil <= 0) daysUntil += 7
  today.setDate(today.getDate() + daysUntil)
  return today.toISOString().split('T')[0]
}
