import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import { Icon } from '../../components/UI'
import { useLocale } from '../../contexts/LocaleContext'

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const { t, locale } = useLocale()
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
        return
      }
      
      if (user?.role !== 'admin') {
        router.push('/')
        return
      }
    }
  }, [isAuthenticated, user, loading, router])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadStats()
    }
  }, [isAuthenticated, user])

  const loadStats = async () => {
    try {
      setStatsLoading(true)
      const token = localStorage.getItem('token')
      console.log('Loading admin stats with token:', token ? 'Present' : 'Missing')
      
      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      console.log('Admin stats response status:', response.status)
      
      const data = await response.json()
      console.log('Admin stats response data:', data)
      
      if (data.ok) {
        setStats(data.stats)
      } else {
        console.error('Admin stats error:', data.error)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4 text-primary-600"></div>
          <p className="text-gray-600 text-lg">{locale === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading Admin Dashboard...'}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Icon icon="shield" className="w-8 h-8 text-primary-600 mr-3" />
                  {locale === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {locale === 'ar' ? 'مرحباً بعودتك،' : 'Welcome back,'} <span className="font-semibold text-gray-900">{user.name}</span>! 
                  {locale === 'ar' ? 'لديك وصول إداري كامل.' : 'You have full administrative access.'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="badge badge-success">{locale === 'ar' ? 'مدير' : 'Admin'}</span>
                <span className="badge badge-primary">{locale === 'ar' ? 'متصل' : 'Online'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{locale === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {statsLoading ? (
                    <div className="loading-spinner w-8 h-8"></div>
                  ) : (
                    stats?.totalUsers?.toLocaleString() || '0'
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-2">{locale === 'ar' ? 'الحسابات المسجلة' : 'Registered accounts'}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <Icon icon="users" className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{locale === 'ar' ? 'الإعلانات النشطة' : 'Active Listings'}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {statsLoading ? (
                    <div className="loading-spinner w-8 h-8"></div>
                  ) : (
                    stats?.totalListings?.toLocaleString() || '0'
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-2">{locale === 'ar' ? 'إعلانات المركبات' : 'Vehicle listings'}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <Icon icon="car" className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{locale === 'ar' ? 'مراجعات العملاء' : 'Customer Reviews'}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {statsLoading ? (
                    <div className="loading-spinner w-8 h-8"></div>
                  ) : (
                    stats?.totalReviews?.toLocaleString() || '0'
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-2">{locale === 'ar' ? 'ملاحظات المستخدمين' : 'User feedback'}</p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3">
                <Icon icon="star" className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{locale === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings'}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {statsLoading ? (
                    <div className="loading-spinner w-8 h-8"></div>
                  ) : (
                    stats?.totalBookings?.toLocaleString() || '0'
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-2">{locale === 'ar' ? 'حجوزات الإيجار' : 'Rental bookings'}</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <Icon icon="calendar" className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="zap" className="w-5 h-5 text-primary-600 mr-2" />
              {locale === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href="/admin/users" className="btn btn-secondary hover:btn-primary transition-colors">
                <Icon icon="users" className="w-4 h-4 mr-2" />
                {locale === 'ar' ? 'إدارة المستخدمين' : 'Manage Users'}
              </a>
              <a href="/admin/listings" className="btn btn-secondary hover:btn-primary transition-colors">
                <Icon icon="car" className="w-4 h-4 mr-2" />
                {locale === 'ar' ? 'إدارة الإعلانات' : 'Manage Listings'}
              </a>
              <a href="/admin/reviews" className="btn btn-secondary hover:btn-primary transition-colors">
                <Icon icon="star" className="w-4 h-4 mr-2" />
                {locale === 'ar' ? 'مراجعة التقييمات' : 'Moderate Reviews'}
              </a>
              <a href="/admin/settings" className="btn btn-secondary hover:btn-primary transition-colors">
                <Icon icon="settings" className="w-4 h-4 mr-2" />
                {locale === 'ar' ? 'الإعدادات' : 'Settings'}
              </a>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="activity" className="w-5 h-5 text-green-600 mr-2" />
              {locale === 'ar' ? 'حالة النظام' : 'System Status'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">{locale === 'ar' ? 'الواجهة الأمامية' : 'Frontend'}</span>
                </div>
                <span className="badge badge-success">{locale === 'ar' ? 'تعمل' : 'Running'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">{locale === 'ar' ? 'واجهة برمجة التطبيقات' : 'Backend API'}</span>
                </div>
                <span className="badge badge-success">{locale === 'ar' ? 'تعمل' : 'Running'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">{locale === 'ar' ? 'قاعدة البيانات' : 'Database'}</span>
                </div>
                <span className="badge badge-success">{locale === 'ar' ? 'متصل' : 'Connected'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">{locale === 'ar' ? 'الوصول الإداري' : 'Admin Access'}</span>
                </div>
                <span className="badge badge-success">{locale === 'ar' ? 'مفعل' : 'Enabled'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Preview */}
        {stats?.recentActivity && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="clock" className="w-5 h-5 text-primary-600 mr-2" />
              {locale === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
            </h3>
            <div className="space-y-3">
              {stats.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
