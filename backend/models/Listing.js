const mongoose = require('mongoose')

const { Schema } = mongoose

const ListingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  bodyType: { 
    type: String, 
    enum: ['sedan', 'suv', 'coupe', 'hatchback', 'truck', 'van', 'convertible', 'wagon'],
    required: true 
  },
  fuelType: { 
    type: String, 
    enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'plug-in-hybrid'],
    required: true 
  },
  transmission: { 
    type: String, 
    enum: ['manual', 'automatic', 'cvt'],
    required: true 
  },
  color: { type: String, required: true },
  location: {
    address: String,
    city: { type: String, required: true },
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  vin: String,
  historyReport: {
    hasReport: { type: Boolean, default: false },
    reportUrl: String,
    accidents: Number,
    owners: Number
  },
  features: [String],
  specifications: {
    engine: String,
    drivetrain: String,
    fuelEconomy: {
      city: Number,
      highway: Number,
      combined: Number
    },
    interior: String,
    exterior: String,
    safety: [String]
  },
  images: [{
    url: String,
    alt: String,
    isMain: { type: Boolean, default: false }
  }],
  videos: [String],
  status: {
    type: String,
    enum: ['active', 'pending', 'sold', 'rented', 'inactive'],
    default: 'active'
  },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dealership: { type: Schema.Types.ObjectId, ref: 'Dealership' },
  type: {
    type: String,
    enum: ['sale', 'rental', 'classified'],
    default: 'sale'
  },
  rentalDetails: {
    available: { type: Boolean, default: false },
    pricePerDay: Number,
    pricePerWeek: Number,
    pricePerMonth: Number,
    deposit: Number,
    insuranceIncluded: { type: Boolean, default: false },
    minimumRentalDays: { type: Number, default: 1 },
    location: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Listing || mongoose.model('Listing', ListingSchema)
