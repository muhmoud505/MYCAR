const router = require('express').Router()
const ctrl = require('../controllers/rentalsController')

router.get('/', ctrl.listRentals)
router.post('/', ctrl.createRental)
router.get('/:id', ctrl.getRental)

module.exports = router
