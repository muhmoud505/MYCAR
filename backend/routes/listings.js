const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const listingController = require('../controllers/listingController')
const { authMiddleware } = require('../middleware/auth')

// simple disk storage, files saved to backend/uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '..', 'uploads'))
	},
	filename: function (req, file, cb) {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
		const ext = path.extname(file.originalname)
		cb(null, `${unique}${ext}`)
	}
})
const upload = multer({ storage })

router.get('/', listingController.list)
router.get('/:id', listingController.getById)
router.post('/', authMiddleware, listingController.create)
router.post('/:id/images', authMiddleware, upload.array('images', 20), listingController.uploadImages)

module.exports = router
