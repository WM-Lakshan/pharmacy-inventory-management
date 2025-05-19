// models/customer.model.js
const { db } = require("../../db");
const bcrypt = require("bcrypt");

class CustomerModel {
  /**
   * Get all products with optional pagination and category filtering
   */
  //   static async getAllProducts(page = 1, pageSize = 12, category = null) {
  //     const offset = (page - 1) * pageSize;

  //     let query = `
  //       SELECT p.*, pc.name as category_name
  //       FROM product p
  //       LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
  //     `;

  //     const params = [];

  //     if (category && category !== 'all') {
  //       query += ` WHERE pc.name = ?`;
  //       params.push(category);
  //     }

  //     query += ` LIMIT ? OFFSET ?`;
  //     params.push(pageSize, offset);

  //     // Get products
  //     const [products] = await db.execute(query, params);

  //     // Get total count for pagination
  //     let countQuery = `SELECT COUNT(*) as total FROM product p LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id`;

  //     if (category && category !== 'all') {
  //       countQuery += ` WHERE pc.name = ?`;
  //     }

  //     const [totalResult] = await db.execute(
  //       countQuery,
  //       category && category !== 'all' ? [category] : []
  //     );

  //     return {
  //       products,
  //       total: totalResult[0].total,
  //       page,
  //       pages: Math.ceil(totalResult[0].total / pageSize)
  //     };
  //   }

  // In Models/customer/customer.model.js

  static async getAllProducts(page = 1, pageSize = 12, category = null) {
    const offset = (page - 1) * pageSize;

    // Base query
    let query = `
        SELECT p.*, pc.name as category_name
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
    `;

    const params = [];

    // Handle category filter
    if (category && category !== "all") {
      query += " WHERE pc.name = ?";
      params.push(category);
    }

    // Add pagination - IMPORTANT: Ensure parameters are in correct order
    query += " LIMIT ? OFFSET ?";
    params.push(pageSize.toString(), offset.toString()); // Convert to strings if needed

    try {
      console.log("Executing query:", query);
      console.log("With parameters:", params);

      const [products] = await db.execute(query, params);

      // Get total count for pagination
      let countQuery = `
            SELECT COUNT(*) as total 
            FROM product p 
            LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        `;
      const countParams = [];

      if (category && category !== "all") {
        countQuery += " WHERE pc.name = ?";
        countParams.push(category);
      }

      const [totalResult] = await db.execute(countQuery, countParams);

      return {
        products,
        total: totalResult[0].total,
        page,
        pages: Math.ceil(totalResult[0].total / pageSize),
      };
    } catch (error) {
      console.error("Database error in getAllProducts:", {
        error: error.message,
        query: query,
        params: params,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Get featured products
   *
  static async getFeaturedProducts() {
    try {
      const [products] = await db.execute(`
            SELECT p.*, pc.name as category_name
            FROM product p
            LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
            ORDER BY RAND()
            LIMIT 8
        `);
      return products;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  }

  /**
   * Get top selling products
   */
  static async getTopSellingProducts() {
    const [products] = await db.execute(`
      SELECT p.*, pc.name as category_name
      FROM product p
      LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
      ORDER BY RAND() 
      LIMIT 8
    `);

    return products;
  }

  /**
   * Search products
   */
  static async searchProducts(query, category, page = 1, pageSize = 12) {
    const offset = (page - 1) * pageSize;

    let searchQuery = `
      SELECT p.*, pc.name as category_name
      FROM product p
      LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
      WHERE 1=1
    `;

    const params = [];

    if (query) {
      searchQuery += ` AND p.pname LIKE ?`;
      params.push(`%${query}%`);
    }

    if (category && category !== "all") {
      searchQuery += ` AND pc.name = ?`;
      params.push(category);
    }

    searchQuery += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    // Get products
    const [products] = await db.execute(searchQuery, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM product p 
      LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
      WHERE 1=1
    `;

    const countParams = [];

    if (query) {
      countQuery += ` AND p.pname LIKE ?`;
      countParams.push(`%${query}%`);
    }

    if (category && category !== "all") {
      countQuery += ` AND pc.name = ?`;
      countParams.push(category);
    }

    const [totalResult] = await db.execute(countQuery, countParams);

    return {
      products,
      total: totalResult[0].total,
      page,
      pages: Math.ceil(totalResult[0].total / pageSize),
    };
  }

  /**
   * Get a single product by ID with details
   */
  static async getProductById(productId) {
    const [products] = await db.execute(
      `
      SELECT p.*, pc.name as category_name, pc.description as category_description
      FROM product p
      LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
      WHERE p.product_id = ?
    `,
      [productId]
    );

    if (products.length === 0) {
      return null;
    }

    return products[0];
  }

  /**
   * Get related products
   */
  static async getRelatedProducts(productId) {
    // First, get the product's category
    const [productResult] = await db.execute(
      `
      SELECT product_cato_id FROM product WHERE product_id = ?
    `,
      [productId]
    );

    if (productResult.length === 0) {
      return [];
    }

    const categoryId = productResult[0].product_cato_id;

    // Get related products from the same category
    const [products] = await db.execute(
      `
      SELECT p.*, pc.name as category_name
      FROM product p
      LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
      WHERE p.product_cato_id = ? AND p.product_id != ?
      ORDER BY RAND()
      LIMIT 4
    `,
      [categoryId, productId]
    );

    return products;
  }

  /**
   * Get all categories
   */
  static async getAllCategories() {
    // Get all categories with product counts
    const [categories] = await db.execute(`
      SELECT pc.product_cato_id as id, pc.name, pc.description, COUNT(p.product_id) as count
      FROM product_cato pc
      LEFT JOIN product p ON pc.product_cato_id = p.product_cato_id
      GROUP BY pc.product_cato_id
      ORDER BY pc.name
    `);

    // Get total product count
    const [totalProducts] = await db.execute(`
      SELECT COUNT(*) as total FROM product
    `);

    const allCategories = [
      { id: "all", name: "All Categories", count: totalProducts[0].total },
      ...categories,
    ];

    return allCategories;
  }

  /**
   * Get cart items for the customer
   */
  static async getCartItems(customerId) {
    const [cartItems] = await db.execute(
      `
      SELECT c.cart_id as id, c.product_id, p.pname as name, p.price, c.quantity, 
             p.image, p.type as requiresPrescription, p.quantity as stockCount
      FROM cart c
      JOIN product p ON c.product_id = p.product_id
      WHERE c.customer_id = ?
    `,
      [customerId]
    );

    return cartItems;
  }

  /**
   * Check if product exists and is in stock
   */
  static async checkProductStock(productId, quantity) {
    const [productResult] = await db.execute(
      `
      SELECT product_id, quantity, type
      FROM product
      WHERE product_id = ?
    `,
      [productId]
    );

    if (productResult.length === 0) {
      return { exists: false };
    }

    const product = productResult[0];

    return {
      exists: true,
      product,
      inStock: product.quantity >= quantity,
      requiresPrescription: product.type === "prescription needed",
    };
  }

  /**
   * Add product to cart or update quantity if already exists
   */
  static async addToCart(customerId, productId, quantity) {
    // Check if the product is already in the cart
    const [existingCartItem] = await db.execute(
      `
      SELECT cart_id, quantity
      FROM cart
      WHERE customer_id = ? AND product_id = ?
    `,
      [customerId, productId]
    );

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      if (existingCartItem.length > 0) {
        // Update existing cart item
        const newQuantity = existingCartItem[0].quantity + quantity;

        await connection.execute(
          `
          UPDATE cart
          SET quantity = ?
          WHERE cart_id = ?
        `,
          [newQuantity, existingCartItem[0].cart_id]
        );
      } else {
        // Add new cart item
        await connection.execute(
          `
          INSERT INTO cart (customer_id, product_id, quantity)
          VALUES (?, ?, ?)
        `,
          [customerId, productId, quantity]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItemQuantity(customerId, cartItemId, quantity) {
    // Check if cart item exists and belongs to the customer
    const [cartItemResult] = await db.execute(
      `
      SELECT c.cart_id, c.product_id, p.quantity as stockQuantity
      FROM cart c
      JOIN product p ON c.product_id = p.product_id
      WHERE c.cart_id = ? AND c.customer_id = ?
    `,
      [cartItemId, customerId]
    );

    if (cartItemResult.length === 0) {
      return { found: false };
    }

    const cartItem = cartItemResult[0];

    // Check if there's enough stock
    if (cartItem.stockQuantity < quantity) {
      return {
        found: true,
        sufficientStock: false,
        stockQuantity: cartItem.stockQuantity,
      };
    }

    // Update cart item quantity
    await db.execute(
      `
      UPDATE cart
      SET quantity = ?
      WHERE cart_id = ?
    `,
      [quantity, cartItemId]
    );

    return { found: true, sufficientStock: true, updated: true };
  }

  /**
   * Remove a product from the cart
   */
  static async removeCartItem(customerId, cartItemId) {
    // Check if cart item exists and belongs to the customer
    const [cartItemResult] = await db.execute(
      `
      SELECT cart_id
      FROM cart
      WHERE cart_id = ? AND customer_id = ?
    `,
      [cartItemId, customerId]
    );

    if (cartItemResult.length === 0) {
      return { found: false };
    }

    // Remove cart item
    await db.execute(
      `
      DELETE FROM cart
      WHERE cart_id = ?
    `,
      [cartItemId]
    );

    return { found: true, removed: true };
  }

  /**
   * Get order summary for checkout
   */
  static async getOrderSummary(customerId) {
    // Get cart items with product details
    const [cartItems] = await db.execute(
      `
      SELECT c.cart_id as id, c.product_id, p.pname as name, p.price, c.quantity, 
             p.image, p.type as requiresPrescription
      FROM cart c
      JOIN product p ON c.product_id = p.product_id
      WHERE c.customer_id = ?
    `,
      [customerId]
    );

    if (cartItems.length === 0) {
      return null;
    }

    // Calculate subtotal and check if any item requires prescription
    let subtotal = 0;
    let requiresPrescription = false;

    const items = cartItems.map((item) => {
      const total = item.price * item.quantity;
      subtotal += total;

      if (item.requiresPrescription === "prescription needed") {
        requiresPrescription = true;
      }

      return {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total,
      };
    });

    // Delivery method (default to pickup)
    const deliveryMethod = "Order Pickup";
    const shippingFee = 0;

    // Total calculation
    const total = subtotal + shippingFee;

    return {
      items,
      subtotal,
      shippingFee,
      total,
      deliveryMethod,
      requiresPrescription,
    };
  }

  /**
   * Check if customer has valid prescription
   */
  static async hasValidPrescription(customerId) {
    const [prescriptions] = await db.execute(
      `
      SELECT prescription_id, status
      FROM prescription
      WHERE customer_id = ? AND status = 'Approved'
      ORDER BY uploaded_at DESC
      LIMIT 1
    `,
      [customerId]
    );

    return prescriptions.length > 0;
  }

  /**
   * Create new order
   */
  static async createOrder(customerId, orderData) {
    const { deliveryMethod, address, paymentMethod } = orderData;

    // Check if cart has items
    const [cartItems] = await db.execute(
      `
      SELECT c.cart_id, c.product_id, p.pname, p.price, c.quantity, 
             p.type as requiresPrescription, p.quantity as stockQuantity
      FROM cart c
      JOIN product p ON c.product_id = p.product_id
      WHERE c.customer_id = ?
    `,
      [customerId]
    );

    if (cartItems.length === 0) {
      return { success: false, message: "Your cart is empty" };
    }

    // Calculate order total and check items
    let orderTotal = 0;
    let allItemsInStock = true;
    let prescriptionRequired = false;

    cartItems.forEach((item) => {
      orderTotal += item.price * item.quantity;

      if (item.stockQuantity < item.quantity) {
        allItemsInStock = false;
      }

      if (item.requiresPrescription === "prescription needed") {
        prescriptionRequired = true;
      }
    });

    // Add shipping fee if home delivery
    if (deliveryMethod === "Home Delivery") {
      orderTotal += 300; // Shipping fee
    }

    // Verify all items are in stock
    if (!allItemsInStock) {
      return {
        success: false,
        message: "Some items in your cart are out of stock",
      };
    }

    // Check if prescription is required and uploaded
    if (prescriptionRequired) {
      const hasPrescription = await this.hasValidPrescription(customerId);

      if (!hasPrescription) {
        return {
          success: false,
          message: "Prescription required for some items in your cart",
        };
      }
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Create order
      const [orderResult] = await connection.execute(
        `
        INSERT INTO cus_oder (customer_id, order_status, value, delivery_method)
        VALUES (?, ?, ?, ?)
      `,
        [customerId, "Pending", orderTotal, deliveryMethod]
      );

      const orderId = orderResult.insertId;

      // Add order items
      for (const item of cartItems) {
        await connection.execute(
          `
          INSERT INTO customer_product (customer_id, product_id, cus_oder_id, quantity, price)
          VALUES (?, ?, ?, ?, ?)
        `,
          [customerId, item.product_id, orderId, item.quantity, item.price]
        );

        // Update product stock
        await connection.execute(
          `
          UPDATE product
          SET quantity = quantity - ?
          WHERE product_id = ?
        `,
          [item.quantity, item.product_id]
        );
      }

      // Clear the cart
      await connection.execute(
        `
        DELETE FROM cart
        WHERE customer_id = ?
      `,
        [customerId]
      );

      // If prescription was required, link it to the order
      if (prescriptionRequired) {
        const [latestPrescription] = await connection.execute(
          `
          SELECT prescription_id
          FROM prescription
          WHERE customer_id = ? AND status = 'Approved'
          ORDER BY uploaded_at DESC
          LIMIT 1
        `,
          [customerId]
        );

        if (latestPrescription.length > 0) {
          await connection.execute(
            `
            UPDATE cus_oder
            SET prescription_id = ?
            WHERE cus_oder_id = ?
          `,
            [latestPrescription[0].prescription_id, orderId]
          );
        }
      }

      // Create notification for customer
      await connection.execute(
        `
        INSERT INTO notifications (user_id, user_type, title, message, is_read)
        VALUES (?, 'customer', 'Order Placed', 'Your order #${orderId} has been placed successfully.', FALSE)
      `,
        [customerId]
      );

      // Create notification for staff
      await connection.execute(
        `
        INSERT INTO notifications (user_id, user_type, title, message, is_read)
        VALUES (1, 'staff', 'New Order', 'New order #${orderId} has been placed by a customer.', FALSE)
      `,
        []
      );

      await connection.commit();

      return {
        success: true,
        message: "Order placed successfully",
        orderId,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update order status after payment
   */
  static async updateOrderAfterPayment(customerId, orderId) {
    // Update order status to paid
    await db.execute(
      `
      UPDATE cus_oder
      SET order_status = 'Processing'
      WHERE cus_oder_id = ? AND customer_id = ?
    `,
      [orderId, customerId]
    );

    // Create notification for customer
    await db.execute(
      `
      INSERT INTO notifications (user_id, user_type, title, message, is_read)
      VALUES (?, 'customer', 'Payment Successful', 'Your payment for order #${orderId} has been processed successfully.', FALSE)
    `,
      [customerId]
    );

    return {
      success: true,
      message: "Payment processed successfully",
      transactionId: "TXN-" + Math.floor(100000 + Math.random() * 900000),
    };
  }

  /**
   * Get orders for the customer
   */
  static async getOrders(customerId, page = 1, pageSize = 10, filters = {}) {
    const { status, startDate, endDate } = filters;
    const offset = (page - 1) * pageSize;

    // Build query
    let query = `
      SELECT o.cus_oder_id AS id, o.created_at AS date, o.order_status AS status,
             o.value AS total, COUNT(cp.product_id) AS itemCount, 'Cash on Delivery' AS paymentMethod
      FROM cus_oder o
      LEFT JOIN customer_product cp ON o.cus_oder_id = cp.cus_oder_id
      WHERE o.customer_id = ?
    `;

    let countQuery = `
      SELECT COUNT(DISTINCT o.cus_oder_id) AS total
      FROM cus_oder o
      WHERE o.customer_id = ?
    `;

    const queryParams = [customerId];
    const countParams = [customerId];

    // Add filters
    if (status && status !== "all") {
      query += ` AND o.order_status = ?`;
      countQuery += ` AND o.order_status = ?`;
      queryParams.push(status);
      countParams.push(status);
    }

    if (startDate) {
      query += ` AND o.created_at >= ?`;
      countQuery += ` AND o.created_at >= ?`;
      queryParams.push(startDate);
      countParams.push(startDate);
    }

    if (endDate) {
      query += ` AND o.created_at <= ?`;
      countQuery += ` AND o.created_at <= ?`;
      queryParams.push(endDate);
      countParams.push(endDate);
    }

    // Group and order
    query += ` GROUP BY o.cus_oder_id ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(pageSize, offset);

    // Execute queries
    const [orders] = await db.execute(query, queryParams);
    const [countResult] = await db.execute(countQuery, countParams);

    return {
      orders,
      total: countResult[0].total,
      page,
      pageSize,
      pages: Math.ceil(countResult[0].total / pageSize),
    };
  }

  /**
   * Get recent orders for the customer
   */
  static async getRecentOrders(customerId, limit = 5) {
    const [orders] = await db.execute(
      `
      SELECT o.cus_oder_id AS id, o.created_at AS date, o.order_status AS status,
             o.value AS total, COUNT(cp.product_id) AS items
      FROM cus_oder o
      LEFT JOIN customer_product cp ON o.cus_oder_id = cp.cus_oder_id
      WHERE o.customer_id = ?
      GROUP BY o.cus_oder_id
      ORDER BY o.created_at DESC
      LIMIT ?
    `,
      [customerId, limit]
    );

    return orders;
  }

  /**
   * Get order details by ID
   */
  static async getOrderById(customerId, orderId) {
    // Get order details
    const [orders] = await db.execute(
      `
      SELECT o.cus_oder_id AS id, o.created_at AS date, o.order_status AS status,
             o.value AS total, o.delivery_method
      FROM cus_oder o
      WHERE o.cus_oder_id = ? AND o.customer_id = ?
    `,
      [orderId, customerId]
    );

    if (orders.length === 0) {
      return null;
    }

    const order = orders[0];

    // Get order items
    const [items] = await db.execute(
      `
      SELECT cp.product_id, p.pname AS name, cp.quantity, cp.price,
             (cp.quantity * cp.price) AS total
      FROM customer_product cp
      JOIN product p ON cp.product_id = p.product_id
      WHERE cp.cus_oder_id = ? AND cp.customer_id = ?
    `,
      [orderId, customerId]
    );

    return { ...order, items };
  }

  /**
   * Upload prescription
   */
  static async uploadPrescription(customerId, prescriptionData) {
    const { fullName, telephone, deliveryMethod, deliveryAddress, note } =
      prescriptionData;

    // Insert prescription record
    const [result] = await db.execute(
      `
      INSERT INTO prescription (pharmacy_staff_id, status, customer_id, delivery_method, note)
      VALUES (NULL, 'Pending', ?, ?, ?)
    `,
      [customerId, deliveryMethod, note || null]
    );

    const prescriptionId = result.insertId;

    // Create notification for customer
    await db.execute(
      `
      INSERT INTO notifications (user_id, user_type, title, message, is_read)
      VALUES (?, 'customer', 'Prescription Uploaded', 'Your prescription has been uploaded and is pending review.', FALSE)
    `,
      [customerId]
    );

    // Create notification for staff
    await db.execute(
      `
      INSERT INTO notifications (user_id, user_type, title, message, is_read)
      VALUES (1, 'staff', 'New Prescription', 'A new prescription has been uploaded by a customer.', FALSE)
    `,
      []
    );

    return {
      success: true,
      message: "Prescription uploaded successfully",
      prescriptionId,
    };
  }

  /**
   * Get prescriptions
   */
  static async getPrescriptions(customerId) {
    const [prescriptions] = await db.execute(
      `
      SELECT 
        prescription_id AS id, 
        uploaded_at AS date, 
        status, 
        pharmacy_staff_id,
        delivery_method,
        'Dr. Smith' AS doctor
      FROM prescription
      WHERE customer_id = ?
      ORDER BY uploaded_at DESC
    `,
      [customerId]
    );

    return prescriptions;
  }

  /**
   * Get prescription by ID
   */
  static async getPrescriptionById(customerId, prescriptionId) {
    const [prescriptions] = await db.execute(
      `
      SELECT 
        prescription_id AS id, 
        uploaded_at AS date, 
        status, 
        pharmacy_staff_id,
        delivery_method,
        note,
        'Dr. Smith' AS doctor
      FROM prescription
      WHERE prescription_id = ? AND customer_id = ?
    `,
      [prescriptionId, customerId]
    );

    if (prescriptions.length === 0) {
      return null;
    }

    return prescriptions[0];
  }

  /**
   * Get customer profile
   */
  static async getProfile(customerId) {
    const [customers] = await db.execute(
      `
      SELECT customer_id AS id, name, email, address, image AS avatar, role
      FROM customer
      WHERE customer_id = ?
    `,
      [customerId]
    );

    if (customers.length === 0) {
      return null;
    }

    const customer = customers[0];

    // Get customer phone numbers
    const [phoneNumbers] = await db.execute(
      `
      SELECT number AS phone
      FROM cusnumber
      WHERE customer_id = ?
    `,
      [customerId]
    );

    return {
      ...customer,
      phone: phoneNumbers.length > 0 ? phoneNumbers[0].phone : null,
    };
  }

  /**
   * Update customer profile
   */
  static async updateProfile(customerId, profileData) {
    const { firstName, lastName, phone } = profileData;
    const fullName = `${firstName} ${lastName}`.trim();

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Update customer name
      await connection.execute(
        `
        UPDATE customer
        SET name = ?
        WHERE customer_id = ?
      `,
        [fullName, customerId]
      );

      // Update phone number if provided
      if (phone) {
        // Check if phone number already exists
        const [existingPhones] = await connection.execute(
          `
          SELECT number
          FROM cusnumber
          WHERE customer_id = ?
        `,
          [customerId]
        );

        if (existingPhones.length > 0) {
          // Update existing phone number
          await connection.execute(
            `
            UPDATE cusnumber
            SET number = ?
            WHERE customer_id = ? AND number = ?
          `,
            [phone, customerId, existingPhones[0].number]
          );
        } else {
          // Add new phone number
          await connection.execute(
            `
            INSERT INTO cusnumber (customer_id, number)
            VALUES (?, ?)
          `,
            [customerId, phone]
          );
        }
      }

      await connection.commit();

      return { success: true, message: "Profile updated successfully" };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Change customer password
   */
  static async changePassword(customerId, currentPassword, newPassword) {
    // Get current password
    const [customers] = await db.execute(
      `
      SELECT password
      FROM customer
      WHERE customer_id = ?
    `,
      [customerId]
    );

    if (customers.length === 0) {
      return { success: false, message: "Customer not found" };
    }

    // Verify current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      customers[0].password
    );

    if (!isMatch) {
      return { success: false, message: "Current password is incorrect" };
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.execute(
      `
      UPDATE customer
      SET password = ?
      WHERE customer_id = ?
    `,
      [hashedPassword, customerId]
    );

    return { success: true, message: "Password changed successfully" };
  }

  /**
   * Update avatar
   */
  static async updateAvatar(customerId, avatarUrl) {
    await db.execute(
      `
      UPDATE customer
      SET image = ?
      WHERE customer_id = ?
    `,
      [avatarUrl, customerId]
    );

    return {
      success: true,
      message: "Avatar updated successfully",
      avatarUrl,
    };
  }

  /**
   * Get customer addresses (mock implementation)
   */
  static async getAddresses(customerId) {
    // For this example, we'll just return a mock address
    // In a real app, you'd fetch addresses from a table
    const mockAddresses = [
      {
        id: 1,
        type: "Home",
        address: customerId > 0 ? `123 Home St, Colombo` : "No address found",
        isDefault: true,
        phone: null,
      },
    ];

    return mockAddresses;
  }
}

module.exports = CustomerModel;
