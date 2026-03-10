'use client'

import { useEffect, useState } from 'react'
import { Task, ChatMessage } from '@/types'
import { api } from '@/lib/api'

interface ConversationEntry {
  task: Task
  messages: ChatMessage[]
}

export default function CheckinsView() {
  const [entries, setEntries] = useState<ConversationEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const tasks = await api.getTasks()
      const results = await Promise.all(
        tasks.map(async (task) => {
          const messages = await api.getMessages(task.id)
          return { task, messages }
        })
      )
      setEntries(results.filter((e) => e.messages.length > 0))
      setLoading(false)
    }
    load().catch(console.error)
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F0F2F5]">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2 h-2 bg-[#7C6EF0] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#F0F2F5] overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI Check-ins</h1>
        <p className="text-sm text-gray-400 mb-6">All conversations with NudgeAI</p>

        {entries.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">💬</div>
            <p className="font-medium">No check-ins yet</p>
            <p className="text-sm mt-1">Select a task from My Tasks to start a conversation</p>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map(({ task, messages }) => (
              <div key={task.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{task.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{messages.length} messages</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                    task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === 'user'
                          ? 'bg-[#7C6EF0] text-white rounded-br-sm'
                          : 'bg-[#F0F2F5] text-gray-700 rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
