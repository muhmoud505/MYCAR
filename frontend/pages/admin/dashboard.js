import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../components/AdminLayout'
import { Icon } from '../../components/UI'
import { useLocale } from '../../contexts/LocaleContext'

export default function AdminDashboard() {
  const { t, locale } = useLocale()
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

      const response = await fetch('/api/accounts/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()
      if (data.ok && data.profile.role === 'admin') {
        setUser(data.profile)
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
      <AdminLayout title={t('admin.dashboard.title')}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('form.loading')}</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AdminLayout title={t('admin.dashboard.title')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              {t('admin.dashboard.welcome')}, {user?.name || t('admin.users.admin')}!
            </h1>
            <p className="text-blue-100">
              {t('admin.dashboard.overview')} - {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Users Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon icon="users" className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">{t('admin.dashboard.stats.totalUsers')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
            <p className="text-sm text-gray-600 mt-1">{t('admin.users.active')}</p>
          </div>

          {/* Listings Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon icon="car" className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">{t('admin.dashboard.stats.totalListings')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalListings || 0}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.activeListings || 0} {t('admin.listings.active')}</p>
          </div>

          {/* Dealerships Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon icon="building" className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">{t('admin.dashboard.stats.totalDealerships')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalDealerships || 0}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.verifiedDealerships || 0} {t('admin.dealerships.verified')}</p>
          </div>

          {/* Reviews Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon icon="star" className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">{t('admin.dashboard.stats.totalReviews')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalReviews || 0}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.pendingReviews || 0} {t('admin.reviews.pending')}</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Rentals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icon icon="calendar" className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">{t('admin.dashboard.stats.totalRentals')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalRentals || 0}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.activeRentals || 0} {t('admin.rentals.active')}</p>
          </div>

          {/* Classifieds */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Icon icon="file-text" className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-sm text-gray-500">{t('admin.dashboard.stats.totalClassifieds')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClassifieds || 0}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.approvedClassifieds || 0} {t('admin.classifieds.approved')}</p>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Icon icon="mail" className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm text-gray-500">{t('admin.dashboard.stats.totalMessages')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalMessages || 0}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.unreadMessages || 0} {t('admin.messages.unread')}</p>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Icon icon="calendar" className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-sm text-gray-500">{t('admin.dashboard.stats.totalBookings')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalBookings || 0}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.confirmedBookings || 0} {t('admin.bookings.confirmed')}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Icon icon="lightning" className="w-5 h-5 text-blue-600 mr-2" />
            {t('admin.dashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/users" className="btn btn-secondary justify-center">
              <Icon icon="users" className="w-4 h-4 mr-2" />
              {t('admin.navigation.users')}
            </Link>
            <Link href="/admin/listings" className="btn btn-secondary justify-center">
              <Icon icon="car" className="w-4 h-4 mr-2" />
              {t('admin.navigation.listings')}
            </Link>
            <Link href="/admin/dealerships" className="btn btn-secondary justify-center">
              <Icon icon="building" className="w-4 h-4 mr-2" />
              {t('admin.navigation.dealerships')}
            </Link>
            <Link href="/admin/reviews" className="btn btn-secondary justify-center">
              <Icon icon="star" className="w-4 h-4 mr-2" />
              {t('admin.navigation.reviews')}
            </Link>
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
