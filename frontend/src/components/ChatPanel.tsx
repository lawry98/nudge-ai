'use client'

import { useEffect, useRef, useState } from 'react'
import { Task, ChatMessage } from '@/types'
import { api } from '@/lib/api'
import QuickReplyButton from './QuickReplyButton'

interface ChatPanelProps {
  selectedTask: Task | null
  onBack?: () => void
}

const QUICK_REPLIES = [
  "It feels overwhelming",
  "I don't know where to start",
  "I keep getting distracted",
  "I'm not in the mood",
]

export default function ChatPanel({ selectedTask, onBack }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedTask) {
      setMessages([])
      return
    }
    loadTaskMessages(selectedTask)
  }, [selectedTask?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadTaskMessages = async (task: Task) => {
    setLoadingMessages(true)
    try {
      const existing = await api.getMessages(task.id)
      if (existing.length > 0) {
        setMessages(existing)
      } else {
        // Auto-send initial nudge
        const result = await api.initialNudge(task.id)
        if (result.already_exists && result.messages) {
          setMessages(result.messages)
        } else if (result.response) {
          const newMsg: ChatMessage = {
            id: Date.now(),
            role: 'assistant',
            content: result.response,
            task: task.id,
            timestamp: new Date().toISOString(),
          }
          setMessages([newMsg])
        }
      }
    } catch (err) {
      console.error('Failed to load messages', err)
    } finally {
      setLoadingMessages(false)
    }
  }

  const sendMessage = async (text: string) => {
    if (!selectedTask || !text.trim() || loading) return

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: text.trim(),
      task: selectedTask.id,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await api.sendChat(selectedTask.id, text.trim())
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.response,
        task: selectedTask.id,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      console.error('Chat error', err)
      const errMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sorry, I couldn't connect right now. Please check your API key and try again.",
        task: selectedTask.id,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // Show quick replies after the last assistant message if it's the most recent
  const showQuickReplies =
    messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !loading

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden -ml-1 mr-1 p-1 text-gray-400 hover:text-gray-700 transition-colors text-lg leading-none"
              aria-label="Back"
            >
              ←
            </button>
          )}
          <span className="font-bold text-gray-800">NudgeAI</span>
          <span className="w-2 h-2 bg-green-400 rounded-full" />
        </div>
        <p className="text-xs text-gray-400 mt-0.5">Your AI accountability partner</p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {!selectedTask ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-3">
            <div className="text-5xl">💬</div>
            <p className="font-medium text-gray-500">Select a task to start chatting</p>
            <p className="text-sm">NudgeAI will help you overcome procrastination with personalized support</p>
          </div>
        ) : loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-[#7C6EF0] rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#7C6EF0] text-white rounded-br-sm'
                      : 'bg-[#F0F2F5] text-gray-700 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Quick replies after last AI message */}
            {showQuickReplies && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((reply) => (
                  <QuickReplyButton
                    key={reply}
                    label={reply}
                    onClick={sendMessage}
                    disabled={loading}
                  />
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#F0F2F5] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedTask ? "Type a message..." : "Select a task first"}
            disabled={!selectedTask || loading}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6EF0] disabled:bg-gray-50 disabled:text-gray-400"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!selectedTask || loading || !input.trim()}
            className="bg-[#7C6EF0] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#6358D4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
