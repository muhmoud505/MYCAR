const router = require('express').Router()
const ctrl = require('../controllers/rentalController')
const { authMiddleware } = require('../middleware/auth')

// All rental routes require authentication
router.use(authMiddleware)

// Availability and pricing
router.get('/availability/:listingId', ctrl.getAvailability)
router.post('/calculate-pricing', ctrl.calculatePricing)

// Booking management
router.post('/book', ctrl.createBooking)
router.get('/my-bookings', ctrl.getUserBookings)
router.put('/:bookingId/status', ctrl.updateBookingStatus)

module.exports = router
