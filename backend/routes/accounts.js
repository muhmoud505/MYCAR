const router = require('express').Router()
const ctrl = require('../controllers/accountController')

router.get('/me', ctrl.getProfile)
router.put('/me', ctrl.updateProfile)
router.delete('/me', ctrl.deleteAccount)

module.exports = router
