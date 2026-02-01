// src/app/page.js
'use client'

import { useState, useEffect } from 'react'
import Calendar from '../components/Calendar'
import ProgressStats from '../components/ProgressStats'
import TimeEntryModal from '../components/TimeEntryModal'
import { getProfile, getMonthSummary, getAnnualSummary } from '../lib/db'
import { getCurrentMonthYear } from '../lib/utils'

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(getCurrentMonthYear())
  const [selectedDate, setSelectedDate] = useState(null)
  const [profile, setProfile] = useState(null)
  const [monthSummary, setMonthSummary] = useState(null)
  const [annualSummary, setAnnualSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [currentDate.year, currentDate.month])

  async function loadData() {
    try {
      setLoading(true)
      const [profileData, monthData, annualData] = await Promise.all([
        getProfile(),
        getMonthSummary(currentDate.year, currentDate.month),
        getAnnualSummary(currentDate.year),
      ])
      
      setProfile(profileData)
      setMonthSummary(monthData)
      setAnnualSummary(annualData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleDateClick(date) {
    setSelectedDate(date)
  }

  function handleModalClose() {
    setSelectedDate(null)
    loadData() // Refresh data after editing
  }

  function handleMonthChange(direction) {
    if (direction === 'prev') {
      if (currentDate.month === 1) {
        setCurrentDate({ year: currentDate.year - 1, month: 12 })
      } else {
        setCurrentDate({ ...currentDate, month: currentDate.month - 1 })
      }
    } else {
      if (currentDate.month === 12) {
        setCurrentDate({ year: currentDate.year + 1, month: 1 })
      } else {
        setCurrentDate({ ...currentDate, month: currentDate.month + 1 })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Stats */}
      <ProgressStats
        monthSummary={monthSummary}
        annualSummary={annualSummary}
        profile={profile}
        currentDate={currentDate}
      />

      {/* Calendar */}
      <div className="mt-8">
        <Calendar
          year={currentDate.year}
          month={currentDate.month}
          onDateClick={handleDateClick}
          onMonthChange={handleMonthChange}
        />
      </div>

      {/* Time Entry Modal */}
      {selectedDate && (
        <TimeEntryModal
          date={selectedDate}
          onClose={handleModalClose}
        />
      )}

      {/* Quick Help */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Quick Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Click any day to add or edit your time</li>
          <li>• Use decimals for minutes: 0.25 = 15min, 0.5 = 30min, 0.75 = 45min</li>
          <li>• Your data is saved automatically and stored locally</li>
          <li>• Export your data regularly from Settings for backup</li>
        </ul>
      </div>
    </div>
  )
}
