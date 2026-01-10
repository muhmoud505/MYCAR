const mongoose = require('mongoose')
const { Schema } = mongoose

const ClassifiedSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  price: Number,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Classified || mongoose.model('Classified', ClassifiedSchema)
