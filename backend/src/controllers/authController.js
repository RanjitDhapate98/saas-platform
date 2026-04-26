const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');

// @desc    Register new user
// @route   POST /api/auth/signup
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 400));
  }

  // 2. Encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  // 4. Return response
  res.status(201).json({
    status: 'success',
    message: 'Account created successfully',
    data: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  // 3. Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // 4. Save refresh token in database
  user.refreshToken = refreshToken;
  await user.save();

  // 5. Debug log
  console.log('✅ Login successful, sending tokens');
  console.log('accessToken:', accessToken);
  console.log('refreshToken:', refreshToken);

  // 6. Send response
  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    accessToken: accessToken,
    refreshToken: refreshToken,
    data: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  // 1. Check if refresh token was sent
  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 400));
  }

  // 2. Verify the refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired refresh token', 401));
  }

  // 3. Find user in database
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }

  // 4. Check if refresh token matches what we saved in DB
  if (user.refreshToken !== refreshToken) {
    return next(new AppError('Refresh token is invalid or already used', 401));
  }

  // 5. Generate new tokens
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // 6. Save new refresh token to DB
  user.refreshToken = newRefreshToken;
  await user.save();

  // 7. Send new tokens
  res.status(200).json({
    status: 'success',
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
exports.logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 400));
  }

  // Find user and clear their refresh token
  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password -refreshToken');

  res.status(200).json({
    status: 'success',
    data: user
  });
});