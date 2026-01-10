const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function req(path, opts = {}){
  const headers = opts.headers || {}
  const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null
  if (token) headers['Authorization'] = `Bearer ${token}`
  headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  const res = await fetch(API_BASE + path, { ...opts, headers })
  if (!res.ok) {
    const text = await res.text()
    let message = text
    try { message = JSON.parse(text) } catch (e) {}
    throw new Error(message && message.error ? message.error : res.statusText)
  }
  return res.json()
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
  // Dealerships
  fetchDealerships: () => req('/api/dealerships'),
  // Reviews
  fetchReviews: () => req('/api/reviews'),
  createReview: (data) => req('/api/reviews', { method: 'POST', body: JSON.stringify(data) }),
  // Accounts
  getProfile: () => req('/api/accounts/me'),
  updateProfile: (data) => req('/api/accounts/me', { method: 'PUT', body: JSON.stringify(data) }),
}

export default api
