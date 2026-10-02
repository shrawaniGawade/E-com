# Frontend UI & UX Specification

This document details the frontend user experience, layout designs, responsive grid structures, and Tailwind CSS design system for the **Mini E-Commerce Demo**.

---

## 1. Design System & Aesthetic Principles

* **Aesthetic**: Modern, clean, professional, and clutter-free.
* **Color Palette**:
  * **Primary**: Indigo (`indigo-600` for primary buttons, links, and accents; `indigo-700` for hover states).
  * **Neutrals**: Slate (`slate-900` for body text/headings, `slate-600` for muted subtext, `slate-100` / `slate-50` for page backgrounds, `slate-200` for borders).
  * **Status Colors**:
    * Success / Delivered: Emerald (`emerald-600`, bg `emerald-50`)
    * Warning / Pending: Amber (`amber-600`, bg `amber-50`)
    * Info / Shipped / Confirmed: Blue (`blue-600`, bg `blue-50`)
    * Danger / Cancelled / Delete: Rose (`rose-600`, bg `rose-50`)
* **Typography**: Clean sans-serif font stack (`Inter`, `system-ui`, `-apple-system`, `sans-serif`).
* **Radius & Elevation**:
  * Cards: `rounded-xl shadow-sm border border-slate-200 bg-white`
  * Buttons: `rounded-lg font-medium transition-colors duration-150`

---

## 2. Page Specifications (Public & Customer Views)

### 2.1 Navigation Bar (`Navbar.jsx`)
* **Left**: Brand logo ("ShopMini" / "MiniStore") linking to `/`.
* **Center**: Navigation links (`Home`, `Products`).
* **Right**:
  * **Search bar** (or search icon on mobile).
  * **Cart badge**: Cart icon with real-time numeric counter displaying total item quantity.
  * **Auth Controls**:
    * Unauthenticated: "Login" and "Register" buttons.
    * Authenticated Customer: User avatar/name dropdown with "My Orders" and "Logout".
    * Authenticated Admin: Direct link to "Admin Panel".
  * **Mobile Menu**: Responsive hamburger toggle for screen widths < 768px (`md`).

---

### 2.2 Home Page (`Home.jsx`)
* **Hero Banner**:
  * Clean modern banner with headline: *"Curated Essentials, Delivered to Your Doorstep"*.
  * Call-to-action button: *"Explore Products"* leading to `/products`.
* **Featured Categories Strip**: Quick-link category pills.
* **Featured Products Grid**: Showing the top 4–8 latest products.

---

### 2.3 Products Catalog Page (`Products.jsx`)
* **Search & Filter Header**:
  * Search input field with real-time or debounce query.
  * Category Pills Filter: `All | Electronics | Fashion | Shoes | ...` with active pill highlighted.
* **Responsive Product Grid**:
  * Mobile (< 640px): 1 column (`grid-cols-1`)
  * Tablet (640px – 1024px): 2–3 columns (`sm:grid-cols-2 md:grid-cols-3`)
  * Desktop (> 1024px): 4 columns (`lg:grid-cols-4`)
* **Product Card (`ProductCard.jsx`)**:
  * Aspect ratio-locked product image (`aspect-square object-cover rounded-t-xl`).
  * Category pill badge.
  * Product name (line-clamp-1).
  * Price formatted (e.g., `$149.99`).
  * Stock status: In Stock badge or "Out of Stock" disabled button.
  * Action: "Add to Cart" button.

---

### 2.4 Product Details Page (`ProductDetails.jsx`)
* **Layout**: Two-column layout on desktop (`md:grid-cols-2 gap-10`), single column on mobile.
* **Left**: High-resolution image card.
* **Right**:
  * Category badge.
  * Product title (`text-2xl font-bold text-slate-900`).
  * Price (`text-3xl font-extrabold text-indigo-600`).
  * Stock availability indicator (`In Stock: X available` or `Out of stock`).
  * Detailed description.
  * Quantity selector (clamped between 1 and available stock).
  * Primary "Add to Cart" button.

---

### 2.5 Shopping Cart Page (`Cart.jsx`)
* **Left / Main Column**: List of cart item rows:
  * Thumbnail image, title, and unit price.
  * Quantity stepper (`-` button, quantity number, `+` button). Quantity cannot exceed `stock`.
  * Subtotal per product item.
  * Remove button (trash icon).
* **Right / Sidebar Column**: Order Summary card:
  * Subtotal calculation.
  * Shipping calculation (Free / COD).
  * Total Price highlighted in bold.
  * "Proceed to Checkout" button.
* **Empty Cart State**: Friendly shopping bag illustration, "Your cart is empty" message, and "Start Shopping" button.

---

### 2.6 Checkout Page (`Checkout.jsx`)
* **Access**: Authenticated users only (redirects to `/login?redirect=checkout` if not logged in).
* **Delivery Information Form**:
  * Recipient Full Name (`required`)
  * Contact Phone Number (`required`)
  * Street Address (`required`)
  * City (`required`)
  * Postal / Pincode (`required`)
* **Payment Method Display**:
  * Fixed badge: **"Cash on Delivery (COD)"** with explanatory note ("Pay cash upon receiving your parcel").
* **Order Review Panel**:
  * Compact listing of cart items and total amount.
  * "Place Order" button with loading spinner state.

---

### 2.7 Customer Orders Page (`MyOrders.jsx`)
* Listing of customer's previous orders.
* Each order card displays:
  * Order ID & Purchase Date.
  * Status Badge (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).
  * Ordered items with quantity and unit price.
  * Total order price.
  * Shipping destination address.
* Empty state if customer has no placed orders yet.

---

## 3. Admin Panel Specifications

### 3.1 Admin Layout & Sidebar (`AdminSidebar.jsx`)
* **Persistent Left Sidebar** (desktop) / Collapsible Drawer (mobile):
  * Dashboard Overview (`/admin`)
  * Category Management (`/admin/categories`)
  * Product Inventory (`/admin/products`)
  * Customer Orders (`/admin/orders`)
  * "Back to Storefront" link.

---

### 3.2 Category Management (`AdminCategories.jsx`)
* **Action Bar**: "Add New Category" modal trigger.
* **Data Table**:
  * Name
  * Description
  * Actions (Edit button, Delete button).
* **Modals**:
  * Add / Edit Modal with Name and Description inputs.
  * **Delete Confirmation Dialog**: *"Are you sure you want to delete category [Name]? This cannot be undone."*

---

### 3.3 Product Inventory Management (`AdminProducts.jsx`)
* **Action Bar**: "Add New Product" modal trigger.
* **Data Table**:
  * Image thumbnail
  * Product Name
  * Category badge
  * Price
  * Available Stock
  * Actions (Edit button, Delete button).
* **Modals**:
  * Add / Edit Modal (Product Name, Description, Price, Image URL, Category Dropdown, Stock).
  * **Delete Confirmation Dialog**: Modal requiring explicit user confirmation before issuing `DELETE /api/products/:id`.

---

### 3.4 Admin Orders Management (`AdminOrders.jsx`)
* **Data Table**:
  * Order ID & Date
  * Customer Name & Email
  * Items summary
  * Total Amount
  * Current Status Badge
  * Status Updater Dropdown: Allows immediate selection of `Pending`, `Confirmed`, `Shipped`, `Delivered`, or `Cancelled`. Triggers `PATCH /api/admin/orders/:id/status`.

---

## 4. Feedback & Interactive Elements

* **Toast Notifications**: Lightweight toast messages for:
  * "Item added to cart"
  * "Order placed successfully"
  * "Product updated successfully"
  * Error alerts ("Invalid email or password", "Out of stock").
* **Loading States**:
  * Clean animated spinners for button clicks and data fetch states.
* **Empty States**:
  * Custom empty state illustrations/icons when no products match filters or search queries.
