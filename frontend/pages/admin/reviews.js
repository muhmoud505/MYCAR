import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'
import { Icon } from '../../components/UI'
import { useLocale } from '../../contexts/LocaleContext'

export default function AdminReviews() {
  const { t, locale } = useLocale()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })

  useEffect(() => {
    loadReviews()
  }, [pagination.page, searchTerm, statusFilter, ratingFilter])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(ratingFilter && { rating: ratingFilter })
      })

      const response = await fetch(`/api/admin/reviews?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()
      if (data.ok) {
        setReviews(data.reviews)
        setPagination(data.pagination)
      } else {
        console.error('Admin reviews error:', data.error)
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewAction = async (reviewId, action) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/reviews/${reviewId}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        loadReviews()
      }
    } catch (error) {
      console.error('Error performing review action:', error)
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (review.target && review.target.name && review.target.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = !statusFilter || review.status === statusFilter
    const matchesRating = !ratingFilter || review.rating === parseInt(ratingFilter)
    
    return matchesSearch && matchesStatus && matchesRating
  })

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon 
        key={i} 
        icon="star" 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ))
  }

  return (
    <AdminLayout title={locale === 'ar' ? 'إدارة التقييمات' : 'Review Management'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Icon icon="star" className="w-6 h-6 text-blue-600 mr-3" />
                  {locale === 'ar' ? 'إدارة التقييمات' : 'Review Management'}
                </h1>
                <p className="text-gray-600 mt-1">{locale === 'ar' ? 'مراجعة وإدارة تقييمات المستخدمين' : 'Moderate and manage user reviews'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">{locale === 'ar' ? 'إجمالي التقييمات' : 'Total Reviews'}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon icon="search" className="w-4 h-4 inline mr-1" />
                  {locale === 'ar' ? 'البحث في التقييمات' : 'Search Reviews'}
                </label>
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'البحث بالعنوان أو المحتوى أو الهدف...' : 'Search by title, content, or target...'}
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
                  <option value="approved">{locale === 'ar' ? 'موافق عليه' : 'Approved'}</option>
                  <option value="pending">{locale === 'ar' ? 'معلق' : 'Pending'}</option>
                  <option value="flagged">{locale === 'ar' ? 'مبلغ عنه' : 'Flagged'}</option>
                  <option value="removed">{locale === 'ar' ? 'تمت إزالته' : 'Removed'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon icon="star" className="w-4 h-4 inline mr-1" />
                  {locale === 'ar' ? 'مرشح التقييم' : 'Rating Filter'}
                </label>
                <select 
                  value={ratingFilter} 
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{locale === 'ar' ? 'جميع التقييمات' : 'All Ratings'}</option>
                  <option value="5">{locale === 'ar' ? '5 نجوم' : '5 Stars'}</option>
                  <option value="4">{locale === 'ar' ? '4 نجوم' : '4 Stars'}</option>
                  <option value="3">{locale === 'ar' ? '3 نجوم' : '3 Stars'}</option>
                  <option value="2">{locale === 'ar' ? 'نجمتان' : '2 Stars'}</option>
                  <option value="1">{locale === 'ar' ? 'نجمة واحدة' : '1 Star'}</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('')
                    setRatingFilter('')
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

        {/* Reviews Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Icon icon="list" className="w-5 h-5 text-blue-600 mr-2" />
                {locale === 'ar' ? 'دليل التقييمات' : 'Reviews Directory'}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {filteredReviews.length} {locale === 'ar' ? 'من' : 'of'} {pagination.total} {locale === 'ar' ? 'النتائج' : 'results'}
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="loading-spinner w-12 h-12 mx-auto mb-4 text-blue-600"></div>
              <p className="text-gray-600 text-lg">{locale === 'ar' ? 'جاري تحميل التقييمات...' : 'Loading reviews...'}</p>
              <p className="text-gray-500 text-sm mt-2">{locale === 'ar' ? 'يرجى الانتظار بينما نحصل على البيانات' : 'Please wait while we fetch data'}</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-12 text-center">
              <Icon icon="star" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{locale === 'ar' ? 'لم يتم العثور على تقييمات' : 'No reviews found'}</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter || ratingFilter 
                  ? (locale === 'ar' ? 'حاول تعديل المرشحات أو شروط البحث' : 'Try adjusting your filters or search terms') 
                  : (locale === 'ar' ? 'لم يتم إنشاء أي تقييمات بعد' : 'No reviews have been created yet')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'التقييم' : 'Rating'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'الهدف' : 'Target'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviewer
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
                  {filteredReviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 mb-1">{review.title}</div>
                          <div className="text-sm text-gray-600 line-clamp-2">{review.content}</div>
                          {review.pros && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-green-600">Pros:</span>
                              <div className="text-xs text-gray-600">{review.pros}</div>
                            </div>
                          )}
                          {review.cons && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-red-600">Cons:</span>
                              <div className="text-xs text-gray-600">{review.cons}</div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {review.target?.name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {review.target?.type || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {review.reviewer?.name || 'Anonymous'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {review.reviewer?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(review.status)}`}>
                          <Icon icon={getStatusIcon(review.status)} className="w-3 h-3 mr-1" />
                          {review.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Icon icon="calendar" className="w-3 h-3 mr-1" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/reviews/${review._id}`)}
                            className="btn btn-sm btn-secondary hover:btn-primary transition-colors"
                            title="View Review"
                          >
                            <Icon icon="eye" className="w-4 h-4" />
                          </button>
                          {review.status === 'pending' && (
                            <button
                              onClick={() => handleReviewAction(review._id, 'approve')}
                              className="btn btn-sm btn-success hover:bg-green-600 transition-colors"
                              title="Approve Review"
                            >
                              <Icon icon="check-circle" className="w-4 h-4" />
                            </button>
                          )}
                          {review.status === 'flagged' && (
                            <button
                              onClick={() => handleReviewAction(review._id, 'unflag')}
                              className="btn btn-sm btn-warning hover:bg-yellow-600 transition-colors"
                              title="Unflag Review"
                            >
                              <Icon icon="flag" className="w-4 h-4" />
                            </button>
                          )}
                          {review.status !== 'removed' && (
                            <button
                              onClick={() => handleReviewAction(review._id, 'remove')}
                              className="btn btn-sm btn-error hover:bg-red-600 transition-colors"
                              title="Remove Review"
                            >
                              <Icon icon="trash" className="w-4 h-4" />
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
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    flagged: 'bg-orange-100 text-orange-800',
    removed: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusIcon(status) {
  const icons = {
    approved: 'check-circle',
    pending: 'clock',
    flagged: 'flag',
    removed: 'x-circle'
  }
  return icons[status] || 'circle'
}
