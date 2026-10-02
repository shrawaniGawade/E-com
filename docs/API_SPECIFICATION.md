# REST API Specification

This document provides the complete API specification for the **Mini E-Commerce Demo Backend**. All endpoints exchange data in JSON format with standard HTTP status codes.

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register Customer
* **Method & Path**: `POST /api/auth/register`
* **Access**: Public
* **Request Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
* **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "651a2b3c4d5e6f7a8b9c0d1e",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```
* **Error Responses**:
  * `400 Bad Request`: Validation failure (passwords do not match, email already exists, missing fields).

---

### 1.2 User & Admin Login
* **Method & Path**: `POST /api/auth/login`
* **Access**: Public
* **Request Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```
* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "651a2b3c4d5e6f7a8b9c0d1e",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```
* **Error Responses**:
  * `401 Unauthorized`: Invalid credentials.

---

## 2. Category Endpoints (`/api/categories`)

### 2.1 Get All Categories
* **Method & Path**: `GET /api/categories`
* **Access**: Public
* **Success Response (`200 OK`)**:
```json
[
  {
    "_id": "651c11112222333344445555",
    "name": "Electronics",
    "description": "Smartphones, laptops, and gadgets",
    "createdAt": "2026-10-02T08:00:00.000Z"
  }
]
```

### 2.2 Create Category
* **Method & Path**: `POST /api/categories`
* **Access**: Admin only (`Authorization: Bearer <token>`)
* **Request Body**:
```json
{
  "name": "Fashion",
  "description": "Apparel, accessories, and shoes"
}
```
* **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "data": {
    "_id": "651c11112222333344445556",
    "name": "Fashion",
    "description": "Apparel, accessories, and shoes",
    "createdAt": "2026-10-02T08:05:00.000Z"
  }
}
```
* **Error Responses**:
  * `400 Bad Request`: Category already exists or missing name.
  * `401 / 403`: Unauthorized or Forbidden (non-admin).

### 2.3 Update Category
* **Method & Path**: `PUT /api/categories/:id`
* **Access**: Admin only (`Authorization: Bearer <token>`)
* **Request Body**:
```json
{
  "name": "Fashion & Apparel",
  "description": "Trendy clothes and footwear"
}
```
* **Success Response (`200 OK`)**: Updated category object.

### 2.4 Delete Category
* **Method & Path**: `DELETE /api/categories/:id`
* **Access**: Admin only (`Authorization: Bearer <token>`)
* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 3. Product Endpoints (`/api/products`)

### 3.1 Get All Products (with Search & Category Filtering)
* **Method & Path**: `GET /api/products`
* **Access**: Public
* **Query Parameters**:
  * `category` (optional): Category ID or Category slug/name
  * `search` (optional): Keyword matched against product name or description
* **Example Request**:
  `GET /api/products?category=651c11112222333344445555&search=wireless`
* **Success Response (`200 OK`)**:
```json
[
  {
    "_id": "651d99998888777766665555",
    "name": "Wireless Noise Cancelling Headphones",
    "description": "Premium over-ear Bluetooth headphones with active noise cancellation.",
    "price": 149.99,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    "category": {
      "_id": "651c11112222333344445555",
      "name": "Electronics"
    },
    "stock": 18,
    "createdAt": "2026-10-02T08:10:00.000Z"
  }
]
```

### 3.2 Get Single Product by ID
* **Method & Path**: `GET /api/products/:id`
* **Access**: Public
* **Success Response (`200 OK`)**: Single product object with populated category.
* **Error Responses**: `404 Not Found` if product does not exist.

### 3.3 Create Product
* **Method & Path**: `POST /api/products`
* **Access**: Admin only (`Authorization: Bearer <token>`)
* **Request Body**:
```json
{
  "name": "Running Sneakers",
  "description": "Lightweight breathable athletic shoes.",
  "price": 79.99,
  "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  "category": "651c11112222333344445556",
  "stock": 25
}
```
* **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "data": { ... }
}
```

### 3.4 Update Product
* **Method & Path**: `PUT /api/products/:id`
* **Access**: Admin only (`Authorization: Bearer <token>`)
* **Request Body**: Fields to update (e.g. `price`, `stock`, `name`).
* **Success Response (`200 OK`)**: Updated product object.

### 3.5 Delete Product
* **Method & Path**: `DELETE /api/products/:id`
* **Access**: Admin only (`Authorization: Bearer <token>`)
* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Product removed successfully"
}
```

---

## 4. Order Endpoints (`/api/orders` & `/api/admin/orders`)

### 4.1 Place Order (Checkout)
* **Method & Path**: `POST /api/orders`
* **Access**: Customer (`Authorization: Bearer <token>`)
* **Security Rule**: The server calculates total amount directly from MongoDB `Product.price`. Any client-supplied price is disregarded.
* **Request Body**:
```json
{
  "items": [
    {
      "productId": "651d99998888777766665555",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "Jane Doe",
    "phone": "+1-555-0199",
    "address": "452 Elm Street, Suite 3B",
    "city": "Metropolis",
    "pincode": "10001"
  }
}
```
* **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "_id": "651e77778888999900001111",
    "user": "651a2b3c4d5e6f7a8b9c0d1e",
    "products": [
      {
        "product": "651d99998888777766665555",
        "name": "Wireless Noise Cancelling Headphones",
        "price": 149.99,
        "quantity": 2
      }
    ],
    "totalAmount": 299.98,
    "shippingAddress": {
      "name": "Jane Doe",
      "phone": "+1-555-0199",
      "address": "452 Elm Street, Suite 3B",
      "city": "Metropolis",
      "pincode": "10001"
    },
    "status": "Pending",
    "createdAt": "2026-10-02T08:30:00.000Z"
  }
}
```
* **Error Responses**:
  * `400 Bad Request`: "Insufficient stock for product [Name]" or invalid fields.

### 4.2 Get Customer's Orders
* **Method & Path**: `GET /api/orders/my-orders`
* **Access**: Customer (`Authorization: Bearer <token>`)
* **Success Response (`200 OK`)**: Array of orders belonging to the logged-in customer sorted by `createdAt` descending.

### 4.3 Get All Orders (Admin)
* **Method & Path**: `GET /api/admin/orders`
* **Access**: Admin only (`Authorization: Bearer <token>`)
* **Success Response (`200 OK`)**: Array of all customer orders, populated with user info (`name`, `email`).

### 4.4 Update Order Status (Admin)
* **Method & Path**: `PATCH /api/admin/orders/:id/status`
* **Access**: Admin only (`Authorization: Bearer <token>`)
* **Request Body**:
```json
{
  "status": "Shipped"
}
```
* **Valid Status Values**: `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`
* **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Order status updated to Shipped",
  "order": {
    "_id": "651e77778888999900001111",
    "status": "Shipped"
  }
}
```
