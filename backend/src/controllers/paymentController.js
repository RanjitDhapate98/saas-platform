const razorpay = require('../config/razorpay');
const Plan = require('../models/Plan');
const User = require('../models/User');
const crypto = require('crypto');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');


// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { planName } = req.body;

  console.log("BODY:", req.body);
  console.log("USER:", req.user?._id);

  // 1. Validate input
  if (!planName) {
    return next(new AppError('planName is required', 400));
  }

  if (!req.user) {
    return next(new AppError('User not authenticated', 401));
  }

  if (!razorpay) {
    return next(new AppError('Razorpay not initialized properly', 500));
  }

  // 2. Find plan
  const plan = await Plan.findOne({ name: planName, isActive: true });

  if (!plan) {
    return next(new AppError('Plan not found', 404));
  }

  if (plan.price === 0) {
    return next(new AppError('Free plan does not require payment', 400));
  }

  // 3. Create Razorpay order (FIXED RECEIPT LENGTH)
  let order;

  try {
    order = await razorpay.orders.create({
      amount: plan.price * 100,
      currency: plan.currency || 'INR',
      receipt: `rcpt_${Date.now()}`, // ✅ FIXED (under 40 chars)
      notes: {
        userId: req.user._id.toString(),
        planName: plan.name
      }
    });

    console.log("✅ Razorpay order created:", order.id);

  } catch (err) {
    console.log("🔥 RAZORPAY ERROR FULL:", err);
    return next(new AppError('Razorpay order creation failed', 500));
  }

  // 4. Send response
  res.status(200).json({
    status: 'success',
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planName: plan.name,
      keyId: process.env.RAZORPAY_KEY_ID
    }
  });
});


// @desc    Verify payment
// @route   POST /api/payment/verify
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planName
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planName) {
    return next(new AppError('All payment fields are required', 400));
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return next(new AppError('Payment verification failed', 400));
  }

  const plan = await Plan.findOne({ name: planName });

  if (!plan) {
    return next(new AppError('Plan not found', 404));
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.duration);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        subscription: {
          plan: plan.name,
          startDate,
          endDate,
          isActive: true,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id
        }
      }
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Payment verified and subscription activated!',
    data: {
      plan: user.subscription.plan,
      startDate: user.subscription.startDate,
      endDate: user.subscription.endDate
    }
  });
});


// @desc    Activate free plan
// @route   POST /api/payment/free-plan
exports.activateFreePlan = asyncHandler(async (req, res, next) => {

  if (!req.user) {
    return next(new AppError('User not authenticated', 401));
  }

  const freshUser = await User.findById(req.user._id);

  if (freshUser.subscription && freshUser.subscription.isActive) {
    return next(new AppError('You already have an active subscription', 400));
  }

  const plan = await Plan.findOne({ name: 'free' });

  if (!plan) {
    return next(new AppError('Free plan not found', 404));
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.duration);

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        subscription: {
          plan: 'free',
          startDate,
          endDate,
          isActive: true,
          razorpayOrderId: null,
          razorpayPaymentId: null
        }
      }
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Free plan activated successfully!',
    data: {
      plan: updatedUser.subscription.plan,
      startDate: updatedUser.subscription.startDate,
      endDate: updatedUser.subscription.endDate
    }
  });
});