// // // routes/report.routes.js
// // const express = require("express");
// // const router = express.Router();
// // const ReportController = require("../Controllers/ReportController");
// // const { authenticate, authorize } = require("../auth/middleware/auth");

// // // Apply authentication and authorization to all report routes
// // router.use(authenticate);
// // router.use(authorize(["manager"])); // Only managers can access reports

// // // Sales report endpoint
// // router.get("/sales", ReportController.getSalesReport);

// // // Inventory report endpoint
// // router.get("/inventory", ReportController.getInventoryReport);

// // // Prescription analysis report endpoint
// // router.get("/prescription", ReportController.getPrescriptionReport);

// // // Supplier performance report endpoint
// // router.get("/supplier", ReportController.getSupplierReport);

// // // Customer analysis report endpoint
// // router.get("/customer", ReportController.getCustomerReport);

// // // Export report to PDF endpoint
// // router.get("/:reportType/export", ReportController.exportReport);

// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const SalesReportController = require("../Controllers/SalesReportController");
// const InventoryReportController = require("../Controllers/InventoryReportController");
// const { authenticate, authorize } = require("../auth/middleware/auth");

// // Apply authentication middleware to all report routes
// router.use(authenticate);

// // Sales reports - restricted to manager role
// router.get(
//   "/sales",
//   authorize(["manager"]),
//   SalesReportController.getSalesReport
// );
// router.get(
//   "/sales/order/:orderId",
//   authorize(["manager"]),
//   SalesReportController.getOrderDetails
// );
// router.get(
//   "/sales/export-pdf",
//   authorize(["manager"]),
//   SalesReportController.exportSalesReportPDF
// );

// // Inventory reports - restricted to manager role
// router.get(
//   "/inventory",
//   authorize(["manager"]),
//   InventoryReportController.getInventoryReport
// );
// router.get(
//   "/inventory/reorder",
//   authorize(["manager"]),
//   InventoryReportController.getReorderList
// );
// router.get(
//   "/inventory/expiry",
//   authorize(["manager"]),
//   InventoryReportController.getExpiryReport
// );
// router.get(
//   "/inventory/stock-movement",
//   authorize(["manager"]),
//   InventoryReportController.getStockMovementReport
// );
// router.get(
//   "/inventory/export-pdf",
//   authorize(["manager"]),
//   InventoryReportController.exportInventoryReportPDF
// );

// module.exports = router;

// routes/report.routes.js
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
