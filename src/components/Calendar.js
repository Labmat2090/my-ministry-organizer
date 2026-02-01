// src/components/Calendar.js
'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMonthEntries } from '../lib/db'
import { 
  getMonthName, 
  generateCalendarGrid, 
  isToday, 
  formatHours 
} from '../lib/utils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
    } catch (error) {
      console.error('Failed to load entries:', error)
    } finally {
      setLoading(false)
    }
  }

  function getEntryForDay(day) {
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return entries.find(e => e.entryDate === dateString)
  }

  const calendarGrid = generateCalendarGrid(year, month)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-primary-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onMonthChange('prev')}
            className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold">
            {getMonthName(month)} {year}
          </h2>

          <button
            onClick={() => onMonthChange('next')}
            className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="bg-white">
        {calendarGrid.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-200 last:border-b-0">
            {week.map((day, dayIndex) => {
              if (!day) {
                return <div key={dayIndex} className="min-h-[100px] bg-gray-50" />
              }

              const entry = getEntryForDay(day)
              const hasEntry = entry && entry.hours > 0
              const todayClass = isToday(year, month, day) ? 'ring-2 ring-primary-500' : ''
              
              return (
                <button
                  key={dayIndex}
                  onClick={() => onDateClick({ year, month, day })}
                  className={`min-h-[100px] p-2 text-left hover:bg-gray-50 transition-colors border-r border-gray-200 last:border-r-0 ${todayClass}`}
                >
                  <div className="flex flex-col h-full">
                    {/* Day number */}
                    <div className={`text-sm font-medium mb-2 ${
                      isToday(year, month, day) 
                        ? 'text-primary-600 font-bold' 
                        : 'text-gray-900'
                    }`}>
                      {day}
                    </div>

                    {/* Entry data */}
                    {hasEntry && (
                      <div className="mt-auto space-y-1">
                        <div className="text-lg font-bold text-primary-600">
                          {formatHours(entry.hours)}h
                        </div>
                        {entry.bibleStudies > 0 && (
                          <div className="text-xs text-gray-600">
                            📖 {entry.bibleStudies} BS
                          </div>
                        )}
                        {entry.returnVisits > 0 && (
                          <div className="text-xs text-gray-600">
                            🏠 {entry.returnVisits} RV
                          </div>
                        )}
                      </div>
                    )}

                    {/* Empty state hint */}
                    {!hasEntry && (
                      <div className="mt-auto text-xs text-gray-400">
                        Click to add
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      )}
    </div>
  )
}
