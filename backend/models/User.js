const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['buyer', 'seller', 'admin', 'dealer'], 
    default: 'buyer' 
  },
  phone: String,
  avatar: String,
  isVerified: { type: Boolean, default: false },
  verificationBadge: String,
  dealership: { type: Schema.Types.ObjectId, ref: 'Dealership' },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
