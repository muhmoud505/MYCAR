const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { authMiddleware, roleCheck } = require('../middleware/auth')

// Add debugging middleware
router.use((req, res, next) => {
  console.log('Admin route accessed:', req.method, req.path)
  next()
})

// Apply auth middleware to all admin routes
router.use(authMiddleware)
router.use((req, res, next) => {
  const adminMiddleware = roleCheck('admin')
  adminMiddleware(req, res, next)
})

// Dashboard stats
router.get('/stats', adminController.getStats)

// Users management
router.get('/users', adminController.getUsers)
router.get('/users/:userId', adminController.getUser)
router.post('/users/:userId/verify', adminController.verifyUser)
router.post('/users/:userId/suspend', adminController.suspendUser)

// Listings management
router.get('/listings', adminController.getListings)
router.post('/listings/:listingId/feature', adminController.featureListing)
router.post('/listings/:listingId/remove', adminController.removeListing)
router.post('/listings/:listingId/restore', adminController.restoreListing)

// Reviews management
router.get('/reviews', adminController.getReviews)
router.post('/reviews/:reviewId/approve', adminController.approveReview)
router.post('/reviews/:reviewId/flag', adminController.flagReview)
router.post('/reviews/:reviewId/unflag', adminController.unflagReview)
router.post('/reviews/:reviewId/remove', adminController.removeReview)

// Messages management
router.get('/messages', adminController.getMessages)
router.post('/messages/:messageId/archive', adminController.archiveMessage)
router.post('/messages/:messageId/delete', adminController.deleteMessage)

// Bookings management
router.get('/bookings', adminController.getBookings)
router.post('/bookings/:bookingId/confirm', adminController.confirmBooking)
router.post('/bookings/:bookingId/cancel', adminController.cancelBooking)

// Dealerships management
router.get('/dealerships', adminController.getDealerships)
router.post('/dealerships/:dealershipId/verify', adminController.verifyDealership)
router.post('/dealerships/:dealershipId/suspend', adminController.suspendDealership)

// Rentals management
router.get('/rentals', adminController.getRentals)
router.post('/rentals/:rentalId/approve', adminController.approveRental)
router.post('/rentals/:rentalId/remove', adminController.removeRental)

// Classifieds management
router.get('/classifieds', adminController.getClassifieds)
router.post('/classifieds/:classifiedId/approve', adminController.approveClassified)
router.post('/classifieds/:classifiedId/remove', adminController.removeClassified)

// Verifications management
router.get('/verifications', adminController.getVerifications)
router.post('/verifications/:verificationId/approve', adminController.approveVerification)
router.post('/verifications/:verificationId/reject', adminController.rejectVerification)

// Settings management
router.get('/settings', adminController.getSettings)
router.put('/settings', adminController.updateSettings)

module.exports = router
