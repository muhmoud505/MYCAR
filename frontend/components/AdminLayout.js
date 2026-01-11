import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Icon } from './UI'

export default function AdminLayout({ children, title }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'search' },
    { name: 'Users', href: '/admin/users', icon: 'user' },
    { name: 'Listings', href: '/admin/listings', icon: 'search' },
    { name: 'Reviews', href: '/admin/reviews', icon: 'star' },
    { name: 'Messages', href: '/admin/messages', icon: 'mail' },
    { name: 'Bookings', href: '/admin/bookings', icon: 'calendar' },
    { name: 'Verifications', href: '/admin/verifications', icon: 'check' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings' },
  ]

  const isActive = (href) => router.pathname === href

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-secondary-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
          <Link href="/admin/dashboard" className="text-xl font-bold text-primary-600">
            MYCAR Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100"
          >
            <Icon icon="close" className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                  ${isActive(item.href)
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  }
                `}
              >
                <Icon icon={item.icon} className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Admin user info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 text-sm font-medium">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-secondary-700">Admin User</p>
              <p className="text-xs text-secondary-500">admin@mycar.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-secondary-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100"
              >
                <Icon icon="menu" className="w-5 h-5" />
              </button>
              <h1 className="ml-4 text-lg font-semibold text-secondary-900">
                {title || 'Admin Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/" className="btn btn-ghost btn-sm">
                <Icon icon="close" className="w-4 h-4 mr-2" />
                Exit Admin
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
