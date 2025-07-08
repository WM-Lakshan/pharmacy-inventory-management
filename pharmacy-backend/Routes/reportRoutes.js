const express = require("express");
const router = express.Router();
const SalesReportController = require("../controllers/SalesReportController");
const InventoryReportController = require("../controllers/InventoryReportController");
const { authenticate, authorize } = require("../auth/middleware/auth");

// Apply authentication middleware to all report routes
router.use(authenticate);

// Sales reports - restricted to manager role
router.get(
  "/sales",
  authorize(["manager"]),
  SalesReportController.getSalesReport
);

router.get(
  "/sales/export-pdf",
  authorize(["manager"]),
  SalesReportController.exportSalesReportPDF
);

// Inventory reports - restricted to manager role
router.get(
  "/inventory",
  authorize(["manager"]),
  InventoryReportController.getInventoryReport
);

router.get(
  "/inventory/categories",
  authorize(["manager"]),
  InventoryReportController.getCategories
);

router.get(
  "/inventory/reorder",
  authorize(["manager"]),
  InventoryReportController.getReorderList
);

router.get(
  "/inventory/expiry",
  authorize(["manager"]),
  InventoryReportController.getExpiryReport
);

router.get(
  "/inventory/stock-movement",
  authorize(["manager"]),
  InventoryReportController.getStockMovementReport
);

router.get(
  "/inventory/export-pdf",
  authorize(["manager"]),
  InventoryReportController.exportInventoryReportPDF
);

module.exports = router;
