const jwt = require('jsonwebtoken');
const secretKey = require('../secrets.json').secretKey; 

const requireAuth = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decodedToken;
    next();
  });
};

module.exports = requireAuth;
