// src/app/settings/page.js
'use client'

import { useState, useEffect } from 'react'
import { Download, Upload, Trash2, Save } from 'lucide-react'
import { 
  getProfile, 
  updateProfile, 
  exportData, 
  importData,
  clearAllData 
} from '../../lib/db'
import { downloadJSON, readJSONFile } from '../../lib/utils'

export default function SettingsPage() {
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    pioneerType: 'regular',
    annualGoal: 600,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      setLoading(true)
      const data = await getProfile()
      setProfile(data)
      setFormData({
        pioneerType: data.pioneerType,
        annualGoal: data.annualGoal,
      })
    } catch (error) {
      showMessage('error', 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveSettings(e) {
    e.preventDefault()
    
    try {
      setSaving(true)
      await updateProfile(formData)
      showMessage('success', 'Settings saved successfully!')
      await loadProfile()
    } catch (error) {
      showMessage('error', 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  async function handleExport() {
    try {
      const data = await exportData()
      const filename = `ministry-data-${new Date().toISOString().split('T')[0]}.json`
      downloadJSON(data, filename)
      showMessage('success', 'Data exported successfully!')
    } catch (error) {
      showMessage('error', 'Failed to export data')
    }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await readJSONFile(file)
      const result = await importData(data)
      
      if (result.success) {
        showMessage('success', 'Data imported successfully!')
        await loadProfile()
      } else {
        showMessage('error', result.error || 'Failed to import data')
      }
    } catch (error) {
      showMessage('error', 'Invalid file format')
    }
    
    // Reset file input
    e.target.value = ''
  }

  async function handleClearAll() {
    if (!confirm('Are you sure you want to delete ALL data? This cannot be undone!')) {
      return
    }
    
    if (!confirm('This will permanently delete all your time entries, bible studies, and return visits. Are you absolutely sure?')) {
      return
    }

    try {
      await clearAllData()
    } catch (error) {
      showMessage('error', 'Failed to clear data')
    }
  }

  function showMessage(type, text) {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Profile Settings
        </h2>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Pioneer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pioneer Type
            </label>
            <select
              value={formData.pioneerType}
              onChange={(e) => setFormData({ ...formData, pioneerType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="regular">Regular Pioneer</option>
              <option value="auxiliary">Auxiliary Pioneer</option>
              <option value="special">Special Pioneer</option>
            </select>
          </div>

          {/* Annual Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Hour Goal
            </label>
            <input
              type="number"
              min="1"
              value={formData.annualGoal}
              onChange={(e) => setFormData({ ...formData, annualGoal: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Regular pioneers: 600 hours/year
            </p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Data Management
        </h2>

        <div className="space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Export Data</h3>
              <p className="text-sm text-gray-600">
                Download all your data as a JSON file for backup
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Import Data</h3>
              <p className="text-sm text-gray-600">
                Restore your data from a backup file
              </p>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Clear All */}
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h3 className="font-medium text-red-900">Clear All Data</h3>
              <p className="text-sm text-red-700">
                Permanently delete all your data (cannot be undone!)
              </p>
            </div>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          🔒 Your Privacy
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• All data is stored locally on your device</li>
          <li>• Nothing is sent to any server or cloud</li>
          <li>• Export your data regularly for backup</li>
          <li>• You have complete control over your information</li>
        </ul>
      </div>
    </div>
  )
}
