const User = require('../models/User')
const Listing = require('../models/Listing')
const Review = require('../models/Review')
const Message = require('../models/Message')
const RentalBooking = require('../models/RentalBooking')
const Verification = require('../models/Verification')
const Dealership = require('../models/Dealership')
const Rental = require('../models/Rental')
const Classified = require('../models/Classified')

// Helper function to create admin user if needed
async function ensureAdminUser() {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@mycar.com' });
    if (!existingAdmin) {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@mycar.com',
        password: hash,
        name: 'Admin User',
        role: 'admin',
        isVerified: true,
        emailVerified: true,
        phoneVerified: true,
        profileCompleted: true
      });
      console.log('Admin user created: admin@mycar.com / admin123');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    console.log('Getting admin stats...')
    console.log('Authenticated user:', req.user)
    
    // Ensure admin user exists
    await ensureAdminUser();
    
    const [
      userCount,
      listingCount,
      activeListingCount,
      dealershipCount,
      verifiedDealershipCount,
      rentalCount,
      activeRentalCount,
      pendingRentalCount,
      classifiedCount,
      approvedClassifiedCount,
      pendingClassifiedCount,
      reviewCount,
      approvedReviewCount,
      pendingReviewCount,
      messageCount,
      unreadMessageCount,
      bookingCount,
      confirmedBookingCount,
      pendingBookingCount
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ status: 'active' }),
      Dealership.countDocuments(),
      Dealership.countDocuments({ verified: true }),
      Rental.countDocuments(),
      Rental.countDocuments({ status: 'active' }),
      Rental.countDocuments({ status: 'pending' }),
      Classified.countDocuments(),
      Classified.countDocuments({ status: 'approved' }),
      Classified.countDocuments({ status: 'pending' }),
      Review.countDocuments(),
      Review.countDocuments({ status: 'approved' }),
      Review.countDocuments({ status: 'pending' }),
      Message.countDocuments(),
      Message.countDocuments({ status: 'unread' }),
      RentalBooking.countDocuments(),
      RentalBooking.countDocuments({ status: 'confirmed' }),
      RentalBooking.countDocuments({ status: 'pending' })
    ])
    
    console.log('Counts:', { 
      userCount, 
      listingCount, 
      activeListingCount,
      dealershipCount,
      verifiedDealershipCount,
      rentalCount,
      activeRentalCount,
      pendingRentalCount,
      classifiedCount,
      approvedClassifiedCount,
      pendingClassifiedCount,
      reviewCount,
      approvedReviewCount,
      pendingReviewCount,
      messageCount,
      unreadMessageCount,
      bookingCount,
      confirmedBookingCount,
      pendingBookingCount
    })
    
    const stats = {
      totalUsers: userCount,
      totalListings: listingCount,
      activeListings: activeListingCount,
      totalDealerships: dealershipCount,
      verifiedDealerships: verifiedDealershipCount,
      totalRentals: rentalCount,
      activeRentals: activeRentalCount,
      pendingRentals: pendingRentalCount,
      totalClassifieds: classifiedCount,
      approvedClassifieds: approvedClassifiedCount,
      pendingClassifieds: pendingClassifiedCount,
      totalReviews: reviewCount,
      approvedReviews: approvedReviewCount,
      pendingReviews: pendingReviewCount,
      totalMessages: messageCount,
      unreadMessages: unreadMessageCount,
      totalBookings: bookingCount,
      confirmedBookings: confirmedBookingCount,
      pendingBookings: pendingBookingCount,
      recentActivity: await getRecentActivity()
    }

    console.log('Final stats:', stats)
    res.json({ ok: true, stats })
  } catch (error) {
    console.error('Error getting admin stats:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Get all users
exports.getUsers = async (req, res) => {
  try {
    console.log('Admin getUsers called, user:', req.user)
    
    // Ensure admin user exists
    await ensureAdminUser();
    
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments()

    console.log('Found users:', users.length, 'total:', total)

    res.json({ 
      ok: true, 
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    console.error('Error getting users:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Get single user
exports.getUser = async (req, res) => {
  try {
    console.log('Admin getUser called for userId:', req.params.userId)
    
    // Ensure admin user exists
    await ensureAdminUser();
    
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('listings', 'title status createdAt')
      .populate('reviews', 'rating comment createdAt')

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' })
    }

    console.log('Found user:', user.email)

    res.json({ ok: true, user })
  } catch (error) {
    console.error('Error getting user:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Get all listings
exports.getListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    // Build query
    let query = {}
    
    // Exclude inactive listings unless specifically requested
    if (req.query.excludeInactive === 'true' && req.query.status !== 'inactive') {
      query.status = { $ne: 'inactive' }
    }
    
    // Add status filter if provided
    if (req.query.status) {
      query.status = req.query.status
    }
    
    // Add type filter if provided
    if (req.query.type) {
      query.type = req.query.type
    }
    
    // Add search filter if provided
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' }
      query.$or = [
        { title: searchRegex },
        { make: searchRegex },
        { model: searchRegex },
        { description: searchRegex }
      ]
    }

    const listings = await Listing.find(query)
      .populate('seller', 'name email')
      .populate('dealership', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Listing.countDocuments(query)

    res.json({ 
      ok: true, 
      listings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const reviews = await Review.find()
      .populate('reviewer', 'name email')
      .populate('targetId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Review.countDocuments()

    res.json({ 
      ok: true, 
      reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Get all messages
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const messages = await Message.find()
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('listing', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Message.countDocuments()

    res.json({ 
      ok: true, 
      messages,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Get all bookings
exports.getBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const bookings = await RentalBooking.find()
      .populate('renter', 'name email')
      .populate('owner', 'name email')
      .populate('listing', 'title price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await RentalBooking.countDocuments()

    res.json({ 
      ok: true, 
      bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Get all verifications
exports.getVerifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const verifications = await Verification.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Verification.countDocuments()

    res.json({ 
      ok: true, 
      verifications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// User actions
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isVerified: true, verificationBadge: 'verified' },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' })
    }

    res.json({ ok: true, message: 'User verified successfully', user })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'suspended' },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' })
    }

    res.json({ ok: true, message: 'User suspended successfully', user })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Listing actions
exports.featureListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.listingId,
      { featured: true },
      { new: true }
    )

    if (!listing) {
      return res.status(404).json({ ok: false, error: 'Listing not found' })
    }

    res.json({ ok: true, message: 'Listing featured successfully', listing })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.removeListing = async (req, res) => {
  try {
    console.log('Removing listing:', req.params.listingId)
    
    const listing = await Listing.findByIdAndUpdate(
      req.params.listingId,
      { status: 'inactive' },
      { new: true }
    )

    console.log('Listing updated:', listing)

    if (!listing) {
      console.log('Listing not found')
      return res.status(404).json({ ok: false, error: 'Listing not found' })
    }

    console.log('Sending success response')
    res.json({ ok: true, message: 'Listing removed successfully', listing })
  } catch (error) {
    console.error('Error removing listing:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.restoreListing = async (req, res) => {
  try {
    console.log('Restoring listing:', req.params.listingId)
    
    const listing = await Listing.findByIdAndUpdate(
      req.params.listingId,
      { status: 'active' },
      { new: true }
    )

    console.log('Listing restored:', listing)

    if (!listing) {
      console.log('Listing not found')
      return res.status(404).json({ ok: false, error: 'Listing not found' })
    }

    console.log('Sending restore success response')
    res.json({ ok: true, message: 'Listing restored successfully', listing })
  } catch (error) {
    console.error('Error restoring listing:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Dealerships management
exports.getDealerships = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    // Build query
    let query = {}
    
    // Add search filter if provided
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' }
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ]
    }

    const dealerships = await Dealership.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Dealership.countDocuments(query)

    res.json({ 
      ok: true, 
      dealerships,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.verifyDealership = async (req, res) => {
  try {
    const dealership = await Dealership.findByIdAndUpdate(
      req.params.dealershipId,
      { verified: true, verifiedAt: new Date() },
      { new: true }
    )
    res.json({ ok: true, message: 'Dealership verified successfully', dealership })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.suspendDealership = async (req, res) => {
  try {
    const dealership = await Dealership.findByIdAndUpdate(
      req.params.dealershipId,
      { suspended: true, suspendedAt: new Date() },
      { new: true }
    )
    res.json({ ok: true, message: 'Dealership suspended successfully', dealership })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Rentals management
exports.getRentals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    // Build query
    let query = {}
    
    // Add search filter if provided
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' }
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { make: searchRegex },
        { model: searchRegex }
      ]
    }

    const rentals = await Rental.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Rental.countDocuments(query)

    res.json({ 
      ok: true, 
      rentals,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.approveRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndUpdate(
      req.params.rentalId,
      { status: 'active' },
      { new: true }
    )
    res.json({ ok: true, message: 'Rental approved successfully', rental })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.removeRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndUpdate(
      req.params.rentalId,
      { status: 'inactive' },
      { new: true }
    )
    res.json({ ok: true, message: 'Rental removed successfully', rental })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Classifieds management
exports.getClassifieds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    // Build query
    let query = {}
    
    // Add search filter if provided
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' }
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    }

    const classifieds = await Classified.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Classified.countDocuments(query)

    res.json({ 
      ok: true, 
      classifieds,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.approveClassified = async (req, res) => {
  try {
    const classified = await Classified.findByIdAndUpdate(
      req.params.classifiedId,
      { status: 'approved' },
      { new: true }
    )
    res.json({ ok: true, message: 'Classified approved successfully', classified })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.removeClassified = async (req, res) => {
  try {
    const classified = await Classified.findByIdAndUpdate(
      req.params.classifiedId,
      { status: 'inactive' },
      { new: true }
    )
    res.json({ ok: true, message: 'Classified removed successfully', classified })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Messages management
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    // Build query
    let query = {}
    
    // Add search filter if provided
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' }
      query.$or = [
        { subject: searchRegex },
        { content: searchRegex },
        { 'sender.name': searchRegex }
      ]
    }

    const messages = await Message.find(query)
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Message.countDocuments(query)

    res.json({ 
      ok: true, 
      messages,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Bookings management
exports.getBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    // Build query
    let query = {}
    
    // Add search filter if provided
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' }
      query.$or = [
        { 'listing.title': searchRegex },
        { 'user.name': searchRegex },
        { 'listing.make': searchRegex },
        { 'listing.model': searchRegex }
      ]
    }

    const bookings = await RentalBooking.find(query)
      .populate('user', 'name email')
      .populate('listing', 'title make model')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await RentalBooking.countDocuments(query)

    res.json({ 
      ok: true, 
      bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Review moderation actions
exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    )
    res.json({ ok: true, message: 'Review approved successfully', review })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.flagReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { status: 'flagged', flaggedAt: new Date() },
      { new: true }
    )
    res.json({ ok: true, message: 'Review flagged successfully', review })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.unflagReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { status: 'approved', unflaggedAt: new Date() },
      { new: true }
    )
    res.json({ ok: true, message: 'Review unflagged successfully', review })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.removeReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { status: 'removed', removedAt: new Date() },
      { new: true }
    )
    res.json({ ok: true, message: 'Review removed successfully', review })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Message management actions
exports.archiveMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { status: 'archived', archivedAt: new Date() },
      { new: true }
    )
    res.json({ ok: true, message: 'Message archived successfully', message })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.messageId)
    res.json({ ok: true, message: 'Message deleted successfully', message })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Booking management actions
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await RentalBooking.findByIdAndUpdate(
      req.params.bookingId,
      { status: 'confirmed', confirmedAt: new Date() },
      { new: true }
    )
    res.json({ ok: true, message: 'Booking confirmed successfully', booking })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await RentalBooking.findByIdAndUpdate(
      req.params.bookingId,
      { status: 'cancelled', cancelledAt: new Date() },
      { new: true }
    )
    res.json({ ok: true, message: 'Booking cancelled successfully', booking })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Verification actions
exports.approveVerification = async (req, res) => {
  try {
    const verification = await Verification.findByIdAndUpdate(
      req.params.verificationId,
      { 
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: req.user._id
      },
      { new: true }
    )

    if (!verification) {
      return res.status(404).json({ ok: false, error: 'Verification not found' })
    }

    // Update user verification status
    await User.findByIdAndUpdate(
      verification.user,
      { isVerified: true, verificationBadge: verification.type }
    )

    res.json({ ok: true, message: 'Verification approved successfully', verification })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

exports.rejectVerification = async (req, res) => {
  try {
    const verification = await Verification.findByIdAndUpdate(
      req.params.verificationId,
      { 
        status: 'rejected',
        rejectedAt: new Date(),
        rejectedBy: req.user._id,
        rejectionReason: req.body.reason || 'Admin rejection'
      },
      { new: true }
    )

    if (!verification) {
      return res.status(404).json({ ok: false, error: 'Verification not found' })
    }

    res.json({ ok: true, message: 'Verification rejected successfully', verification })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Helper function to get recent activity
async function getRecentActivity() {
  const activities = []

  // Recent listings
  const recentListings = await Listing.find()
    .populate('seller', 'name')
    .sort({ createdAt: -1 })
    .limit(3)

  recentListings.forEach(listing => {
    activities.push({
      title: `New listing: ${listing.title} by ${listing.seller?.name}`,
      time: formatTime(listing.createdAt),
      status: 'new'
    })
  })

  // Recent reviews
  const recentReviews = await Review.find()
    .populate('reviewer', 'name')
    .sort({ createdAt: -1 })
    .limit(3)

  recentReviews.forEach(review => {
    activities.push({
      title: `New review by ${review.reviewer?.name}`,
      time: formatTime(review.createdAt),
      status: 'review'
    })
  })

  // Recent bookings
  const recentBookings = await RentalBooking.find()
    .populate('renter', 'name')
    .sort({ createdAt: -1 })
    .limit(2)

  recentBookings.forEach(booking => {
    activities.push({
      title: `New booking by ${booking.renter?.name}`,
      time: formatTime(booking.createdAt),
      status: 'booking'
    })
  })

  return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10)
}

function formatTime(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} minutes ago`
  if (hours < 24) return `${hours} hours ago`
  return `${days} days ago`
}
