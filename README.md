# Mini E-Commerce Demo Project (MERN Stack)

[![GitHub Repository](https://img.shields.io/badge/GitHub-shrawaniGawade%2FE--com-blue?logo=github)](https://github.com/shrawaniGawade/E-com.git)
[![Stack](https://img.shields.io/badge/Stack-MERN-green)](#tech-stack)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-38bdf8?logo=tailwindcss)](#tech-stack)

A clean, responsive, and robust full-stack **Mini E-Commerce Demo Web Application** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS.

---

## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Core Features](#core-features)
- [End-to-End Demo Workflow](#end-to-end-demo-workflow)
- [Documentation Index](#documentation-index)
- [Setup & Installation Guide (Planned)](#setup--installation-guide-planned)
- [Git & Repository Management](#git--repository-management)

---

## 🎯 Project Overview

This project is a streamlined, educational, and production-ready mini e-commerce application. It demonstrates core e-commerce workflows without bloat:
1. **Public Storefront**: Browse products, filter by category, search by keywords, manage a shopping cart, and place orders via **Cash on Delivery (COD)**.
2. **Admin Dashboard**: Manage inventory (categories & products) and process customer orders with real-time order status updates.
3. **Security & Validation**: JWT-based authentication, bcrypt password hashing, role-based route protection, and server-side stock and price verification to prevent tampering.

> **Note**: This is a mini demo project designed for clarity and clean architecture. Advanced features such as payment gateways, coupon codes, wishlists, multi-vendor setups, and product reviews are intentionally omitted.

---

## 🛠 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [React.js](https://react.dev/) + [Vite](https://vitejs.dev/) | High-performance SPA with modern React hooks & components |
| **Language** | JavaScript (ES6+) | Modern standard JavaScript across client and server |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework for clean, responsive UI/UX |
| **HTTP Client** | [Axios](https://axios-http.com/) | Promise-based HTTP client with interceptors for JWT tokens |
| **Backend** | [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) | RESTful API server with modular routing and controllers |
| **Database** | [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) | Document database with schema modeling, validation, and hooks |
| **Auth & Security** | [JWT (jsonwebtoken)](https://jwt.io/) & [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Stateless authentication and salted password hashing |

---

## 📁 Project Directory Structure

```text
mern-mini-ecommerce/
├── docs/                                # Project Specifications & Documentation
│   ├── ARCHITECTURE.md                  # System design & architecture diagrams
│   ├── DATABASE_MODELS.md               # MongoDB schemas, relationships & validations
│   ├── API_SPECIFICATION.md             # REST API routes, payloads & status codes
│   ├── AUTHENTICATION_AND_SECURITY.md   # JWT, RBAC & server validation safeguards
│   ├── FRONTEND_UI_UX.md                # Pages, Tailwind design system & components
│   ├── CHECKOUT_AND_ORDERS.md           # COD checkout flow, stock verification & status transitions
│   ├── DEMO_WALKTHROUGH.md              # 10-step demo script & test scenarios
│   └── PROJECT_ROADMAP.md               # Implementation plan & testing checklist
├── client/                              # React.js + Vite + Tailwind CSS Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                      # Static assets & icons
│   │   ├── components/                  # Reusable UI components (Navbar, Footer, Modal, etc.)
│   │   ├── context/                     # Global state (AuthContext, CartContext)
│   │   ├── hooks/                       # Custom React hooks
│   │   ├── pages/                       # Public & Customer pages
│   │   ├── pages/admin/                 # Admin Dashboard pages
│   │   ├── services/                    # Axios API service instances & endpoints
│   │   ├── utils/                       # Currency formatting, validation helpers
│   │   ├── App.jsx                      # Routing configuration
│   │   ├── main.jsx                     # Entry point
│   │   └── index.css                    # Tailwind CSS directives
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                              # Node.js + Express.js Backend
│   ├── config/                          # DB connection & environment constants
│   ├── controllers/                     # Request logic (auth, category, product, order)
│   ├── middleware/                      # Auth, admin, error-handling middleware
│   ├── models/                          # Mongoose models (User, Category, Product, Order)
│   ├── routes/                          # REST API route declarations
│   ├── utils/                           # Token generation, seed data helpers
│   ├── server.js                        # App entry point & middleware mounting
│   ├── package.json
│   └── .env.example
├── .gitignore                           # Git ignore rules for node_modules & .env
└── README.md                            # Main project overview & index
```

---

## ⚡ Core Features

### 1. Customer & Public Experience
- **Authentication**: User registration (Name, Email, Password, Confirm Password) and Login with JWT token storage.
- **Product Catalog**: Dynamic product grid with search query and category filtering (`All | Electronics | Fashion | Shoes | ...`).
- **Product Details**: Product imagery, descriptions, real-time stock indicator, and direct "Add to Cart" action.
- **Cart Management**: Add items, increase/decrease quantities (clamped by available stock), remove items, and live order subtotal calculation.
- **Checkout**: Simple shipping address form (Name, Phone, Address, City, Pincode) with **Cash on Delivery (COD)** payment method.
- **Stock Decrement**: Instant stock deduction upon successful order placement.
- **Order History**: "My Orders" page tracking order items, delivery address, date, and order status.

### 2. Admin Panel Experience
- **Admin Authentication**: Role-restricted login and route guards.
- **Category Management**: Create, edit, list, and delete product categories.
- **Product Management**: Create, edit, list, and delete products (name, description, price, image URL, category, stock).
- **Order Management**: View all customer orders, inspect order items and customer shipping details, and update status (`Pending` → `Confirmed` → `Shipped` → `Delivered` → `Cancelled`).

---

## 🔄 End-to-End Demo Workflow

```text
[1. Admin Login]
      │
      ▼
[2. Create Categories] ──▶ "Electronics", "Fashion", "Shoes"
      │
      ▼
[3. Add Products] ───────▶ Add details, price, initial stock & image
      │
      ▼
[4. Public Catalog] ─────▶ Products instantly appear on public storefront
      │
      ▼
[5. User Register/Login] ─▶ Customer logs in and receives JWT token
      │
      ▼
[6. Browse & Filter] ────▶ Filter by category and search keyword
      │
      ▼
[7. Add to Cart] ────────▶ Select quantity (validated against available stock)
      │
      ▼
[8. Checkout] ───────────▶ Enter delivery address & select Cash on Delivery (COD)
      │
      ▼
[9. Place Order] ────────▶ Server verifies stock & DB prices, saves order, decrements stock
      │
      ▼
[10. Clear Cart] ────────▶ Customer redirected to "My Orders" confirmation
      │
      ▼
[11. Admin Processing] ──▶ Admin reviews order in dashboard and updates delivery status
```

---

## 📚 Documentation Index

For in-depth technical details, consult the dedicated specification documents:

1. [Architecture & System Design](./docs/ARCHITECTURE.md) - System architecture, component structure, state management, and lifecycle.
2. [Database Models & Schema Design](./docs/DATABASE_MODELS.md) - Complete Mongoose schemas for User, Category, Product, and Order.
3. [REST API Specification](./docs/API_SPECIFICATION.md) - Complete endpoints, parameters, request/response bodies, and HTTP status codes.
4. [Authentication & Security](./docs/AUTHENTICATION_AND_SECURITY.md) - JWT lifecycle, bcrypt implementation, role middleware, and tampering prevention.
5. [Frontend UI/UX Specification](./docs/FRONTEND_UI_UX.md) - Page mockups, Tailwind CSS design guidelines, and responsive layouts.
6. [Checkout & Order Processing](./docs/CHECKOUT_AND_ORDERS.md) - Cash on Delivery workflow, stock verification, and order status transitions.
7. [End-to-End Demo Walkthrough](./docs/DEMO_WALKTHROUGH.md) - Detailed 10-step demo script, test credentials, and sample catalog items.
8. [Project Implementation Roadmap](./docs/PROJECT_ROADMAP.md) - Phased implementation steps, development sequence, and verification checklist.

---

## 🚀 Setup & Installation Guide (Planned)

### Prerequisites
- Node.js (v18.x or later)
- npm (v9.x or later)
- MongoDB instance (local or MongoDB Atlas cluster)
- Git

### Environment Variables
Configure `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_mini_ecommerce
JWT_SECRET=your_super_secret_jwt_key_12345
NODE_ENV=development
```

Configure `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🐙 Git & Repository Management

* **Repository**: [https://github.com/shrawaniGawade/E-com.git](https://github.com/shrawaniGawade/E-com.git)
* **Default Branch**: `main`
* Clean commit conventions following the Conventional Commits specification (`feat:`, `fix:`, `docs:`, `chore:`).
