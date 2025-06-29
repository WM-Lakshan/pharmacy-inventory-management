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
