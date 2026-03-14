'use client'

import { useState } from 'react'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'shelby-theme'

function getThemeFromDom(): Theme {
  if (typeof document === 'undefined') return 'dark'
  const root = document.documentElement
  const attr = root.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  return root.classList.contains('dark') ? 'dark' : 'light'
}

function applyTheme(next: Theme) {
    if (typeof document === 'undefined') return
    const root = document.documentElement
  root.setAttribute('data-theme', next)
  // Align with Tailwind dark variant + @shelby-protocol/ui which uses `.dark`
  root.classList.toggle('dark', next === 'dark')
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getThemeFromDom())

  const toggle = () => {
    if (typeof document === 'undefined') return
    const next: Theme = theme === 'dark' ? 'light' : 'dark'

    applyTheme(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    setTheme(next)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="group inline-flex items-center gap-1 rounded-full border border-border/70 bg-surface/80 px-2 py-1 text-[10px] font-medium tracking-[0.18em] uppercase text-muted shadow-sm transition-colors duration-200 hover:border-emerald-300/70 hover:text-foreground"
    >
      <span
        className="relative flex h-4 w-7 items-center rounded-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 p-[1px]"
        aria-hidden="true"
      >
        <span
          className={`inline-flex h-3 w-3 transform rounded-full bg-white shadow-[0_0_16px_rgba(96,165,250,0.8)] transition-transform duration-200 ease-out ${
            isDark ? 'translate-x-3' : 'translate-x-0'
          }`}
        />
      </span>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
}

