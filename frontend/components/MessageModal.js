import React, { useState } from 'react'
import api from '../utils/api'

export default function MessageModal({ isOpen, onClose, receiverId, listingId }) {
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState('general')
  const [loading, setLoading] = useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!subject || !content) return

    setLoading(true)
    try {
      await api.sendMessage({
        receiver: receiverId,
        listing: listingId,
        subject,
        content,
        type
      })
      
      // Reset form
      setSubject('')
      setContent('')
      setType('general')
      onClose()
    } catch (err) {
      console.error('Failed to send message:', err)
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Send Message</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={sendMessage}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter subject"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="general">General Inquiry</option>
              <option value="inquiry">Vehicle Inquiry</option>
              <option value="offer">Make an Offer</option>
              <option value="appointment">Schedule Appointment</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-lg h-32"
              placeholder="Enter your message..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
