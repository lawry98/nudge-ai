'use client'

import { Task } from '@/types'
import { api } from '@/lib/api'

interface TaskCardProps {
  task: Task
  isSelected: boolean
  onSelect: (task: Task) => void
  onUpdate: (task: Task) => void
}

const priorityStyles: Record<Task['priority'], string> = {
  urgent: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

export default function TaskCard({ task, isSelected, onSelect, onUpdate }: TaskCardProps) {
  const handleCheckbox = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const updated = await api.updateTask(task.id, { completed: !task.completed })
      onUpdate(updated)
    } catch (err) {
      console.error('Failed to update task', err)
    }
  }

  const formattedDate = new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      onClick={() => onSelect(task)}
      className={`bg-white rounded-xl p-4 shadow-sm border-2 cursor-pointer transition-all ${
        isSelected ? 'border-[#7C6EF0] shadow-md' : 'border-transparent hover:border-[#7C6EF0]/30'
      } ${task.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleCheckbox}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-[#7C6EF0]'
          }`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>
            {task.name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formattedDate} · {task.estimated_time}
          </p>
        </div>

        {/* Priority badge */}
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
      </div>
    </div>
  )
}
