const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Missing authorization' })
  const [type, token] = auth.split(' ')
  if (type !== 'Bearer' || !token) return res.status(401).json({ error: 'Invalid authorization' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret')
    req.user = { id: payload.sub, role: payload.role }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

function roleCheck(requiredRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    if (req.user.role !== requiredRole) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}

module.exports = { authMiddleware, roleCheck }
