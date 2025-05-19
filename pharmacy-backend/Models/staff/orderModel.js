// // models/staff/orderModel.js
// const { db } = require("../../db");

// class OrderModel {
//   /**
//    * Get all orders with optional filtering
//    * @param {Object} options - Filter options
//    * @returns {Promise<Array>} List of orders
//    */
//   static async getAllOrders(options = {}) {
//     try {
//       // Extract options with defaults
//       const page = options.page || 1;
//       const limit = options.limit || 10;
//       const status = options.status || null;
//       const customerId = options.customerId || null;

//       const offset = (page - 1) * limit;

//       // Build query with joins to get customer details
//       let query = `
//         SELECT
//           co.cus_oder_id AS order_id,
//           co.customer_id,
//           co.oder_status AS status,
//           co.value,
//           co.delivery_method,
//           co.created_at AS time,
//           c.name AS customer_name,
//           c.address,
//           cn.number AS telephone
//         FROM
//           cus_oder co
//         LEFT JOIN
//           customer c ON co.customer_id = c.customer_id
//         LEFT JOIN
//           cusnumber cn ON co.customer_id = cn.customer_id
//       `;

//       // Initialize where conditions and params
//       const whereConditions = [];
//       const queryParams = [];

//       // Filter by prescription orders (exclude them, we only want non-prescription orders)
//       whereConditions.push("co.prescription_id IS NULL");

//       // Add filters if provided
//       if (status) {
//         whereConditions.push("co.oder_status = ?");
//         queryParams.push(status);
//       }

//       if (customerId) {
//         whereConditions.push("co.customer_id = ?");
//         queryParams.push(customerId);
//       }

//       // Add WHERE clause
//       if (whereConditions.length > 0) {
//         query += " WHERE " + whereConditions.join(" AND ");
//       }

//       // Add order and pagination
//       query += " ORDER BY co.created_at DESC ";
//       queryParams.push();

//       // Execute query
//       const [orders] = await db.execute(query, queryParams);

//       // Get total count for pagination
//       let countQuery = `
//         SELECT COUNT(*) as total
//         FROM cus_oder co
//       `;

//       if (whereConditions.length > 0) {
//         countQuery += " WHERE " + whereConditions.join(" AND ");
//       }

//       const [countResult] = await db.execute(
//         countQuery,
//         whereConditions.length > 0 ? queryParams.slice(0, -2) : []
//       );

//       const total = countResult[0].total;

//       return {
//         orders,
//         pagination: {
//           total,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           pages: Math.ceil(total / limit),
//         },
//       };
//     } catch (error) {
//       console.error("Error in getAllOrders:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get order by ID with customer details
//    * @param {number} orderId - Order ID
//    * @returns {Promise<Object>} Order details
//    */
//   static async getOrderById(orderId) {
//     try {
//       const [orders] = await db.execute(
//         `
//         SELECT
//           co.cus_oder_id AS order_id,
//           co.customer_id,
//           co.oder_status AS status,
//           co.value,
//           co.delivery_method,
//           co.created_at AS time,
//           c.name AS customer_name,
//           c.address,
//           cn.number AS telephone
//         FROM
//           cus_oder co
//         LEFT JOIN
//           customer c ON co.customer_id = c.customer_id
//         LEFT JOIN
//           cusnumber cn ON c.customer_id = cn.customer_id
//         WHERE
//           co.cus_oder_id = ?
//         `,
//         [orderId]
//       );

//       return orders[0] || null;
//     } catch (error) {
//       console.error("Error in getOrderById:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get products in an order
//    * @param {number} orderId - Order ID
//    * @returns {Promise<Array>} List of products in the order
//    */
//   static async getOrderProducts(orderId) {
//     try {
//       const [products] = await db.execute(
//         `
//         SELECT
//           cp.product_id AS id,
//           p.pname AS name,
//           cp.quantity,
//           p.price,
//           (cp.quantity * p.price) AS total
//         FROM
//           customer_product cp
//         JOIN
//           product p ON cp.product_id = p.product_id
//         WHERE
//           cp.cus_oder_id = ?
//         `,
//         [orderId]
//       );

//       return products;
//     } catch (error) {
//       console.error("Error in getOrderProducts:", error);
//       throw error;
//     }
//   }

//   /**
//    * Update order status and potentially reduce inventory
//    * @param {number} orderId - Order ID
//    * @param {string} newStatus - New status
//    * @param {boolean} reduceInventory - Whether to reduce inventory
//    * @returns {Promise<Object>} Result of the update
//    */
//   //   static async updateOrderStatus(orderId, newStatus, reduceInventory = false) {
//   //     const connection = await db.getConnection();
//   //     try {
//   //       await connection.beginTransaction();

//   //       // Get the order to check if it exists and get customer ID
//   //       const [orders] = await connection.execute(
//   //         "SELECT cus_oder_id, customer_id, oder_status FROM cus_oder WHERE cus_oder_id = ?",
//   //         [orderId]
//   //       );

//   //       if (orders.length === 0) {
//   //         await connection.rollback();
//   //         return { success: false, message: "Order not found" };
//   //       }

//   //       const order = orders[0];
//   //       const oldStatus = order.oder_status;
//   //       const customerId = order.customer_id;

//   //       // Don't update if status is the same
//   //       if (oldStatus === newStatus) {
//   //         await connection.rollback();
//   //         return { success: true, message: "Status unchanged" };
//   //       }

//   //       // Update order status
//   //       await connection.execute(
//   //         "UPDATE cus_oder SET oder_status = ? WHERE cus_oder_id = ?",
//   //         [newStatus, orderId]
//   //       );

//   //       let inventoryReduced = false;

//   //       // If reduceInventory is true, reduce product quantities from inventory
//   //       if (reduceInventory) {
//   //         // Get products from the order
//   //         const [products] = await connection.execute(
//   //           `
//   //           SELECT product_id, quantity
//   //           FROM customer_product
//   //           WHERE cus_oder_id = ?
//   //         `,
//   //           [orderId]
//   //         );

//   //         // For each product, reduce inventory
//   //         for (const product of products) {
//   //           // Update product quantity
//   //           await connection.execute(
//   //             `
//   //             UPDATE product
//   //             SET quantity = GREATEST(0, quantity - ?)
//   //             WHERE product_id = ?
//   //           `,
//   //             [product.quantity, product.product_id]
//   //           );
//   //         }

//   //         inventoryReduced = true;
//   //       }

//   //       // Create a notification for the customer
//   //       const statusMessage = this.getStatusMessage(newStatus);
//   //       await connection.execute(
//   //         `
//   //         INSERT INTO notifications (
//   //           user_id,
//   //           user_type,
//   //           title,
//   //           message,
//   //           is_read
//   //         ) VALUES (?, 'customer', ?, ?, FALSE)
//   //         `,
//   //         [
//   //           customerId,
//   //           `Order Status Updated`,
//   //           `Your order #${orderId} status has been updated to: ${newStatus}. ${statusMessage}`,
//   //         ]
//   //       );

//   //       await connection.commit();
//   //       return {
//   //         success: true,
//   //         message: "Order status updated successfully",
//   //         oldStatus,
//   //         newStatus,
//   //         inventoryReduced,
//   //       };
//   //     } catch (error) {
//   //       await connection.rollback();
//   //       console.error("Error in updateOrderStatus:", error);
//   //       throw error;
//   //     } finally {
//   //       connection.release();
//   //     }
//   //   }
//   static async updateOrderStatus(orderId, newStatus, reduceInventory = false) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Get the order to check if it exists and get customer ID
//       const [orders] = await connection.execute(
//         "SELECT cus_oder_id, customer_id, oder_status, inventory_reduced FROM cus_oder WHERE cus_oder_id = ?",
//         [orderId]
//       );

//       if (orders.length === 0) {
//         await connection.rollback();
//         return { success: false, message: "Order not found" };
//       }

//       const order = orders[0];
//       const oldStatus = order.oder_status;
//       const customerId = order.customer_id;
//       const inventoryAlreadyReduced = order.inventory_reduced || false;

//       // Don't update if status is the same
//       if (oldStatus === newStatus) {
//         await connection.rollback();
//         return { success: true, message: "Status unchanged" };
//       }

//       // Update order status
//       await connection.execute(
//         "UPDATE cus_oder SET oder_status = ? WHERE cus_oder_id = ?",
//         [newStatus, orderId]
//       );

//       let inventoryReduced = false;

//       // If reduceInventory is true AND inventory hasn't already been reduced AND
//       // status is "Delivered" or "Ready for pickup", then reduce inventory
//       if (
//         reduceInventory &&
//         !inventoryAlreadyReduced &&
//         (newStatus === "Delivered" || newStatus === "Ready for pickup")
//       ) {
//         // Get products from the order
//         const [products] = await connection.execute(
//           `SELECT product_id, quantity
//          FROM customer_product
//          WHERE cus_oder_id = ?`,
//           [orderId]
//         );

//         // For each product, reduce inventory from the batch with the nearest expiry date
//         for (const product of products) {
//           // Get supplier product batches for this product, ordered by expiry date (earliest first)
//           const [supplierBatches] = await connection.execute(
//             `SELECT sup_id, product_id, oder_id, quantity, expired_date, Products_remaining
//            FROM supplier_product
//            WHERE product_id = ? AND Products_remaining > 0
//            ORDER BY expired_date ASC`,
//             [product.product_id]
//           );

//           let remainingToReduce = product.quantity;

//           // Reduce from each batch until we've reduced the full quantity
//           for (const batch of supplierBatches) {
//             if (remainingToReduce <= 0) break;

//             const reduceAmount = Math.min(
//               remainingToReduce,
//               batch.Products_remaining
//             );

//             // Update supplier_product batch
//             await connection.execute(
//               `UPDATE supplier_product
//              SET Products_remaining = Products_remaining - ?
//              WHERE sup_id = ? AND product_id = ? AND oder_id = ?`,
//               [reduceAmount, batch.sup_id, batch.product_id, batch.oder_id]
//             );

//             remainingToReduce -= reduceAmount;
//           }

//           // Also update the product's main quantity
//           await connection.execute(
//             `UPDATE product
//            SET quantity = GREATEST(0, quantity - ?)
//            WHERE product_id = ?`,
//             [product.quantity, product.product_id]
//           );
//         }

//         // Mark that we've reduced inventory for this order
//         await connection.execute(
//           `UPDATE cus_oder
//          SET inventory_reduced = TRUE
//          WHERE cus_oder_id = ?`,
//           [orderId]
//         );

//         inventoryReduced = true;
//       }

//       // Create a notification for the customer
//       const statusMessage = this.getStatusMessage(newStatus);
//       await connection.execute(
//         `INSERT INTO notifications (
//         user_id, user_type, title, message, is_read
//       ) VALUES (?, 'customer', ?, ?, FALSE)`,
//         [
//           customerId,
//           `Order Status Updated`,
//           `Your order #${orderId} status has been updated to: ${newStatus}. ${statusMessage}`,
//         ]
//       );

//       await connection.commit();
//       return {
//         success: true,
//         message: "Order status updated successfully",
//         oldStatus,
//         newStatus,
//         inventoryReduced,
//       };
//     } catch (error) {
//       await connection.rollback();
//       console.error("Error in updateOrderStatus:", error);
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }

//   /**
//    * Get status message based on status
//    * @param {string} status - Status
//    * @returns {string} Status message
//    */
//   static getStatusMessage(status) {
//     switch (status) {
//       case "Ready for pickup":
//         return "Your order is ready for pickup at our pharmacy.";
//       case "Delivered":
//         return "Your order has been delivered.";
//       case "Out for delivery":
//         return "Your order is out for delivery and will arrive soon.";
//       case "Processing":
//         return "Your order is being processed.";
//       case "Confirmed":
//         return "Your order has been confirmed.";
//       case "Delayed":
//         return "There is a delay in processing your order. We apologize for the inconvenience.";
//       case "Cancelled":
//         return "Your order has been cancelled.";
//       default:
//         return "";
//     }
//   }
// }

// module.exports = OrderModel;

// models/staff/orderModel.js
const { db } = require("../../db");

class OrderModel {
  /**
   * Get all orders with optional filtering
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} List of orders
   */
  static async getAllOrders(options = {}) {
    try {
      // Extract options with defaults
      const page = options.page || 1;
      const limit = options.limit || 10;
      const status = options.status || null;
      const customerId = options.customerId || null;

      const offset = (page - 1) * limit;

      // Build query with joins to get customer details
      let query = `
       SELECT 
    co.cus_oder_id AS order_id, 
    co.customer_id,
    co.oder_status AS status,
    co.value,
    co.delivery_method,
    co.created_at AS time,
    c.name AS customer_name,
    c.address,
    cn.number AS telephone,
    p.payment_method
  FROM 
    cus_oder co
  LEFT JOIN
    customer c ON co.customer_id = c.customer_id
  LEFT JOIN
    cusnumber cn ON co.customer_id = cn.customer_id
  LEFT JOIN
    payments p ON co.cus_oder_id = p.cus_oder_id
      `;

      // Initialize where conditions and params
      const whereConditions = [];
      const queryParams = [];

      // Filter by prescription orders (exclude them, we only want non-prescription orders)
      whereConditions.push("co.prescription_id IS NULL");

      // Add filters if provided
      if (status) {
        whereConditions.push("co.oder_status = ?");
        queryParams.push(status);
      }

      if (customerId) {
        whereConditions.push("co.customer_id = ?");
        queryParams.push(customerId);
      }

      // Add WHERE clause
      if (whereConditions.length > 0) {
        query += " WHERE " + whereConditions.join(" AND ");
      }

      // Add order and pagination
      query += " ORDER BY co.created_at DESC ";
      queryParams.push();

      // Execute query
      const [orders] = await db.execute(query, queryParams);

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM cus_oder co
      `;

      if (whereConditions.length > 0) {
        countQuery += " WHERE " + whereConditions.join(" AND ");
      }

      const [countResult] = await db.execute(
        countQuery,
        whereConditions.length > 0 ? queryParams.slice(0, -2) : []
      );

      const total = countResult[0].total;

      return {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in getAllOrders:", error);
      throw error;
    }
  }

  /**
   * Get order by ID with customer details
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  static async getOrderById(orderId) {
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
    c.name AS customer_name,
    c.address,
    cn.number AS telephone,
    p.payment_method
  FROM 
    cus_oder co
  LEFT JOIN
    customer c ON co.customer_id = c.customer_id
  LEFT JOIN
    cusnumber cn ON co.customer_id = cn.customer_id
  LEFT JOIN
    payments p ON co.cus_oder_id = p.cus_oder_id
        WHERE 
          co.cus_oder_id = ?
        `,
        [orderId]
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

  /**
   * Update order status and potentially reduce inventory
   * @param {number} orderId - Order ID
   * @param {string} newStatus - New status
   * @param {boolean} reduceInventory - Whether to reduce inventory
   * @returns {Promise<Object>} Result of the update
   */
  static async updateOrderStatus(orderId, newStatus, reduceInventory = false) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get the order to check if it exists and get customer ID
      const [orders] = await connection.execute(
        "SELECT cus_oder_id, customer_id, oder_status, inventory_reduced FROM cus_oder WHERE cus_oder_id = ?",
        [orderId]
      );

      if (orders.length === 0) {
        await connection.rollback();
        return { success: false, message: "Order not found" };
      }

      const order = orders[0];
      const oldStatus = order.oder_status;
      const customerId = order.customer_id;
      const inventoryAlreadyReduced = order.inventory_reduced || false;

      // Don't update if status is the same
      if (oldStatus === newStatus) {
        await connection.rollback();
        return { success: true, message: "Status unchanged" };
      }

      // Update order status
      await connection.execute(
        "UPDATE cus_oder SET oder_status = ? WHERE cus_oder_id = ?",
        [newStatus, orderId]
      );

      let inventoryReduced = false;

      // If reduceInventory is true AND inventory hasn't already been reduced,
      // then reduce inventory regardless of the status
      if (reduceInventory && !inventoryAlreadyReduced) {
        // Get products from the order
        const [products] = await connection.execute(
          `SELECT product_id, quantity
           FROM customer_product
           WHERE cus_oder_id = ?`,
          [orderId]
        );

        // For each product, reduce inventory from the batch with the nearest expiry date
        for (const product of products) {
          // Get supplier product batches for this product, ordered by expiry date (earliest first)
          const [supplierBatches] = await connection.execute(
            `SELECT sup_id, product_id, oder_id, quantity, expired_date, Products_remaining 
             FROM supplier_product 
             WHERE product_id = ? AND Products_remaining > 0 
             ORDER BY expired_date ASC`,
            [product.product_id]
          );

          let remainingToReduce = product.quantity;

          // Reduce from each batch until we've reduced the full quantity
          for (const batch of supplierBatches) {
            if (remainingToReduce <= 0) break;

            const reduceAmount = Math.min(
              remainingToReduce,
              batch.Products_remaining
            );

            // Update supplier_product batch
            await connection.execute(
              `UPDATE supplier_product 
               SET Products_remaining = Products_remaining - ? 
               WHERE sup_id = ? AND product_id = ? AND oder_id = ?`,
              [reduceAmount, batch.sup_id, batch.product_id, batch.oder_id]
            );

            remainingToReduce -= reduceAmount;
          }

          // Also update the product's main quantity
          await connection.execute(
            `UPDATE product
             SET quantity = GREATEST(0, quantity - ?) 
             WHERE product_id = ?`,
            [product.quantity, product.product_id]
          );
        }

        // Mark that we've reduced inventory for this order
        await connection.execute(
          `UPDATE cus_oder 
           SET inventory_reduced = TRUE 
           WHERE cus_oder_id = ?`,
          [orderId]
        );

        inventoryReduced = true;
      }

      // Create a notification for the customer
      const statusMessage = this.getStatusMessage(newStatus);
      await connection.execute(
        `INSERT INTO notifications (
          user_id, user_type, title, message, is_read
        ) VALUES (?, 'customer', ?, ?, FALSE)`,
        [
          customerId,
          `Order Status Updated`,
          `Your order #${orderId} status has been updated to: ${newStatus}. ${statusMessage}`,
        ]
      );

      await connection.commit();
      return {
        success: true,
        message: "Order status updated successfully",
        oldStatus,
        newStatus,
        inventoryReduced,
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error in updateOrderStatus:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete payment record for an order
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Result of the deletion
   */
  static async deletePaymentRecord(orderId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if the order exists
      const [orders] = await connection.execute(
        "SELECT cus_oder_id FROM cus_oder WHERE cus_oder_id = ?",
        [orderId]
      );

      if (orders.length === 0) {
        await connection.rollback();
        return { success: false, message: "Order not found" };
      }

      // Check if payment record exists
      const [payments] = await connection.execute(
        "SELECT payment_id FROM payments WHERE cus_oder_id = ?",
        [orderId]
      );

      if (payments.length === 0) {
        await connection.rollback();
        return { success: false, message: "Payment record not found" };
      }

      // Delete payment record
      await connection.execute("DELETE FROM payments WHERE cus_oder_id = ?", [
        orderId,
      ]);

      await connection.commit();
      return {
        success: true,
        message: "Payment record deleted successfully",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error in deletePaymentRecord:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get status message based on status
   * @param {string} status - Status
   * @returns {string} Status message
   */
  static getStatusMessage(status) {
    switch (status) {
      case "Ready for pickup":
        return "Your order is ready for pickup at our pharmacy.";
      case "Delivered":
        return "Your order has been delivered.";
      case "Out for delivery":
        return "Your order is out for delivery and will arrive soon.";
      case "Processing":
        return "Your order is being processed.";
      case "Confirmed":
        return "Your order has been confirmed and is being prepared.";
      case "Delayed":
        return "There is a delay in processing your order. We apologize for the inconvenience.";
      case "Cancelled":
        return "Your order has been cancelled.";
      default:
        return "";
    }
  }
}

module.exports = OrderModel;
