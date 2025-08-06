# E-commerce Project - Product Requirements Document

## Project Overview
This is a Next.js e-commerce application for selling hats and related products. The application includes:

## Core Features
- User authentication and authorization
- Product catalog and search
- Shopping cart functionality
- Order management
- Admin dashboard
- Payment processing
- User profiles and order history

## Technical Stack
- Frontend: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS
- Authentication: Firebase Auth
- Database: Prisma with Turso (LibSQL)
- State Management: React hooks and context
- UI Components: Radix UI primitives

## User Roles
- Guest users: Browse products, view details
- Authenticated users: Add to cart, place orders, view order history
- Admin users: Manage products, orders, customers, dashboard analytics

## Key URLs
- Frontend: http://localhost:3001
- Admin Dashboard: http://localhost:3001/hatsadmin
- User Authentication: http://localhost:3001/auth
- Product Pages: http://localhost:3001/product/[id]

## Test Scenarios
- User registration and login
- Product browsing and search
- Cart operations (add, remove, update quantities)
- Checkout process
- Admin product management
- Order management
- Error handling and edge cases
