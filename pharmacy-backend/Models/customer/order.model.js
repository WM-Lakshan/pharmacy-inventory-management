// models/order.model.js
const { db } = require("../../db");
const { v4: uuidv4 } = require("uuid");

class OrderModel {
  /**
   * Get order by ID
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  static async getOrderById(orderId) {
    try {
      const [orders] = await db.execute(
        `SELECT 
          co.cus_oder_id,
          co.customer_id,
          co.pharmacy_staff_id,
          co.prescription_id,
          co.oder_status,
          co.value,
          co.delivery_method,
          co.created_at,
          c.name AS customer_name,
          c.email AS customer_email,
          c.address AS customer_address
        FROM 
          cus_oder co
        LEFT JOIN 
          customer c ON co.customer_id = c.customer_id
        WHERE 
          co.cus_oder_id = ?`,
        [orderId]
      );

      if (orders.length === 0) {
        return null;
      }

      const order = orders[0];

      // Get order items
      const [orderItems] = await db.execute(
        `SELECT 
          cp.product_id,
          p.pname AS name,
          cp.quantity,
          cp.price,
          (cp.quantity * cp.price) AS total,
          p.image
        FROM 
          customer_product cp
        JOIN 
          product p ON cp.product_id = p.product_id
        WHERE 
          cp.cus_oder_id = ?`,
        [orderId]
      );

      // Include items in the order object
      return {
        ...order,
        items: orderItems,
      };
    } catch (error) {
      console.error("Error in getOrderById:", error);
      throw error;
    }
  }

  /**
   * Get all orders with optional filtering
   * @param {Object} options - Filter options
   * @returns {Promise<Object>} Orders with pagination info
   */
  static async getAllOrders(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status = null,
        customerId = null,
        startDate = null,
        endDate = null,
        sortBy = "created_at",
        sortOrder = "DESC",
      } = options;

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Build query with filters
      let query = `
        SELECT 
          co.cus_oder_id,
          co.customer_id,
          co.pharmacy_staff_id,
          co.prescription_id,
          co.oder_status,
          co.value,
          co.delivery_method,
          co.created_at,
          c.name AS customer_name,
          ps.F_name AS staff_first_name,
          ps.L_name AS staff_last_name
        FROM 
          cus_oder co
        LEFT JOIN 
          customer c ON co.customer_id = c.customer_id
        LEFT JOIN 
          pharmacy_staff ps ON co.pharmacy_staff_id = ps.pharmacy_staff_id
        WHERE 1=1
      `;

      // Array to hold query parameters
      const queryParams = [];

      // Add filters if provided
      if (status) {
        query += " AND co.oder_status = ?";
        queryParams.push(status);
      }

      if (customerId) {
        query += " AND co.customer_id = ?";
        queryParams.push(customerId);
      }

      if (startDate) {
        query += " AND co.created_at >= ?";
        queryParams.push(startDate);
      }

      if (endDate) {
        query += " AND co.created_at <= ?";
        queryParams.push(endDate);
      }

      // Add sorting
      query += ` ORDER BY co.${sortBy} ${sortOrder}`;

      // Add pagination
      query += " LIMIT ? OFFSET ?";
      queryParams.push(parseInt(limit), parseInt(offset));

      // Execute query
      const [orders] = await db.execute(query, queryParams);

      // Count total orders for pagination
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM cus_oder co
        WHERE 1=1
      `;

      // Add the same filters to count query
      const countParams = [];

      if (status) {
        countQuery += " AND co.oder_status = ?";
        countParams.push(status);
      }

      if (customerId) {
        countQuery += " AND co.customer_id = ?";
        countParams.push(customerId);
      }

      if (startDate) {
        countQuery += " AND co.created_at >= ?";
        countParams.push(startDate);
      }

      if (endDate) {
        countQuery += " AND co.created_at <= ?";
        countParams.push(endDate);
      }

      const [countResult] = await db.execute(countQuery, countParams);
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
   * Get orders for a specific customer
   * @param {number} customerId - Customer ID
   * @param {Object} options - Filter and pagination options
   * @returns {Promise<Object>} Customer orders with pagination
   */
  static async getCustomerOrders(customerId, options = {}) {
    try {
      options.customerId = customerId;
      return await this.getAllOrders(options);
    } catch (error) {
      console.error("Error in getCustomerOrders:", error);
      throw error;
    }
  }

  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order
   */
  static async createOrder(orderData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const {
        customerId,
        items,
        prescriptionId = null,
        deliveryMethod = "Order Pickup",
        deliveryAddress = null,
        notes = null,
      } = orderData;

      // Calculate order value
      let orderValue = 0;
      for (const item of items) {
        orderValue += item.price * item.quantity;
      }

      // Create order record
      const [orderResult] = await connection.execute(
        `INSERT INTO cus_oder (
          customer_id,
          prescription_id,
          oder_status,
          value,
          delivery_method,
          created_at
        ) VALUES (?, ?, 'Pending', ?, ?, NOW())`,
        [customerId, prescriptionId, orderValue, deliveryMethod]
      );

      const orderId = orderResult.insertId;

      // Add order items
      for (const item of items) {
        await connection.execute(
          `INSERT INTO customer_product (
            customer_id,
            product_id,
            cus_oder_id,
            quantity,
            price
          ) VALUES (?, ?, ?, ?, ?)`,
          [customerId, item.productId, orderId, item.quantity, item.price]
        );
      }

      // Create notification for staff
      await connection.execute(
        `INSERT INTO notifications (
          user_id,
          user_type,
          title,
          message,
          is_read
        ) VALUES (
          1,
          'staff',
          'New Order',
          ?,
          FALSE
        )`,
        [
          `New order #${orderId} created by customer #${customerId}. Total value: Rs.${orderValue}`,
        ]
      );

      // Create notification for customer
      await connection.execute(
        `INSERT INTO notifications (
          user_id,
          user_type,
          title,
          message,
          is_read
        ) VALUES (
          ?,
          'customer',
          'Order Created',
          ?,
          FALSE
        )`,
        [
          customerId,
          `Your order #${orderId} has been created successfully. Total value: Rs.${orderValue}. Please complete the payment to process your order.`,
        ]
      );

      // If order includes prescription items, update prescription status
      if (prescriptionId) {
        await connection.execute(
          `UPDATE prescription
           SET status = 'Confirmed'
           WHERE prescription_id = ?`,
          [prescriptionId]
        );
      }

      // Clear customer's cart
      await connection.execute(
        `DELETE FROM cart
         WHERE customer_id = ?`,
        [customerId]
      );

      await connection.commit();

      // Get the complete order with items
      return await this.getOrderById(orderId);
    } catch (error) {
      await connection.rollback();
      console.error("Error in createOrder:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update order status
   * @param {number} orderId - Order ID
   * @param {string} status - New status
   * @param {number} staffId - Staff ID making the update (optional)
   * @returns {Promise<Object>} Updated order
   */
  static async updateOrderStatus(orderId, status, staffId = null) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get current order
      const [orders] = await connection.execute(
        `SELECT * FROM cus_oder WHERE cus_oder_id = ?`,
        [orderId]
      );

      if (orders.length === 0) {
        await connection.rollback();
        throw new Error(`Order with ID ${orderId} not found`);
      }

      const order = orders[0];
      const oldStatus = order.oder_status;
      const customerId = order.customer_id;

      // Update order status and assign staff if provided
      if (staffId) {
        await connection.execute(
          `UPDATE cus_oder
           SET oder_status = ?, pharmacy_staff_id = ?
           WHERE cus_oder_id = ?`,
          [status, staffId, orderId]
        );
      } else {
        await connection.execute(
          `UPDATE cus_oder
           SET oder_status = ?
           WHERE cus_oder_id = ?`,
          [status, orderId]
        );
      }

      // Create notification for customer
      await connection.execute(
        `INSERT INTO notifications (
          user_id,
          user_type,
          title,
          message,
          is_read
        ) VALUES (
          ?,
          'customer',
          'Order Status Updated',
          ?,
          FALSE
        )`,
        [
          customerId,
          `Your order #${orderId} status has been updated from "${oldStatus}" to "${status}".`,
        ]
      );

      // If order is completed, check if it's a prescription order and update prescription status
      if (status === "Completed" && order.prescription_id) {
        await connection.execute(
          `UPDATE prescription
           SET status = 'Completed'
           WHERE prescription_id = ?`,
          [order.prescription_id]
        );
      }

      await connection.commit();

      // Get updated order
      return await this.getOrderById(orderId);
    } catch (error) {
      await connection.rollback();
      console.error("Error in updateOrderStatus:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Assign staff to an order
   * @param {number} orderId - Order ID
   * @param {number} staffId - Staff ID
   * @returns {Promise<Object>} Updated order
   */
  static async assignStaffToOrder(orderId, staffId) {
    try {
      await db.execute(
        `UPDATE cus_oder
         SET pharmacy_staff_id = ?
         WHERE cus_oder_id = ?`,
        [staffId, orderId]
      );

      return await this.getOrderById(orderId);
    } catch (error) {
      console.error("Error in assignStaffToOrder:", error);
      throw error;
    }
  }

  /**
   * Add items to an existing order
   * @param {number} orderId - Order ID
   * @param {Array} items - Array of items to add
   * @returns {Promise<Object>} Updated order
   */
  static async addItemsToOrder(orderId, items) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get current order
      const [orders] = await connection.execute(
        `SELECT * FROM cus_oder WHERE cus_oder_id = ?`,
        [orderId]
      );

      if (orders.length === 0) {
        await connection.rollback();
        throw new Error(`Order with ID ${orderId} not found`);
      }

      const order = orders[0];
      const customerId = order.customer_id;

      // Calculate additional value
      let additionalValue = 0;
      for (const item of items) {
        additionalValue += item.price * item.quantity;
      }

      // Add items to order
      for (const item of items) {
        // Check if item already exists in order
        const [existingItems] = await connection.execute(
          `SELECT * FROM customer_product
           WHERE cus_oder_id = ? AND product_id = ?`,
          [orderId, item.productId]
        );

        if (existingItems.length > 0) {
          // Update existing item quantity
          await connection.execute(
            `UPDATE customer_product
             SET quantity = quantity + ?
             WHERE cus_oder_id = ? AND product_id = ?`,
            [item.quantity, orderId, item.productId]
          );
        } else {
          // Add new item
          await connection.execute(
            `INSERT INTO customer_product (
              customer_id,
              product_id,
              cus_oder_id,
              quantity,
              price
            ) VALUES (?, ?, ?, ?, ?)`,
            [customerId, item.productId, orderId, item.quantity, item.price]
          );
        }
      }

      // Update order value
      await connection.execute(
        `UPDATE cus_oder
         SET value = value + ?
         WHERE cus_oder_id = ?`,
        [additionalValue, orderId]
      );

      await connection.commit();

      // Get updated order
      return await this.getOrderById(orderId);
    } catch (error) {
      await connection.rollback();
      console.error("Error in addItemsToOrder:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Remove an item from an order
   * @param {number} orderId - Order ID
   * @param {number} productId - Product ID to remove
   * @returns {Promise<Object>} Updated order
   */
  static async removeItemFromOrder(orderId, productId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get product price and quantity
      const [products] = await connection.execute(
        `SELECT quantity, price FROM customer_product
         WHERE cus_oder_id = ? AND product_id = ?`,
        [orderId, productId]
      );

      if (products.length === 0) {
        await connection.rollback();
        throw new Error(
          `Product with ID ${productId} not found in order ${orderId}`
        );
      }

      const product = products[0];
      const valueReduction = product.quantity * product.price;

      // Remove product from order
      await connection.execute(
        `DELETE FROM customer_product
         WHERE cus_oder_id = ? AND product_id = ?`,
        [orderId, productId]
      );

      // Update order value
      await connection.execute(
        `UPDATE cus_oder
         SET value = value - ?
         WHERE cus_oder_id = ?`,
        [valueReduction, orderId]
      );

      await connection.commit();

      // Get updated order
      return await this.getOrderById(orderId);
    } catch (error) {
      await connection.rollback();
      console.error("Error in removeItemFromOrder:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update order item quantity
   * @param {number} orderId - Order ID
   * @param {number} productId - Product ID to update
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Updated order
   */
  static async updateOrderItemQuantity(orderId, productId, quantity) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get product price and current quantity
      const [products] = await connection.execute(
        `SELECT quantity, price FROM customer_product
         WHERE cus_oder_id = ? AND product_id = ?`,
        [orderId, productId]
      );

      if (products.length === 0) {
        await connection.rollback();
        throw new Error(
          `Product with ID ${productId} not found in order ${orderId}`
        );
      }

      const product = products[0];
      const oldValue = product.quantity * product.price;
      const newValue = quantity * product.price;
      const valueDifference = newValue - oldValue;

      // Update product quantity
      await connection.execute(
        `UPDATE customer_product
         SET quantity = ?
         WHERE cus_oder_id = ? AND product_id = ?`,
        [quantity, orderId, productId]
      );

      // Update order value
      await connection.execute(
        `UPDATE cus_oder
         SET value = value + ?
         WHERE cus_oder_id = ?`,
        [valueDifference, orderId]
      );

      await connection.commit();

      // Get updated order
      return await this.getOrderById(orderId);
    } catch (error) {
      await connection.rollback();
      console.error("Error in updateOrderItemQuantity:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get best selling products in a time period
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {number} limit - Maximum number of products to return
   * @returns {Promise<Array>} Best selling products
   */
  static async getBestSellingProducts(startDate, endDate, limit = 10) {
    try {
      const [products] = await db.execute(
        `SELECT 
          p.product_id,
          p.pname AS name,
          p.price,
          p.image,
          SUM(cp.quantity) AS total_quantity,
          SUM(cp.quantity * cp.price) AS total_sales
        FROM 
          customer_product cp
        JOIN 
          product p ON cp.product_id = p.product_id
        JOIN 
          cus_oder co ON cp.cus_oder_id = co.cus_oder_id
        WHERE 
          co.created_at BETWEEN ? AND ?
          AND co.oder_status != 'Cancelled'
        GROUP BY 
          p.product_id
        ORDER BY 
          total_quantity DESC
        LIMIT ?`,
        [startDate, endDate, limit]
      );

      return products;
    } catch (error) {
      console.error("Error in getBestSellingProducts:", error);
      throw error;
    }
  }

  /**
   * Get sales statistics by period
   * @param {string} period - Period type (day, week, month, year)
   * @param {number} limit - Number of periods to return
   * @returns {Promise<Array>} Sales statistics by period
   */
  static async getSalesByPeriod(period, limit = 12) {
    try {
      let groupFormat;
      let limitClause = "";

      // Set date format and limit based on period
      switch (period.toLowerCase()) {
        case "day":
          groupFormat = "%Y-%m-%d";
          limitClause = `ORDER BY period DESC LIMIT ${limit}`;
          break;
        case "week":
          groupFormat = "%x-%v"; // Year-Week
          limitClause = `ORDER BY period DESC LIMIT ${limit}`;
          break;
        case "month":
          groupFormat = "%Y-%m";
          limitClause = `ORDER BY period DESC LIMIT ${limit}`;
          break;
        case "year":
          groupFormat = "%Y";
          limitClause = `ORDER BY period DESC LIMIT ${limit}`;
          break;
        default:
          throw new Error(`Invalid period: ${period}`);
      }

      const [sales] = await db.execute(
        `SELECT 
          DATE_FORMAT(co.created_at, '${groupFormat}') AS period,
          COUNT(DISTINCT co.cus_oder_id) AS order_count,
          SUM(co.value) AS total_sales,
          AVG(co.value) AS average_order_value
        FROM 
          cus_oder co
        WHERE 
          co.oder_status != 'Cancelled'
        GROUP BY 
          period
        ${limitClause}`
      );

      return sales;
    } catch (error) {
      console.error("Error in getSalesByPeriod:", error);
      throw error;
    }
  }

  /**
   * Cancel an order
   * @param {number} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Canceled order
   */
  static async cancelOrder(orderId, reason) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get current order
      const [orders] = await connection.execute(
        `SELECT * FROM cus_oder WHERE cus_oder_id = ?`,
        [orderId]
      );

      if (orders.length === 0) {
        await connection.rollback();
        throw new Error(`Order with ID ${orderId} not found`);
      }

      const order = orders[0];

      // Can only cancel pending orders
      if (
        order.oder_status !== "Pending" &&
        order.oder_status !== "Processing"
      ) {
        await connection.rollback();
        throw new Error(`Cannot cancel order with status ${order.oder_status}`);
      }

      // Update order status
      await connection.execute(
        `UPDATE cus_oder
         SET oder_status = 'Cancelled'
         WHERE cus_oder_id = ?`,
        [orderId]
      );

      // Create notification for customer
      await connection.execute(
        `INSERT INTO notifications (
          user_id,
          user_type,
          title,
          message,
          is_read
        ) VALUES (
          ?,
          'customer',
          'Order Cancelled',
          ?,
          FALSE
        )`,
        [
          order.customer_id,
          `Your order #${orderId} has been cancelled. Reason: ${reason}`,
        ]
      );

      // Create notification for staff
      await connection.execute(
        `INSERT INTO notifications (
          user_id,
          user_type,
          title,
          message,
          is_read
        ) VALUES (
          1,
          'staff',
          'Order Cancelled',
          ?,
          FALSE
        )`,
        [`Order #${orderId} has been cancelled. Reason: ${reason}`]
      );

      await connection.commit();

      // Get updated order
      return await this.getOrderById(orderId);
    } catch (error) {
      await connection.rollback();
      console.error("Error in cancelOrder:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get total sales amount by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<number>} Total sales amount
   */
  static async getTotalSales(startDate, endDate) {
    try {
      const [result] = await db.execute(
        `SELECT 
          SUM(value) AS total_sales
        FROM 
          cus_oder
        WHERE 
          created_at BETWEEN ? AND ?
          AND oder_status != 'Cancelled'`,
        [startDate, endDate]
      );

      return result[0].total_sales || 0;
    } catch (error) {
      console.error("Error in getTotalSales:", error);
      throw error;
    }
  }

  /**
   * Get total number of orders by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<number>} Total number of orders
   */
  static async getTotalOrders(startDate, endDate) {
    try {
      const [result] = await db.execute(
        `SELECT 
          COUNT(*) AS total_orders
        FROM 
          cus_oder
        WHERE 
          created_at BETWEEN ? AND ?
          AND oder_status != 'Cancelled'`,
        [startDate, endDate]
      );

      return result[0].total_orders || 0;
    } catch (error) {
      console.error("Error in getTotalOrders:", error);
      throw error;
    }
  }
}

module.exports = OrderModel;
