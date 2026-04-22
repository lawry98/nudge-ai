'use client'

import { useState } from 'react'
import { Task } from '@/types'
import TaskCard from './TaskCard'
import AddTaskModal from './AddTaskModal'

interface TaskListProps {
  tasks: Task[]
  selectedTask: Task | null
  onSelectTask: (task: Task) => void
  onTasksChange: (tasks: Task[]) => void
}

interface TaskGroup {
  label: string
  dot: string
  tasks: Task[]
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function getWeekEndString(): string {
  const d = new Date()
  d.setDate(d.getDate() + (7 - d.getDay()))
  return d.toISOString().split('T')[0]
}

function groupTasks(tasks: Task[]): TaskGroup[] {
  const today = getTodayString()
  const weekEnd = getWeekEndString()

  const overdue = tasks.filter((t) => !t.completed && t.due_date < today)
  const todayTasks = tasks.filter((t) => !t.completed && t.due_date === today)
  const thisWeek = tasks.filter((t) => !t.completed && t.due_date > today && t.due_date <= weekEnd)
  const completed = tasks.filter((t) => t.completed)

  return [
    { label: 'Overdue', dot: 'bg-red-500', tasks: overdue },
    { label: 'Today', dot: 'bg-yellow-400', tasks: todayTasks },
    { label: 'This Week', dot: 'bg-blue-500', tasks: thisWeek },
    { label: 'Completed', dot: 'bg-green-500', tasks: completed },
  ].filter((g) => g.tasks.length > 0)
}

export default function TaskList({ tasks, selectedTask, onSelectTask, onTasksChange }: TaskListProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleAdd = (task: Task) => {
    onTasksChange([...tasks, task])
    setShowAddModal(false)
  }

  const handleUpdate = (updated: Task) => {
    onTasksChange(tasks.map((t) => (t.id === updated.id ? updated : t)))
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleEditSave = (updated: Task) => {
    onTasksChange(tasks.map((t) => (t.id === updated.id ? updated : t)))
    setEditingTask(null)
  }

  const handleDelete = (id: number) => {
    onTasksChange(tasks.filter((t) => t.id !== id))
  }

  const groups = groupTasks(tasks)

  return (
    <div className="flex-1 bg-[#F0F2F5] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-[#F0F2F5] border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">My Tasks</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#7C6EF0] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#6358D4] transition-colors"
        >
          + Add Task
        </button>
      </div>

      {/* Task groups */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {groups.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">✓</p>
            <p className="font-medium">No tasks yet</p>
            <p className="text-sm mt-1">Click &quot;Add Task&quot; to get started</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${group.dot}`} />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {group.label}
                </span>
                <span className="text-xs text-gray-400">({group.tasks.length})</span>
              </div>
              <div className="space-y-2">
                {group.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isSelected={selectedTask?.id === task.id}
                    onSelect={onSelectTask}
                    onUpdate={handleUpdate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddTaskModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}

      {editingTask && (
        <AddTaskModal
          onClose={() => setEditingTask(null)}
          onAdd={() => {}}
          editTask={editingTask}
          onEdit={handleEditSave}
        />
      )}
    </div>
  )
}
