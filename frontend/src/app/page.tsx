'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TaskList from '@/components/TaskList'
import FocusCard from '@/components/FocusCard'
import ChatPanel from '@/components/ChatPanel'
import ProgressView from '@/components/ProgressView'
import CheckinsView from '@/components/CheckinsView'
import SettingsView from '@/components/SettingsView'
import BottomTabBar from '@/components/BottomTabBar'
import { Task } from '@/types'
import { api } from '@/lib/api'

type NavItem = 'tasks' | 'checkins' | 'progress' | 'settings'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeNav, setActiveNav] = useState<NavItem>('tasks')
  const [loadError, setLoadError] = useState('')
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    api.getTasks()
      .then(setTasks)
      .catch(() => setLoadError('Could not connect to the backend. Make sure the Django server is running on port 8000.'))
  }, [])

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task)
    setChatOpen(true)
  }

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
          <div className="flex-1 flex flex-col overflow-hidden bg-[#F0F2F5]">
            <FocusCard onSelectTask={handleSelectTask} />
            <TaskList
              tasks={tasks}
              selectedTask={selectedTask}
              onSelectTask={handleSelectTask}
              onTasksChange={setTasks}
            />
          </div>
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
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-[#F0F2F5]">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

        <main className="flex flex-1 overflow-hidden">
          {renderMain()}

          {showChat && (
            <div
              className={[
                // Base styles
                'flex flex-col bg-white transition-transform duration-300',
                // Mobile: fixed full-screen overlay, slides in/out via transform
                'fixed inset-0 z-50',
                chatOpen ? 'translate-x-0' : 'translate-x-full',
                // Tablet: right-side drawer, same transform logic controls open/close
                'md:inset-auto md:right-0 md:top-0 md:bottom-0 md:left-auto md:w-80 md:z-40 md:shadow-2xl',
                // Desktop: inline flex column, always visible regardless of chatOpen
                'lg:relative lg:inset-auto lg:shadow-none lg:translate-x-0 lg:w-[350px] lg:min-w-[350px] lg:h-full lg:border-l lg:border-gray-100',
              ].join(' ')}
            >
              <ChatPanel selectedTask={selectedTask} onBack={() => setChatOpen(false)} />
            </div>
          )}
        </main>
      </div>

      <BottomTabBar activeNav={activeNav} onNavChange={setActiveNav} />
    </div>
  )
}
