'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TaskList from '@/components/TaskList'
import ChatPanel from '@/components/ChatPanel'
import ProgressView from '@/components/ProgressView'
import CheckinsView from '@/components/CheckinsView'
import SettingsView from '@/components/SettingsView'
import { Task } from '@/types'
import { api } from '@/lib/api'

type NavItem = 'tasks' | 'checkins' | 'progress' | 'settings'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeNav, setActiveNav] = useState<NavItem>('tasks')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    api.getTasks()
      .then(setTasks)
      .catch(() => setLoadError('Could not connect to the backend. Make sure the Django server is running on port 8000.'))
  }, [])

  const renderMain = () => {
    if (loadError) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm px-6">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="font-semibold text-gray-700 mb-2">Backend not reachable</p>
            <p className="text-sm text-gray-500">{loadError}</p>
          </div>
        </div>
      )
    }

    switch (activeNav) {
      case 'tasks':
        return (
          <TaskList
            tasks={tasks}
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
            onTasksChange={setTasks}
          />
        )
      case 'checkins':
        return <CheckinsView />
      case 'progress':
        return <ProgressView />
      case 'settings':
        return <SettingsView />
    }
  }

  // Only show the chat panel on the tasks view
  const showChat = activeNav === 'tasks' && !loadError

  return (
    <div className="flex h-full bg-[#F0F2F5]">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="flex flex-1 overflow-hidden">
        {renderMain()}
        {showChat && <ChatPanel selectedTask={selectedTask} />}
      </main>
    </div>
  )
}
