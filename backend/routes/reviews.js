const router = require('express').Router()
const ctrl = require('../controllers/reviewController')
const { authMiddleware } = require('../middleware/auth')

// Public routes
router.get('/target/:target/:targetId', ctrl.getReviews)
router.get('/expert', ctrl.getExpertReviews)
router.get('/comparison', ctrl.getComparisonReviews)

// Protected routes
router.use(authMiddleware)

router.post('/', ctrl.createReview)
router.get('/my-reviews', ctrl.getUserReviews)
router.put('/:reviewId/interact', ctrl.updateReviewInteraction)
router.post('/:reviewId/report', ctrl.reportReview)
router.post('/:reviewId/respond', ctrl.respondToReview)

module.exports = router
