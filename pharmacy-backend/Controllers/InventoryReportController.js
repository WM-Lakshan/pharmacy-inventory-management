// const InventoryReportModel = require("../Models/InventoryReportModel");
// const PDFDocument = require("pdfkit");
// const path = require("path");
// const fs = require("fs");

// class InventoryReportController {
//   /**
//    * Get inventory report data
//    */
//   static async getInventoryReport(req, res) {
//     try {
//       const {
//         category,
//         lowStock,
//         expiringSoon,
//         expired,
//         sortBy = "product_id",
//         sortOrder = "ASC",
//       } = req.query;

//       // Get manager ID from authenticated user
//       const managerId = req.user?.manager_id;

//       if (!managerId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access restricted to managers",
//         });
//       }

//       // Prepare filters
//       const filters = {
//         category,
//         lowStock: lowStock === "true",
//         expiringSoon: expiringSoon === "true",
//         expired: expired === "true",
//         sortBy,
//         sortOrder: sortOrder === "DESC" ? "DESC" : "ASC",
//         managerId,
//         includeSummary: true,
//       };

//       // Get inventory report data
//       const reportData = await InventoryReportModel.getInventoryReport(filters);

//       res.status(200).json({
//         success: true,
//         products: reportData.products,
//         summary: reportData.summary,
//       });
//     } catch (error) {
//       console.error("Error generating inventory report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to generate inventory report",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get reorder list
//    */
//   static async getReorderList(req, res) {
//     try {
//       // Get manager ID from authenticated user
//       const managerId = req.user?.manager_id;

//       if (!managerId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access restricted to managers",
//         });
//       }

//       const reorderList = await InventoryReportModel.getReorderList();

//       res.status(200).json({
//         success: true,
//         reorderList,
//       });
//     } catch (error) {
//       console.error("Error getting reorder list:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get reorder list",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get expiry report
//    */
//   static async getExpiryReport(req, res) {
//     try {
//       // Get manager ID from authenticated user
//       const managerId = req.user?.manager_id;

//       if (!managerId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access restricted to managers",
//         });
//       }

//       const expiryReport = await InventoryReportModel.getExpiryReport();

//       res.status(200).json({
//         success: true,
//         expiryReport,
//       });
//     } catch (error) {
//       console.error("Error getting expiry report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get expiry report",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get stock movement report
//    */
//   static async getStockMovementReport(req, res) {
//     try {
//       const { productId, startDate, endDate, limit = 100 } = req.query;

//       // Get manager ID from authenticated user
//       const managerId = req.user?.manager_id;

//       if (!managerId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access restricted to managers",
//         });
//       }

//       // Prepare filters
//       const filters = {
//         productId,
//         startDate,
//         endDate,
//         limit,
//       };

//       const stockMovements = await InventoryReportModel.getStockMovementReport(
//         filters
//       );

//       res.status(200).json({
//         success: true,
//         stockMovements,
//       });
//     } catch (error) {
//       console.error("Error getting stock movement report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get stock movement report",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Export inventory report as PDF
//    */
//   static async exportInventoryReportPDF(req, res) {
//     try {
//       const {
//         category,
//         lowStock,
//         expiringSoon,
//         expired,
//         sortBy = "product_id",
//         sortOrder = "ASC",
//         reportType = "general", // general, reorder, expiry
//       } = req.query;

//       // Get manager ID from authenticated user
//       const managerId = req.user?.manager_id;

//       if (!managerId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access restricted to managers",
//         });
//       }

//       // Set response headers
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename=inventory_report_${reportType}_${
//           new Date().toISOString().split("T")[0]
//         }.pdf`
//       );

//       // Create PDF document
//       const doc = new PDFDocument({ margin: 50 });

//       // Pipe PDF to response
//       doc.pipe(res);

//       // Get appropriate data based on report type
//       let reportData, reportTitle;

//       if (reportType === "reorder") {
//         reportData = await InventoryReportModel.getReorderList();
//         reportTitle = "Inventory Reorder Report";
//         this.generateReorderPDF(doc, reportData, { reportTitle });
//       } else if (reportType === "expiry") {
//         reportData = await InventoryReportModel.getExpiryReport();
//         reportTitle = "Inventory Expiry Report";
//         this.generateExpiryPDF(doc, reportData, { reportTitle });
//       } else {
//         // General inventory report
//         // Prepare filters
//         const filters = {
//           category,
//           lowStock: lowStock === "true",
//           expiringSoon: expiringSoon === "true",
//           expired: expired === "true",
//           sortBy,
//           sortOrder: sortOrder === "DESC" ? "DESC" : "ASC",
//           managerId,
//           includeSummary: true,
//         };

//         reportData = await InventoryReportModel.getInventoryReport(filters);
//         reportTitle = "Inventory General Report";
//         this.generateInventoryPDF(doc, reportData, {
//           reportTitle,
//           filters,
//         });
//       }

//       // Finalize PDF
//       doc.end();
//     } catch (error) {
//       console.error("Error exporting inventory report PDF:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to export inventory report as PDF",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Generate PDF content for inventory report
//    */
//   static generateInventoryPDF(doc, reportData, options) {
//     const { reportTitle, filters } = options;

//     // Add logo or pharmacy name
//     doc.fontSize(20).text("L.W. Pharmacy", { align: "center" });
//     doc.fontSize(16).text(reportTitle, { align: "center" });
//     doc.moveDown();

//     // Add report metadata
//     doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`);

//     // Add filter information if any
//     if (filters) {
//       if (filters.category && filters.category !== "all") {
//         doc.text(`Category: ${filters.category}`);
//       }
//       if (filters.lowStock) {
//         doc.text("Filter: Low Stock Items");
//       }
//       if (filters.expiringSoon) {
//         doc.text("Filter: Expiring Soon Items");
//       }
//       if (filters.expired) {
//         doc.text("Filter: Expired Items");
//       }
//     }
//     doc.moveDown();

//     // Add summary section
//     const summary = reportData.summary;
//     if (summary) {
//       doc.fontSize(14).text("Inventory Summary", { underline: true });
//       doc.moveDown(0.5);

//       doc.text(`Total Products: ${summary.total_products}`);
//       doc.text(
//         `Total Value: Rs. ${summary.total_value?.toLocaleString() || 0}`
//       );
//       doc.text(`Low Stock Items: ${summary.low_stock_count}`);
//       doc.text(`Expiring Soon (30 days): ${summary.expiring_soon_count}`);
//       doc.text(`Expired Items: ${summary.expired_count}`);
//       doc.text(`Out of Stock Items: ${summary.out_of_stock_count}`);
//       doc.moveDown();

//       // Add category breakdown if available
//       if (summary.categories && summary.categories.length > 0) {
//         doc.fontSize(14).text("Categories", { underline: true });
//         doc.moveDown(0.5);

//         summary.categories.forEach((category) => {
//           doc.text(
//             `${category.category_name}: ${
//               category.product_count
//             } products, Rs. ${category.category_value?.toLocaleString() || 0}`
//           );
//         });
//         doc.moveDown();
//       }
//     }

//     // Add products table
//     doc.addPage();
//     doc.fontSize(14).text("Product Inventory", { underline: true });
//     doc.moveDown(0.5);

//     const tableTop = doc.y;
//     const idCol = 50;
//     const nameCol = 100;
//     const categoryCol = 250;
//     const quantityCol = 350;
//     const valueCol = 450;

//     // Add table headers
//     doc
//       .font("Helvetica-Bold")
//       .text("ID", idCol, tableTop)
//       .text("Name", nameCol, tableTop)
//       .text("Category", categoryCol, tableTop)
//       .text("Stock", quantityCol, tableTop)
//       .text("Value", valueCol, tableTop);

//     doc.moveDown();
//     let rowTop = doc.y;

//     // Add table rows
//     doc.font("Helvetica");
//     reportData.products.forEach((product, i) => {
//       // Check if we need a new page
//       if (rowTop > doc.page.height - 100) {
//         doc.addPage();
//         rowTop = 50;

//         // Repeat headers on new page
//         doc
//           .font("Helvetica-Bold")
//           .text("ID", idCol, rowTop)
//           .text("Name", nameCol, rowTop)
//           .text("Category", categoryCol, rowTop)
//           .text("Stock", quantityCol, rowTop)
//           .text("Value", valueCol, rowTop);

//         doc.moveDown();
//         rowTop = doc.y;
//         doc.font("Helvetica");
//       }

//       doc
//         .text(product.product_id.toString(), idCol, rowTop)
//         .text(product.pname || "Unknown", nameCol, rowTop)
//         .text(product.category_name || "N/A", categoryCol, rowTop)
//         .text(product.quantity.toString(), quantityCol, rowTop)
//         .text(
//           `Rs. ${product.total_value?.toLocaleString() || 0}`,
//           valueCol,
//           rowTop
//         );

//       rowTop = doc.y + 10;
//       doc.moveDown(0.5);
//     });

//     // Add footer with page numbers
//     const pageCount = doc.bufferedPageRange().count;
//     for (let i = 0; i < pageCount; i++) {
//       doc.switchToPage(i);

//       // Footer with page number
//       doc
//         .fontSize(10)
//         .text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, {
//           align: "center",
//         });
//     }
//   }

//   /**
//    * Generate PDF content for reorder report
//    */
//   static generateReorderPDF(doc, reorderList, options) {
//     const { reportTitle } = options;

//     // Add logo or pharmacy name
//     doc.fontSize(20).text("L.W. Pharmacy", { align: "center" });
//     doc.fontSize(16).text(reportTitle, { align: "center" });
//     doc.moveDown();

//     // Add report metadata
//     doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`);
//     doc.moveDown();

//     // Add summary info
//     doc.fontSize(14).text("Reorder Summary", { underline: true });
//     doc.moveDown(0.5);

//     doc.text(`Total Items to Reorder: ${reorderList.length}`);

//     // Calculate total cost estimate
//     const totalCost = reorderList.reduce((sum, item) => {
//       return sum + (item.quantity_to_order || 0) * (item.price || 0);
//     }, 0);

//     doc.text(`Estimated Total Cost: Rs. ${totalCost.toLocaleString()}`);
//     doc.moveDown();

//     // Add products table
//     doc.fontSize(14).text("Products to Reorder", { underline: true });
//     doc.moveDown(0.5);

//     const tableTop = doc.y;
//     const idCol = 50;
//     const nameCol = 100;
//     const currentCol = 250;
//     const thresholdCol = 320;
//     const orderCol = 390;
//     const costCol = 470;

//     // Add table headers
//     doc
//       .font("Helvetica-Bold")
//       .text("ID", idCol, tableTop)
//       .text("Product Name", nameCol, tableTop)
//       .text("Current", currentCol, tableTop)
//       .text("Threshold", thresholdCol, tableTop)
//       .text("Order Qty", orderCol, tableTop)
//       .text("Est. Cost", costCol, tableTop);

//     doc.moveDown();
//     let rowTop = doc.y;

//     // Add table rows
//     doc.font("Helvetica");
//     reorderList.forEach((product, i) => {
//       // Check if we need a new page
//       if (rowTop > doc.page.height - 100) {
//         doc.addPage();
//         rowTop = 50;

//         // Repeat headers on new page
//         doc
//           .font("Helvetica-Bold")
//           .text("ID", idCol, rowTop)
//           .text("Product Name", nameCol, rowTop)
//           .text("Current", currentCol, rowTop)
//           .text("Threshold", thresholdCol, rowTop)
//           .text("Order Qty", orderCol, rowTop)
//           .text("Est. Cost", costCol, rowTop);

//         doc.moveDown();
//         rowTop = doc.y;
//         doc.font("Helvetica");
//       }

//       const orderQty = product.quantity_to_order || 0;
//       const estCost = orderQty * (product.price || 0);

//       doc
//         .text(product.product_id.toString(), idCol, rowTop)
//         .text(product.pname || "Unknown", nameCol, rowTop)
//         .text(product.quantity.toString(), currentCol, rowTop)
//         .text(product.threshold.toString(), thresholdCol, rowTop)
//         .text(orderQty.toString(), orderCol, rowTop)
//         .text(`Rs. ${estCost.toLocaleString()}`, costCol, rowTop);

//       rowTop = doc.y + 10;
//       doc.moveDown(0.5);
//     });

//     // Add footer with page numbers
//     const pageCount = doc.bufferedPageRange().count;
//     for (let i = 0; i < pageCount; i++) {
//       doc.switchToPage(i);

//       // Footer with page number
//       doc
//         .fontSize(10)
//         .text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, {
//           align: "center",
//         });
//     }
//   }

//   /**
//    * Generate PDF content for expiry report
//    */
//   static generateExpiryPDF(doc, expiryReport, options) {
//     const { reportTitle } = options;

//     // Add logo or pharmacy name
//     doc.fontSize(20).text("L.W. Pharmacy", { align: "center" });
//     doc.fontSize(16).text(reportTitle, { align: "center" });
//     doc.moveDown();

//     // Add report metadata
//     doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`);
//     doc.moveDown();

//     // Add summary info
//     doc.fontSize(14).text("Expiry Summary", { underline: true });
//     doc.moveDown(0.5);

//     const expiredCount = expiryReport.expired.length;
//     const expiringSoonCount = expiryReport.expiring_30_days.length;
//     const expiring90Count = expiryReport.expiring_90_days.length;

//     // Calculate total value
//     const expiredValue = expiryReport.expired.reduce(
//       (sum, item) => sum + (item.total_value || 0),
//       0
//     );
//     const expiringSoonValue = expiryReport.expiring_30_days.reduce(
//       (sum, item) => sum + (item.total_value || 0),
//       0
//     );

//     doc.text(
//       `Expired Items: ${expiredCount} (Value: Rs. ${expiredValue.toLocaleString()})`
//     );
//     doc.text(
//       `Expiring in 30 Days: ${expiringSoonCount} (Value: Rs. ${expiringSoonValue.toLocaleString()})`
//     );
//     doc.text(`Expiring in 30-90 Days: ${expiring90Count}`);
//     doc.moveDown();

//     // Section 1: Expired items
//     if (expiredCount > 0) {
//       doc.fontSize(14).text("Expired Items", { underline: true });
//       doc.moveDown(0.5);

//       const tableTop = doc.y;
//       const idCol = 50;
//       const nameCol = 100;
//       const expDateCol = 250;
//       const daysCol = 350;
//       const valueCol = 450;

//       // Add table headers
//       doc
//         .font("Helvetica-Bold")
//         .text("ID", idCol, tableTop)
//         .text("Product Name", nameCol, tableTop)
//         .text("Expiry Date", expDateCol, tableTop)
//         .text("Days Expired", daysCol, tableTop)
//         .text("Value", valueCol, tableTop);

//       doc.moveDown();
//       let rowTop = doc.y;

//       // Add table rows
//       doc.font("Helvetica");
//       expiryReport.expired.forEach((product, i) => {
//         // Check if we need a new page
//         if (rowTop > doc.page.height - 100) {
//           doc.addPage();
//           rowTop = 50;

//           // Repeat headers on new page
//           doc
//             .font("Helvetica-Bold")
//             .text("ID", idCol, rowTop)
//             .text("Product Name", nameCol, rowTop)
//             .text("Expiry Date", expDateCol, rowTop)
//             .text("Days Expired", daysCol, rowTop)
//             .text("Value", valueCol, rowTop);

//           doc.moveDown();
//           rowTop = doc.y;
//           doc.font("Helvetica");
//         }

//         doc
//           .text(product.product_id.toString(), idCol, rowTop)
//           .text(product.pname || "Unknown", nameCol, rowTop)
//           .text(product.exp_date, expDateCol, rowTop)
//           .text(Math.abs(product.days_expired).toString(), daysCol, rowTop)
//           .text(
//             `Rs. ${product.total_value?.toLocaleString() || 0}`,
//             valueCol,
//             rowTop
//           );

//         rowTop = doc.y + 10;
//         doc.moveDown(0.5);
//       });
//     }

//     // Section 2: Expiring soon items
//     if (expiringSoonCount > 0) {
//       doc.addPage();
//       doc.fontSize(14).text("Expiring in 30 Days", { underline: true });
//       doc.moveDown(0.5);

//       const tableTop = doc.y;
//       const idCol = 50;
//       const nameCol = 100;
//       const expDateCol = 250;
//       const daysCol = 350;
//       const valueCol = 450;

//       // Add table headers
//       doc
//         .font("Helvetica-Bold")
//         .text("ID", idCol, tableTop)
//         .text("Product Name", nameCol, tableTop)
//         .text("Expiry Date", expDateCol, tableTop)
//         .text("Days Left", daysCol, tableTop)
//         .text("Value", valueCol, tableTop);

//       doc.moveDown();
//       let rowTop = doc.y;

//       // Add table rows
//       doc.font("Helvetica");
//       expiryReport.expiring_30_days.forEach((product, i) => {
//         // Check if we need a new page
//         if (rowTop > doc.page.height - 100) {
//           doc.addPage();
//           rowTop = 50;

//           // Repeat headers on new page
//           doc
//             .font("Helvetica-Bold")
//             .text("ID", idCol, rowTop)
//             .text("Product Name", nameCol, rowTop)
//             .text("Expiry Date", expDateCol, rowTop)
//             .text("Days Left", daysCol, rowTop)
//             .text("Value", valueCol, rowTop);

//           doc.moveDown();
//           rowTop = doc.y;
//           doc.font("Helvetica");
//         }

//         doc
//           .text(product.product_id.toString(), idCol, rowTop)
//           .text(product.pname || "Unknown", nameCol, rowTop)
//           .text(product.exp_date, expDateCol, rowTop)
//           .text(product.days_until_expiry.toString(), daysCol, rowTop)
//           .text(
//             `Rs. ${product.total_value?.toLocaleString() || 0}`,
//             valueCol,
//             rowTop
//           );

//         rowTop = doc.y + 10;
//         doc.moveDown(0.5);
//       });
//     }

//     // Add footer with page numbers
//     const pageCount = doc.bufferedPageRange().count;
//     for (let i = 0; i < pageCount; i++) {
//       doc.switchToPage(i);

//       // Footer with page number
//       doc
//         .fontSize(10)
//         .text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, {
//           align: "center",
//         });
//     }
//   }
// }

// module.exports = InventoryReportController;

// controllers/InventoryReportController.js
const InventoryReportModel = require("../Models/InventoryReportModel");
const PDFDocument = require("pdfkit");

// class InventoryReportController {
//   /**
//    * Get inventory report data
//    */
//   static async getInventoryReport(req, res) {
//     try {
//       const {
//         type = "current",
//         category = "all",
//         startDate,
//         endDate,
//       } = req.query;

//       // Get manager ID from authenticated user
//       const managerId = req.user?.manager_id;

//       if (!managerId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access restricted to managers",
//         });
//       }

//       // Prepare filters
//       const filters = {
//         type,
//         category,
//         startDate,
//         endDate,
//       };

//       // Get inventory report data
//       const reportData = await InventoryReportModel.getInventoryReport(filters);

//       res.status(200).json({
//         success: true,
//         inventory: reportData.inventory,
//         summary: reportData.summary,
//       });
//     } catch (error) {
//       console.error("Error generating inventory report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to generate inventory report",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get product categories
//    */
//   static async getCategories(req, res) {
//     try {
//       // Get manager ID from authenticated user
//       const managerId = req.user?.manager_id;

//       if (!managerId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access restricted to managers",
//         });
//       }

//       // Get categories
//       const categories = await InventoryReportModel.getCategories();

//       res.status(200).json({
//         success: true,
//         categories,
//       });
//     } catch (error) {
//       console.error("Error getting categories:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get categories",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get reorder list
//    */
//   static async getReorderList(req, res) {
//     try {
//       // Get manager ID from authenticated user
//       const managerId = req.user?.manager_id;

//       if (!managerId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access restricted to managers",
//         });
//       }

//       // Get reorder list
//       const reorderList = await InventoryReportModel.getReorderList();

//       res.status(200).json({
//         success: true,
//         reorderList,
//       });
//     } catch (error) {
//       console.error("Error getting reorder list:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get reorder list",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get expiry report
//    */
//   static async getExpiryReport(req, res) {
//     try {
//       const { daysThreshold = 90 } = req.query;

//       // Get manager ID from authenticated user
//       const managerId = req.user?.manager_id;

//       if (!managerId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access restricted to managers",
//         });
//       }

//       // Get expiry report
//       const expiryReport = await InventoryReportModel.getExpiryReport(
//         daysThreshold
//       );

//       res.status(200).json({
//         success: true,
//         expiryReport,
//       });
//     } catch (error) {
//       console.error("Error getting expiry report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get expiry report",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get stock movement report
//    */
//   static async getStockMovementReport(req, res) {
//     try {
//       const { startDate, endDate, category = "all" } = req.query;

//       // Validate required parameters
//       if (!startDate || !endDate) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Both startDate and endDate are required for stock movement reports",
//         });
//       }

//       // Get manager ID from authenticated user
//       const managerId = req.user?.manager_id;

//       if (!managerId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access restricted to managers",
//         });
//       }

//       // Prepare filters
//       const filters = {
//         type: "movement",
//         category,
//         startDate,
//         endDate,
//       };

//       // Get inventory report data
//       const reportData = await InventoryReportModel.getInventoryReport(filters);

//       res.status(200).json({
//         success: true,
//         inventory: reportData.inventory,
//         summary: reportData.summary,
//       });
//     } catch (error) {
//       console.error("Error generating stock movement report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to generate stock movement report",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Export inventory report as PDF
//    */
//   static async exportInventoryReportPDF(req, res) {
//     try {
//       const {
//         type = "current",
//         category = "all",
//         startDate,
//         endDate,
//       } = req.query;

//       // Validate required parameters for movement report
//       if (type === "movement" && (!startDate || !endDate)) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Both startDate and endDate are required for stock movement reports",
//         });
//       }

//       // Get manager ID from authenticated user
//       const managerId = req.user?.manager_id;

//       if (!managerId) {
//         return res.status(403).json({
//           success: false,
//           message: "Access restricted to managers",
//         });
//       }

//       // Prepare filters
//       const filters = {
//         type,
//         category,
//         startDate,
//         endDate,
//       };

//       // Get inventory report data
//       const reportData = await InventoryReportModel.getInventoryReport(filters);

//       // Get categories if needed
//       const categories = await InventoryReportModel.getCategories();

//       // Create PDF document
//       const doc = new PDFDocument({ margin: 50 });

//       // Set response headers
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename=inventory_report_${type}_${
//           new Date().toISOString().split("T")[0]
//         }.pdf`
//       );

//       // Pipe PDF to response
//       doc.pipe(res);

//       // Generate PDF content
//       this.generateInventoryPDF(doc, reportData, {
//         type,
//         category,
//         startDate,
//         endDate,
//         categories,
//       });

//       // Finalize PDF
//       doc.end();
//     } catch (error) {
//       console.error("Error exporting inventory report PDF:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to export inventory report as PDF",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Generate PDF content for inventory report
//    */
//   static generateInventoryPDF(doc, reportData, options) {
//     const { type, category, startDate, endDate, categories } = options;

//     // Add pharmacy name as header
//     doc.fontSize(20).text("L.W. Pharmacy", { align: "center" });
//     doc.fontSize(16).text("Inventory Report", { align: "center" });
//     doc.moveDown();

//     // Add report metadata
//     let reportTypeText = "Current Inventory";
//     if (type === "lowstock") reportTypeText = "Low Stock Items";
//     else if (type === "expiry") reportTypeText = "Expiring Items";
//     else if (type === "movement") reportTypeText = "Stock Movement";

//     doc.fontSize(12).text(`Report Type: ${reportTypeText}`);

//     // Add category if filtered
//     if (category && category !== "all") {
//       doc.text(`Category: ${category}`);
//     }

//     // Add date range for movement reports
//     if (type === "movement" && startDate && endDate) {
//       doc.text(`Period: ${startDate} to ${endDate}`);
//     }

//     doc.text(`Generated: ${new Date().toLocaleString()}`);
//     doc.moveDown();

//     // Add summary data
//     doc.fontSize(14).text("Inventory Summary", { underline: true });
//     doc.moveDown(0.5);

//     const summary = reportData.summary;

//     doc.text(`Total Products: ${summary.total_products || 0}`);
//     doc.text(
//       `Total Inventory Value: Rs. ${(
//         summary.total_value || 0
//       ).toLocaleString()}`
//     );
//     doc.text(`Low Stock Items: ${summary.low_stock_items || 0}`);
//     doc.text(`Expiring Soon: ${summary.expiring_soon || 0}`);
//     doc.moveDown();

//     // Add products table with columns based on report type
//     doc.fontSize(14).text("Product Details", { underline: true });
//     doc.moveDown(0.5);

//     // Define table columns based on report type
//     let columns = [];
//     if (type === "current") {
//       columns = [
//         { header: "ID", property: "product_id", width: 40 },
//         { header: "Product Name", property: "pname", width: 150 },
//         { header: "Category", property: "category_name", width: 100 },
//         { header: "Quantity", property: "quantity", width: 70 },
//         { header: "Price (Rs.)", property: "price", width: 80 },
//         { header: "Total Value (Rs.)", property: "total_value", width: 100 },
//       ];
//     } else if (type === "lowstock") {
//       columns = [
//         { header: "ID", property: "product_id", width: 40 },
//         { header: "Product Name", property: "pname", width: 150 },
//         { header: "Category", property: "category_name", width: 100 },
//         { header: "In Stock", property: "quantity", width: 70 },
//         { header: "Threshold", property: "treshold", width: 70 },
//         { header: "Supplier", property: "supplier_name", width: 120 },
//       ];
//     } else if (type === "expiry") {
//       columns = [
//         { header: "ID", property: "product_id", width: 40 },
//         { header: "Product Name", property: "pname", width: 150 },
//         { header: "Category", property: "category_name", width: 100 },
//         { header: "Quantity", property: "quantity", width: 70 },
//         { header: "Expiry Date", property: "exp_date", width: 100 },
//         { header: "Value (Rs.)", property: "total_value", width: 90 },
//       ];
//     } else if (type === "movement") {
//       columns = [
//         { header: "ID", property: "product_id", width: 40 },
//         { header: "Product Name", property: "pname", width: 120 },
//         { header: "Opening", property: "opening_stock", width: 70 },
//         { header: "In", property: "stock_in", width: 50 },
//         { header: "Out", property: "stock_out", width: 50 },
//         { header: "Closing", property: "closing_stock", width: 70 },
//         { header: "Price (Rs.)", property: "price", width: 80 },
//       ];
//     }

//     // Draw table headers
//     const startX = 50;
//     let currentX = startX;
//     let currentY = doc.y;

//     // Draw header background
//     doc.rect(startX, currentY, 500, 20).fill("#f2f2f2");

//     // Draw header text
//     currentX = startX;
//     doc.font("Helvetica-Bold");
//     columns.forEach((column) => {
//       doc.text(column.header, currentX + 3, currentY + 5, {
//         width: column.width,
//         align: this.getColumnAlignment(column.property),
//       });
//       currentX += column.width;
//     });

//     currentY += 20;
//     doc.font("Helvetica");

//     // Draw table rows
//     const inventory = reportData.inventory || [];
//     inventory.forEach((item, i) => {
//       // Check if we need a new page
//       if (currentY > doc.page.height - 50) {
//         doc.addPage();
//         currentY = 50;

//         // Redraw headers on new page
//         currentX = startX;
//         doc.rect(startX, currentY, 500, 20).fill("#f2f2f2");

//         doc.font("Helvetica-Bold");
//         columns.forEach((column) => {
//           doc.text(column.header, currentX + 3, currentY + 5, {
//             width: column.width,
//             align: this.getColumnAlignment(column.property),
//           });
//           currentX += column.width;
//         });

//         currentY += 20;
//         doc.font("Helvetica");
//       }

//       // Draw row background (alternating colors)
//       if (i % 2 === 0) {
//         doc.rect(startX, currentY, 500, 20).fill("#f9f9f9");
//       }

//       // Draw row data
//       currentX = startX;
//       columns.forEach((column) => {
//         let value = item[column.property];

//         // Format value based on property
//         if (column.property === "price" || column.property === "total_value") {
//           value = value ? `${value.toLocaleString()}` : "0";
//         } else if (column.property === "exp_date") {
//           value = value ? new Date(value).toLocaleDateString() : "N/A";
//         }

//         doc.text(value, currentX + 3, currentY + 5, {
//           width: column.width,
//           align: this.getColumnAlignment(column.property),
//         });
//         currentX += column.width;
//       });

//       currentY += 20;
//     });

//     // Add footer
//     const pageCount = doc.bufferedPageRange().count;
//     for (let i = 0; i < pageCount; i++) {
//       doc.switchToPage(i);

//       // Footer with page number
//       doc
//         .fontSize(10)
//         .text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, {
//           align: "center",
//         });
//     }
//   }

//   /**
//    * Get column alignment based on property
//    */
//   static getColumnAlignment(property) {
//     const rightAlignedColumns = [
//       "quantity",
//       "price",
//       "total_value",
//       "treshold",
//       "opening_stock",
//       "stock_in",
//       "stock_out",
//       "closing_stock",
//     ];

//     return rightAlignedColumns.includes(property) ? "right" : "left";
//   }
// }

// module.exports = InventoryReportController;

class InventoryReportController {
  /**
   * Get inventory report data
   */
  static async getInventoryReport(req, res) {
    try {
      const {
        type = "current",
        category = "all",
        startDate,
        endDate,
      } = req.query;

      // Get manager ID from authenticated user
      const managerId = req.user?.manager_id;

      if (!managerId) {
        return res.status(403).json({
          success: false,
          message: "Access restricted to managers",
        });
      }

      // Prepare filters
      const filters = {
        type,
        category,
        startDate,
        endDate,
      };

      // Get inventory report data
      const reportData = await InventoryReportModel.getInventoryReport(filters);

      res.status(200).json({
        success: true,
        inventory: reportData.inventory,
        summary: reportData.summary,
      });
    } catch (error) {
      console.error("Error generating inventory report:", error);
      console.error("Error stack:", error.stack); // Add stack trace for debugging
      res.status(500).json({
        success: false,
        message: "Failed to generate inventory report",
        error: error.message,
      });
    }
  }

  /**
   * Get product categories
   */
  static async getCategories(req, res) {
    try {
      // Get manager ID from authenticated user
      const managerId = req.user?.manager_id;

      if (!managerId) {
        return res.status(403).json({
          success: false,
          message: "Access restricted to managers",
        });
      }

      // Get categories
      const categories = await InventoryReportModel.getCategories();

      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get categories",
        error: error.message,
      });
    }
  }

  /**
   * Get reorder list
   */
  static async getReorderList(req, res) {
    try {
      // Get manager ID from authenticated user
      const managerId = req.user?.manager_id;

      if (!managerId) {
        return res.status(403).json({
          success: false,
          message: "Access restricted to managers",
        });
      }

      // Get reorder list
      const reorderList = await InventoryReportModel.getReorderList();

      res.status(200).json({
        success: true,
        reorderList,
      });
    } catch (error) {
      console.error("Error getting reorder list:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get reorder list",
        error: error.message,
      });
    }
  }

  /**
   * Get expiry report
   */
  static async getExpiryReport(req, res) {
    try {
      const { daysThreshold = 90 } = req.query;

      // Get manager ID from authenticated user
      const managerId = req.user?.manager_id;

      if (!managerId) {
        return res.status(403).json({
          success: false,
          message: "Access restricted to managers",
        });
      }

      // Get expiry report
      const expiryReport = await InventoryReportModel.getExpiryReport(
        daysThreshold
      );

      res.status(200).json({
        success: true,
        expiryReport,
      });
    } catch (error) {
      console.error("Error getting expiry report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get expiry report",
        error: error.message,
      });
    }
  }

  /**
   * Get stock movement report
   */
  static async getStockMovementReport(req, res) {
    try {
      const { startDate, endDate, category = "all" } = req.query;

      // Validate required parameters
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message:
            "Both startDate and endDate are required for stock movement reports",
        });
      }

      // Get manager ID from authenticated user
      const managerId = req.user?.manager_id;

      if (!managerId) {
        return res.status(403).json({
          success: false,
          message: "Access restricted to managers",
        });
      }

      // Prepare filters
      const filters = {
        type: "movement",
        category,
        startDate,
        endDate,
      };

      // Get inventory report data
      const reportData = await InventoryReportModel.getInventoryReport(filters);

      res.status(200).json({
        success: true,
        inventory: reportData.inventory,
        summary: reportData.summary,
      });
    } catch (error) {
      console.error("Error generating stock movement report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate stock movement report",
        error: error.message,
      });
    }
  }

  /**
   * Export inventory report as PDF
   */
  static async exportInventoryReportPDF(req, res) {
    try {
      const {
        type = "current",
        category = "all",
        startDate,
        endDate,
      } = req.query;

      // Validate required parameters for movement report
      if (type === "movement" && (!startDate || !endDate)) {
        return res.status(400).json({
          success: false,
          message:
            "Both startDate and endDate are required for stock movement reports",
        });
      }

      // Get manager ID from authenticated user
      const managerId = req.user?.manager_id;

      if (!managerId) {
        return res.status(403).json({
          success: false,
          message: "Access restricted to managers",
        });
      }

      // Prepare filters
      const filters = {
        type,
        category,
        startDate,
        endDate,
      };

      // Get inventory report data
      const reportData = await InventoryReportModel.getInventoryReport(filters);

      // Get categories if needed
      const categories = await InventoryReportModel.getCategories();

      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=inventory_report_${type}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      // Pipe PDF to response
      doc.pipe(res);

      // Generate PDF content - FIX: Call the static method with the class name
      InventoryReportController.generateInventoryPDF(doc, reportData, {
        type,
        category,
        startDate,
        endDate,
        categories,
      });

      // Finalize PDF
      doc.end();
    } catch (error) {
      console.error("Error exporting inventory report PDF:", error);
      // Make sure we only send the error response if headers haven't been sent
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to export inventory report as PDF",
          error: error.message,
        });
      }
    }
  }

  /**
   * Generate PDF content for inventory report
   */
  static generateInventoryPDF(doc, reportData, options) {
    const { type, category, startDate, endDate, categories } = options;

    // Add pharmacy name as header
    doc.fontSize(20).text("L.W. Pharmacy", { align: "center" });
    doc.fontSize(16).text("Inventory Report", { align: "center" });
    doc.moveDown();

    // Add report metadata
    let reportTypeText = "Current Inventory";
    if (type === "lowstock") reportTypeText = "Low Stock Items";
    else if (type === "expiry") reportTypeText = "Expiring Items";
    else if (type === "movement") reportTypeText = "Stock Movement";

    doc.fontSize(12).text(`Report Type: ${reportTypeText}`);

    // Add category if filtered
    if (category && category !== "all") {
      doc.text(`Category: ${category}`);
    }

    // Add date range for movement reports
    if (type === "movement" && startDate && endDate) {
      doc.text(`Period: ${startDate} to ${endDate}`);
    }

    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Add summary data
    doc.fontSize(14).text("Inventory Summary", { underline: true });
    doc.moveDown(0.5);

    const summary = reportData.summary;

    doc.text(`Total Products: ${summary.total_products || 0}`);
    doc.text(
      `Total Inventory Value: Rs. ${(
        summary.total_value || 0
      ).toLocaleString()}`
    );
    doc.text(`Low Stock Items: ${summary.low_stock_items || 0}`);
    doc.text(`Expiring Soon: ${summary.expiring_soon || 0}`);
    doc.moveDown();

    // Add products table with columns based on report type
    doc.fontSize(14).text("Product Details", { underline: true });
    doc.moveDown(0.5);

    // Define table columns based on report type
    let columns = [];
    if (type === "current") {
      columns = [
        { header: "ID", property: "product_id", width: 40 },
        { header: "Product Name", property: "pname", width: 150 },
        { header: "Category", property: "category_name", width: 100 },
        { header: "Quantity", property: "quantity", width: 70 },
        { header: "Price (Rs.)", property: "price", width: 80 },
        { header: "Total Value (Rs.)", property: "total_value", width: 100 },
      ];
    } else if (type === "lowstock") {
      columns = [
        { header: "ID", property: "product_id", width: 40 },
        { header: "Product Name", property: "pname", width: 150 },
        { header: "Category", property: "category_name", width: 100 },
        { header: "In Stock", property: "quantity", width: 70 },
        { header: "Threshold", property: "treshold", width: 70 },
        { header: "Supplier", property: "supplier_name", width: 120 },
      ];
    } else if (type === "expiry") {
      columns = [
        { header: "ID", property: "product_id", width: 40 },
        { header: "Product Name", property: "pname", width: 150 },
        { header: "Category", property: "category_name", width: 100 },
        { header: "Quantity", property: "quantity", width: 70 },
        { header: "Expiry Date", property: "exp_date", width: 100 },
        { header: "Value (Rs.)", property: "total_value", width: 90 },
      ];
    } else if (type === "movement") {
      columns = [
        { header: "ID", property: "product_id", width: 40 },
        { header: "Product Name", property: "pname", width: 120 },
        { header: "Opening", property: "opening_stock", width: 70 },
        { header: "In", property: "stock_in", width: 50 },
        { header: "Out", property: "stock_out", width: 50 },
        { header: "Closing", property: "closing_stock", width: 70 },
        { header: "Price (Rs.)", property: "price", width: 80 },
      ];
    }

    // Draw table headers
    const startX = 50;
    let currentX = startX;
    let currentY = doc.y;

    // Draw header background
    doc.rect(startX, currentY, 500, 20).fill("#f2f2f2");

    // Draw header text
    currentX = startX;
    doc.font("Helvetica-Bold");
    columns.forEach((column) => {
      doc.text(column.header, currentX + 3, currentY + 5, {
        width: column.width,
        align: InventoryReportController.getColumnAlignment(column.property),
      });
      currentX += column.width;
    });

    currentY += 20;
    doc.font("Helvetica");

    // Draw table rows
    const inventory = reportData.inventory || [];
    inventory.forEach((item, i) => {
      // Check if we need a new page
      if (currentY > doc.page.height - 50) {
        doc.addPage();
        currentY = 50;

        // Redraw headers on new page
        currentX = startX;
        doc.rect(startX, currentY, 500, 20).fill("#f2f2f2");

        doc.font("Helvetica-Bold");
        columns.forEach((column) => {
          doc.text(column.header, currentX + 3, currentY + 5, {
            width: column.width,
            align: InventoryReportController.getColumnAlignment(
              column.property
            ),
          });
          currentX += column.width;
        });

        currentY += 20;
        doc.font("Helvetica");
      }

      // Draw row background (alternating colors)
      if (i % 2 === 0) {
        doc.rect(startX, currentY, 500, 20).fill("#f9f9f9");
      }

      // Draw row data
      currentX = startX;
      columns.forEach((column) => {
        let value = item[column.property];

        // Format value based on property
        if (column.property === "price" || column.property === "total_value") {
          value = value ? `${value.toLocaleString()}` : "0";
        } else if (column.property === "exp_date") {
          value = value ? new Date(value).toLocaleDateString() : "N/A";
        }

        doc.text(value, currentX + 3, currentY + 5, {
          width: column.width,
          align: InventoryReportController.getColumnAlignment(column.property),
        });
        currentX += column.width;
      });

      currentY += 20;
    });

    // Add footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);

      // Footer with page number
      doc
        .fontSize(10)
        .text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50, {
          align: "center",
        });
    }
  }

  /**
   * Get column alignment based on property
   */
  static getColumnAlignment(property) {
    const rightAlignedColumns = [
      "quantity",
      "price",
      "total_value",
      "treshold",
      "opening_stock",
      "stock_in",
      "stock_out",
      "closing_stock",
    ];

    return rightAlignedColumns.includes(property) ? "right" : "left";
  }
}

module.exports = InventoryReportController;
