const mongoose = require('mongoose')

const { Schema } = mongoose

const TradeInSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    vin: { type: String, required: true },
    mileage: { type: Number, required: true },
    color: String,
    bodyType: String,
    trim: String,
    engine: String,
    transmission: String,
    drivetrain: String,
    fuelType: String
  },
  
  condition: {
    overall: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true
    },
    exterior: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true
    },
    interior: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true
    },
    mechanical: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true
    },
    tires: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true
    }
  },
  
  features: [String],
  modifications: [String],
  accidents: {
    count: { type: Number, default: 0 },
    details: String,
    repairQuality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor']
    }
  },
  
  maintenance: {
    serviceRecords: { type: Boolean, default: false },
    lastService: Date,
    nextService: Date,
    regularMaintenance: { type: Boolean, default: false }
  },
  
  ownership: {
    originalOwner: { type: Boolean, default: false },
    ownershipLength: Number, // in months
    titleStatus: {
      type: String,
      enum: ['clean', 'salvage', 'rebuilt', 'lien'],
      default: 'clean'
    },
    lienHolder: String,
    payoffAmount: Number
  },
  
  valuation: {
    estimatedValue: Number,
    tradeInValue: Number,
    privatePartyValue: Number,
    dealerRetailValue: Number,
    valuationDate: { type: Date, default: Date.now },
    source: String, // e.g., 'kbb', 'edmunds', 'nadaguides'
    confidence: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    }
  },
  
  photos: [{
    url: String,
    type: {
      type: String,
      enum: ['exterior', 'interior', 'dashboard', 'engine', 'trunk', 'tires', 'damage', 'documents']
    },
    description: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  documents: [{
    type: {
      type: String,
      enum: ['title', 'registration', 'service_records', 'inspection_report', 'other']
    },
    url: String,
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  status: {
    type: String,
    enum: ['pending', 'under_review', 'appraised', 'offer_made', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  
  appraisal: {
    appraiser: { type: Schema.Types.ObjectId, ref: 'User' },
    appraisalDate: Date,
    notes: String,
    adjustments: [{
      category: String,
      amount: Number,
      reason: String
    }],
    finalOffer: Number,
    offerValidUntil: Date
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Index for efficient queries
TradeInSchema.index({ user: 1, status: 1 })
TradeInSchema.index({ status: 1, createdAt: -1 })
TradeInSchema.index({ 'vehicle.vin': 1 })

module.exports = mongoose.models.TradeIn || mongoose.model('TradeIn', TradeInSchema)
