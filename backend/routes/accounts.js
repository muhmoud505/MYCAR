const router = require('express').Router()
const ctrl = require('../controllers/accountController')
const { authMiddleware } = require('../middleware/auth')
const multer = require('multer')

// Configure multer for avatar uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/avatars/')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

router.get('/me', authMiddleware, ctrl.getProfile)
router.put('/me', authMiddleware, ctrl.updateProfile)
router.put('/preferences/:section', authMiddleware, ctrl.updatePreferences)
router.put('/preferences', authMiddleware, ctrl.updatePreferences)
router.put('/social-links', authMiddleware, ctrl.updateSocialLinks)
router.post('/avatar', authMiddleware, upload.single('avatar'), ctrl.uploadAvatar)
router.delete('/me', authMiddleware, ctrl.deleteAccount)

module.exports = router
