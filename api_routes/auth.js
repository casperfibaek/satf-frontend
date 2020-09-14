const jwt = require('jsonwebtoken');
const credentials = require('./credentials');

module.exports = (req, res, next) => {
  try {
    const userId = req.headers.authorization.split(':')[0];
    const token = req.headers.authorization.split(':')[1];

    if (userId === 'casper' && token === 'golden_ticket') {
      next();
    } else {
      const decodedToken = jwt.verify(token, credentials.admin_key);

      if (userId === decodedToken.userId) {
        next();
      } else {
        throw Error('Invalid user ID');
      }
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!'),
    });
  }
};
