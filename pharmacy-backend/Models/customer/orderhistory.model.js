const { db } = require("../../db");

// class OrderModel {
//   /**
//    * Get all orders for a specific customer with pagination and filters
//    * @param {number} customerId - Customer ID
//    * @param {Object} options - Filtering and pagination options
//    * @returns {Promise<Object>} Orders with pagination data
//    */
//   static async getUserOrders(customerId, options = {}) {
//     try {
//       const {
//         page = 1,
//         pageSize = 10,
//         status = null,
//         startDate = null,
//         endDate = null,
//         sortField = "created_at",
//         sortDirection = "DESC",
//       } = options;

//       const offset = (page - 1) * pageSize;

//       let sql = `
//         SELECT
//           co.cus_oder_id as id,
//           co.oder_status as status,
//           co.value as total,
//           co.created_at as date,
//           co.delivery_method,
//           co.address,
//           co.telephone as phone,
//           COUNT(cp.product_id) as itemCount
//         FROM
//           cus_oder co
//         LEFT JOIN
//           customer_product cp ON co.cus_oder_id = cp.cus_oder_id
//         WHERE
//           co.customer_id = ?
//       `;

//       const queryParams = [customerId];

//       if (status && status !== "all") {
//         sql += ` AND co.oder_status = ?`;
//         queryParams.push(status);
//       }

//       if (startDate) {
//         sql += ` AND co.created_at >= ?`;
//         queryParams.push(startDate);
//       }

//       if (endDate) {
//         sql += ` AND co.created_at <= ?`;
//         queryParams.push(endDate);
//       }

//       sql += ` GROUP BY co.cus_oder_id`;
//       sql += ` ORDER BY co.${sortField} ${sortDirection}`;

//       let countSql = `
//         SELECT COUNT(DISTINCT co.cus_oder_id) as total
//         FROM cus_oder co
//         WHERE co.customer_id = ?
//       `;
//       const countParams = [customerId];

//       if (status && status !== "all") {
//         countSql += ` AND co.oder_status = ?`;
//         countParams.push(status);
//       }

//       if (startDate) {
//         countSql += ` AND co.created_at >= ?`;
//         countParams.push(startDate);
//       }

//       if (endDate) {
//         countSql += ` AND co.created_at <= ?`;
//         countParams.push(endDate);
//       }

//       sql += ` LIMIT ? OFFSET ?`;
//       queryParams.push(pageSize, offset);

//       const [ordersResults] = await db.execute(sql, queryParams);
//       const [countResults] = await db.execute(countSql, countParams);

//       for (const order of ordersResults) {
//         const [paymentResults] = await db.execute(
//           `SELECT payment_method, status as payment_status
//            FROM payments
//            WHERE cus_oder_id = ?`,
//           [order.id]
//         );

//         if (paymentResults.length > 0) {
//           order.paymentMethod = paymentResults[0].payment_method;
//           order.paymentStatus = paymentResults[0].payment_status;
//         } else {
//           order.paymentMethod = "Not specified";
//           order.paymentStatus = "Unknown";
//         }
//       }

//       return {
//         orders: ordersResults,
//         total: countResults[0].total,
//         page,
//         pages: Math.ceil(countResults[0].total / pageSize),
//       };
//     } catch (error) {
//       console.error("Error in getUserOrders:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get detailed information for a specific order
//    * @param {number} orderId - Order ID
//    * @param {number} customerId - Customer ID
//    * @returns {Promise<Object>} Order details with items
//    */
//   static async getOrderDetails(orderId, customerId) {
//     try {
//       const [orderResults] = await db.execute(
//         `SELECT
//           co.cus_oder_id as id,
//           co.oder_status as status,
//           co.value as total,
//           co.created_at as date,
//           co.delivery_method,
//           co.address,
//           co.telephone as phone,
//           co.inventory_reduced,
//           co.prescription_id
//         FROM
//           cus_oder co
//         WHERE
//           co.cus_oder_id = ? AND co.customer_id = ?`,
//         [orderId, customerId]
//       );

//       if (orderResults.length === 0) {
//         return { success: false, message: "Order not found" };
//       }

//       const order = orderResults[0];

//       const [paymentResults] = await db.execute(
//         `SELECT
//           payment_method,
//           status as payment_status,
//           transaction_id
//         FROM
//           payments
//         WHERE
//           cus_oder_id = ?`,
//         [orderId]
//       );

//       if (paymentResults.length > 0) {
//         order.paymentMethod = paymentResults[0].payment_method;
//         order.paymentStatus = paymentResults[0].payment_status;
//         order.transactionId = paymentResults[0].transaction_id || null;
//       } else {
//         order.paymentMethod = "Not specified";
//         order.paymentStatus = "Unknown";
//       }

//       const [orderItemsResults] = await db.execute(
//         `SELECT
//           cp.product_id,
//           cp.quantity,
//           cp.price,
//           p.pname as name,
//           p.image,
//           (cp.quantity * cp.price) as total
//         FROM
//           customer_product cp
//         JOIN
//           product p ON cp.product_id = p.product_id
//         WHERE
//           cp.cus_oder_id = ? AND cp.customer_id = ?`,
//         [orderId, customerId]
//       );

//       return {
//         success: true,
//         order,
//         orderItems: orderItemsResults,
//       };
//     } catch (error) {
//       console.error("Error in getOrderDetails:", error);
//       throw error;
//     }
//   }

//   /**
//    * Search for orders by various parameters
//    * @param {number} customerId - Customer ID
//    * @param {string} query - Search query
//    * @param {Object} options - Filtering and pagination options
//    * @returns {Promise<Object>} Search results
//    */
//   static async searchOrders(customerId, query, options = {}) {
//     try {
//       const {
//         page = 1,
//         pageSize = 10,
//         status = null,
//         startDate = null,
//         endDate = null,
//       } = options;

//       const offset = (page - 1) * pageSize;
//       const searchPattern = `%${query}%`;

//       let sql = `
//         SELECT DISTINCT
//           co.cus_oder_id as id,
//           co.oder_status as status,
//           co.value as total,
//           co.created_at as date,
//           co.delivery_method
//         FROM
//           cus_oder co
//         LEFT JOIN
//           customer_product cp ON co.cus_oder_id = cp.cus_oder_id
//         LEFT JOIN
//           product p ON cp.product_id = p.product_id
//         WHERE
//           co.customer_id = ?
//           AND (
//             co.cus_oder_id LIKE ?
//             OR p.pname LIKE ?
//           )
//       `;

//       const queryParams = [customerId, searchPattern, searchPattern];

//       if (status && status !== "all") {
//         sql += ` AND co.oder_status = ?`;
//         queryParams.push(status);
//       }

//       if (startDate) {
//         sql += ` AND co.created_at >= ?`;
//         queryParams.push(startDate);
//       }

//       if (endDate) {
//         sql += ` AND co.created_at <= ?`;
//         queryParams.push(endDate);
//       }

//       sql += ` ORDER BY co.created_at DESC`;
//       sql += ` LIMIT ? OFFSET ?`;
//       queryParams.push(pageSize, offset);

//       let countSql = `
//         SELECT COUNT(DISTINCT co.cus_oder_id) as total
//         FROM
//           cus_oder co
//         LEFT JOIN
//           customer_product cp ON co.cus_oder_id = cp.cus_oder_id
//         LEFT JOIN
//           product p ON cp.product_id = p.product_id
//         WHERE
//           co.customer_id = ?
//           AND (
//             co.cus_oder_id LIKE ?
//             OR p.pname LIKE ?
//           )
//       `;

//       const countParams = [customerId, searchPattern, searchPattern];

//       if (status && status !== "all") {
//         countSql += ` AND co.oder_status = ?`;
//         countParams.push(status);
//       }

//       if (startDate) {
//         countSql += ` AND co.created_at >= ?`;
//         countParams.push(startDate);
//       }

//       if (endDate) {
//         countSql += ` AND co.created_at <= ?`;
//         countParams.push(endDate);
//       }

//       const [ordersResults] = await db.execute(sql, queryParams);
//       const [countResults] = await db.execute(countSql, countParams);

//       for (const order of ordersResults) {
//         const [itemCountResults] = await db.execute(
//           `SELECT COUNT(*) as count
//            FROM customer_product
//            WHERE cus_oder_id = ?`,
//           [order.id]
//         );
//         order.itemCount = itemCountResults[0].count;

//         const [paymentResults] = await db.execute(
//           `SELECT payment_method, status as payment_status
//            FROM payments
//            WHERE cus_oder_id = ?`,
//           [order.id]
//         );

//         if (paymentResults.length > 0) {
//           order.paymentMethod = paymentResults[0].payment_method;
//           order.paymentStatus = paymentResults[0].payment_status;
//         } else {
//           order.paymentMethod = "Not specified";
//           order.paymentStatus = "Unknown";
//         }
//       }

//       return {
//         orders: ordersResults,
//         total: countResults[0].total,
//         page,
//         pages: Math.ceil(countResults[0].total / pageSize),
//       };
//     } catch (error) {
//       console.error("Error in searchOrders:", error);
//       throw error;
//     }
//   }
// }

// module.exports = OrderModel;

class CustomerOrderModel {
  /**
   * Get all orders for a specific customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} List of orders
   */
  static async getCustomerOrders(customerId) {
    try {
      const [orders] = await db.execute(
        `
        SELECT 
          co.cus_oder_id AS order_id, 
          co.customer_id,
          co.oder_status AS status,
          co.value,
          co.delivery_method,
          co.created_at AS time,
          co.address
        FROM 
          cus_oder co
        WHERE 
          co.customer_id = ?
        ORDER BY 
          co.created_at DESC
        `,
        [customerId]
      );

      return orders;
    } catch (error) {
      console.error("Error in getCustomerOrders:", error);
      throw error;
    }
  }

  /**
   * Get order by ID for a specific customer (with authorization check)
   * @param {number} orderId - Order ID
   * @param {number} customerId - Customer ID for authorization check
   * @returns {Promise<Object>} Order details
   */
  static async getOrderById(orderId, customerId) {
    try {
      const [orders] = await db.execute(
        `
        SELECT 
          co.cus_oder_id AS order_id, 
          co.customer_id,
          co.oder_status AS status,
          co.value,
          co.delivery_method,
          co.created_at AS time,
          co.address,
          c.name AS customer_name,
          cn.number AS telephone
        FROM 
          cus_oder co
        LEFT JOIN
          customer c ON co.customer_id = c.customer_id
        LEFT JOIN
          cusnumber cn ON c.customer_id = cn.customer_id
        WHERE 
          co.cus_oder_id = ? 
          AND co.customer_id = ?
        `,
        [orderId, customerId]
      );

      return orders[0] || null;
    } catch (error) {
      console.error("Error in getOrderById:", error);
      throw error;
    }
  }

  /**
   * Get products in an order
   * @param {number} orderId - Order ID
   * @returns {Promise<Array>} List of products in the order
   */
  static async getOrderProducts(orderId) {
    try {
      const [products] = await db.execute(
        `
        SELECT 
          cp.product_id AS id,
          p.pname AS name,
          cp.quantity,
          p.price,
          (cp.quantity * p.price) AS total
        FROM 
          customer_product cp
        JOIN
          product p ON cp.product_id = p.product_id
        WHERE 
          cp.cus_oder_id = ?
        `,
        [orderId]
      );

      return products;
    } catch (error) {
      console.error("Error in getOrderProducts:", error);
      throw error;
    }
  }
}

module.exports = CustomerOrderModel;
