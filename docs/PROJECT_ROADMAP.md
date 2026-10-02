# Project Implementation Roadmap & Checklist

This document lays out the phased implementation plan and verification checklist for building the **MERN Mini E-Commerce Demo Project**.

---

## 1. Phased Development Roadmap

### Phase 1: Environment & Project Scaffolding
- [ ] Initialize repository structure (`/client` and `/server`).
- [ ] Setup `.gitignore` to protect sensitive files and node dependencies.
- [ ] Configure `server/package.json` with dependencies: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`.
- [ ] Configure `client` using Vite + React (`npx create-vite@latest client --template react`).
- [ ] Install and configure Tailwind CSS in `client`.

---

### Phase 2: Database Models & Connections
- [ ] Create `server/config/db.js` using Mongoose connection logic.
- [ ] Implement `User` model with email regex, unique index, and bcrypt password hashing hooks.
- [ ] Implement `Category` model with unique name constraint.
- [ ] Implement `Product` model with positive price check, stock validation, and category reference.
- [ ] Implement `Order` model with user reference, embedded item snapshots, shipping subschema, and status enum (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).

---

### Phase 3: Backend Authentication & Middleware
- [ ] Implement JWT token generation utility (`server/utils/generateToken.js`).
- [ ] Build `authMiddleware.js` (`protect` function verifying Bearer JWT and loading user).
- [ ] Build `adminMiddleware.js` (`adminOnly` function validating `role === 'admin'`).
- [ ] Implement `server/controllers/authController.js` for registration and login.
- [ ] Connect auth routes (`/api/auth/register`, `/api/auth/login`).

---

### Phase 4: Backend Catalog & Inventory APIs
- [ ] Category Controller & Routes:
  - `GET /api/categories` (Public)
  - `POST /api/categories` (Admin)
  - `PUT /api/categories/:id` (Admin)
  - `DELETE /api/categories/:id` (Admin)
- [ ] Product Controller & Routes:
  - `GET /api/products` (Public, with `?category=` and `?search=` filters)
  - `GET /api/products/:id` (Public)
  - `POST /api/products` (Admin)
  - `PUT /api/products/:id` (Admin)
  - `DELETE /api/products/:id` (Admin)

---

### Phase 5: Backend Order Processing & Stock APIs
- [ ] Order Controller & Routes:
  - `POST /api/orders` (Customer, verifies database prices & stock, decrements stock atomically, sets status `Pending`)
  - `GET /api/orders/my-orders` (Customer, returns user's orders)
  - `GET /api/admin/orders` (Admin, returns all orders with customer details)
  - `PATCH /api/admin/orders/:id/status` (Admin, updates status)

---

### Phase 6: Frontend State & Network Layer
- [ ] Configure Axios base instance with request interceptor for `Authorization: Bearer <token>`.
- [ ] Build `AuthContext`:
  - Login / Register / Logout handlers.
  - Persistent token and user data in `localStorage`.
- [ ] Build `CartContext`:
  - `cartItems` state synced with `localStorage`.
  - Add item, update quantity (clamped to product stock), remove item, clear cart.
  - Compute subtotal and total item count.

---

### Phase 7: Storefront UI Implementation
- [ ] Navigation header (`Navbar.jsx`) with dynamic links, category navigation, cart badge, and auth dropdown.
- [ ] Home Page (`Home.jsx`) with hero banner, category pills, and featured products.
- [ ] Catalog Page (`Products.jsx`) with category pill filters, real-time search, and responsive grid.
- [ ] Product Card (`ProductCard.jsx`) with price, stock badge, and Add to Cart action.
- [ ] Product Details Page (`ProductDetails.jsx`) with full description, quantity selector, and stock status.
- [ ] Shopping Cart Page (`Cart.jsx`) with item rows, quantity stepper, subtotal summary, and checkout trigger.
- [ ] Checkout Page (`Checkout.jsx`) with 5-field shipping form, COD badge, and Place Order submission.
- [ ] Customer Order History (`MyOrders.jsx`) with order tracking cards and status badges.

---

### Phase 8: Admin Panel Implementation
- [ ] Admin Layout with responsive sidebar navigation (`AdminSidebar.jsx`).
- [ ] Admin Dashboard summary overview (`AdminDashboard.jsx`).
- [ ] Category Management (`AdminCategories.jsx`) with table, create modal, edit modal, and delete confirmation dialog.
- [ ] Product Management (`AdminProducts.jsx`) with table, create/edit modal with category dropdown and image URL, and delete confirmation dialog.
- [ ] Order Management (`AdminOrders.jsx`) with comprehensive order table, shipping details viewer, and inline status dropdown updater.

---

### Phase 9: Testing & Verification Checklist
- [ ] Verify invalid login credentials return `401 Unauthorized`.
- [ ] Verify customer cannot access `/admin/*` routes or admin API endpoints.
- [ ] Verify modifying price in API payload does NOT affect order total (server DB price lookup).
- [ ] Verify purchasing items decrements product stock in MongoDB.
- [ ] Verify placing an order exceeding available stock fails with informative error.
- [ ] Verify cart is emptied upon successful order creation.
- [ ] Verify updating status in admin panel reflects in customer's "My Orders" view.

---

### Phase 10: Clean-up & Documentation
- [ ] Ensure all environment variables are documented in `.env.example`.
- [ ] Validate project clean build and linting checks.
- [ ] Finalize README and documentation links.
