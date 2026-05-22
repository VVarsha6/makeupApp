import React from 'react'
import { Settings, FlaskConical } from 'lucide-react'

export default function Header({ onSettingsClick, currentPage }) {
  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-ink-900 rounded-lg flex items-center justify-center">
            <FlaskConical size={16} className="text-cream-100" />
          </div>
          <span className="font-display text-xl font-semibold text-ink-900 tracking-tight">
            SkinLens
          </span>
        </div>

        {/* Nav */}
        <button
          onClick={onSettingsClick}
          className={`flex items-center gap-1.5 text-sm font-body font-medium px-3 py-1.5 rounded-full transition-all ${
            currentPage === 'settings'
              ? 'bg-ink-900 text-white'
              : 'text-ink-500 hover:text-ink-900 hover:bg-cream-200'
          }`}
        >
          <Settings size={15} />
          Profile
        </button>
      </div>
    </header>
  )
}
