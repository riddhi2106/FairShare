// backend/middleware/authMiddleware.js
// Verifies JWT from Authorization header and attaches decoded user to req.user
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.header('Authorization') || '';
  const token = header.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    // decoded should contain at least { id, email, name } depending on Member1 implementation
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
