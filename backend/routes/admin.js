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

// Reviews management
router.get('/reviews', adminController.getReviews)

// Messages management
router.get('/messages', adminController.getMessages)

// Bookings management
router.get('/bookings', adminController.getBookings)

// Verifications management
router.get('/verifications', adminController.getVerifications)
router.post('/verifications/:verificationId/approve', adminController.approveVerification)
router.post('/verifications/:verificationId/reject', adminController.rejectVerification)

module.exports = router
