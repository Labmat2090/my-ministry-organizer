'use client'

import { useState, useEffect } from 'react'
import { X, Clock, BookOpen, Home, FileText, Trash2 } from 'lucide-react'
import { getTimeEntry, saveTimeEntry, deleteTimeEntry } from '../lib/db'
import { formatDisplayDate, validateHours } from '../lib/utils'

const QUICK_HOURS = [0.5, 1, 1.5, 2, 3, 4]

function Counter({ label, icon, value, onChange }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
        <span style={{ color: 'var(--color-primary)' }}>{icon}</span>
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-all"
          style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-border)', color: 'var(--color-text)' }}
        >
          −
        </button>
        <span className="font-mono-num text-xl font-bold w-8 text-center" style={{ color: 'var(--color-text)' }}>
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-all"
          style={{ background: 'var(--color-primary)', color: 'white', border: 'none' }}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function TimeEntryModal({ date, onClose }) {
  const [formData, setFormData] = useState({ hours: '', bibleStudies: 0, returnVisits: 0, notes: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [hasExisting, setHasExisting] = useState(false)

  const dateString = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`

  useEffect(() => {
    loadEntry()
  }, [date])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  async function loadEntry() {
    try {
      setLoading(true)
      const entry = await getTimeEntry(dateString)
      if (entry) {
        setHasExisting(true)
        setFormData({
          hours: entry.hours.toString(),
          bibleStudies: entry.bibleStudies || 0,
          returnVisits: entry.returnVisits || 0,
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
    const h = parseFloat(formData.hours || 0)
    if (isNaN(h) || h < 0 || h > 24) {
      setError('Please enter a valid number of hours (0–24)')
      return
    }
    try {
      setSaving(true)
      await saveTimeEntry(dateString, {
        hours: h,
        bibleStudies: formData.bibleStudies,
        returnVisits: formData.returnVisits,
        notes: formData.notes,
      })
      onClose()
    } catch (err) {
      setError('Failed to save. Please try again.')
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
    } catch {
      setError('Failed to delete.')
    } finally {
      setSaving(false)
    }
  }

  const selectedHours = parseFloat(formData.hours)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{
          background: 'var(--color-surface)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          maxHeight: '92vh',
          overflowY: 'auto',
          animation: 'fade-up 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div>
            <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
              Log Time
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
              {formatDisplayDate(date.year, date.month, date.day)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost w-9 h-9 p-0 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 space-y-6">

              {/* Hours */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                  <Clock className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  Hours
                </label>

                {/* Quick presets */}
                <div className="grid grid-cols-6 gap-1.5 mb-3">
                  {QUICK_HOURS.map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, hours: h.toString() }))}
                      className="py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: selectedHours === h ? 'var(--color-primary)' : 'var(--color-bg)',
                        color: selectedHours === h ? 'white' : 'var(--color-text)',
                        border: `1.5px solid ${selectedHours === h ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      }}
                    >
                      {h}h
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="24"
                  value={formData.hours}
                  onChange={e => setFormData(f => ({ ...f, hours: e.target.value }))}
                  className="input-field font-mono-num"
                  placeholder="or enter custom amount"
                  autoFocus
                />
                <p className="mt-1.5 text-xs" style={{ color: 'var(--color-muted)' }}>
                  0.25 = 15 min · 0.5 = 30 min · 0.75 = 45 min
                </p>
              </div>

              {/* Counters */}
              <div className="grid grid-cols-2 gap-6">
                <Counter
                  label="Bible Studies"
                  icon={<BookOpen className="w-3.5 h-3.5" />}
                  value={formData.bibleStudies}
                  onChange={v => setFormData(f => ({ ...f, bibleStudies: v }))}
                />
                <Counter
                  label="Return Visits"
                  icon={<Home className="w-3.5 h-3.5" />}
                  value={formData.returnVisits}
                  onChange={v => setFormData(f => ({ ...f, returnVisits: v }))}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  <FileText className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  Notes <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Notes about your day..."
                />
              </div>

              {error && (
                <div
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
                >
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-6 py-4 border-t"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
            >
              {hasExisting ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                  style={{ color: 'var(--color-danger)' }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              ) : <div />}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="btn-ghost px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary px-6 py-2 rounded-lg"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}