// src/components/ProgressStats.js
'use client'

import { formatHours, calculateProgress, getMonthlyGoal, getMonthName } from '../lib/utils'

export default function ProgressStats({ monthSummary, annualSummary, profile, currentDate }) {
  if (!monthSummary || !annualSummary || !profile) {
    return null
  }

  const monthlyGoal = getMonthlyGoal(profile.annualGoal)
  const monthProgress = calculateProgress(monthSummary.totalHours, monthlyGoal)
  const annualProgress = calculateProgress(annualSummary.totalHours, profile.annualGoal)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monthly Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {getMonthName(currentDate.month)} Progress
          </h2>
          <span className="text-sm text-gray-500">
            Goal: {monthlyGoal}h
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold text-primary-600">
              {formatHours(monthSummary.totalHours)}h
            </span>
            <span className="text-lg font-medium text-gray-600">
              {monthProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                monthProgress >= 100 
                  ? 'bg-green-500' 
                  : monthProgress >= 75 
                  ? 'bg-primary-500' 
                  : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.min(monthProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <div className="text-sm text-gray-600">Bible Studies</div>
            <div className="text-2xl font-bold text-gray-900">
              {monthSummary.totalBibleStudies}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Return Visits</div>
            <div className="text-2xl font-bold text-gray-900">
              {monthSummary.totalReturnVisits}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Days Active</div>
            <div className="text-2xl font-bold text-gray-900">
              {monthSummary.daysActive}
            </div>
          </div>
        </div>
      </div>

      {/* Annual Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentDate.year} Annual Progress
          </h2>
          <span className="text-sm text-gray-500">
            Goal: {profile.annualGoal}h
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-bold text-primary-600">
              {formatHours(annualSummary.totalHours)}h
            </span>
            <span className="text-lg font-medium text-gray-600">
              {annualProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                annualProgress >= 100 
                  ? 'bg-green-500' 
                  : annualProgress >= 75 
                  ? 'bg-primary-500' 
                  : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.min(annualProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <div className="text-sm text-gray-600">Total BS</div>
            <div className="text-2xl font-bold text-gray-900">
              {annualSummary.totalBibleStudies}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total RVs</div>
            <div className="text-2xl font-bold text-gray-900">
              {annualSummary.totalReturnVisits}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Avg/Month</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatHours(annualSummary.averageHoursPerMonth)}
            </div>
          </div>
        </div>

        {/* Pace indicator */}
        {annualProgress < 100 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              {annualProgress < 50 ? (
                <>💪 Keep going! You're building momentum.</>
              ) : annualProgress < 75 ? (
                <>📈 Great progress! You're on track.</>
              ) : (
                <>🎯 Excellent! Almost there!</>
              )}
            </div>
          </div>
        )}

        {annualProgress >= 100 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-green-800">
              🎉 Congratulations! You've reached your annual goal!
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
