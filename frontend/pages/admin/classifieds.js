import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'
import { Icon } from '../../components/UI'
import { useLocale } from '../../contexts/LocaleContext'

export default function AdminClassifieds() {
  const { t, locale } = useLocale()
  const [classifieds, setClassifieds] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })

  useEffect(() => {
    loadClassifieds()
  }, [pagination.page, searchTerm, statusFilter])

  const loadClassifieds = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/classifieds?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await response.json()
      if (data.ok) {
        setClassifieds(data.classifieds)
        setPagination(data.pagination)
      } else {
        console.error('Admin classifieds error:', data.error)
      }
    } catch (error) {
      console.error('Error loading classifieds:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClassifiedAction = async (classifiedId, action) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/classifieds/${classifiedId}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        loadClassifieds()
      }
    } catch (error) {
      console.error('Error performing classified action:', error)
    }
  }

  const filteredClassifieds = classifieds.filter(classified => {
    const matchesSearch = classified.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classified.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classified.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || classified.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout title="Classified Management">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Icon icon="file-text" className="w-6 h-6 text-blue-600 mr-3" />
                  {locale === 'ar' ? 'إدارة الإعلانات المصنفة' : 'Classified Management'}
                </h1>
                <p className="text-gray-600 mt-1">{locale === 'ar' ? 'إدارة ومراقبة جميع الإعلانات المصنفة' : 'Manage and monitor all classified advertisements'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-500">{locale === 'ar' ? 'إجمالي الإعلانات المصنفة' : 'Total Classifieds'}</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
                <button 
                  onClick={() => router.push('/admin/classifieds/create')}
                  className="btn btn-primary"
                >
                  <Icon icon="plus" className="w-4 h-4 mr-2" />
                  {locale === 'ar' ? 'إضافة إعلان مصنف' : 'Add Classified'}
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
              {locale === 'ar' ? 'المرشحات والبحث' : 'Filters & Search'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Icon icon="search" className="w-4 h-4 inline mr-1" />
                  {locale === 'ar' ? 'البحث في الإعلانات المصنفة' : 'Search Classifieds'}
                </label>
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'البحث بالعنوان أو الوصف أو الفئة...' : 'Search by title, description, or category...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                  <option value="">جميع الحالات</option>
                  <option value="approved">معتمد</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="inactive">غير نشط</option>
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

        {/* Classifieds Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Icon icon="list" className="w-5 h-5 text-blue-600 mr-2" />
                {locale === 'ar' ? 'دليل الإعلانات المصنفة' : 'Classifieds Directory'}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {filteredClassifieds.length} {locale === 'ar' ? 'من' : 'of'} {pagination.total} {locale === 'ar' ? 'النتائج' : 'results'}
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="loading-spinner w-12 h-12 mx-auto mb-4 text-blue-600"></div>
              <p className="text-gray-600 text-lg">{locale === 'ar' ? 'جاري تحميل الإعلانات المصنفة...' : 'Loading classifieds...'}</p>
              <p className="text-gray-500 text-sm mt-2">{locale === 'ar' ? 'يرجى الانتظار بينما نحصل على البيانات' : 'Please wait while we fetch data'}</p>
            </div>
          ) : filteredClassifieds.length === 0 ? (
            <div className="p-12 text-center">
              <Icon icon="file-text" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{locale === 'ar' ? 'لم يتم العثور على إعلانات مصنفة' : 'No classifieds found'}</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter 
                  ? (locale === 'ar' ? 'حاول تعديل المرشحات أو شروط البحث' : 'Try adjusting your filters or search terms') 
                  : (locale === 'ar' ? 'لم يتم إنشاء أي إعلانات مصنفة بعد' : 'No classifieds have been created yet')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'الإعلان' : 'Advertisement'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'الفئة' : 'Category'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'البائع' : 'Seller'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'تم الإنشاء' : 'Created'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClassifieds.map((classified) => (
                    <tr key={classified._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                              <Icon icon="file-text" className="w-6 h-6 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{classified.title}</div>
                            <div className="text-sm text-gray-500">{classified.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {classified.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {classified.seller?.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {classified.seller?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(classified.status)}`}>
                          <Icon icon={getStatusIcon(classified.status)} className="w-3 h-3 mr-1" />
                          {classified.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Icon icon="calendar" className="w-3 h-3 mr-1" />
                          {new Date(classified.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/classifieds/${classified._id}`)}
                            className="btn btn-sm btn-secondary hover:btn-primary transition-colors"
                            title={locale === 'ar' ? 'عرض الإعلان المصنف' : 'View Classified'}
                          >
                            <Icon icon="eye" className="w-4 h-4" />
                          </button>
                          {classified.status === 'pending' && (
                            <button
                              onClick={() => handleClassifiedAction(classified._id, 'approve')}
                              className="btn btn-sm btn-success hover:bg-green-600 transition-colors"
                              title={locale === 'ar' ? 'موافقة على الإعلان المصنف' : 'Approve Classified'}
                            >
                              <Icon icon="check-circle" className="w-4 h-4" />
                            </button>
                          )}
                          {classified.status !== 'inactive' && (
                            <button
                              onClick={() => handleClassifiedAction(classified._id, 'remove')}
                              className="btn btn-sm btn-error hover:bg-red-600 transition-colors"
                              title={locale === 'ar' ? 'إزالة الإعلان المصنف' : 'Remove Classified'}
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
    inactive: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusIcon(status) {
  const icons = {
    approved: 'check-circle',
    pending: 'clock',
    inactive: 'x-circle'
  }
  return icons[status] || 'circle'
}
