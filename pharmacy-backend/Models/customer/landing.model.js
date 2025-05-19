// models/landing.model.js
const { db } = require("../../db");

class LandingModel {
  // Get featured products - limit to 8 with random selection for simplicity
  static async getFeaturedProducts() {
    try {
      const [products] = await db.execute(`
        SELECT p.product_id, p.pname, p.price, p.image, p.quantity, p.type AS product_type, 
               pc.name AS category_name
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE p.quantity > 0
        ORDER BY RAND()
        LIMIT 8
      `);

      return products;
    } catch (error) {
      console.error("Error in getFeaturedProducts:", error);
      throw error;
    }
  }

  // Get top selling products - in a real system this would use sales data
  // For now we'll just get different random products
  static async getTopSellingProducts() {
    try {
      const [products] = await db.execute(`
        SELECT p.product_id, p.pname, p.price, p.image, p.quantity, p.type AS product_type, 
               pc.name AS category_name
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE p.quantity > 0
        ORDER BY RAND()
        LIMIT 8
      `);

      return products;
    } catch (error) {
      console.error("Error in getTopSellingProducts:", error);
      throw error;
    }
  }

  // Get categories with product counts
  static async getCategories() {
    try {
      const [categories] = await db.execute(`
        SELECT pc.product_cato_id, pc.name, pc.description, 
               COUNT(p.product_id) AS product_count
        FROM product_cato pc
        LEFT JOIN product p ON pc.product_cato_id = p.product_cato_id
        GROUP BY pc.product_cato_id
        ORDER BY pc.name
      `);

      return categories;
    } catch (error) {
      console.error("Error in getCategories:", error);
      throw error;
    }
  }

  // Search products
  static async searchProducts(query, category = null, limit = 12) {
    try {
      let sql = `
        SELECT p.product_id, p.pname, p.price, p.image, p.quantity, p.type AS product_type, 
               pc.name AS category_name
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 1=1
      `;

      const params = [];

      // Add search query if provided
      if (query && query.trim() !== "") {
        sql += ` AND p.pname LIKE ?`;
        params.push(`%${query}%`);
      }

      // Add category filter if provided
      if (category && category !== "all") {
        sql += ` AND pc.name = ?`;
        params.push(category);
      }

      // Add limit
      sql += ` LIMIT ?`;
      params.push(limit);

      const [products] = await db.execute(sql, params);
      return products;
    } catch (error) {
      console.error("Error in searchProducts:", error);
      throw error;
    }
  }

  // static async uploadPrescription(customerId, data) {
  //   try {
  //     const { deliveryMethod, note, filePath, expiryDate } = data;

  //     // Default expiry date to 48 hours from now if not provided
  //     const expiry =
  //       expiryDate ||
  //       (() => {
  //         const date = new Date();
  //         date.setHours(date.getHours() + 48);
  //         return date;
  //       })();

  //     // Insert prescription record with expiry date
  //     const [result] = await db.execute(
  //       `
  //       INSERT INTO prescription (
  //         customer_id,
  //         pharmacy_staff_id,
  //         status,
  //         delivery_method,
  //         note,
  //         file_path,
  //         expiry_date
  //       )
  //       VALUES (?, NULL, 'Pending', ?, ?, ?, ?)
  //     `,
  //       [customerId, deliveryMethod, note || null, filePath, expiry]
  //     );

  //     return {
  //       id: result.insertId,
  //       success: true,
  //       expiryDate: expiry,
  //     };
  //   } catch (error) {
  //     console.error("Error in uploadPrescription:", error);
  //     throw error;
  //   }
  // }

  ////////////////correct one ///////////////////////////

  static async uploadPrescription(customerId, data) {
    try {
      const { deliveryMethod, note, filePath, expiryDate, telephone, address } =
        data;

      // Default expiry date to 48 hours from now if not provided
      const expiry =
        expiryDate ||
        (() => {
          const date = new Date();
          date.setHours(date.getHours() + 48);
          return date;
        })();

      // Insert prescription record with expiry date
      const [result] = await db.execute(
        `
      INSERT INTO prescription (
        customer_id, 
        pharmacy_staff_id, 
        status, 
        delivery_method, 
        note, 
        file_path,
        expiry_date,
        telephone,
        address
      )
      VALUES (?, NULL, 'Pending', ?, ?, ?, ?, ?, ?)
    `,
        [
          customerId,
          deliveryMethod,
          note || null,
          filePath,
          expiry,
          telephone,
          address,
        ]
      );

      return {
        id: result.insertId,
        success: true,
        expiryDate: expiry,
      };
    } catch (error) {
      console.error("Error in uploadPrescription:", error);
      throw error;
    }
  }

  // Add a new method to handle prescription expiration checks
  static async checkExpiredPrescriptions() {
    try {
      // Find all expired but not yet marked as expired prescriptions
      const [expiredPrescriptions] = await db.execute(`
        SELECT prescription_id, customer_id
        FROM prescription
        WHERE expiry_date <= NOW()
        AND status = 'Pending'
      `);

      if (expiredPrescriptions.length === 0) {
        return { count: 0 };
      }

      // Update their status
      await db.execute(`
        UPDATE prescription
        SET status = 'Expired'
        WHERE expiry_date <= NOW()
        AND status = 'Pending'
      `);

      // Create notifications for customers
      for (const prescription of expiredPrescriptions) {
        try {
          await db.execute(
            `
            INSERT INTO notifications (
              user_id, 
              user_type, 
              title, 
              message, 
              is_read
            )
            VALUES (
              ?, 
              'customer', 
              'Prescription Expired', 
              'Your prescription has expired. Please upload a new one if you still need your medications.', 
              FALSE
            )
          `,
            [prescription.customer_id]
          );
        } catch (notifyError) {
          console.error(
            `Error creating notification for customer ${prescription.customer_id}:`,
            notifyError
          );
        }
      }

      return {
        count: expiredPrescriptions.length,
        prescriptions: expiredPrescriptions,
      };
    } catch (error) {
      console.error("Error checking expired prescriptions:", error);
      throw error;
    }
  }
}

module.exports = LandingModel;
