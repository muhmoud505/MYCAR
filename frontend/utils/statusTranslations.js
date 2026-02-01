// Status translation utilities for Arabic support

export const getStatusText = (status, locale = 'en') => {
  const statusMap = {
    // Listing statuses
    active: locale === 'ar' ? 'نشط' : 'Active',
    pending: locale === 'ar' ? 'معلق' : 'Pending',
    sold: locale === 'ar' ? 'تم البيع' : 'Sold',
    rented: locale === 'ar' ? 'مؤجر' : 'Rented',
    inactive: locale === 'ar' ? 'غير نشط' : 'Inactive',
    
    // Vehicle conditions
    new: locale === 'ar' ? 'جديد' : 'New',
    'like-new': locale === 'ar' ? 'مثل جديد' : 'Like New',
    excellent: locale === 'ar' ? 'ممتاز' : 'Excellent',
    good: locale === 'ar' ? 'جيد' : 'Good',
    fair: locale === 'ar' ? 'مقبول' : 'Fair',
    poor: locale === 'ar' ? 'ضعيف' : 'Poor',
    
    // User statuses
    verified: locale === 'ar' ? 'موثق' : 'Verified',
    unverified: locale === 'ar' ? 'غير موثق' : 'Unverified',
    active: locale === 'ar' ? 'نشط' : 'Active',
    blocked: locale === 'ar' ? 'محظور' : 'Blocked',
    suspended: locale === 'ar' ? 'معلق' : 'Suspended',
    
    // Message statuses
    read: locale === 'ar' ? 'مقروء' : 'Read',
    unread: locale === 'ar' ? 'غير مقروء' : 'Unread',
    
    // Review statuses
    approved: locale === 'ar' ? 'موافق عليه' : 'Approved',
    rejected: locale === 'ar' ? 'مرفوض' : 'Rejected',
    flagged: locale === 'ar' ? 'مُعلّم' : 'Flagged',
    
    // Booking statuses
    confirmed: locale === 'ar' ? 'مؤكد' : 'Confirmed',
    cancelled: locale === 'ar' ? 'ملغي' : 'Cancelled',
    completed: locale === 'ar' ? 'مكتمل' : 'Completed',
    
    // Payment statuses
    pending: locale === 'ar' ? 'معلق' : 'Pending',
    processing: locale === 'ar' ? 'قيد المعالجة' : 'Processing',
    completed: locale === 'ar' ? 'مكتمل' : 'Completed',
    failed: locale === 'ar' ? 'فشل' : 'Failed',
    refunded: locale === 'ar' ? 'مُسترد' : 'Refunded'
  }
  
  return statusMap[status] || status
}

export const getStatusColor = (status) => {
  const colorMap = {
    // Listing statuses
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-red-100 text-red-800',
    rented: 'bg-blue-100 text-blue-800',
    inactive: 'bg-gray-100 text-gray-800',
    
    // Vehicle conditions
    new: 'bg-green-100 text-green-800',
    'like-new': 'bg-green-100 text-green-800',
    excellent: 'bg-blue-100 text-blue-800',
    good: 'bg-yellow-100 text-yellow-800',
    fair: 'bg-orange-100 text-orange-800',
    poor: 'bg-red-100 text-red-800',
    
    // User statuses
    verified: 'bg-green-100 text-green-800',
    unverified: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    blocked: 'bg-red-100 text-red-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    
    // Message statuses
    read: 'bg-gray-100 text-gray-800',
    unread: 'bg-blue-100 text-blue-800',
    
    // Review statuses
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    flagged: 'bg-yellow-100 text-yellow-800',
    
    // Booking statuses
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    
    // Payment statuses
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

export const getStatusBadge = (status, locale = 'en') => {
  return {
    text: getStatusText(status, locale),
    color: getStatusColor(status)
  }
}
