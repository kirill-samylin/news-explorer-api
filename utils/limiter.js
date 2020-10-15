const limit = require('express-rate-limit');
const limiter = limit({
  windowMs: 1000, // 1 second
  max: 5, // limit each IP to 5 requests per windowMs
});

module.exports = limiter;
