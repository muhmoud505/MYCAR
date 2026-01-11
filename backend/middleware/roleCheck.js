const roleCheck = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'Authentication required' })
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ 
        ok: false, 
        error: `Access denied. ${requiredRole} role required.` 
      })
    }

    next()
  }
}

module.exports = roleCheck
