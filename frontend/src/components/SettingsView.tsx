'use client'

import { useEffect, useRef, useState } from 'react'
import { Settings } from '@/types'
import { api } from '@/lib/api'

const focusWindowOptions: { value: Settings['focus_window']; label: string }[] = [
  { value: 'morning', label: 'Morning (6am–12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm–6pm)' },
  { value: 'evening', label: 'Evening (6pm–12am)' },
  { value: 'none', label: 'Not set' },
]

const aiToneOptions: { value: Settings['ai_tone']; label: string }[] = [
  { value: 'warm', label: 'Warm & empathetic' },
  { value: 'direct', label: 'Direct & concise' },
  { value: 'playful', label: 'Playful' },
]

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
}

export default function SettingsView() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [saved, setSaved] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error)
  }, [])

  const handleChange = (patch: Partial<Omit<Settings, 'updated_at'>>) => {
    if (!settings) return
    const next = { ...settings, ...patch }
    setSettings(next)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const updated = await api.updateSettings(patch)
        setSettings(updated)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch (err) {
        console.error('Failed to save settings', err)
      }
    }, 400)
  }

  return (
    <div className="flex-1 bg-[#F0F2F5] overflow-y-auto">
      <div className="max-w-2xl lg:max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          {saved && (
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
              Saved
            </span>
          )}
        </div>

        <div className="space-y-4">
          {/* Focus Window */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Focus Window</h2>
            <p className="text-xs text-gray-400 mb-4">When do you do your best work?</p>
            {!settings ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-9 w-full" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {focusWindowOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                      settings.focus_window === opt.value ? 'bg-[#7C6EF0]/10' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="focus_window"
                      value={opt.value}
                      checked={settings.focus_window === opt.value}
                      onChange={() => handleChange({ focus_window: opt.value })}
                      className="accent-[#7C6EF0]"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* AI Tone */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">AI Tone</h2>
            <p className="text-xs text-gray-400 mb-4">How should NudgeAI communicate with you?</p>
            {!settings ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-9 w-full" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {aiToneOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                      settings.ai_tone === opt.value ? 'bg-[#7C6EF0]/10' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ai_tone"
                      value={opt.value}
                      checked={settings.ai_tone === opt.value}
                      onChange={() => handleChange({ ai_tone: opt.value })}
                      className="accent-[#7C6EF0]"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">Notifications</h2>
                <p className="text-xs text-gray-400 mt-0.5">Enable nudges and reminders</p>
              </div>
              {!settings ? (
                <Skeleton className="h-6 w-11 rounded-full" />
              ) : (
                <button
                  role="switch"
                  aria-checked={settings.notifications_enabled}
                  onClick={() => handleChange({ notifications_enabled: !settings.notifications_enabled })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications_enabled ? 'bg-[#7C6EF0]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      settings.notifications_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">About NudgeAI</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Version</span>
                <span className="text-gray-400">0.1.0</span>
              </div>
              <div className="flex justify-between">
                <span>Backend</span>
                <span className="text-gray-400">localhost:8000</span>
              </div>
              <div className="flex justify-between">
                <span>AI Model</span>
                <span className="text-gray-400">claude-sonnet-4-6</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
