import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { Icon } from '../../components/UI'
import { useLocale } from '../../contexts/LocaleContext'

export default function AdminSettings() {
  const { t, locale } = useLocale()
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
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-secondary-600">Loading settings...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* General Settings */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">
              {locale === 'ar' ? 'الإعدادات العامة' : 'General Settings'}
            </h2>
            <p className="text-secondary-600">
              {locale === 'ar' ? 'تكوين الموقع الأساسي' : 'Basic site configuration'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">{locale === 'ar' ? 'اسم الموقع' : 'Site Name'}</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">{locale === 'ar' ? 'البريد الإلكتروني للموقع' : 'Site Email'}</label>
              <input
                type="email"
                value={settings.siteEmail}
                onChange={(e) => handleInputChange('siteEmail', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="label">{locale === 'ar' ? 'وضع الصيانة' : 'Maintenance Mode'}</label>
                  <p className="text-sm text-secondary-600">
                    {locale === 'ar' ? 'وضع الموقع في وضع الصيانة' : 'Put the site in maintenance mode'}
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-primary-600' : 'bg-secondary-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="label">{locale === 'ar' ? 'السماح بالتسجيلات' : 'Allow Registrations'}</label>
                  <p className="text-sm text-secondary-600">
                    {locale === 'ar' ? 'تمكين تسجيل مستخدمين جدد' : 'Enable new user registrations'}
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('allowRegistrations', !settings.allowRegistrations)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.allowRegistrations ? 'bg-primary-600' : 'bg-secondary-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.allowRegistrations ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="label">{locale === 'ar' ? 'تطلب التحقق من البريد الإلكتروني' : 'Require Email Verification'}</label>
                  <p className="text-sm text-secondary-600">
                    {locale === 'ar' ? 'يجب على المستخدمين التحقق من بريدهم الإلكتروني لاستخدام المنصة' : 'Users must verify email to use the platform'}
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('requireEmailVerification', !settings.requireEmailVerification)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.requireEmailVerification ? 'bg-primary-600' : 'bg-secondary-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">
              {locale === 'ar' ? 'إعدادات الإعلانات' : 'Listing Settings'}
            </h2>
            <p className="text-secondary-600">
              {locale === 'ar' ? 'تكوين سلوك الإعلانات' : 'Configure listing behavior'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">{locale === 'ar' ? 'الحد الأقصى للإعلانات لكل مستخدم' : 'Max Listings Per User'}</label>
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
              <label className="label">{locale === 'ar' ? 'الحد الأقصى للصور لكل إعلان' : 'Max Images Per Listing'}</label>
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
              <label className="label">{locale === 'ar' ? 'المدة الافتراضية للإعلان (بالأيام)' : 'Default Listing Duration (days)'}</label>
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
              <label className="label">{locale === 'ar' ? 'سعر الإعلان المميز ($)' : 'Featured Listing Price ($)'}</label>
              <input
                type="number"
                value={settings.featuredListingPrice}
                onChange={(e) => handleInputChange('featuredListingPrice', parseInt(e.target.value))}
                className="input"
                min="0"
                max="1000"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="label">{locale === 'ar' ? 'تمكين المراسلات' : 'Enable Messaging'}</label>
                  <p className="text-sm text-secondary-600">
                    {locale === 'ar' ? 'السماح للمستخدمين بإرسال الرسائل' : 'Allow users to send messages'}
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('enableMessaging', !settings.enableMessaging)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableMessaging ? 'bg-primary-600' : 'bg-secondary-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.enableMessaging ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="label">{locale === 'ar' ? 'تمكين التقييمات' : 'Enable Reviews'}</label>
                  <p className="text-sm text-secondary-600">
                    {locale === 'ar' ? 'السماح للمستخدمين بكتابة التقييمات' : 'Allow users to write reviews'}
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('enableReviews', !settings.enableReviews)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableReviews ? 'bg-primary-600' : 'bg-secondary-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.enableReviews ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="label">{locale === 'ar' ? 'تمكين الإيجارات' : 'Enable Rentals'}</label>
                  <p className="text-sm text-secondary-600">
                    {locale === 'ar' ? 'السماح بتأجير المركبات' : 'Allow vehicle rentals'}
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('enableRentals', !settings.enableRentals)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableRentals ? 'bg-primary-600' : 'bg-secondary-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.enableRentals ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="label">{locale === 'ar' ? 'تمكين الإعلانات المصنفة' : 'Enable Classifieds'}</label>
                  <p className="text-sm text-secondary-600">
                    {locale === 'ar' ? 'السماح بالإعلانات المصنفة' : 'Allow classified ads'}
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('enableClassifieds', !settings.enableClassifieds)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableClassifieds ? 'bg-primary-600' : 'bg-secondary-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">
              {locale === 'ar' ? 'الإعدادات المالية' : 'Financial Settings'}
            </h2>
            <p className="text-secondary-600">
              {locale === 'ar' ? 'إعدادات الدفع والعمولة' : 'Payment and commission settings'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">{locale === 'ar' ? 'معدل العمولة (%)' : 'Commission Rate (%)'}</label>
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

        {/* Quick Actions */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">
              {locale === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
            </h2>
            <p className="text-secondary-600">
              {locale === 'ar' ? 'المهام الإدارية الشائعة' : 'Common administrative tasks'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn btn-secondary">
              {locale === 'ar' ? 'إرسال النشرة الإخبارية' : 'Send Newsletter'}
            </button>
            <button className="btn btn-secondary">
              {locale === 'ar' ? 'مسح الذاكرة المؤقتة' : 'Clear Cache'}
            </button>
            <button className="btn btn-secondary">
              {locale === 'ar' ? 'تصدير البيانات' : 'Export Data'}
            </button>
            <button className="btn btn-secondary">
              {locale === 'ar' ? 'تشغيل الصيانة' : 'Run Maintenance'}
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <span>{locale === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
            ) : (
              <span>{locale === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}</span>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}