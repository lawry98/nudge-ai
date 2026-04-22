'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Stats } from '@/types'

type NavItem = 'tasks' | 'checkins' | 'progress' | 'settings'

interface SidebarProps {
  activeNav: NavItem
  onNavChange: (nav: NavItem) => void
}

const navItems: { id: NavItem; label: string; icon: string }[] = [
  { id: 'tasks', label: 'My Tasks', icon: '✓' },
  { id: 'checkins', label: 'AI Check-ins', icon: '💬' },
  { id: 'progress', label: 'Progress', icon: '📈' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error)
  }, [])

  return (
    <aside className="hidden md:flex flex-col w-[250px] min-w-[250px] bg-[#1A1A2E] text-white h-full">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <div className="text-2xl font-bold tracking-tight">
          Nudge<span className="text-[#7C6EF0]">AI</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Your AI accountability partner</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors text-left ${
              activeNav === item.id
                ? 'bg-[#2A2A4A] text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Stats box */}
      <div className="px-4 pb-6">
        <div className="bg-[#2A2A4A] rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 tracking-widest mb-3">THIS WEEK</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tasks completed</span>
              <span className="font-bold text-[#7C6EF0]">
                {stats ? `${stats.completed_this_week} / ${stats.total_this_week}` : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">AI check-ins</span>
              <span className="font-bold text-[#7C6EF0]">{stats?.checkins_this_week ?? '—'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Streak</span>
              <span className="font-bold text-[#7C6EF0]">
                {stats !== null ? `${stats.streak} days 🔥` : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
