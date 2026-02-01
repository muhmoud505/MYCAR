const router = require('express').Router()
const paymentController = require('../controllers/paymentController')
const { authMiddleware } = require('../middleware/auth')
const express = require('express')

// Stripe webhook needs raw body
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook)

// Protected payment routes
router.use(authMiddleware)

// Payment intents
router.post('/create-intent', paymentController.createPaymentIntent)
router.post('/confirm-payment', paymentController.confirmPayment)

// Customer management
router.post('/create-customer', paymentController.createCustomer)
router.get('/payment-methods', paymentController.getPaymentMethods)

// Refunds
router.post('/refund', paymentController.processRefund)

// Transaction history
router.get('/transactions', paymentController.getTransactionHistory)

module.exports = router
