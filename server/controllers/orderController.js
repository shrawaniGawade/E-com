const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order (Checkout with Cash on Delivery)
// @route   POST /api/orders
// @access  Protected (Customer)
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    // Validate cart items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all shipping address fields: name, phone, address, city, and pincode'
      });
    }

    const orderProducts = [];
    let calculatedTotal = 0;

    // SECURITY CRITICAL: Validate stock and fetch verified prices from MongoDB directly
    for (const item of items) {
      const productId = item.productId || item._id;
      const quantity = Number(item.quantity);

      if (!productId || isNaN(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item quantity or product identifier'
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} was not found`
        });
      }

      // Check stock availability
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${quantity}`
        });
      }

      // Use DB price exclusively (ignore any client-passed price)
      const itemPrice = product.price;
      calculatedTotal += itemPrice * quantity;

      orderProducts.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity
      });
    }

    // Round total to 2 decimal places
    calculatedTotal = Math.round(calculatedTotal * 100) / 100;

    // Create Order record
    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      totalAmount: calculatedTotal,
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        pincode: shippingAddress.pincode.trim()
      },
      paymentMethod: 'Cash on Delivery',
      status: 'Pending'
    });

    // Atomically decrement stock in database
    for (const item of orderProducts) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully with Cash on Delivery',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Protected (Customer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customer orders
// @route   GET /api/admin/orders
// @access  Admin Only
const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Admin Only
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed values: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAdminOrders,
  updateOrderStatus
};
