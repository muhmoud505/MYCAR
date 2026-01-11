const router = require('express').Router()
const ctrl = require('../controllers/messageController')
const { authMiddleware } = require('../middleware/auth')

// All message routes require authentication
router.use(authMiddleware)

router.post('/send', ctrl.sendMessage)
router.get('/conversations', ctrl.getConversations)
router.get('/user/:otherUserId', ctrl.getMessages)
router.put('/:messageId/read', ctrl.markAsRead)
router.get('/unread/count', ctrl.getUnreadCount)
router.delete('/:messageId', ctrl.deleteMessage)

module.exports = router
