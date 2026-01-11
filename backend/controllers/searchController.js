const Listing = require('../models/Listing')

function parseNumber(v){
  if (v === undefined || v === null) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

exports.searchListings = async (req, res) => {
  try {
    // Accept either a JSON `filters` param or individual query params
    const { q } = req.query
    let filters = {}
    try { if (req.query.filters) filters = JSON.parse(req.query.filters) } catch(e){ filters = {} }

    // Merge individual params if provided
    const maybe = (name) => req.query[name] ?? filters[name]

    const make = maybe('make')
    const model = maybe('model')
    const minYear = parseNumber(maybe('minYear'))
    const maxYear = parseNumber(maybe('maxYear'))
    const minPrice = parseNumber(maybe('minPrice'))
    const maxPrice = parseNumber(maybe('maxPrice'))
    const minMileage = parseNumber(maybe('minMileage'))
    const maxMileage = parseNumber(maybe('maxMileage'))
    const bodyType = maybe('bodyType')
    const fuelType = maybe('fuelType')
    const transmission = maybe('transmission')
    const color = maybe('color')
    const location = maybe('location')
    const city = maybe('city')
    const state = maybe('state')
    const condition = maybe('condition')
    const type = maybe('type')
    const featured = maybe('featured')
    const sortBy = maybe('sortBy') || 'createdAt'
    const sortOrder = maybe('sortOrder') || 'desc'

    const query = { status: 'active' }
    
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      query.$or = [
        { title: re }, 
        { description: re },
        { make: re },
        { model: re }
      ]
    }
    if (make) query.make = make
    if (model) query.model = model
    if (bodyType) query.bodyType = bodyType
    if (fuelType) query.fuelType = fuelType
    if (transmission) query.transmission = transmission
    if (color) query.color = color
    if (condition) query.condition = condition
    if (type) query.type = type
    if (featured === 'true') query.featured = true
    
    // Location filters
    if (location) {
      query.$or = [
        ...(query.$or || []),
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') },
        { 'location.address': new RegExp(location, 'i') }
      ]
    }
    if (city) query['location.city'] = new RegExp(city, 'i')
    if (state) query['location.state'] = new RegExp(state, 'i')
    
    // Range filters
    if (minYear || maxYear) query.year = {}
    if (minYear) query.year.$gte = minYear
    if (maxYear) query.year.$lte = maxYear
    
    if (minPrice || maxPrice) query.price = {}
    if (minPrice) query.price.$gte = minPrice
    if (maxPrice) query.price.$lte = maxPrice
    
    if (minMileage || maxMileage) query.mileage = {}
    if (minMileage) query.mileage.$gte = minMileage
    if (maxMileage) query.mileage.$lte = maxMileage

    const page = Math.max(1, parseInt(req.query.page || '1', 10))
    const limit = Math.min(100, parseInt(req.query.limit || '20', 10))
    const skip = (page - 1) * limit

    // Sorting
    const sortOptions = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1
    }

    const results = await Listing.find(query)
      .populate('seller', 'name email avatar isVerified verificationBadge')
      .populate('dealership', 'name location')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
    
    const total = await Listing.countDocuments(query)
    
    res.json({ 
      ok: true, 
      total, 
      page, 
      limit, 
      results,
      filters: {
        make, model, minYear, maxYear, minPrice, maxPrice, 
        minMileage, maxMileage, bodyType, fuelType, transmission, 
        color, location, city, state, condition, type, featured
      }
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

exports.autocomplete = async (req, res) => {
  try {
    const { q } = req.query
    if (!q || String(q).trim().length < 1) return res.json({ ok: true, suggestions: [] })
    const re = new RegExp(String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    const hits = await Listing.find({ title: re }).limit(10).select('title')
    res.json({ ok: true, suggestions: hits.map(h => h.title) })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
