exports.createPaymentIntent = async (req, res) => {
  // placeholder until Stripe keys are configured
  res.json({ ok: true, clientSecret: 'test_secret_placeholder' })
}

exports.webhook = async (req, res) => {
  // note: in production you must verify signature and parse raw body
  res.status(200).send('ok')
}
