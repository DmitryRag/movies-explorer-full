const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const NotAuthError = require('../errors/not-auth-error');
const {
  unauthorizedMessage,
} = require('../constants');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthError(unauthorizedMessage);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new NotAuthError(unauthorizedMessage);
  }

  req.user = payload;
  return next();
};
