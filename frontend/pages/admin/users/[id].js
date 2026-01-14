import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import { Icon } from '../../../components/UI'

export default function AdminUserDetail() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUser()
  }, [router.query.id])

  const loadUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/admin/users/${router.query.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()
      if (data.ok) {
        setUser(data.user)
      } else {
        setError(data.error || 'User not found')
      }
    } catch (error) {
      console.error('Error loading user:', error)
      setError('Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (action) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users/${router.query.id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        loadUser() // Refresh user data
      }
    } catch (error) {
      console.error('Error performing user action:', error)
      setError('Failed to perform action')
    }
  }

  if (loading) {
    return (
      <AdminLayout title="User Details">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner w-12 h-12 text-blue-600"></div>
            <p className="ml-4 text-gray-600">Loading user details...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="User Not Found">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Icon icon="alert-circle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/admin/users')}
              className="btn btn-primary"
            >
              <Icon icon="arrow-left" className="w-4 h-4 mr-2" />
              Back to Users
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout title="User Not Found">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Icon icon="user-x" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-6">The user you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/admin/users')}
              className="btn btn-primary"
            >
              <Icon icon="arrow-left" className="w-4 h-4 mr-2" />
              Back to Users
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`User Details - ${user.name}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/users')}
            className="btn btn-secondary"
          >
            <Icon icon="arrow-left" className="w-4 h-4 mr-2" />
            Back to Users
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Icon icon="user" className="w-5 h-5 text-blue-600 mr-2" />
                User Information
              </h3>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                  <Icon icon={getRoleIcon(user.role)} className="w-3 h-3 mr-1" />
                  {user.role}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  <Icon icon={user.isVerified ? 'check-circle' : 'alert-circle'} className="w-3 h-3 mr-1" />
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-20 w-20">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.phone && (
                      <p className="text-sm text-gray-400 flex items-center mt-1">
                        <Icon icon="phone" className="w-3 h-3 mr-1" />
                        {user.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <p className="text-gray-900 font-mono">{user._id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                    <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-gray-900">{new Date(user.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Location & Actions */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {user.location?.city && user.location?.state ? (
                    <div className="flex items-center text-gray-900">
                      <Icon icon="map-pin" className="w-4 h-4 mr-2" />
                      {user.location.city}, {user.location.state}
                    </div>
                  ) : (
                    <p className="text-gray-400">Not specified</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Email Verified</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Phone Verified</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.phoneVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.phoneVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Profile Completed</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.profileCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {user.profileCompleted ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Actions</label>
                  <div className="space-y-3">
                    {!user.isVerified && (
                      <button
                        onClick={() => handleUserAction('verify')}
                        className="btn btn-success w-full"
                      >
                        <Icon icon="check-circle" className="w-4 h-4 mr-2" />
                        Verify User
                      </button>
                    )}
                    <button
                      onClick={() => handleUserAction('suspend')}
                      className="btn btn-error w-full"
                    >
                      <Icon icon="ban" className="w-4 h-4 mr-2" />
                      Suspend User
                    </button>
                    <button
                      onClick={() => router.push(`/messages/new?to=${user.email}`)}
                      className="btn btn-secondary w-full"
                    >
                      <Icon icon="mail" className="w-4 h-4 mr-2" />
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function getRoleBadgeClass(role) {
  const classes = {
    admin: 'bg-red-100 text-red-800',
    dealer: 'bg-blue-100 text-blue-800', 
    seller: 'bg-green-100 text-green-800',
    buyer: 'bg-gray-100 text-gray-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

function getRoleIcon(role) {
  const icons = {
    admin: 'shield',
    dealer: 'building',
    seller: 'store',
    buyer: 'user'
  }
  return icons[role] || 'user'
}
