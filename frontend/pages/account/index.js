import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import ErrorAlert from '../../components/ErrorAlert'
import { Icon } from '../../components/UI'
import { useAuth } from '../../contexts/AuthContext'
import { useLocale } from '../../contexts/LocaleContext'
import { api } from '../../utils/api'
import { parseApiError, validateEmail, validateRequired, validatePassword } from '../../utils/errorHandling'

export default function AccountPage() {
  const { t } = useLocale()
  const { user, isAuthenticated, logout, checkAuthStatus } = useAuth()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: {
      city: '',
      state: '',
      country: ''
    }
  })
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // User's listings
  const [userListings, setUserListings] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [userMessages, setUserMessages] = useState([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: {
          city: user.location?.city || '',
          state: user.location?.state || '',
          country: user.location?.country || ''
        }
      })
      
      loadUserData()
    }
  }, [user, isAuthenticated])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load user's listings
      try {
        const listings = await api.fetchListings(`seller=${user._id}`)
        setUserListings(listings || [])
      } catch (err) {
        console.log('No listings found or error loading listings:', err)
      }
      
      // Load user's reviews
      try {
        const reviews = await api.getUserReviews()
        setUserReviews(reviews || [])
      } catch (err) {
        console.log('No reviews found or error loading reviews:', err)
      }
      
      // Load user's messages
      try {
        const messages = await api.getUnreadCount()
        setUserMessages(messages || [])
      } catch (err) {
        console.log('No messages found or error loading messages:', err)
      }
      
    } catch (err) {
      console.error('Error loading user data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    console.log('File selected:', file.name, file.type, file.size)

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('File size must be less than 5MB')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('Uploading avatar:', file.name)
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('avatar', file)
      
      console.log('FormData created:')
      for (let [key, value] of formData.entries()) {
        console.log(key, value)
      }

      const response = await api.uploadAvatar(formData)
      console.log('Avatar upload response:', response)
      
      setSuccess('Profile picture updated successfully!')
      await checkAuthStatus() // Refresh user data to show new avatar
      
      // Reset file input
      e.target.value = ''
    } catch (err) {
      console.error('Avatar upload error:', err)
      setError(parseApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    try {
      validateRequired(profileForm.name, 'Name')
      validateEmail(profileForm.email)
    } catch (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      console.log('Updating profile with data:', profileForm)
      const response = await api.updateProfile(profileForm)
      console.log('Profile update response:', response)
      setSuccess('Profile updated successfully!')
      await checkAuthStatus() // Refresh user data
    } catch (err) {
      console.error('Profile update error:', err)
      setError(parseApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    try {
      validateRequired(passwordForm.currentPassword, 'Current password')
      validatePassword(passwordForm.newPassword)
      
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('New passwords do not match')
      }
    } catch (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      console.log('Changing password')
      const response = await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      console.log('Password change response:', response)
      setSuccess('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      console.error('Password change error:', err)
      setError(parseApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesUpdate = async (section, data) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Updating preferences:', { section, ...data })
      
      // Update preferences API call - backend expects { section: "preferences", ...data }
      const response = await api.updatePreferences({ section, ...data })
      console.log('Preferences update response:', response)
      
      setSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`)
      await checkAuthStatus() // Refresh user data
    } catch (err) {
      console.error('Preferences update error:', err)
      setError(parseApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLinkUpdate = async (platform, url) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Updating social link:', { platform, url })
      
      const response = await api.updateSocialLinks({ [platform]: url })
      console.log('Social link update response:', response)
      
      setSuccess(`${platform.charAt(0).toUpperCase() + platform.slice(1)} profile updated!`)
      await checkAuthStatus()
    } catch (err) {
      console.error('Social link update error:', err)
      setError(parseApiError(err))
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">My Account</h1>
          <p className="text-secondary-600 mt-2">
            Manage your profile, listings, and account settings
          </p>
        </div>

        <ErrorAlert error={error} onDismiss={() => setError(null)} />
        
        {success && (
          <div className="bg-success-50 border border-success-200 text-success-800 rounded-lg p-4 mb-6">
            <div className="flex">
              <Icon icon="check" className="w-5 h-5 mr-2" />
              {success}
            </div>
          </div>
        )}

        {/* Account Overview */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                {user?.avatar ? (
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${user.avatar}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <span className="text-primary-600 text-xl font-bold" style={{display: user?.avatar ? 'none' : 'flex'}}>
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">{user.name}</h2>
                <p className="text-secondary-600">{user.email}</p>
                <div className="flex items-center mt-1 space-x-4">
                  <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-secondary'}`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className="badge badge-accent">{user.role}</span>
                </div>
              </div>
            </div>
            
            {user.role === 'admin' && (
              <Link href="/admin/dashboard-simple">
                <span className="btn btn-error">
                  <Icon icon="settings" className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-secondary-200 mb-6">
          <nav className="flex space-x-8">
            {['profile', 'listings', 'reviews', 'messages', 'security', 'preferences', 'social'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="card">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-secondary-900 mb-6">Profile Information</h3>
              
              {/* Profile Picture Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-secondary-700 mb-4">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${user.avatar}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <span className="text-primary-600 text-2xl font-bold" style={{display: user?.avatar ? 'none' : 'flex'}}>
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={loading}
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="btn btn-secondary cursor-pointer inline-flex items-center"
                    >
                      <Icon icon="upload" className="w-4 h-4 mr-2" />
                      {loading ? 'Uploading...' : 'Upload Picture'}
                    </label>
                    <p className="text-sm text-secondary-500 mt-2">
                      JPG, PNG or GIF (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="input"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className="input"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      className="input"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileForm.location.city}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        location: {...profileForm.location, city: e.target.value}
                      })}
                      className="input"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={profileForm.location.state}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        location: {...profileForm.location, state: e.target.value}
                      })}
                      className="input"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={profileForm.location.country}
                      onChange={(e) => setProfileForm({
                        ...profileForm, 
                        location: {...profileForm.location, country: e.target.value}
                      })}
                      className="input"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-secondary-900 mb-6">My Listings</h3>
              {userListings.length > 0 ? (
                <div className="space-y-4">
                  {userListings.map((listing) => (
                    <div key={listing._id} className="border border-secondary-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-secondary-900">{listing.title}</h4>
                          <p className="text-secondary-600">${listing.price}</p>
                          <p className="text-sm text-secondary-500">
                            Status: <span className="badge">{listing.status}</span>
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn btn-sm btn-secondary">Edit</button>
                          <button className="btn btn-sm btn-error">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon icon="search" className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600">You haven't created any listings yet</p>
                  <Link href="/listings/create" className="btn btn-primary mt-4">
                    Create Your First Listing
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-secondary-900 mb-6">My Reviews</h3>
              {userReviews.length > 0 ? (
                <div className="space-y-4">
                  {userReviews.map((review) => (
                    <div key={review._id} className="border border-secondary-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-secondary-900">{review.title}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Icon
                                key={i}
                                icon="star"
                                className={`w-4 h-4 ${i < review.ratings.overall ? 'text-warning-400' : 'text-secondary-300'}`}
                              />
                            ))}
                          </div>
                          <p className="text-secondary-600 mt-2">{review.content}</p>
                        </div>
                        <button className="btn btn-sm btn-secondary">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon icon="star" className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600">You haven't written any reviews yet</p>
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-secondary-900 mb-6">Messages</h3>
              <div className="text-center py-8">
                <Icon icon="mail" className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600">No messages yet</p>
                <Link href="/messages" className="btn btn-primary mt-4">
                  View All Messages
                </Link>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-secondary-900 mb-6">Security Settings</h3>
              
              <div className="space-y-8">
                {/* Account Status */}
                <div>
                  <h4 className="text-md font-medium text-secondary-900 mb-4">Account Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Email Verified</span>
                      <span className={`badge ${user.emailVerified ? 'badge-success' : 'badge-secondary'}`}>
                        {user.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Phone Verified</span>
                      <span className={`badge ${user.phoneVerified ? 'badge-success' : 'badge-secondary'}`}>
                        {user.phoneVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Profile Completed</span>
                      <span className={`badge ${user.profileCompleted ? 'badge-success' : 'badge-secondary'}`}>
                        {user.profileCompleted ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Account Status</span>
                      <span className={`badge ${user.blocked ? 'badge-error' : user.suspended ? 'badge-warning' : 'badge-success'}`}>
                        {user.blocked ? 'Blocked' : user.suspended ? 'Suspended' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div>
                  <h4 className="text-md font-medium text-secondary-900 mb-4">Two-Factor Authentication</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">2FA Status</span>
                      <span className={`badge ${user.securitySettings?.twoFactorEnabled ? 'badge-success' : 'badge-secondary'}`}>
                        {user.securitySettings?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handlePreferencesUpdate('security', { twoFactorEnabled: !user.securitySettings?.twoFactorEnabled })}
                    >
                      {user.securitySettings?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  </div>
                </div>

                {/* Login Notifications */}
                <div>
                  <h4 className="text-md font-medium text-secondary-900 mb-4">Login Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Email Alerts</span>
                      <button
                        className={`btn btn-sm ${user.securitySettings?.emailAlerts ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handlePreferencesUpdate('security', { emailAlerts: !user.securitySettings?.emailAlerts })}
                      >
                        {user.securitySettings?.emailAlerts ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">SMS Alerts</span>
                      <button
                        className={`btn btn-sm ${user.securitySettings?.smsAlerts ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handlePreferencesUpdate('security', { smsAlerts: !user.securitySettings?.smsAlerts })}
                      >
                        {user.securitySettings?.smsAlerts ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Login Notifications</span>
                      <button
                        className={`btn btn-sm ${user.securitySettings?.loginNotifications ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handlePreferencesUpdate('security', { loginNotifications: !user.securitySettings?.loginNotifications })}
                      >
                        {user.securitySettings?.loginNotifications ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div>
                  <h4 className="text-md font-medium text-secondary-900 mb-4">Account Actions</h4>
                  <div className="space-y-3">
                    <button className="btn btn-secondary">
                      <Icon icon="download" className="w-4 h-4 mr-2" />
                      Download My Data
                    </button>
                    <button className="btn btn-error">
                      <Icon icon="close" className="w-4 h-4 mr-2" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-secondary-900 mb-6">User Preferences</h3>
              
              <div className="space-y-8">
                {/* Language Settings */}
                <div>
                  <h4 className="text-md font-medium text-secondary-900 mb-4">Language & Region</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Display Language
                      </label>
                      <select
                        value={user.preferences?.language || 'en'}
                        onChange={(e) => handlePreferencesUpdate('preferences', { language: e.target.value })}
                        className="input"
                      >
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={user.preferences?.currency || 'USD'}
                        onChange={(e) => handlePreferencesUpdate('preferences', { currency: e.target.value })}
                        className="input"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Theme Settings */}
                <div>
                  <h4 className="text-md font-medium text-secondary-900 mb-4">Appearance</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Theme
                      </label>
                      <select
                        value={user.preferences?.theme || 'light'}
                        onChange={(e) => handlePreferencesUpdate('preferences', { theme: e.target.value })}
                        className="input"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Search Radius (km)
                      </label>
                      <input
                        type="number"
                        value={user.preferences?.searchRadius || 50}
                        onChange={(e) => handlePreferencesUpdate('preferences', { searchRadius: parseInt(e.target.value) })}
                        className="input"
                        min="1"
                        max="500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Default Listing View
                      </label>
                      <select
                        value={user.preferences?.listingView || 'grid'}
                        onChange={(e) => handlePreferencesUpdate('preferences', { listingView: e.target.value })}
                        className="input"
                      >
                        <option value="grid">Grid View</option>
                        <option value="list">List View</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h4 className="text-md font-medium text-secondary-900 mb-4">Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Email Notifications</span>
                      <button
                        className={`btn btn-sm ${user.preferences?.notifications?.email ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handlePreferencesUpdate('preferences', { notifications: { ...user.preferences?.notifications, email: !user.preferences?.notifications?.email } })}
                      >
                        {user.preferences?.notifications?.email ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">SMS Notifications</span>
                      <button
                        className={`btn btn-sm ${user.preferences?.notifications?.sms ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handlePreferencesUpdate('preferences', { notifications: { ...user.preferences?.notifications, sms: !user.preferences?.notifications?.sms } })}
                      >
                        {user.preferences?.notifications?.sms ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Push Notifications</span>
                      <button
                        className={`btn btn-sm ${user.preferences?.notifications?.push ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handlePreferencesUpdate('preferences', { notifications: { ...user.preferences?.notifications, push: !user.preferences?.notifications?.push } })}
                      >
                        {user.preferences?.notifications?.push ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Newsletter</span>
                      <button
                        className={`btn btn-sm ${user.preferences?.notifications?.newsletter ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handlePreferencesUpdate('preferences', { notifications: { ...user.preferences?.notifications, newsletter: !user.preferences?.notifications?.newsletter } })}
                      >
                        {user.preferences?.notifications?.newsletter ? 'Subscribed' : 'Unsubscribed'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">New Listing Alerts</span>
                      <button
                        className={`btn btn-sm ${user.preferences?.notifications?.newListingAlerts ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handlePreferencesUpdate('preferences', { notifications: { ...user.preferences?.notifications, newListingAlerts: !user.preferences?.notifications?.newListingAlerts } })}
                      >
                        {user.preferences?.notifications?.newListingAlerts ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Price Drop Alerts</span>
                      <button
                        className={`btn btn-sm ${user.preferences?.notifications?.priceDropAlerts ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handlePreferencesUpdate('preferences', { notifications: { ...user.preferences?.notifications, priceDropAlerts: !user.preferences?.notifications?.priceDropAlerts } })}
                      >
                        {user.preferences?.notifications?.priceDropAlerts ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-secondary-900 mb-6">Social Media Profiles</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Facebook Profile
                    </label>
                    <input
                      type="url"
                      value={user.socialLinks?.facebook || ''}
                      onChange={(e) => handleSocialLinkUpdate('facebook', e.target.value)}
                      placeholder="https://facebook.com/yourprofile"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Twitter Profile
                    </label>
                    <input
                      type="url"
                      value={user.socialLinks?.twitter || ''}
                      onChange={(e) => handleSocialLinkUpdate('twitter', e.target.value)}
                      placeholder="https://twitter.com/yourprofile"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Instagram Profile
                    </label>
                    <input
                      type="url"
                      value={user.socialLinks?.instagram || ''}
                      onChange={(e) => handleSocialLinkUpdate('instagram', e.target.value)}
                      placeholder="https://instagram.com/yourprofile"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={user.socialLinks?.linkedin || ''}
                      onChange={(e) => handleSocialLinkUpdate('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="input"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary mt-6"
                >
                  {loading ? 'Saving...' : 'Save Social Links'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
