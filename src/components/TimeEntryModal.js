// src/components/TimeEntryModal.js
'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getTimeEntry, saveTimeEntry, deleteTimeEntry } from '../lib/db'
import { formatDisplayDate, validateHours } from '../lib/utils'

export default function TimeEntryModal({ date, onClose }) {
  const [formData, setFormData] = useState({
    hours: '',
    bibleStudies: '0',
    returnVisits: '0',
    notes: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const dateString = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`

  useEffect(() => {
    loadEntry()
  }, [date])

  async function loadEntry() {
    try {
      setLoading(true)
      const entry = await getTimeEntry(dateString)
      if (entry) {
        setFormData({
          hours: entry.hours.toString(),
          bibleStudies: entry.bibleStudies.toString(),
          returnVisits: entry.returnVisits.toString(),
          notes: entry.notes || '',
        })
      }
    } catch (err) {
      console.error('Failed to load entry:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validate hours
    const hoursValidation = validateHours(formData.hours || 0)
    if (!hoursValidation.valid) {
      setError(hoursValidation.error)
      return
    }

    try {
      setSaving(true)
      await saveTimeEntry(dateString, {
        hours: parseFloat(formData.hours || 0),
        bibleStudies: parseInt(formData.bibleStudies || 0),
        returnVisits: parseInt(formData.returnVisits || 0),
        notes: formData.notes,
      })
      onClose()
    } catch (err) {
      console.error('Failed to save entry:', err)
      setError('Failed to save entry. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this entry?')) return

    try {
      setSaving(true)
      await deleteTimeEntry(dateString)
      onClose()
    } catch (err) {
      console.error('Failed to delete entry:', err)
      setError('Failed to delete entry. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {formatDisplayDate(date.year, date.month, date.day)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="24"
                  value={formData.hours}
                  onChange={(e) => handleChange('hours', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                  autoFocus
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tip: 0.25 = 15min, 0.5 = 30min, 0.75 = 45min
                </p>
              </div>

              {/* Bible Studies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bible Studies Conducted
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bibleStudies}
                  onChange={(e) => handleChange('bibleStudies', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Return Visits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Visits Made
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.returnVisits}
                  onChange={(e) => handleChange('returnVisits', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Add notes about your day..."
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                disabled={saving}
              >
                Delete
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
