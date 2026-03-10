'use client'

interface QuickReplyButtonProps {
  label: string
  onClick: (text: string) => void
  disabled?: boolean
}

export default function QuickReplyButton({ label, onClick, disabled }: QuickReplyButtonProps) {
  return (
    <button
      onClick={() => onClick(label)}
      disabled={disabled}
      className="text-xs font-medium px-3 py-1.5 rounded-full border-2 border-[#7C6EF0] text-[#7C6EF0] bg-white hover:bg-[#7C6EF0] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {label}
    </button>
  )
}
