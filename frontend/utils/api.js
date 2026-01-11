const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function req(path, opts = {}){
  const headers = opts.headers || {}
  const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null
  if (token) headers['Authorization'] = `Bearer ${token}`
  headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  
  // Add timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
  
  try {
    const res = await fetch(API_BASE + path, { 
      ...opts, 
      headers,
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!res.ok) {
      const text = await res.text()
      let errorData = { error: text }
      try { 
        errorData = JSON.parse(text) 
      } catch (e) {
        // If JSON parsing fails, use the raw text
      }
      
      // Create a proper error object with response information
      const error = new Error(errorData.error || res.statusText)
      error.response = {
        status: res.status,
        statusText: res.statusText,
        data: errorData
      }
      throw error
    }
    
    return res.json()
  } catch (error) {
    clearTimeout(timeoutId)
    
    // Re-throw with additional context if it's our custom error
    if (error.response) {
      throw error
    }
    
    // Handle network errors, timeouts, etc.
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timed out')
      timeoutError.code = 'ECONNABORTED'
      throw timeoutError
    }
    
    if (error.message.includes('fetch')) {
      const networkError = new Error('Network connection failed')
      networkError.code = 'NETWORK_ERROR'
      throw networkError
    }
    
    throw error
  }
}

export const api = {
  login: (data) => req('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => req('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (data) => req('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data) => req('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  fetchListings: (query='') => req('/api/inventory' + (query ? `?${query}` : '')),
  fetchListing: (id) => req(`/api/inventory/${id}`),
  createListing: (data) => req('/api/listings', { method: 'POST', body: JSON.stringify(data) }),
  // Search
  search: (q) => req(`/api/search?${q}`),
  autocomplete: (q) => req(`/api/search/autocomplete?q=${encodeURIComponent(q)}`),
  // Classifieds
  fetchClassifieds: () => req('/api/classifieds'),
  createClassified: (data) => req('/api/classifieds', { method: 'POST', body: JSON.stringify(data) }),
  // Rentals
  fetchRentals: () => req('/api/rentals'),
  createRental: (data) => req('/api/rentals', { method: 'POST', body: JSON.stringify(data) }),
  // Rental Booking
  getRentalAvailability: (listingId, query='') => req(`/api/rental-booking/availability/${listingId}${query ? `?${query}` : ''}`),
  calculateRentalPricing: (data) => req('/api/rental-booking/calculate-pricing', { method: 'POST', body: JSON.stringify(data) }),
  createRentalBooking: (data) => req('/api/rental-booking/book', { method: 'POST', body: JSON.stringify(data) }),
  getUserRentalBookings: (query='') => req(`/api/rental-booking/my-bookings${query ? `?${query}` : ''}`),
  updateRentalBookingStatus: (bookingId, data) => req(`/api/rental-booking/${bookingId}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  // Messages
  sendMessage: (data) => req('/api/messages/send', { method: 'POST', body: JSON.stringify(data) }),
  getConversations: (query='') => req(`/api/messages/conversations${query ? `?${query}` : ''}`),
  getMessages: (userId, query='') => req(`/api/messages/user/${userId}${query ? `?${query}` : ''}`),
  markMessageAsRead: (messageId) => req(`/api/messages/${messageId}/read`, { method: 'PUT' }),
  getUnreadCount: () => req('/api/messages/unread/count'),
  deleteMessage: (messageId) => req(`/api/messages/${messageId}`, { method: 'DELETE' }),
  // Reviews
  fetchReviews: (target, targetId, query='') => req(`/api/reviews/target/${target}/${targetId}${query ? `?${query}` : ''}`),
  createReview: (data) => req('/api/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getExpertReviews: (query='') => req(`/api/reviews/expert${query ? `?${query}` : ''}`),
  getComparisonReviews: (query='') => req(`/api/reviews/comparison${query ? `?${query}` : ''}`),
  updateReviewInteraction: (reviewId, data) => req(`/api/reviews/${reviewId}/interact`, { method: 'PUT', body: JSON.stringify(data) }),
  reportReview: (reviewId, data) => req(`/api/reviews/${reviewId}/report`, { method: 'POST', body: JSON.stringify(data) }),
  respondToReview: (reviewId, data) => req(`/api/reviews/${reviewId}/respond`, { method: 'POST', body: JSON.stringify(data) }),
  getUserReviews: (query='') => req(`/api/reviews/my-reviews${query ? `?${query}` : ''}`),
  // Financing
  calculateFinancing: (data) => req('/api/financing/calculate', { method: 'POST', body: JSON.stringify(data) }),
  createFinancingApplication: (data) => req('/api/financing/apply', { method: 'POST', body: JSON.stringify(data) }),
  // Trade-in
  evaluateTradeIn: (data) => req('/api/trade-in/evaluate', { method: 'POST', body: JSON.stringify(data) }),
  createTradeInRequest: (data) => req('/api/trade-in/request', { method: 'POST', body: JSON.stringify(data) }),
  // Test Drive
  bookTestDrive: (data) => req('/api/test-drive/book', { method: 'POST', body: JSON.stringify(data) }),
  getTestDriveAvailability: (listingId, query='') => req(`/api/test-drive/availability/${listingId}${query ? `?${query}` : ''}`),
  getUserTestDrives: (query='') => req(`/api/test-drive/my-bookings${query ? `?${query}` : ''}`),
  // Dealerships
  fetchDealerships: () => req('/api/dealerships'),
  // Accounts
  getProfile: () => req('/api/accounts/me'),
  updateProfile: (data) => req('/api/accounts/me', { method: 'PUT', body: JSON.stringify(data) }),
}

export default api
