const Dealership = require('../models/Dealership')

exports.listDealerships = async (req, res) => {
  try {
    const items = await Dealership.find().sort({ createdAt: -1 }).limit(50)
    res.json({ ok: true, results: items })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

exports.getDealership = async (req, res) => {
  try {
    const item = await Dealership.findById(req.params.id)
    if (!item) return res.status(404).json({ ok: false, error: 'Not found' })
    res.json({ ok: true, id: req.params.id, item })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

exports.createDealership = async (req, res) => {
  try {
    const doc = new Dealership(req.body)
    await doc.save()
    res.status(201).json({ ok: true, created: doc })
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message })
  }
}
