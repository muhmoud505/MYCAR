const mongoose = require('mongoose')

const { Schema } = mongoose

const VerificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['identity', 'phone', 'email', 'address', 'dealer', 'vehicle'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_review', 'approved', 'rejected'],
    default: 'pending'
  },
  documents: [{
    type: String,
    url: String,
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  verificationData: {
    // For identity verification
    fullName: String,
    dateOfBirth: Date,
    idNumber: String,
    idType: String,
    idExpiry: Date,
    
    // For phone verification
    phoneNumber: String,
    countryCode: String,
    verificationCode: String,
    codeExpiry: Date,
    
    // For address verification
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    proofDocument: String,
    
    // For dealer verification
    businessName: String,
    businessLicense: String,
    businessAddress: String,
    businessPhone: String,
    businessEmail: String,
    website: String,
    
    // For vehicle verification
    vin: String,
    registrationNumber: String,
    ownershipDocuments: [String],
    inspectionReport: String
  },
  reviewNotes: String,
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  rejectionReason: String,
  badge: {
    type: String,
    enum: ['verified', 'trusted_dealer', 'premium_seller', 'identity_verified', 'phone_verified'],
    default: 'verified'
  },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Index for efficient queries
VerificationSchema.index({ user: 1, type: 1 })
VerificationSchema.index({ status: 1, type: 1 })
VerificationSchema.index({ badge: 1 })

module.exports = mongoose.models.Verification || mongoose.model('Verification', VerificationSchema)
