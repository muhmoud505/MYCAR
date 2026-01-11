import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Icon } from '../../components/UI'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'MYCAR',
    siteEmail: 'admin@mycar.com',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    maxListingsPerUser: 10,
    maxImagesPerListing: 10,
    enableMessaging: true,
    enableReviews: true,
    enableRentals: true,
    enableClassifieds: true,
    defaultListingDuration: 30,
    featuredListingPrice: 50,
    commissionRate: 5,
    supportEmail: 'support@mycar.com',
    supportPhone: '+1-555-0123'
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()
      if (data.ok) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })

      const data = await response.json()
      if (data.ok) {
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <AdminLayout title="Settings">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-secondary-600">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Admin Settings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="p-6 border-b border-secondary-200">
                <h3 className="text-lg font-medium text-secondary-900">General Settings</h3>
                <p className="text-sm text-secondary-600 mt-1">Basic site configuration</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Site Email
                    </label>
                    <input
                      type="email"
                      value={settings.siteEmail}
                      onChange={(e) => handleInputChange('siteEmail', e.target.value)}
                      className="input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">
                        Maintenance Mode
                      </label>
                      <p className="text-xs text-secondary-500">
                        Put the site in maintenance mode
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.maintenanceMode ? 'bg-primary-600' : 'bg-secondary-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">
                        Allow Registrations
                      </label>
                      <p className="text-xs text-secondary-500">
                        Enable new user registrations
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('allowRegistrations', !settings.allowRegistrations)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.allowRegistrations ? 'bg-primary-600' : 'bg-secondary-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.allowRegistrations ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">
                        Require Email Verification
                      </label>
                      <p className="text-xs text-secondary-500">
                        Users must verify email to use the platform
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('requireEmailVerification', !settings.requireEmailVerification)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.requireEmailVerification ? 'bg-primary-600' : 'bg-secondary-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Listing Settings */}
            <div className="card">
              <div className="p-6 border-b border-secondary-200">
                <h3 className="text-lg font-medium text-secondary-900">Listing Settings</h3>
                <p className="text-sm text-secondary-600 mt-1">Configure listing behavior</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Max Listings Per User
                    </label>
                    <input
                      type="number"
                      value={settings.maxListingsPerUser}
                      onChange={(e) => handleInputChange('maxListingsPerUser', parseInt(e.target.value))}
                      className="input"
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Max Images Per Listing
                    </label>
                    <input
                      type="number"
                      value={settings.maxImagesPerListing}
                      onChange={(e) => handleInputChange('maxImagesPerListing', parseInt(e.target.value))}
                      className="input"
                      min="1"
                      max="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Default Listing Duration (days)
                    </label>
                    <input
                      type="number"
                      value={settings.defaultListingDuration}
                      onChange={(e) => handleInputChange('defaultListingDuration', parseInt(e.target.value))}
                      className="input"
                      min="1"
                      max="365"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Featured Listing Price ($)
                    </label>
                    <input
                      type="number"
                      value={settings.featuredListingPrice}
                      onChange={(e) => handleInputChange('featuredListingPrice', parseInt(e.target.value))}
                      className="input"
                      min="0"
                      max="1000"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">
                        Enable Messaging
                      </label>
                      <p className="text-xs text-secondary-500">
                        Allow users to send messages
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('enableMessaging', !settings.enableMessaging)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.enableMessaging ? 'bg-primary-600' : 'bg-secondary-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.enableMessaging ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">
                        Enable Reviews
                      </label>
                      <p className="text-xs text-secondary-500">
                        Allow users to write reviews
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('enableReviews', !settings.enableReviews)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.enableReviews ? 'bg-primary-600' : 'bg-secondary-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.enableReviews ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">
                        Enable Rentals
                      </label>
                      <p className="text-xs text-secondary-500">
                        Allow vehicle rentals
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('enableRentals', !settings.enableRentals)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.enableRentals ? 'bg-primary-600' : 'bg-secondary-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.enableRentals ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">
                        Enable Classifieds
                      </label>
                      <p className="text-xs text-secondary-500">
                        Allow classified ads
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('enableClassifieds', !settings.enableClassifieds)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.enableClassifieds ? 'bg-primary-600' : 'bg-secondary-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.enableClassifieds ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Settings */}
            <div className="card">
              <div className="p-6 border-b border-secondary-200">
                <h3 className="text-lg font-medium text-secondary-900">Financial Settings</h3>
                <p className="text-sm text-secondary-600 mt-1">Payment and commission settings</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      value={settings.commissionRate}
                      onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value))}
                      className="input"
                      min="0"
                      max="50"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Info */}
            <div className="card">
              <div className="p-6 border-b border-secondary-200">
                <h3 className="text-lg font-medium text-secondary-900">Support Information</h3>
                <p className="text-sm text-secondary-600 mt-1">Customer support details</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Support Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.supportPhone}
                    onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="p-6 border-b border-secondary-200">
                <h3 className="text-lg font-medium text-secondary-900">Quick Actions</h3>
                <p className="text-sm text-secondary-600 mt-1">Common administrative tasks</p>
              </div>
              <div className="p-6 space-y-3">
                <button className="btn btn-secondary w-full text-left">
                  <Icon icon="mail" className="w-4 h-4 mr-2" />
                  Send Newsletter
                </button>
                <button className="btn btn-secondary w-full text-left">
                  <Icon icon="search" className="w-4 h-4 mr-2" />
                  Clear Cache
                </button>
                <button className="btn btn-secondary w-full text-left">
                  <Icon icon="download" className="w-4 h-4 mr-2" />
                  Export Data
                </button>
                <button className="btn btn-secondary w-full text-left">
                  <Icon icon="check" className="w-4 h-4 mr-2" />
                  Run Maintenance
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="card">
              <div className="p-6">
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="btn btn-primary w-full"
                >
                  {saving ? (
                    <>
                      <div className="loading-spinner w-4 h-4 mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Icon icon="check" className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
