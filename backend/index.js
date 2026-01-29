require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

const MONGO_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/mycar'

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Routes
const authRoutes = require('./routes/auth')
const listingRoutes = require('./routes/listings')
const searchRoutes = require('./routes/search')
const accountRoutes = require('./routes/accounts')
const classifiedsRoutes = require('./routes/classifieds')
const rentalsRoutes = require('./routes/rentals')
const dealershipsRoutes = require('./routes/dealerships')
const reviewsRoutes = require('./routes/reviews')
const paymentsRoutes = require('./routes/payments')
const messagesRoutes = require('./routes/messages')
const rentalBookingRoutes = require('./routes/rental-booking')
const adminRoutes = require('./routes/admin')

// Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/search', searchRoutes)

// Multer for file uploads
const multer = require('multer')
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
    }
  }),
  fileFilter: (req, file, cb) => {
    // Allow images only for avatar uploads
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for avatars
  }
})

app.use('/api/accounts', accountRoutes)
app.use('/api/classifieds', classifiedsRoutes)
app.use('/api/rentals', rentalsRoutes)
app.use('/api/dealerships', dealershipsRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/rental-booking', rentalBookingRoutes)
app.use('/api/admin', adminRoutes)

// serve uploaded files
const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
