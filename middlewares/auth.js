const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { jwtSecret } = require('../utils/configuration');
const { messageUnauthorizedError } = require('../utils/constants');
const { NODE_ENV, JWT_SECRET } = process.env;
const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const error = new UnauthorizedError(messageUnauthorizedError);
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(error);
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : jwtSecret);
  } catch (err) {
    next(error);
  }
  req.user = payload;

  next();
};
