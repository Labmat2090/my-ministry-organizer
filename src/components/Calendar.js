'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMonthEntries } from '../lib/db'
import { getMonthName, generateCalendarGrid, isToday, formatHours } from '../lib/utils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getIntensityStyle(hours) {
  if (!hours || hours === 0) return null
  if (hours < 1)  return { bg: 'color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))', dot: 'var(--color-primary)' }
  if (hours < 3)  return { bg: 'color-mix(in srgb, var(--color-primary) 22%, var(--color-surface))', dot: 'var(--color-primary)' }
  if (hours < 5)  return { bg: 'color-mix(in srgb, var(--color-primary) 35%, var(--color-surface))', dot: 'var(--color-primary)' }
  return          { bg: 'color-mix(in srgb, var(--color-primary) 50%, var(--color-surface))', dot: 'var(--color-primary)' }
}

export default function Calendar({ year, month, onDateClick, onMonthChange }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEntries()
  }, [year, month])

  async function loadEntries() {
    try {
      setLoading(true)
      const data = await getMonthEntries(year, month)
      setEntries(data)
    } catch (err) {
      console.error('Failed to load entries:', err)
    } finally {
      setLoading(false)
    }
  }

  function getEntry(day) {
    const ds = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return entries.find(e => e.entryDate === ds)
  }

  const grid = generateCalendarGrid(year, month)
  const totalHours = entries.reduce((s, e) => s + e.hours, 0)

  return (
    <div className="card overflow-hidden animate-fade-up delay-200">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => onMonthChange('prev')}
          className="btn-ghost w-9 h-9 p-0 rounded-lg"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
            {getMonthName(month)} {year}
          </h2>
          {totalHours > 0 && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
              {formatHours(totalHours)}h logged this month
            </p>
          )}
        </div>

        <button
          onClick={() => onMonthChange('next')}
          className="btn-ghost w-9 h-9 p-0 rounded-lg"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Weekday labels ── */}
      <div className="grid grid-cols-7" style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
        {WEEKDAYS.map(d => (
          <div
            key={d}
            className="py-2.5 text-center text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-muted)' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      <div style={{ background: 'var(--color-surface)' }}>
        {grid.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7" style={{ borderBottom: wi < grid.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
            {week.map((day, di) => {
              if (!day) {
                return (
                  <div
                    key={di}
                    className="min-h-[88px]"
                    style={{
                      borderRight: di < 6 ? '1px solid var(--color-border)' : 'none',
                      background: 'var(--color-bg)',
                      opacity: 0.5,
                    }}
                  />
                )
              }

              const entry = getEntry(day)
              const hours = entry?.hours || 0
              const intensity = getIntensityStyle(hours)
              const today = isToday(year, month, day)

              return (
                <button
                  key={di}
                  onClick={() => onDateClick({ year, month, day })}
                  style={{
                    minHeight: '88px',
                    padding: '10px 10px 8px',
                    textAlign: 'left',
                    borderRight: di < 6 ? '1px solid var(--color-border)' : 'none',
                    background: intensity ? intensity.bg : 'var(--color-surface)',
                    transition: 'background 0.15s, transform 0.1s',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.96)' }}
                  onMouseLeave={e => { e.currentTarget.style.filter = '' }}
                >
                  {/* Day number */}
                  <div style={{ marginBottom: 6 }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        fontSize: 13,
                        fontWeight: today ? 700 : 500,
                        background: today ? 'var(--color-primary)' : 'transparent',
                        color: today ? 'white' : 'var(--color-text)',
                      }}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Entry content */}
                  {hours > 0 ? (
                    <div>
                      <div
                        className="font-mono-num text-base font-bold leading-none"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {formatHours(hours)}h
                      </div>
                      <div className="flex flex-col gap-0.5 mt-1.5">
                        {entry.bibleStudies > 0 && (
                          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                            📖 {entry.bibleStudies}
                          </span>
                        )}
                        {entry.returnVisits > 0 && (
                          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                            🏠 {entry.returnVisits}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-xs"
                      style={{ color: 'var(--color-border)', marginTop: 2 }}
                    >
                      + add
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* ── Legend ── */}
      <div
        className="flex items-center justify-end gap-3 px-6 py-3 text-xs border-t"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-muted)' }}
      >
        <span>Less</span>
        {[12, 22, 35, 50].map((p, i) => (
          <div
            key={i}
            style={{
              width: 14, height: 14, borderRadius: 3,
              background: `color-mix(in srgb, var(--color-primary) ${p}%, var(--color-surface))`
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}