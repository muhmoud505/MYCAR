import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'
import { Icon } from '../../components/UI'

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })

  useEffect(() => {
    loadUsers()
  }, [pagination.page, searchTerm, roleFilter, statusFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      console.log('Loading admin users with token:', token ? 'Present' : 'Missing')
      
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter })
      })

      console.log('Admin users API call:', `/api/admin/users?${params}`)

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      console.log('Admin users response status:', response.status)

      const data = await response.json()
      console.log('Admin users response data:', data)
      
      if (data.ok) {
        setUsers(data.users)
        setPagination(data.pagination)
        console.log('Users loaded successfully:', data.users?.length)
      } else {
        console.error('Admin users error:', data.error)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId, action) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        loadUsers()
      }
    } catch (error) {
      console.error('Error performing user action:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    const matchesStatus = !statusFilter || (statusFilter === 'verified' ? user.isVerified : !user.isVerified)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <AdminLayout title="User Management">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Icon icon="users" className="w-6 h-6 text-blue-600 mr-3" />
                  User Management
                </h1>
                <p className="text-gray-600 mt-1">Manage and monitor all registered users</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
                <button className="btn btn-primary">
                  <Icon icon="plus" className="w-4 h-4 mr-2" />
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="filter" className="w-5 h-5 text-blue-600 mr-2" />
              Filters & Search
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon icon="search" className="w-4 h-4 inline mr-1" />
                  Search Users
                </label>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon icon="shield" className="w-4 h-4 inline mr-1" />
                  Role Filter
                </label>
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Roles</option>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="dealer">Dealer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon icon="check-circle" className="w-4 h-4 inline mr-1" />
                  Status Filter
                </label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setRoleFilter('')
                    setStatusFilter('')
                  }}
                  className="w-full btn btn-secondary"
                >
                  <Icon icon="refresh" className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Icon icon="list" className="w-5 h-5 text-blue-600 mr-2" />
                Users Directory
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {filteredUsers.length} of {pagination.total} results
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="loading-spinner w-12 h-12 mx-auto mb-4 text-blue-600"></div>
              <p className="text-gray-600 text-lg">Loading users...</p>
              <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the data</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Icon icon="users" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {searchTerm || roleFilter || statusFilter 
                  ? 'Try adjusting your filters or search terms' 
                  : 'No users have been registered yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {user.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                              <div className="text-xs text-gray-400 flex items-center mt-1">
                                <Icon icon="phone" className="w-3 h-3 mr-1" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                          <Icon icon={getRoleIcon(user.role)} className="w-3 h-3 mr-1" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            <Icon icon={user.isVerified ? 'check-circle' : 'alert-circle'} className="w-3 h-3 mr-1" />
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                          {user.verificationBadge && (
                            <span className="text-xs text-gray-500">
                              {user.verificationBadge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.location?.city && user.location?.state 
                          ? (
                            <div className="flex items-center">
                              <Icon icon="map-pin" className="w-3 h-3 mr-1" />
                              {user.location.city}, {user.location.state}
                            </div>
                          )
                          : (
                            <span className="text-gray-400">Not specified</span>
                          )
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Icon icon="calendar" className="w-3 h-3 mr-1" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                            className="btn btn-sm btn-secondary hover:btn-primary transition-colors"
                            title="View Details"
                          >
                            <Icon icon="eye" className="w-4 h-4" />
                          </button>
                          {!user.isVerified && (
                            <button
                              onClick={() => handleUserAction(user._id, 'verify')}
                              className="btn btn-sm btn-success hover:bg-green-600 transition-colors"
                              title="Verify User"
                            >
                              <Icon icon="check-circle" className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleUserAction(user._id, 'suspend')}
                            className="btn btn-sm btn-error hover:bg-red-600 transition-colors"
                            title="Suspend User"
                          >
                            <Icon icon="ban" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="btn btn-sm btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon icon="chevron-left" className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="btn btn-sm btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <Icon icon="chevron-right" className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
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
