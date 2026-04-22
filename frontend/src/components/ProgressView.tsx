'use client'

import { useEffect, useState } from 'react'
import { Task, Stats } from '@/types'
import { api } from '@/lib/api'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-bold text-[#7C6EF0]">{value}</p>
      {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function ProgressView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    Promise.all([api.getTasks(), api.getStats()])
      .then(([t, s]) => { setTasks(t); setStats(s) })
      .catch(console.error)
  }, [])

  const completed = tasks.filter((t) => t.completed)
  const pending = tasks.filter((t) => !t.completed)
  const overdue = pending.filter((t) => t.due_date < new Date().toISOString().split('T')[0])

  const byPriority = (p: Task['priority']) => pending.filter((t) => t.priority === p).length

  return (
    <div className="flex-1 bg-[#F0F2F5] overflow-y-auto">
      <div className="max-w-2xl lg:max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Progress</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard label="Completed" value={stats?.completed_all_time ?? completed.length} sub="all time" />
          <StatCard label="Pending" value={pending.length} sub="tasks remaining" />
          <StatCard label="Overdue" value={overdue.length} sub="need attention" />
          <StatCard label="Streak" value={stats ? `${stats.streak} days 🔥` : '—'} sub="consecutive days" />
        </div>

        {/* This week */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">This Week</h2>
          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold text-[#7C6EF0]">
                {stats ? `${stats.completed_this_week} / ${stats.total_this_week}` : '—'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Tasks completed (created this week)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#7C6EF0]">{stats?.checkins_this_week ?? '—'}</p>
              <p className="text-xs text-gray-400 mt-1">AI check-ins</p>
            </div>
          </div>

          {/* Completion bar */}
          {stats && stats.total_this_week > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Completion rate</span>
                <span>{Math.round((stats.completed_this_week / stats.total_this_week) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7C6EF0] rounded-full transition-all"
                  style={{ width: `${(stats.completed_this_week / stats.total_this_week) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Priority breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Pending by Priority</h2>
          <div className="space-y-3">
            {[
              { label: 'Urgent', key: 'urgent' as const, color: 'bg-red-400' },
              { label: 'Medium', key: 'medium' as const, color: 'bg-yellow-400' },
              { label: 'Low', key: 'low' as const, color: 'bg-green-400' },
            ].map(({ label, key, color }) => {
              const count = byPriority(key)
              const max = Math.max(byPriority('urgent'), byPriority('medium'), byPriority('low'), 1)
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-14">{label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all`}
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-500 w-4 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Completed task list */}
        {completed.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Completed Tasks ({completed.length})
            </h2>
            <div className="space-y-2">
              {completed.map((t) => (
                <div key={t.id} className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="text-green-500">✓</span>
                  <span className="line-through">{t.name}</span>
                  <span className="ml-auto text-xs text-gray-300">{t.estimated_time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
