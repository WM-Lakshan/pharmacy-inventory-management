// models/checkout.model.js
// const { db } = require("../db");

// class CheckoutModel {
//   /**
//    * Create a new order from cart items
//    */
//   static async createOrderFromCart(connection, data) {
//     const {
//       customerId,
//       deliveryMethod,
//       address,
//       telephone,
//       total,
//       inventoryReduced = false,
//     } = data;

//     // Ensure address is always a string, never null
//     const addressStr = address || "";

//     console.log("Creating order with address:", addressStr);
//     console.log("Creating order with telephone:", telephone);

//     // Create order record - notice we're using the sanitized address
//     const [orderResult] = await connection.execute(
//       `INSERT INTO cus_oder (
//           customer_id,
//           oder_status,
//           value,
//           delivery_method,
//           address,
//           telephone,
//           inventory_reduced
//         ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [
//         customerId,
//         "Pending", // Initial status
//         total,
//         deliveryMethod,
//         addressStr, // Always pass a string value, empty if not provided
//         telephone,
//         inventoryReduced ? 1 : 0,
//       ]
//     );

//     const orderId = orderResult.insertId;

//     // Get cart items
//     const [cartItems] = await connection.execute(
//       `SELECT c.product_id, p.price, c.quantity
//        FROM cart c
//        JOIN product p ON c.product_id = p.product_id
//        WHERE c.customer_id = ?`,
//       [customerId]
//     );

//     // Add order items
//     for (const item of cartItems) {
//       await connection.execute(
//         `INSERT INTO customer_product (
//           customer_id,
//           product_id,
//           cus_oder_id,
//           quantity,
//           price
//         ) VALUES (?, ?, ?, ?, ?)`,
//         [customerId, item.product_id, orderId, item.quantity, item.price]
//       );

//       // Reduce inventory if required
//       if (inventoryReduced) {
//         await connection.execute(
//           `UPDATE product
//            SET quantity = quantity - ?
//            WHERE product_id = ?`,
//           [item.quantity, item.product_id]
//         );
//       }
//     }

//     // Clear the cart
//     await connection.execute(`DELETE FROM cart WHERE customer_id = ?`, [
//       customerId,
//     ]);

//     return orderId;
//   }

//   /**
//    * Create a new order from a prescription
//    */
//   static async createOrderFromPrescription(connection, data) {
//     const {
//       customerId,
//       prescriptionId,
//       deliveryMethod,
//       address,
//       telephone,
//       total,
//       inventoryReduced = false,
//     } = data;

//     // Ensure address is always a string, never null
//     const addressStr = address || "";

//     console.log("Creating prescription order with address:", addressStr);
//     console.log("Creating prescription order with telephone:", telephone);

//     // Create order record with sanitized address
//     const [orderResult] = await connection.execute(
//       `INSERT INTO cus_oder (
//           customer_id,
//           prescription_id,
//           oder_status,
//           value,
//           delivery_method,
//           address,
//           telephone,
//           inventory_reduced
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         customerId,
//         prescriptionId,
//         "Pending", // Initial status
//         total,
//         deliveryMethod,
//         addressStr, // Always pass a string value, empty if not provided
//         telephone,
//         inventoryReduced ? 1 : 0,
//       ]
//     );

//     const orderId = orderResult.insertId;

//     // Get prescription products
//     const [prescriptionProducts] = await connection.execute(
//       `SELECT pp.product_id, p.price, pp.quantity
//        FROM prescription_product pp
//        JOIN product p ON pp.product_id = p.product_id
//        WHERE pp.prescription_id = ?`,
//       [prescriptionId]
//     );

//     // Add order items
//     for (const item of prescriptionProducts) {
//       await connection.execute(
//         `INSERT INTO customer_product (
//           customer_id,
//           product_id,
//           cus_oder_id,
//           quantity,
//           price
//         ) VALUES (?, ?, ?, ?, ?)`,
//         [customerId, item.product_id, orderId, item.quantity, item.price]
//       );

//       // Reduce inventory if required
//       if (inventoryReduced) {
//         await connection.execute(
//           `UPDATE product
//            SET quantity = quantity - ?
//            WHERE product_id = ?`,
//           [item.quantity, item.product_id]
//         );
//       }
//     }

//     // Update prescription status to Confirmed
//     await connection.execute(
//       `UPDATE prescription
//        SET status = 'Confirmed'
//        WHERE prescription_id = ?`,
//       [prescriptionId]
//     );

//     return orderId;
//   }

//   /**
//    * Create a new order from a single product
//    */
//   static async createOrderFromProduct(connection, data) {
//     const {
//       customerId,
//       productId,
//       quantity,
//       price,
//       deliveryMethod,
//       address,
//       telephone,
//       total,
//       inventoryReduced = false,
//     } = data;

//     // Ensure address is always a string, never null
//     const addressStr = address || "";

//     console.log("Creating product order with address:", addressStr);
//     console.log("Creating product order with telephone:", telephone);

//     // Create order record with sanitized address
//     const [orderResult] = await connection.execute(
//       `INSERT INTO cus_oder (
//           customer_id,
//           oder_status,
//           value,
//           delivery_method,
//           address,
//           telephone,
//           inventory_reduced
//         ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [
//         customerId,
//         "Pending", // Initial status
//         total,
//         deliveryMethod,
//         addressStr, // Always pass a string value, empty if not provided
//         telephone,
//         inventoryReduced ? 1 : 0,
//       ]
//     );

//     const orderId = orderResult.insertId;

//     // Add the product to order items
//     await connection.execute(
//       `INSERT INTO customer_product (
//         customer_id,
//         product_id,
//         cus_oder_id,
//         quantity,
//         price
//       ) VALUES (?, ?, ?, ?, ?)`,
//       [customerId, productId, orderId, quantity, price]
//     );

//     // Reduce inventory if required
//     if (inventoryReduced) {
//       await connection.execute(
//         `UPDATE product
//          SET quantity = quantity - ?
//          WHERE product_id = ?`,
//         [quantity, productId]
//       );
//     }

//     return orderId;
//   }

//   /**
//    * Create payment record
//    */
//   static async createPayment(connection, data) {
//     const { orderId, customerId, paymentMethod, amount } = data;

//     // Insert payment record
//     const [paymentResult] = await connection.execute(
//       `INSERT INTO payments (
//         cus_oder_id,
//         customer_id,
//         payment_method,
//         amount
//       ) VALUES (?, ?, ?, ?)`,
//       [orderId, customerId, paymentMethod, amount]
//     );

//     return paymentResult.insertId;
//   }

//   /**
//    * Get cart total for a customer
//    */
//   static async getCartTotal(customerId) {
//     const [results] = await db.execute(
//       `SELECT SUM(p.price * c.quantity) as total
//        FROM cart c
//        JOIN product p ON c.product_id = p.product_id
//        WHERE c.customer_id = ?`,
//       [customerId]
//     );

//     return results[0]?.total || 0;
//   }

//   /**
//    * Get prescription total
//    */
//   static async getPrescriptionTotal(prescriptionId) {
//     const [results] = await db.execute(
//       `SELECT SUM(p.price * pp.quantity) as total
//        FROM prescription_product pp
//        JOIN product p ON pp.product_id = p.product_id
//        WHERE pp.prescription_id = ?`,
//       [prescriptionId]
//     );

//     return results[0]?.total || 0;
//   }

//   /**
//    * Get product details
//    */
//   static async getProductDetails(productId) {
//     const [results] = await db.execute(
//       `SELECT product_id, pname, price, quantity, type, image
//        FROM product
//        WHERE product_id = ?`,
//       [productId]
//     );

//     return results[0] || null;
//   }

//   /**
//    * Create notification for customer
//    */
//   static async createNotification(connection, data) {
//     const { userId, userType, title, message, link = null } = data;

//     await connection.execute(
//       `INSERT INTO notifications (
//         user_id,
//         user_type,
//         title,
//         message,
//         is_read,
//         link
//       ) VALUES (?, ?, ?, ?, ?, ?)`,
//       [
//         userId,
//         userType,
//         title,
//         message,
//         0, // Not read
//         link,
//       ]
//     );
//   }
// }

// module.exports = CheckoutModel;

// models/checkout.model.js
// models/checkout.model.js
const { db } = require("../db");

class CheckoutModel {
  /**
   * Create a new order from cart items
   */
  static async createOrderFromCart(connection, data) {
    const {
      customerId,
      deliveryMethod,
      address,
      telephone,
      total,
      inventoryReduced = false,
    } = data;

    // Ensure address is always a string, never null
    const addressStr = address || "";

    console.log("Creating order with address:", addressStr);
    console.log("Creating order with telephone:", telephone);

    // Check inventory availability first
    const [cartItems] = await connection.execute(
      `SELECT c.product_id, p.price, c.quantity, p.quantity as available_quantity, p.pname
       FROM cart c
       JOIN product p ON c.product_id = p.product_id
       WHERE c.customer_id = ?`,
      [customerId]
    );

    // Validate inventory for all items
    const unavailableItems = [];
    for (const item of cartItems) {
      if (item.quantity > item.available_quantity) {
        unavailableItems.push({
          name: item.pname,
          requested: item.quantity,
          available: item.available_quantity,
        });
      }
    }

    // If any items are unavailable, stop the process
    if (unavailableItems.length > 0) {
      return {
        success: false,
        message: "Some items are out of stock",
        unavailableItems,
      };
    }

    // Create order record - notice we're using the sanitized address
    const [orderResult] = await connection.execute(
      `INSERT INTO cus_oder (
          customer_id, 
          oder_status, 
          value, 
          delivery_method, 
          address, 
          telephone,
          inventory_reduced
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        "Pending", // Initial status
        total,
        deliveryMethod,
        addressStr, // Always pass a string value, empty if not provided
        telephone,
        inventoryReduced ? 1 : 0,
      ]
    );

    const orderId = orderResult.insertId;

    // Add order items
    for (const item of cartItems) {
      await connection.execute(
        `INSERT INTO customer_product (
          customer_id, 
          product_id, 
          cus_oder_id, 
          quantity, 
          price
        ) VALUES (?, ?, ?, ?, ?)`,
        [customerId, item.product_id, orderId, item.quantity, item.price]
      );

      // Reduce inventory if required, using batch-wise reduction
      if (inventoryReduced) {
        await this.reduceInventoryBatchWise(
          connection,
          item.product_id,
          item.quantity
        );
      }
    }

    // Clear the cart
    await connection.execute(`DELETE FROM cart WHERE customer_id = ?`, [
      customerId,
    ]);

    return {
      success: true,
      orderId,
    };
  }

  /**
   * Create a new order from a prescription
   */
  static async createOrderFromPrescription(connection, data) {
    const {
      customerId,
      prescriptionId,
      deliveryMethod,
      address,
      telephone,
      total,
      inventoryReduced = false,
    } = data;

    // Ensure address is always a string, never null
    const addressStr = address || "";

    console.log("Creating prescription order with address:", addressStr);
    console.log("Creating prescription order with telephone:", telephone);

    // Get prescription products to check inventory
    const [prescriptionProducts] = await connection.execute(
      `SELECT pp.product_id, p.price, pp.quantity, p.quantity as available_quantity, p.pname
       FROM prescription_product pp
       JOIN product p ON pp.product_id = p.product_id
       WHERE pp.prescription_id = ?`,
      [prescriptionId]
    );

    // Validate inventory for all items
    const unavailableItems = [];
    for (const item of prescriptionProducts) {
      if (item.quantity > item.available_quantity) {
        unavailableItems.push({
          name: item.pname,
          requested: item.quantity,
          available: item.available_quantity,
        });
      }
    }

    // If any items are unavailable, stop the process
    if (unavailableItems.length > 0) {
      return {
        success: false,
        message: "Some prescription items are out of stock",
        unavailableItems,
      };
    }

    // Create order record with sanitized address
    const [orderResult] = await connection.execute(
      `INSERT INTO cus_oder (
          customer_id, 
          prescription_id,
          oder_status, 
          value, 
          delivery_method, 
          address, 
          telephone,
          inventory_reduced
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        prescriptionId,
        "Pending", // Initial status
        total,
        deliveryMethod,
        addressStr, // Always pass a string value, empty if not provided
        telephone,
        inventoryReduced ? 1 : 0,
      ]
    );

    const orderId = orderResult.insertId;

    // Add order items
    for (const item of prescriptionProducts) {
      await connection.execute(
        `INSERT INTO customer_product (
          customer_id, 
          product_id, 
          cus_oder_id, 
          quantity, 
          price
        ) VALUES (?, ?, ?, ?, ?)`,
        [customerId, item.product_id, orderId, item.quantity, item.price]
      );

      // Reduce inventory if required, using batch-wise reduction
      if (inventoryReduced) {
        await this.reduceInventoryBatchWise(
          connection,
          item.product_id,
          item.quantity
        );
      }
    }

    // Update prescription status to Confirmed if paying by card, otherwise keep as Available
    const newStatus = inventoryReduced ? "Confirmed" : "Available";
  await connection.execute(
  `UPDATE prescription 
   SET status = ?, inventory_reduced = ?
   WHERE prescription_id = ?`,
  [newStatus, inventoryReduced ? 1 : 0, prescriptionId]
);

    return {
      success: true,
      orderId,
    };
  }

  /**
   * Create a new order from a single product
   */
  static async createOrderFromProduct(connection, data) {
    const {
      customerId,
      productId,
      quantity,
      price,
      deliveryMethod,
      address,
      telephone,
      total,
      inventoryReduced = false,
    } = data;

    // Ensure address is always a string, never null
    const addressStr = address || "";

    console.log("Creating product order with address:", addressStr);
    console.log("Creating product order with telephone:", telephone);

    // Check inventory availability first
    const [products] = await connection.execute(
      `SELECT product_id, pname, price, quantity as available_quantity
       FROM product
       WHERE product_id = ?`,
      [productId]
    );

    if (products.length === 0) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    const product = products[0];

    // Check if there's enough inventory
    if (quantity > product.available_quantity) {
      return {
        success: false,
        message: "Product is out of stock",
        unavailableItems: [
          {
            name: product.pname,
            requested: quantity,
            available: product.available_quantity,
          },
        ],
      };
    }

    // Create order record with sanitized address
    const [orderResult] = await connection.execute(
      `INSERT INTO cus_oder (
          customer_id, 
          oder_status, 
          value, 
          delivery_method, 
          address, 
          telephone,
          inventory_reduced
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        inventoryReduced ? "Confirmed" : "Pending",
        total,
        deliveryMethod,
        addressStr, // Always pass a string value, empty if not provided
        telephone,
        inventoryReduced ? 1 : 0,
      ]
    );

    const orderId = orderResult.insertId;

    // Add the product to order items
    await connection.execute(
      `INSERT INTO customer_product (
        customer_id, 
        product_id, 
        cus_oder_id, 
        quantity, 
        price
      ) VALUES (?, ?, ?, ?, ?)`,
      [customerId, productId, orderId, quantity, price]
    );

    // Reduce inventory if required, using batch-wise reduction
    if (inventoryReduced) {
      await this.reduceInventoryBatchWise(connection, productId, quantity);
    }

    return {
      success: true,
      orderId,
    };
  }

  /**
   * Reduce inventory batch-wise, starting with batches closest to expiry
   */
  static async reduceInventoryBatchWise(connection, productId, quantity) {
    // Get supplier product batches for this product, ordered by expiry date (earliest first)
    const [supplierBatches] = await connection.execute(
      `SELECT sup_id, product_id, oder_id, quantity, expired_date, Products_remaining 
       FROM supplier_product 
       WHERE product_id = ? AND Products_remaining > 0 
       ORDER BY expired_date ASC`,
      [productId]
    );

    let remainingToReduce = quantity;

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
      [quantity, productId]
    );
  }

  /**
   * Create payment record
   */
  static async createPayment(connection, data) {
    const {
      orderId,
      customerId,
      paymentMethod,
      amount,
      status = "pending",
    } = data;

    // Insert payment record
    const [paymentResult] = await connection.execute(
      `INSERT INTO payments (
        cus_oder_id,
        customer_id,
        payment_method,
        amount
      ) VALUES (?, ?, ?, ?)`,
      [orderId, customerId, paymentMethod, amount]
    );

    return paymentResult.insertId;
  }

  /**
   * Get cart total for a customer
   */
  static async getCartTotal(customerId) {
    const [results] = await db.execute(
      `SELECT SUM(p.price * c.quantity) as total
       FROM cart c
       JOIN product p ON c.product_id = p.product_id
       WHERE c.customer_id = ?`,
      [customerId]
    );

    return results[0]?.total || 0;
  }

  /**
   * Get prescription total
   */
  static async getPrescriptionTotal(prescriptionId) {
    const [results] = await db.execute(
      `SELECT SUM(p.price * pp.quantity) as total
       FROM prescription_product pp
       JOIN product p ON pp.product_id = p.product_id
       WHERE pp.prescription_id = ?`,
      [prescriptionId]
    );

    return results[0]?.total || 0;
  }

  /**
   * Get product details
   */
  static async getProductDetails(productId) {
    const [results] = await db.execute(
      `SELECT product_id, pname, price, quantity, type, image
       FROM product
       WHERE product_id = ?`,
      [productId]
    );

    return results[0] || null;
  }

  /**
   * Create notification for customer
   */
  static async createNotification(connection, data) {
    const { userId, userType, title, message, link = null } = data;

    await connection.execute(
      `INSERT INTO notifications (
        user_id,
        user_type,
        title,
        message,
        is_read,
        link
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        userType,
        title,
        message,
        0, // Not read
        link,
      ]
    );
  }
}

module.exports = CheckoutModel;
