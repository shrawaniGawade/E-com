# End-to-End Demo Walkthrough Guide

This document provides a step-by-step execution script for running and validating the entire **Mini E-Commerce Demo Project**.

---

## 1. Demo Credentials & Seed Data

### Default Admin Account
* **Email**: `admin@shopmini.com`
* **Password**: `admin123`
* **Role**: `admin`

### Sample Categories to Add
1. **Electronics**: "Cutting-edge smartphones, audio devices, and computer peripherals."
2. **Fashion**: "Modern designer apparel, jackets, and accessories."
3. **Shoes**: "Athletic footwear, casual sneakers, and leather boots."

### Sample Products to Add
1. **Wireless Noise Cancelling Headphones**
   - Category: `Electronics`
   - Price: `$149.99`
   - Stock: `20`
   - Image: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80`
   - Description: `Over-ear wireless headphones with active noise cancellation and 30-hour battery life.`

2. **Ultra-Slim Smartwatch**
   - Category: `Electronics`
   - Price: `$199.99`
   - Stock: `15`
   - Image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80`
   - Description: `Sleek fitness and health tracking smartwatch with OLED touchscreen and water resistance.`

3. **Classic Denim Jacket**
   - Category: `Fashion`
   - Price: `$69.99`
   - Stock: `30`
   - Image: `https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80`
   - Description: `Timeless rugged denim jacket crafted from 100% premium durable cotton.`

4. **Pro Performance Running Shoes**
   - Category: `Shoes`
   - Price: `$89.99`
   - Stock: `12`
   - Image: `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80`
   - Description: `High-cushion responsive running sneakers designed for marathon and daily training.`

---

## 2. 10-Step Interactive Demo Walkthrough

### Step 1: Admin Login
1. Navigate to `/login`.
2. Enter email `admin@shopmini.com` and password `admin123`.
3. Click **Login**.
4. **Verification**: User is redirected to `/admin` dashboard; the top navbar displays the Admin badge and admin navigation options.

---

### Step 2: Add Categories
1. In the Admin Panel, select **Categories** (`/admin/categories`).
2. Click **+ Add Category**.
3. Create the three categories: `Electronics`, `Fashion`, and `Shoes`.
4. **Verification**: All three categories display in the table with instant edit and delete controls.

---

### Step 3: Add Products
1. In the Admin Panel, select **Products** (`/admin/products`).
2. Click **+ Add Product**.
3. Fill in product name, price, stock, image URL, select a category from the dropdown, and enter description.
4. Submit the form. Repeat for sample products.
5. **Verification**: Products appear in the table with correct stock quantities and category badges.

---

### Step 4: Verify Product Appearance on Website
1. Click **Back to Store** or navigate to `/` and `/products`.
2. **Verification**: Newly added products appear dynamically in the responsive grid with correct images, titles, badges, and prices.

---

### Step 5: Customer Registration & Login
1. Click **Logout** from admin session.
2. Navigate to `/register`.
3. Register a new customer:
   - Name: `Jane Doe`
   - Email: `jane@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Submit form.
5. **Verification**: Customer is automatically logged in and greeted in the navbar as "Jane Doe".

---

### Step 6: Browse & Filter Catalog
1. On the `/products` page, click category filter pills:
   - Click `Electronics` -> Only headphones and smartwatch are shown.
   - Click `Shoes` -> Only running sneakers are shown.
   - Click `All` -> All catalog items return.
2. Type `Running` into the search bar.
3. **Verification**: Results filter in real-time to show only matching products.

---

### Step 7: Add to Shopping Cart
1. Open the **Pro Performance Running Shoes** details page (`/products/:id`).
2. Inspect product details, verify stock is `12`.
3. Select quantity: `2`.
4. Click **Add to Cart**.
5. **Verification**: Success toast appears ("Added 2 items to cart"), and the cart icon counter in the navbar increments to `2`.

---

### Step 8: View Cart & Proceed to Checkout
1. Click the Cart icon in the navbar (`/cart`).
2. Inspect line items: unit price `$89.99`, quantity `2`, subtotal `$179.98`.
3. Try increasing quantity past `12` -> Button disables when reaching max stock.
4. Click **Proceed to Checkout**.
5. **Verification**: Customer is taken to `/checkout`.

---

### Step 9: Place Order (Cash on Delivery)
1. Fill in Shipping Details:
   - Name: `Jane Doe`
   - Phone: `+1-555-0199`
   - Address: `452 Elm Street, Apt 3B`
   - City: `Metropolis`
   - Pincode: `10001`
2. Confirm payment method is fixed to **Cash on Delivery**.
3. Click **Place Order**.
4. **Verification**:
   - Order is saved in MongoDB.
   - Product stock in MongoDB drops from `12` to `10`.
   - Cart is automatically cleared.
   - User is redirected to `/my-orders` showing Order ID, items, and status `Pending`.

---

### Step 10: Admin Order Processing
1. Log out and log back in as `admin@shopmini.com`.
2. Go to **Admin Orders** (`/admin/orders`).
3. Locate Jane Doe's order.
4. Review customer shipping details, items purchased, and total.
5. In the status dropdown, change status from `Pending` -> `Confirmed` -> `Shipped`.
6. **Verification**: Status badge updates immediately. When Jane logs in and views `/my-orders`, she sees the updated status `Shipped`.
