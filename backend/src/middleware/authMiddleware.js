const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. No token found
  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access', 401)
    );
  }

  // 3. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired. Please log in again.', 401));
    }
    return next(new AppError('Invalid token. Please log in again.', 401));
  }

  // 4. Find user
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  }

  // 5. Attach user to request
  req.user = currentUser;
  next();
});

const restrictTo = (...plans) => {
  return (req, res, next) => {
    if (!req.user.subscription || !req.user.subscription.isActive) {
      return next(
        new AppError('You need an active subscription to access this feature', 403)
      );
    }

    if (!plans.includes(req.user.subscription.plan)) {
      return next(
        new AppError(`This feature requires ${plans.join(' or ')} plan`, 403)
      );
    }

    next();
  };
};

module.exports = { protect, restrictTo };