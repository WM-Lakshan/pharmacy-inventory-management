// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { authenticate, authorize } = require("../auth/middleware/auth");

// Protected routes that require authentication
// router.use(authenticate, authorize(["manager"]));

/**
 * Dashboard routes
 * All routes are protected with authentication middleware
 */

// Base route is /api/dashboard

// Get overview metrics (sales count, purchase count, etc.)
router.get("/overview", dashboardController.getOverview);

// Get inventory summary (quantity in hand, to be received)
router.get("/inventory", dashboardController.getInventorySummary);

// Get sales and purchase data for charts
router.get("/sales-data", dashboardController.getSalesData);

// Get top selling products
router.get("/top-selling", dashboardController.getTopSellingProducts);

// Get products that are near expiry
router.get("/expired-products", dashboardController.getExpiredProducts);

// Get products with low stock
router.get("/low-stock", dashboardController.getLowStockProducts);

module.exports = router;
