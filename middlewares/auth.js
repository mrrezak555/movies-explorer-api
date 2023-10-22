const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const handleAuthError = (res, next) => {
  next(new AuthorizationError('Что-то не так с почтой или паролем'));
};

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  let payload;
  try {
    payload = jwt.verify(
      token,
      process.env.NODE_ENV === 'production'
        ? process.env.JWT_SECRET
        : 'dev-secret',
    );
  } catch (err) {
    return handleAuthError(res, next);
  }

  req.user = payload;
  next();
};
