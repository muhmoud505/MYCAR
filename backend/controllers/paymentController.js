const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_...')
const Listing = require('../models/Listing')
const User = require('../models/User')

// Create payment intent for listing purchase
exports.createPaymentIntent = async (req, res) => {
  try {
    const { listingId, amount, currency = 'usd' } = req.body

    if (!listingId || !amount) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Listing ID and amount are required' 
      })
    }

    // Verify listing exists
    const listing = await Listing.findById(listingId)
    if (!listing) {
      return res.status(404).json({ 
        ok: false, 
        error: 'Listing not found' 
      })
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        listingId: listingId,
        userId: req.user?.id || 'anonymous',
        listingTitle: listing.title
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    res.json({
      ok: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to create payment intent' 
    })
  }
}

// Confirm payment and update listing status
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body

    if (!paymentIntentId) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Payment intent ID is required' 
      })
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Payment not successful' 
      })
    }

    const listingId = paymentIntent.metadata.listingId
    const userId = paymentIntent.metadata.userId

    // Update listing status to sold
    await Listing.findByIdAndUpdate(listingId, {
      status: 'sold',
      soldAt: new Date(),
      soldTo: userId
    })

    // Create transaction record (in production, save to database)
    const transaction = {
      id: `txn_${Date.now()}`,
      paymentIntentId: paymentIntentId,
      listingId: listingId,
      userId: userId,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: 'completed',
      createdAt: new Date()
    }

    res.json({
      ok: true,
      message: 'Payment confirmed successfully',
      transaction: transaction
    })

  } catch (error) {
    console.error('Payment confirmation error:', error)
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to confirm payment' 
    })
  }
}

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { paymentIntentId, reason } = req.body

    if (!paymentIntentId) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Payment intent ID is required' 
      })
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer'
    })

    res.json({
      ok: true,
      message: 'Refund processed successfully',
      refundId: refund.id,
      refundStatus: refund.status
    })

  } catch (error) {
    console.error('Refund processing error:', error)
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to process refund' 
    })
  }
}

// Get payment methods for user
exports.getPaymentMethods = async (req, res) => {
  try {
    if (!req.user || !req.user.stripeCustomerId) {
      return res.json({ ok: true, paymentMethods: [] })
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId,
      type: 'card',
    })

    res.json({
      ok: true,
      paymentMethods: paymentMethods.data
    })

  } catch (error) {
    console.error('Error fetching payment methods:', error)
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to fetch payment methods' 
    })
  }
}

// Create customer and attach payment method
exports.createCustomer = async (req, res) => {
  try {
    const { paymentMethodId } = req.body

    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        ok: false, 
        error: 'User authentication required' 
      })
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: req.user.email,
      name: req.user.name,
      metadata: {
        userId: req.user.id
      }
    })

    // Attach payment method if provided
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      })
    }

    // Save customer ID to user
    await User.findByIdAndUpdate(req.user.id, {
      stripeCustomerId: customer.id
    })

    res.json({
      ok: true,
      customerId: customer.id
    })

  } catch (error) {
    console.error('Customer creation error:', error)
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to create customer' 
    })
  }
}

// Webhook handler for Stripe events
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log('PaymentIntent was successful!', paymentIntent.id)
      
      // Update listing status and create transaction record
      await Listing.findByIdAndUpdate(paymentIntent.metadata.listingId, {
        status: 'sold',
        soldAt: new Date(),
        soldTo: paymentIntent.metadata.userId
      })
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      console.log('PaymentIntent failed!', failedPayment.id)
      break

    case 'payment_method.attached':
      const paymentMethod = event.data.object
      console.log('PaymentMethod was attached to a Customer!', paymentMethod.id)
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true })
}

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        ok: false, 
        error: 'User authentication required' 
      })
    }

    // In production, this would query a transactions database
    // For now, return empty array as placeholder
    res.json({
      ok: true,
      transactions: []
    })

  } catch (error) {
    console.error('Error fetching transaction history:', error)
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to fetch transaction history' 
    })
  }
}
