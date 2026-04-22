import { Task, ChatMessage, Stats, Settings, FocusRecommendation } from '@/types'

const BASE_URL = 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  getTasks(): Promise<Task[]> {
    return request('/api/tasks/')
  },

  createTask(data: Omit<Task, 'id' | 'created_at' | 'completed' | 'completed_at'>): Promise<Task> {
    return request('/api/tasks/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateTask(id: number, data: Partial<Task>): Promise<Task> {
    return request(`/api/tasks/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  deleteTask(id: number): Promise<void> {
    return request(`/api/tasks/${id}/`, { method: 'DELETE' })
  },

  getMessages(taskId: number): Promise<ChatMessage[]> {
    return request(`/api/tasks/${taskId}/messages/`)
  },

  sendChat(taskId: number, message: string): Promise<{ response: string }> {
    return request('/api/chat/', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId, message }),
    })
  },

  initialNudge(taskId: number): Promise<{ response?: string; already_exists?: boolean; messages?: ChatMessage[] }> {
    return request('/api/chat/initial/', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId }),
    })
  },

  getStats(): Promise<Stats> {
    return request('/api/stats/')
  },

  getSettings(): Promise<Settings> {
    return request('/api/settings/')
  },

  updateSettings(data: Partial<Omit<Settings, 'updated_at'>>): Promise<Settings> {
    return request('/api/settings/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  getFocusRecommendation(): Promise<FocusRecommendation> {
    return request('/api/focus-recommendation/')
  },
}
