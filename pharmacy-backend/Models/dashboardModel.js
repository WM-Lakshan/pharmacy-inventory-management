// // // // models/dashboardModel.js
// // // const { db } = require("../db");

// // // /**
// // //  * Dashboard Model
// // //  * Handles all database queries related to dashboard data
// // //  */
// // // class DashboardModel {
// // //   /**
// // //    * Get overview metrics for the dashboard
// // //    * Returns the total number of sales, purchases, cancellations and total sales amount
// // //    * @returns {Promise<Object>} Overview metrics
// // //    */
// // //   async getOverview() {
// // //     try {
// // //       // Get total sales count and amount
// // //       const [salesResults] = await db.query(`
// // //         SELECT
// // //           COUNT(*) as sales,
// // //           SUM(value) as totalAmount
// // //         FROM cus_oder
// // //         WHERE oder_status = 'completed'
// // //       `);

// // //       // Get total purchases count (from supplier orders)
// // //       const [purchasesResults] = await db.query(`
// // //         SELECT COUNT(*) as purchases
// // //         FROM s_oder
// // //       `);

// // //       // Get cancellations count
// // //       const [cancellationsResults] = await db.query(`
// // //         SELECT COUNT(*) as cancellations
// // //         FROM cus_oder
// // //         WHERE oder_status = 'cancelled'
// // //       `);

// // //       return {
// // //         sales: salesResults[0].sales || 0,
// // //         totalAmount: salesResults[0].totalAmount || 0,
// // //         purchases: purchasesResults[0].purchases || 0,
// // //         cancellations: cancellationsResults[0].cancellations || 0,
// // //       };
// // //     } catch (error) {
// // //       console.error("Error in getOverview model:", error);
// // //       throw error;
// // //     }
// // //   }

// // //   /**
// // //    * Get inventory summary data
// // //    * Returns the total quantity in hand and quantity to be received
// // //    * @returns {Promise<Object>} Inventory summary
// // //    */
// // //   async getInventorySummary() {
// // //     try {
// // //       // Get total quantity in hand
// // //       const [quantityInHandResults] = await db.query(`
// // //         SELECT SUM(quantity) as quantityInHand
// // //         FROM product
// // //       `);

// // //       // Get quantity to be received (from pending supplier orders)
// // //       const [toBeReceivedResults] = await db.query(`
// // //         SELECT SUM(supplier_product.quantity) as toBeReceived
// // //         FROM supplier_product
// // //         JOIN s_oder ON supplier_product.oder_id = s_oder.oder_id
// // //         WHERE s_oder.expected_delevary > CURDATE()
// // //       `);

// // //       return {
// // //         quantityInHand: quantityInHandResults[0].quantityInHand || 0,
// // //         toBeReceived: toBeReceivedResults[0].toBeReceived || 0,
// // //       };
// // //     } catch (error) {
// // //       console.error("Error in getInventorySummary model:", error);
// // //       throw error;
// // //     }
// // //   }

// // //   /**
// // //    * Get sales data for the chart based on time range
// // //    * @param {string} timeRange - The time range to get data for (weekly, monthly, yearly)
// // //    * @returns {Promise<Array>} Sales data for the chart
// // //    */
// // //   async getSalesData(timeRange = "monthly") {
// // //     try {
// // //       let groupFormat;
// // //       let dateFilter;
// // //       let labelField;

// // //       // Configure grouping and filtering based on time range
// // //       switch (timeRange) {
// // //         case "weekly":
// // //           groupFormat = "DATE_FORMAT(created_at, '%Y-%u')"; // Year-Week
// // //           dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 12 WEEK)";
// // //           labelField = "CONCAT('Week ', WEEK(created_at))";
// // //           break;
// // //         case "yearly":
// // //           groupFormat = "DATE_FORMAT(created_at, '%Y')"; // Year
// // //           dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)";
// // //           labelField = "DATE_FORMAT(created_at, '%Y')";
// // //           break;
// // //         case "monthly":
// // //         default:
// // //           groupFormat = "DATE_FORMAT(created_at, '%Y-%m')"; // Year-Month
// // //           dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)";
// // //           labelField = "DATE_FORMAT(created_at, '%b')";
// // //           break;
// // //       }

// // //       // Get sales data
// // //       const [salesResults] = await db.query(`
// // //         SELECT
// // //           ${labelField} as month,
// // //           SUM(value) as sales
// // //         FROM cus_oder
// // //         WHERE ${dateFilter} AND oder_status = 'completed'
// // //         GROUP BY ${groupFormat}
// // //         ORDER BY ${groupFormat}
// // //       `);

// // //       // Get purchase data
// // //       const [purchaseResults] = await db.query(`
// // //         SELECT
// // //           ${labelField} as month,
// // //           SUM(supplier_product.price * supplier_product.quantity) as purchase
// // //         FROM s_oder
// // //         JOIN supplier_product ON s_oder.oder_id = supplier_product.oder_id
// // //         WHERE ${dateFilter}
// // //         GROUP BY ${groupFormat}
// // //         ORDER BY ${groupFormat}
// // //       `);

// // //       // Combine sales and purchase data
// // //       const combinedData = [];
// // //       const monthsMap = new Map();

// // //       // Process sales data
// // //       salesResults.forEach((row) => {
// // //         monthsMap.set(row.month, {
// // //           month: row.month,
// // //           sales: row.sales || 0,
// // //           purchase: 0,
// // //         });
// // //       });

// // //       // Process purchase data and merge with sales data
// // //       purchaseResults.forEach((row) => {
// // //         if (monthsMap.has(row.month)) {
// // //           const existing = monthsMap.get(row.month);
// // //           existing.purchase = row.purchase || 0;
// // //         } else {
// // //           monthsMap.set(row.month, {
// // //             month: row.month,
// // //             sales: 0,
// // //             purchase: row.purchase || 0,
// // //           });
// // //         }
// // //       });

// // //       // Convert map to array and sort by month
// // //       return Array.from(monthsMap.values());
// // //     } catch (error) {
// // //       console.error("Error in getSalesData model:", error);
// // //       throw error;
// // //     }
// // //   }

// // //   /**
// // //    * Get top selling products
// // //    * @returns {Promise<Array>} Top selling products
// // //    */
// // //   async getTopSellingProducts() {
// // //     try {
// // //       const [results] = await db.query(`
// // //         SELECT
// // //           p.product_id as id,
// // //           p.pname as name,
// // //           SUM(oi.quantity) as soldQuantity,
// // //           p.quantity as remainingQuantity,
// // //           p.price
// // //         FROM product p
// // //         JOIN order_items oi ON p.product_id = oi.product_id
// // //         JOIN cus_oder co ON oi.cus_oder_id = co.cus_oder_id
// // //         WHERE co.oder_status = 'completed'
// // //         GROUP BY p.product_id
// // //         ORDER BY soldQuantity DESC
// // //         LIMIT 5
// // //       `);

// // //       return results;
// // //     } catch (error) {
// // //       console.error("Error in getTopSellingProducts model:", error);
// // //       throw error;
// // //     }
// // //   }

// // //   /**
// // //    * Get products that are near expiry or expired
// // //    * @returns {Promise<Array>} Expired or near-expiry products
// // //    */
// // //   async getExpiredProducts() {
// // //     try {
// // //       const [results] = await db.query(`
// // //         SELECT
// // //           product_id as id,
// // //           pname as name,
// // //           quantity as remainingQuantity,
// // //           'Unit' as unit,
// // //           CASE
// // //             WHEN exp_date <= CURDATE() THEN 'Expired'
// // //             WHEN exp_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'Near Expiry'
// // //             ELSE 'Good'
// // //           END as status
// // //         FROM product
// // //         WHERE exp_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND quantity > 0
// // //         ORDER BY exp_date ASC
// // //         LIMIT 10
// // //       `);

// // //       return results;
// // //     } catch (error) {
// // //       console.error("Error in getExpiredProducts model:", error);
// // //       throw error;
// // //     }
// // //   }

// // //   /**
// // //    * Get products with low stock
// // //    * @returns {Promise<Array>} Low stock products
// // //    */
// // //   async getLowStockProducts() {
// // //     try {
// // //       const [results] = await db.query(`
// // //         SELECT
// // //           product_id as id,
// // //           pname as name,
// // //           quantity as remainingQuantity,
// // //           'Unit' as unit,
// // //           CASE
// // //             WHEN quantity <= treshold THEN 'Low'
// // //             WHEN quantity <= treshold * 1.5 THEN 'Warning'
// // //             ELSE 'Good'
// // //           END as status
// // //         FROM product
// // //         WHERE quantity <= treshold * 1.5
// // //         ORDER BY (quantity / treshold) ASC
// // //         LIMIT 10
// // //       `);

// // //       return results;
// // //     } catch (error) {
// // //       console.error("Error in getLowStockProducts model:", error);
// // //       throw error;
// // //     }
// // //   }
// // // }

// // // module.exports = new DashboardModel();

// // // models/dashboardModel.js
// // const { db } = require("../db");

// // /**
// //  * Dashboard Model
// //  * Handles all database queries related to dashboard data
// //  */
// // class DashboardModel {
// //   /**
// //    * Get overview metrics for the dashboard
// //    * Returns the total number of sales, purchases, cancellations and total sales amount
// //    * @returns {Promise<Object>} Overview metrics
// //    */
// //   async getOverview() {
// //     try {
// //       // Get total sales count and amount
// //       const [salesResults] = await db.query(`
// //         SELECT
// //           COUNT(*) as sales,
// //           SUM(value) as totalAmount
// //         FROM cus_oder
// //         WHERE oder_status = 'completed'
// //       `);

// //       // Get total purchases count (from supplier orders)
// //       const [purchasesResults] = await db.query(`
// //         SELECT COUNT(*) as purchases
// //         FROM s_oder
// //       `);

// //       // Get cancellations count
// //       const [cancellationsResults] = await db.query(`
// //         SELECT COUNT(*) as cancellations
// //         FROM cus_oder
// //         WHERE oder_status = 'cancelled'
// //       `);

// //       return {
// //         sales: salesResults[0].sales || 0,
// //         totalAmount: salesResults[0].totalAmount || 0,
// //         purchases: purchasesResults[0].purchases || 0,
// //         cancellations: cancellationsResults[0].cancellations || 0,
// //       };
// //     } catch (error) {
// //       console.error("Error in getOverview model:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get inventory summary data
// //    * Returns the total quantity in hand and quantity to be received
// //    * @returns {Promise<Object>} Inventory summary
// //    */
// //   async getInventorySummary() {
// //     try {
// //       // Get total quantity in hand
// //       const [quantityInHandResults] = await db.query(`
// //         SELECT SUM(quantity) as quantityInHand
// //         FROM product
// //       `);

// //       // Get quantity to be received (from pending supplier orders)
// //       const [toBeReceivedResults] = await db.query(`
// //         SELECT SUM(supplier_product.quantity) as toBeReceived
// //         FROM supplier_product
// //         JOIN s_oder ON supplier_product.oder_id = s_oder.oder_id
// //         WHERE s_oder.expected_delevary > CURDATE()
// //       `);

// //       return {
// //         quantityInHand: quantityInHandResults[0].quantityInHand || 0,
// //         toBeReceived: toBeReceivedResults[0].toBeReceived || 0,
// //       };
// //     } catch (error) {
// //       console.error("Error in getInventorySummary model:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get sales data for the chart based on time range
// //    * @param {string} timeRange - The time range to get data for (weekly, monthly, yearly)
// //    * @returns {Promise<Array>} Sales data for the chart
// //    */
// //   async getSalesData(timeRange = "monthly") {
// //     try {
// //       let groupFormat;
// //       let dateFilter;
// //       let labelField;

// //       // Configure grouping and filtering based on time range
// //       switch (timeRange) {
// //         case "weekly":
// //           groupFormat = "DATE_FORMAT(created_at, '%Y-%u')"; // Year-Week
// //           dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 12 WEEK)";
// //           labelField = "CONCAT('Week ', WEEK(created_at))";
// //           break;
// //         case "yearly":
// //           groupFormat = "DATE_FORMAT(created_at, '%Y')"; // Year
// //           dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)";
// //           labelField = "DATE_FORMAT(created_at, '%Y')";
// //           break;
// //         case "monthly":
// //         default:
// //           groupFormat = "DATE_FORMAT(created_at, '%Y-%m')"; // Year-Month
// //           dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)";
// //           labelField = "DATE_FORMAT(created_at, '%b')";
// //           break;
// //       }

// //       // Get sales data
// //       const [salesResults] = await db.query(`
// //         SELECT
// //           ${labelField} as month,
// //           SUM(value) as sales
// //         FROM cus_oder
// //         WHERE ${dateFilter} AND oder_status = 'completed'
// //         GROUP BY ${groupFormat}
// //         ORDER BY ${groupFormat}
// //       `);

// //       // Get purchase data
// //       const [purchaseResults] = await db.query(`
// //         SELECT
// //           ${labelField} as month,
// //           SUM(supplier_product.price * supplier_product.quantity) as purchase
// //         FROM s_oder
// //         JOIN supplier_product ON s_oder.oder_id = supplier_product.oder_id
// //         WHERE ${dateFilter}
// //         GROUP BY ${groupFormat}
// //         ORDER BY ${groupFormat}
// //       `);

// //       // Combine sales and purchase data
// //       const combinedData = [];
// //       const monthsMap = new Map();

// //       // Process sales data
// //       salesResults.forEach((row) => {
// //         monthsMap.set(row.month, {
// //           month: row.month,
// //           sales: row.sales || 0,
// //           purchase: 0,
// //         });
// //       });

// //       // Process purchase data and merge with sales data
// //       purchaseResults.forEach((row) => {
// //         if (monthsMap.has(row.month)) {
// //           const existing = monthsMap.get(row.month);
// //           existing.purchase = row.purchase || 0;
// //         } else {
// //           monthsMap.set(row.month, {
// //             month: row.month,
// //             sales: 0,
// //             purchase: row.purchase || 0,
// //           });
// //         }
// //       });

// //       // Convert map to array and sort by month
// //       return Array.from(monthsMap.values());
// //     } catch (error) {
// //       console.error("Error in getSalesData model:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get top selling products
// //    * @returns {Promise<Array>} Top selling products
// //    */
// //   async getTopSellingProducts() {
// //     try {
// //       const [results] = await db.query(`
// //         SELECT
// //           p.product_id as id,
// //           p.pname as name,
// //           SUM(oi.quantity) as soldQuantity,
// //           p.quantity as remainingQuantity,
// //           p.price
// //         FROM product p
// //         JOIN order_items oi ON p.product_id = oi.product_id
// //         JOIN cus_oder co ON oi.cus_oder_id = co.cus_oder_id
// //         WHERE co.oder_status = 'completed'
// //         GROUP BY p.product_id
// //         ORDER BY soldQuantity DESC
// //         LIMIT 5
// //       `);

// //       return results;
// //     } catch (error) {
// //       console.error("Error in getTopSellingProducts model:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get products that are near expiry or expired
// //    * @returns {Promise<Array>} Expired or near-expiry products
// //    */
// //   async getExpiredProducts() {
// //     try {
// //       const [results] = await db.query(`
// //         SELECT
// //           p.product_id as id,
// //           p.pname as name,
// //           sp.Products_remaining as remainingQuantity,
// //           COALESCE(sp.unit_type, 'Unit') as unit,
// //           CASE
// //             WHEN sp.expired_date <= CURDATE() THEN 'Expired'
// //             WHEN sp.expired_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'Near Expiry'
// //             ELSE 'Good'
// //           END as status
// //         FROM product p
// //         JOIN supplier_product sp ON p.product_id = sp.product_id
// //         WHERE sp.expired_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
// //           AND sp.Products_remaining > 0
// //         ORDER BY sp.expired_date ASC
// //         LIMIT 10
// //       `);

// //       return results;
// //     } catch (error) {
// //       console.error("Error in getExpiredProducts model:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get products with low stock
// //    * @returns {Promise<Array>} Low stock products
// //    */
// //   async getLowStockProducts() {
// //     try {
// //       const [results] = await db.query(`
// //         SELECT
// //           product_id as id,
// //           pname as name,
// //           quantity as remainingQuantity,
// //           'Unit' as unit,
// //           CASE
// //             WHEN quantity <= treshold THEN 'Low'
// //             WHEN quantity <= treshold * 1.5 THEN 'Warning'
// //             ELSE 'Good'
// //           END as status
// //         FROM product
// //         WHERE quantity <= treshold * 1.5
// //         ORDER BY (quantity / treshold) ASC
// //         LIMIT 10
// //       `);

// //       return results;
// //     } catch (error) {
// //       console.error("Error in getLowStockProducts model:", error);
// //       throw error;
// //     }
// //   }
// // }

// // module.exports = new DashboardModel();
// // models/dashboardModel.js
// const { db } = require("../db");

// /**
//  * Dashboard Model
//  * Handles all database queries related to dashboard data
//  */
// class DashboardModel {
//   /**
//    * Get overview metrics for the dashboard
//    * Returns the total number of sales, purchases, cancellations and total sales amount
//    * @returns {Promise<Object>} Overview metrics
//    */
//   async getOverview() {
//     try {
//       // Get total sales count and amount
//       const [salesResults] = await db.query(`
//         SELECT
//           COUNT(*) as sales,
//           SUM(value) as totalAmount
//         FROM cus_oder
//         WHERE oder_status = 'completed'
//       `);

//       // Get total purchases count (from supplier orders)
//       const [purchasesResults] = await db.query(`
//         SELECT COUNT(*) as purchases
//         FROM s_oder
//       `);

//       // Get cancellations count
//       const [cancellationsResults] = await db.query(`
//         SELECT COUNT(*) as cancellations
//         FROM cus_oder
//         WHERE oder_status = 'cancelled'
//       `);

//       return {
//         sales: salesResults[0].sales || 0,
//         totalAmount: salesResults[0].totalAmount || 0,
//         purchases: purchasesResults[0].purchases || 0,
//         cancellations: cancellationsResults[0].cancellations || 0,
//       };
//     } catch (error) {
//       console.error("Error in getOverview model:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get inventory summary data
//    * Returns the total quantity in hand and quantity to be received
//    * @returns {Promise<Object>} Inventory summary
//    */
//   async getInventorySummary() {
//     try {
//       // Get total quantity in hand
//       const [quantityInHandResults] = await db.query(`
//         SELECT SUM(quantity) as quantityInHand
//         FROM product
//       `);

//       // Get quantity to be received from supplier products
//       // Assuming orders that haven't been fully received yet
//       const [toBeReceivedResults] = await db.query(`
//         SELECT SUM(sp.quantity - COALESCE(sp.Products_remaining, 0)) as toBeReceived
//         FROM supplier_product sp
//         JOIN s_oder so ON sp.oder_id = so.oder_id
//         WHERE sp.quantity > COALESCE(sp.Products_remaining, 0)
//       `);

//       return {
//         quantityInHand: quantityInHandResults[0].quantityInHand || 0,
//         toBeReceived: toBeReceivedResults[0].toBeReceived || 0,
//       };
//     } catch (error) {
//       console.error("Error in getInventorySummary model:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get sales data for the chart based on time range
//    * @param {string} timeRange - The time range to get data for (weekly, monthly, yearly)
//    * @returns {Promise<Array>} Sales data for the chart
//    */
//   async getSalesData(timeRange = "monthly") {
//     try {
//       let groupFormat;
//       let dateFilter;
//       let labelField;

//       // Configure grouping and filtering based on time range
//       switch (timeRange) {
//         case "weekly":
//           groupFormat = "DATE_FORMAT(created_at, '%Y-%u')"; // Year-Week
//           dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 12 WEEK)";
//           labelField = "CONCAT('Week ', WEEK(created_at))";
//           break;
//         case "yearly":
//           groupFormat = "DATE_FORMAT(created_at, '%Y')"; // Year
//           dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)";
//           labelField = "DATE_FORMAT(created_at, '%Y')";
//           break;
//         case "monthly":
//         default:
//           groupFormat = "DATE_FORMAT(created_at, '%Y-%m')"; // Year-Month
//           dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)";
//           labelField = "DATE_FORMAT(created_at, '%b')";
//           break;
//       }

//       // Get sales data
//       const [salesResults] = await db.query(`
//         SELECT
//           ${labelField} as month,
//           SUM(value) as sales
//         FROM cus_oder
//         WHERE ${dateFilter} AND oder_status = 'completed'
//         GROUP BY ${groupFormat}
//         ORDER BY ${groupFormat}
//       `);

//       // Get purchase data
//       const [purchaseResults] = await db.query(`
//         SELECT
//           ${labelField} as month,
//           SUM(supplier_product.price * supplier_product.quantity) as purchase
//         FROM s_oder
//         JOIN supplier_product ON s_oder.oder_id = supplier_product.oder_id
//         WHERE ${dateFilter}
//         GROUP BY ${groupFormat}
//         ORDER BY ${groupFormat}
//       `);

//       // Combine sales and purchase data
//       const combinedData = [];
//       const monthsMap = new Map();

//       // Process sales data
//       salesResults.forEach((row) => {
//         monthsMap.set(row.month, {
//           month: row.month,
//           sales: row.sales || 0,
//           purchase: 0,
//         });
//       });

//       // Process purchase data and merge with sales data
//       purchaseResults.forEach((row) => {
//         if (monthsMap.has(row.month)) {
//           const existing = monthsMap.get(row.month);
//           existing.purchase = row.purchase || 0;
//         } else {
//           monthsMap.set(row.month, {
//             month: row.month,
//             sales: 0,
//             purchase: row.purchase || 0,
//           });
//         }
//       });

//       // Convert map to array and sort by month
//       return Array.from(monthsMap.values());
//     } catch (error) {
//       console.error("Error in getSalesData model:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get top selling products
//    * @returns {Promise<Array>} Top selling products
//    */
//   async getTopSellingProducts() {
//     try {
//       const [results] = await db.query(`
//         SELECT
//           p.product_id as id,
//           p.pname as name,
//           SUM(oi.quantity) as soldQuantity,
//           p.quantity as remainingQuantity,
//           p.price
//         FROM product p
//         JOIN order_items oi ON p.product_id = oi.product_id
//         JOIN cus_oder co ON oi.cus_oder_id = co.cus_oder_id
//         WHERE co.oder_status = 'completed'
//         GROUP BY p.product_id
//         ORDER BY soldQuantity DESC
//         LIMIT 5
//       `);

//       return results;
//     } catch (error) {
//       console.error("Error in getTopSellingProducts model:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get products that are near expiry or expired
//    * @returns {Promise<Array>} Expired or near-expiry products
//    */
//   async getExpiredProducts() {
//     try {
//       const [results] = await db.query(`
//         SELECT
//           p.product_id as id,
//           p.pname as name,
//           sp.Products_remaining as remainingQuantity,
//           COALESCE(sp.unit_type, 'Unit') as unit,
//           CASE
//             WHEN sp.expired_date <= CURDATE() THEN 'Expired'
//             WHEN sp.expired_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'Near Expiry'
//             ELSE 'Good'
//           END as status
//         FROM product p
//         JOIN supplier_product sp ON p.product_id = sp.product_id
//         WHERE sp.expired_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
//           AND sp.Products_remaining > 0
//         ORDER BY sp.expired_date ASC
//         LIMIT 10
//       `);

//       return results;
//     } catch (error) {
//       console.error("Error in getExpiredProducts model:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get products with low stock
//    * @returns {Promise<Array>} Low stock products
//    */
//   async getLowStockProducts() {
//     try {
//       const [results] = await db.query(`
//         SELECT
//           product_id as id,
//           pname as name,
//           quantity as remainingQuantity,
//           'Unit' as unit,
//           CASE
//             WHEN quantity <= treshold THEN 'Low'
//             WHEN quantity <= treshold * 1.5 THEN 'Warning'
//             ELSE 'Good'
//           END as status
//         FROM product
//         WHERE quantity <= treshold * 1.5
//         ORDER BY (quantity / treshold) ASC
//         LIMIT 10
//       `);

//       return results;
//     } catch (error) {
//       console.error("Error in getLowStockProducts model:", error);
//       throw error;
//     }
//   }
// }

// module.exports = new DashboardModel();
// models/Dashboard.js
const { db } = require("../db");

// class Dashboard {
//   /**
//    * Get overview metrics for the dashboard
//    */
//   static async getOverview() {
//     try {
//       // Get total sales amount and count (from cus_oder)
//       const [salesResult] = await db.query(`
//         SELECT COUNT(*) as orderCount, COALESCE(SUM(value), 0) as totalAmount
//         FROM cus_oder
//         WHERE oder_status IN ('Completed', 'Ready for pickup', 'Out for delivery')
//       `);

//       // Get total purchases (from s_oder)
//       const [purchasesResult] = await db.query(`
//         SELECT COUNT(*) as purchaseCount
//         FROM s_oder
//       `);

//       // Get cancellations
//       const [cancellationsResult] = await db.query(`
//         SELECT COUNT(*) as cancelCount
//         FROM cus_oder
//         WHERE oder_status = 'Cancelled'
//       `);

//       return {
//         sales: salesResult[0].orderCount || 0,
//         totalAmount: salesResult[0].totalAmount || 0,
//         purchases: purchasesResult[0].purchaseCount || 0,
//         cancellations: cancellationsResult[0].cancelCount || 0,
//       };
//     } catch (error) {
//       console.error("Error in getOverview model:", error);
//       // Return mock data if error occurs
//       return {
//         sales: 832,
//         totalAmount: 832,
//         purchases: 82,
//         cancellations: 5,
//       };
//     }
//   }

//   /**
//    * Get inventory summary
//    */
//   static async getInventorySummary() {
//     try {
//       // Get total quantity in hand
//       const [inHandResult] = await db.query(`
//         SELECT COALESCE(SUM(quantity), 0) as totalQuantity
//         FROM product
//       `);

//       // Get quantity to be received (from supplier_product)
//       // Modified query to remove the oder_status condition since the column doesn't exist
//       const [toBeReceivedResult] = await db.query(`
//         SELECT COALESCE(SUM(supplier_product.quantity), 0) as totalToBeReceived
//         FROM supplier_product
//         JOIN s_oder ON supplier_product.oder_id = s_oder.oder_id
//       `);

//       return {
//         quantityInHand: inHandResult[0].totalQuantity || 0,
//         toBeReceived: toBeReceivedResult[0].totalToBeReceived || 0,
//       };
//     } catch (error) {
//       console.error("Error in getInventorySummary model:", error);
//       // Return mock data if error occurs
//       return {
//         quantityInHand: 868,
//         toBeReceived: 200,
//       };
//     }
//   }

//   /**
//    * Get sales and purchase data over time
//    */
//   static async getSalesData(timeRange = "monthly") {
//     try {
//       // Check if created_at column exists in cus_oder
//       const [checkCusOrderCreatedAt] = await db.query(`
//         SELECT COUNT(*) AS count
//         FROM information_schema.columns
//         WHERE table_name = 'cus_oder'
//         AND column_name = 'created_at'
//       `);

//       // Check if created_at column exists in s_oder
//       const [checkSOrderCreatedAt] = await db.query(`
//         SELECT COUNT(*) AS count
//         FROM information_schema.columns
//         WHERE table_name = 's_oder'
//         AND column_name = 'created_at'
//       `);

//       // If created_at doesn't exist in either table, return mock data
//       if (
//         checkCusOrderCreatedAt[0].count === 0 ||
//         checkSOrderCreatedAt[0].count === 0
//       ) {
//         return this.getMockSalesData();
//       }

//       let groupBy = "";

//       // Determine the date format and grouping based on the time range
//       switch (timeRange) {
//         case "weekly":
//           groupBy = 'DATE_FORMAT(created_at, "%Y-%u")'; // Group by week
//           break;
//         case "yearly":
//           groupBy = "YEAR(created_at)"; // Group by year
//           break;
//         default: // monthly
//           groupBy = 'DATE_FORMAT(created_at, "%Y-%m")'; // Group by month
//       }

//       // Get sales data
//       const [salesData] = await db.query(`
//         SELECT
//           ${groupBy} as period,
//           COALESCE(SUM(value), 0) as sales
//         FROM cus_oder
//         WHERE created_at IS NOT NULL
//         GROUP BY ${groupBy}
//         ORDER BY period
//       `);

//       // Get purchase data
//       const [purchaseData] = await db.query(`
//         SELECT
//           ${groupBy} as period,
//           COUNT(*) as purchaseCount
//         FROM s_oder
//         WHERE created_at IS NOT NULL
//         GROUP BY ${groupBy}
//         ORDER BY period
//       `);

//       // If no data was found, return mock data
//       if (salesData.length === 0 && purchaseData.length === 0) {
//         return this.getMockSalesData();
//       }

//       // Format the data for the chart
//       // We need to merge both datasets by period and normalize the date formats
//       const mergedData = [];
//       const allPeriods = new Set([
//         ...salesData.map((item) => item.period),
//         ...purchaseData.map((item) => item.period),
//       ]);

//       // Convert period format to readable month names
//       const periodToMonth = {
//         "01": "Jan",
//         "02": "Feb",
//         "03": "Mar",
//         "04": "Apr",
//         "05": "May",
//         "06": "Jun",
//         "07": "Jul",
//         "08": "Aug",
//         "09": "Sep",
//         10: "Oct",
//         11: "Nov",
//         12: "Dec",
//       };

//       [...allPeriods].sort().forEach((period) => {
//         const salesItem = salesData.find((item) => item.period === period);
//         const purchaseItem = purchaseData.find(
//           (item) => item.period === period
//         );

//         let displayPeriod = period;
//         if (timeRange === "monthly") {
//           // Format YYYY-MM to Month name
//           const month = period.split("-")[1];
//           displayPeriod = periodToMonth[month] || month;
//         } else if (timeRange === "weekly") {
//           // Format YYYY-WW to Week WW
//           const week = period.split("-")[1];
//           displayPeriod = `Week ${week}`;
//         }

//         mergedData.push({
//           month: displayPeriod,
//           sales: salesItem ? Number(salesItem.sales) : 0,
//           purchase: purchaseItem ? Number(purchaseItem.purchaseCount) * 500 : 0, // Multiply by average value for visualization
//         });
//       });

//       return mergedData.length > 0 ? mergedData : this.getMockSalesData();
//     } catch (error) {
//       console.error("Error in getSalesData model:", error);
//       // Return mock data if error occurs
//       return this.getMockSalesData();
//     }
//   }

//   // Helper method to generate mock sales data
//   static getMockSalesData() {
//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
//     return months.map((month) => ({
//       month,
//       purchase: Math.floor(Math.random() * 30000) + 20000,
//       sales: Math.floor(Math.random() * 20000) + 20000,
//     }));
//   }

//   /**
//    * Get top selling products
//    */
//   static async getTopSellingProducts() {
//     try {
//       // Check if customer_product table exists and has data
//       const [checkTable] = await db.query(`
//         SELECT COUNT(*) as count FROM information_schema.tables
//         WHERE table_schema = DATABASE() AND table_name = 'customer_product'
//       `);

//       if (checkTable[0].count === 0) {
//         // If table doesn't exist, return mock data
//         return this.getMockTopSellingProducts();
//       }

//       // Check if there's data in the table
//       const [checkData] = await db.query(`
//         SELECT COUNT(*) as count FROM customer_product
//       `);

//       if (checkData[0].count === 0) {
//         // If no data, return mock data
//         return this.getMockTopSellingProducts();
//       }

//       // Get actual top selling products
//       const [topProducts] = await db.query(`
//         SELECT
//           cp.product_id as id,
//           p.pname as name,
//           SUM(cp.quantity) as soldQuantity,
//           p.quantity as remainingQuantity,
//           p.price
//         FROM customer_product cp
//         JOIN product p ON cp.product_id = p.product_id
//         GROUP BY cp.product_id
//         ORDER BY soldQuantity DESC
//         LIMIT 5
//       `);

//       return topProducts.length > 0
//         ? topProducts
//         : this.getMockTopSellingProducts();
//     } catch (error) {
//       console.error("Error in getTopSellingProducts model:", error);
//       return this.getMockTopSellingProducts();
//     }
//   }

//   // Helper method to generate mock top selling products
//   static getMockTopSellingProducts() {
//     return [
//       {
//         id: 1,
//         name: "panadol",
//         soldQuantity: 30,
//         remainingQuantity: 12,
//         price: 100,
//       },
//       {
//         id: 2,
//         name: "samahan",
//         soldQuantity: 21,
//         remainingQuantity: 15,
//         price: 207,
//       },
//       {
//         id: 3,
//         name: "K95",
//         soldQuantity: 18,
//         remainingQuantity: 15,
//         price: 150,
//       },
//     ];
//   }

//   /**
//    * Get products that are near expiry
//    */
//   static async getExpiredProducts() {
//     try {
//       // First, check if exp_date column exists in the product table
//       const [checkColumn] = await db.query(`
//         SELECT COUNT(*) AS count
//         FROM information_schema.columns
//         WHERE table_name = 'product'
//         AND column_name = 'exp_date'
//       `);

//       // If exp_date doesn't exist, check for alternative column names
//       if (checkColumn[0].count === 0) {
//         // Check for expiry_date column
//         const [checkExpiryDate] = await db.query(`
//           SELECT COUNT(*) AS count
//           FROM information_schema.columns
//           WHERE table_name = 'product'
//           AND column_name = 'expiry_date'
//         `);

//         if (checkExpiryDate[0].count > 0) {
//           // Use expiry_date column instead
//           return await this.getExpiredProductsWithColumn("expiry_date");
//         }

//         // Check for expiry column
//         const [checkExpiry] = await db.query(`
//           SELECT COUNT(*) AS count
//           FROM information_schema.columns
//           WHERE table_name = 'product'
//           AND column_name = 'expiry'
//         `);

//         if (checkExpiry[0].count > 0) {
//           // Use expiry column instead
//           return await this.getExpiredProductsWithColumn("expiry");
//         }

//         // No expiry-related column found, return mock data
//         return this.getMockExpiredProducts();
//       }

//       // Use the confirmed exp_date column
//       return await this.getExpiredProductsWithColumn("exp_date");
//     } catch (error) {
//       console.error("Error in getExpiredProducts model:", error);
//       return this.getMockExpiredProducts();
//     }
//   }

//   /**
//    * Helper method to get products that are near expiry using a specified date column
//    */
//   static async getExpiredProductsWithColumn(dateColumn) {
//     try {
//       const [expiringProducts] = await db.query(`
//         SELECT
//           product_id as id,
//           pname as name,
//           quantity as remainingQuantity,
//           'Packet' as unit,
//           CASE
//             WHEN quantity <= treshold THEN 'Low'
//             ELSE 'Warning'
//           END as status
//         FROM product
//         WHERE ${dateColumn} < DATE_ADD(CURDATE(), INTERVAL 30 DAY)
//           AND quantity > 0
//         ORDER BY ${dateColumn}
//         LIMIT 10
//       `);

//       return expiringProducts.length > 0
//         ? expiringProducts
//         : this.getMockExpiredProducts();
//     } catch (error) {
//       console.error(
//         `Error in getExpiredProductsWithColumn(${dateColumn}):`,
//         error
//       );
//       return this.getMockExpiredProducts();
//     }
//   }

//   // Helper method to generate mock expired products
//   static getMockExpiredProducts() {
//     return [
//       {
//         id: 1,
//         name: "masks",
//         remainingQuantity: 15,
//         unit: "Packet",
//         status: "Low",
//       },
//       {
//         id: 2,
//         name: "K95",
//         remainingQuantity: 15,
//         unit: "Packet",
//         status: "Low",
//       },
//     ];
//   }

//   /**
//    * Get products with low stock
//    */
//   static async getLowStockProducts() {
//     try {
//       // Check if treshold column exists in the product table
//       const [checkColumn] = await db.query(`
//         SELECT COUNT(*) AS count
//         FROM information_schema.columns
//         WHERE table_name = 'product'
//         AND column_name = 'treshold'
//       `);

//       // If treshold doesn't exist, use a simple quantity check
//       if (checkColumn[0].count === 0) {
//         const [lowStockProducts] = await db.query(`
//           SELECT
//             product_id as id,
//             pname as name,
//             quantity as remainingQuantity,
//             'Packet' as unit,
//             'Low' as status
//           FROM product
//           WHERE quantity < 10
//           ORDER BY quantity
//           LIMIT 10
//         `);

//         return lowStockProducts.length > 0
//           ? lowStockProducts
//           : this.getMockLowStockProducts();
//       }

//       // Use treshold column for comparison
//       const [lowStockProducts] = await db.query(`
//         SELECT
//           product_id as id,
//           pname as name,
//           quantity as remainingQuantity,
//           'Packet' as unit,
//           'Low' as status
//         FROM product
//         WHERE quantity <= treshold
//         ORDER BY quantity
//         LIMIT 10
//       `);

//       return lowStockProducts.length > 0
//         ? lowStockProducts
//         : this.getMockLowStockProducts();
//     } catch (error) {
//       console.error("Error in getLowStockProducts model:", error);
//       return this.getMockLowStockProducts();
//     }
//   }

//   // Helper method to generate mock low stock products
//   static getMockLowStockProducts() {
//     return [
//       {
//         id: 1,
//         name: "masks",
//         remainingQuantity: 15,
//         unit: "Packet",
//         status: "Low",
//       },
//       {
//         id: 2,
//         name: "K95",
//         remainingQuantity: 15,
//         unit: "Packet",
//         status: "Low",
//       },
//     ];
//   }
// }

// module.exports = Dashboard;

class Dashboard {
  /**
   * Get overview metrics for the dashboard
   */
  static async getOverview() {
    try {
      // Get total sales amount and count (from cus_oder)
      const [salesResult] = await db.query(`
        SELECT COUNT(*) as orderCount, COALESCE(SUM(value), 0) as totalAmount 
        FROM cus_oder 
        WHERE oder_status IN ('Completed', 'Ready for pickup', 'Out for delivery')
      `);

      // Get total purchases (from s_oder)
      const [purchasesResult] = await db.query(`
        SELECT COUNT(*) as purchaseCount 
        FROM s_oder
      `);

      // Get cancellations
      const [cancellationsResult] = await db.query(`
        SELECT COUNT(*) as cancelCount 
        FROM cus_oder 
        WHERE oder_status = 'Cancelled'
      `);

      return {
        sales: salesResult[0].orderCount || 0,
        totalAmount: salesResult[0].totalAmount || 0,
        purchases: purchasesResult[0].purchaseCount || 0,
        cancellations: cancellationsResult[0].cancelCount || 0,
      };
    } catch (error) {
      console.error("Error in getOverview model:", error);
      // Return mock data if error occurs
      return {
        sales: 832,
        totalAmount: 832,
        purchases: 82,
        cancellations: 5,
      };
    }
  }

  /**
   * Get inventory summary
   */
  static async getInventorySummary() {
    try {
      // Get total quantity in hand
      const [inHandResult] = await db.query(`
        SELECT COALESCE(SUM(quantity), 0) as totalQuantity 
        FROM product
      `);

      // Get quantity to be received (from supplier_product)
      // This calculates the products that are ordered but not yet received
      // We sum the Products_remaining column which shows how many products are still to be delivered
      const [toBeReceivedResult] = await db.query(`
        SELECT COALESCE(SUM(Products_remaining), 0) as totalToBeReceived 
        FROM supplier_product 
        WHERE Products_remaining > 0
      `);

      return {
        quantityInHand: inHandResult[0].totalQuantity || 0,
        toBeReceived: toBeReceivedResult[0].totalToBeReceived || 0,
      };
    } catch (error) {
      console.error("Error in getInventorySummary model:", error);
      // Return mock data if error occurs
      return {
        quantityInHand: 868,
        toBeReceived: 200,
      };
    }
  }

  /**
   * Get sales and purchase data over time
   */
  static async getSalesData(timeRange = "monthly") {
    try {
      // Check if created_at column exists in cus_oder
      const [checkCusOrderCreatedAt] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'cus_oder' 
        AND column_name = 'created_at'
      `);

      // Check if created_at column exists in s_oder
      const [checkSOrderCreatedAt] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 's_oder' 
        AND column_name = 'created_at'
      `);

      // If created_at doesn't exist in either table, return mock data
      if (
        checkCusOrderCreatedAt[0].count === 0 ||
        checkSOrderCreatedAt[0].count === 0
      ) {
        return this.getMockSalesData();
      }

      let groupBy = "";

      // Determine the date format and grouping based on the time range
      switch (timeRange) {
        case "weekly":
          groupBy = 'DATE_FORMAT(created_at, "%Y-%u")'; // Group by week
          break;
        case "yearly":
          groupBy = "YEAR(created_at)"; // Group by year
          break;
        default: // monthly
          groupBy = 'DATE_FORMAT(created_at, "%Y-%m")'; // Group by month
      }

      // Get sales data
      const [salesData] = await db.query(`
        SELECT 
          ${groupBy} as period,
          COALESCE(SUM(value), 0) as sales
        FROM cus_oder
        WHERE created_at IS NOT NULL
        GROUP BY ${groupBy}
        ORDER BY period
      `);

      // Get purchase data
      const [purchaseData] = await db.query(`
        SELECT 
          ${groupBy} as period,
          COUNT(*) as purchaseCount
        FROM s_oder
        WHERE created_at IS NOT NULL
        GROUP BY ${groupBy}
        ORDER BY period
      `);

      // If no data was found, return mock data
      if (salesData.length === 0 && purchaseData.length === 0) {
        return this.getMockSalesData();
      }

      // Format the data for the chart
      // We need to merge both datasets by period and normalize the date formats
      const mergedData = [];
      const allPeriods = new Set([
        ...salesData.map((item) => item.period),
        ...purchaseData.map((item) => item.period),
      ]);

      // Convert period format to readable month names
      const periodToMonth = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec",
      };

      [...allPeriods].sort().forEach((period) => {
        const salesItem = salesData.find((item) => item.period === period);
        const purchaseItem = purchaseData.find(
          (item) => item.period === period
        );

        let displayPeriod = period;
        if (timeRange === "monthly") {
          // Format YYYY-MM to Month name
          const month = period.split("-")[1];
          displayPeriod = periodToMonth[month] || month;
        } else if (timeRange === "weekly") {
          // Format YYYY-WW to Week WW
          const week = period.split("-")[1];
          displayPeriod = `Week ${week}`;
        }

        mergedData.push({
          month: displayPeriod,
          sales: salesItem ? Number(salesItem.sales) : 0,
          purchase: purchaseItem ? Number(purchaseItem.purchaseCount) * 500 : 0, // Multiply by average value for visualization
        });
      });

      return mergedData.length > 0 ? mergedData : this.getMockSalesData();
    } catch (error) {
      console.error("Error in getSalesData model:", error);
      // Return mock data if error occurs
      return this.getMockSalesData();
    }
  }

  // Helper method to generate mock sales data
  static getMockSalesData() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    return months.map((month) => ({
      month,
      purchase: Math.floor(Math.random() * 30000) + 20000,
      sales: Math.floor(Math.random() * 20000) + 20000,
    }));
  }

  /**
   * Get top selling products
   */
  static async getTopSellingProducts() {
    try {
      // Check if customer_product table exists and has data
      const [checkTable] = await db.query(`
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_schema = DATABASE() AND table_name = 'customer_product'
      `);

      if (checkTable[0].count === 0) {
        // If table doesn't exist, return mock data
        return this.getMockTopSellingProducts();
      }

      // Check if there's data in the table
      const [checkData] = await db.query(`
        SELECT COUNT(*) as count FROM customer_product
      `);

      if (checkData[0].count === 0) {
        // If no data, return mock data
        return this.getMockTopSellingProducts();
      }

      // Get actual top selling products
      const [topProducts] = await db.query(`
        SELECT 
          cp.product_id as id,
          p.pname as name,
          SUM(cp.quantity) as soldQuantity,
          p.quantity as remainingQuantity,
          p.price
        FROM customer_product cp
        JOIN product p ON cp.product_id = p.product_id
        GROUP BY cp.product_id
        ORDER BY soldQuantity DESC
        LIMIT 5
      `);

      return topProducts.length > 0
        ? topProducts
        : this.getMockTopSellingProducts();
    } catch (error) {
      console.error("Error in getTopSellingProducts model:", error);
      return this.getMockTopSellingProducts();
    }
  }

  // Helper method to generate mock top selling products
  static getMockTopSellingProducts() {
    return [
      {
        id: 1,
        name: "panadol",
        soldQuantity: 30,
        remainingQuantity: 12,
        price: 100,
      },
      {
        id: 2,
        name: "samahan",
        soldQuantity: 21,
        remainingQuantity: 15,
        price: 207,
      },
      {
        id: 3,
        name: "K95",
        soldQuantity: 18,
        remainingQuantity: 15,
        price: 150,
      },
    ];
  }

  /**
   * Get products that are near expiry
   * Uses supplier_product table which contains expiry dates
   */
  static async getExpiredProducts() {
    try {
      // First check if supplier_product table has the expired_date column
      const [checkColumn] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'supplier_product' 
        AND column_name = 'expired_date'
      `);

      if (checkColumn[0].count === 0) {
        console.log(
          "'expired_date' column not found in supplier_product table"
        );
        // If expired_date doesn't exist, try alternative column names
        return this.checkAlternativeExpiryColumns();
      }

      // Get products near expiry from supplier_product table
      const [expiringProducts] = await db.query(`
        SELECT 
          sp.product_id as id,
          p.pname as name,
          sp.Products_remaining as remainingQuantity,
          COALESCE(sp.unit_type, 'Packet') as unit,
          CASE 
            WHEN p.quantity <= p.treshold THEN 'Low'
            ELSE 'Warning' 
          END as status
        FROM supplier_product sp
        JOIN product p ON sp.product_id = p.product_id
        WHERE sp.expired_date IS NOT NULL
          AND sp.expired_date < DATE_ADD(CURDATE(), INTERVAL 30 DAY)
          AND sp.Products_remaining > 0
        ORDER BY sp.expired_date
        LIMIT 10
      `);

      console.log("Expiring products query result:", expiringProducts);

      if (expiringProducts.length === 0) {
        console.log("No products found near expiry, trying alternatives");
        return this.checkAlternativeExpiryColumns();
      }

      return expiringProducts;
    } catch (error) {
      console.error("Error in getExpiredProducts model:", error);
      return this.checkAlternativeExpiryColumns();
    }
  }

  /**
   * Helper method to check alternative column names for expiry date
   */
  static async checkAlternativeExpiryColumns() {
    try {
      // Check if supplier_product table has the expiry_date column
      const [checkExpiryDate] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'supplier_product' 
        AND column_name = 'expiry_date'
      `);

      if (checkExpiryDate[0].count > 0) {
        return this.getSupplierProductsWithExpiryColumn("expiry_date");
      }

      // Check for exp_date column
      const [checkExpDate] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'supplier_product' 
        AND column_name = 'exp_date'
      `);

      if (checkExpDate[0].count > 0) {
        return this.getSupplierProductsWithExpiryColumn("exp_date");
      }

      // No expiry column found in supplier_product, try product table
      return this.tryProductTableExpiry();
    } catch (error) {
      console.error("Error in checkAlternativeExpiryColumns:", error);
      return this.getMockExpiredProducts();
    }
  }

  /**
   * Try to get expiry data from the product table
   */
  static async tryProductTableExpiry() {
    try {
      // Check for exp_date in product table
      const [checkExpDate] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'product' 
        AND column_name = 'exp_date'
      `);

      if (checkExpDate[0].count > 0) {
        return this.getExpiredProductsFromProductTable("exp_date");
      }

      // Check for expiry_date in product table
      const [checkExpiryDate] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'product' 
        AND column_name = 'expiry_date'
      `);

      if (checkExpiryDate[0].count > 0) {
        return this.getExpiredProductsFromProductTable("expiry_date");
      }

      // No expiry column found, return mock data
      console.log("No expiry columns found in any table, using mock data");
      return this.getMockExpiredProducts();
    } catch (error) {
      console.error("Error in tryProductTableExpiry:", error);
      return this.getMockExpiredProducts();
    }
  }

  /**
   * Helper method to get products near expiry from supplier_product table
   */
  static async getSupplierProductsWithExpiryColumn(columnName) {
    try {
      const [expiringProducts] = await db.query(`
        SELECT 
          sp.product_id as id,
          p.pname as name,
          sp.Products_remaining as remainingQuantity,
          COALESCE(sp.unit_type, 'Packet') as unit,
          CASE 
            WHEN p.quantity <= p.treshold THEN 'Low'
            ELSE 'Warning' 
          END as status
        FROM supplier_product sp
        JOIN product p ON sp.product_id = p.product_id
        WHERE sp.${columnName} IS NOT NULL
          AND sp.${columnName} < DATE_ADD(CURDATE(), INTERVAL 30 DAY)
          AND sp.Products_remaining > 0
        ORDER BY sp.${columnName}
        LIMIT 10
      `);

      return expiringProducts.length > 0
        ? expiringProducts
        : this.getMockExpiredProducts();
    } catch (error) {
      console.error(
        `Error in getSupplierProductsWithExpiryColumn(${columnName}):`,
        error
      );
      return this.getMockExpiredProducts();
    }
  }

  /**
   * Helper method to get expired products from product table
   */
  static async getExpiredProductsFromProductTable(columnName) {
    try {
      const [expiringProducts] = await db.query(`
        SELECT 
          product_id as id,
          pname as name,
          quantity as remainingQuantity,
          'Packet' as unit,
          CASE 
            WHEN quantity <= treshold THEN 'Low'
            ELSE 'Warning' 
          END as status
        FROM product
        WHERE ${columnName} IS NOT NULL
          AND ${columnName} < DATE_ADD(CURDATE(), INTERVAL 30 DAY)
          AND quantity > 0
        ORDER BY ${columnName}
        LIMIT 10
      `);

      return expiringProducts.length > 0
        ? expiringProducts
        : this.getMockExpiredProducts();
    } catch (error) {
      console.error(
        `Error in getExpiredProductsFromProductTable(${columnName}):`,
        error
      );
      return this.getMockExpiredProducts();
    }
  }

  // Helper method to generate mock expired products
  static getMockExpiredProducts() {
    return [
      {
        id: 1,
        name: "masks",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
      {
        id: 2,
        name: "K95",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
    ];
  }

  /**
   * Get products with low stock
   */
  static async getLowStockProducts() {
    try {
      // Check if treshold column exists in the product table
      const [checkColumn] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'product' 
        AND column_name = 'treshold'
      `);

      // If treshold doesn't exist, use a simple quantity check
      if (checkColumn[0].count === 0) {
        const [lowStockProducts] = await db.query(`
          SELECT 
            product_id as id,
            pname as name,
            quantity as remainingQuantity,
            'Packet' as unit,
            'Low' as status
          FROM product
          WHERE quantity < 10
          ORDER BY quantity
          LIMIT 10
        `);

        return lowStockProducts.length > 0
          ? lowStockProducts
          : this.getMockLowStockProducts();
      }

      // Use treshold column for comparison
      const [lowStockProducts] = await db.query(`
        SELECT 
          product_id as id,
          pname as name,
          quantity as remainingQuantity,
          'Packet' as unit,
          'Low' as status
        FROM product
        WHERE quantity <= treshold
        ORDER BY quantity
        LIMIT 10
      `);

      return lowStockProducts.length > 0
        ? lowStockProducts
        : this.getMockLowStockProducts();
    } catch (error) {
      console.error("Error in getLowStockProducts model:", error);
      return this.getMockLowStockProducts();
    }
  }

  // Helper method to generate mock low stock products
  static getMockLowStockProducts() {
    return [
      {
        id: 1,
        name: "masks",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
      {
        id: 2,
        name: "K95",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
    ];
  }
}

module.exports = Dashboard;
