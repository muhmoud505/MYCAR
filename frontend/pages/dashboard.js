import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { useLocale } from '../../contexts/LocaleContext'
import { Icon } from '../components/UI'
import { api } from '../utils/api'
import Link from 'next/link'

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalListings: 0,
      activeListings: 0,
      soldListings: 0,
      totalViews: 0,
      totalMessages: 0,
      unreadMessages: 0
    },
    recentListings: [],
    recentMessages: [],
    notifications: []
  })
  
  const [loadingData, setLoadingData] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }
    
    if (isAuthenticated && user) {
      loadDashboardData()
    }
  }, [isAuthenticated, loading, user])

  const loadDashboardData = async () => {
    try {
      setLoadingData(true)
      
      // Load user's listings
      const listingsResponse = await api.get(`/api/listings?sellerId=${user.id}&limit=5`)
      
      // Load user's messages
      const messagesResponse = await api.get('/api/messages')
      
      // Calculate stats
      const listings = listingsResponse.ok ? listingsResponse.listings || [] : []
      const messages = messagesResponse.ok ? messagesResponse.messages || [] : []
      
      setDashboardData({
        stats: {
          totalListings: listings.length,
          activeListings: listings.filter(l => l.status === 'active').length,
          soldListings: listings.filter(l => l.status === 'sold').length,
          totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
          totalMessages: messages.length,
          unreadMessages: messages.filter(m => !m.isRead).length
        },
        recentListings: listings.slice(0, 3),
        recentMessages: messages.slice(0, 3),
        notifications: []
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'sold': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return locale === 'ar' ? 'نشط' : 'Active'
      case 'sold': return locale === 'ar' ? 'تم البيع' : 'Sold'
      case 'pending': return locale === 'ar' ? 'معلق' : 'Pending'
      default: return status
    }
  }

  if (loading || loadingData) {
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
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </h1>
          <p className="text-gray-600 mt-2">
            {locale === 'ar' 
              ? `مرحباً بك، ${user?.name || 'مستخدم'}!`
              : `Welcome back, ${user?.name || 'User'}!`
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Icon icon="car" className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {locale === 'ar' ? 'إجمالي الإعلانات' : 'Total Listings'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalListings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <Icon icon="check-circle" className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {locale === 'ar' ? 'الإعلانات النشطة' : 'Active Listings'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.activeListings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <Icon icon="eye" className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {locale === 'ar' ? 'إجمالي المشاهدات' : 'Total Views'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
                <Icon icon="mail" className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {locale === 'ar' ? 'الرسائل' : 'Messages'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalMessages}
                </p>
                {dashboardData.stats.unreadMessages > 0 && (
                  <span className="text-xs text-red-600">
                    {dashboardData.stats.unreadMessages} {locale === 'ar' ? 'غير مقروءة' : 'unread'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon icon="grid" className="w-4 h-4 inline mr-2" />
                {locale === 'ar' ? 'نظرة عامة' : 'Overview'}
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'listings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon icon="car" className="w-4 h-4 inline mr-2" />
                {locale === 'ar' ? 'إعلاناتي' : 'My Listings'}
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon icon="mail" className="w-4 h-4 inline mr-2" />
                {locale === 'ar' ? 'الرسائل' : 'Messages'}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Listings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {locale === 'ar' ? 'الإعلانات الأخيرة' : 'Recent Listings'}
                  </h3>
                  {dashboardData.recentListings.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.recentListings.map((listing) => (
                        <div key={listing._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          {listing.images && listing.images.length > 0 ? (
                            <img 
                              src={
                                (listing.images[0]?.url || listing.images[0])?.startsWith('http') 
                                  ? listing.images[0]?.url || listing.images[0]
                                  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + (listing.images[0]?.url || listing.images[0])
                              }
                              alt={listing.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Icon icon="car" className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{listing.title}</h4>
                            <p className="text-sm text-gray-500">${listing.price.toLocaleString()}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                                {getStatusText(listing.status)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {listing.views || 0} {locale === 'ar' ? 'مشاهدة' : 'views'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Icon icon="car" className="w-12 h-12 mx-auto mb-2" />
                      <p>{locale === 'ar' ? 'لا توجد إعلانات بعد' : 'No listings yet'}</p>
                      <Link href="/listings/create" className="btn btn-primary mt-4">
                        {locale === 'ar' ? 'إنشاء إعلان أول' : 'Create First Listing'}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Recent Messages */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {locale === 'ar' ? 'الرسائل الأخيرة' : 'Recent Messages'}
                  </h3>
                  {dashboardData.recentMessages.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.recentMessages.map((message) => (
                        <div key={message._id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Icon icon="user" className="w-5 h-5 text-gray-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">
                                {message.sender?.name || (locale === 'ar' ? 'مستخدم' : 'User')}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{message.subject}</p>
                            {!message.isRead && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mt-2">
                                {locale === 'ar' ? 'جديد' : 'New'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Icon icon="mail" className="w-12 h-12 mx-auto mb-2" />
                      <p>{locale === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {locale === 'ar' ? 'جميع الإعلانات' : 'All Listings'}
                  </h3>
                  <Link href="/listings/create" className="btn btn-primary">
                    <Icon icon="plus" className="w-4 h-4 mr-2" />
                    {locale === 'ar' ? 'إضافة إعلان جديد' : 'Add New Listing'}
                  </Link>
                </div>
                
                {dashboardData.recentListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData.recentListings.map((listing) => (
                      <div key={listing._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        {listing.images && listing.images.length > 0 ? (
                          <img 
                            src={
                              (listing.images[0]?.url || listing.images[0])?.startsWith('http') 
                                ? listing.images[0]?.url || listing.images[0]
                                : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + (listing.images[0]?.url || listing.images[0])
                            }
                            alt={listing.title}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <Icon icon="car" className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{listing.title}</h4>
                          <p className="text-lg font-bold text-primary-600 mb-2">
                            ${listing.price.toLocaleString()}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                              {getStatusText(listing.status)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {listing.views || 0} {locale === 'ar' ? 'مشاهدة' : 'views'}
                            </span>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <Link href={`/inventory/${listing._id}`} className="btn btn-outline text-sm flex-1">
                              {locale === 'ar' ? 'عرض' : 'View'}
                            </Link>
                            <Link href={`/listings/${listing._id}/edit`} className="btn btn-secondary text-sm flex-1">
                              {locale === 'ar' ? 'تعديل' : 'Edit'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Icon icon="car" className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {locale === 'ar' ? 'لا توجد إعلانات' : 'No Listings'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {locale === 'ar' 
                        ? 'ابدأ بإنشاء إعلانك الأول'
                        : 'Get started by creating your first listing'
                      }
                    </p>
                    <Link href="/listings/create" className="btn btn-primary">
                      <Icon icon="plus" className="w-4 h-4 mr-2" />
                      {locale === 'ar' ? 'إنشاء إعلان' : 'Create Listing'}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {locale === 'ar' ? 'جميع الرسائل' : 'All Messages'}
                  </h3>
                  <Link href="/messages" className="btn btn-primary">
                    <Icon icon="mail" className="w-4 h-4 mr-2" />
                    {locale === 'ar' ? 'عرض الكل' : 'View All'}
                  </Link>
                </div>
                
                {dashboardData.recentMessages.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentMessages.map((message) => (
                      <div key={message._id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <Icon icon="user" className="w-6 h-6 text-gray-500" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">
                              {message.sender?.name || (locale === 'ar' ? 'مستخدم' : 'User')}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-1">{message.subject}</p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.content}</p>
                          {!message.isRead && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mt-2">
                              {locale === 'ar' ? 'غير مقروءة' : 'Unread'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Icon icon="mail" className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {locale === 'ar' ? 'لا توجد رسائل' : 'No Messages'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'ar' 
                        ? 'ستظهر رسائلك هنا عندما يتواصل معك المشترون'
                        : 'Your messages will appear here when buyers contact you'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
