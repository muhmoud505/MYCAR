const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const crypto = require('crypto')
const PasswordResetToken = require('../models/PasswordResetToken')
const nodemailer = require('nodemailer')

async function register(req, res) {
  try {
    const { email, password, name, role = 'buyer', phone, location } = req.body
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already registered' })
    
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ 
      email, 
      password: hash, 
      name, 
      role,
      phone,
      location
    })
    
    // Send welcome email
    if (process.env.SMTP_HOST) {
      await sendWelcomeEmail(email, name)
    }
    
    const token = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
    res.status(201).json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified
      }
    })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    
    const token = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
    res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
        verificationBadge: user.verificationBadge,
        avatar: user.avatar,
        phone: user.phone,
        location: user.location
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ error: 'Not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' })
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'Not found' })
    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid current password' })
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

async function listUsers(req, res) {
  try {
    const users = await User.find().select('-password')
    res.json({ users })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { register, login, me, changePassword, listUsers, forgotPassword, resetPassword }

// Welcome email function
async function sendWelcomeEmail(email, name) {
  const host = process.env.SMTP_HOST
  if (!host) {
    console.log(`Welcome email would be sent to ${email}`)
    return
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  })

  const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@mycar.local'
  await transporter.sendMail({
    from,
    to: email,
    subject: 'Welcome to MYCAR!',
    text: `Welcome ${name}! Thank you for joining MYCAR. You can now start browsing, listing, and connecting with car buyers and sellers.`,
    html: `<h2>Welcome to MYCAR, ${name}!</h2><p>Thank you for joining MYCAR. You can now start browsing, listing, and connecting with car buyers and sellers.</p>`
  })
}

// Forgot password: create token and send email (no user enumeration)
async function sendResetEmail(email, resetUrl) {
  // If SMTP is configured, send; otherwise log reset link
  const host = process.env.SMTP_HOST
  if (!host) {
    console.log(`Password reset for ${email}: ${resetUrl}`)
    return
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  })

  const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'no-reply@mycar.local'
  await transporter.sendMail({
    from,
    to: email,
    subject: 'MYCAR password reset',
    text: `Reset your password: ${resetUrl}`,
    html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
  })
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Missing email' })
    const user = await User.findOne({ email })
    // Always respond 200 to avoid enumeration
    if (!user) {
      return res.json({ success: true })
    }

    const token = crypto.randomBytes(24).toString('hex')
    const expiresAt = new Date(Date.now() + (60 * 60 * 1000)) // 1 hour
    await PasswordResetToken.create({ userId: user._id, token, expiresAt })

    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000'
    const resetUrl = `${frontend}/auth/reset?token=${token}`
    await sendResetEmail(email, resetUrl)
    res.json({ success: true })
  } catch (err) {
    console.error('forgotPassword error', err)
    res.status(500).json({ error: 'Server error' })
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body
    if (!token || !newPassword) return res.status(400).json({ error: 'Missing fields' })
    const doc = await PasswordResetToken.findOne({ token })
    if (!doc || doc.expiresAt < new Date()) return res.status(400).json({ error: 'Invalid or expired token' })
    const user = await User.findById(doc.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    // remove all tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id })
    res.json({ success: true })
  } catch (err) {
    console.error('resetPassword error', err)
    res.status(500).json({ error: 'Server error' })
  }
}
