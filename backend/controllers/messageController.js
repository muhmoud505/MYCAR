const Message = require('../models/Message')
const Listing = require('../models/Listing')
const User = require('../models/User')

// Send a message
async function sendMessage(req, res) {
  try {
    const { receiver, listing, subject, content, type = 'general', metadata } = req.body
    const sender = req.user.id

    if (!receiver || !subject || !content) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verify receiver exists
    const receiverUser = await User.findById(receiver)
    if (!receiverUser) {
      return res.status(404).json({ error: 'Receiver not found' })
    }

    // If listing is provided, verify it exists
    if (listing) {
      const listingDoc = await Listing.findById(listing)
      if (!listingDoc) {
        return res.status(404).json({ error: 'Listing not found' })
      }
    }

    const message = await Message.create({
      sender,
      receiver,
      listing,
      subject,
      content,
      type,
      metadata
    })

    // Populate sender and receiver info
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar')
      .populate('listing', 'title make model year')

    res.status(201).json(populatedMessage)
  } catch (err) {
    console.error('Send message error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get user's conversations
async function getConversations(req, res) {
  try {
    const userId = req.user.id
    const { page = 1, limit = 20 } = req.query

    // Get all messages where user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender', 'name email avatar')
    .populate('receiver', 'name email avatar')
    .populate('listing', 'title make model year images')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

    // Group messages by conversation (unique pairs of users)
    const conversations = {}
    messages.forEach(message => {
      const otherUser = message.sender._id.toString() === userId ? 
        message.receiver._id.toString() : message.sender._id.toString()
      
      if (!conversations[otherUser]) {
        conversations[otherUser] = {
          user: message.sender._id.toString() === userId ? message.receiver : message.sender,
          messages: [],
          lastMessage: message,
          unreadCount: 0
        }
      }
      
      conversations[otherUser].messages.push(message)
      
      // Count unread messages (where user is receiver and message is not read)
      if (message.receiver._id.toString() === userId && !message.isRead) {
        conversations[otherUser].unreadCount++
      }
    })

    // Convert to array and sort by last message date
    const conversationArray = Object.values(conversations).sort((a, b) => 
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    )

    res.json({
      conversations: conversationArray,
      page: parseInt(page),
      limit: parseInt(limit)
    })
  } catch (err) {
    console.error('Get conversations error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get messages with a specific user
async function getMessages(req, res) {
  try {
    const userId = req.user.id
    const { otherUserId } = req.params
    const { page = 1, limit = 50 } = req.query

    if (!otherUserId) {
      return res.status(400).json({ error: 'Other user ID required' })
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
    .populate('sender', 'name email avatar')
    .populate('receiver', 'name email avatar')
    .populate('listing', 'title make model year images')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

    // Mark messages as read
    await Message.updateMany(
      { receiver: userId, sender: otherUserId, isRead: false },
      { isRead: true, readAt: new Date() }
    )

    res.json({
      messages: messages.reverse(), // Show oldest first
      page: parseInt(page),
      limit: parseInt(limit)
    })
  } catch (err) {
    console.error('Get messages error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Mark message as read
async function markAsRead(req, res) {
  try {
    const { messageId } = req.params
    const userId = req.user.id

    const message = await Message.findOneAndUpdate(
      { _id: messageId, receiver: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    ).populate('sender', 'name email avatar')

    if (!message) {
      return res.status(404).json({ error: 'Message not found' })
    }

    res.json(message)
  } catch (err) {
    console.error('Mark as read error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Get unread message count
async function getUnreadCount(req, res) {
  try {
    const userId = req.user.id
    const count = await Message.countDocuments({ receiver: userId, isRead: false })
    res.json({ unreadCount: count })
  } catch (err) {
    console.error('Get unread count error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// Delete message
async function deleteMessage(req, res) {
  try {
    const { messageId } = req.params
    const userId = req.user.id

    const message = await Message.findOne({
      _id: messageId,
      $or: [{ sender: userId }, { receiver: userId }]
    })

    if (!message) {
      return res.status(404).json({ error: 'Message not found' })
    }

    await Message.findByIdAndDelete(messageId)
    res.json({ success: true })
  } catch (err) {
    console.error('Delete message error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  sendMessage,
  getConversations,
  getMessages,
  markAsRead,
  getUnreadCount,
  deleteMessage
}
