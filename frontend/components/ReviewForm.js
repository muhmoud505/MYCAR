import React, { useState } from 'react'
import { Icon } from './UI'

export default function ReviewForm({ listingId, onReviewSubmitted }) {
  const [review, setReview] = useState({
    rating: 5,
    title: '',
    content: '',
    pros: '',
    cons: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...review,
          target: 'listing',
          targetId: listingId
        })
      })

      const data = await response.json()
      if (data.ok) {
        setReview({
          rating: 5,
          title: '',
          content: '',
          pros: '',
          cons: ''
        })
        onReviewSubmitted && onReviewSubmitted(data.review)
      } else {
        setError(data.error || 'Failed to submit review')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setReview(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Icon icon="star" className="w-5 h-5 text-yellow-500 mr-2" />
        Write a Review
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <Icon icon="alert-circle" className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Icon icon="star" className="w-4 h-4 inline mr-1" />
            Overall Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange('rating', star)}
                className={`p-1 rounded-full transition-colors ${
                  star <= review.rating
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                <Icon icon="star" className="w-6 h-6" fill={star <= review.rating ? 'currentColor' : 'none'} />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {review.rating} out of 5 stars
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Icon icon="type" className="w-4 h-4 inline mr-1" />
            Review Title
          </label>
          <input
            type="text"
            value={review.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Summarize your experience in a few words..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Review Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Icon icon="file-text" className="w-4 h-4 inline mr-1" />
            Detailed Review
          </label>
          <textarea
            value={review.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Share your detailed experience with this vehicle..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Pros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Icon icon="check-circle" className="w-4 h-4 inline mr-1" />
            What You Liked (Pros)
          </label>
          <textarea
            value={review.pros}
            onChange={(e) => handleInputChange('pros', e.target.value)}
            placeholder="What did you like about this vehicle?"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Cons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Icon icon="x-circle" className="w-4 h-4 inline mr-1" />
            What Could Be Improved (Cons)
          </label>
          <textarea
            value={review.cons}
            onChange={(e) => handleInputChange('cons', e.target.value)}
            placeholder="What could be improved?"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Your review will help other buyers make informed decisions.
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Icon icon="send" className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
