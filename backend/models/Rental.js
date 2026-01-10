const mongoose = require('mongoose')
const { Schema } = mongoose

const RentalSchema = new Schema({
  title: { type: String, required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Listing' },
  startDate: Date,
  endDate: Date,
  pricePerDay: Number,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Rental || mongoose.model('Rental', RentalSchema)
