import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Icon } from './UI'

export default function AdminLayout({ children, title }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'layout-dashboard' },
    { name: 'Users', href: '/admin/users', icon: 'users' },
    { name: 'Listings', href: '/admin/listings', icon: 'car' },
    { name: 'Reviews', href: '/admin/reviews', icon: 'star' },
    { name: 'Messages', href: '/admin/messages', icon: 'mail' },
    { name: 'Bookings', href: '/admin/bookings', icon: 'calendar' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings' },
  ]

  const isActive = (href) => router.pathname === href

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:h-screen lg:sticky lg:top-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Icon icon="shield" className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MYCAR Admin</h1>
                <p className="text-blue-100 text-xs">Management System</p>
              </div>
            </div>
          </Link>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-blue-100 hover:bg-blue-200 transition-colors"
          >
            <Icon icon="x" className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main Menu</h3>
            <div className="space-y-1">
              {navigation.slice(0, 4).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(item.href) ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <Icon 
                    icon={item.icon} 
                    className={`w-4 h-4 mr-3 ${isActive(item.href) ? 'text-blue-700' : 'text-gray-400'}`} 
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Management</h3>
            <div className="space-y-1">
              {navigation.slice(4).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(item.href) ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <Icon 
                    icon={item.icon} 
                    className={`w-4 h-4 mr-3 ${isActive(item.href) ? 'text-blue-700' : 'text-gray-400'}`} 
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Admin User Info */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@mycar.com</p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar for mobile */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Icon icon="menu" className="w-5 h-5" />
              </button>
              <h1 className="ml-4 text-lg font-semibold text-gray-900">
                {title || 'Admin Dashboard'}
              </h1>
            </div>
            <Link href="/" className="btn btn-ghost btn-sm">
              <Icon icon="home" className="w-4 h-4 mr-2" />
              Exit Admin
            </Link>
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon icon="shield" className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">MYCAR Admin</h1>
                  <p className="text-sm text-gray-500">Automotive Management System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="btn btn-ghost btn-sm">
                <Icon icon="home" className="w-4 h-4 mr-2" />
                Back to Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
