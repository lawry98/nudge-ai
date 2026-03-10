export interface Task {
  id: number
  name: string
  due_date: string // ISO date string YYYY-MM-DD
  estimated_time: string
  priority: 'urgent' | 'medium' | 'low'
  completed: boolean
  created_at: string
}

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  task: number | null
  timestamp: string
}

export interface Stats {
  completed: number
  total: number
  checkins: number
  streak: number
}

export type TaskGroup = 'overdue' | 'today' | 'this_week' | 'completed'
