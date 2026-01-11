const mongoose = require('mongoose')

const { Schema } = mongoose

const RentalBookingSchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  renter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Booking dates
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  
  // Pricing
  pricing: {
    dailyRate: { type: Number, required: true },
    weeklyRate: Number,
    monthlyRate: Number,
    totalDays: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    insuranceFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    deposit: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  
  // Insurance
  insurance: {
    provider: String,
    policyNumber: String,
    coverageType: {
      type: String,
      enum: ['basic', 'standard', 'premium', 'comprehensive'],
      default: 'basic'
    },
    coverageAmount: Number,
    deductible: Number,
    included: { type: Boolean, default: false },
    price: { type: Number, default: 0 }
  },
  
  // Driver verification
  driverVerification: {
    licenseNumber: String,
    licenseState: String,
    licenseExpiry: Date,
    age: Number,
    hasValidLicense: { type: Boolean, default: false },
    verifiedAt: Date,
    verificationMethod: {
      type: String,
      enum: ['manual', 'automatic', 'third_party'],
      default: 'manual'
    }
  },
  
  // Pickup/Drop-off locations
  pickup: {
    location: {
      type: String,
      enum: ['dealership', 'airport', 'home', 'custom'],
      default: 'dealership'
    },
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    instructions: String,
    fee: { type: Number, default: 0 }
  },
  
  dropoff: {
    location: {
      type: String,
      enum: ['dealership', 'airport', 'home', 'custom'],
      default: 'dealership'
    },
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    instructions: String,
    fee: { type: Number, default: 0 }
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'payment_pending', 'paid', 'active', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  
  // Payment information
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash'],
      default: 'credit_card'
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundAmount: Number,
    refundedAt: Date,
    depositRefunded: { type: Boolean, default: false },
    depositRefundedAt: Date
  },
  
  // Rental agreement
  agreement: {
    generated: { type: Boolean, default: false },
    generatedAt: Date,
    documentUrl: String,
    signedAt: Date,
    signatureUrl: String,
    terms: [String],
    conditions: [String],
    mileageLimit: Number,
    additionalDriverFee: Number,
    lateFeePerHour: Number,
    cancellationPolicy: String
  },
  
  // Vehicle condition
  conditionCheck: {
    pickup: {
      mileage: Number,
      fuelLevel: String,
      damagePhotos: [String],
      damageNotes: String,
      signedBy: String,
      inspectedBy: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    return: {
      mileage: Number,
      fuelLevel: String,
      damagePhotos: [String],
      damageNotes: String,
      signedBy: String,
      inspectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      additionalCharges: Number,
      additionalChargesReason: String
    }
  },
  
  // Reviews and feedback
  reviews: {
    renterReview: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      submittedAt: Date
    },
    ownerReview: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      submittedAt: Date
    }
  },
  
  // Communication
  messages: [{
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['booking', 'payment', 'pickup', 'return', 'issue', 'general'],
      default: 'general'
    }
  }],
  
  // Cancellation
  cancellation: {
    reason: String,
    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    cancelledAt: Date,
    refundPolicy: String,
    refundAmount: Number,
    refundProcessed: { type: Boolean, default: false }
  },
  
  // Metadata
  notes: String,
  internalNotes: String, // For internal use
  specialRequests: [String],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Index for efficient queries
RentalBookingSchema.index({ listing: 1, status: 1 })
RentalBookingSchema.index({ renter: 1, status: 1 })
RentalBookingSchema.index({ owner: 1, status: 1 })
RentalBookingSchema.index({ startDate: 1, endDate: 1 })
RentalBookingSchema.index({ status: 1, startDate: 1 })

module.exports = mongoose.models.RentalBooking || mongoose.model('RentalBooking', RentalBookingSchema)
