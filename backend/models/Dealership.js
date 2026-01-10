const mongoose = require('mongoose')
const { Schema } = mongoose

const DealershipSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Dealership || mongoose.model('Dealership', DealershipSchema)
