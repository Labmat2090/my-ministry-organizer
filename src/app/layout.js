'use client'

import { DM_Sans, Playfair_Display } from 'next/font/google'
import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { Moon, Sun, BookOpen } from 'lucide-react'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['600', '700'] })

export default function RootLayout({ children }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  function toggleDark() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <title>My Ministry Organizer</title>
        <meta name="description" content="Field service organizer for pioneers" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#2d8a52" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>

          {/* Header */}
          <header className="no-print sticky top-0 z-20 border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">

                {/* Brand */}
                <a href="/" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-display text-base font-semibold leading-tight" style={{ color: 'var(--color-text)' }}>
                      Ministry Organizer
                    </div>
                    <div className="text-xs leading-tight" style={{ color: 'var(--color-muted)' }}>
                      Field service tracker
                    </div>
                  </div>
                </a>

                {/* Nav */}
                <div className="flex items-center gap-1">
                  <a href="/" className="btn-ghost text-sm px-4 py-2 rounded-lg">Calendar</a>
                  <a href="/settings" className="btn-ghost text-sm px-4 py-2 rounded-lg">Settings</a>
                  <button
                    onClick={toggleDark}
                    className="btn-ghost w-9 h-9 p-0 rounded-lg ml-1"
                    aria-label="Toggle dark mode"
                  >
                    {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="no-print border-t mt-auto" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                  Your data is stored locally on your device
                </p>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-muted)' }}>
                  <span>🔒 Privacy First</span>
                  <span>•</span>
                  <span>📴 Offline Ready</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}