const SalesReportModel = require("../Models/SalesReportModel");
const PDFDocument = require("pdfkit-table");
const path = require("path");
const fs = require("fs");

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

      // Calculate summary data
      const totalSales = reportData.sales.reduce(
        (sum, sale) => sum + (sale.value || 0),
        0
      );

      const totalOrders = reportData.sales.length;
      const averageOrderValue =
        totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

      // Add summary data to the response
      const summary = {
        totalSales,
        totalOrders,
        averageOrderValue,
        reportType: type,
        period: `${startDate} to ${endDate}`,
        generatedAt: new Date().toISOString(),
      };

      res.status(200).json({
        success: true,
        sales: reportData.sales,
        summary: summary,
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
   * Export sales report as PDF - Simplified Direct Approach
   */
  /**
   * Export sales report as PDF - In-Memory Approach
   */
  static async exportSalesReportPDF(req, res) {
    console.log("====== PDF EXPORT STARTED ======");

    try {
      const { type = "daily", startDate, endDate } = req.query;
      console.log("Parameters:", { type, startDate, endDate });

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
      console.log("Fetching report data...");
      const reportData = await SalesReportModel.getSalesReport(filters);
      console.log(`Fetched ${reportData.sales?.length || 0} sales records`);

      // Validate sales data
      if (!reportData.sales || !Array.isArray(reportData.sales)) {
        console.error("Invalid sales data format:", reportData);
        return res.status(500).json({
          success: false,
          message: "Invalid sales data format returned from database",
        });
      }

      // Set the filename for the download
      const filename = `sales_report_${type}_${startDate}_to_${endDate}.pdf`;

      // Create a new PDF document
      const doc = new PDFDocument({
        margin: 30,
        size: "A4",
        font: "Helvetica",
        bufferPages: true, // Important for multi-page documents
      });

      // Set response headers FIRST before piping
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      // Pipe the PDF directly to the response
      doc.pipe(res);

      // Generate the PDF content
      console.log("Generating PDF content...");
      await generatePDF(doc, reportData.sales, type, startDate, endDate);

      // Finalize the PDF
      doc.end();

      console.log("====== PDF EXPORT COMPLETED ======");
    } catch (error) {
      console.error("Error in PDF export:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to export PDF report",
          error: error.message,
        });
      }
    }
  }

  /**
   * Export sales report as CSV
   */
  static async exportSalesReportCSV(req, res) {
    console.log("====== CSV EXPORT STARTED ======");

    try {
      const { type = "daily", startDate, endDate } = req.query;
      console.log("Parameters:", { type, startDate, endDate });

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
      console.log("Fetching report data...");
      const reportData = await SalesReportModel.getSalesReport(filters);
      console.log(`Fetched ${reportData.sales?.length || 0} sales records`);

      try {
        // Calculate totals
        const totalSales = reportData.sales.reduce(
          (sum, sale) => sum + (sale.value || 0),
          0
        );
        const totalOrders = reportData.sales.length;
        const averageOrderValue =
          totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

        // Generate CSV content
        let csvContent = "L.W. PHARMACY SALES REPORT\r\n\r\n";
        csvContent += `Report Type;${
          type.charAt(0).toUpperCase() + type.slice(1)
        }\r\n`;
        csvContent += `Period;${startDate} to ${endDate}\r\n`;
        csvContent += `Generated;${new Date().toLocaleString()}\r\n\r\n`;

        // Summary section
        csvContent += `SUMMARY\r\n`;
        csvContent += `Total Sales;Rs. ${totalSales}\r\n`;
        csvContent += `Total Orders;${totalOrders}\r\n`;
        csvContent += `Average Order Value;Rs. ${averageOrderValue}\r\n\r\n`;

        // Sales details section
        csvContent += `SALES DETAILS\r\n`;
        csvContent += `Order ID;Date;Customer;Payment Method;Status;Amount\r\n`;

        // Add data rows
        reportData.sales.forEach((sale) => {
          const orderId = sale.cus_oder_id || "";
          const date = sale.date || "";
          // Replace semicolons with spaces to avoid CSV format issues
          const customer = (sale.customer_name || "Unknown").replace(/;/g, " ");
          const paymentMethod = (sale.payment_method || "Unknown").replace(
            /;/g,
            " "
          );
          const status = (sale.status || "Unknown").replace(/;/g, " ");
          const amount = sale.value || 0;

          csvContent += `${orderId};${date};${customer};${paymentMethod};${status};${amount}\r\n`;
        });

        console.log("CSV generated, sending response");

        // Clear any existing headers
        res.removeHeader("Content-Type");
        res.removeHeader("Content-Disposition");

        // Set headers for CSV download
        res.writeHead(200, {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="sales_report_${type}_${startDate}_to_${endDate}.csv"`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        });

        // Send CSV data as a buffer to ensure proper encoding
        res.end(Buffer.from(csvContent, "utf8"));

        console.log("====== CSV EXPORT COMPLETED ======");
      } catch (error) {
        console.error("Error generating CSV:", error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Error generating report",
            error: error.message,
          });
        }
      }
    } catch (error) {
      console.error("Error in CSV export:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to export report",
          error: error.message,
        });
      }
    }
  }
}

/**
 * Generate PDF content with tables
 */
async function generatePDF(doc, salesData, type, startDate, endDate) {
  console.log("Generating PDF content...");

  try {
    // Calculate summary data
    const totalSales = salesData.reduce(
      (sum, sale) => sum + (parseFloat(sale.value) || 0),
      0
    );
    const totalOrders = salesData.length;
    const averageOrderValue =
      totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;

    // Header section
    doc.fontSize(20).text("L.W. Pharmacy", { align: "center" });
    doc.fontSize(16).text("Sales Report", { align: "center" });
    doc.moveDown();

    // Report metadata
    doc.fontSize(12);
    doc.text(`Report Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    doc.text(`Period: ${startDate} to ${endDate}`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Summary table
    console.log("Adding summary table...");
    const summaryTableData = {
      title: "Sales Summary",
      headers: [
        { label: "Metric", property: "metric", width: 200 },
        { label: "Value", property: "value", width: 200 },
      ],
      datas: [
        { metric: "Total Sales", value: `Rs. ${totalSales.toLocaleString()}` },
        { metric: "Total Orders", value: totalOrders.toString() },
        { metric: "Average Order Value", value: `Rs. ${averageOrderValue}` },
      ],
    };

    // Add summary table
    await doc.table(summaryTableData, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
      prepareRow: () => doc.font("Helvetica").fontSize(10),
      divider: {
        header: { disabled: false, width: 1, opacity: 0.5 },
        horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
      },
    });

    doc.moveDown();

    // Prepare sales data table
    console.log("Adding sales details table...");

    // Format the dates for better readability
    const formattedSalesData = salesData.map((sale) => {
      // Safely handle date formatting
      let formattedDate = "N/A";

      try {
        // Make sure we're working with a string or a valid date object
        if (sale.date) {
          if (typeof sale.date === "string") {
            // If it's a string, try to format it nicely
            if (sale.date.indexOf("GMT") !== -1) {
              // Full timestamp with timezone, format as YYYY-MM-DD
              const dateObj = new Date(sale.date);
              if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toISOString().split("T")[0];
              } else {
                formattedDate = sale.date;
              }
            } else {
              // Already formatted or simple date, use as is
              formattedDate = sale.date;
            }
          } else if (sale.date instanceof Date) {
            // If it's a Date object, format it
            formattedDate = sale.date.toISOString().split("T")[0];
          } else {
            // Any other type, convert to string
            formattedDate = String(sale.date);
          }
        }
      } catch (e) {
        console.log("Date parsing error for value:", sale.date, e);
        // Keep 'N/A' if parsing fails
      }

      return {
        orderId: (sale.cus_oder_id || "").toString(),
        date: formattedDate,
        customer: sale.customer_name || "Unknown",
        method: sale.payment_method || "N/A",
        status: sale.status || "N/A",
        amount: `Rs. ${(parseFloat(sale.value) || 0).toLocaleString()}`,
      };
    });

    // Sales details table
    const salesTableData = {
      title: "Sales Details",
      headers: [
        { label: "Order ID", property: "orderId", width: 50 },
        { label: "Date", property: "date", width: 80 },
        { label: "Customer", property: "customer", width: 150 },
        { label: "Method", property: "method", width: 80 },
        { label: "Status", property: "status", width: 80 },
        { label: "Amount", property: "amount", width: 80 },
      ],
      datas: formattedSalesData,
    };

    // Add sales table with options
    await doc.table(salesTableData, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(9),
      prepareRow: (row, indexColumn, indexRow) => {
        doc.font("Helvetica").fontSize(9);
        return indexRow % 2 === 0;
      },
      padding: 5,
      divider: {
        header: { disabled: false, width: 1, opacity: 0.5 },
        horizontal: { disabled: false, width: 0.5, opacity: 0.2 },
      },
    });

    // Add footer to all pages
    console.log("Adding footer...");
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      // Footer with page numbers
      doc
        .fontSize(8)
        .text(
          `Generated by L.W. Pharmacy Management System - Page ${i + 1} of ${
            range.count
          }`,
          30,
          doc.page.height - 30,
          { align: "center" }
        );
    }

    console.log("PDF content generation completed");
    return true;
  } catch (error) {
    console.error("Error in PDF generation:", error);

    // Add error message to PDF to ensure it's not empty
    doc.fontSize(16).text("Error Generating Report", { align: "center" });
    doc.fontSize(12).text(`An error occurred: ${error.message}`);
    doc.text("Please contact system administrator.");

    return false;
  }
}

module.exports = SalesReportController;
