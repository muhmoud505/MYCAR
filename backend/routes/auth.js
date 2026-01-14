const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { authMiddleware, roleCheck } = require('../middleware/auth')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh', authController.refreshToken)
router.get('/me', authMiddleware, authController.me)
router.post('/change-password', authMiddleware, authController.changePassword)
router.get('/admin/users', authMiddleware, roleCheck('admin'), authController.listUsers)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

module.exports = router
