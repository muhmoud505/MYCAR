import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../components/AdminLayout'
import { Icon } from '../../components/UI'
import { useLocale } from '../../contexts/LocaleContext'

export default function AdminDashboard() {
  const { t } = useLocale()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})

  useEffect(() => {
    checkAdminAuth()
    loadDashboardData()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()
      if (data.ok && data.user.role === 'admin') {
        setUser(data.user)
      } else {
        router.push('/auth/login')
      }
    } catch (error) {
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()
      if (data.ok) setStats(data.stats)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-secondary-600">{t('form.loading')}</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-secondary-600 mt-1">
            Here's what's happening with your MYCAR platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
                <Icon icon="user" className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Total Users</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-accent-100 rounded-lg p-3">
                <Icon icon="search" className="w-6 h-6 text-accent-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Total Listings</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalListings || 0}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-success-100 rounded-lg p-3">
                <Icon icon="star" className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Total Reviews</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalReviews || 0}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-warning-100 rounded-lg p-3">
                <Icon icon="calendar" className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Total Bookings</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.totalBookings || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/users" className="btn btn-secondary text-left">
                <Icon icon="user" className="w-4 h-4 mr-2" />
                Manage Users
              </Link>
              <Link href="/admin/listings" className="btn btn-secondary text-left">
                <Icon icon="search" className="w-4 h-4 mr-2" />
                Manage Listings
              </Link>
              <Link href="/admin/reviews" className="btn btn-secondary text-left">
                <Icon icon="star" className="w-4 h-4 mr-2" />
                Moderate Reviews
              </Link>
              <Link href="/admin/settings" className="btn btn-secondary text-left">
                <Icon icon="check" className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Database</span>
                <span className="badge badge-success">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">API Server</span>
                <span className="badge badge-success">Running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">File Storage</span>
                <span className="badge badge-success">Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Email Service</span>
                <span className="badge badge-success">Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b border-secondary-200">
            <h3 className="text-lg font-medium text-secondary-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-secondary-900">{activity.title}</p>
                      <p className="text-xs text-secondary-500">{activity.time}</p>
                    </div>
                  </div>
                  <span className={`badge ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              )) || (
                <p className="text-secondary-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

// Helper function
function getStatusColor(status) {
  const colors = {
    active: 'badge-success',
    pending: 'badge-warning',
    inactive: 'badge-secondary',
    sold: 'badge-error',
    approved: 'badge-success',
    rejected: 'badge-error',
    verified: 'badge-success',
    unverified: 'badge-secondary',
    new: 'badge-primary',
    review: 'badge-accent',
    booking: 'badge-warning'
  }
  return colors[status] || 'badge-secondary'
}
