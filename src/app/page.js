'use client'

import { useState, useEffect } from 'react'
import Calendar from '../components/Calendar'
import ProgressStats from '../components/ProgressStats'
import TimeEntryModal from '../components/TimeEntryModal'
import { getProfile, getMonthSummary, getAnnualSummary, getYearEntries } from '../lib/db'
import { getCurrentMonthYear } from '../lib/utils'

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// Year heatmap component
function YearHeatmap({ entries, year }) {
  const map = {}
  entries.forEach(e => { map[e.entryDate] = e.hours })

  const weeks = []
  const start = new Date(year, 0, 1)
  const startDow = start.getDay()

  // Pad to start of week
  const cells = []
  for (let i = 0; i < startDow; i++) cells.push(null)

  const daysInYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365
  for (let d = 0; d < daysInYear; d++) {
    const date = new Date(year, 0, d + 1)
    const ds = date.toISOString().split('T')[0]
    cells.push({ date: ds, hours: map[ds] || 0, month: date.getMonth(), day: date.getDate() })
  }

  // Chunk into weeks
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  function getColor(hours) {
    if (!hours) return 'var(--color-border)'
    if (hours < 1)  return 'color-mix(in srgb, var(--color-primary) 25%, var(--color-surface))'
    if (hours < 3)  return 'color-mix(in srgb, var(--color-primary) 45%, var(--color-surface))'
    if (hours < 5)  return 'color-mix(in srgb, var(--color-primary) 65%, var(--color-surface))'
    return 'var(--color-primary)'
  }

  return (
    <div className="card p-5 animate-fade-up delay-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-semibold" style={{ color: 'var(--color-text)' }}>
          {year} Activity
        </h3>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
          <span>Less</span>
          {[25, 45, 65, 100].map((p, i) => (
            <div
              key={i}
              style={{
                width: 12, height: 12, borderRadius: 2,
                background: `color-mix(in srgb, var(--color-primary) ${p}%, var(--color-surface))`
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 3, minWidth: 'fit-content' }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {Array.from({ length: 7 }).map((_, di) => {
                const cell = week[di]
                if (!cell) return <div key={di} style={{ width: 12, height: 12 }} />
                return (
                  <div
                    key={di}
                    title={`${cell.date}: ${cell.hours}h`}
                    style={{
                      width: 12, height: 12, borderRadius: 2,
                      background: getColor(cell.hours),
                      transition: 'transform 0.1s',
                      cursor: cell.hours > 0 ? 'pointer' : 'default',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.4)'}
                    onMouseLeave={e => e.currentTarget.style.transform = ''}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Month labels */}
        <div style={{ display: 'flex', marginTop: 6, gap: 0 }}>
          {MONTHS_SHORT.map((m, i) => {
            // Find which week column this month starts at
            const firstDay = new Date(year, i, 1)
            const dayNum = Math.floor((firstDay - new Date(year, 0, 1)) / 86400000)
            const weekIdx = Math.floor((dayNum + startDow) / 7)
            return (
              <div
                key={m}
                style={{
                  position: 'absolute',
                  left: weekIdx * 15,
                  fontSize: 10,
                  color: 'var(--color-muted)',
                }}
              />
            )
          })}
          {/* Simple evenly spaced labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 10, color: 'var(--color-muted)' }}>
            {MONTHS_SHORT.map(m => <span key={m}>{m}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(getCurrentMonthYear())
  const [selectedDate, setSelectedDate] = useState(null)
  const [profile, setProfile] = useState(null)
  const [monthSummary, setMonthSummary] = useState(null)
  const [annualSummary, setAnnualSummary] = useState(null)
  const [yearEntries, setYearEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [currentDate.year, currentDate.month])

  async function loadData() {
    try {
      setLoading(true)
      const [profileData, monthData, annualData, yearData] = await Promise.all([
        getProfile(),
        getMonthSummary(currentDate.year, currentDate.month),
        getAnnualSummary(currentDate.year),
        getYearEntries(currentDate.year),
      ])
      setProfile(profileData)
      setMonthSummary(monthData)
      setAnnualSummary(annualData)
      setYearEntries(yearData)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleMonthChange(dir) {
    if (dir === 'prev') {
      setCurrentDate(d => d.month === 1 ? { year: d.year - 1, month: 12 } : { ...d, month: d.month - 1 })
    } else {
      setCurrentDate(d => d.month === 12 ? { year: d.year + 1, month: 1 } : { ...d, month: d.month + 1 })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto"
            style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
          />
          <p className="mt-4 text-sm" style={{ color: 'var(--color-muted)' }}>Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Progress stats */}
      <ProgressStats
        monthSummary={monthSummary}
        annualSummary={annualSummary}
        profile={profile}
        currentDate={currentDate}
      />

      {/* Calendar */}
      <Calendar
        year={currentDate.year}
        month={currentDate.month}
        onDateClick={setSelectedDate}
        onMonthChange={handleMonthChange}
      />

      {/* Year heatmap */}
      <YearHeatmap entries={yearEntries} year={currentDate.year} />

      {/* Modal */}
      {selectedDate && (
        <TimeEntryModal
          date={selectedDate}
          onClose={() => { setSelectedDate(null); loadData() }}
        />
      )}

      {/* Tips */}
      <div
        className="rounded-xl p-5 text-sm animate-fade-up"
        style={{ background: 'var(--color-primary-l)', border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)' }}
      >
        <h3 className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Quick Tips</h3>
        <ul className="space-y-1" style={{ color: 'color-mix(in srgb, var(--color-primary) 80%, var(--color-text))' }}>
          <li>• Click any day to log or edit time</li>
          <li>• Use quick-preset buttons (0.5h, 1h, 2h…) in the entry form</li>
          <li>• Decimals: 0.25 = 15 min · 0.5 = 30 min · 0.75 = 45 min</li>
          <li>• Export your data regularly from Settings for backup</li>
        </ul>
      </div>
    </div>
  )
}