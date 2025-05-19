const express = require("express");
const router = express.Router();
const SalesController = require("../Controllers/SalesController");
const { authenticate, authorize } = require("../auth/middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all sales - accessible by managers
router.get("/", authorize(["manager"]), SalesController.getAllSales);

// Get all products for search functionality - accessible by managers
router.get("/products", authorize(["manager"]), SalesController.getAllProducts);

// Get specific sale by ID - accessible by managers
router.get("/:id", authorize(["manager"]), SalesController.getSaleById);

// Update existing sale - accessible by managers
router.put("/:id", authorize(["manager"]), SalesController.updateSale);

// Delete sale - accessible by managers
router.delete("/:id", authorize(["manager"]), SalesController.deleteSale);

module.exports = router;
