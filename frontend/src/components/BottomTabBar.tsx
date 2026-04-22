'use client'

type NavItem = 'tasks' | 'checkins' | 'progress' | 'settings'

const navItems: { id: NavItem; label: string; icon: string }[] = [
  { id: 'tasks', label: 'Tasks', icon: '✓' },
  { id: 'checkins', label: 'Check-ins', icon: '💬' },
  { id: 'progress', label: 'Progress', icon: '📈' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

interface BottomTabBarProps {
  activeNav: NavItem
  onNavChange: (nav: NavItem) => void
}

export default function BottomTabBar({ activeNav, onNavChange }: BottomTabBarProps) {
  return (
    <nav className="md:hidden flex border-t border-gray-200 bg-white">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavChange(item.id)}
          className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${
            activeNav === item.id ? 'text-[#7C6EF0]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="text-base leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
