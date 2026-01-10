const router = require('express').Router()
const ctrl = require('../controllers/paymentsController')

router.post('/intent', ctrl.createPaymentIntent)
router.post('/webhook', expressRawMiddleware = (req, res, next) => next(), ctrl.webhook)

module.exports = router
