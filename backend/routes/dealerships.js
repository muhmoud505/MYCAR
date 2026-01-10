const router = require('express').Router()
const ctrl = require('../controllers/dealershipsController')

router.get('/', ctrl.listDealerships)
router.post('/', ctrl.createDealership)
router.get('/:id', ctrl.getDealership)

module.exports = router
