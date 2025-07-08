
const express = require("express");
const router = express.Router();
const customerOrderController = require("../../Controllers/customer/orderHistory.controller");
const { authenticate, authorize } = require("../../auth/middleware/auth");

router.use(authenticate);
router.use(authorize(["customer"]));

// Get all orders for the current customer
router.get("/orders", customerOrderController.getCustomerOrders);

// Get a specific order by ID (with authorization check)
router.get("/orders/:id", customerOrderController.getOrderById);

// Get products for a specific order
router.get("/orders/:id/products", customerOrderController.getOrderProducts);

module.exports = router;
