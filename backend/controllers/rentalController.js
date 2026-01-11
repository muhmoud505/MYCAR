const RentalBooking = require('../models/RentalBooking')
const Listing = require('../models/Listing')
const { parseNumber } = require('../controllers/searchController')

// Get availability calendar for a listing
async function getAvailability(req, res) {
  try {
    const { listingId } = req.params
    const { startDate, endDate } = req.query

    if (!listingId) {
      return res.status(400).json({ error: 'Listing ID required' })
    }

    // Verify listing exists and is for rent
    const listing = await Listing.findById(listingId)
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' })
    }
    
    if (listing.type !== 'rental' || !listing.rentalDetails?.available) {
      return res.status(400).json({ error: 'Listing is not available for rent' })
    }

    // Set default date range (next 3 months)
    const start = startDate ? new Date(startDate) : new Date()
    const end = endDate ? new Date(endDate) : new Date()
    end.setMonth(end.getMonth() + 3)

    // Get existing bookings for the date range
    const bookings = await RentalBooking.find({
      listing: listingId,
      status: { $in: ['confirmed', 'paid', 'active'] },
      $or: [
        { startDate: { $lte: end, $gte: start } },
        { endDate: { $lte: end, $gte: start } },
        { startDate: { $lte: start }, endDate: { $gte: end } }
      ]
    }).select('startDate endDate status')

    // Generate availability calendar
    const availability = generateAvailabilityCalendar(start, end, bookings, listing.rentalDetails)

    res.json({
      listingId,
      rentalDetails: listing.rentalDetails,
      availability,
      pricing: {
        dailyRate: listing.rentalDetails.pricePerDay,
        weeklyRate: listing.rentalDetails.pricePerWeek,
        monthlyRate: listing.rentalDetails.pricePerMonth,
        deposit: listing.rentalDetails.deposit,
        minimumRentalDays: listing.rentalDetails.minimumRentalDays
      }
    })
  } catch (err) {
    console.error('Get availability error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Calculate rental pricing
async function calculatePricing(req, res) {
  try {
    const { listingId, startDate, endDate, insuranceType = 'basic' } = req.body

    if (!listingId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start >= end) {
      return res.status(400).json({ error: 'End date must be after start date' })
    }

    // Get listing details
    const listing = await Listing.findById(listingId)
    if (!listing || !listing.rentalDetails?.available) {
      return res.status(404).json({ error: 'Rental not available' })
    }

    // Check minimum rental days
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    if (days < listing.rentalDetails.minimumRentalDays) {
      return res.status(400).json({ 
        error: `Minimum rental period is ${listing.rentalDetails.minimumRentalDays} days` 
      })
    }

    // Check availability
    const conflictingBookings = await RentalBooking.countDocuments({
      listing: listingId,
      status: { $in: ['confirmed', 'paid', 'active'] },
      $or: [
        { startDate: { $lte: end, $gte: start } },
        { endDate: { $lte: end, $gte: start } },
        { startDate: { $lte: start }, endDate: { $gte: end } }
      ]
    })

    if (conflictingBookings > 0) {
      return res.status(400).json({ error: 'Vehicle not available for selected dates' })
    }

    // Calculate pricing
    const pricing = calculateRentalPricing(days, listing.rentalDetails, insuranceType)

    res.json({
      startDate,
      endDate,
      days,
      pricing,
      available: true
    })
  } catch (err) {
    console.error('Calculate pricing error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Create rental booking
async function createBooking(req, res) {
  try {
    const {
      listingId,
      startDate,
      endDate,
      pickup,
      dropoff,
      insurance,
      driverVerification,
      notes
    } = req.body

    const renterId = req.user.id

    if (!listingId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Get listing and verify
    const listing = await Listing.findById(listingId).populate('seller')
    if (!listing || !listing.rentalDetails?.available) {
      return res.status(404).json({ error: 'Rental not available' })
    }

    // Calculate pricing
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    const pricing = calculateRentalPricing(days, listing.rentalDetails, insurance?.coverageType || 'basic')

    // Create booking
    const booking = await RentalBooking.create({
      listing: listingId,
      renter: renterId,
      owner: listing.seller._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pickupDate: new Date(startDate),
      returnDate: new Date(endDate),
      pricing,
      insurance: insurance || {},
      driverVerification: driverVerification || {},
      pickup: pickup || {},
      dropoff: dropoff || {},
      notes
    })

    // Populate booking details
    const populatedBooking = await RentalBooking.findById(booking._id)
      .populate('listing', 'title make model year images')
      .populate('renter', 'name email phone')
      .populate('owner', 'name email phone')

    res.status(201).json(populatedBooking)
  } catch (err) {
    console.error('Create booking error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get user's rental bookings
async function getUserBookings(req, res) {
  try {
    const userId = req.user.id
    const { status, page = 1, limit = 20 } = req.query

    const query = {
      $or: [{ renter: userId }, { owner: userId }]
    }

    if (status) {
      query.status = status
    }

    const bookings = await RentalBooking.find(query)
      .populate('listing', 'title make model year images')
      .populate('renter', 'name email avatar')
      .populate('owner', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await RentalBooking.countDocuments(query)

    res.json({
      bookings,
      page: parseInt(page),
      limit: parseInt(limit),
      total
    })
  } catch (err) {
    console.error('Get user bookings error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Update booking status
async function updateBookingStatus(req, res) {
  try {
    const { bookingId } = req.params
    const { status, notes } = req.body
    const userId = req.user.id

    if (!status) {
      return res.status(400).json({ error: 'Status required' })
    }

    const booking = await RentalBooking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Verify user is owner or renter
    if (booking.renter.toString() !== userId && booking.owner.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    // Update booking
    booking.status = status
    if (notes) booking.notes = notes
    booking.updatedAt = new Date()

    await booking.save()

    res.json(booking)
  } catch (err) {
    console.error('Update booking status error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Helper functions
function generateAvailabilityCalendar(startDate, endDate, bookings, rentalDetails) {
  const calendar = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0]
    const isBooked = bookings.some(booking => 
      current >= booking.startDate && current <= booking.endDate
    )
    
    calendar.push({
      date: dateStr,
      available: !isBooked,
      price: rentalDetails.pricePerDay,
      minimumDays: rentalDetails.minimumRentalDays
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return calendar
}

function calculateRentalPricing(days, rentalDetails, insuranceType = 'basic') {
  let basePrice = 0
  
  // Calculate base price based on duration
  if (days >= 30 && rentalDetails.pricePerMonth) {
    basePrice = rentalDetails.pricePerMonth * Math.ceil(days / 30)
  } else if (days >= 7 && rentalDetails.pricePerWeek) {
    basePrice = rentalDetails.pricePerWeek * Math.ceil(days / 7)
  } else {
    basePrice = rentalDetails.pricePerDay * days
  }
  
  // Insurance pricing
  const insuranceRates = {
    basic: 0,
    standard: basePrice * 0.1,
    premium: basePrice * 0.15,
    comprehensive: basePrice * 0.2
  }
  
  const insuranceFee = insuranceRates[insuranceType] || 0
  const serviceFee = basePrice * 0.05 // 5% service fee
  const taxes = (basePrice + insuranceFee + serviceFee) * 0.08 // 8% tax
  
  const totalPrice = basePrice + insuranceFee + serviceFee + taxes
  
  return {
    dailyRate: rentalDetails.pricePerDay,
    weeklyRate: rentalDetails.pricePerWeek,
    monthlyRate: rentalDetails.pricePerMonth,
    totalDays: days,
    basePrice: Math.round(basePrice * 100) / 100,
    insuranceFee: Math.round(insuranceFee * 100) / 100,
    serviceFee: Math.round(serviceFee * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    deposit: rentalDetails.deposit,
    totalPrice: Math.round(totalPrice * 100) / 100,
    currency: 'USD'
  }
}

module.exports = {
  getAvailability,
  calculatePricing,
  createBooking,
  getUserBookings,
  updateBookingStatus
}
