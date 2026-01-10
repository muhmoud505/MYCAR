const router = require('express').Router()
const ctrl = require('../controllers/reviewsController')

router.get('/', ctrl.listReviews)
router.post('/', ctrl.createReview)
router.get('/:id', ctrl.getReview)

module.exports = router
