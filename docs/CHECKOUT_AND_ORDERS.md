# Checkout & Order Processing Lifecycle

This document provides a comprehensive breakdown of the checkout flow, Cash on Delivery (COD) payment mechanics, server-side stock verification, and order state transitions.

---

## 1. End-to-End Checkout Sequence

```text
[User clicks "Place Order"]
             │
             ▼
[1. Frontend Form Validation]
- Verify Name, Phone, Address, City, Pincode are non-empty
- Ensure Cart has at least 1 item
             │
             ▼
[2. POST /api/orders Request Sent]
Payload contains:
- `items`: [{ productId, quantity }]
- `shippingAddress`: { name, phone, address, city, pincode }
*(Notice: NO price data is accepted from frontend)*
             │
             ▼
[3. Server Authentication Verification]
- Verify customer JWT token via `protect` middleware
- Extract `req.user._id`
             │
             ▼
[4. Server Stock & Price Verification]
For each item in `items`:
  a. Fetch fresh product document from MongoDB: `Product.findById(item.productId)`
  b. Check if product exists (if not, return 404)
  c. Verify available stock:
     `if (product.stock < item.quantity) -> Return 400 "Insufficient stock"`
  d. Read trusted price from database: `const unitPrice = product.price`
  e. Accumulate total: `totalAmount += unitPrice * item.quantity`
             │
             ▼
[5. Create & Save Order Document]
- User ID: `req.user._id`
- Products array: snapshot with product ref, name, verified unit price, quantity
- Total Amount: accumulated server-computed total
- Shipping Address: validated recipient details
- Payment Method: "Cash on Delivery"
- Status: "Pending"
             │
             ▼
[6. Atomically Decrement Inventory Stock]
For each item:
  `await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })`
             │
             ▼
[7. Return Success Response (201 Created)]
Response payload returns newly created `order` object
             │
             ▼
[8. Frontend Post-Order Actions]
- Clear cart in `CartContext` and purge `localStorage`
- Display success toast: "Order placed successfully!"
- Redirect customer to `/my-orders` page
```

---

## 2. Order Status Lifecycle & Allowed Transitions

Admin staff can manage customer orders through five distinct statuses:

```text
       +-----------------------------------------+
       |                                         |
       v                                         |
  [ Pending ] ───▶ [ Confirmed ] ───▶ [ Shipped ] ───▶ [ Delivered ]
       │                 │                 │
       │                 │                 │
       +-----------------+-----------------+───▶ [ Cancelled ]
```

### Status Descriptions:
1. **`Pending`**: Default state upon order creation. Awaiting admin review and dispatch preparation.
2. **`Confirmed`**: Admin has verified order details and confirmed stock availability.
3. **`Shipped`**: Package has been handed over to courier for delivery.
4. **`Delivered`**: Order has reached customer and Cash on Delivery payment has been collected.
5. **`Cancelled`**: Order has been voided by admin.

---

## 3. Shipping Address Schema Requirements

The checkout form mandates five essential contact and delivery fields:

```javascript
{
  "name": "Jane Doe",                 // Recipient full name
  "phone": "+1-555-0199",             // Contact phone number for delivery driver
  "address": "452 Elm Street, Apt 3B", // Detailed street address
  "city": "Metropolis",               // City / Town
  "pincode": "10001"                  // Postal / ZIP code
}
```

---

## 4. Edge Cases & Error Handling

1. **Stock Depletion During Checkout**:
   If user A and user B have the same last item in their cart, the first request to reach the server succeeds. The second request encounters `product.stock < item.quantity` and receives:
   ```json
   {
     "success": false,
     "message": "Insufficient stock for Wireless Noise Cancelling Headphones. Only 0 remaining."
   }
   ```
   The client alerts the user with a notification toast and prompts them to adjust their cart.

2. **Price Modification Prevention**:
   Even if an attacker intercepts the network request and alters prices to `$0.00`, the server ignores incoming price fields and calculates charges exclusively using the database product record.

3. **Cart Persistence Across Refresh**:
   Items stored in cart remain safe in `localStorage` until the order is successfully confirmed by the server, preventing loss of shopping state if network glitches occur before checkout.
