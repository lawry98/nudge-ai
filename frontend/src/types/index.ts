export interface Task {
  id: number
  name: string
  due_date: string // ISO date string YYYY-MM-DD
  estimated_time: string
  priority: 'urgent' | 'medium' | 'low'
  cognitive_load: 'deep' | 'medium' | 'light'
  completed: boolean
  completed_at: string | null
  created_at: string
}

export interface FocusRecommendation {
  in_focus_window: boolean
  window: 'morning' | 'afternoon' | 'evening' | 'none'
  task: Task | null
}

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  task: number | null
  timestamp: string
}

export interface Stats {
  completed_this_week: number
  completed_all_time: number
  total_this_week: number
  checkins_this_week: number
  streak: number
}

export interface Settings {
  focus_window: 'morning' | 'afternoon' | 'evening' | 'none'
  ai_tone: 'warm' | 'direct' | 'playful'
  notifications_enabled: boolean
  updated_at: string
}

export type TaskGroup = 'overdue' | 'today' | 'this_week' | 'completed'
