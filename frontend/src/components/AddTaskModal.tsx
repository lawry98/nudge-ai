'use client'

import { useState } from 'react'
import { Task } from '@/types'
import { api } from '@/lib/api'

interface AddTaskModalProps {
  onClose: () => void
  onAdd: (task: Task) => void
}

const estimatedTimeOptions = ['15 min', '30 min', '1 hour', '2 hours', '3+ hours']

export default function AddTaskModal({ onClose, onAdd }: AddTaskModalProps) {
  const [name, setName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('30 min')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !dueDate) {
      setError('Please fill in task name and due date.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const task = await api.createTask({
        name: name.trim(),
        due_date: dueDate,
        estimated_time: estimatedTime,
        priority,
      })
      onAdd(task)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Add New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Write project proposal"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6EF0]"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6EF0]"
            />
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
            <select
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6EF0]"
            >
              {estimatedTimeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'urgent'] as Task['priority'][]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold capitalize border-2 transition-colors ${
                    priority === p
                      ? p === 'urgent'
                        ? 'bg-red-500 border-red-500 text-white'
                        : p === 'medium'
                        ? 'bg-yellow-400 border-yellow-400 text-white'
                        : 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#7C6EF0] text-white text-sm font-semibold hover:bg-[#6358D4] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
