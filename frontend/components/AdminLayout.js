import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Icon } from './UI'
import { useLocale } from '../contexts/LocaleContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function AdminLayout({ children, title }) {
  const { t, locale } = useLocale()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)

  const navigation = [
    { name: t('admin.navigation.dashboard'), href: '/admin/dashboard', icon: 'layout-dashboard' },
    { name: t('admin.navigation.users'), href: '/admin/users', icon: 'users' },
    { name: t('admin.navigation.listings'), href: '/admin/listings', icon: 'car' },
    { name: t('admin.navigation.dealerships'), href: '/admin/dealerships', icon: 'building' },
    { name: t('admin.navigation.rentals'), href: '/admin/rentals', icon: 'calendar' },
    { name: t('admin.navigation.classifieds'), href: '/admin/classifieds', icon: 'file-text' },
    { name: t('admin.navigation.reviews'), href: '/admin/reviews', icon: 'star' },
    { name: t('admin.navigation.messages'), href: '/admin/messages', icon: 'mail' },
    { name: t('admin.navigation.bookings'), href: '/admin/bookings', icon: 'calendar' },
    { name: t('admin.navigation.settings'), href: '/admin/settings', icon: 'settings' },
  ]

  const isActive = (href) => router.pathname === href

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/accounts/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.profile)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/auth/login')
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 ${locale === 'ar' ? 'right-0' : 'left-0'} z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:h-screen lg:sticky lg:top-0 ${sidebarOpen ? 'translate-x-0' : (locale === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Icon icon="shield" className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{t('site.title')} {t('admin.dashboard.title')}</h1>
                <p className="text-blue-100 text-xs">{t('admin.dashboard.overview')}</p>
              </div>
            </div>
          </Link>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-blue-200 transition-colors"
          >
            <Icon icon="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon icon={item.icon} className={`w-5 h-5 ${locale === 'ar' ? 'ml-3' : 'mr-3'} ${isActive(item.href) ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}`} />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-200 p-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || t('admin.users.user')}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email || 'admin@mycar.com'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title={t('admin.navigation.logout')}
              >
                <Icon icon="logout" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${locale === 'ar' ? 'mr-0' : 'ml-0'} lg:${locale === 'ar' ? 'mr-64' : 'ml-64'}`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Icon icon="menu" className="w-6 h-6" />
            </button>

            {/* Page Title */}
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                {title || t('admin.dashboard.title')}
              </h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">{t('admin.users.user')}</span>
                  {user ? (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
