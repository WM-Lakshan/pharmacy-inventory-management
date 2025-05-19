// routes/staff-inventory.routes.js
const express = require("express");
const router = express.Router();
const InventoryController = require("../../Controllers/staff/inventoryController");
const { authenticate, authorize } = require("../../auth/middleware/auth");

// This route file is specifically for staff API endpoints
// All routes require authentication
router.use(authenticate);
router.use(authorize(["staff"]));

// GET all products with filtering options
router.get("/", InventoryController.getAllProducts);

// GET product details by ID
router.get("/:id", InventoryController.getProductById);

// GET product categories
router.get("/categories/all", InventoryController.getCategories);

// GET dashboard data (low stock and expiring products)
router.get("/dashboard/summary", InventoryController.getDashboardData);

// GET low stock products
router.get("/alerts/low-stock", InventoryController.getLowStockProducts);

// GET expiring products
router.get("/alerts/expiring", InventoryController.getExpiringProducts);

module.exports = router;
