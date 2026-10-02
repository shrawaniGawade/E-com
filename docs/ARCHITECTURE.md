# System Architecture & Design

This document details the architectural design, component interactions, data flow, and directory structure for the **MERN Mini E-Commerce Demo Project**.

---

## 1. High-Level Architectural Overview

The application follows a decoupled client-server architecture using the **MERN Stack**:

```
+-------------------------------------------------------------+
|                      CLIENT TIER                            |
|             React.js + Vite + Tailwind CSS                  |
|                                                             |
|  [Public Storefront Pages]       [Admin Dashboard Pages]    |
|  - Home, Products, Details       - Category Management      |
|  - Cart, Checkout, My Orders     - Product Inventory        |
|  - Login, Register               - Customer Orders Queue    |
|                                                             |
|            [State Management: Context API]                  |
|            - AuthContext (JWT, User Session)                |
|            - CartContext (Items, Quantity, Totals)          |
|                                                             |
|             [HTTP Layer: Axios Interceptors]                |
+------------------------------+------------------------------+
                               |
                               | HTTPS / JSON REST API Calls
                               | (Bearer JWT in Authorization Header)
                               v
+-------------------------------------------------------------+
|                      SERVER TIER                            |
|                 Node.js + Express.js                        |
|                                                             |
|  [Global Middleware]                                        |
|  - CORS, express.json(), Error Handler                      |
|                                                             |
|  [Route Layer]                                              |
|  - /api/auth       - /api/categories                        |
|  - /api/products   - /api/orders                            |
|  - /api/admin/orders                                        |
|                                                             |
|  [Security & Auth Middleware]                               |
|  - protect (verify JWT)                                     |
|  - adminOnly (role === 'admin')                             |
|                                                             |
|  [Controller & Business Logic Layer]                        |
|  - Auth Controller (Registration, Login, Token generation)  |
|  - Category Controller (CRUD)                               |
|  - Product Controller (Search, Filter, Stock management)    |
|  - Order Controller (Stock validation, DB Price lookup, COD)|
+------------------------------+------------------------------+
                               |
                               | Mongoose ODM Driver
                               v
+-------------------------------------------------------------+
|                      DATA TIER                              |
|                  MongoDB Database                           |
|                                                             |
|  [Collections]                                              |
|  - users        (customer & admin credentials)              |
|  - categories   (catalog categories)                        |
|  - products     (inventory items & stock)                   |
|  - orders       (transactions & delivery status)            |
+-------------------------------------------------------------+
```

---

## 2. Directory Structure

The project is structured into two root subdirectories (`/client` and `/server`), ensuring strict separation of concerns:

```text
mern-mini-ecommerce/
├── docs/                                  # Architectural & project documentation
│   ├── ARCHITECTURE.md                    # System architecture & structural overview
│   ├── DATABASE_MODELS.md                 # MongoDB schemas and relationship design
│   ├── API_SPECIFICATION.md               # REST API endpoints & contracts
│   ├── AUTHENTICATION_AND_SECURITY.md     # JWT, RBAC, and server validations
│   ├── FRONTEND_UI_UX.md                  # Layouts, Tailwind CSS rules, and component specs
│   ├── CHECKOUT_AND_ORDERS.md             # Checkout lifecycle & stock management
│   ├── DEMO_WALKTHROUGH.md                # 10-step demo script & test scenarios
│   └── PROJECT_ROADMAP.md                 # Phased implementation plan
│
├── client/                                # Frontend Application
│   ├── public/                            # Static assets
│   ├── src/
│   │   ├── assets/                        # SVG icons & logo
│   │   ├── components/                    # Reusable UI components
│   │   │   ├── common/                    # Navbar, Footer, Button, Input, Modal, Loader
│   │   │   ├── product/                   # ProductCard, ProductGrid, CategoryFilter
│   │   │   ├── cart/                      # CartItem, CartSummary
│   │   │   └── admin/                     # AdminSidebar, AdminHeader, StatusBadge
│   │   ├── context/                       # Global React Context
│   │   │   ├── AuthContext.jsx            # User state, login, logout, token
│   │   │   └── CartContext.jsx            # Cart items, persistent localStorage, counters
│   │   ├── pages/                         # Public storefront views
│   │   │   ├── Home.jsx                   # Hero & featured products
│   │   │   ├── Products.jsx               # Catalog with category filters & search
│   │   │   ├── ProductDetails.jsx         # Detailed item view & Add to Cart
│   │   │   ├── Cart.jsx                   # Cart review & quantity modification
│   │   │   ├── Checkout.jsx               # Shipping details & COD submission
│   │   │   ├── Login.jsx                  # Customer & Admin login form
│   │   │   ├── Register.jsx               # Customer registration form
│   │   │   └── MyOrders.jsx               # Customer order history
│   │   ├── pages/admin/                   # Admin dashboard views
│   │   │   ├── AdminDashboard.jsx         # Summary metrics & quick links
│   │   │   ├── AdminCategories.jsx        # Category CRUD list & modals
│   │   │   ├── AdminProducts.jsx          # Product CRUD list & modals
│   │   │   └── AdminOrders.jsx            # Order management & status update
│   │   ├── services/                      # Axios HTTP abstraction
│   │   │   ├── api.js                     # Base Axios instance with Bearer token interceptor
│   │   │   ├── authService.js             # Register, login endpoints
│   │   │   ├── categoryService.js         # Category endpoints
│   │   │   ├── productService.js          # Product endpoints
│   │   │   └── orderService.js            # Order & Admin order endpoints
│   │   ├── utils/                         # Helper utilities
│   │   │   ├── formatCurrency.js          # Currency formatting ($ or INR)
│   │   │   └── toast.js                   # Notification helpers
│   │   ├── App.jsx                        # Route definitions & Protected Route wrappers
│   │   ├── index.css                      # Tailwind CSS directives
│   │   └── main.jsx                       # Application entry point
│   ├── index.html
│   ├── tailwind.config.js                 # Tailwind design tokens
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                                # Backend Application
│   ├── config/
│   │   └── db.js                          # Mongoose connection configuration
│   ├── controllers/
│   │   ├── authController.js              # User registration, login, profile
│   │   ├── categoryController.js          # Category CRUD handlers
│   │   ├── productController.js           # Product search, filter, CRUD handlers
│   │   └── orderController.js             # Order placement, status updates, admin queries
│   ├── middleware/
│   │   ├── authMiddleware.js              # JWT verification (`protect`)
│   │   ├── adminMiddleware.js             # Role check (`adminOnly`)
│   │   └── errorHandler.js                # Centralized error handler
│   ├── models/
│   │   ├── User.js                        # User Mongoose schema
│   │   ├── Category.js                    # Category Mongoose schema
│   │   ├── Product.js                     # Product Mongoose schema
│   │   └── Order.js                       # Order Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js                  # /api/auth routes
│   │   ├── categoryRoutes.js              # /api/categories routes
│   │   ├── productRoutes.js               # /api/products routes
│   │   └── orderRoutes.js                 # /api/orders & /api/admin/orders routes
│   ├── utils/
│   │   └── generateToken.js               # JWT signing utility
│   ├── server.js                          # Express app configuration & server listen
│   ├── package.json
│   └── .env.example                       # Sample environment configuration
│
├── .gitignore
└── README.md
```

---

## 3. Core Subsystems & Request Lifecycle

### A. Client State Management Architecture
- **`AuthContext`**:
  - Manages `user` object (`_id`, `name`, `email`, `role`) and `token`.
  - Persists token and user info in browser `localStorage`.
  - Automatically loads authentication state on app boot.
  - Exposes `login()`, `register()`, and `logout()` methods.
- **`CartContext`**:
  - Manages `cartItems` array: `[{ product, quantity }]`.
  - Clamps quantities against `product.stock`.
  - Persists cart contents to `localStorage` across page reloads.
  - Exposes `addToCart(product, qty)`, `updateQuantity(productId, qty)`, `removeFromCart(productId)`, and `clearCart()`.

### B. Route Protection Architecture
1. **Public Routes**: Accessible by anyone (`/`, `/products`, `/products/:id`, `/cart`, `/login`, `/register`).
2. **Customer Protected Routes**: Requires active JWT token (`/checkout`, `/my-orders`).
3. **Admin Protected Routes**: Requires active JWT token AND `role === 'admin'` (`/admin`, `/admin/categories`, `/admin/products`, `/admin/orders`).

### C. Server-Side Security & Data Integrity Pipeline
1. **CORS & JSON parsing**: Requests pass through standard express middleware.
2. **JWT Authentication**: `protect` middleware decodes Bearer token, queries MongoDB for the user (excluding password hash), and attaches `req.user`.
3. **Role Validation**: `adminOnly` middleware inspects `req.user.role === 'admin'`. If false, returns `403 Forbidden`.
4. **Order Placement Pipeline**:
   - Customer submits items with IDs and desired quantities.
   - Server discards any price passed by the client.
   - For each item, server fetches the fresh record from the `Product` collection.
   - Verifies `product.stock >= item.quantity`.
   - Computes `item.price * item.quantity` using database values only.
   - Reduces stock directly in MongoDB (`product.stock -= item.quantity`).
   - Saves order with `status: 'Pending'`.
