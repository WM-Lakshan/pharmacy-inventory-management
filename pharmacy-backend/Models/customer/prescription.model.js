// const { db } = require("../../db");

// class CustomerPrescriptionModel {
//   /**
//    * Get products associated with a prescription
//    * @param {number} prescriptionId - Prescription ID
//    * @param {number} customerId - Customer ID (for security validation)
//    * @returns {Promise<Array>} List of prescription products
//    */
//   static async getPrescriptionProducts(prescriptionId, customerId) {
//     try {
//       // First check if the customer owns the prescription
//       const [prescriptions] = await db.execute(
//         `
//       SELECT prescription_id
//       FROM prescription
//       WHERE prescription_id = ? AND customer_id = ?
//       `,
//         [prescriptionId, customerId]
//       );

//       if (prescriptions.length === 0) {
//         return {
//           success: false,
//           message:
//             "Prescription not found or you don't have permission to view it",
//         };
//       }

//       // Get order ID associated with the prescription
//       const [orders] = await db.execute(
//         `
//       SELECT cus_oder_id
//       FROM cus_oder
//       WHERE prescription_id = ?
//       `,
//         [prescriptionId]
//       );

//       if (orders.length === 0) {
//         return {
//           success: true,
//           products: [],
//           message: "No products associated with this prescription yet",
//         };
//       }

//       const orderId = orders[0].cus_oder_id;

//       // Get products in the order
//       const [products] = await db.execute(
//         `
//       SELECT
//         cp.product_id as id,
//         p.pname as name,
//         cp.quantity,
//         cp.price,
//         (cp.quantity * cp.price) as total
//       FROM
//         customer_product cp
//       JOIN
//         product p ON cp.product_id = p.product_id
//       WHERE
//         cp.cus_oder_id = ?
//       ORDER BY
//         p.pname
//       `,
//         [orderId]
//       );

//       return {
//         success: true,
//         products,
//       };
//     } catch (error) {
//       console.error("Error in getPrescriptionProducts:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get all prescriptions for the logged-in customer
//    * @param {number} customerId - Customer ID
//    * @returns {Promise<Array>} List of prescriptions
//    */
//   static async getCustomerPrescriptions(customerId) {
//     try {
//       const [prescriptions] = await db.execute(
//         `
//         SELECT
//           p.prescription_id,
//           p.status,
//           p.delivery_method,
//           p.uploaded_at,
//           p.file_path,
//           p.expiry_date,
//           COALESCE(co.value, 0) as value
//         FROM
//           prescription p
//         LEFT JOIN
//           cus_oder co ON p.prescription_id = co.prescription_id
//         WHERE
//           p.customer_id = ?
//         ORDER BY
//           p.uploaded_at DESC
//         `,
//         [customerId]
//       );

//       return prescriptions;
//     } catch (error) {
//       console.error("Error in getCustomerPrescriptions:", error);
//       throw error;
//     }
//   }

//   static async getPrescriptionById(prescriptionId, customerId) {
//     try {
//       const [prescriptions] = await db.execute(
//         `
//         SELECT
//           p.prescription_id,
//           p.status,
//           p.delivery_method,
//           p.uploaded_at,
//           p.file_path,
//           p.expiry_date,
//           COALESCE(co.value, 0) as value
//         FROM
//           prescription p
//         LEFT JOIN
//           cus_oder co ON p.prescription_id = co.prescription_id
//         WHERE
//           p.prescription_id = ?
//           AND p.customer_id = ?
//         `,
//         [prescriptionId, customerId]
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
//    * @param {number} customerId - Customer ID (for security validation)
//    * @param {boolean} reduceInventory - Whether to reduce inventory
//    * @returns {Promise<Object>} Result of update
//    */
//   static async updatePrescriptionStatus(
//     prescriptionId,
//     status,
//     customerId,
//     reduceInventory
//   ) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Get the prescription to check if it exists and validate ownership
//       const [prescriptions] = await connection.execute(
//         "SELECT prescription_id, customer_id, status FROM prescription WHERE prescription_id = ? AND customer_id = ?",
//         [prescriptionId, customerId]
//       );

//       if (prescriptions.length === 0) {
//         await connection.rollback();
//         return {
//           success: false,
//           message:
//             "Prescription not found or you don't have permission to update it",
//         };
//       }

//       const prescription = prescriptions[0];
//       const oldStatus = prescription.status;

//       // Don't update if status is the same
//       if (oldStatus === status) {
//         await connection.rollback();
//         return {
//           success: true,
//           message: "Status unchanged",
//         };
//       }

//       // Only allow customers to update from "Available" to "Confirmed" or "Cancelled"
//       if (
//         oldStatus !== "Available" &&
//         (status === "Confirmed" || status === "Cancelled")
//       ) {
//         await connection.rollback();
//         return {
//           success: false,
//           message:
//             "You can only accept or cancel prescriptions that are available",
//         };
//       }

//       // Update prescription status
//       await connection.execute(
//         "UPDATE prescription SET status = ? WHERE prescription_id = ?",
//         [status, prescriptionId]
//       );

//       let inventoryReduced = false;

//       // If status is "Confirmed" and reduceInventory is true, reduce product quantities from inventory
//       if (status === "Confirmed" && reduceInventory) {
//         // Get the associated order for this prescription
//         const [orders] = await connection.execute(
//           "SELECT cus_oder_id FROM cus_oder WHERE prescription_id = ?",
//           [prescriptionId]
//         );

//         if (orders.length > 0) {
//           const orderId = orders[0].cus_oder_id;

//           // Get products in this order
//           const [products] = await connection.execute(
//             `
//             SELECT
//               product_id,
//               quantity
//             FROM customer_product
//             WHERE cus_oder_id = ?
//             `,
//             [orderId]
//           );

//           // For each product, reduce inventory
//           for (const product of products) {
//             // Get supplier product batches ordered by expiry date (earliest first)
//             const [batches] = await connection.execute(
//               `
//               SELECT
//                 sup_id,
//                 product_id,
//                 oder_id,
//                 Products_remaining,
//                 expired_date
//               FROM
//                 supplier_product
//               WHERE
//                 product_id = ?
//                 AND Products_remaining > 0
//               ORDER BY
//                 expired_date ASC
//               `,
//               [product.product_id]
//             );

//             let remainingToReduce = product.quantity;

//             // Reduce from each batch until we've reduced the full quantity
//             for (const batch of batches) {
//               if (remainingToReduce <= 0) break;

//               const reduceAmount = Math.min(
//                 remainingToReduce,
//                 batch.Products_remaining
//               );

//               // Update supplier_product batch
//               await connection.execute(
//                 `
//                 UPDATE supplier_product
//                 SET Products_remaining = Products_remaining - ?
//                 WHERE sup_id = ? AND product_id = ? AND oder_id = ?
//                 `,
//                 [reduceAmount, batch.sup_id, batch.product_id, batch.oder_id]
//               );

//               remainingToReduce -= reduceAmount;
//             }

//             // Update product's main quantity
//             await connection.execute(
//               `
//               UPDATE product
//               SET quantity = GREATEST(0, quantity - ?)
//               WHERE product_id = ?
//               `,
//               [product.quantity, product.product_id]
//             );
//           }

//           // Mark that inventory has been reduced for this prescription
//           await connection.execute(
//             "UPDATE prescription SET inventory_reduced = TRUE WHERE prescription_id = ?",
//             [prescriptionId]
//           );

//           // Also mark the order
//           await connection.execute(
//             "UPDATE cus_oder SET inventory_reduced = TRUE WHERE cus_oder_id = ?",
//             [orderId]
//           );

//           inventoryReduced = true;
//         }
//       }

//       // Create a notification for the customer
//       const statusMessage = this.getStatusMessage(status);

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
//           customerId,
//           `Prescription Status Updated`,
//           `Your prescription #${prescriptionId} status has been updated to: ${status}. ${statusMessage}`,
//         ]
//       );

//       // If the status is now confirmed or cancelled, notify the pharmacy staff
//       if (status === "Confirmed" || status === "Cancelled") {
//         const actionType = status === "Confirmed" ? "accepted" : "cancelled";

//         await connection.execute(
//           `
//           INSERT INTO notifications (
//             user_id,
//             user_type,
//             title,
//             message,
//             is_read
//           ) VALUES (?, 'staff', ?, ?, FALSE)
//           `,
//           [
//             1, // Default staff ID for system notifications
//             `Prescription ${
//               actionType.charAt(0).toUpperCase() + actionType.slice(1)
//             }`,
//             `Prescription #${prescriptionId} has been ${actionType} by the customer.`,
//           ]
//         );
//       }

//       await connection.commit();

//       return {
//         success: true,
//         message: `Prescription status updated to ${status}`,
//         oldStatus,
//         newStatus: status,
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

//   /**
//    * Get status message based on status
//    * @param {string} status - Status
//    * @returns {string} Status message
//    */
//   static getStatusMessage(status) {
//     switch (status) {
//       case "Confirmed":
//         return "You have accepted this prescription. We will process your order soon.";
//       case "Cancelled":
//         return "You have cancelled this prescription.";
//       case "Available":
//         return "Your prescription has been verified. The medicines are available for you to order.";
//       case "Not available":
//         return "Unfortunately, some medicines in your prescription are not available at the moment.";
//       case "Delayed":
//         return "There is a delay in processing your prescription. We apologize for the inconvenience.";
//       case "Out for delivery":
//         return "Your medicines are out for delivery and will arrive soon.";
//       case "Ready for pickup":
//         return "Your medicines are ready for pickup at our pharmacy.";
//       default:
//         return "";
//     }
//   }
// }

// module.exports = CustomerPrescriptionModel;

const { db } = require("../../db");

class CustomerPrescriptionModel {
  /**
   * Get products associated with a prescription
   * @param {number} prescriptionId - Prescription ID
   * @param {number} customerId - Customer ID (for security validation)
   * @returns {Promise<Array>} List of prescription products
   */
  // static async getPrescriptionProducts(prescriptionId, customerId) {
  //   try {
  //     // First check if the customer owns the prescription
  //     const [prescriptions] = await db.execute(
  //       `
  //     SELECT prescription_id
  //     FROM prescription
  //     WHERE prescription_id = ? AND customer_id = ?
  //     `,
  //       [prescriptionId, customerId]
  //     );

  //     if (prescriptions.length === 0) {
  //       return {
  //         success: false,
  //         message:
  //           "Prescription not found or you don't have permission to view it",
  //       };
  //     }

  //     // Get order ID associated with the prescription
  //     const [orders] = await db.execute(
  //       `
  //     SELECT cus_oder_id
  //     FROM cus_oder
  //     WHERE prescription_id = ?
  //     `,
  //       [prescriptionId]
  //     );

  //     if (orders.length === 0) {
  //       return {
  //         success: true,
  //         products: [],
  //         message: "No products associated with this prescription yet",
  //       };
  //     }

  //     const orderId = orders[0].cus_oder_id;

  //     // Get products in the order
  //     const [products] = await db.execute(
  //       `
  //     SELECT
  //       cp.product_id as id,
  //       p.pname as name,
  //       cp.quantity,
  //       cp.price,
  //       (cp.quantity * cp.price) as total
  //     FROM
  //       customer_product cp
  //     JOIN
  //       product p ON cp.product_id = p.product_id
  //     WHERE
  //       cp.cus_oder_id = ?
  //     ORDER BY
  //       p.pname
  //     `,
  //       [orderId]
  //     );

  //     return {
  //       success: true,
  //       products,
  //     };
  //   } catch (error) {
  //     console.error("Error in getPrescriptionProducts:", error);
  //     throw error;
  //   }
  // }

  // In getPrescriptionProducts method:
  static async getPrescriptionProducts(prescriptionId, customerId) {
    try {
      // First check if the customer owns the prescription
      const [prescriptions] = await db.execute(
        `SELECT prescription_id FROM prescription 
       WHERE prescription_id = ? AND customer_id = ?`,
        [prescriptionId, customerId]
      );

      if (prescriptions.length === 0) {
        return {
          success: false,
          message:
            "Prescription not found or you don't have permission to view it",
        };
      }

      // Get products directly from prescription_product table
      const [products] = await db.execute(
        `SELECT 
        pp.product_id as id,
        p.pname as name,
        pp.quantity,
        p.price,
        (pp.quantity * p.price) as total
       FROM prescription_product pp
       JOIN product p ON pp.product_id = p.product_id
       WHERE pp.prescription_id = ?
       ORDER BY p.pname`,
        [prescriptionId]
      );

      return {
        success: true,
        products,
      };
    } catch (error) {
      console.error("Error in getPrescriptionProducts:", error);
      throw error;
    }
  }

  /**
   * Get all prescriptions for the logged-in customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} List of prescriptions
   */
  // static async getCustomerPrescriptions(customerId) {
  //   try {
  //     const [prescriptions] = await db.execute(
  //       `
  //       SELECT
  //         p.prescription_id,
  //         p.status,
  //         p.delivery_method,
  //         p.uploaded_at,
  //         p.file_path,
  //         p.expiry_date,
  //         COALESCE(co.value, 0) as value
  //       FROM
  //         prescription p
  //       LEFT JOIN
  //         cus_oder co ON p.prescription_id = co.prescription_id
  //       WHERE
  //         p.customer_id = ?
  //       ORDER BY
  //         p.uploaded_at DESC
  //       `,
  //       [customerId]
  //     );

  //     return prescriptions;
  //   } catch (error) {
  //     console.error("Error in getCustomerPrescriptions:", error);
  //     throw error;
  //   }
  // }

  static async getCustomerPrescriptions(customerId) {
    try {
      const [prescriptions] = await db.execute(
        `SELECT 
        p.prescription_id,
        p.status,
        p.delivery_method,
        p.uploaded_at,
        p.file_path,
        p.expiry_date,
        p.value,
        p.address,
        p.telephone
       FROM prescription p
       WHERE p.customer_id = ?
       ORDER BY p.uploaded_at DESC`,
        [customerId]
      );

      return prescriptions;
    } catch (error) {
      console.error("Error in getCustomerPrescriptions:", error);
      throw error;
    }
  }

  static async getPrescriptionById(prescriptionId, customerId) {
    try {
      const [prescriptions] = await db.execute(
        `
        SELECT 
          p.prescription_id,
          p.status,
          p.delivery_method,
          p.uploaded_at,
          p.file_path,
          p.expiry_date,
          COALESCE(co.value, 0) as value
        FROM 
          prescription p
        LEFT JOIN
          cus_oder co ON p.prescription_id = co.prescription_id
        WHERE 
          p.prescription_id = ?
          AND p.customer_id = ?
        `,
        [prescriptionId, customerId]
      );

      return prescriptions[0] || null;
    } catch (error) {
      console.error("Error in getPrescriptionById:", error);
      throw error;
    }
  }

  /**
   * Update prescription status
   * @param {number} prescriptionId - Prescription ID
   * @param {string} status - New status
   * @param {number} customerId - Customer ID (for security validation)
   * @param {boolean} reduceInventory - Whether to reduce inventory
   * @returns {Promise<Object>} Result of update
   */
  static async updatePrescriptionStatus(
    prescriptionId,
    status,
    customerId,
    reduceInventory
  ) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get the prescription to check if it exists and validate ownership
      const [prescriptions] = await connection.execute(
        "SELECT prescription_id, customer_id, status FROM prescription WHERE prescription_id = ? AND customer_id = ?",
        [prescriptionId, customerId]
      );

      if (prescriptions.length === 0) {
        await connection.rollback();
        return {
          success: false,
          message:
            "Prescription not found or you don't have permission to update it",
        };
      }

      const prescription = prescriptions[0];
      const oldStatus = prescription.status;

      // Don't update if status is the same
      if (oldStatus === status) {
        await connection.rollback();
        return {
          success: true,
          message: "Status unchanged",
        };
      }

      // Only allow customers to update from "Available" to "Confirmed" or "Cancelled"
      if (
        oldStatus !== "Available" &&
        (status === "Confirmed" || status === "Cancelled")
      ) {
        await connection.rollback();
        return {
          success: false,
          message:
            "You can only accept or cancel prescriptions that are available",
        };
      }

      // Update prescription status
      await connection.execute(
        "UPDATE prescription SET status = ? WHERE prescription_id = ?",
        [status, prescriptionId]
      );

      let inventoryReduced = false;

      // If status is "Confirmed" and reduceInventory is true, reduce product quantities from inventory
      if (status === "Confirmed" && reduceInventory) {
        // Get the associated order for this prescription
        const [products] = await connection.execute(
          `SELECT product_id, quantity 
     FROM prescription_product 
     WHERE prescription_id = ?`,
          [prescriptionId]
        );

        // For each product, reduce inventory
        for (const product of products) {
          // Get supplier product batches ordered by expiry date (earliest first)
          const [batches] = await connection.execute(
            `SELECT sup_id, product_id, oder_id, Products_remaining, expired_date 
       FROM supplier_product 
       WHERE product_id = ? AND Products_remaining > 0 
       ORDER BY expired_date ASC`,
            [product.product_id]
          );

          let remainingToReduce = product.quantity;

          // Reduce from each batch until we've reduced the full quantity
          for (const batch of batches) {
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

          // Update product's main quantity
          await connection.execute(
            `UPDATE product 
       SET quantity = GREATEST(0, quantity - ?) 
       WHERE product_id = ?`,
            [product.quantity, product.product_id]
          );
        }

        // Mark that inventory has been reduced for this prescription
        await connection.execute(
          "UPDATE prescription SET inventory_reduced = TRUE WHERE prescription_id = ?",
          [prescriptionId]
        );

        inventoryReduced = true;
      }

      // Create a notification for the customer
      const statusMessage = this.getStatusMessage(status);

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

      // If the status is now confirmed or cancelled, notify the pharmacy staff
      if (status === "Confirmed" || status === "Cancelled") {
        const actionType = status === "Confirmed" ? "accepted" : "cancelled";

        await connection.execute(
          `
          INSERT INTO notifications (
            user_id,
            user_type,
            title,
            message,
            is_read
          ) VALUES (?, 'staff', ?, ?, FALSE)
          `,
          [
            1, // Default staff ID for system notifications
            `Prescription ${
              actionType.charAt(0).toUpperCase() + actionType.slice(1)
            }`,
            `Prescription #${prescriptionId} has been ${actionType} by the customer.`,
          ]
        );
      }

      await connection.commit();

      return {
        success: true,
        message: `Prescription status updated to ${status}`,
        oldStatus,
        newStatus: status,
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

  /**
   * Get status message based on status
   * @param {string} status - Status
   * @returns {string} Status message
   */
  static getStatusMessage(status) {
    switch (status) {
      case "Confirmed":
        return "You have accepted this prescription. We will process your order soon.";
      case "Cancelled":
        return "You have cancelled this prescription.";
      case "Available":
        return "Your prescription has been verified. The medicines are available for you to order.";
      case "Not available":
        return "Unfortunately, some medicines in your prescription are not available at the moment.";
      case "Delayed":
        return "There is a delay in processing your prescription. We apologize for the inconvenience.";
      case "Out for delivery":
        return "Your medicines are out for delivery and will arrive soon.";
      case "Ready for pickup":
        return "Your medicines are ready for pickup at our pharmacy.";
      default:
        return "";
    }
  }
}

module.exports = CustomerPrescriptionModel;
