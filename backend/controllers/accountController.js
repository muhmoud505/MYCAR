const User = require('../models/User')

exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ ok: false, error: 'Unauthorized' })
    const user = await User.findById(req.user.id).select('-password')
    res.json({ ok: true, profile: user })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ ok: false, error: 'Unauthorized' })
    const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password')
    res.json({ ok: true, updated })
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message })
  }
}

exports.deleteAccount = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ ok: false, error: 'Unauthorized' })
    await User.findByIdAndDelete(req.user.id)
    res.json({ ok: true, deleted: true })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}
