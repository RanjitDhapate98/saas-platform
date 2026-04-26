# SaaS Platform

A full-stack SaaS application where users can register, choose subscription plans, and make payments. The system handles authentication, subscription management, and payment verification.

## Features

* User authentication with JWT
* Free and paid subscription plans (Basic, Pro)
* Razorpay payment integration
* Secure payment verification system
* Protected routes based on subscription status

## Tech Stack

* Frontend: React.js
* Backend: Node.js, Express.js
* Database: MongoDB
* Payments: Razorpay

## Highlights

* End-to-end payment flow (order → payment → verification)
* Secure backend with protected APIs
* Subscription lifecycle handling

## Run Locally

1. Clone the repo
2. Add `.env` with MongoDB & Razorpay keys
3. Run backend: `npm run dev`
4. Run frontend: `npm start`

## Notes

Free plan activates without payment
Paid plans go through Razorpay checkout flow

* Free plan activates without payment
* Paid plans go through Razorpay checkout flow
