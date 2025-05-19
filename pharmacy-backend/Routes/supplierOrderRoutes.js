// const express = require("express");
// const router = express.Router();
// const SupplierOrderController = require("../Controllers/SupplierOrderController");
// const { authenticate, authorize } = require("../auth/middleware/auth");

// // Apply authentication and authorization middleware to all routes
// // Only managers can access supplier order management
// router.use(authenticate, authorize(["manager"]));

// // Get all supplier orders
// router.get("/", SupplierOrderController.getAllOrders);

// // Get all products for search functionality
// router.get("/products", SupplierOrderController.getAllProducts);

// // Get specific order by ID
// router.get("/:id", SupplierOrderController.getOrderById);

// // Create new supplier order
// router.post("/", SupplierOrderController.createOrder);

// // Update existing supplier order
// router.put("/:id", SupplierOrderController.updateOrder);

// // Delete supplier order
// router.delete("/:id", SupplierOrderController.deleteOrder);

// module.exports = router;

const express = require("express");
const router = express.Router();
const SupplierOrderController = require("../Controllers/SupplierOrderController");
const { authenticate, authorize } = require("../auth/middleware/auth");

router.use(authenticate, authorize(["manager"]));

// Order routes
router.get("/", SupplierOrderController.getAllOrders);
router.get("/search-suppliers", SupplierOrderController.searchSuppliers);
router.get("/:id", SupplierOrderController.getOrderById);
router.post("/", SupplierOrderController.createOrder);
router.put("/:id", SupplierOrderController.updateOrder);
router.delete("/:id", SupplierOrderController.deleteOrder);

// Product routes
router.get("/products/all", SupplierOrderController.getAllProducts);

module.exports = router;
