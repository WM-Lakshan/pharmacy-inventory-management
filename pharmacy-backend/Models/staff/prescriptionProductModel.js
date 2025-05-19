// // // models/staff/prescriptionProduct.model.js
// // const { db } = require("../../db");

// // class PrescriptionProductModel {
// //   /**
// //    * Get products associated with a prescription
// //    * @param {number} prescriptionId - Prescription ID
// //    * @returns {Promise<Array>} Array of products
// //    */
// //   // static async getProductsByPrescriptionId(prescriptionId) {
// //   //   try {
// //   //     // Join customer_product with product to get product details
// //   //     // We're using cus_oder to get the order associated with a prescription
// //   //     const [products] = await db.execute(
// //   //       `
// //   //       SELECT
// //   //         cp.product_id AS id,
// //   //         p.pname AS name,
// //   //         cp.quantity,
// //   //         cp.price,
// //   //         (cp.quantity * cp.price) AS value,
// //   //         p.quantity AS stock_quantity,
// //   //         p.type AS requires_prescription
// //   //       FROM prescription pr
// //   //       JOIN cus_oder co ON co.prescription_id = pr.prescription_id
// //   //       JOIN customer_product cp ON cp.cus_oder_id = co.cus_oder_id
// //   //       JOIN product p ON p.product_id = cp.product_id
// //   //       WHERE pr.prescription_id = ?
// //   //     `,
// //   //       [prescriptionId]
// //   //     );

// //   //     return products;
// //   //   } catch (error) {
// //   //     console.error("Error in getProductsByPrescriptionId:", error);
// //   //     throw error;
// //   //   }
// //   // }

// //   static async getProductsByPrescriptionId(prescriptionId) {
// //     try {
// //       // First, get the order ID associated with this prescription
// //       const [orders] = await db.execute(
// //         `
// //       SELECT cus_oder_id
// //       FROM cus_oder
// //       WHERE prescription_id = ?
// //     `,
// //         [prescriptionId]
// //       );

// //       // If no order exists yet, return empty array
// //       if (orders.length === 0) {
// //         return [];
// //       }

// //       const orderId = orders[0].cus_oder_id;

// //       // Get products associated with this order
// //       const [products] = await db.execute(
// //         `
// //       SELECT
// //         cp.product_id AS id,
// //         p.pname AS name,
// //         cp.quantity,
// //         cp.price,
// //         (cp.quantity * cp.price) AS value,
// //         p.quantity AS stock_quantity,
// //         p.type AS requires_prescription
// //       FROM customer_product cp
// //       JOIN product p ON p.product_id = cp.product_id
// //       WHERE cp.cus_oder_id = ?

// //     `,
// //         [orderId]
// //       );

// //       return products;
// //     } catch (error) {
// //       console.error("Error in getProductsByPrescriptionId:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Get prescription details
// //    * @param {number} prescriptionId - Prescription ID
// //    * @returns {Promise<Object>} Prescription details
// //    */
// //   static async getPrescriptionDetails(prescriptionId) {
// //     try {
// //       const [prescriptions] = await db.execute(
// //         `
// //         SELECT
// //           p.prescription_id,
// //           p.customer_id,
// //           p.status,
// //           p.delivery_method,
// //           p.uploaded_at,
// //           p.file_path,
// //           p.expiry_date,
// //           c.name AS customer_name,
// //           c.email AS customer_email
// //         FROM prescription p
// //         LEFT JOIN customer c ON c.customer_id = p.customer_id
// //         WHERE p.prescription_id = ?
// //       `,
// //         [prescriptionId]
// //       );

// //       if (prescriptions.length === 0) {
// //         return null;
// //       }

// //       return prescriptions[0];
// //     } catch (error) {
// //       console.error("Error in getPrescriptionDetails:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Search products by name
// //    * @param {string} query - Search query
// //    * @param {number} limit - Max number of results to return
// //    * @returns {Promise<Array>} Array of matching products
// //    */
// //   //   static async searchProducts(query, limit = 10) {
// //   //     try {
// //   //       const [products] = await db.execute(
// //   //         `
// //   //         SELECT
// //   //           product_id AS id,
// //   //           pname AS name,
// //   //           quantity AS quantity_available,
// //   //           price,
// //   //           type AS requires_prescription
// //   //         FROM product
// //   //         WHERE pname LIKE ?
// //   //         LIMIT ?
// //   //       `,
// //   //         [`%${query}%`, limit]
// //   //       );

// //   //       return products;
// //   //     } catch (error) {
// //   //       console.error("Error in searchProducts:", error);
// //   //       throw error;
// //   //     }
// //   //   }

// //   static async searchProducts(query) {
// //     try {
// //       const [products] = await db.execute(
// //         `
// //       SELECT
// //         product_id AS id,
// //         pname AS name,
// //         quantity AS quantity_available,
// //         price,
// //         type AS requires_prescription
// //       FROM product
// //       WHERE pname LIKE ?
// //     `,
// //         [`%${query}%`]
// //       );

// //       // Transform the data to match frontend expectations
// //       return products.map((product) => ({
// //         id: product.id,
// //         name: product.name,
// //         quantity_available: product.quantity_available,
// //         price: product.price,
// //         // Convert the enum to a boolean for frontend simplicity
// //         requires_prescription:
// //           product.requires_prescription === "prescription needed",
// //       }));
// //     } catch (error) {
// //       console.error("Error in searchProducts:", error);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Add product to a prescription
// //    * @param {number} prescriptionId - Prescription ID
// //    * @param {number} productId - Product ID
// //    * @param {number} quantity - Quantity to add
// //    * @param {number} price - Price at purchase
// //    * @returns {Promise<Object>} Result object
// //    */
// //   static async addProductToPrescription(
// //     prescriptionId,
// //     productId,
// //     quantity,
// //     price
// //   ) {
// //     const connection = await db.getConnection();
// //     try {
// //       await connection.beginTransaction();

// //       // Check if there's already an order for this prescription
// //       const [existingOrders] = await connection.execute(
// //         `
// //         SELECT cus_oder_id
// //         FROM cus_oder
// //         WHERE prescription_id = ?
// //       `,
// //         [prescriptionId]
// //       );

// //       let orderId;

// //       if (existingOrders.length === 0) {
// //         // Create a new order
// //         const [orderResult] = await connection.execute(
// //           `
// //           INSERT INTO cus_oder (prescription_id, customer_id, oder_status, value)
// //           SELECT
// //             prescription_id,
// //             customer_id,
// //             'Pending',
// //             0
// //           FROM prescription
// //           WHERE prescription_id = ?
// //         `,
// //           [prescriptionId]
// //         );

// //         orderId = orderResult.insertId;
// //       } else {
// //         // Use existing order
// //         orderId = existingOrders[0].cus_oder_id;
// //       }

// //       // Check if product already exists in the order
// //       const [existingProducts] = await connection.execute(
// //         `
// //         SELECT customer_id, product_id, quantity
// //         FROM customer_product
// //         WHERE cus_oder_id = ? AND product_id = ?
// //       `,
// //         [orderId, productId]
// //       );

// //       // Get customer ID
// //       const [prescriptionData] = await connection.execute(
// //         `
// //         SELECT customer_id FROM prescription WHERE prescription_id = ?
// //       `,
// //         [prescriptionId]
// //       );

// //       const customerId = prescriptionData[0].customer_id;

// //       if (existingProducts.length > 0) {
// //         // Update existing product quantity
// //         await connection.execute(
// //           `
// //           UPDATE customer_product
// //           SET quantity = quantity + ?
// //           WHERE cus_oder_id = ? AND product_id = ?
// //         `,
// //           [quantity, orderId, productId]
// //         );
// //       } else {
// //         // Add new product
// //         await connection.execute(
// //           `
// //           INSERT INTO customer_product (customer_id, product_id, cus_oder_id, quantity, price)
// //           VALUES (?, ?, ?, ?, ?)
// //         `,
// //           [customerId, productId, orderId, quantity, price]
// //         );
// //       }

// //       // Update order total value
// //       await connection.execute(
// //         `
// //         UPDATE cus_oder
// //         SET value = (
// //           SELECT SUM(quantity * price)
// //           FROM customer_product
// //           WHERE cus_oder_id = ?
// //         )
// //         WHERE cus_oder_id = ?
// //       `,
// //         [orderId, orderId]
// //       );

// //       await connection.commit();

// //       return {
// //         success: true,
// //         message: "Product added to prescription",
// //         orderId,
// //       };
// //     } catch (error) {
// //       await connection.rollback();
// //       console.error("Error in addProductToPrescription:", error);
// //       throw error;
// //     } finally {
// //       connection.release();
// //     }
// //   }

// //   /**
// //    * Update product quantity
// //    * @param {number} orderId - Order ID
// //    * @param {number} productId - Product ID
// //    * @param {number} customerId - Customer ID
// //    * @param {number} newQuantity - New quantity
// //    * @returns {Promise<Object>} Result object
// //    */
// //   static async updateProductQuantity(
// //     orderId,
// //     productId,
// //     customerId,
// //     newQuantity
// //   ) {
// //     const connection = await db.getConnection();
// //     try {
// //       await connection.beginTransaction();

// //       // Update product quantity
// //       await connection.execute(
// //         `
// //         UPDATE customer_product
// //         SET quantity = ?
// //         WHERE cus_oder_id = ? AND product_id = ? AND customer_id = ?
// //       `,
// //         [newQuantity, orderId, productId, customerId]
// //       );

// //       // Update order total value
// //       await connection.execute(
// //         `
// //         UPDATE cus_oder
// //         SET value = (
// //           SELECT SUM(quantity * price)
// //           FROM customer_product
// //           WHERE cus_oder_id = ?
// //         )
// //         WHERE cus_oder_id = ?
// //       `,
// //         [orderId, orderId]
// //       );

// //       await connection.commit();

// //       return {
// //         success: true,
// //         message: "Product quantity updated",
// //       };
// //     } catch (error) {
// //       await connection.rollback();
// //       console.error("Error in updateProductQuantity:", error);
// //       throw error;
// //     } finally {
// //       connection.release();
// //     }
// //   }

// //   /**
// //    * Remove product from prescription
// //    * @param {number} orderId - Order ID
// //    * @param {number} productId - Product ID
// //    * @param {number} customerId - Customer ID
// //    * @returns {Promise<Object>} Result object
// //    */
// //   static async removeProductFromPrescription(orderId, productId, customerId) {
// //     const connection = await db.getConnection();
// //     try {
// //       await connection.beginTransaction();

// //       // Remove product
// //       await connection.execute(
// //         `
// //         DELETE FROM customer_product
// //         WHERE cus_oder_id = ? AND product_id = ? AND customer_id = ?
// //       `,
// //         [orderId, productId, customerId]
// //       );

// //       // Update order total value
// //       await connection.execute(
// //         `
// //         UPDATE cus_oder
// //         SET value = (
// //           SELECT COALESCE(SUM(quantity * price), 0)
// //           FROM customer_product
// //           WHERE cus_oder_id = ?
// //         )
// //         WHERE cus_oder_id = ?
// //       `,
// //         [orderId, orderId]
// //       );

// //       await connection.commit();

// //       return {
// //         success: true,
// //         message: "Product removed from prescription",
// //       };
// //     } catch (error) {
// //       await connection.rollback();
// //       console.error("Error in removeProductFromPrescription:", error);
// //       throw error;
// //     } finally {
// //       connection.release();
// //     }
// //   }

// //   /**
// //    * Update prescription status
// //    * @param {number} prescriptionId - Prescription ID
// //    * @param {string} newStatus - New status
// //    * @returns {Promise<Object>} Result object
// //    */
// //   //   static async updatePrescriptionStatus(prescriptionId, newStatus) {
// //   //     try {
// //   //       await db.execute(
// //   //         `
// //   //         UPDATE prescription
// //   //         SET status = ?
// //   //         WHERE prescription_id = ?
// //   //       `,
// //   //         [newStatus, prescriptionId]
// //   //       );

// //   //       // Create notification for customer
// //   //       await db.execute(
// //   //         `
// //   //         INSERT INTO notifications (
// //   //           user_id, user_type, title, message, is_read
// //   //         )
// //   //         SELECT
// //   //           p.customer_id,
// //   //           'customer',
// //   //           CONCAT('Prescription Status Updated to ', ?),
// //   //           CONCAT('Your prescription #', p.prescription_id, ' status has been updated to ', ?),
// //   //           FALSE
// //   //         FROM prescription p
// //   //         WHERE p.prescription_id = ?
// //   //       `,
// //   //         [newStatus, newStatus, prescriptionId]
// //   //       );

// //   //       return {
// //   //         success: true,
// //   //         message: `Prescription status updated to ${newStatus}`,
// //   //       };
// //   //     } catch (error) {
// //   //       console.error("Error in updatePrescriptionStatus:", error);
// //   //       throw error;
// //   //     }
// //   //   }

// //   ////////////////////correct /////////////////////////

// //   static async updatePrescriptionStatus(
// //     prescriptionId,
// //     newStatus,
// //     reduceInventory = false
// //   ) {
// //     const connection = await db.getConnection();
// //     try {
// //       await connection.beginTransaction();

// //       // Update prescription status
// //       await connection.execute(
// //         `
// //       UPDATE prescription
// //       SET status = ?
// //       WHERE prescription_id = ?
// //     `,
// //         [newStatus, prescriptionId]
// //       );

// //       let inventoryReduced = false;

// //       // If status is "Out for delivery" or "Ready for pickup" and reduceInventory is true,
// //       // reduce product quantities from inventory
// //       if (
// //         reduceInventory &&
// //         (newStatus === "Out for delivery" || newStatus === "Ready for pickup")
// //       ) {
// //         // Get the order associated with this prescription
// //         const [orders] = await connection.execute(
// //           `
// //         SELECT cus_oder_id
// //         FROM cus_oder
// //         WHERE prescription_id = ?
// //       `,
// //           [prescriptionId]
// //         );

// //         if (orders.length > 0) {
// //           const orderId = orders[0].cus_oder_id;

// //           // Get products from the order
// //           const [products] = await connection.execute(
// //             `
// //           SELECT product_id, quantity
// //           FROM customer_product
// //           WHERE cus_oder_id = ?
// //         `,
// //             [orderId]
// //           );

// //           // For each product, reduce inventory
// //           for (const product of products) {
// //             // Update product quantity
// //             await connection.execute(
// //               `
// //             UPDATE product
// //             SET quantity = GREATEST(0, quantity - ?)
// //             WHERE product_id = ?
// //           `,
// //               [product.quantity, product.product_id]
// //             );
// //           }

// //           inventoryReduced = true;
// //         }
// //       }

// //       // Create notification for customer
// //       await connection.execute(
// //         `
// //       INSERT INTO notifications (
// //         user_id, user_type, title, message, is_read
// //       )
// //       SELECT
// //         p.customer_id,
// //         'customer',
// //         CONCAT('Prescription Status Updated to ', ?),
// //         CONCAT('Your prescription #', p.prescription_id, ' status has been updated to ', ?),
// //         FALSE
// //       FROM prescription p
// //       WHERE p.prescription_id = ?
// //     `,
// //         [newStatus, newStatus, prescriptionId]
// //       );

// //       await connection.commit();

// //       return {
// //         success: true,
// //         message: `Prescription status updated to ${newStatus}`,
// //         inventoryReduced,
// //       };
// //     } catch (error) {
// //       await connection.rollback();
// //       console.error("Error in updatePrescriptionStatus:", error);
// //       throw error;
// //     } finally {
// //       connection.release();
// //     }
// //   }
// // }

// // module.exports = PrescriptionProductModel;

// ////////////////////////////////////////correct ////////////////////////

// // models/staff/prescriptionProduct.model.js
// const { db } = require("../../db");

// class PrescriptionProductModel {
//   /**
//    * Get products associated with a prescription
//    * @param {number} prescriptionId - Prescription ID
//    * @returns {Promise<Array>} Array of products
//    */
//   // static async getProductsByPrescriptionId(prescriptionId) {
//   //   try {
//   //     // Join customer_product with product to get product details
//   //     // We're using cus_oder to get the order associated with a prescription
//   //     const [products] = await db.execute(
//   //       `
//   //       SELECT
//   //         cp.product_id AS id,
//   //         p.pname AS name,
//   //         cp.quantity,
//   //         cp.price,
//   //         (cp.quantity * cp.price) AS value,
//   //         p.quantity AS stock_quantity,
//   //         p.type AS requires_prescription
//   //       FROM prescription pr
//   //       JOIN cus_oder co ON co.prescription_id = pr.prescription_id
//   //       JOIN customer_product cp ON cp.cus_oder_id = co.cus_oder_id
//   //       JOIN product p ON p.product_id = cp.product_id
//   //       WHERE pr.prescription_id = ?
//   //     `,
//   //       [prescriptionId]
//   //     );

//   //     return products;
//   //   } catch (error) {
//   //     console.error("Error in getProductsByPrescriptionId:", error);
//   //     throw error;
//   //   }
//   // }

//   static async getProductsByPrescriptionId(prescriptionId) {
//     try {
//       const [products] = await db.execute(
//         `SELECT 
//         p.product_id AS id,
//         pr.pname AS name,
//         p.quantity,
//         pr.price,
//         (p.quantity * pr.price) AS value,
//         pr.quantity AS stock_quantity,
//         pr.type AS requires_prescription
//        FROM prescription_product p
//        JOIN product pr ON pr.product_id = p.product_id
//        WHERE p.prescription_id = ?`,
//         [prescriptionId]
//       );

//       return products;
//     } catch (error) {
//       console.error("Error in getProductsByPrescriptionId:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get prescription details
//    * @param {number} prescriptionId - Prescription ID
//    * @returns {Promise<Object>} Prescription details
//    */
//   static async getPrescriptionDetails(prescriptionId) {
//     try {
//       const [prescriptions] = await db.execute(
//         `
//         SELECT 
//           p.prescription_id,
//           p.customer_id,
//           p.status,
//           p.delivery_method,
//           p.uploaded_at,
//           p.file_path,
//           p.expiry_date,
//           c.name AS customer_name,
//           c.email AS customer_email
//         FROM prescription p
//         LEFT JOIN customer c ON c.customer_id = p.customer_id
//         WHERE p.prescription_id = ?
//       `,
//         [prescriptionId]
//       );

//       if (prescriptions.length === 0) {
//         return null;
//       }

//       return prescriptions[0];
//     } catch (error) {
//       console.error("Error in getPrescriptionDetails:", error);
//       throw error;
//     }
//   }

//   /**
//    * Search products by name
//    * @param {string} query - Search query
//    * @param {number} limit - Max number of results to return
//    * @returns {Promise<Array>} Array of matching products
//    */
//   //   static async searchProducts(query, limit = 10) {
//   //     try {
//   //       const [products] = await db.execute(
//   //         `
//   //         SELECT
//   //           product_id AS id,
//   //           pname AS name,
//   //           quantity AS quantity_available,
//   //           price,
//   //           type AS requires_prescription
//   //         FROM product
//   //         WHERE pname LIKE ?
//   //         LIMIT ?
//   //       `,
//   //         [`%${query}%`, limit]
//   //       );

//   //       return products;
//   //     } catch (error) {
//   //       console.error("Error in searchProducts:", error);
//   //       throw error;
//   //     }
//   //   }

//   static async searchProducts(query) {
//     try {
//       const [products] = await db.execute(
//         `
//       SELECT 
//         product_id AS id,
//         pname AS name,
//         quantity AS quantity_available,
//         price,
//         type AS requires_prescription
//       FROM product
//       WHERE pname LIKE ?
//     `,
//         [`%${query}%`]
//       );

//       // Transform the data to match frontend expectations
//       return products.map((product) => ({
//         id: product.id,
//         name: product.name,
//         quantity_available: product.quantity_available,
//         price: product.price,
//         // Convert the enum to a boolean for frontend simplicity
//         requires_prescription:
//           product.requires_prescription === "prescription needed",
//       }));
//     } catch (error) {
//       console.error("Error in searchProducts:", error);
//       throw error;
//     }
//   }

//   /**
//    * Add product to a prescription
//    * @param {number} prescriptionId - Prescription ID
//    * @param {number} productId - Product ID
//    * @param {number} quantity - Quantity to add
//    * @param {number} price - Price at purchase
//    * @returns {Promise<Object>} Result object
//    */
//   static async addProductToPrescription(
//     prescriptionId,
//     productId,
//     quantity,
//     price
//   ) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Check if product already exists in prescription
//       const [existingProducts] = await connection.execute(
//         `SELECT * FROM prescription_product 
//        WHERE prescription_id = ? AND product_id = ?`,
//         [prescriptionId, productId]
//       );

//       if (existingProducts.length > 0) {
//         // Update existing product quantity
//         await connection.execute(
//           `UPDATE prescription_product 
//          SET quantity = quantity + ? 
//          WHERE prescription_id = ? AND product_id = ?`,
//           [quantity, prescriptionId, productId]
//         );
//       } else {
//         // Add new product to prescription
//         await connection.execute(
//           `INSERT INTO prescription_product 
//          (prescription_id, product_id, quantity) 
//          VALUES (?, ?, ?)`,
//           [prescriptionId, productId, quantity]
//         );
//       }

//       // Update prescription total value
//       await connection.execute(
//         `UPDATE prescription 
//        SET value = (
//          SELECT SUM(p.quantity * pr.price) 
//          FROM prescription_product p
//          JOIN product pr ON pr.product_id = p.product_id
//          WHERE p.prescription_id = ?
//        )
//        WHERE prescription_id = ?`,
//         [prescriptionId, prescriptionId]
//       );

//       await connection.commit();

//       return {
//         success: true,
//         message: "Product added to prescription",
//         prescriptionId,
//       };
//     } catch (error) {
//       await connection.rollback();
//       console.error("Error in addProductToPrescription:", error);
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }
//   /**
//    * Update product quantity
//    * @param {number} orderId - Order ID
//    * @param {number} productId - Product ID
//    * @param {number} customerId - Customer ID
//    * @param {number} newQuantity - New quantity
//    * @returns {Promise<Object>} Result object
//    */
//   static async updateProductQuantity(prescriptionId, productId, newQuantity) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Update product quantity in prescription
//       await connection.execute(
//         `UPDATE prescription_product 
//        SET quantity = ? 
//        WHERE prescription_id = ? AND product_id = ?`,
//         [newQuantity, prescriptionId, productId]
//       );

//       // Update prescription total value
//       await connection.execute(
//         `UPDATE prescription 
//        SET value = (
//          SELECT SUM(p.quantity * pr.price) 
//          FROM prescription_product p
//          JOIN product pr ON pr.product_id = p.product_id
//          WHERE p.prescription_id = ?
//        )
//        WHERE prescription_id = ?`,
//         [prescriptionId, prescriptionId]
//       );

//       await connection.commit();

//       return {
//         success: true,
//         message: "Product quantity updated",
//       };
//     } catch (error) {
//       await connection.rollback();
//       console.error("Error in updateProductQuantity:", error);
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }

//   /**
//    * Remove product from prescription
//    * @param {number} prescriptionId - Prescription ID
//    * @param {number} productId - Product ID
//    * @param {number} customerId - Customer ID
//    * @returns {Promise<Object>} Result object
//    */
//   static async removeProductFromPrescription(prescriptionId, productId) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Remove product from prescription
//       await connection.execute(
//         `DELETE FROM prescription_product 
//        WHERE prescription_id = ? AND product_id = ?`,
//         [prescriptionId, productId]
//       );

//       // Update prescription total value
//       await connection.execute(
//         `UPDATE prescription 
//        SET value = (
//          SELECT COALESCE(SUM(p.quantity * pr.price), 0)
//          FROM prescription_product p
//          JOIN product pr ON pr.product_id = p.product_id
//          WHERE p.prescription_id = ?
//        )
//        WHERE prescription_id = ?`,
//         [prescriptionId, prescriptionId]
//       );

//       await connection.commit();

//       return {
//         success: true,
//         message: "Product removed from prescription",
//       };
//     } catch (error) {
//       await connection.rollback();
//       console.error("Error in removeProductFromPrescription:", error);
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }
//   /**
//    * Update prescription status
//    * @param {number} prescriptionId - Prescription ID
//    * @param {string} newStatus - New status
//    * @returns {Promise<Object>} Result object
//    */
//   //   static async updatePrescriptionStatus(prescriptionId, newStatus) {
//   //     try {
//   //       await db.execute(
//   //         `
//   //         UPDATE prescription
//   //         SET status = ?
//   //         WHERE prescription_id = ?
//   //       `,
//   //         [newStatus, prescriptionId]
//   //       );

//   //       // Create notification for customer
//   //       await db.execute(
//   //         `
//   //         INSERT INTO notifications (
//   //           user_id, user_type, title, message, is_read
//   //         )
//   //         SELECT
//   //           p.customer_id,
//   //           'customer',
//   //           CONCAT('Prescription Status Updated to ', ?),
//   //           CONCAT('Your prescription #', p.prescription_id, ' status has been updated to ', ?),
//   //           FALSE
//   //         FROM prescription p
//   //         WHERE p.prescription_id = ?
//   //       `,
//   //         [newStatus, newStatus, prescriptionId]
//   //       );

//   //       return {
//   //         success: true,
//   //         message: `Prescription status updated to ${newStatus}`,
//   //       };
//   //     } catch (error) {
//   //       console.error("Error in updatePrescriptionStatus:", error);
//   //       throw error;
//   //     }
//   //   }

//   ////////////////////correct /////////////////////////

//   static async updatePrescriptionStatus(
//     prescriptionId,
//     newStatus,
//     reduceInventory = false,
//     staffId = null
//   ) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Update prescription status
//       await connection.execute(
//         `
//       UPDATE prescription
//       SET status = ?,
//           pharmacy_staff_id = COALESCE(?, pharmacy_staff_id)
//       WHERE prescription_id = ?
//     `,
//         [newStatus, staffId, prescriptionId]
//       );

//       let inventoryReduced = false;

//       // If status is "Out for delivery" or "Ready for pickup" and reduceInventory is true,
//       // reduce product quantities from inventory
//       if (
//         reduceInventory &&
//         (newStatus === "Out for delivery" || newStatus === "Ready for pickup")
//       ) {
//         // Get the order associated with this prescription
//         const [orders] = await connection.execute(
//           `
//         SELECT cus_oder_id
//         FROM cus_oder
//         WHERE prescription_id = ?
//       `,
//           [prescriptionId]
//         );

//         if (orders.length > 0) {
//           const orderId = orders[0].cus_oder_id;

//           // Get products from the order
//           const [products] = await connection.execute(
//             `
//           SELECT product_id, quantity
//           FROM customer_product
//           WHERE cus_oder_id = ?
//         `,
//             [orderId]
//           );

//           // For each product, reduce inventory
//           for (const product of products) {
//             // Update product quantity
//             await connection.execute(
//               `
//             UPDATE product
//             SET quantity = GREATEST(0, quantity - ?)
//             WHERE product_id = ?
//           `,
//               [product.quantity, product.product_id]
//             );
//           }

//           inventoryReduced = true;
//         }
//       }
//       let staffName = "a staff member";
//       if (staffId) {
//         const [staff] = await connection.execute(
//           `SELECT CONCAT(F_name, ' ', L_name) as name 
//          FROM pharmacy_staff 
//          WHERE pharmacy_staff_id = ?`,
//           [staffId]
//         );
//         if (staff.length > 0) {
//           staffName = staff[0].name;
//         }
//       }

//       // Create notification for customer
//       await connection.execute(
//         `INSERT INTO notifications (
//         user_id, 
//         user_type, 
//         title, 
//         message, 
//         is_read,
//         created_at
//       )
//       SELECT 
//         p.customer_id, 
//         'customer', 
//         CONCAT('Prescription Status Updated to ', ?), 
//         CONCAT(
//           'Your prescription #', p.prescription_id, 
//           ' status has been updated to ', ?, 
//           ' by ', ?
//         ), 
//         FALSE,
//         NOW()
//       FROM prescription p
//       WHERE p.prescription_id = ?`,
//         [newStatus, newStatus, staffName, prescriptionId]
//       );
//       await connection.commit();

//       return {
//         success: true,
//         message: `Prescription status updated to ${newStatus}`,
//         inventoryReduced,
//       };
//     } catch (error) {
//       await connection.rollback();
//       console.error("Error in updatePrescriptionStatus:", error);
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }
// }

// module.exports = PrescriptionProductModel;


///////////////////////////////////////////////workin fine///////////////////////////



const { db } = require("../../db");

class PrescriptionProductModel {
  /**
   * Get products associated with a prescription
   * @param {number} prescriptionId - Prescription ID
   * @returns {Promise<Array>} Array of products
   */
  // static async getProductsByPrescriptionId(prescriptionId) {
  //   try {
  //     // Join customer_product with product to get product details
  //     // We're using cus_oder to get the order associated with a prescription
  //     const [products] = await db.execute(
  //       `
  //       SELECT
  //         cp.product_id AS id,
  //         p.pname AS name,
  //         cp.quantity,
  //         cp.price,
  //         (cp.quantity * cp.price) AS value,
  //         p.quantity AS stock_quantity,
  //         p.type AS requires_prescription
  //       FROM prescription pr
  //       JOIN cus_oder co ON co.prescription_id = pr.prescription_id
  //       JOIN customer_product cp ON cp.cus_oder_id = co.cus_oder_id
  //       JOIN product p ON p.product_id = cp.product_id
  //       WHERE pr.prescription_id = ?
  //     `,
  //       [prescriptionId]
  //     );

  //     return products;
  //   } catch (error) {
  //     console.error("Error in getProductsByPrescriptionId:", error);
  //     throw error;
  //   }
  // }

  static async getProductsByPrescriptionId(prescriptionId) {
    try {
      const [products] = await db.execute(
        `SELECT 
        p.product_id AS id,
        pr.pname AS name,
        p.quantity,
        pr.price,
        (p.quantity * pr.price) AS value,
        pr.quantity AS stock_quantity,
        pr.type AS requires_prescription
       FROM prescription_product p
       JOIN product pr ON pr.product_id = p.product_id
       WHERE p.prescription_id = ?`,
        [prescriptionId]
      );

      return products;
    } catch (error) {
      console.error("Error in getProductsByPrescriptionId:", error);
      throw error;
    }
  }

  /**
   * Get prescription details
   * @param {number} prescriptionId - Prescription ID
   * @returns {Promise<Object>} Prescription details
   */
  static async getPrescriptionDetails(prescriptionId) {
    try {
      const [prescriptions] = await db.execute(
        `
        SELECT 
          p.prescription_id,
          p.customer_id,
          p.status,
          p.delivery_method,
          p.uploaded_at,
          p.file_path,
          p.expiry_date,
          c.name AS customer_name,
          c.email AS customer_email
        FROM prescription p
        LEFT JOIN customer c ON c.customer_id = p.customer_id
        WHERE p.prescription_id = ?
      `,
        [prescriptionId]
      );

      if (prescriptions.length === 0) {
        return null;
      }

      return prescriptions[0];
    } catch (error) {
      console.error("Error in getPrescriptionDetails:", error);
      throw error;
    }
  }

  /**
   * Search products by name
   * @param {string} query - Search query
   * @param {number} limit - Max number of results to return
   * @returns {Promise<Array>} Array of matching products
   */
  //   static async searchProducts(query, limit = 10) {
  //     try {
  //       const [products] = await db.execute(
  //         `
  //         SELECT
  //           product_id AS id,
  //           pname AS name,
  //           quantity AS quantity_available,
  //           price,
  //           type AS requires_prescription
  //         FROM product
  //         WHERE pname LIKE ?
  //         LIMIT ?
  //       `,
  //         [`%${query}%`, limit]
  //       );

  //       return products;
  //     } catch (error) {
  //       console.error("Error in searchProducts:", error);
  //       throw error;
  //     }
  //   }

  static async searchProducts(query) {
    try {
      const [products] = await db.execute(
        `
      SELECT 
        product_id AS id,
        pname AS name,
        quantity AS quantity_available,
        price,
        type AS requires_prescription
      FROM product
      WHERE pname LIKE ?
    `,
        [`%${query}%`]
      );

      // Transform the data to match frontend expectations
      return products.map((product) => ({
        id: product.id,
        name: product.name,
        quantity_available: product.quantity_available,
        price: product.price,
        // Convert the enum to a boolean for frontend simplicity
        requires_prescription:
          product.requires_prescription === "prescription needed",
      }));
    } catch (error) {
      console.error("Error in searchProducts:", error);
      throw error;
    }
  }

  /**
   * Add product to a prescription
   * @param {number} prescriptionId - Prescription ID
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @param {number} price - Price at purchase
   * @returns {Promise<Object>} Result object
   */
  static async addProductToPrescription(
    prescriptionId,
    productId,
    quantity,
    price
  ) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if product already exists in prescription
      const [existingProducts] = await connection.execute(
        `SELECT * FROM prescription_product 
       WHERE prescription_id = ? AND product_id = ?`,
        [prescriptionId, productId]
      );

      if (existingProducts.length > 0) {
        // Update existing product quantity
        await connection.execute(
          `UPDATE prescription_product 
         SET quantity = quantity + ? 
         WHERE prescription_id = ? AND product_id = ?`,
          [quantity, prescriptionId, productId]
        );
      } else {
        // Add new product to prescription
        await connection.execute(
          `INSERT INTO prescription_product 
         (prescription_id, product_id, quantity) 
         VALUES (?, ?, ?)`,
          [prescriptionId, productId, quantity]
        );
      }

      // Update prescription total value
      await connection.execute(
        `UPDATE prescription 
       SET value = (
         SELECT SUM(p.quantity * pr.price) 
         FROM prescription_product p
         JOIN product pr ON pr.product_id = p.product_id
         WHERE p.prescription_id = ?
       )
       WHERE prescription_id = ?`,
        [prescriptionId, prescriptionId]
      );

      await connection.commit();

      return {
        success: true,
        message: "Product added to prescription",
        prescriptionId,
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error in addProductToPrescription:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
  /**
   * Update product quantity
   * @param {number} orderId - Order ID
   * @param {number} productId - Product ID
   * @param {number} customerId - Customer ID
   * @param {number} newQuantity - New quantity
   * @returns {Promise<Object>} Result object
   */
  static async updateProductQuantity(prescriptionId, productId, newQuantity) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Update product quantity in prescription
      await connection.execute(
        `UPDATE prescription_product 
       SET quantity = ? 
       WHERE prescription_id = ? AND product_id = ?`,
        [newQuantity, prescriptionId, productId]
      );

      // Update prescription total value
      await connection.execute(
        `UPDATE prescription 
       SET value = (
         SELECT SUM(p.quantity * pr.price) 
         FROM prescription_product p
         JOIN product pr ON pr.product_id = p.product_id
         WHERE p.prescription_id = ?
       )
       WHERE prescription_id = ?`,
        [prescriptionId, prescriptionId]
      );

      await connection.commit();

      return {
        success: true,
        message: "Product quantity updated",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error in updateProductQuantity:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Remove product from prescription
   * @param {number} prescriptionId - Prescription ID
   * @param {number} productId - Product ID
   * @param {number} customerId - Customer ID
   * @returns {Promise<Object>} Result object
   */
  static async removeProductFromPrescription(prescriptionId, productId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Remove product from prescription
      await connection.execute(
        `DELETE FROM prescription_product 
       WHERE prescription_id = ? AND product_id = ?`,
        [prescriptionId, productId]
      );

      // Update prescription total value
      await connection.execute(
        `UPDATE prescription 
       SET value = (
         SELECT COALESCE(SUM(p.quantity * pr.price), 0)
         FROM prescription_product p
         JOIN product pr ON pr.product_id = p.product_id
         WHERE p.prescription_id = ?
       )
       WHERE prescription_id = ?`,
        [prescriptionId, prescriptionId]
      );

      await connection.commit();

      return {
        success: true,
        message: "Product removed from prescription",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error in removeProductFromPrescription:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
  /**
   * Update prescription status
   * @param {number} prescriptionId - Prescription ID
   * @param {string} newStatus - New status
   * @returns {Promise<Object>} Result object
   */
  //   static async updatePrescriptionStatus(prescriptionId, newStatus) {
  //     try {
  //       await db.execute(
  //         `
  //         UPDATE prescription
  //         SET status = ?
  //         WHERE prescription_id = ?
  //       `,
  //         [newStatus, prescriptionId]
  //       );

  //       // Create notification for customer
  //       await db.execute(
  //         `
  //         INSERT INTO notifications (
  //           user_id, user_type, title, message, is_read
  //         )
  //         SELECT
  //           p.customer_id,
  //           'customer',
  //           CONCAT('Prescription Status Updated to ', ?),
  //           CONCAT('Your prescription #', p.prescription_id, ' status has been updated to ', ?),
  //           FALSE
  //         FROM prescription p
  //         WHERE p.prescription_id = ?
  //       `,
  //         [newStatus, newStatus, prescriptionId]
  //       );

  //       return {
  //         success: true,
  //         message: `Prescription status updated to ${newStatus}`,
  //       };
  //     } catch (error) {
  //       console.error("Error in updatePrescriptionStatus:", error);
  //       throw error;
  //     }
  //   }

  ////////////////////correct /////////////////////////

  static async updatePrescriptionStatus(
    prescriptionId,
    newStatus,
    reduceInventory = false,
    staffId = null
  ) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Update prescription status
      await connection.execute(
        `
      UPDATE prescription
      SET status = ?,
          pharmacy_staff_id = COALESCE(?, pharmacy_staff_id)
      WHERE prescription_id = ?
    `,
        [newStatus, staffId, prescriptionId]
      );

      let inventoryReduced = false;

      // If status is "Out for delivery" or "Ready for pickup" and reduceInventory is true,
      // reduce product quantities from inventory
      if (
        reduceInventory &&
        (newStatus === "Out for delivery" || newStatus === "Ready for pickup")
      ) {
        // Get the order associated with this prescription
        const [orders] = await connection.execute(
          `
        SELECT cus_oder_id
        FROM cus_oder
        WHERE prescription_id = ?
      `,
          [prescriptionId]
        );

        if (orders.length > 0) {
          const orderId = orders[0].cus_oder_id;

          // Get products from the order
          const [products] = await connection.execute(
            `
          SELECT product_id, quantity
          FROM customer_product
          WHERE cus_oder_id = ?
        `,
            [orderId]
          );

          // For each product, reduce inventory
          for (const product of products) {
            // Update product quantity
            await connection.execute(
              `
            UPDATE product
            SET quantity = GREATEST(0, quantity - ?)
            WHERE product_id = ?
          `,
              [product.quantity, product.product_id]
            );
          }

          inventoryReduced = true;
        }
      }
      let staffName = "a staff member";
      if (staffId) {
        const [staff] = await connection.execute(
          `SELECT CONCAT(F_name, ' ', L_name) as name 
         FROM pharmacy_staff 
         WHERE pharmacy_staff_id = ?`,
          [staffId]
        );
        if (staff.length > 0) {
          staffName = staff[0].name;
        }
      }

      // Create notification for customer
      await connection.execute(
        `INSERT INTO notifications (
        user_id, 
        user_type, 
        title, 
        message, 
        is_read,
        created_at
      )
      SELECT 
        p.customer_id, 
        'customer', 
        CONCAT('Prescription Status Updated to ', ?), 
        CONCAT(
          'Your prescription #', p.prescription_id, 
          ' status has been updated to ', ?, 
          ' by ', ?
        ), 
        FALSE,
        NOW()
      FROM prescription p
      WHERE p.prescription_id = ?`,
        [newStatus, newStatus, staffName, prescriptionId]
      );
      await connection.commit();

      return {
        success: true,
        message: `Prescription status updated to ${newStatus}`,
        inventoryReduced,
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error in updatePrescriptionStatus:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = PrescriptionProductModel;
