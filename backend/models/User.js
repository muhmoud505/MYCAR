const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['buyer', 'seller', 'dealer', 'admin'], 
    default: 'buyer' 
  },
  phone: String,
  avatar: String,
  isVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  verificationBadge: String,
  dealership: { type: Schema.Types.ObjectId, ref: 'Dealership' },
  refreshToken: { type: String, select: false },
  lastLogin: { type: Date, default: Date.now },
  profileCompleted: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  securitySettings: {
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    loginNotifications: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: false }
  },
  preferences: {
    language: { 
      type: String, 
      enum: ['en', 'ar'], 
      default: 'en' 
    },
    currency: { 
      type: String, 
      enum: ['USD', 'EUR', 'GBP'], 
      default: 'USD' 
    },
    theme: { 
      type: String, 
      enum: ['light', 'dark', 'auto'], 
      default: 'light' 
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false },
      newListingAlerts: { type: Boolean, default: true },
      priceDropAlerts: { type: Boolean, default: true }
    },
    searchRadius: { type: Number, default: 50 },
    listingView: { 
      type: String, 
      enum: ['grid', 'list'], 
      default: 'grid' 
    }
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
