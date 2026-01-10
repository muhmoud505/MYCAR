const Listing = require('../models/Listing')

const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

async function list(req, res) {
  try {
    const {
      title, make, model, minPrice, maxPrice, sellerId,
      minYear, maxYear, minMileage, maxMileage,
      bodyType, fuelType, transmission, color, location,
      page = 1, limit = 20
    } = req.query

    const q = {}
    if (title) q.title = { $regex: title, $options: 'i' }
    if (make) q.make = { $regex: `^${make}$`, $options: 'i' }
    if (model) q.model = { $regex: model, $options: 'i' }
    if (sellerId) q.seller = sellerId
    if (bodyType) q.bodyType = bodyType
    if (fuelType) q.fuelType = fuelType
    if (transmission) q.transmission = transmission
    if (color) q.color = { $regex: color, $options: 'i' }
    if (location) q.location = { $regex: location, $options: 'i' }
    if (minPrice || maxPrice) q.price = {}
    if (minPrice) q.price.$gte = Number(minPrice)
    if (maxPrice) q.price.$lte = Number(maxPrice)
    if (minYear || maxYear) q.year = {}
    if (minYear) q.year.$gte = Number(minYear)
    if (maxYear) q.year.$lte = Number(maxYear)
    if (minMileage || maxMileage) q.mileage = {}
    if (minMileage) q.mileage.$gte = Number(minMileage)
    if (maxMileage) q.mileage.$lte = Number(maxMileage)

    const skip = (Number(page) - 1) * Number(limit)
    const items = await Listing.find(q).populate('seller', 'email name').skip(skip).limit(Number(limit))
    const total = await Listing.countDocuments(q)
    res.json({ items, total })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

async function getById(req, res) {
  try {
    const item = await Listing.findById(req.params.id).populate('seller', 'email name')
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

async function create(req, res) {
  try {
    const {
      title, description, price, make, model, year, mileage,
      bodyType, fuelType, transmission, color, location
    } = req.body
    const sellerId = req.user && req.user.id
    if (!sellerId) return res.status(401).json({ error: 'Unauthorized' })
    // sanitize common test sentinel strings and coerce numbers
    const normalize = (v) => {
      if (v === undefined || v === null) return undefined
      if (typeof v === 'string') {
        const t = v.trim().toLowerCase()
        if (t === '' || t === 'none' || t === 'null' || t === 'undefined') return undefined
      }
      return v
    }
    const toNumber = (v) => {
      const n = Number(v)
      return Number.isFinite(n) ? n : undefined
    }
    const titleNorm = normalize(title)
    if (!titleNorm) return res.status(400).json({ error: 'Title is required' })
    const listing = await Listing.create({
      title: titleNorm,
      description: normalize(description),
      price: toNumber(normalize(price)),
      seller: sellerId,
      images: [],
      make: normalize(make),
      model: normalize(model),
      year: toNumber(normalize(year)),
      mileage: toNumber(normalize(mileage)),
      bodyType: normalize(bodyType),
      fuelType: normalize(fuelType),
      transmission: normalize(transmission),
      color: normalize(color),
      location: normalize(location)
    })
    res.status(201).json(listing)
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err.message })
  }
}

// Upload images for a listing
async function uploadImages(req, res) {
  try {
    const listingId = req.params.id
    const files = req.files || []
    if (!files.length) return res.status(400).json({ error: 'No files uploaded' })
    const listing = await Listing.findById(listingId)
    if (!listing) return res.status(404).json({ error: 'Listing not found' })
    // Ensure uploader is the seller
    if (String(listing.seller) !== String(req.user.id)) return res.status(403).json({ error: 'Forbidden' })
    const uploads = []
    const thumbsDir = path.join(__dirname, '..', 'uploads', 'thumbs')
    if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true })
    for (const f of files) {
      const originalPath = path.posix.join('/uploads', f.filename)
      uploads.push(originalPath)
      // generate thumbnail (300x200)
      const input = path.join(__dirname, '..', 'uploads', f.filename)
      const thumbName = `thumb-${f.filename}`
      const thumbPathFs = path.join(thumbsDir, thumbName)
      try {
        await sharp(input).resize(600, 400, { fit: 'cover' }).toFile(thumbPathFs)
      } catch (err) {
        console.error('thumbnail error', err)
      }
    }
    listing.images = listing.images ? listing.images.concat(uploads) : uploads
    await listing.save()
    res.json({ images: listing.images })
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message })
  }
}

module.exports = { list, getById, create, uploadImages }
