import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import { useLocale } from '../../contexts/LocaleContext'
import { Icon } from '../../components/UI'
import { api } from '../../utils/api'

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }
    
    if (isAuthenticated && user) {
      loadProfile()
    }
  }, [isAuthenticated, loading, user])

  const loadProfile = async () => {
    try {
      const response = await api.get('/api/accounts/me')
      if (response.ok) {
        setProfileData({
          name: response.profile.name || '',
          email: response.profile.email || '',
          phone: response.profile.phone || '',
          bio: response.profile.bio || '',
          location: response.profile.location || '',
          website: response.profile.website || '',
          facebook: response.profile.facebook || '',
          twitter: response.profile.twitter || '',
          instagram: response.profile.instagram || '',
          linkedin: response.profile.linkedin || ''
        })
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError(locale === 'ar' ? 'فشل تحميل الملف الشخصي' : 'Failed to load profile')
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoadingProfile(true)
    setError('')
    setMessage('')

    try {
      const response = await api.put('/api/accounts/me', profileData)
      if (response.ok) {
        setMessage(locale === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully')
      } else {
        setError(response.error || (locale === 'ar' ? 'فشل تحديث الملف الشخصي' : 'Failed to update profile'))
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(locale === 'ar' ? 'فشل تحديث الملف الشخصي' : 'Failed to update profile')
    } finally {
      setLoadingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoadingPassword(true)
    setError('')
    setMessage('')

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(locale === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
      setLoadingPassword(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError(locale === 'ar' ? 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' : 'New password must be at least 6 characters')
      setLoadingPassword(false)
      return
    }

    try {
      const response = await api.put('/api/accounts/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      if (response.ok) {
        setMessage(locale === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setError(response.error || (locale === 'ar' ? 'فشل تغيير كلمة المرور' : 'Failed to change password'))
      }
    } catch (err) {
      console.error('Error changing password:', err)
      setError(locale === 'ar' ? 'فشل تغيير كلمة المرور' : 'Failed to change password')
    } finally {
      setLoadingPassword(false)
    }
  }

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner w-8 h-8 mr-3"></div>
          <span className="text-gray-600">{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {locale === 'ar' ? 'الملف الشخصي' : 'My Profile'}
            </h1>
            <p className="text-gray-600 mt-1">
              {locale === 'ar' ? 'إدارة معلومات حسابك وإعداداتك' : 'Manage your account information and settings'}
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon icon="user" className="w-4 h-4 inline mr-2" />
                {locale === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon icon="lock" className="w-4 h-4 inline mr-2" />
                {locale === 'ar' ? 'كلمة المرور' : 'Password'}
              </button>
            </nav>
          </div>

          {/* Messages */}
          {message && (
            <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <Icon icon="check" className="w-5 h-5 text-green-400 mr-2" />
                <p className="text-sm text-green-800">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <Icon icon="alert" className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="input w-full"
                      placeholder={locale === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="input w-full"
                      placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {locale === 'ar' ? 'لا يمكن تغيير البريد الإلكتروني' : 'Email cannot be changed'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="input w-full"
                      placeholder={locale === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'ar' ? 'الموقع' : 'Location'}
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                      className="input w-full"
                      placeholder={locale === 'ar' ? 'أدخل موقعك' : 'Enter your location'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ar' ? 'السيرة الذاتية' : 'Bio'}
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    rows={4}
                    className="input w-full"
                    placeholder={locale === 'ar' ? 'أخبرنا عن نفسك' : 'Tell us about yourself'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
                  </label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => handleProfileChange('website', e.target.value)}
                    className="input w-full"
                    placeholder={locale === 'ar' ? 'https://example.com' : 'https://example.com'}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {locale === 'ar' ? 'وسائل التواصل الاجتماعي' : 'Social Media'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'ar' ? 'فيسبوك' : 'Facebook'}
                      </label>
                      <input
                        type="url"
                        value={profileData.facebook}
                        onChange={(e) => handleProfileChange('facebook', e.target.value)}
                        className="input w-full"
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'ar' ? 'تويتر' : 'Twitter'}
                      </label>
                      <input
                        type="url"
                        value={profileData.twitter}
                        onChange={(e) => handleProfileChange('twitter', e.target.value)}
                        className="input w-full"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'ar' ? 'انستغرام' : 'Instagram'}
                      </label>
                      <input
                        type="url"
                        value={profileData.instagram}
                        onChange={(e) => handleProfileChange('instagram', e.target.value)}
                        className="input w-full"
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'ar' ? 'لينكدإن' : 'LinkedIn'}
                      </label>
                      <input
                        type="url"
                        value={profileData.linkedin}
                        onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                        className="input w-full"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loadingProfile}
                    className="btn btn-primary"
                  >
                    {loadingProfile ? (
                      <>
                        <div className="loading-spinner w-4 h-4 mr-2"></div>
                        {locale === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Icon icon="save" className="w-4 h-4 mr-2" />
                        {locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="input w-full"
                    placeholder={locale === 'ar' ? 'أدخل كلمة المرور الحالية' : 'Enter current password'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="input w-full"
                    placeholder={locale === 'ar' ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {locale === 'ar' ? 'يجب أن تكون 6 أحرف على الأقل' : 'Must be at least 6 characters'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="input w-full"
                    placeholder={locale === 'ar' ? 'أكد كلمة المرور الجديدة' : 'Confirm new password'}
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className="btn btn-primary"
                  >
                    {loadingPassword ? (
                      <>
                        <div className="loading-spinner w-4 h-4 mr-2"></div>
                        {locale === 'ar' ? 'جاري التغيير...' : 'Changing...'}
                      </>
                    ) : (
                      <>
                        <Icon icon="lock" className="w-4 h-4 mr-2" />
                        {locale === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
