# SaaS Platform

A full-stack SaaS application where users can sign up, choose plans, and manage their subscription. It includes authentication, protected routes, and payment integration.

## Features

* User signup & login with JWT authentication
* Free, Basic, and Pro subscription plans
* Razorpay integration for payments
* Protected routes based on subscription
* Auto plan activation after successful payment

## Tech Stack

* Frontend: React
* Backend: Node.js, Express
* Database: MongoDB
* Payments: Razorpay

## How to Run Locally

1. Clone the repo
2. Add a `.env` file in backend with required keys
3. Run backend:
   npm run dev
4. Run frontend:
   npm start

## Notes

* Free plan can be activated directly
* Paid plans go through Razorpay payment flow
