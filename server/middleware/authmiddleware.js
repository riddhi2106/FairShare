const jwt = require('jsonwebtoken');

// Middleware to verify JWT from Authorization header and attach decoded user to req.user
module.exports = (req, res, next) => {
  const header = req.header('Authorization') || '';
  const token = header.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    // decoded should contain at least { id, email, name } depending on implementation
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
