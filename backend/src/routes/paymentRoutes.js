const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, activateFreePlan } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All payment routes are protected
console.log("createOrder:", createOrder);
console.log("verifyPayment:", verifyPayment);
console.log("activateFreePlan:", activateFreePlan);
console.log("protect:", protect);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/free-plan', protect, activateFreePlan);

module.exports = router;