const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  refreshToken,
  logout,
  getMe
} = require('../controllers/authController');
const {
  validateSignup,
  validateLogin
} = require('../models/validateRequest');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;