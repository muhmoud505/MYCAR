import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import { Icon } from '../../components/UI'

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

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

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">
            Admin Dashboard
          </h1>
          <p className="text-secondary-600 mt-2">
            Welcome back, {user.name}! You have admin access.
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
                <Icon icon="user" className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Users</p>
                <p className="text-2xl font-bold text-secondary-900">--</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-accent-100 rounded-lg p-3">
                <Icon icon="search" className="w-6 h-6 text-accent-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Listings</p>
                <p className="text-2xl font-bold text-secondary-900">--</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-success-100 rounded-lg p-3">
                <Icon icon="star" className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Reviews</p>
                <p className="text-2xl font-bold text-secondary-900">--</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-warning-100 rounded-lg p-3">
                <Icon icon="calendar" className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Bookings</p>
                <p className="text-2xl font-bold text-secondary-900">--</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Notice */}
        <div className="card p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon icon="info" className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-secondary-900">Admin Dashboard Status</h3>
              <div className="mt-2">
                <p className="text-sm text-secondary-600">
                  ✅ Authentication: Working<br/>
                  ✅ Admin Access: Confirmed<br/>
                  ⚠️ Backend API: Admin routes temporarily disabled<br/>
                  📝 Note: Full admin functionality will be available once backend admin routes are re-enabled
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="btn btn-secondary w-full text-left" disabled>
                <Icon icon="user" className="w-4 h-4 mr-2" />
                Manage Users (API Disabled)
              </button>
              <button className="btn btn-secondary w-full text-left" disabled>
                <Icon icon="search" className="w-4 h-4 mr-2" />
                Manage Listings (API Disabled)
              </button>
              <button className="btn btn-secondary w-full text-left" disabled>
                <Icon icon="star" className="w-4 h-4 mr-2" />
                Moderate Reviews (API Disabled)
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Frontend</span>
                <span className="badge badge-success">Running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Backend</span>
                <span className="badge badge-success">Running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Database</span>
                <span className="badge badge-success">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Admin API</span>
                <span className="badge badge-warning">Disabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
