# Authentication & Security Architecture

This document describes the security protocols, authentication mechanisms, authorization middleware, and data validation rules implemented in the project.

---

## 1. Authentication Lifecycle

```text
[Client]                                                [Server]
   │                                                       │
   ├─── 1. POST /api/auth/register or /api/auth/login ────▶│
   │    { email, password }                                │ 2. Validate email & bcrypt.compare
   │                                                       │ 3. Sign JWT: { id, role }
   │◀── 4. Returns JSON: { token, user: { name, role } } ──┤
   │                                                       │
   ├─── 5. Store token in localStorage                     │
   │                                                       │
   ├─── 6. Authenticated Request (e.g. POST /api/orders) ──▶│
   │    Header: Authorization: Bearer <token>              │ 7. authMiddleware: jwt.verify()
   │                                                       │ 8. Fetch User doc (minus password)
   │                                                       │ 9. Attach req.user & continue
   │◀── 10. Execute Controller Logic & Return Result ──────┤
```

---

## 2. Token Generation & JWT Configuration

Tokens are generated on the server using `jsonwebtoken`:
- **Payload**: `{ id: user._id, role: user.role }`
- **Signing Algorithm**: HMAC SHA256 (`HS256`)
- **Secret**: Read securely from `process.env.JWT_SECRET`
- **Expiration**: 7 days (`expiresIn: '7d'`)

```javascript
// server/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

module.exports = generateToken;
```

---

## 3. Password Hashing with Bcrypt

Passwords are never stored in plaintext. They are hashed using `bcryptjs` with a cost factor (salt rounds) of 10.

* **Registration**:
  - Pre-save hook generates salt: `bcrypt.genSalt(10)`
  - Replaces plain password with hash: `bcrypt.hash(password, salt)`
* **Login Verification**:
  - Compares plain candidate password against hashed DB string:
    `await bcrypt.compare(candidatePassword, user.password)`

---

## 4. Role-Based Access Control (RBAC) Middleware

### 4.1 Authentication Middleware (`protect`)
Verifies Bearer token in the `Authorization` header, extracts user ID, and checks existence in database:

```javascript
// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User account not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
```

### 4.2 Admin Authorization Middleware (`adminOnly`)
Enforces admin privileges for protected endpoints (creating products, categories, modifying orders):

```javascript
// server/middleware/adminMiddleware.js
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

module.exports = { adminOnly };
```

---

## 5. Defense Against Common Vulnerabilities

### 5.1 Price Tampering Prevention (Critical Requirement)
* **Threat**: Malicious clients modifying the `price` property in the checkout payload (e.g. changing $499 to $0.01).
* **Mitigation**:
  1. Client sends only `{ productId, quantity }`.
  2. Server iterates through items and queries the database:
     ```javascript
     const product = await Product.findById(item.productId);
     if (!product) throw new Error('Product not found');
     ```
  3. Server computes line item and total amount using `product.price` retrieved directly from MongoDB.

### 5.2 Stock Depletion & Race Condition Safeguard
* **Threat**: Two customers purchasing the last remaining unit concurrently, leading to negative inventory.
* **Mitigation**:
  1. Verify stock before deduction:
     ```javascript
     if (product.stock < item.quantity) {
       return res.status(400).json({
         message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
       });
     }
     ```
  2. Use atomic decrement with boundary check:
     ```javascript
     await Product.findOneAndUpdate(
       { _id: item.productId, stock: { $gte: item.quantity } },
       { $inc: { stock: -item.quantity } }
     );
     ```

### 5.3 Input Sanitization & Data Validation Matrix

| Field | Client Validation | Server Validation |
| :--- | :--- | :--- |
| **Email** | HTML5 email type + regex pattern | Regex match in Mongoose schema + unique index |
| **Password** | Min 6 characters, Confirm Password match | Minlength 6 validation in schema |
| **Product Price** | Step 0.01, number > 0 | Schema `min: 0.01` validation |
| **Product Stock** | Integer, min 0 | Schema `min: 0` validation |
| **Category** | Dropdown selection from active categories | Valid ObjectId reference check |
| **Shipping Address** | All 5 fields required (name, phone, address, city, pincode) | Subschema with required flags for all 5 fields |
