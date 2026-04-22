'use client'

import { useEffect, useState } from 'react'
import { FocusRecommendation, Task } from '@/types'
import { api } from '@/lib/api'

const windowLabels: Record<string, string> = {
  morning: 'morning',
  afternoon: 'afternoon',
  evening: 'evening',
  none: '',
}

const cognitiveLoadStyles: Record<Task['cognitive_load'], string> = {
  deep: 'bg-[#7C6EF0]/15 text-[#6358D4]',
  medium: 'bg-blue-100 text-blue-600',
  light: 'bg-teal-100 text-teal-600',
}

const priorityStyles: Record<Task['priority'], string> = {
  urgent: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

interface FocusCardProps {
  onSelectTask: (task: Task) => void
}

export default function FocusCard({ onSelectTask }: FocusCardProps) {
  const [data, setData] = useState<FocusRecommendation | null>(null)

  const load = () => {
    api.getFocusRecommendation().then(setData).catch(() => {})
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 60_000)
    return () => clearInterval(id)
  }, [])

  if (!data || !data.in_focus_window) return null

  const windowLabel = windowLabels[data.window] || data.window

  if (!data.task) {
    return (
      <div className="mx-4 mt-4 rounded-2xl border border-[#7C6EF0]/30 bg-[#7C6EF0]/5 px-4 py-3 text-sm text-[#6358D4]">
        You&apos;re in your <span className="font-semibold">{windowLabel}</span> focus window. No tasks left — nice.
      </div>
    )
  }

  const task = data.task
  const formattedDate = task.due_date
    ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-[#7C6EF0]/40 bg-white shadow-md overflow-hidden">
      {/* Header strip */}
      <div className="bg-[#7C6EF0] px-4 py-2.5 flex items-center gap-2">
        <span className="text-base">🎯</span>
        <span className="text-white font-semibold text-sm">
          Focus time — <span className="capitalize">{windowLabel}</span>
        </span>
      </div>

      <div className="px-4 py-3">
        <p className="text-xs text-gray-400 mb-2">Best task for right now based on your peak hours</p>

        <p className="font-semibold text-gray-800 text-sm mb-2">{task.name}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {formattedDate && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.8}>
                <rect x="2" y="3" width="12" height="11" rx="2" />
                <path strokeLinecap="round" d="M5 1v4M11 1v4M2 7h12" />
              </svg>
              {formattedDate}
            </span>
          )}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${cognitiveLoadStyles[task.cognitive_load]}`}>
            {task.cognitive_load === 'deep' ? 'Deep focus' : task.cognitive_load === 'medium' ? 'Medium' : 'Light'}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
        </div>

        <button
          onClick={() => onSelectTask(task)}
          className="w-full py-2 rounded-xl bg-[#7C6EF0] hover:bg-[#6358D4] text-white text-sm font-semibold transition-colors"
        >
          Start with this task
        </button>
      </div>
    </div>
  )
}
