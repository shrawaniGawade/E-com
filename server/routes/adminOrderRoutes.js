const express = require('express');
const router = express.Router();
const {
  getAdminOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', protect, adminOnly, getAdminOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
