// // models/prescription.model.js
// const { db } = require("../../db");

// class PrescriptionModel {
//   static async getAllPrescriptions(options = {}) {
//     try {
//       const page = options.page || 1;
//       const limit = options.limit || 10;
//       const status = options.status || null;
//       const customerId = options.customerId || null;
//       const offset = (page - 1) * limit;

//       // Build query with correct JOIN structure
//       let query = `
//      SELECT
//     p.prescription_id,
//     p.customer_id,
//     p.pharmacy_staff_id,
//     p.status,
//     p.delivery_method,
//     p.uploaded_at,
//     p.file_path,
//     p.expiry_date,
//     p.address,
//     p.telephone,
//     p.note,
//     c.name AS customer_name
//   FROM
//     prescription p
//   LEFT JOIN
//     customer c ON p.customer_id = c.customer_id
//     `;

//       const whereConditions = [];
//       const queryParams = [];

//       if (status) {
//         whereConditions.push("p.status = ?");
//         queryParams.push(status);
//       }

//       if (customerId) {
//         whereConditions.push("p.customer_id = ?");
//         queryParams.push(customerId);
//       }

//       if (whereConditions.length > 0) {
//         query += " WHERE " + whereConditions.join(" AND ");
//       }

//       query += " ORDER BY p.uploaded_at DESC ";
//       queryParams.push();

//       // Execute query
//       const [prescriptions] = await db.execute(query, queryParams);

//       // Get total count
//       let countQuery = "SELECT COUNT(*) as total FROM prescription p";
//       if (whereConditions.length > 0) {
//         countQuery += " WHERE " + whereConditions.join(" AND ");
//       }

//       const [countResult] = await db.execute(
//         countQuery,
//         whereConditions.length > 0 ? queryParams.slice(0, -2) : []
//       );
//       const total = countResult[0].total;

//       return {
//         prescriptions,
//         pagination: {
//           total,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           pages: Math.ceil(total / limit),
//         },
//       };
//     } catch (error) {
//       console.error("Error in getAllPrescriptions:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get prescription by ID
//    * @param {number} prescriptionId - Prescription ID
//    * @returns {Promise<Object>} Prescription details
//    */
//   static async getPrescriptionById(prescriptionId) {
//     try {
//       const [prescriptions] = await db.execute(
//         `
// SELECT
//     p.prescription_id,
//     p.pharmacy_staff_id,
//     p.status,
//     p.delivery_method,
//     p.uploaded_at,
//     p.file_path,
//     p.customer_id,
//     c.name AS customer_name,
//     p.address,
//     p.number AS telephone,
//     p.note
//   FROM
//     prescription p
//   LEFT JOIN
//     customer c ON p.customer_id = c.customer_id
//   WHERE
//     p.prescription_id = ?
//         `,
//         [prescriptionId]
//       );

//       return prescriptions[0] || null;
//     } catch (error) {
//       console.error("Error in getPrescriptionById:", error);
//       throw error;
//     }
//   }

//   /**
//    * Update prescription status
//    * @param {number} prescriptionId - Prescription ID
//    * @param {string} status - New status
//    * @param {number} staffId - Staff ID making the update
//    * @returns {Promise<Object>} Result of the update
//    */
//   // static async updatePrescriptionStatus(prescriptionId, status, staffId) {
//   //   const connection = await db.getConnection();
//   //   try {
//   //     await connection.beginTransaction();

//   //     // Get the prescription to check if it exists and get customer ID
//   //     const [prescriptions] = await connection.execute(
//   //       "SELECT prescription_id, customer_id, status FROM prescription WHERE prescription_id = ?",
//   //       [prescriptionId]
//   //     );

//   //     if (prescriptions.length === 0) {
//   //       await connection.rollback();
//   //       return { success: false, message: "Prescription not found" };
//   //     }

//   //     const prescription = prescriptions[0];
//   //     const oldStatus = prescription.status;

//   //     // Don't update if status is the same
//   //     if (oldStatus === status) {
//   //       await connection.rollback();
//   //       return { success: true, message: "Status unchanged" };
//   //     }

//   //     // Update prescription status and assign staff if not already assigned
//   //     if (staffId) {
//   //       await connection.execute(
//   //         "UPDATE prescription SET status = ?, pharmacy_staff_id = COALESCE(pharmacy_staff_id, ?) WHERE prescription_id = ?",
//   //         [status, staffId, prescriptionId]
//   //       );
//   //     } else {
//   //       await connection.execute(
//   //         "UPDATE prescription SET status = ? WHERE prescription_id = ?",
//   //         [status, prescriptionId]
//   //       );
//   //     }

//   //     // Create a notification for the customer
//   //     const statusMessage = this.getStatusMessage(status);
//   //     await connection.execute(
//   //       `
//   //       INSERT INTO notifications (
//   //         user_id,
//   //         user_type,
//   //         title,
//   //         message,
//   //         is_read
//   //       ) VALUES (?, 'customer', ?, ?, FALSE)
//   //       `,
//   //       [
//   //         prescription.customer_id,
//   //         `Prescription Status Updated`,
//   //         `Your prescription #${prescriptionId} status has been updated to: ${status}. ${statusMessage}`,
//   //       ]
//   //     );

//   //     await connection.commit();
//   //     return {
//   //       success: true,
//   //       message: "Prescription status updated successfully",
//   //       oldStatus,
//   //       newStatus: status,
//   //     };
//   //   } catch (error) {
//   //     await connection.rollback();
//   //     console.error("Error in updatePrescriptionStatus:", error);
//   //     throw error;
//   //   } finally {
//   //     connection.release();
//   //   }
//   // }

//   static async updatePrescriptionStatus(prescriptionId, status, staffId) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Get the prescription to check if it exists and get customer ID
//       const [prescriptions] = await connection.execute(
//         "SELECT prescription_id, customer_id, status FROM prescription WHERE prescription_id = ?",
//         [prescriptionId]
//       );

//       if (prescriptions.length === 0) {
//         await connection.rollback();
//         return { success: false, message: "Prescription not found" };
//       }

//       const prescription = prescriptions[0];
//       const oldStatus = prescription.status;
//       const customerId = prescription.customer_id;

//       // Don't update if status is the same
//       if (oldStatus === status) {
//         await connection.rollback();
//         return { success: true, message: "Status unchanged" };
//       }

//       // Update prescription status and assign staff if not already assigned
//       if (staffId) {
//         await connection.execute(
//           "UPDATE prescription SET status = ?, pharmacy_staff_id = COALESCE(pharmacy_staff_id, ?) WHERE prescription_id = ?",
//           [status, staffId, prescriptionId]
//         );
//       } else {
//         await connection.execute(
//           "UPDATE prescription SET status = ? WHERE prescription_id = ?",
//           [status, prescriptionId]
//         );
//       }

//       // Create a notification for the customer
//       const statusMessage = this.getStatusMessage(status);

//       // Insert notification for customer
//       if (customerId) {
//         await connection.execute(
//           `
//         INSERT INTO notifications (
//           user_id,
//           user_type,
//           title,
//           message,
//           is_read
//         ) VALUES (?, 'customer', ?, ?, FALSE)
//         `,
//           [
//             customerId,
//             `Prescription Status Updated`,
//             `Your prescription #${prescriptionId} status has been updated to: ${status}. ${statusMessage}`,
//           ]
//         );

//         console.log(`Notification created for customer ${customerId}`);
//       } else {
//         console.log(
//           `No customer ID found for prescription ${prescriptionId}, skipping notification`
//         );
//       }

//       await connection.commit();
//       return {
//         success: true,
//         message: "Prescription status updated successfully",
//         oldStatus,
//         newStatus: status,
//       };
//     } catch (error) {
//       await connection.rollback();
//       console.error("Error in updatePrescriptionStatus:", error);
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }

//   /**
//    * Upload a new prescription
//    * @param {Object} prescriptionData - Prescription data
//    * @returns {Promise<Object>} Result of upload
//    */
//   // static async uploadPrescription(prescriptionData) {
//   //   const { customerId, deliveryMethod, filePath, note, expiryDate } =
//   //     prescriptionData;

//   //   const connection = await db.getConnection();
//   //   try {
//   //     await connection.beginTransaction();

//   //     // Insert prescription
//   //     const [result] = await connection.execute(
//   //       `
//   //       INSERT INTO prescription (
//   //         customer_id,
//   //         pharmacy_staff_id,
//   //         status,
//   //         delivery_method,
//   //         file_path,
//   //         expiry_date
//   //       ) VALUES (?, NULL, 'Pending', ?, ?, ?)
//   //       `,
//   //       [customerId, deliveryMethod, filePath, expiryDate]
//   //     );

//   //     const prescriptionId = result.insertId;

//   //     // Create notification for staff
//   //     await connection.execute(
//   //       `
//   //       INSERT INTO notifications (
//   //         user_id,
//   //         user_type,
//   //         title,
//   //         message,
//   //         is_read
//   //       ) VALUES (?, 'staff', ?, ?, FALSE)
//   //       `,
//   //       [
//   //         1, // Default staff ID for notifications
//   //         "New Prescription Uploaded",
//   //         `A new prescription #${prescriptionId} has been uploaded and needs review. It will expire on ${new Date(
//   //           expiryDate
//   //         ).toLocaleDateString()}.`,
//   //       ]
//   //     );

//   //     // Create confirmation notification for customer
//   //     await connection.execute(
//   //       `
//   //       INSERT INTO notifications (
//   //         user_id,
//   //         user_type,
//   //         title,
//   //         message,
//   //         is_read
//   //       ) VALUES (?, 'customer', ?, ?, FALSE)
//   //       `,
//   //       [
//   //         customerId,
//   //         "Prescription Uploaded Successfully",
//   //         `Your prescription #${prescriptionId} has been uploaded successfully and is pending review. We'll notify you when it's processed.`,
//   //       ]
//   //     );

//   //     await connection.commit();
//   //     return {
//   //       success: true,
//   //       prescriptionId,
//   //       message: "Prescription uploaded successfully",
//   //     };
//   //   } catch (error) {
//   //     await connection.rollback();
//   //     console.error("Error in uploadPrescription:", error);
//   //     throw error;
//   //   } finally {
//   //     connection.release();
//   //   }
//   // }

//   /**
//    * Delete a prescription
//    * @param {number} prescriptionId - Prescription ID
//    * @returns {Promise<Object>} Result of deletion
//    */
//   static async deletePrescription(prescriptionId) {
//     try {
//       // Check if the prescription is used in any orders
//       const [orders] = await db.execute(
//         "SELECT cus_oder_id FROM cus_oder WHERE prescription_id = ?",
//         [prescriptionId]
//       );

//       if (orders.length > 0) {
//         return {
//           success: false,
//           message: "Cannot delete prescription that is linked to orders",
//         };
//       }

//       const [result] = await db.execute(
//         "DELETE FROM prescription WHERE prescription_id = ?",
//         [prescriptionId]
//       );

//       if (result.affectedRows === 0) {
//         return { success: false, message: "Prescription not found" };
//       }

//       return {
//         success: true,
//         message: "Prescription deleted successfully",
//       };
//     } catch (error) {
//       console.error("Error in deletePrescription:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get status message based on status
//    * @param {string} status - Status
//    * @returns {string} Status message
//    */
//   static getStatusMessage(status) {
//     switch (status) {
//       case "Confirmed":
//         return "Your prescription has been reviewed and confirmed.";
//       case "Available":
//         return "Your medicines are available and ready for processing.";
//       case "Not available":
//         return "Unfortunately, some medicines in your prescription are not available at the moment.";
//       case "Delayed":
//         return "There is a delay in processing your prescription. We apologize for the inconvenience.";
//       case "Out for delivery":
//         return "Your medicines are out for delivery and will arrive soon.";
//       case "Ready for pickup":
//         return "Your medicines are ready for pickup at our pharmacy.";
//       case "Expired":
//         return "Your prescription has expired. Please upload a new one if you still need the medicines.";
//       case "Rejected":
//         return "Your prescription was rejected. Please contact our pharmacy for more information.";
//       default:
//         return "";
//     }
//   }

//   /**
//    * Get prescriptions by customer ID
//    * @param {number} customerId - Customer ID
//    * @returns {Promise<Array>} List of prescriptions
//    */
//   static async getPrescriptionsByCustomer(customerId) {
//     try {
//       const [prescriptions] = await db.execute(
//         `
//         SELECT
//           prescription_id,
//           status,
//           delivery_method,
//           uploaded_at,
//           file_path,
//           expiry_date
//         FROM
//           prescription
//         WHERE
//           customer_id = ?
//         ORDER BY
//           uploaded_at DESC
//         `,
//         [customerId]
//       );

//       return prescriptions;
//     } catch (error) {
//       console.error("Error in getPrescriptionsByCustomer:", error);
//       throw error;
//     }
//   }

//   /**
//    * Check and update expired prescriptions
//    * @returns {Promise<Object>} Result with count of expired prescriptions
//    */
//   // static async checkExpiredPrescriptions() {
//   //   const connection = await db.getConnection();
//   //   try {
//   //     await connection.beginTransaction();

//   //     // Find prescriptions that have expired but not marked as expired
//   //     const [expiredPrescriptions] = await connection.execute(
//   //       `
//   //       SELECT prescription_id, customer_id
//   //       FROM prescription
//   //       WHERE expiry_date <= NOW()
//   //       AND status != 'Expired'
//   //       `
//   //     );

//   //     if (expiredPrescriptions.length === 0) {
//   //       await connection.rollback();
//   //       return { count: 0 };
//   //     }

//   //     // Update their status
//   //     await connection.execute(
//   //       `
//   //       UPDATE prescription
//   //       SET status = 'Expired'
//   //       WHERE expiry_date <= NOW()
//   //       AND status != 'Expired'
//   //       `
//   //     );

//   //     // Create notifications for customers
//   //     for (const prescription of expiredPrescriptions) {
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
//   //           prescription.customer_id,
//   //           "Prescription Expired",
//   //           `Your prescription #${prescription.prescription_id} has expired. Please upload a new one if you still need the medicines.`,
//   //         ]
//   //       );
//   //     }

//   //     await connection.commit();
//   //     return {
//   //       count: expiredPrescriptions.length,
//   //       prescriptions: expiredPrescriptions,
//   //     };
//   //   } catch (error) {
//   //     await connection.rollback();
//   //     console.error("Error in checkExpiredPrescriptions:", error);
//   //     throw error;
//   //   } finally {
//   //     connection.release();
//   //   }
//   // }
// }

// module.exports = PrescriptionModel;

///////////////////////////working fine/////////////////////////

// models/prescription.model.js
const { db } = require("../../db");

class PrescriptionModel {
  static async getAllPrescriptions(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const status = options.status || null;
      const customerId = options.customerId || null;
      const offset = (page - 1) * limit;

      // Build query with correct JOIN structure
      let query = `
     SELECT 
    p.prescription_id, 
    p.customer_id,
    p.pharmacy_staff_id, 
    p.status, 
    p.delivery_method,
    p.uploaded_at,
    p.file_path,
    p.expiry_date,
    p.address,
    p.telephone,
    p.note,
    c.name AS customer_name
  FROM 
    prescription p
  LEFT JOIN
    customer c ON p.customer_id = c.customer_id
    `;

      const whereConditions = [];
      const queryParams = [];

      if (status) {
        whereConditions.push("p.status = ?");
        queryParams.push(status);
      }

      if (customerId) {
        whereConditions.push("p.customer_id = ?");
        queryParams.push(customerId);
      }

      if (whereConditions.length > 0) {
        query += " WHERE " + whereConditions.join(" AND ");
      }

      query += " ORDER BY p.uploaded_at DESC ";
      queryParams.push();

      // Execute query
      const [prescriptions] = await db.execute(query, queryParams);

      // Get total count
      let countQuery = "SELECT COUNT(*) as total FROM prescription p";
      if (whereConditions.length > 0) {
        countQuery += " WHERE " + whereConditions.join(" AND ");
      }

      const [countResult] = await db.execute(
        countQuery,
        whereConditions.length > 0 ? queryParams.slice(0, -2) : []
      );
      const total = countResult[0].total;

      return {
        prescriptions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error in getAllPrescriptions:", error);
      throw error;
    }
  }

  /**
   * Get prescription by ID
   * @param {number} prescriptionId - Prescription ID
   * @returns {Promise<Object>} Prescription details
   */
  // In PrescriptionModel.js
  static async getPrescriptionById(prescriptionId) {
    try {
      const [prescriptions] = await db.execute(
        `SELECT 
        p.*, 
        c.name AS customer_name,
        pay.payment_method
      FROM 
        prescription p
      LEFT JOIN customer c ON p.customer_id = c.customer_id
      LEFT JOIN payments pay ON p.payment_id = pay.payment_id
      WHERE p.prescription_id = ?`,
        [prescriptionId]
      );
      return prescriptions[0] || null;
    } catch (error) {
      console.error("Error in getPrescriptionById:", error);
      throw error;
    }
  }

  static async completePrescription(prescriptionId, staffId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Get prescription details with payment method
      const [prescriptions] = await connection.execute(
        `SELECT p.*, pay.payment_method 
       FROM prescription p
       LEFT JOIN payments pay ON p.payment_id = pay.payment_id
       WHERE p.prescription_id = ?`,
        [prescriptionId]
      );

      if (prescriptions.length === 0) {
        await connection.rollback();
        return { success: false, message: "Prescription not found" };
      }

      const prescription = prescriptions[0];

      // 2. Update status to "Completed"
      await connection.execute(
        `UPDATE prescription SET status = 'Completed', 
       pharmacy_staff_id = COALESCE(pharmacy_staff_id, ?)
       WHERE prescription_id = ?`,
        [staffId, prescriptionId]
      );

      // 3. Reduce inventory if not already reduced
      if (!prescription.inventory_reduced) {
        const [products] = await connection.execute(
          `SELECT product_id, quantity 
         FROM prescription_product 
         WHERE prescription_id = ?`,
          [prescriptionId]
        );

        for (const product of products) {
          // Reduce from supplier batches (nearest expiry first)
          const [batches] = await connection.execute(
            `SELECT sup_id, product_id, oder_id 
           FROM supplier_product 
           WHERE product_id = ? AND Products_remaining > 0
           ORDER BY expired_date ASC`,
            [product.product_id]
          );

          let remaining = product.quantity;
          for (const batch of batches) {
            if (remaining <= 0) break;

            const reduceAmount = Math.min(remaining, batch.Products_remaining);
            await connection.execute(
              `UPDATE supplier_product 
             SET Products_remaining = Products_remaining - ?
             WHERE sup_id = ? AND product_id = ? AND oder_id = ?`,
              [reduceAmount, batch.sup_id, batch.product_id, batch.oder_id]
            );
            remaining -= reduceAmount;
          }

          // Update main product quantity
          await connection.execute(
            `UPDATE product 
           SET quantity = GREATEST(0, quantity - ?)
           WHERE product_id = ?`,
            [product.quantity, product.product_id]
          );
        }

        // Mark inventory as reduced
        await connection.execute(
          `UPDATE prescription 
         SET inventory_reduced = TRUE 
         WHERE prescription_id = ?`,
          [prescriptionId]
        );
      }

      // 4. Create notification
      await connection.execute(
        `INSERT INTO notifications (
        user_id, user_type, title, message, is_read
      ) VALUES (?, 'customer', ?, ?, FALSE)`,
        [
          prescription.customer_id,
          "Prescription Completed",
          `Your prescription #${prescriptionId} has been completed. ${
            prescription.delivery_method === "Deliver"
              ? "Your medicines will be delivered soon."
              : "Your medicines are ready for pickup."
          }`,
        ]
      );

      await connection.commit();
      return {
        success: true,
        message: "Prescription completed successfully",
        inventoryReduced: !prescription.inventory_reduced,
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error completing prescription:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async cancelPrescription(prescriptionId, staffId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Get prescription details with payment method
      const [prescriptions] = await connection.execute(
        `SELECT p.*, pay.payment_method, pay.payment_id
       FROM prescription p
       LEFT JOIN payments pay ON p.payment_id = pay.payment_id
       WHERE p.prescription_id = ?`,
        [prescriptionId]
      );

      if (prescriptions.length === 0) {
        await connection.rollback();
        return { success: false, message: "Prescription not found" };
      }

      const prescription = prescriptions[0];

      // 2. Update status to "Cancelled"
      await connection.execute(
        `UPDATE prescription SET status = 'Cancelled', 
       pharmacy_staff_id = COALESCE(pharmacy_staff_id, ?)
       WHERE prescription_id = ?`,
        [staffId, prescriptionId]
      );

      // 3. Delete payment record if payment method is CashOnDelivery
      if (
        prescription.payment_method === "CashOnDelivery" &&
        prescription.payment_id
      ) {
        await connection.execute(`DELETE FROM payments WHERE payment_id = ?`, [
          prescription.payment_id,
        ]);
      }

      // 4. Create notification
      await connection.execute(
        `INSERT INTO notifications (
        user_id, user_type, title, message, is_read
      ) VALUES (?, 'customer', ?, ?, FALSE)`,
        [
          prescription.customer_id,
          "Prescription Cancelled",
          `Your prescription #${prescriptionId} has been cancelled. ${
            prescription.payment_method === "CashOnDelivery"
              ? "No payment was processed."
              : "Please contact us for any refunds."
          }`,
        ]
      );

      await connection.commit();
      return {
        success: true,
        message: "Prescription cancelled successfully",
        paymentDeleted: prescription.payment_method === "CashOnDelivery",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error cancelling prescription:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update prescription status
   * @param {number} prescriptionId - Prescription ID
   * @param {string} status - New status
   * @param {number} staffId - Staff ID making the update
   * @returns {Promise<Object>} Result of the update
   */
  // static async updatePrescriptionStatus(prescriptionId, status, staffId) {
  //   const connection = await db.getConnection();
  //   try {
  //     await connection.beginTransaction();

  //     // Get the prescription to check if it exists and get customer ID
  //     const [prescriptions] = await connection.execute(
  //       "SELECT prescription_id, customer_id, status FROM prescription WHERE prescription_id = ?",
  //       [prescriptionId]
  //     );

  //     if (prescriptions.length === 0) {
  //       await connection.rollback();
  //       return { success: false, message: "Prescription not found" };
  //     }

  //     const prescription = prescriptions[0];
  //     const oldStatus = prescription.status;

  //     // Don't update if status is the same
  //     if (oldStatus === status) {
  //       await connection.rollback();
  //       return { success: true, message: "Status unchanged" };
  //     }

  //     // Update prescription status and assign staff if not already assigned
  //     if (staffId) {
  //       await connection.execute(
  //         "UPDATE prescription SET status = ?, pharmacy_staff_id = COALESCE(pharmacy_staff_id, ?) WHERE prescription_id = ?",
  //         [status, staffId, prescriptionId]
  //       );
  //     } else {
  //       await connection.execute(
  //         "UPDATE prescription SET status = ? WHERE prescription_id = ?",
  //         [status, prescriptionId]
  //       );
  //     }

  //     // Create a notification for the customer
  //     const statusMessage = this.getStatusMessage(status);
  //     await connection.execute(
  //       `
  //       INSERT INTO notifications (
  //         user_id,
  //         user_type,
  //         title,
  //         message,
  //         is_read
  //       ) VALUES (?, 'customer', ?, ?, FALSE)
  //       `,
  //       [
  //         prescription.customer_id,
  //         `Prescription Status Updated`,
  //         `Your prescription #${prescriptionId} status has been updated to: ${status}. ${statusMessage}`,
  //       ]
  //     );

  //     await connection.commit();
  //     return {
  //       success: true,
  //       message: "Prescription status updated successfully",
  //       oldStatus,
  //       newStatus: status,
  //     };
  //   } catch (error) {
  //     await connection.rollback();
  //     console.error("Error in updatePrescriptionStatus:", error);
  //     throw error;
  //   } finally {
  //     connection.release();
  //   }
  // }

  static async updatePrescriptionStatus(prescriptionId, status, staffId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get the prescription to check if it exists and get customer ID
      const [prescriptions] = await connection.execute(
        "SELECT prescription_id, customer_id, status FROM prescription WHERE prescription_id = ?",
        [prescriptionId]
      );

      if (prescriptions.length === 0) {
        await connection.rollback();
        return { success: false, message: "Prescription not found" };
      }

      const prescription = prescriptions[0];
      const oldStatus = prescription.status;
      const customerId = prescription.customer_id;

      // Don't update if status is the same
      if (oldStatus === status) {
        await connection.rollback();
        return { success: true, message: "Status unchanged" };
      }

      // Update prescription status and assign staff if not already assigned
      if (staffId) {
        await connection.execute(
          "UPDATE prescription SET status = ?, pharmacy_staff_id = COALESCE(pharmacy_staff_id, ?) WHERE prescription_id = ?",
          [status, staffId, prescriptionId]
        );
      } else {
        await connection.execute(
          "UPDATE prescription SET status = ? WHERE prescription_id = ?",
          [status, prescriptionId]
        );
      }

      // Create a notification for the customer
      const statusMessage = this.getStatusMessage(status);

      // Insert notification for customer
      if (customerId) {
        await connection.execute(
          `
        INSERT INTO notifications (
          user_id, 
          user_type, 
          title, 
          message, 
          is_read
        ) VALUES (?, 'customer', ?, ?, FALSE)
        `,
          [
            customerId,
            `Prescription Status Updated`,
            `Your prescription #${prescriptionId} status has been updated to: ${status}. ${statusMessage}`,
          ]
        );

        console.log(`Notification created for customer ${customerId}`);
      } else {
        console.log(
          `No customer ID found for prescription ${prescriptionId}, skipping notification`
        );
      }

      await connection.commit();
      return {
        success: true,
        message: "Prescription status updated successfully",
        oldStatus,
        newStatus: status,
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error in updatePrescriptionStatus:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Upload a new prescription
   * @param {Object} prescriptionData - Prescription data
   * @returns {Promise<Object>} Result of upload
   */
  // static async uploadPrescription(prescriptionData) {
  //   const { customerId, deliveryMethod, filePath, note, expiryDate } =
  //     prescriptionData;

  //   const connection = await db.getConnection();
  //   try {
  //     await connection.beginTransaction();

  //     // Insert prescription
  //     const [result] = await connection.execute(
  //       `
  //       INSERT INTO prescription (
  //         customer_id,
  //         pharmacy_staff_id,
  //         status,
  //         delivery_method,
  //         file_path,
  //         expiry_date
  //       ) VALUES (?, NULL, 'Pending', ?, ?, ?)
  //       `,
  //       [customerId, deliveryMethod, filePath, expiryDate]
  //     );

  //     const prescriptionId = result.insertId;

  //     // Create notification for staff
  //     await connection.execute(
  //       `
  //       INSERT INTO notifications (
  //         user_id,
  //         user_type,
  //         title,
  //         message,
  //         is_read
  //       ) VALUES (?, 'staff', ?, ?, FALSE)
  //       `,
  //       [
  //         1, // Default staff ID for notifications
  //         "New Prescription Uploaded",
  //         `A new prescription #${prescriptionId} has been uploaded and needs review. It will expire on ${new Date(
  //           expiryDate
  //         ).toLocaleDateString()}.`,
  //       ]
  //     );

  //     // Create confirmation notification for customer
  //     await connection.execute(
  //       `
  //       INSERT INTO notifications (
  //         user_id,
  //         user_type,
  //         title,
  //         message,
  //         is_read
  //       ) VALUES (?, 'customer', ?, ?, FALSE)
  //       `,
  //       [
  //         customerId,
  //         "Prescription Uploaded Successfully",
  //         `Your prescription #${prescriptionId} has been uploaded successfully and is pending review. We'll notify you when it's processed.`,
  //       ]
  //     );

  //     await connection.commit();
  //     return {
  //       success: true,
  //       prescriptionId,
  //       message: "Prescription uploaded successfully",
  //     };
  //   } catch (error) {
  //     await connection.rollback();
  //     console.error("Error in uploadPrescription:", error);
  //     throw error;
  //   } finally {
  //     connection.release();
  //   }
  // }

  /**
   * Delete a prescription
   * @param {number} prescriptionId - Prescription ID
   * @returns {Promise<Object>} Result of deletion
   */
  static async deletePrescription(prescriptionId) {
    try {
      // Check if the prescription is used in any orders
      const [orders] = await db.execute(
        "SELECT cus_oder_id FROM cus_oder WHERE prescription_id = ?",
        [prescriptionId]
      );

      if (orders.length > 0) {
        return {
          success: false,
          message: "Cannot delete prescription that is linked to orders",
        };
      }

      const [result] = await db.execute(
        "DELETE FROM prescription WHERE prescription_id = ?",
        [prescriptionId]
      );

      if (result.affectedRows === 0) {
        return { success: false, message: "Prescription not found" };
      }

      return {
        success: true,
        message: "Prescription deleted successfully",
      };
    } catch (error) {
      console.error("Error in deletePrescription:", error);
      throw error;
    }
  }

  /**
   * Get status message based on status
   * @param {string} status - Status
   * @returns {string} Status message
   */
  static getStatusMessage(status) {
    switch (status) {
      case "Confirmed":
        return "Your prescription has been reviewed and confirmed.";
      case "Available":
        return "Your medicines are available and ready for processing.";
      case "Not available":
        return "Unfortunately, some medicines in your prescription are not available at the moment.";
      case "Delayed":
        return "There is a delay in processing your prescription. We apologize for the inconvenience.";
      case "Out for delivery":
        return "Your medicines are out for delivery and will arrive soon.";
      case "Ready for pickup":
        return "Your medicines are ready for pickup at our pharmacy.";
      case "Expired":
        return "Your prescription has expired. Please upload a new one if you still need the medicines.";
      case "Rejected":
        return "Your prescription was rejected. Please contact our pharmacy for more information.";
      default:
        return "";
    }
  }

  /**
   * Get prescriptions by customer ID
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} List of prescriptions
   */
  static async getPrescriptionsByCustomer(customerId) {
    try {
      const [prescriptions] = await db.execute(
        `
        SELECT 
          prescription_id, 
          status, 
          delivery_method,
          uploaded_at,
          file_path,
          expiry_date
        FROM 
          prescription
        WHERE 
          customer_id = ?
        ORDER BY 
          uploaded_at DESC
        `,
        [customerId]
      );

      return prescriptions;
    } catch (error) {
      console.error("Error in getPrescriptionsByCustomer:", error);
      throw error;
    }
  }

  /**
   * Check and update expired prescriptions
   * @returns {Promise<Object>} Result with count of expired prescriptions
   */
  // static async checkExpiredPrescriptions() {
  //   const connection = await db.getConnection();
  //   try {
  //     await connection.beginTransaction();

  //     // Find prescriptions that have expired but not marked as expired
  //     const [expiredPrescriptions] = await connection.execute(
  //       `
  //       SELECT prescription_id, customer_id
  //       FROM prescription
  //       WHERE expiry_date <= NOW()
  //       AND status != 'Expired'
  //       `
  //     );

  //     if (expiredPrescriptions.length === 0) {
  //       await connection.rollback();
  //       return { count: 0 };
  //     }

  //     // Update their status
  //     await connection.execute(
  //       `
  //       UPDATE prescription
  //       SET status = 'Expired'
  //       WHERE expiry_date <= NOW()
  //       AND status != 'Expired'
  //       `
  //     );

  //     // Create notifications for customers
  //     for (const prescription of expiredPrescriptions) {
  //       await connection.execute(
  //         `
  //         INSERT INTO notifications (
  //           user_id,
  //           user_type,
  //           title,
  //           message,
  //           is_read
  //         ) VALUES (?, 'customer', ?, ?, FALSE)
  //         `,
  //         [
  //           prescription.customer_id,
  //           "Prescription Expired",
  //           `Your prescription #${prescription.prescription_id} has expired. Please upload a new one if you still need the medicines.`,
  //         ]
  //       );
  //     }

  //     await connection.commit();
  //     return {
  //       count: expiredPrescriptions.length,
  //       prescriptions: expiredPrescriptions,
  //     };
  //   } catch (error) {
  //     await connection.rollback();
  //     console.error("Error in checkExpiredPrescriptions:", error);
  //     throw error;
  //   } finally {
  //     connection.release();
  //   }
  // }
}

module.exports = PrescriptionModel;
