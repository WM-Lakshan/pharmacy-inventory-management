// // routes/staff/orderRoutes.js
// const express = require("express");
// const router = express.Router();
// const OrderController = require("../../Controllers/staff/orderController");
// const { authenticate, authorize } = require("../../auth/middleware/auth");

// // Apply authentication and authorization middleware to all routes
// router.use(authenticate, authorize(["staff"]));

// // Get all orders
// router.get("/orders", OrderController.getAllOrders);

// // Get order by ID
// router.get("/orders/:id", OrderController.getOrderById);

// // Get products in an order
// router.get("/orders/:id/products", OrderController.getOrderProducts);

// // Update order status
// router.put("/orders/:id/status", OrderController.updateOrderStatus);

// module.exports = router;

///////////////////////////working///////////////////////////

const express = require("express");
const router = express.Router();
const OrderController = require("../../Controllers/staff/orderController");
const { authenticate, authorize } = require("../../auth/middleware/auth");

// Apply authentication and authorization middleware to all routes
router.use(authenticate, authorize(["staff"]));

// Get all orders
router.get("/orders", OrderController.getAllOrders);

// Get order by ID
router.get("/orders/:id", OrderController.getOrderById);

// Get products in an order
router.get("/orders/:id/products", OrderController.getOrderProducts);

// Update order status
router.put("/orders/:id/status", OrderController.updateOrderStatus);

// NEW: Delete payment record for an order
router.delete("/payments/:orderId", OrderController.deletePaymentRecord);

module.exports = router;
