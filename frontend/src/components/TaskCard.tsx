'use client'

import { Task } from '@/types'
import { api } from '@/lib/api'

interface TaskCardProps {
  task: Task
  isSelected: boolean
  onSelect: (task: Task) => void
  onUpdate: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

const priorityStyles: Record<Task['priority'], string> = {
  urgent: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

const cognitiveLoadStyles: Record<Task['cognitive_load'], string> = {
  deep: 'bg-[#7C6EF0]/15 text-[#6358D4]',
  medium: 'bg-blue-100 text-blue-600',
  light: 'bg-teal-100 text-teal-600',
}

const cognitiveLoadLabels: Record<Task['cognitive_load'], string> = {
  deep: 'Deep',
  medium: 'Med',
  light: 'Light',
}

function PencilIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h10M6 4V2.5h4V4M5 4v8.5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5V4" />
    </svg>
  )
}

export default function TaskCard({ task, isSelected, onSelect, onUpdate, onEdit, onDelete }: TaskCardProps) {
  const handleCheckbox = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const updated = await api.updateTask(task.id, { completed: !task.completed })
      onUpdate(updated)
    } catch (err) {
      console.error('Failed to update task', err)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(task)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Delete "${task.name}"?`)) return
    try {
      await api.deleteTask(task.id)
      onDelete(task.id)
    } catch (err) {
      console.error('Failed to delete task', err)
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

        {/* Cognitive load tag */}
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${cognitiveLoadStyles[task.cognitive_load]}`}>
          {cognitiveLoadLabels[task.cognitive_load]}
        </span>

        {/* Priority badge */}
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>

        {/* Edit / Delete buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#7C6EF0] hover:bg-[#7C6EF0]/10 transition-colors"
            aria-label="Edit task"
          >
            <PencilIcon />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Delete task"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
