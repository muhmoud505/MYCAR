const nodemailer = require('nodemailer')

// Create a simple in-memory contact storage (in production, use a database)
const contacts = []

// Configure email transporter (using Gmail as example)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  })
}

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Name, email, subject, and message are required' 
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid email format' 
      })
    }

    // Create contact entry
    const contact = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'pending',
      createdAt: new Date(),
      userAgent: req.get('User-Agent'),
      ip: req.ip
    }

    // Store contact (in production, save to database)
    contacts.push(contact)

    // Send email notification (if configured)
    try {
      const transporter = createTransporter()
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: process.env.CONTACT_EMAIL || 'support@mycar.com',
        subject: `New Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Submitted: ${contact.createdAt.toLocaleString()}</small></p>
          <p><small>IP: ${contact.ip}</small></p>
        `
      }

      await transporter.sendMail(mailOptions)
      
      // Send confirmation email to user
      const confirmationMailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject: 'Thank you for contacting MYCAR',
        html: `
          <h2>Thank You for Contacting Us</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you within 24-48 hours.</p>
          <p><strong>Your Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p>Best regards,<br>MYCAR Team</p>
        `
      }

      await transporter.sendMail(confirmationMailOptions)
      
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Continue even if email fails - contact is still stored
    }

    res.json({ 
      ok: true, 
      message: 'Contact form submitted successfully',
      contactId: contact.id
    })

  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to submit contact form' 
    })
  }
}

exports.getContacts = async (req, res) => {
  try {
    // In production, this would be a database query
    // For now, return all contacts with pagination
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedContacts = contacts.slice(startIndex, endIndex)
    
    res.json({
      ok: true,
      contacts: paginatedContacts,
      pagination: {
        page,
        limit,
        total: contacts.length,
        pages: Math.ceil(contacts.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to fetch contacts' 
    })
  }
}

exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['pending', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid status' 
      })
    }

    // Find and update contact
    const contactIndex = contacts.findIndex(c => c.id === id)
    if (contactIndex === -1) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Contact not found' 
      })
    }

    contacts[contactIndex].status = status
    contacts[contactIndex].updatedAt = new Date()

    res.json({ 
      ok: true, 
      message: 'Contact status updated successfully',
      contact: contacts[contactIndex]
    })
  } catch (error) {
    console.error('Error updating contact status:', error)
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to update contact status' 
    })
  }
}

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params

    const contactIndex = contacts.findIndex(c => c.id === id)
    if (contactIndex === -1) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Contact not found' 
      })
    }

    contacts.splice(contactIndex, 1)

    res.json({ 
      ok: true, 
      message: 'Contact deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting contact:', error)
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to delete contact' 
    })
  }
}
