import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
        console.log('No listings found or error loading listings')
      }
      
      // Load user's reviews
      try {
        const reviews = await api.getUserReviews()
        setUserReviews(reviews || [])
      } catch (err) {
        console.log('No reviews found or error loading reviews')
      }
      
      // Load user's messages
      try {
        const messages = await api.getUnreadCount()
        setUserMessages(messages || [])
      } catch (err) {
        console.log('No messages found or error loading messages')
      }
      
    } catch (err) {
      console.error('Error loading user data:', err)
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
      await api.updateProfile(profileForm)
      setSuccess('Profile updated successfully!')
      await checkAuthStatus() // Refresh user data
    } catch (err) {
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
      await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      setSuccess('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
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
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-primary-600 text-xl font-bold">
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
            {['profile', 'listings', 'reviews', 'messages', 'security'].map((tab) => (
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
                {/* Change Password */}
                <div>
                  <h4 className="text-md font-medium text-secondary-900 mb-4">Change Password</h4>
                  <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="input"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="input"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="input"
                        disabled={loading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
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
        </div>
      </main>
    </div>
  )
}
