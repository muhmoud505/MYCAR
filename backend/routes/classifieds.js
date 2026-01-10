const router = require('express').Router()
const ctrl = require('../controllers/classifiedsController')

router.get('/', ctrl.listClassifieds)
router.post('/', ctrl.createClassified)
router.get('/:id', ctrl.getClassified)

module.exports = router
