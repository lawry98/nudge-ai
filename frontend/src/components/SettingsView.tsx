'use client'

export default function SettingsView() {
  return (
    <div className="flex-1 bg-[#F0F2F5] overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

        <div className="space-y-4">
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

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">AI Personality</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              NudgeAI is configured to be warm, empathetic, and concise. It will never lecture or be preachy.
              When you share why you're stuck, it responds with understanding and 1–2 small, actionable next steps.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Quick Replies</h2>
            <p className="text-xs text-gray-400 mb-3">Available in the chat panel after each AI message</p>
            <div className="flex flex-wrap gap-2">
              {["It feels overwhelming", "I don't know where to start", "I keep getting distracted", "I'm not in the mood"].map((r) => (
                <span key={r} className="text-xs px-3 py-1.5 rounded-full border-2 border-[#7C6EF0] text-[#7C6EF0]">{r}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
