// const SalesReportModel = require("../Models/SalesReportModel");
// const PDFDocument = require("pdfkit");
// const path = require("path");
// const fs = require("fs");

// class SalesReportController {
//   /**
//    * Get sales report data
//    */
//   static async getSalesReport(req, res) {
//     try {
//       const {
//         startDate,
//         endDate,
//         type = "daily", // daily, weekly, monthly, yearly
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
//         startDate,
//         endDate,
//         type,
//         managerId,
//       };

//       // Get sales report data
//       const reportData = await SalesReportModel.getSalesReport(filters);

//       res.status(200).json({
//         success: true,
//         sales: reportData.sales,
//         summary: reportData.summary,
//       });
//     } catch (error) {
//       console.error("Error generating sales report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to generate sales report",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get order details by ID
//    */
//   static async getOrderDetails(req, res) {
//     try {
//       const { orderId } = req.params;

//       // Validate input
//       if (!orderId || isNaN(orderId)) {
//         return res.status(400).json({
//           success: false,
//           message: "Valid order ID is required",
//         });
//       }

//       // Get order details
//       const orderDetails = await SalesReportModel.getOrderDetails(orderId);

//       if (!orderDetails) {
//         return res.status(404).json({
//           success: false,
//           message: "Order not found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         order: orderDetails.order,
//         items: orderDetails.items,
//       });
//     } catch (error) {
//       console.error("Error getting order details:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to get order details",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Export sales report as PDF
//    */
//   // static async exportSalesReportPDF(req, res) {
//   //   try {
//   //     const {
//   //       startDate,
//   //       endDate,
//   //       type = "daily", // daily, weekly, monthly, yearly
//   //     } = req.query;

//   //     // Get manager ID from authenticated user
//   //     const managerId = req.user?.manager_id;

//   //     if (!managerId) {
//   //       return res.status(403).json({
//   //         success: false,
//   //         message: "Access restricted to managers",
//   //       });
//   //     }

//   //     // Prepare filters
//   //     const filters = {
//   //       startDate,
//   //       endDate,
//   //       type,
//   //       managerId,
//   //     };

//   //     // Get sales report data
//   //     const reportData = await SalesReportModel.getSalesReport(filters);

//   //     // Create PDF document
//   //     const doc = new PDFDocument({ margin: 50 });

//   //     // Set response headers
//   //     res.setHeader("Content-Type", "application/pdf");
//   //     res.setHeader(
//   //       "Content-Disposition",
//   //       `attachment; filename=sales_report_${type}_${
//   //         new Date().toISOString().split("T")[0]
//   //       }.pdf`
//   //     );

//   //     // Pipe PDF to response
//   //     doc.pipe(res);

//   //     // Get payment methods distribution
//   //     const paymentMethods =
//   //       await SalesReportModel.getPaymentMethodsDistribution(filters);

//   //     // Get top selling products
//   //     const topProducts = await SalesReportModel.getTopSellingProducts({
//   //       ...filters,
//   //       limit: 10,
//   //     });

//   //     // Add PDF content
//   //     this.generateSalesPDF(doc, reportData, {
//   //       startDate,
//   //       endDate,
//   //       type,
//   //       paymentMethods,
//   //       topProducts,
//   //     });

//   //     // Finalize PDF
//   //     doc.end();
//   //   } catch (error) {
//   //     console.error("Error exporting sales report PDF:", error);
//   //     res.status(500).json({
//   //       success: false,
//   //       message: "Failed to export sales report as PDF",
//   //       error: error.message,
//   //     });
//   //   }
//   // }

//   // controllers/SalesReportController.js
//   // static async exportSalesReportPDF(req, res) {
//   //   try {
//   //     const { type = 'daily', startDate, endDate } = req.query;

//   //     // Validate required parameters
//   //     if (!startDate || !endDate) {
//   //       return res.status(400).json({
//   //         success: false,
//   //         message: 'Both startDate and endDate are required'
//   //       });
//   //     }

//   //     // Get the data
//   //     const topProducts = await SalesReportModel.getTopSellingProducts({
//   //       startDate,
//   //       endDate,
//   //       limit: 10
//   //     });

//   //     // Create PDF
//   //     const doc = new PDFDocument();
//   //     let buffers = [];

//   //     doc.on('data', buffers.push.bind(buffers));
//   //     doc.on('end', () => {
//   //       const pdfData = Buffer.concat(buffers);

//   //       // Set proper headers
//   //       res.setHeader('Content-Type', 'application/pdf');
//   //       res.setHeader(
//   //         'Content-Disposition',
//   //         `attachment; filename=sales_report_${type}_${startDate}_to_${endDate}.pdf`
//   //       );

//   //       res.send(pdfData);
//   //     });

//   //     // Add content to PDF
//   //     doc.fontSize(18).text('Sales Report', { align: 'center' });
//   //     doc.moveDown();
//   //     doc.text(`Report Type: ${type}`);
//   //     doc.text(`Date Range: ${startDate} to ${endDate}`);
//   //     doc.moveDown();

//   //     // Add products table
//   //     doc.fontSize(12).text('Top Selling Products:');
//   //     doc.moveDown();

//   //     topProducts.forEach((product, index) => {
//   //       doc.text(`${index + 1}. ${product.product_name}`);
//   //       doc.text(`   Quantity: ${product.total_quantity}`);
//   //       doc.text(`   Total Sales: Rs. ${product.total_sales}`);
//   //       doc.moveDown();
//   //     });

//   //     doc.end();

//   //   } catch (error) {
//   //     console.error('Error exporting PDF:', error);
//   //     if (!res.headersSent) {
//   //       res.status(500).json({
//   //         success: false,
//   //         message: 'Failed to generate PDF',
//   //         error: error.message
//   //       });
//   //     }
//   //   }
//   // };

//   static async exportSalesReportPDF(req, res) {
//     try {
//       console.log("PDF Export started");
//       const { type = "daily", startDate, endDate } = req.query;

//       // Validate required parameters
//       if (!startDate || !endDate) {
//         console.log("PDF Export - Missing date parameters");
//         return res.status(400).json({
//           success: false,
//           message: "Both startDate and endDate are required",
//         });
//       }

//       // Create a new PDF document
//       const doc = new PDFDocument();

//       // IMPORTANT: Set response headers BEFORE piping to response
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename=sales_report_${type}_${startDate}_to_${endDate}.pdf`
//       );

//       // Track when piping starts and finishes
//       console.log("PDF Export - Starting to pipe to response");

//       // Pipe directly to response - critical for streaming the PDF
//       doc.pipe(res);

//       // Add content to PDF
//       doc.fontSize(20).text("L.W. Pharmacy", { align: "center" });
//       doc.fontSize(16).text("Sales Report", { align: "center" });
//       doc.moveDown();

//       doc.fontSize(12).text(`Report Type: ${type}`);
//       doc.text(`Period: ${startDate} to ${endDate}`);
//       doc.text(`Generated: ${new Date().toLocaleString()}`);
//       doc.moveDown();

//       // Add more content
//       doc.fontSize(14).text("Sales Summary", { underline: true });
//       doc.moveDown(0.5);
//       doc.text(
//         "This is a test report. PDF generation is working if you can see this text."
//       );

//       console.log("PDF Export - Document content added, finalizing...");

//       // IMPORTANT: End the document to finish the stream
//       doc.end();
//       console.log("PDF Export - Document finalized");
//     } catch (error) {
//       console.error("PDF Export - Error:", error);
//       // Only send error if headers haven't been sent yet
//       if (!res.headersSent) {
//         res.status(500).json({
//           success: false,
//           message: "Failed to generate PDF",
//           error: error.message,
//         });
//       } else {
//         // If headers have been sent, we need to end the response
//         console.error("Headers already sent, cannot send error response");
//         res.end();
//       }
//     }
//   }
//   /**
//    * Generate PDF content for sales report
//    */
//   static generateSalesPDF(doc, reportData, options) {
//     const { startDate, endDate, type, paymentMethods, topProducts } = options;

//     // Add logo or pharmacy name
//     doc.fontSize(20).text("L.W. Pharmacy", { align: "center" });
//     doc.fontSize(16).text("Sales Report", { align: "center" });
//     doc.moveDown();

//     // Add report metadata
//     doc
//       .fontSize(12)
//       .text(`Report Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`);
//     if (startDate && endDate) {
//       doc.text(`Period: ${startDate} to ${endDate}`);
//     }
//     doc.text(`Generated: ${new Date().toLocaleString()}`);
//     doc.moveDown();

//     // Add summary data
//     doc.fontSize(14).text("Sales Summary", { underline: true });
//     doc.moveDown(0.5);

//     // Calculate summary totals
//     const totalSales = reportData.sales.reduce(
//       (sum, sale) => sum + sale.value,
//       0
//     );
//     const totalOrders = reportData.sales.length;
//     const averageOrderValue =
//       totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

//     doc.text(`Total Sales: Rs. ${totalSales.toLocaleString()}`);
//     doc.text(`Total Orders: ${totalOrders}`);
//     doc.text(`Average Order Value: Rs. ${averageOrderValue}`);
//     doc.moveDown();

//     // Add payment methods breakdown
//     if (paymentMethods && paymentMethods.length > 0) {
//       doc.fontSize(14).text("Payment Methods", { underline: true });
//       doc.moveDown(0.5);

//       paymentMethods.forEach((method) => {
//         doc.text(
//           `${method.payment_method}: ${
//             method.count
//           } orders, Rs. ${method.total_amount.toLocaleString()}`
//         );
//       });
//       doc.moveDown();
//     }

//     // Add top selling products
//     if (topProducts && topProducts.length > 0) {
//       doc.fontSize(14).text("Top Selling Products", { underline: true });
//       doc.moveDown(0.5);

//       const tableTop = doc.y;
//       const productCol = 50;
//       const quantityCol = 300;
//       const salesCol = 400;

//       // Add table headers
//       doc
//         .font("Helvetica-Bold")
//         .text("Product", productCol, tableTop)
//         .text("Quantity", quantityCol, tableTop)
//         .text("Sales", salesCol, tableTop);

//       doc.moveDown();
//       let rowTop = doc.y;

//       // Add table rows
//       doc.font("Helvetica");
//       topProducts.forEach((product, i) => {
//         // Check if we need a new page
//         if (rowTop > doc.page.height - 100) {
//           doc.addPage();
//           rowTop = 50;
//         }

//         doc
//           .text(product.product_name, productCol, rowTop)
//           .text(product.total_quantity.toString(), quantityCol, rowTop)
//           .text(
//             `Rs. ${product.total_sales.toLocaleString()}`,
//             salesCol,
//             rowTop
//           );

//         rowTop = doc.y + 10;
//         doc.moveDown(0.5);
//       });
//       doc.moveDown();
//     }

//     // Add sales data table
//     doc.addPage();
//     doc.fontSize(14).text("Sales Details", { underline: true });
//     doc.moveDown(0.5);

//     const tableTop = doc.y;
//     const orderIdCol = 50;
//     const dateCol = 150;
//     const customerCol = 250;
//     const statusCol = 350;
//     const valueCol = 450;

//     // Add table headers
//     doc
//       .font("Helvetica-Bold")
//       .text("Order ID", orderIdCol, tableTop)
//       .text("Date", dateCol, tableTop)
//       .text("Customer", customerCol, tableTop)
//       .text("Status", statusCol, tableTop)
//       .text("Value", valueCol, tableTop);

//     doc.moveDown();
//     let rowTop = doc.y;

//     // Add table rows
//     doc.font("Helvetica");
//     reportData.sales.forEach((sale, i) => {
//       // Check if we need a new page
//       if (rowTop > doc.page.height - 100) {
//         doc.addPage();
//         rowTop = 50;

//         // Repeat headers on new page
//         doc
//           .font("Helvetica-Bold")
//           .text("Order ID", orderIdCol, rowTop)
//           .text("Date", dateCol, rowTop)
//           .text("Customer", customerCol, rowTop)
//           .text("Status", statusCol, rowTop)
//           .text("Value", valueCol, rowTop);

//         doc.moveDown();
//         rowTop = doc.y;
//         doc.font("Helvetica");
//       }

//       doc
//         .text(sale.cus_oder_id.toString(), orderIdCol, rowTop)
//         .text(new Date(sale.date).toLocaleDateString(), dateCol, rowTop)
//         .text(sale.customer_name || "Unknown", customerCol, rowTop)
//         .text(sale.status || "N/A", statusCol, rowTop)
//         .text(`Rs. ${sale.value.toLocaleString()}`, valueCol, rowTop);

//       rowTop = doc.y + 10;
//       doc.moveDown(0.5);
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
// }

// module.exports = SalesReportController;

// controllers/SalesReportController.js
const SalesReportModel = require("../Models/SalesReportModel");
const PDFDocument = require("pdfkit");

// class SalesReportController {
//   /**
//    * Get sales report data
//    */
//   static async getSalesReport(req, res) {
//     try {
//       const {
//         startDate,
//         endDate,
//         type = "daily", // daily, weekly, monthly, yearly
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
//         startDate,
//         endDate,
//         type,
//         managerId,
//       };

//       // Get sales report data
//       const reportData = await SalesReportModel.getSalesReport(filters);

//       res.status(200).json({
//         success: true,
//         sales: reportData.sales,
//         summary: reportData.summary,
//       });
//     } catch (error) {
//       console.error("Error generating sales report:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to generate sales report",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Export sales report as PDF
//    */
//   static async exportSalesReportPDF(req, res) {
//     try {
//       const { type = "daily", startDate, endDate } = req.query;

//       // Validate required parameters
//       if (!startDate || !endDate) {
//         return res.status(400).json({
//           success: false,
//           message: "Both startDate and endDate are required",
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
//         startDate,
//         endDate,
//         type,
//         managerId,
//       };

//       // Get sales report data
//       const reportData = await SalesReportModel.getSalesReport(filters);

//       // Get payment methods distribution
//       const paymentMethods =
//         await SalesReportModel.getPaymentMethodsDistribution(filters);

//       // Get top selling products
//       const topProducts = await SalesReportModel.getTopSellingProducts({
//         ...filters,
//         limit: 10,
//       });

//       // Create PDF document
//       const doc = new PDFDocument({ margin: 50 });

//       // Set response headers
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader(
//         "Content-Disposition",
//         `attachment; filename=sales_report_${type}_${startDate}_to_${endDate}.pdf`
//       );

//       // Pipe PDF to response
//       doc.pipe(res);

//       // Generate PDF content - FIX: Call the static method with the class name
//       SalesReportController.generateSalesPDF(doc, reportData, {
//         startDate,
//         endDate,
//         type,
//         paymentMethods,
//         topProducts,
//       });

//       // Finalize PDF
//       doc.end();
//     } catch (error) {
//       console.error("Error exporting sales report PDF:", error);
//       // Make sure we only send the error response if headers haven't been sent
//       if (!res.headersSent) {
//         res.status(500).json({
//           success: false,
//           message: "Failed to export sales report as PDF",
//           error: error.message,
//         });
//       }
//     }
//   }

//   /**
//    * Generate PDF content for sales report
//    */
//   static generateSalesPDF(doc, reportData, options) {
//     const { startDate, endDate, type, paymentMethods, topProducts } = options;

//     // Add pharmacy name as header
//     doc.fontSize(20).text("L.W. Pharmacy", { align: "center" });
//     doc.fontSize(16).text("Sales Report", { align: "center" });
//     doc.moveDown();

//     // Add report metadata
//     doc
//       .fontSize(12)
//       .text(`Report Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`);
//     if (startDate && endDate) {
//       doc.text(`Period: ${startDate} to ${endDate}`);
//     }
//     doc.text(`Generated: ${new Date().toLocaleString()}`);
//     doc.moveDown();

//     // Add summary data
//     doc.fontSize(14).text("Sales Summary", { underline: true });
//     doc.moveDown(0.5);

//     // Calculate summary totals
//     const totalSales = reportData.sales.reduce(
//       (sum, sale) => sum + (sale.value || 0),
//       0
//     );
//     const totalOrders = reportData.sales.length;
//     const averageOrderValue =
//       totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

//     doc.text(`Total Sales: Rs. ${totalSales.toLocaleString()}`);
//     doc.text(`Total Orders: ${totalOrders}`);
//     doc.text(`Average Order Value: Rs. ${averageOrderValue}`);
//     doc.moveDown();

//     // Add payment methods breakdown
//     if (paymentMethods && paymentMethods.length > 0) {
//       doc.fontSize(14).text("Payment Methods", { underline: true });
//       doc.moveDown(0.5);

//       paymentMethods.forEach((method) => {
//         doc.text(
//           `${method.payment_method}: ${
//             method.count
//           } orders, Rs. ${method.total_amount.toLocaleString()}`
//         );
//       });
//       doc.moveDown();
//     }

//     // Add top selling products
//     if (topProducts && topProducts.length > 0) {
//       doc.fontSize(14).text("Top Selling Products", { underline: true });
//       doc.moveDown(0.5);

//       const tableTop = doc.y;
//       const productCol = 50;
//       const quantityCol = 300;
//       const salesCol = 400;

//       // Add table headers
//       doc
//         .font("Helvetica-Bold")
//         .text("Product", productCol, tableTop)
//         .text("Quantity", quantityCol, tableTop)
//         .text("Sales", salesCol, tableTop);

//       doc.moveDown();
//       let rowTop = doc.y;

//       // Add table rows
//       doc.font("Helvetica");
//       topProducts.forEach((product, i) => {
//         // Check if we need a new page
//         if (rowTop > doc.page.height - 100) {
//           doc.addPage();
//           rowTop = 50;
//         }

//         doc
//           .text(product.product_name, productCol, rowTop)
//           .text(product.total_quantity.toString(), quantityCol, rowTop)
//           .text(
//             `Rs. ${product.total_sales.toLocaleString()}`,
//             salesCol,
//             rowTop
//           );

//         rowTop = doc.y + 10;
//         doc.moveDown(0.5);
//       });
//       doc.moveDown();
//     }

//     // Add sales data table
//     doc.addPage();
//     doc.fontSize(14).text("Sales Details", { underline: true });
//     doc.moveDown(0.5);

//     const tableTop = doc.y;
//     const orderIdCol = 50;
//     const dateCol = 150;
//     const customerCol = 250;
//     const statusCol = 350;
//     const valueCol = 450;

//     // Add table headers
//     doc
//       .font("Helvetica-Bold")
//       .text("Order ID", orderIdCol, tableTop)
//       .text("Date", dateCol, tableTop)
//       .text("Customer", customerCol, tableTop)
//       .text("Status", statusCol, tableTop)
//       .text("Value", valueCol, tableTop);

//     doc.moveDown();
//     let rowTop = doc.y;

//     // Add table rows
//     doc.font("Helvetica");
//     reportData.sales.forEach((sale, i) => {
//       // Check if we need a new page
//       if (rowTop > doc.page.height - 100) {
//         doc.addPage();
//         rowTop = 50;

//         // Repeat headers on new page
//         doc
//           .font("Helvetica-Bold")
//           .text("Order ID", orderIdCol, rowTop)
//           .text("Date", dateCol, rowTop)
//           .text("Customer", customerCol, rowTop)
//           .text("Status", statusCol, rowTop)
//           .text("Value", valueCol, rowTop);

//         doc.moveDown();
//         rowTop = doc.y;
//         doc.font("Helvetica");
//       }

//       doc
//         .text(sale.cus_oder_id.toString(), orderIdCol, rowTop)
//         .text(new Date(sale.date).toLocaleDateString(), dateCol, rowTop)
//         .text(sale.customer_name || "Unknown", customerCol, rowTop)
//         .text(sale.status || "N/A", statusCol, rowTop)
//         .text(`Rs. ${sale.value.toLocaleString()}`, valueCol, rowTop);

//       rowTop = doc.y + 10;
//       doc.moveDown(0.5);
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
// }

// module.exports = SalesReportController;

class SalesReportController {
  /**
   * Get sales report data
   */
  static async getSalesReport(req, res) {
    try {
      const {
        startDate,
        endDate,
        type = "daily", // daily, weekly, monthly, yearly
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
        startDate,
        endDate,
        type,
        managerId,
      };

      // Get sales report data
      const reportData = await SalesReportModel.getSalesReport(filters);

      res.status(200).json({
        success: true,
        sales: reportData.sales,
        summary: reportData.summary,
      });
    } catch (error) {
      console.error("Error generating sales report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate sales report",
        error: error.message,
      });
    }
  }

  /**
   * Export sales report as PDF
   */
  static async exportSalesReportPDF(req, res) {
    try {
      const { type = "daily", startDate, endDate } = req.query;

      // Validate required parameters
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Both startDate and endDate are required",
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
        startDate,
        endDate,
        type,
        managerId,
      };

      // Get sales report data
      const reportData = await SalesReportModel.getSalesReport(filters);

      // Get payment methods distribution
      const paymentMethods =
        await SalesReportModel.getPaymentMethodsDistribution(filters);

      // Get top selling products
      const topProducts = await SalesReportModel.getTopSellingProducts({
        ...filters,
        limit: 10,
      });

      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=sales_report_${type}_${startDate}_to_${endDate}.pdf`
      );

      // Pipe PDF to response
      doc.pipe(res);

      // Generate PDF content - FIX: Call the static method with the class name
      SalesReportController.generateSalesPDF(doc, reportData, {
        startDate,
        endDate,
        type,
        paymentMethods,
        topProducts,
      });

      // Finalize PDF
      doc.end();
    } catch (error) {
      console.error("Error exporting sales report PDF:", error);
      // Make sure we only send the error response if headers haven't been sent
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to export sales report as PDF",
          error: error.message,
        });
      }
    }
  }

  /**
   * Generate PDF content for sales report
   */
  static generateSalesPDF(doc, reportData, options) {
    const { startDate, endDate, type, paymentMethods, topProducts } = options;

    // Add pharmacy name as header
    doc.fontSize(20).text("L.W. Pharmacy", { align: "center" });
    doc.fontSize(16).text("Sales Report", { align: "center" });
    doc.moveDown();

    // Add report metadata
    doc
      .fontSize(12)
      .text(`Report Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (startDate && endDate) {
      doc.text(`Period: ${startDate} to ${endDate}`);
    }
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Add summary data
    doc.fontSize(14).text("Sales Summary", { underline: true });
    doc.moveDown(0.5);

    // Calculate summary totals
    const totalSales = reportData.sales.reduce(
      (sum, sale) => sum + (sale.value || 0),
      0
    );
    const totalOrders = reportData.sales.length;
    const averageOrderValue =
      totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

    doc.text(`Total Sales: Rs. ${totalSales.toLocaleString()}`);
    doc.text(`Total Orders: ${totalOrders}`);
    doc.text(`Average Order Value: Rs. ${averageOrderValue}`);
    doc.moveDown();

    // Add payment methods breakdown
    if (paymentMethods && paymentMethods.length > 0) {
      doc.fontSize(14).text("Payment Methods", { underline: true });
      doc.moveDown(0.5);

      paymentMethods.forEach((method) => {
        doc.text(
          `${method.payment_method}: ${
            method.count
          } orders, Rs. ${method.total_amount.toLocaleString()}`
        );
      });
      doc.moveDown();
    }

    // Add top selling products
    if (topProducts && topProducts.length > 0) {
      doc.fontSize(14).text("Top Selling Products", { underline: true });
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const productCol = 50;
      const quantityCol = 300;
      const salesCol = 400;

      // Add table headers
      doc
        .font("Helvetica-Bold")
        .text("Product", productCol, tableTop)
        .text("Quantity", quantityCol, tableTop)
        .text("Sales", salesCol, tableTop);

      doc.moveDown();
      let rowTop = doc.y;

      // Add table rows
      doc.font("Helvetica");
      topProducts.forEach((product, i) => {
        // Check if we need a new page
        if (rowTop > doc.page.height - 100) {
          doc.addPage();
          rowTop = 50;
        }

        doc
          .text(product.product_name, productCol, rowTop)
          .text(product.total_quantity.toString(), quantityCol, rowTop)
          .text(
            `Rs. ${product.total_sales.toLocaleString()}`,
            salesCol,
            rowTop
          );

        rowTop = doc.y + 10;
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // Add sales data table
    doc.addPage();
    doc.fontSize(14).text("Sales Details", { underline: true });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const orderIdCol = 50;
    const dateCol = 150;
    const customerCol = 250;
    const statusCol = 350;
    const valueCol = 450;

    // Add table headers
    doc
      .font("Helvetica-Bold")
      .text("Order ID", orderIdCol, tableTop)
      .text("Date", dateCol, tableTop)
      .text("Customer", customerCol, tableTop)
      .text("Status", statusCol, tableTop)
      .text("Value", valueCol, tableTop);

    doc.moveDown();
    let rowTop = doc.y;

    // Add table rows
    doc.font("Helvetica");
    reportData.sales.forEach((sale, i) => {
      // Check if we need a new page
      if (rowTop > doc.page.height - 100) {
        doc.addPage();
        rowTop = 50;

        // Repeat headers on new page
        doc
          .font("Helvetica-Bold")
          .text("Order ID", orderIdCol, rowTop)
          .text("Date", dateCol, rowTop)
          .text("Customer", customerCol, rowTop)
          .text("Status", statusCol, rowTop)
          .text("Value", valueCol, rowTop);

        doc.moveDown();
        rowTop = doc.y;
        doc.font("Helvetica");
      }

      doc
        .text(sale.cus_oder_id.toString(), orderIdCol, rowTop)
        .text(new Date(sale.date).toLocaleDateString(), dateCol, rowTop)
        .text(sale.customer_name || "Unknown", customerCol, rowTop)
        .text(sale.status || "N/A", statusCol, rowTop)
        .text(`Rs. ${sale.value.toLocaleString()}`, valueCol, rowTop);

      rowTop = doc.y + 10;
      doc.moveDown(0.5);
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
}

module.exports = SalesReportController;
