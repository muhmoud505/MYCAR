const mongoose = require('mongoose')

const { Schema } = mongoose

const ListingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  make: String,
  model: String,
  year: Number,
  mileage: Number,
  bodyType: String,
  fuelType: String,
  transmission: String,
  color: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
  seller: { type: Schema.Types.ObjectId, ref: 'User' },
  images: [String]
})

module.exports = mongoose.models.Listing || mongoose.model('Listing', ListingSchema)
