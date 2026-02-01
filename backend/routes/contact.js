const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contactController')

// Public contact form submission
router.post('/submit', contactController.submitContact)

// Admin contact management (add auth middleware in production)
router.get('/', contactController.getContacts)
router.put('/:id/status', contactController.updateContactStatus)
router.delete('/:id', contactController.deleteContact)

module.exports = router
