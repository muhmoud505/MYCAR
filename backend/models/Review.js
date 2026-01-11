const mongoose = require('mongoose')
const { Schema } = mongoose

const ReviewSchema = new Schema({
  // Target of review
  target: {
    type: String,
    enum: ['listing', 'user', 'dealership'],
    required: true
  },
  targetId: { type: Schema.Types.ObjectId, required: true },
  
  // Reviewer
  reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Review type
  type: {
    type: String,
    enum: ['buyer_review', 'seller_review', 'test_drive_review', 'rental_review', 'service_review', 'general'],
    default: 'general'
  },
  
  // Ratings
  ratings: {
    overall: { type: Number, min: 1, max: 5, required: true },
    communication: { type: Number, min: 1, max: 5 },
    descriptionAccuracy: { type: Number, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 },
    mechanicalCondition: { type: Number, min: 1, max: 5 },
    customerService: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 },
    locationConvenience: { type: Number, min: 1, max: 5 }
  },
  
  // Content
  title: { type: String, required: true },
  content: { type: String, required: true },
  pros: [String],
  cons: [String],
  
  // Media
  images: [{
    url: String,
    alt: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  videos: [{
    url: String,
    title: String,
    duration: Number, // in seconds
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Verification
  verifiedPurchase: { type: Boolean, default: false },
  transactionId: String,
  purchaseDate: Date,
  
  // Expert review (for expert articles)
  isExpertReview: { type: Boolean, default: false },
  expertCredentials: {
    organization: String,
    certification: String,
    experience: String,
    website: String
  },
  
  // Comparison review
  isComparison: { type: Boolean, default: false },
  comparedItems: [{
    type: { type: String, enum: ['listing', 'vehicle_model'] },
    id: Schema.Types.ObjectId,
    name: String,
    rating: { type: Number, min: 1, max: 5 }
  }],
  
  // Response
  response: {
    content: String,
    respondedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    respondedAt: Date,
    helpful: { type: Number, default: 0 }
  },
  
  // Community interaction
  helpful: { type: Number, default: 0 },
  notHelpful: { type: Number, default: 0 },
  reports: [{
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    reportedAt: { type: Date, default: Date.now }
  }],
  
  // Moderation
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'pending'
  },
  moderatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  moderatedAt: Date,
  moderationReason: String,
  
  // SEO and metadata
  tags: [String],
  category: String,
  summary: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Index for efficient queries
ReviewSchema.index({ target: 1, targetId: 1, status: 1 })
ReviewSchema.index({ reviewer: 1, status: 1 })
ReviewSchema.index({ type: 1, status: 1 })
ReviewSchema.index({ isExpertReview: 1, status: 1 })
ReviewSchema.index({ createdAt: -1 })
ReviewSchema.index({ 'ratings.overall': -1 })

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema)
