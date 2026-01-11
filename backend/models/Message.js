const mongoose = require('mongoose')

const { Schema } = mongoose

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: Schema.Types.ObjectId, ref: 'Listing' },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['inquiry', 'offer', 'negotiation', 'appointment', 'general'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'replied'],
    default: 'sent'
  },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  parentMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  attachments: [{
    type: String,
    url: String,
    filename: String
  }],
  metadata: {
    offerPrice: Number,
    proposedDate: Date,
    location: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Index for efficient queries
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 })
MessageSchema.index({ receiver: 1, isRead: 1 })
MessageSchema.index({ listing: 1, createdAt: -1 })

module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema)
