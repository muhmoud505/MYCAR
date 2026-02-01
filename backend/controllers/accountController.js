const User = require('../models/User')
const bcrypt = require('bcrypt')

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

exports.updatePreferences = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ ok: false, error: 'Unauthorized' })
    
    const { section, ...preferences } = req.body
    console.log('Preferences update request:', { section, preferences })
    
    // Handle different preference sections
    let updateData = {}
    
    if (section === 'preferences') {
      // Direct preferences update - handle nested objects
      Object.keys(preferences).forEach(key => {
        if (typeof preferences[key] === 'object' && preferences[key] !== null) {
          // Handle nested objects like notifications
          Object.keys(preferences[key]).forEach(nestedKey => {
            updateData[`preferences.${key}.${nestedKey}`] = preferences[key][nestedKey]
          })
        } else {
          // Handle simple values
          updateData[`preferences.${key}`] = preferences[key]
        }
      })
    } else if (section === 'security') {
      // Security settings update
      Object.keys(preferences).forEach(key => {
        updateData[`securitySettings.${key}`] = preferences[key]
      })
    } else {
      // Other sections
      updateData[section] = preferences
    }
    
    console.log('Update data:', updateData)
    
    const updated = await User.findByIdAndUpdate(req.user.id, updateData, { new: true })
    console.log('User updated successfully')
    
    res.json({ ok: true, updated })
  } catch (err) {
    console.error('Preferences update error:', err)
    res.status(400).json({ ok: false, error: err.message })
  }
}

exports.updateSocialLinks = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ ok: false, error: 'Unauthorized' })
    
    console.log('Social links update request:', req.body)
    
    const updated = await User.findByIdAndUpdate(req.user.id, {
      $set: { 'socialLinks': req.body }
    }, { new: true })
    
    console.log('Social links updated successfully')
    res.json({ ok: true, updated })
  } catch (err) {
    console.error('Social links update error:', err)
    res.status(400).json({ ok: false, error: err.message })
  }
}

exports.uploadAvatar = async (req, res) => {
  try {
    console.log('Avatar upload request received')
    console.log('req.file:', req.file)
    console.log('req.body:', req.body)
    console.log('Content-Type:', req.get('Content-Type'))
    
    if (!req.user || !req.user.id) return res.status(401).json({ ok: false, error: 'Unauthorized' })
    
    if (!req.file) {
      console.log('No file in request')
      return res.status(400).json({ ok: false, error: 'No file uploaded' })
    }
    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`
    console.log('Avatar URL:', avatarUrl)
    
    const updated = await User.findByIdAndUpdate(req.user.id, {
      avatar: avatarUrl
    }, { new: true })
    
    console.log('User updated with avatar')
    res.json({ ok: true, avatar: avatarUrl })
  } catch (err) {
    console.error('Avatar upload error:', err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

exports.deleteAccount = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ ok: false, error: 'Unauthorized' })
    
    // Soft delete - mark as deleted but keep in database
    await User.findByIdAndUpdate(req.user.id, { 
      blocked: true,
      deletedAt: new Date()
    })
    
    res.json({ ok: true, message: 'Account deleted successfully' })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
}

exports.changePassword = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ ok: false, error: 'Unauthorized' })
    
    const { currentPassword, newPassword } = req.body
    
    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ ok: false, error: 'Current password and new password are required' })
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ ok: false, error: 'New password must be at least 6 characters long' })
    }
    
    // Get user with password
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' })
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ ok: false, error: 'Current password is incorrect' })
    }
    
    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    
    // Update password
    await User.findByIdAndUpdate(req.user.id, { 
      password: hashedNewPassword,
      passwordChangedAt: new Date()
    })
    
    res.json({ ok: true, message: 'Password changed successfully' })
  } catch (err) {
    console.error('Password change error:', err)
    res.status(500).json({ ok: false, error: 'Failed to change password' })
  }
}
