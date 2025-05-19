// // models/report.model.js
// const { db } = require("../db");
// const moment = require("moment");

// class ReportModel {
//   /**
//    * Get sales report data
//    * @param {string} startDate - Start date in YYYY-MM-DD format
//    * @param {string} endDate - End date in YYYY-MM-DD format
//    * @returns {Object} Sales report data
//    */
//   static async getSalesReport(startDate, endDate) {
//     try {
//       // Convert string dates to Date objects
//       const start = new Date(startDate);
//       const end = new Date(endDate);

//       // Get sales summary
//       const [summaryResult] = await db.execute(
//         `
//         SELECT 
//           COUNT(co.cus_oder_id) AS totalOrders,
//           SUM(co.value) AS totalSales,
//           COUNT(DISTINCT co.prescription_id) AS totalPrescriptions
//         FROM cus_oder co
//         WHERE co.created_at BETWEEN ? AND ?
//       `,
//         [start, end]
//       );

//       const summary = summaryResult[0] || {
//         totalOrders: 0,
//         totalSales: 0,
//         totalPrescriptions: 0,
//       };

//       // Calculate average order value
//       summary.averageOrderValue =
//         summary.totalOrders > 0 ? summary.totalSales / summary.totalOrders : 0;

//       // Get top selling product
//       const [topProductResult] = await db.execute(
//         `
//         SELECT 
//           p.pname AS productName,
//           SUM(cp.quantity) AS totalSold
//         FROM customer_product cp
//         JOIN product p ON cp.product_id = p.product_id
//         JOIN cus_oder co ON cp.cus_oder_id = co.cus_oder_id
//         WHERE co.created_at BETWEEN ? AND ?
//         GROUP BY p.product_id
//         ORDER BY totalSold DESC
//         LIMIT 1
//       `,
//         [start, end]
//       );

//       summary.topSellingProduct =
//         topProductResult.length > 0 ? topProductResult[0].productName : "N/A";

//       // Get top selling category
//       const [topCategoryResult] = await db.execute(
//         `
//         SELECT 
//           pc.name AS categoryName,
//           SUM(cp.quantity) AS totalSold
//         FROM customer_product cp
//         JOIN product p ON cp.product_id = p.product_id
//         JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
//         JOIN cus_oder co ON cp.cus_oder_id = co.cus_oder_id
//         WHERE co.created_at BETWEEN ? AND ?
//         GROUP BY pc.product_cato_id
//         ORDER BY totalSold DESC
//         LIMIT 1
//       `,
//         [start, end]
//       );

//       summary.topSellingCategory =
//         topCategoryResult.length > 0
//           ? topCategoryResult[0].categoryName
//           : "N/A";

//       // Get daily sales data
//       const [dailyData] = await db.execute(
//         `
//         SELECT 
//           DATE(co.created_at) AS date,
//           SUM(co.value) AS sales,
//           COUNT(co.cus_oder_id) AS orders
//         FROM cus_oder co
//         WHERE co.created_at BETWEEN ? AND ?
//         GROUP BY DATE(co.created_at)
//         ORDER BY date
//       `,
//         [start, end]
//       );

//       // Get sales by category
//       const [categoryData] = await db.execute(
//         `
//         SELECT 
//           pc.name,
//           SUM(cp.quantity * cp.price) AS value
//         FROM customer_product cp
//         JOIN product p ON cp.product_id = p.product_id
//         JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
//         JOIN cus_oder co ON cp.cus_oder_id = co.cus_oder_id
//         WHERE co.created_at BETWEEN ? AND ?
//         GROUP BY pc.product_cato_id
//         ORDER BY value DESC
//       `,
//         [start, end]
//       );

//       // Get top selling products
//       const [topProducts] = await db.execute(
//         `
//         SELECT 
//           p.pname AS name,
//           SUM(cp.quantity) AS sold,
//           SUM(cp.quantity * cp.price) AS revenue
//         FROM customer_product cp
//         JOIN product p ON cp.product_id = p.product_id
//         JOIN cus_oder co ON cp.cus_oder_id = co.cus_oder_id
//         WHERE co.created_at BETWEEN ? AND ?
//         GROUP BY p.product_id
//         ORDER BY sold DESC
//         LIMIT 5
//       `,
//         [start, end]
//       );

//       return {
//         title: "Sales Report",
//         summary,
//         dailyData,
//         categoryData,
//         topProducts,
//       };
//     } catch (error) {
//       console.error("Error getting sales report:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get inventory report data
//    * @returns {Object} Inventory report data
//    */
//   static async getInventoryReport() {
//     try {
//       // Get inventory summary
//       const [totalProductsResult] = await db.execute(`
//         SELECT COUNT(*) AS totalProducts FROM product
//       `);

//       const [lowStockResult] = await db.execute(`
//         SELECT COUNT(*) AS lowStockItems FROM product 
//         WHERE quantity > 0 AND quantity <= treshold
//       `);

//       const [outOfStockResult] = await db.execute(`
//         SELECT COUNT(*) AS outOfStockItems FROM product 
//         WHERE quantity = 0
//       `);

//       const [expiringResult] = await db.execute(`
//         SELECT COUNT(*) AS expiringItems FROM product 
//         WHERE exp_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
//       `);

//       const [totalValueResult] = await db.execute(`
//         SELECT SUM(quantity * price) AS totalValue FROM product
//       `);

//       const summary = {
//         totalProducts: totalProductsResult[0].totalProducts,
//         lowStockItems: lowStockResult[0].lowStockItems,
//         outOfStockItems: outOfStockResult[0].outOfStockItems,
//         expiringItems: expiringResult[0].expiringItems,
//         totalValue: totalValueResult[0].totalValue || 0,
//       };

//       // Get inventory by category
//       const [categoryData] = await db.execute(`
//         SELECT 
//           pc.name,
//           COUNT(p.product_id) AS value,
//           SUM(p.quantity * p.price) AS stockValue
//         FROM product p
//         JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
//         GROUP BY pc.product_cato_id
//         ORDER BY stockValue DESC
//       `);

//       // Get low stock items
//       const [lowStockItems] = await db.execute(`
//         SELECT 
//           p.product_id AS id,
//           p.pname AS name,
//           pc.name AS category,
//           p.quantity AS current,
//           p.treshold AS threshold
//         FROM product p
//         JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
//         WHERE p.quantity > 0 AND p.quantity <= p.treshold
//         ORDER BY (p.quantity / p.treshold) ASC
//         LIMIT 10
//       `);

//       // Get expiring items
//       const [expiringItems] = await db.execute(`
//         SELECT 
//           p.product_id AS id,
//           p.pname AS name,
//           pc.name AS category,
//           p.quantity,
//           DATE_FORMAT(p.exp_date, '%Y-%m-%d') AS expiry
//         FROM product p
//         JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
//         WHERE p.exp_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
//         ORDER BY p.exp_date ASC
//         LIMIT 10
//       `);

//       return {
//         title: "Inventory Report",
//         summary,
//         categoryData,
//         lowStockItems,
//         expiringItems,
//       };
//     } catch (error) {
//       console.error("Error getting inventory report:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get prescription report data
//    * @param {string} startDate - Start date in YYYY-MM-DD format
//    * @param {string} endDate - End date in YYYY-MM-DD format
//    * @returns {Object} Prescription report data
//    */
//   static async getPrescriptionReport(startDate, endDate) {
//     try {
//       // Convert string dates to Date objects
//       const start = new Date(startDate);
//       const end = new Date(endDate);

//       // Get prescription summary
//       const [summary] = await db.execute(
//         `
//         SELECT 
//           COUNT(*) AS totalPrescriptions,
//           SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pendingPrescriptions,
//           SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completedPrescriptions,
//           SUM(CASE WHEN status = 'Not available' THEN 1 ELSE 0 END) AS rejectedPrescriptions
//         FROM prescription
//         WHERE uploaded_at BETWEEN ? AND ?
//       `,
//         [start, end]
//       );

//       // Add average processing time (placeholder - would need additional data in real DB)
//       summary[0].averageProcessingTime = "4.2 hours";

//       // Get prescriptions by status
//       const [statusData] = await db.execute(
//         `
//         SELECT 
//           status AS name, 
//           COUNT(*) AS value
//         FROM prescription
//         WHERE uploaded_at BETWEEN ? AND ?
//         GROUP BY status
//       `,
//         [start, end]
//       );

//       // Get recent prescriptions
//       const [recentPrescriptions] = await db.execute(
//         `
//         SELECT 
//           p.prescription_id AS id,
//           c.name AS customer,
//           p.status,
//           DATE_FORMAT(p.uploaded_at, '%Y-%m-%d') AS date,
//           COUNT(pp.product_id) AS items,
//           p.value
//         FROM prescription p
//         JOIN customer c ON p.customer_id = c.customer_id
//         LEFT JOIN prescription_product pp ON p.prescription_id = pp.prescription_id
//         WHERE p.uploaded_at BETWEEN ? AND ?
//         GROUP BY p.prescription_id
//         ORDER BY p.uploaded_at DESC
//         LIMIT 10
//       `,
//         [start, end]
//       );

//       // Get prescription timeline data (status distribution)
//       const [timelineData] = await db.execute(
//         `
//         SELECT 
//           status, 
//           COUNT(*) AS count
//         FROM prescription
//         WHERE uploaded_at BETWEEN ? AND ?
//         GROUP BY status
//       `,
//         [start, end]
//       );

//       return {
//         title: "Prescription Analysis Report",
//         summary: summary[0],
//         statusData,
//         recentPrescriptions,
//         timelineData,
//       };
//     } catch (error) {
//       console.error("Error getting prescription report:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get supplier report data
//    * @param {string} startDate - Start date in YYYY-MM-DD format
//    * @param {string} endDate - End date in YYYY-MM-DD format
//    * @returns {Object} Supplier report data
//    */
//   static async getSupplierReport(startDate, endDate) {
//     try {
//       // Convert string dates to Date objects
//       const start = new Date(startDate);
//       const end = new Date(endDate);

//       // Get supplier summary
//       const [totalSuppliersResult] = await db.execute(`
//         SELECT COUNT(*) AS totalSuppliers FROM supplier
//       `);

//       // For active suppliers, we'd need criteria for what makes a supplier "active"
//       // This is a placeholder that counts suppliers with recent orders
//       const [activeSuppliersResult] = await db.execute(
//         `
//         SELECT COUNT(DISTINCT sup_id) AS activeSuppliers
//         FROM s_oder
//         WHERE created_at BETWEEN ? AND ?
//       `,
//         [start, end]
//       );

//       // Total purchases from suppliers
//       const [totalPurchasesResult] = await db.execute(
//         `
//         SELECT SUM(sp.price * sp.quantity) AS totalPurchases
//         FROM supplier_product sp
//         JOIN s_oder so ON sp.oder_id = so.oder_id
//         WHERE so.created_at BETWEEN ? AND ?
//       `,
//         [start, end]
//       );

//       const summary = {
//         totalSuppliers: totalSuppliersResult[0].totalSuppliers,
//         activeSuppliers: activeSuppliersResult[0].activeSuppliers || 0,
//         totalPurchases: totalPurchasesResult[0].totalPurchases || 0,
//         averageDeliveryTime: "3.5 days", // Placeholder - would need delivery tracking in actual DB
//       };

//       // Get supplier performance data
//       const [supplierData] = await db.execute(
//         `
//         SELECT 
//           CONCAT(s.F_name, ' ', s.L_name) AS name,
//           COUNT(DISTINCT so.oder_id) AS orders,
//           SUM(sp.price * sp.quantity) AS value,
//           COUNT(DISTINCT so.oder_id) AS onTime, -- Placeholder, would need actual delivery status
//           0 AS delayed -- Placeholder, would need actual delivery status
//         FROM supplier s
//         JOIN s_oder so ON s.sup_id = so.sup_id
//         JOIN supplier_product sp ON so.oder_id = sp.oder_id
//         WHERE so.created_at BETWEEN ? AND ?
//         GROUP BY s.sup_id
//         ORDER BY value DESC
//         LIMIT 5
//       `,
//         [start, end]
//       );

//       // Update supplier data with some placeholder delayed orders
//       supplierData.forEach((supplier) => {
//         // Simulate some delayed orders (10-20% of total orders)
//         const delayedCount = Math.floor(
//           supplier.orders * (Math.random() * 0.1 + 0.1)
//         );
//         supplier.onTime = supplier.orders - delayedCount;
//         supplier.delayed = delayedCount;
//       });

//       // Delivery performance (on time vs delayed)
//       // This is a placeholder aggregation of the above data
//       const deliveryPerformance = [
//         {
//           name: "On Time",
//           value: supplierData.reduce((sum, s) => sum + s.onTime, 0),
//         },
//         {
//           name: "Delayed",
//           value: supplierData.reduce((sum, s) => sum + s.delayed, 0),
//         },
//       ];

//       // Get product categories supplied
//       const [productCategories] = await db.execute(
//         `
//         SELECT 
//           pc.name AS category,
//           COUNT(DISTINCT sp.sup_id) AS suppliers,
//           COUNT(DISTINCT p.product_id) AS products
//         FROM supplier_product sp
//         JOIN product p ON sp.product_id = p.product_id
//         JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
//         JOIN s_oder so ON sp.oder_id = so.oder_id
//         WHERE so.created_at BETWEEN ? AND ?
//         GROUP BY pc.product_cato_id
//         ORDER BY suppliers DESC
//       `,
//         [start, end]
//       );

//       return {
//         title: "Supplier Performance Report",
//         summary,
//         supplierData,
//         deliveryPerformance,
//         productCategories,
//       };
//     } catch (error) {
//       console.error("Error getting supplier report:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get customer report data
//    * @param {string} startDate - Start date in YYYY-MM-DD format
//    * @param {string} endDate - End date in YYYY-MM-DD format
//    * @returns {Object} Customer report data
//    */
//   static async getCustomerReport(startDate, endDate) {
//     try {
//       // Convert string dates to Date objects
//       const start = new Date(startDate);
//       const end = new Date(endDate);

//       // Get customer summary
//       const [totalCustomersResult] = await db.execute(`
//         SELECT COUNT(*) AS totalCustomers FROM customer
//       `);

//       // New customers in the period
//       const [newCustomersResult] = await db.execute(
//         `
//         SELECT COUNT(*) AS newCustomers
//         FROM customer
//         WHERE customer_id NOT IN (
//           SELECT DISTINCT customer_id FROM cus_oder WHERE created_at < ?
//         )
//         AND customer_id IN (
//           SELECT DISTINCT customer_id FROM cus_oder WHERE created_at BETWEEN ? AND ?
//         )
//       `,
//         [start, start, end]
//       );

//       // Active customers (made at least one order in the period)
//       const [activeCustomersResult] = await db.execute(
//         `
//         SELECT COUNT(DISTINCT customer_id) AS activeCustomers
//         FROM cus_oder
//         WHERE created_at BETWEEN ? AND ?
//       `,
//         [start, end]
//       );

//       // Repeat customers (made more than one order in the period)
//       const [repeatCustomersResult] = await db.execute(
//         `
//         SELECT COUNT(*) AS repeatCustomers
//         FROM (
//           SELECT customer_id
//           FROM cus_oder
//           WHERE created_at BETWEEN ? AND ?
//           GROUP BY customer_id
//           HAVING COUNT(*) > 1
//         ) AS repeats
//       `,
//         [start, end]
//       );

//       const summary = {
//         totalCustomers: totalCustomersResult[0].totalCustomers,
//         newCustomers: newCustomersResult[0].newCustomers || 0,
//         activeCustomers: activeCustomersResult[0].activeCustomers || 0,
//         repeatCustomers: repeatCustomersResult[0].repeatCustomers || 0,
//       };

//       // Get monthly customer data
//       // This query groups customers by month within the date range
//       const [monthlyData] = await db.execute(
//         `
//         SELECT 
//           DATE_FORMAT(created_at, '%Y-%m') AS month,
//           COUNT(DISTINCT customer_id) AS customers,
//           SUM(CASE 
//             WHEN customer_id NOT IN (SELECT DISTINCT customer_id FROM cus_oder WHERE created_at < STR_TO_DATE(CONCAT(DATE_FORMAT(created_at, '%Y-%m'), '-01'), '%Y-%m-%d'))
//             THEN 1 ELSE 0
//           END) AS newCustomers
//         FROM cus_oder
//         WHERE created_at BETWEEN ? AND ?
//         GROUP BY month
//         ORDER BY month
//       `,
//         [start, end]
//       );

//       // Transform month format
//       monthlyData.forEach((data) => {
//         data.month = moment(data.month + "-01").format("MMM");
//       });

//       // Get top customers
//       const [topCustomers] = await db.execute(
//         `
//         SELECT 
//           c.name,
//           COUNT(co.cus_oder_id) AS orders,
//           SUM(co.value) AS spent
//         FROM cus_oder co
//         JOIN customer c ON co.customer_id = c.customer_id
//         WHERE co.created_at BETWEEN ? AND ?
//         GROUP BY co.customer_id
//         ORDER BY spent DESC
//         LIMIT 5
//       `,
//         [start, end]
//       );

//       // Get purchase frequency
//       const [purchaseFrequency] = await db.execute(
//         `
//         SELECT 
//           CASE 
//             WHEN order_count = 1 THEN 'Once'
//             WHEN order_count BETWEEN 2 AND 5 THEN '2-5 times'
//             WHEN order_count BETWEEN 6 AND 10 THEN '6-10 times'
//             ELSE '11+ times'
//           END AS name,
//           COUNT(*) AS value
//         FROM (
//           SELECT customer_id, COUNT(*) AS order_count
//           FROM cus_oder
//           WHERE created_at BETWEEN ? AND ?
//           GROUP BY customer_id
//         ) AS order_counts
//         GROUP BY name
//         ORDER BY MIN(order_count)
//       `,
//         [start, end]
//       );

//       return {
//         title: "Customer Analysis Report",
//         summary,
//         monthlyData,
//         topCustomers,
//         purchaseFrequency,
//       };
//     } catch (error) {
//       console.error("Error getting customer report:", error);
//       throw error;
//     }
//   }
// }

// module.exports = ReportModel;
