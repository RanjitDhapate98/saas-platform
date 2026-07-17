# SaaS Platform

> **A full-stack SaaS application built with the MERN stack, featuring secure JWT authentication, subscription management, and Razorpay payment integration for seamless plan upgrades.**

**Live Demo:** *Add your deployed link here*

---

# Overview

SaaS Platform is a subscription-based web application that enables users to register, authenticate securely, choose subscription plans, and complete payments using Razorpay. The application implements a complete subscription lifecycle, including authentication, plan upgrades, payment verification, and protected access based on subscription status.

The project demonstrates production-oriented backend architecture with secure payment handling, RESTful APIs, and scalable application design.

---

# Features

## Authentication & Authorization

- JWT-based Authentication
- Secure password hashing using bcrypt
- Protected API routes
- Middleware-based authorization
- Persistent user sessions

---

## Subscription Management

- Free subscription plan
- Basic subscription plan
- Pro subscription plan
- Upgrade subscription plans
- Subscription status tracking
- Access control based on active subscription

---

## Payment Integration

- Razorpay Checkout integration
- Secure order creation
- Backend payment verification
- Signature verification
- Automatic subscription activation after successful payment

---

## Backend Features

- RESTful API architecture
- Modular backend structure
- Secure environment variable management
- MongoDB data persistence

---

## User Experience

- Responsive interface
- Smooth checkout experience
- Instant subscription activation
- Clean dashboard workflow

---

# Tech Stack

## Frontend

- React.js
- Vite
- Axios
- CSS

## Backend

- Node.js
- Express.js
- JWT
- bcrypt

## Database

- MongoDB
- Mongoose

## Payments

- Razorpay

---

# System Architecture

```text
User
   │
   ▼
React Frontend
   │
   ▼
Express REST API
   │
   ▼
Authentication
Subscription
Payment Services
   │
   ▼
MongoDB
   │
   ▼
Razorpay
```

### Architecture Highlights

- RESTful API architecture
- JWT-based authentication and authorization
- Razorpay payment gateway integration
- Subscription lifecycle management
- Protected subscription-based routes
- Modular backend structure

---

# Project Structure

```text
SaaS-Platform
│
├── backend
│   ├── data
│   │   └── db/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── frontend
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── .gitignore
│
├── .gitignore
└── README.md
```

---

# Getting Started

## Clone the Repository

```bash
git clone https://github.com/your-username/saas-platform.git
```

---

## Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Configure Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

RAZORPAY_KEY_ID=your_key

RAZORPAY_KEY_SECRET=your_secret
```

---

## Run the Application

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

---

# Technical Highlights

- Built a full-stack subscription-based SaaS application using the MERN stack.
- Implemented secure JWT-based authentication and authorization.
- Integrated Razorpay for secure payment processing.
- Developed an end-to-end payment workflow including order creation, payment processing, signature verification, and subscription activation.
- Implemented subscription-based access control for premium features.
- Built modular REST APIs following scalable backend architecture.
- Managed complete subscription lifecycle from user registration to plan upgrades.
- Secured sensitive configuration using environment variables.

---

# Subscription Workflow

```text
Register / Login
        │
        ▼
Choose Subscription Plan
        │
        ├──────────────► Free Plan
        │                    │
        │                    ▼
        │             Activated Instantly
        │
        ▼
      Paid Plan
        │
        ▼
Create Razorpay Order
        │
        ▼
Complete Payment
        │
        ▼
Verify Payment Signature
        │
        ▼
Activate Subscription
```

---

# Key Concepts Demonstrated

- JWT Authentication
- REST API Development
- Payment Gateway Integration
- Payment Verification
- Subscription Lifecycle Management
- Authorization
- Backend Architecture
- Secure API Design
- Environment Configuration

---

# Future Enhancements

- Email Verification
- Password Reset
- Admin Dashboard
- Invoice Generation
- Usage Analytics
- Team Workspaces
- Recurring Billing
- Razorpay Webhooks
- Coupon System
- Stripe Integration

---

# Live Demo

**Application:** *Add your deployment link here*

---

# Author

**Ranjit Dhapate**

Computer Science Engineering Student

MERN Stack Developer | Backend Developer

---

If you found this project useful, consider giving it a star.
