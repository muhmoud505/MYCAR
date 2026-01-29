import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'
import { Icon } from '../../components/UI'
import { useLocale } from '../../contexts/LocaleContext'

export default function AdminBookings() {
  const { t, locale } = useLocale()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })

  useEffect(() => {
    loadBookings()
  }, [pagination.page, searchTerm, statusFilter])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/bookings?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()
      if (data.ok) {
        setBookings(data.bookings)
        setPagination(data.pagination)
      } else {
        console.error('Admin bookings error:', data.error)
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingAction = async (bookingId, action) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/bookings/${bookingId}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        loadBookings()
      }
    } catch (error) {
      console.error('Error performing booking action:', error)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.listing?.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.listing?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (booking.user && booking.user.name && booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = !statusFilter || booking.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout title={locale === 'ar' ? 'إدارة الحجوزات' : 'Booking Management'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Icon icon="calendar" className="w-6 h-6 text-blue-600 mr-3" />
                  {locale === 'ar' ? 'إدارة الحجوزات' : 'Booking Management'}
                </h1>
                <p className="text-gray-600 mt-1">{locale === 'ar' ? 'إدارة ومراقبة جميع طلبات الحجز' : 'Manage and monitor all booking requests'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">{locale === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings'}</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Icon icon="filter" className="w-5 h-5 text-blue-600 mr-2" />
              {locale === 'ar' ? 'المرشحات والبحث' : 'Filters & Search'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon icon="search" className="w-4 h-4 inline mr-1" />
                  {locale === 'ar' ? 'البحث في الحجوزات' : 'Search Bookings'}
                </label>
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'البحث بالقائمة أو المستخدم أو الحالة...' : 'Search by listing, user, or status...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon icon="check-circle" className="w-4 h-4 inline mr-1" />
                  {locale === 'ar' ? 'مرشح الحالة' : 'Status Filter'}
                </label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{locale === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
                  <option value="pending">{locale === 'ar' ? 'معلق' : 'Pending'}</option>
                  <option value="confirmed">{locale === 'ar' ? 'مؤكد' : 'Confirmed'}</option>
                  <option value="cancelled">{locale === 'ar' ? 'ملغي' : 'Cancelled'}</option>
                  <option value="completed">{locale === 'ar' ? 'مكتمل' : 'Completed'}</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('')
                  }}
                  className="w-full btn btn-secondary"
                >
                  <Icon icon="refresh" className="w-4 h-4 mr-2" />
                  {locale === 'ar' ? 'مسح المرشحات' : 'Clear Filters'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Icon icon="list" className="w-5 h-5 text-blue-600 mr-2" />
                {locale === 'ar' ? 'دليل الحجوزات' : 'Bookings Directory'}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {filteredBookings.length} {locale === 'ar' ? 'من' : 'of'} {pagination.total} {locale === 'ar' ? 'النتائج' : 'results'}
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="loading-spinner w-12 h-12 mx-auto mb-4 text-blue-600"></div>
              <p className="text-gray-600 text-lg">{locale === 'ar' ? 'جاري تحميل الحجوزات...' : 'Loading bookings...'}</p>
              <p className="text-gray-500 text-sm mt-2">{locale === 'ar' ? 'يرجى الانتظار بينما نحصل على البيانات' : 'Please wait while we fetch data'}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Icon icon="calendar" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{locale === 'ar' ? 'لم يتم العثور على حجوزات' : 'No bookings found'}</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter 
                  ? (locale === 'ar' ? 'حاول تعديل المرشحات أو شروط البحث' : 'Try adjusting your filters or search terms') 
                  : (locale === 'ar' ? 'لم يتم إنشاء أي حجوزات بعد' : 'No bookings have been created yet')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'القائمة' : 'Listing'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'المستخدم' : 'User'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'التواريخ' : 'Dates'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {booking.listing?.images && booking.listing.images.length > 0 ? (
                              <img 
                                src={booking.listing.images[0].url} 
                                alt={booking.listing.title}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Icon icon="car" className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{booking.listing?.title || 'N/A'}</div>
                            <div className="text-sm text-gray-500">
                              {booking.listing?.make} {booking.listing?.model} • {booking.listing?.year}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.user?.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Icon icon="calendar" className="w-3 h-3 mr-1" />
                            Start: {new Date(booking.startDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Icon icon="calendar" className="w-3 h-3 mr-1" />
                            End: {new Date(booking.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                          <Icon icon={getStatusIcon(booking.status)} className="w-3 h-3 mr-1" />
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Icon icon="calendar" className="w-3 h-3 mr-1" />
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/bookings/${booking._id}`)}
                            className="btn btn-sm btn-secondary hover:btn-primary transition-colors"
                            title="View Booking"
                          >
                            <Icon icon="eye" className="w-4 h-4" />
                          </button>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleBookingAction(booking._id, 'confirm')}
                              className="btn btn-sm btn-success hover:bg-green-600 transition-colors"
                              title="Confirm Booking"
                            >
                              <Icon icon="check-circle" className="w-4 h-4" />
                            </button>
                          )}
                          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleBookingAction(booking._id, 'cancel')}
                              className="btn btn-sm btn-error hover:bg-red-600 transition-colors"
                              title="Cancel Booking"
                            >
                              <Icon icon="x-circle" className="w-4 h-4" />
                            </button>
                          )}
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

function getStatusBadgeClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusIcon(status) {
  const icons = {
    pending: 'clock',
    confirmed: 'check-circle',
    cancelled: 'x-circle',
    completed: 'calendar'
  }
  return icons[status] || 'circle'
}
