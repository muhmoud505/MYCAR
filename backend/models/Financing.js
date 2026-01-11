const mongoose = require('mongoose')

const { Schema } = mongoose

const FinancingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  loanAmount: { type: Number, required: true },
  downPayment: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  loanTerm: { type: Number, required: true }, // in months
  monthlyPayment: { type: Number, required: true },
  totalInterest: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  
  // Credit information
  creditScore: Number,
  creditHistory: {
    bankruptcies: Number,
    latePayments: Number,
    creditUtilization: Number
  },
  
  // Loan details
  loanType: {
    type: String,
    enum: ['new_car', 'used_car', 'refinance', 'lease'],
    default: 'used_car'
  },
  lender: String,
  apr: Number,
  fees: [{
    type: String,
    amount: Number,
    description: String
  }],
  
  // Approval status
  status: {
    type: String,
    enum: ['pre_approved', 'approved', 'rejected', 'pending'],
    default: 'pending'
  },
  approvedAmount: Number,
  approvedRate: Number,
  approvedTerm: Number,
  
  // User information
  employmentInfo: {
    employer: String,
    position: String,
    income: Number,
    employmentLength: Number,
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'self_employed', 'contract', 'unemployed'],
      default: 'full_time'
    }
  },
  
  // Co-applicant
  coApplicant: {
    name: String,
    email: String,
    phone: String,
    creditScore: Number,
    income: Number,
    relationship: String
  },
  
  // Trade-in information
  tradeIn: {
    vehicle: String,
    vin: String,
    mileage: Number,
    condition: String,
    estimatedValue: Number,
    payoffAmount: Number
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Index for efficient queries
FinancingSchema.index({ user: 1, status: 1 })
FinancingSchema.index({ listing: 1 })
FinancingSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.models.Financing || mongoose.model('Financing', FinancingSchema)
