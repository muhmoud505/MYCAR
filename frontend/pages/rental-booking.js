import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import api from '../utils/api'
import Navbar from '../components/Navbar'

export default function RentalBookingPage() {
  const router = useRouter()
  const { listingId } = router.query
  
  const [listing, setListing] = useState(null)
  const [availability, setAvailability] = useState([])
  const [pricing, setPricing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    pickup: { location: 'dealership' },
    dropoff: { location: 'dealership' },
    insurance: { coverageType: 'basic' },
    driverVerification: {},
    notes: ''
  })

  useEffect(() => {
    if (listingId) {
      loadListingAndAvailability()
    }
  }, [listingId])

  const loadListingAndAvailability = async () => {
    try {
      // Load listing details
      const listingResponse = await api.fetchListing(listingId)
      setListing(listingResponse)

      // Load availability for next 3 months
      const availabilityResponse = await api.getRentalAvailability(listingId)
      setAvailability(availabilityResponse.availability || [])
    } catch (err) {
      console.error('Failed to load listing:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculatePricing = async () => {
    if (!bookingData.startDate || !bookingData.endDate) return

    try {
      const response = await api.calculateRentalPricing({
        listingId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        insuranceType: bookingData.insurance.coverageType
      })
      
      if (response.available) {
        setPricing(response.pricing)
      } else {
        alert('Vehicle not available for selected dates')
        setPricing(null)
      }
    } catch (err) {
      console.error('Failed to calculate pricing:', err)
      alert('Failed to calculate pricing')
    }
  }

  const createBooking = async (e) => {
    e.preventDefault()
    
    if (!pricing) {
      alert('Please calculate pricing first')
      return
    }

    try {
      const response = await api.createRentalBooking({
        listingId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        pickup: bookingData.pickup,
        dropoff: bookingData.dropoff,
        insurance: bookingData.insurance,
        driverVerification: bookingData.driverVerification,
        notes: bookingData.notes
      })

      alert('Booking created successfully!')
      router.push('/account/rentals')
    } catch (err) {
      console.error('Failed to create booking:', err)
      alert('Failed to create booking')
    }
  }

  const isDateAvailable = (dateStr) => {
    const day = availability.find(day => day.date === dateStr)
    return day && day.available
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center">Listing not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-6">Book Rental</h1>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">{listing.title}</h2>
                <p className="text-gray-600">{listing.make} {listing.model} • {listing.year}</p>
                <p className="text-2xl font-bold text-green-600">
                  ${listing.rentalDetails?.pricePerDay}/day
                </p>
              </div>

              <form onSubmit={createBooking} className="space-y-6">
                {/* Date Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Rental Dates</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date</label>
                      <input
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">End Date</label>
                      <input
                        type="date"
                        value={bookingData.endDate}
                        onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={calculatePricing}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Calculate Price
                  </button>
                </div>

                {/* Pickup/Drop-off */}
                <div>
                  <h3 className="font-semibold mb-3">Pickup & Drop-off</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pickup Location</label>
                      <select
                        value={bookingData.pickup.location}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          pickup: {...bookingData.pickup, location: e.target.value}
                        })}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="dealership">Dealership</option>
                        <option value="airport">Airport</option>
                        <option value="home">Home</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Drop-off Location</label>
                      <select
                        value={bookingData.dropoff.location}
                        onChange={(e) => setBookingData({
                          ...bookingData,
                          dropoff: {...bookingData.dropoff, location: e.target.value}
                        })}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="dealership">Dealership</option>
                        <option value="airport">Airport</option>
                        <option value="home">Home</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Insurance */}
                <div>
                  <h3 className="font-semibold mb-3">Insurance Coverage</h3>
                  <select
                    value={bookingData.insurance.coverageType}
                    onChange={(e) => setBookingData({
                      ...bookingData,
                      insurance: {...bookingData.insurance, coverageType: e.target.value}
                    })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="basic">Basic (Included)</option>
                    <option value="standard">Standard (+10%)</option>
                    <option value="premium">Premium (+15%)</option>
                    <option value="comprehensive">Comprehensive (+20%)</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes</label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    className="w-full p-2 border rounded-lg h-24"
                    placeholder="Any special requests or notes..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={!pricing}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pricing ? `Book Now - $${pricing.totalPrice}` : 'Calculate Price First'}
                </button>
              </form>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="font-semibold mb-4">Pricing Summary</h3>
              
              {pricing ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Daily Rate:</span>
                    <span>${pricing.dailyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days:</span>
                    <span>{pricing.totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>${pricing.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance:</span>
                    <span>${pricing.insuranceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee:</span>
                    <span>${pricing.serviceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes:</span>
                    <span>${pricing.taxes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit:</span>
                    <span>${pricing.deposit}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-green-600">${pricing.totalPrice}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select dates to see pricing</p>
              )}

              {/* Availability Calendar Preview */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Availability</h4>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {availability.slice(0, 35).map((day, index) => (
                    <div
                      key={day.date}
                      className={`p-1 text-center rounded ${
                        day.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {new Date(day.date).getDate()}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-green-100 rounded mr-1"></div>
                    Available
                  </span>
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-red-100 rounded mr-1"></div>
                    Booked
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
