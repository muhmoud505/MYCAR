const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(cors())
app.use(express.json())

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

// Basic auth routes only
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

// Start server
const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000

mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/mycar', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
