const jwt = require('jsonwebtoken');

function authenticateAdmin(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
    req.admin = decoded;
    next();
  });
}

module.exports = authenticateAdmin;
