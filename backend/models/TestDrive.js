const mongoose = require('mongoose')

const { Schema } = mongoose

const TestDriveSchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dealership: { type: Schema.Types.ObjectId, ref: 'Dealership' },
  
  // Scheduling
  requestedDate: { type: Date, required: true },
  requestedTime: { type: String, required: true }, // e.g., "10:00 AM"
  duration: { type: Number, default: 30 }, // in minutes
  alternativeDates: [Date],
  
  // Contact information
  contactInfo: {
    phone: String,
    email: String,
    preferredContact: {
      type: String,
      enum: ['phone', 'email', 'text'],
      default: 'phone'
    }
  },
  
  // License information
  licenseInfo: {
    licenseNumber: String,
    licenseState: String,
    licenseExpiry: Date,
    age: Number,
    hasValidLicense: { type: Boolean, default: false }
  },
  
  // Insurance information
  insurance: {
    provider: String,
    policyNumber: String,
    coverageType: String,
    coverageAmount: Number,
    hasValidInsurance: { type: Boolean, default: false }
  },
  
  // Test drive details
  route: {
    type: {
      type: String,
      enum: ['city', 'highway', 'mixed', 'custom'],
      default: 'mixed'
    },
    distance: Number, // in miles
    estimatedTime: Number, // in minutes
    waypoints: [String],
    notes: String
  },
  
  // Vehicle preferences
  preferences: {
    automaticTransmission: { type: Boolean, default: true },
    gpsNavigation: { type: Boolean, default: false },
    musicSystem: { type: Boolean, default: false },
    specificFeatures: [String]
  },
  
  // Status and management
  status: {
    type: String,
    enum: ['requested', 'confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show'],
    default: 'requested'
  },
  
  confirmationDetails: {
    confirmedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    confirmedAt: Date,
    confirmationNumber: String,
    instructions: String,
    meetingLocation: String,
    specialInstructions: String
  },
  
  rescheduleDetails: {
    rescheduledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rescheduledAt: Date,
    originalDate: Date,
    newDate: Date,
    reason: String
  },
  
  completionDetails: {
    completedAt: Date,
    actualDuration: Number,
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comments: String,
      vehicleCondition: String,
      staffHelpfulness: String,
      overallExperience: String
    },
    salesPerson: { type: Schema.Types.ObjectId, ref: 'User' },
    followUpActions: [String],
    nextSteps: String
  },
  
  // Cancellation details
  cancellationDetails: {
    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    cancelledAt: Date,
    reason: {
      type: String,
      enum: ['customer_request', 'weather', 'vehicle_unavailable', 'staff_unavailable', 'other'],
      default: 'customer_request'
    },
    notes: String,
    refundPolicy: String
  },
  
  // Notifications
  notifications: [{
    type: {
      type: String,
      enum: ['confirmation', 'reminder', 'reschedule', 'cancellation', 'follow_up']
    },
    sentAt: Date,
    method: {
      type: String,
      enum: ['email', 'sms', 'phone', 'push']
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    }
  }],
  
  // Additional notes
  notes: String,
  internalNotes: String, // For dealership staff only
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Index for efficient queries
TestDriveSchema.index({ listing: 1, status: 1 })
TestDriveSchema.index({ customer: 1, status: 1 })
TestDriveSchema.index({ dealership: 1, requestedDate: 1 })
TestDriveSchema.index({ status: 1, requestedDate: 1 })

module.exports = mongoose.models.TestDrive || mongoose.model('TestDrive', TestDriveSchema)
