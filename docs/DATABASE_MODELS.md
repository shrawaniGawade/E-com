# Database Models & Schema Design

This document defines the complete MongoDB database schemas using **Mongoose ODM**. Exactly four models are implemented: **User**, **Category**, **Product**, and **Order**.

---

## 1. Entity Relationship Diagram (ERD)

```text
+-----------------------+              +-----------------------+
|        User           |              |       Category        |
+-----------------------+              +-----------------------+
| _id: ObjectId         |              | _id: ObjectId         |
| name: String          |              | name: String (Unique) |
| email: String(Unique) |              | description: String   |
| password: String(Hash)|              | timestamps: true      |
| role: String (enum)   |              +-----------+-----------+
| timestamps: true      |                          |
+-----------+-----------+                          |
            |                                      | 1:N
            | 1:N                                  |
            |                                      v
            |                          +-----------------------+
            |                          |        Product        |
            |                          +-----------------------+
            |                          | _id: ObjectId         |
            |                          | name: String          |
            |                          | description: String   |
            |                          | price: Number (> 0)   |
            |                          | image: String (URL)   |
            |                          | category: ObjectId    |
            |                          | stock: Number (>= 0)  |
            |                          | timestamps: true      |
            v                          +-----------+-----------+
+-----------------------+                          |
|         Order         |                          |
+-----------------------+                          |
| _id: ObjectId         |                          |
| user: ObjectId (Ref)  |<-------------------------+ (Embedded order products snapshot)
| products: [           |
|   {                   |
|     product: ObjectId,|
|     name: String,     |
|     price: Number,    |
|     quantity: Number  |
|   }                   |
| ]                     |
| totalAmount: Number   |
| shippingAddress: {    |
|   name: String,       |
|   phone: String,      |
|   address: String,    |
|   city: String,       |
|   pincode: String     |
| }                     |
| status: String (enum) |
| createdAt: Date       |
+-----------------------+
```

---

## 2. Model 1: User Schema (`server/models/User.js`)

Manages accounts for both standard customers and administrators.

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please enter your email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook: Hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: Validate incoming password against stored bcrypt hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

## 3. Model 2: Category Schema (`server/models/Category.js`)

Organizes products into browsable departments (e.g., Electronics, Fashion, Shoes).

```javascript
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Category', categorySchema);
```

---

## 4. Model 3: Product Schema (`server/models/Product.js`)

Represents catalog items with inventory count and category linkage.

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0.01, 'Price must be greater than zero']
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required']
    },
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound index for fast text search and filtering
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
```

---

## 5. Model 4: Order Schema (`server/models/Order.js`)

Stores finalized checkout transactions, containing customer info, snapshot of items at purchase time, shipping address, and tracking status.

```javascript
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    }
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: {
      type: [orderItemSchema],
      required: true,
      validate: [v => Array.isArray(v) && v.length > 0, 'Order must contain at least one item']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery'
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
```

---

## 6. Critical Model Validation Rules

| Rule | Enforcement Location | Explanation |
| :--- | :--- | :--- |
| **Unique Email** | `User.email` index | Prevents duplicate customer accounts |
| **Password Min Length** | `User.password` minlength (6) | Basic security defense against weak credentials |
| **Price > 0** | `Product.price` min (0.01) | Prevents free or negative cost products |
| **Stock >= 0** | `Product.stock` min (0) | Prevents overselling products |
| **Server-Verified Price** | `Order.products.price` | Filled strictly by querying `Product` in database |
| **Order Status Enum** | `Order.status` enum list | Restricts lifecycle to 5 valid states |
