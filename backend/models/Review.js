const mongoose = require('mongoose')
const { Schema } = mongoose

const ReviewSchema = new Schema({
  listingId: { type: Schema.Types.ObjectId, ref: 'Listing' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema)
