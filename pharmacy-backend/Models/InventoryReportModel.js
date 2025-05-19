// // // models/reports/inventory.report.model.js
// // const { db } = require("../db");

// // class InventoryReportModel {
// //   /**
// //    * Get inventory report data with specified filters
// //    */
// //   static async getInventoryReport(filters) {
// //     try {
// //       const {
// //         category,
// //         lowStock = false,
// //         expiringSoon = false,
// //         expired = false,
// //         sortBy = "product_id",
// //         sortOrder = "ASC",
// //         managerId,
// //         includeSummary = true,
// //       } = filters;

// //       // Build filter conditions
// //       let conditions = [];
// //       let params = [];

// //       // Category filter
// //       if (category && category !== "all") {
// //         conditions.push("pc.name = ?");
// //         params.push(category);
// //       }

// //       // Low stock filter
// //       if (lowStock) {
// //         conditions.push("p.quantity <= p.treshold");
// //       }

// //       // Current date for expiry calculations
// //       const today = new Date();
// //       const thirtyDaysLater = new Date();
// //       thirtyDaysLater.setDate(today.getDate() + 30);

// //       // Format dates for MySQL
// //       const todayFormatted = today.toISOString().split("T")[0];
// //       const thirtyDaysLaterFormatted = thirtyDaysLater
// //         .toISOString()
// //         .split("T")[0];

// //       // Expiring soon filter
// //       if (expiringSoon) {
// //         conditions.push("p.exp_date BETWEEN ? AND ?");
// //         params.push(todayFormatted, thirtyDaysLaterFormatted);
// //       }

// //       // Expired filter
// //       if (expired) {
// //         conditions.push("p.exp_date < ?");
// //         params.push(todayFormatted);
// //       }

// //       // Combine all conditions
// //       const whereClause =
// //         conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

// //       // Create the base query
// //       const query = `
// //         SELECT
// //     p.product_id,
// //     p.pname,
// //     p.status,
// //     p.treshold as threshold,
// //     sp.expired_date as exp_date,
// //     p.quantity,
// //     p.price,
// //     p.type as product_type,
// //     p.image,
// //     (p.quantity * p.price) as total_value,
// //     pc.name as category_name,
// //     pc.description as category_description
// //   FROM
// //     product p
// //   LEFT JOIN
// //     product_cato pc ON p.product_cato_id = pc.product_cato_id
// //   LEFT JOIN
// //     supplier_product sp ON p.product_id = sp.product_id
// //   ${whereClause}
// //   ORDER BY
// //     ${sortBy} ${sortOrder}
// //       `;

// //       // Execute the main query
// //       const [products] = await db.execute(query, params);

// //       // If summary is requested, get additional data
// //       let summary = null;
// //       if (includeSummary) {
// //         summary = await this.getInventorySummary();
// //       }

// //       return {
// //         products,
// //         summary,
// //       };
// //     } catch (error) {
// //       console.error("Error in getInventoryReport:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get inventory summary statistics
// //    */
// //   static async getInventorySummary() {
// //     try {
// //       // Current date for expiry calculations
// //       const today = new Date();
// //       const thirtyDaysLater = new Date();
// //       thirtyDaysLater.setDate(today.getDate() + 30);

// //       // Format dates for MySQL
// //       const todayFormatted = today.toISOString().split("T")[0];
// //       const thirtyDaysLaterFormatted = thirtyDaysLater
// //         .toISOString()
// //         .split("T")[0];

// //       // Total products and value
// //       const totalQuery = `
// //         SELECT
// //           COUNT(*) as total_products,
// //           SUM(quantity * price) as total_value
// //         FROM
// //           product
// //       `;

// //       // Low stock items
// //       const lowStockQuery = `
// //         SELECT
// //           COUNT(*) as low_stock_count
// //         FROM
// //           product
// //         WHERE
// //           quantity <= treshold
// //       `;

// //       // Expiring soon
// //       const expiringSoonQuery = `
// //         SELECT
// //           COUNT(*) as expiring_soon_count
// //         FROM
// //           product
// //         WHERE
// //           exp_date BETWEEN ? AND ?
// //       `;

// //       // Expired products
// //       const expiredQuery = `
// //         SELECT
// //           COUNT(*) as expired_count
// //         FROM
// //           product
// //         WHERE
// //           exp_date < ?
// //       `;

// //       // Out of stock
// //       const outOfStockQuery = `
// //         SELECT
// //           COUNT(*) as out_of_stock_count
// //         FROM
// //           product
// //         WHERE
// //           quantity = 0
// //       `;

// //       // Categories count
// //       const categoriesQuery = `
// //         SELECT
// //           pc.name as category_name,
// //           COUNT(p.product_id) as product_count,
// //           SUM(p.quantity * p.price) as category_value
// //         FROM
// //           product p
// //         JOIN
// //           product_cato pc ON p.product_cato_id = pc.product_cato_id
// //         GROUP BY
// //           pc.product_cato_id
// //       `;

// //       // Execute all queries
// //       const [totalResult] = await db.execute(totalQuery);
// //       const [lowStockResult] = await db.execute(lowStockQuery);
// //       const [expiringSoonResult] = await db.execute(expiringSoonQuery, [
// //         todayFormatted,
// //         thirtyDaysLaterFormatted,
// //       ]);
// //       const [expiredResult] = await db.execute(expiredQuery, [todayFormatted]);
// //       const [outOfStockResult] = await db.execute(outOfStockQuery);
// //       const [categoriesResult] = await db.execute(categoriesQuery);

// //       return {
// //         total_products: totalResult[0].total_products,
// //         total_value: totalResult[0].total_value,
// //         low_stock_count: lowStockResult[0].low_stock_count,
// //         expiring_soon_count: expiringSoonResult[0].expiring_soon_count,
// //         expired_count: expiredResult[0].expired_count,
// //         out_of_stock_count: outOfStockResult[0].out_of_stock_count,
// //         categories: categoriesResult,
// //       };
// //     } catch (error) {
// //       console.error("Error in getInventorySummary:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get products that need to be reordered (below threshold)
// //    */
// //   static async getReorderList() {
// //     try {
// //       const query = `
// //         SELECT
// //           p.product_id,
// //           p.pname,
// //           p.quantity,
// //           p.treshold as threshold,
// //           p.price,
// //           (p.treshold - p.quantity) as quantity_to_order,
// //           s.sup_id,
// //           CONCAT(s.F_name, ' ', s.L_name) as supplier_name,
// //           pc.name as category_name
// //         FROM
// //           product p
// //         LEFT JOIN
// //           product_cato pc ON p.product_cato_id = pc.product_cato_id
// //         LEFT JOIN
// //           supplier_suppling_products ssp ON p.product_id = ssp.product_id
// //         LEFT JOIN
// //           supplier s ON ssp.sup_id = s.sup_id
// //         WHERE
// //           p.quantity <= p.treshold
// //         ORDER BY
// //           (p.treshold - p.quantity) DESC
// //       `;

// //       const [results] = await db.execute(query);
// //       return results;
// //     } catch (error) {
// //       console.error("Error in getReorderList:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get expiry report
// //    */
// //   static async getExpiryReport() {
// //     try {
// //       // Current date for expiry calculations
// //       const today = new Date();
// //       const thirtyDaysLater = new Date();
// //       const ninetyDaysLater = new Date();
// //       thirtyDaysLater.setDate(today.getDate() + 30);
// //       ninetyDaysLater.setDate(today.getDate() + 90);

// //       // Format dates for MySQL
// //       const todayFormatted = today.toISOString().split("T")[0];
// //       const thirtyDaysLaterFormatted = thirtyDaysLater
// //         .toISOString()
// //         .split("T")[0];
// //       const ninetyDaysLaterFormatted = ninetyDaysLater
// //         .toISOString()
// //         .split("T")[0];

// //       // Expired products
// //       const expiredQuery = `
// //         SELECT
// //           p.product_id,
// //           p.pname,
// //           p.exp_date,
// //           p.quantity,
// //           p.price,
// //           (p.quantity * p.price) as total_value,
// //           pc.name as category_name,
// //           DATEDIFF(p.exp_date, ?) as days_expired
// //         FROM
// //           product p
// //         LEFT JOIN
// //           product_cato pc ON p.product_cato_id = pc.product_cato_id
// //         WHERE
// //           p.exp_date < ?
// //         ORDER BY
// //           p.exp_date ASC
// //       `;

// //       // Expiring in 30 days
// //       const expiring30DaysQuery = `
// //         SELECT
// //           p.product_id,
// //           p.pname,
// //           p.exp_date,
// //           p.quantity,
// //           p.price,
// //           (p.quantity * p.price) as total_value,
// //           pc.name as category_name,
// //           DATEDIFF(p.exp_date, ?) as days_until_expiry
// //         FROM
// //           product p
// //         LEFT JOIN
// //           product_cato pc ON p.product_cato_id = pc.product_cato_id
// //         WHERE
// //           p.exp_date BETWEEN ? AND ?
// //         ORDER BY
// //           p.exp_date ASC
// //       `;

// //       // Expiring in 30-90 days
// //       const expiring90DaysQuery = `
// //         SELECT
// //           p.product_id,
// //           p.pname,
// //           p.exp_date,
// //           p.quantity,
// //           p.price,
// //           (p.quantity * p.price) as total_value,
// //           pc.name as category_name,
// //           DATEDIFF(p.exp_date, ?) as days_until_expiry
// //         FROM
// //           product p
// //         LEFT JOIN
// //           product_cato pc ON p.product_cato_id = pc.product_cato_id
// //         WHERE
// //           p.exp_date BETWEEN ? AND ?
// //         ORDER BY
// //           p.exp_date ASC
// //       `;

// //       // Execute queries
// //       const [expiredProducts] = await db.execute(expiredQuery, [
// //         todayFormatted,
// //         todayFormatted,
// //       ]);
// //       const [expiring30Days] = await db.execute(expiring30DaysQuery, [
// //         todayFormatted,
// //         todayFormatted,
// //         thirtyDaysLaterFormatted,
// //       ]);
// //       const [expiring90Days] = await db.execute(expiring90DaysQuery, [
// //         todayFormatted,
// //         thirtyDaysLaterFormatted,
// //         ninetyDaysLaterFormatted,
// //       ]);

// //       return {
// //         expired: expiredProducts,
// //         expiring_30_days: expiring30Days,
// //         expiring_90_days: expiring90Days,
// //       };
// //     } catch (error) {
// //       console.error("Error in getExpiryReport:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get stock movement report (inventory changes over time)
// //    */
// //   static async getStockMovementReport(filters) {
// //     try {
// //       const { productId, startDate, endDate, limit = 100 } = filters;

// //       let conditions = [];
// //       let params = [];

// //       // Product filter
// //       if (productId) {
// //         conditions.push("i.product_id = ?");
// //         params.push(productId);
// //       }

// //       // Date range
// //       if (startDate && endDate) {
// //         conditions.push("i.date BETWEEN ? AND ?");
// //         params.push(startDate, endDate);
// //       }

// //       params.push(parseInt(limit, 10));

// //       // Combine conditions
// //       const whereClause =
// //         conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

// //       const query = `
// //         SELECT
// //           i.inventory_id,
// //           i.product_id,
// //           p.pname,
// //           i.date,
// //           i.exp_date,
// //           i.quantity,
// //           i.Buying_price,
// //           i.oder_id,
// //           CONCAT(s.F_name, ' ', s.L_name) as supplier_name
// //         FROM
// //           inventory i
// //         JOIN
// //           product p ON i.product_id = p.product_id
// //         LEFT JOIN
// //           s_oder so ON i.oder_id = so.oder_id
// //         LEFT JOIN
// //           supplier s ON so.sup_id = s.sup_id
// //         ${whereClause}
// //         ORDER BY
// //           i.date DESC
// //         LIMIT ?
// //       `;

// //       const [results] = await db.execute(query, params);
// //       return results;
// //     } catch (error) {
// //       console.error("Error in getStockMovementReport:", error);
// //       throw error;
// //     }
// //   }
// // }

// // module.exports = InventoryReportModel;

// const { db } = require("../db");

// class InventoryReportModel {
//   /**
//    * Get inventory report data with specified filters
//    */
//   static async getInventoryReport(filters) {
//     try {
//       const {
//         category,
//         lowStock = false,
//         expiringSoon = false,
//         expired = false,
//         sortBy = "p.product_id",
//         sortOrder = "ASC",
//         managerId,
//         includeSummary = true,
//       } = filters;

//       // Build filter conditions
//       let conditions = [];
//       let params = [];

//       // Category filter
//       if (category && category !== "all") {
//         conditions.push("pc.name = ?");
//         params.push(category);
//       }

//       // Low stock filter
//       if (lowStock) {
//         conditions.push("p.quantity <= p.treshold");
//       }

//       // Current date for expiry calculations
//       const today = new Date();
//       const thirtyDaysLater = new Date();
//       thirtyDaysLater.setDate(today.getDate() + 30);

//       // Format dates for MySQL
//       const todayFormatted = today.toISOString().split("T")[0];
//       const thirtyDaysLaterFormatted = thirtyDaysLater
//         .toISOString()
//         .split("T")[0];

//       // Expiring soon filter (using supplier_product.expired_date)
//       if (expiringSoon) {
//         conditions.push("sp.expired_date BETWEEN ? AND ?");
//         params.push(todayFormatted, thirtyDaysLaterFormatted);
//       }

//       // Expired filter (using supplier_product.expired_date)
//       if (expired) {
//         conditions.push("sp.expired_date < ?");
//         params.push(todayFormatted);
//       }

//       // Manager filter (if needed)
//       if (managerId) {
//         conditions.push(
//           "EXISTS (SELECT 1 FROM s_oder so WHERE so.oder_id = sp.oder_id AND so.manager_id = ?)"
//         );
//         params.push(managerId);
//       }

//       // Combine all conditions
//       const whereClause =
//         conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

//       // Create the base query with proper joins
//       const query = `
//         SELECT
//           p.product_id,
//           p.pname,
//           p.status,
//           p.treshold as threshold,
//           sp.expired_date as exp_date,
//           p.quantity,
//           p.price,
//           p.type as product_type,
//           p.image,
//           (p.quantity * p.price) as total_value,
//           pc.name as category_name,
//           pc.description as category_description,
//           sp.unit_type,
//           sp.unit,
//           sp.buying_price,
//           s.F_name as supplier_first_name,
//           s.L_name as supplier_last_name
//         FROM
//           product p
//         LEFT JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         LEFT JOIN
//           supplier_product sp ON p.product_id = sp.product_id
//         LEFT JOIN
//           supplier s ON sp.sup_id = s.sup_id
//         ${whereClause}
//         GROUP BY p.product_id, sp.expired_date
//         ORDER BY
//           ${sortBy} ${sortOrder}
//       `;

//       // Execute the main query
//       const [products] = await db.execute(query, params);

//       // If summary is requested, get additional data
//       let summary = null;
//       if (includeSummary) {
//         summary = await this.getInventorySummary();
//       }

//       return {
//         products,
//         summary,
//       };
//     } catch (error) {
//       console.error("Error in getInventoryReport:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get inventory summary statistics
//    */
//   static async getInventorySummary() {
//     try {
//       // Current date for expiry calculations
//       const today = new Date();
//       const thirtyDaysLater = new Date();
//       thirtyDaysLater.setDate(today.getDate() + 30);

//       // Format dates for MySQL
//       const todayFormatted = today.toISOString().split("T")[0];
//       const thirtyDaysLaterFormatted = thirtyDaysLater
//         .toISOString()
//         .split("T")[0];

//       // Total products and value
//       const totalQuery = `
//         SELECT
//           COUNT(*) as total_products,
//           SUM(quantity * price) as total_value
//         FROM
//           product
//       `;

//       // Low stock items
//       const lowStockQuery = `
//         SELECT
//           COUNT(*) as low_stock_count
//         FROM
//           product
//         WHERE
//           quantity <= treshold
//       `;

//       // Expiring soon (using supplier_product.expired_date)
//       const expiringSoonQuery = `
//         SELECT
//           COUNT(DISTINCT p.product_id) as expiring_soon_count
//         FROM
//           product p
//         JOIN
//           supplier_product sp ON p.product_id = sp.product_id
//         WHERE
//           sp.expired_date BETWEEN ? AND ?
//           AND sp.Products_remaining > 0
//       `;

//       // Expired products (using supplier_product.expired_date)
//       const expiredQuery = `
//         SELECT
//           COUNT(DISTINCT p.product_id) as expired_count
//         FROM
//           product p
//         JOIN
//           supplier_product sp ON p.product_id = sp.product_id
//         WHERE
//           sp.expired_date < ?
//           AND sp.Products_remaining > 0
//       `;

//       // Out of stock
//       const outOfStockQuery = `
//         SELECT
//           COUNT(*) as out_of_stock_count
//         FROM
//           product
//         WHERE
//           quantity = 0
//       `;

//       // Categories count
//       const categoriesQuery = `
//         SELECT
//           pc.name as category_name,
//           COUNT(DISTINCT p.product_id) as product_count,
//           SUM(p.quantity * p.price) as category_value
//         FROM
//           product p
//         JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         GROUP BY
//           pc.product_cato_id
//       `;

//       // Execute all queries
//       const [totalResult] = await db.execute(totalQuery);
//       const [lowStockResult] = await db.execute(lowStockQuery);
//       const [expiringSoonResult] = await db.execute(expiringSoonQuery, [
//         todayFormatted,
//         thirtyDaysLaterFormatted,
//       ]);
//       const [expiredResult] = await db.execute(expiredQuery, [todayFormatted]);
//       const [outOfStockResult] = await db.execute(outOfStockQuery);
//       const [categoriesResult] = await db.execute(categoriesQuery);

//       return {
//         total_products: totalResult[0].total_products,
//         total_value: totalResult[0].total_value || 0,
//         low_stock_count: lowStockResult[0].low_stock_count,
//         expiring_soon_count: expiringSoonResult[0].expiring_soon_count,
//         expired_count: expiredResult[0].expired_count,
//         out_of_stock_count: outOfStockResult[0].out_of_stock_count,
//         categories: categoriesResult,
//       };
//     } catch (error) {
//       console.error("Error in getInventorySummary:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get products that need to be reordered (below threshold)
//    */
//   static async getReorderList() {
//     try {
//       const query = `
//         SELECT
//           p.product_id,
//           p.pname,
//           p.quantity,
//           p.treshold as threshold,
//           p.price,
//           (p.treshold - p.quantity) as quantity_to_order,
//           s.sup_id,
//           CONCAT(s.F_name, ' ', s.L_name) as supplier_name,
//           pc.name as category_name,
//           sp.buying_price,
//           sp.unit_type,
//           sp.unit
//         FROM
//           product p
//         LEFT JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         LEFT JOIN
//           supplier_suppling_products ssp ON p.product_id = ssp.product_id
//         LEFT JOIN
//           supplier s ON ssp.sup_id = s.sup_id
//         LEFT JOIN
//           supplier_product sp ON p.product_id = sp.product_id AND ssp.sup_id = sp.sup_id
//         WHERE
//           p.quantity <= p.treshold
//         GROUP BY p.product_id, s.sup_id
//         ORDER BY
//           (p.treshold - p.quantity) DESC
//       `;

//       const [results] = await db.execute(query);
//       return results;
//     } catch (error) {
//       console.error("Error in getReorderList:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get expiry report with proper supplier_product.expired_date usage
//    */
//   static async getExpiryReport() {
//     try {
//       // Current date for expiry calculations
//       const today = new Date();
//       const thirtyDaysLater = new Date();
//       const ninetyDaysLater = new Date();
//       thirtyDaysLater.setDate(today.getDate() + 30);
//       ninetyDaysLater.setDate(today.getDate() + 90);

//       // Format dates for MySQL
//       const todayFormatted = today.toISOString().split("T")[0];
//       const thirtyDaysLaterFormatted = thirtyDaysLater
//         .toISOString()
//         .split("T")[0];
//       const ninetyDaysLaterFormatted = ninetyDaysLater
//         .toISOString()
//         .split("T")[0];

//       // Expired products (using supplier_product.expired_date)
//       const expiredQuery = `
//         SELECT
//           p.product_id,
//           p.pname,
//           sp.expired_date as exp_date,
//           p.quantity,
//           p.price,
//           (p.quantity * p.price) as total_value,
//           pc.name as category_name,
//           DATEDIFF(?, sp.expired_date) as days_expired,
//           sp.unit_type,
//           sp.unit
//         FROM
//           product p
//         LEFT JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         JOIN
//           supplier_product sp ON p.product_id = sp.product_id
//         WHERE
//           sp.expired_date < ?
//           AND sp.Products_remaining > 0
//         ORDER BY
//           sp.expired_date ASC
//       `;

//       // Expiring in 30 days (using supplier_product.expired_date)
//       const expiring30DaysQuery = `
//         SELECT
//           p.product_id,
//           p.pname,
//           sp.expired_date as exp_date,
//           p.quantity,
//           p.price,
//           (p.quantity * p.price) as total_value,
//           pc.name as category_name,
//           DATEDIFF(sp.expired_date, ?) as days_until_expiry,
//           sp.unit_type,
//           sp.unit
//         FROM
//           product p
//         LEFT JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         JOIN
//           supplier_product sp ON p.product_id = sp.product_id
//         WHERE
//           sp.expired_date BETWEEN ? AND ?
//           AND sp.Products_remaining > 0
//         ORDER BY
//           sp.expired_date ASC
//       `;

//       // Expiring in 30-90 days (using supplier_product.expired_date)
//       const expiring90DaysQuery = `
//         SELECT
//           p.product_id,
//           p.pname,
//           sp.expired_date as exp_date,
//           p.quantity,
//           p.price,
//           (p.quantity * p.price) as total_value,
//           pc.name as category_name,
//           DATEDIFF(sp.expired_date, ?) as days_until_expiry,
//           sp.unit_type,
//           sp.unit
//         FROM
//           product p
//         LEFT JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         JOIN
//           supplier_product sp ON p.product_id = sp.product_id
//         WHERE
//           sp.expired_date BETWEEN ? AND ?
//           AND sp.Products_remaining > 0
//         ORDER BY
//           sp.expired_date ASC
//       `;

//       // Execute queries
//       const [expiredProducts] = await db.execute(expiredQuery, [
//         todayFormatted,
//         todayFormatted,
//       ]);
//       const [expiring30Days] = await db.execute(expiring30DaysQuery, [
//         todayFormatted,
//         todayFormatted,
//         thirtyDaysLaterFormatted,
//       ]);
//       const [expiring90Days] = await db.execute(expiring90DaysQuery, [
//         todayFormatted,
//         thirtyDaysLaterFormatted,
//         ninetyDaysLaterFormatted,
//       ]);

//       return {
//         expired: expiredProducts,
//         expiring_30_days: expiring30Days,
//         expiring_90_days: expiring90Days,
//       };
//     } catch (error) {
//       console.error("Error in getExpiryReport:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get stock movement report (inventory changes over time)
//    */
//   static async getStockMovementReport(filters) {
//     try {
//       const { productId, startDate, endDate, limit = 100 } = filters;

//       let conditions = [];
//       let params = [];

//       // Product filter
//       if (productId) {
//         conditions.push("i.product_id = ?");
//         params.push(productId);
//       }

//       // Date range
//       if (startDate && endDate) {
//         conditions.push("i.date BETWEEN ? AND ?");
//         params.push(startDate, endDate);
//       }

//       params.push(parseInt(limit, 10));

//       // Combine conditions
//       const whereClause =
//         conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

//       const query = `
//         SELECT
//           i.inventory_id,
//           i.product_id,
//           p.pname,
//           i.date,
//           i.exp_date,
//           i.quantity,
//           i.Buying_price,
//           i.oder_id,
//           CONCAT(s.F_name, ' ', s.L_name) as supplier_name,
//           sp.unit_type,
//           sp.unit
//         FROM
//           inventory i
//         JOIN
//           product p ON i.product_id = p.product_id
//         LEFT JOIN
//           s_oder so ON i.oder_id = so.oder_id
//         LEFT JOIN
//           supplier s ON so.sup_id = s.sup_id
//         LEFT JOIN
//           supplier_product sp ON p.product_id = sp.product_id AND so.sup_id = sp.sup_id
//         ${whereClause}
//         ORDER BY
//           i.date DESC
//         LIMIT ?
//       `;

//       const [results] = await db.execute(query, params);
//       return results;
//     } catch (error) {
//       console.error("Error in getStockMovementReport:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get inventory valuation by category
//    */
//   static async getInventoryValuation() {
//     try {
//       const query = `
//         SELECT
//           pc.product_cato_id,
//           pc.name as category_name,
//           COUNT(p.product_id) as product_count,
//           SUM(p.quantity) as total_quantity,
//           SUM(p.quantity * p.price) as total_value,
//           AVG(p.price) as average_price
//         FROM
//           product p
//         JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         GROUP BY
//           pc.product_cato_id
//         ORDER BY
//           total_value DESC
//       `;

//       const [results] = await db.execute(query);
//       return results;
//     } catch (error) {
//       console.error("Error in getInventoryValuation:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get inventory aging report
//    */
//   static async getInventoryAgingReport() {
//     try {
//       const query = `
//         SELECT
//           p.product_id,
//           p.pname,
//           p.quantity,
//           p.price,
//           (p.quantity * p.price) as total_value,
//           pc.name as category_name,
//           DATEDIFF(CURDATE(), MIN(i.date)) as days_in_inventory,
//           CASE
//             WHEN DATEDIFF(CURDATE(), MIN(i.date)) < 30 THEN '0-30 days'
//             WHEN DATEDIFF(CURDATE(), MIN(i.date)) BETWEEN 30 AND 90 THEN '30-90 days'
//             WHEN DATEDIFF(CURDATE(), MIN(i.date)) BETWEEN 91 AND 180 THEN '91-180 days'
//             ELSE 'Over 180 days'
//           END as aging_bracket
//         FROM
//           product p
//         LEFT JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         LEFT JOIN
//           inventory i ON p.product_id = i.product_id
//         GROUP BY
//           p.product_id
//         ORDER BY
//           days_in_inventory DESC
//       `;

//       const [results] = await db.execute(query);
//       return results;
//     } catch (error) {
//       console.error("Error in getInventoryAgingReport:", error);
//       throw error;
//     }
//   }
// }

// module.exports = InventoryReportModel;

// models/reports/InventoryReportModel.js
const { db } = require("../db");

class InventoryReportModel {
  /**
   * Get inventory report data based on type
   */
  static async getInventoryReport(filters) {
    try {
      const {
        type = "current",
        category = "all",
        startDate,
        endDate,
      } = filters;

      // Select query based on report type
      let query = "";
      let params = [];
      let categoryFilter = "";

      // Add category filter if specified
      if (category && category !== "all") {
        categoryFilter = "AND pc.name = ?";
        params.push(category);
      }

      // Current inventory report
      if (type === "current") {
        query = `
        SELECT 
          p.product_id,
          p.pname,
          p.quantity,
          p.treshold,
          p.price,
          p.exp_date,
          p.typr as product_type,
          pc.name AS category_name,
          (p.quantity * p.price) AS total_value
        FROM 
          product p
        LEFT JOIN 
          product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 
          1=1 ${categoryFilter}
        ORDER BY 
          p.product_id ASC
      `;
      }
      // Low stock items report
      else if (type === "lowstock") {
        query = `
        SELECT 
          p.product_id,
          p.pname,
          p.quantity,
          p.treshold,
          p.price,
          p.exp_date,
          p.typr as product_type,
          pc.name AS category_name,
          (p.quantity * p.price) AS total_value,
          s.F_name AS supplier_first_name,
          s.L_name AS supplier_last_name,
          CONCAT(s.F_name, ' ', s.L_name) AS supplier_name
        FROM 
          product p
        LEFT JOIN 
          product_cato pc ON p.product_cato_id = pc.product_cato_id
        LEFT JOIN 
          supplier_suppling_products ssp ON p.product_id = ssp.product_id
        LEFT JOIN 
          supplier s ON ssp.sup_id = s.sup_id
        WHERE 
          p.quantity <= p.treshold ${categoryFilter}
        ORDER BY 
          (p.treshold - p.quantity) DESC
      `;
      }
      // Expiring items report
      else if (type === "expiry") {
        // Current date plus 90 days for expiring soon items
        const today = new Date();
        const ninetyDaysLater = new Date();
        ninetyDaysLater.setDate(today.getDate() + 90);

        const todayFormatted = today.toISOString().split("T")[0];
        const ninetyDaysFormatted = ninetyDaysLater.toISOString().split("T")[0];

        query = `
        SELECT 
          p.product_id,
          p.pname,
          p.quantity,
          p.price,
          p.exp_date,
          p.typr as product_type,
          pc.name AS category_name,
          (p.quantity * p.price) AS total_value
        FROM 
          product p
        LEFT JOIN 
          product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 
          p.exp_date BETWEEN ? AND ? 
          AND p.quantity > 0
          ${categoryFilter}
        ORDER BY 
          p.exp_date ASC
      `;
        params.unshift(todayFormatted, ninetyDaysFormatted);
      }
      // Stock movement report
      else if (type === "movement") {
        if (!startDate || !endDate) {
          throw new Error(
            "Start date and end date are required for movement reports"
          );
        }

        // For inventory movement, we need to calculate opening and closing stock
        // This is a more complex query that requires analyzing both customer orders and supplier orders
        query = `
        SELECT 
          p.product_id,
          p.pname,
          p.price,
          pc.name AS category_name,
          
          /* Get opening stock at the start date */
          (
            SELECT IFNULL(p.quantity, 0) - 
            IFNULL((
              SELECT SUM(cp.quantity)
              FROM customer_product cp
              JOIN cus_oder co ON cp.cus_oder_id = co.cus_oder_id
              WHERE cp.product_id = p.product_id
              AND co.created_at BETWEEN ? AND ?
            ), 0) + 
            IFNULL((
              SELECT SUM(sp.quantity)
              FROM supplier_product sp
              JOIN s_oder so ON sp.oder_id = so.oder_id
              WHERE sp.product_id = p.product_id
              AND so.created_at BETWEEN ? AND ?
            ), 0)
          ) AS opening_stock,
          
          /* Stock coming in during the period (from suppliers) */
          IFNULL((
            SELECT SUM(sp.quantity)
            FROM supplier_product sp
            JOIN s_oder so ON sp.oder_id = so.oder_id
            WHERE sp.product_id = p.product_id
            AND so.created_at BETWEEN ? AND ?
          ), 0) AS stock_in,
          
          /* Stock going out during the period (to customers) */
          IFNULL((
            SELECT SUM(cp.quantity)
            FROM customer_product cp
            JOIN cus_oder co ON cp.cus_oder_id = co.cus_oder_id
            WHERE cp.product_id = p.product_id
            AND co.created_at BETWEEN ? AND ?
          ), 0) AS stock_out,
          
          /* Current stock (closing stock) */
          p.quantity AS closing_stock
          
        FROM 
          product p
        LEFT JOIN 
          product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 
          1=1 ${categoryFilter}
        ORDER BY 
          p.product_id ASC
      `;

        // Add all the date parameters
        params.unshift(startDate, endDate); // For opening stock calculation - customer orders
        params.push(startDate, endDate); // For opening stock calculation - supplier orders
        params.push(startDate, endDate); // For stock in
        params.push(startDate, endDate); // For stock out
      }

      // Execute the query to get inventory data
      const [inventoryData] = await db.execute(query, params);

      // Calculate summary statistics
      const summary = await this.calculateSummaryStatistics(type, category);

      return {
        inventory: inventoryData,
        summary,
      };
    } catch (error) {
      console.error("Error in getInventoryReport:", error);
      throw error;
    }
  }

  /**
   * Calculate summary statistics for inventory reports
   */
  static async calculateSummaryStatistics(type, category) {
    try {
      let categoryFilter = "";
      let params = [];

      // Add category filter if specified
      if (category && category !== "all") {
        categoryFilter = "AND pc.name = ?";
        params.push(category);
      }

      // Query to get summary statistics
      const summaryQuery = `
        SELECT 
          COUNT(p.product_id) AS total_products,
          SUM(p.quantity * p.price) AS total_value,
          SUM(CASE WHEN p.quantity <= p.treshold THEN 1 ELSE 0 END) AS low_stock_items,
          SUM(CASE WHEN p.exp_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS expiring_soon
        FROM 
          product p
        LEFT JOIN 
          product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 
          1=1 ${categoryFilter}
      `;

      const [summaryResults] = await db.execute(summaryQuery, params);

      return (
        summaryResults[0] || {
          totalProducts: 0,
          totalValue: 0,
          lowStockItems: 0,
          expiringSoon: 0,
        }
      );
    } catch (error) {
      console.error("Error in calculateSummaryStatistics:", error);
      throw error;
    }
  }

  /**
   * Get list of product categories
   */
  static async getCategories() {
    try {
      const query = `
        SELECT 
          pc.product_cato_id,
          pc.name,
          pc.description,
          COUNT(p.product_id) AS product_count
        FROM 
          product_cato pc
        LEFT JOIN 
          product p ON pc.product_cato_id = p.product_cato_id
        GROUP BY 
          pc.product_cato_id
        ORDER BY 
          pc.name ASC
      `;

      const [categories] = await db.execute(query);
      return categories;
    } catch (error) {
      console.error("Error in getCategories:", error);
      throw error;
    }
  }

  /**
   * Get reorder list (items below threshold)
   */
  static async getReorderList() {
    try {
      const query = `
        SELECT 
          p.product_id,
          p.pname,
          p.quantity,
          p.treshold,
          p.price,
          p.exp_date,
          pc.name AS category_name,
          s.F_name AS supplier_first_name,
          s.L_name AS supplier_last_name,
          CONCAT(s.F_name, ' ', s.L_name) AS supplier_name,
          (p.treshold - p.quantity) AS quantity_to_order
        FROM 
          product p
        LEFT JOIN 
          product_cato pc ON p.product_cato_id = pc.product_cato_id
        LEFT JOIN 
          supplier_suppling_products ssp ON p.product_id = ssp.product_id
        LEFT JOIN 
          supplier s ON ssp.sup_id = s.sup_id
        WHERE 
          p.quantity < p.treshold
        ORDER BY 
          (p.treshold - p.quantity) DESC
      `;

      const [reorderList] = await db.execute(query);
      return reorderList;
    } catch (error) {
      console.error("Error in getReorderList:", error);
      throw error;
    }
  }

  /**
   * Get expiry report (items expiring within a certain period)
   */
  static async getExpiryReport(daysThreshold = 90) {
    try {
      const today = new Date();
      const thresholdDate = new Date();
      thresholdDate.setDate(today.getDate() + daysThreshold);

      const todayFormatted = today.toISOString().split("T")[0];
      const thresholdFormatted = thresholdDate.toISOString().split("T")[0];

      const query = `
        SELECT 
          p.product_id,
          p.pname,
          p.quantity,
          p.price,
          p.exp_date,
          pc.name AS category_name,
          (p.quantity * p.price) AS total_value,
          DATEDIFF(p.exp_date, CURDATE()) AS days_until_expiry
        FROM 
          product p
        LEFT JOIN 
          product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 
          p.exp_date BETWEEN ? AND ?
          AND p.quantity > 0
        ORDER BY 
          p.exp_date ASC
      `;

      const [expiryList] = await db.execute(query, [
        todayFormatted,
        thresholdFormatted,
      ]);
      return expiryList;
    } catch (error) {
      console.error("Error in getExpiryReport:", error);
      throw error;
    }
  }
}

module.exports = InventoryReportModel;
