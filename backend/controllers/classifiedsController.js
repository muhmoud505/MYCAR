const Classified = require('../models/Classified')

exports.listClassifieds = async (req, res) => {
  try {
    const items = await Classified.find().sort({ createdAt: -1 }).limit(50)
    res.json({ ok: true, results: items })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

exports.createClassified = async (req, res) => {
  try {
    const doc = new Classified(req.body)
    await doc.save()
    res.status(201).json({ ok: true, created: doc })
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message })
  }
}

exports.getClassified = async (req, res) => {
  try {
    const item = await Classified.findById(req.params.id)
    if (!item) return res.status(404).json({ ok: false, error: 'Not found' })
    res.json({ ok: true, id: req.params.id, item })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
