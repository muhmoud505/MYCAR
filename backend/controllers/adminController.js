const User = require('../models/User')
const Listing = require('../models/Listing')
const Review = require('../models/Review')
const Message = require('../models/Message')
const RentalBooking = require('../models/RentalBooking')
const Verification = require('../models/Verification')

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalListings: await Listing.countDocuments(),
      totalReviews: await Review.countDocuments(),
      totalBookings: await RentalBooking.countDocuments(),
      recentActivity: await getRecentActivity()
    }

    res.json({ ok: true, stats })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments()

    res.json({ 
      ok: true, 
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
}

// Get all listings
exports.getListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const listings = await Listing.find()
      .populate('seller', 'name email')
      .populate('dealership', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Listing.countDocuments()

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
    const listing = await Listing.findByIdAndUpdate(
      req.params.listingId,
      { status: 'inactive' },
      { new: true }
    )

    if (!listing) {
      return res.status(404).json({ ok: false, error: 'Listing not found' })
    }

    res.json({ ok: true, message: 'Listing removed successfully', listing })
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
