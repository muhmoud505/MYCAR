const mongoose = require('mongoose')

const { Schema } = mongoose

const SettingsSchema = new Schema({
  // Site Configuration
  siteName: { 
    type: String, 
    default: 'MYCAR',
    required: true 
  },
  siteEmail: { 
    type: String, 
    default: 'info@mycar.com',
    required: true 
  },
  siteUrl: { 
    type: String, 
    default: 'https://mycar.com' 
  },
  
  // Site Status
  maintenanceMode: { 
    type: Boolean, 
    default: false 
  },
  allowRegistrations: { 
    type: Boolean, 
    default: true 
  },
  requireEmailVerification: { 
    type: Boolean, 
    default: true 
  },
  
  // Listing Configuration
  maxListingsPerUser: { 
    type: Number, 
    default: 10,
    min: 1,
    max: 100 
  },
  maxImagesPerListing: { 
    type: Number, 
    default: 10,
    min: 1,
    max: 50 
  },
  defaultListingDuration: { 
    type: Number, 
    default: 30,
    min: 1,
    max: 365 
  },
  featuredListingPrice: { 
    type: Number, 
    default: 29.99,
    min: 0 
  },
  
  // Feature Toggles
  enableMessaging: { 
    type: Boolean, 
    default: true 
  },
  enableReviews: { 
    type: Boolean, 
    default: true 
  },
  enableRentals: { 
    type: Boolean, 
    default: true 
  },
  enableClassifieds: { 
    type: Boolean, 
    default: true 
  },
  enablePayments: { 
    type: Boolean, 
    default: false 
  },
  
  // Financial Settings
  commissionRate: { 
    type: Number, 
    default: 5.0,
    min: 0,
    max: 50 
  },
  currency: { 
    type: String, 
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'AED', 'SAR'] 
  },
  
  // Support Information
  supportEmail: { 
    type: String, 
    default: 'support@mycar.com' 
  },
  supportPhone: { 
    type: String, 
    default: '+1-800-123-4567' 
  },
  supportHours: { 
    type: String, 
    default: 'Mon-Fri 9AM-6PM EST' 
  },
  
  // Social Media
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  
  // SEO Settings
  metaTitle: { 
    type: String, 
    default: 'MYCAR - Find Your Next Car' 
  },
  metaDescription: { 
    type: String, 
    default: 'Search thousands of vehicles, connect with sellers, and drive away in your dream car' 
  },
  metaKeywords: { 
    type: [String], 
    default: ['cars', 'vehicles', 'automotive', 'buy car', 'sell car'] 
  },
  
  // Email Settings
  emailSettings: {
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPass: String,
    fromEmail: String,
    fromName: String
  },
  
  // Security Settings
  securitySettings: {
    enableTwoFactor: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 24 }, // hours
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutDuration: { type: Number, default: 15 } // minutes
  },
  
  // Analytics
  googleAnalyticsId: String,
  facebookPixelId: String,
  
  // Legal
  privacyPolicy: String,
  termsOfService: String,
  
  // Timestamps
  lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Create default settings if none exist
SettingsSchema.statics.getDefaultSettings = async function() {
  let settings = await this.findOne()
  if (!settings) {
    settings = await this.create({})
  }
  return settings
}

module.exports = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)
