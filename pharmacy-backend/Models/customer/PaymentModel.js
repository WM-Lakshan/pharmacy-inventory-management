// models/payment.model.js
const { db } = require("../../db");

class PaymentModel {
  /**
   * Create a new payment record
   * @param {object} paymentData - Payment information
   * @returns {Promise<object>} Created payment record
   */
  static async createPayment(paymentData) {
    const {
      cus_oder_id,
      customer_id,
      payment_method,
      amount,
      currency = "LKR",
      status = "pending",
      merchant_reference = null,
      notes = null,
    } = paymentData;

    try {
      const [result] = await db.execute(
        `INSERT INTO payments (
          cus_oder_id,
          customer_id,
          payment_method,
          amount,
          currency,
          status,
          merchant_reference,
          notes,
          payment_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          cus_oder_id,
          customer_id,
          payment_method,
          amount,
          currency,
          status,
          merchant_reference,
          notes,
        ]
      );

      const paymentId = result.insertId;
      return {
        payment_id: paymentId,
        ...paymentData,
        payment_date: new Date(),
      };
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   * @param {number} paymentId - Payment ID
   * @returns {Promise<object>} Payment record
   */
  static async getPaymentById(paymentId) {
    try {
      const [payments] = await db.execute(
        `SELECT 
          p.*,
          c.name as customer_name,
          c.email as customer_email
        FROM 
          payments p
        LEFT JOIN 
          customer c ON p.customer_id = c.customer_id
        WHERE 
          p.payment_id = ?`,
        [paymentId]
      );

      return payments[0] || null;
    } catch (error) {
      console.error("Error fetching payment:", error);
      throw error;
    }
  }

  /**
   * Get payments by order ID
   * @param {number} orderId - Order ID
   * @returns {Promise<Array>} List of payments for order
   */
  static async getPaymentsByOrderId(orderId) {
    try {
      const [payments] = await db.execute(
        `SELECT * FROM payments WHERE cus_oder_id = ? ORDER BY payment_date DESC`,
        [orderId]
      );

      return payments;
    } catch (error) {
      console.error("Error fetching payments for order:", error);
      throw error;
    }
  }

  /**
   * Get payments by customer ID
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} List of payments by customer
   */
  static async getPaymentsByCustomerId(customerId) {
    try {
      const [payments] = await db.execute(
        `SELECT 
          p.*,
          co.oder_status as order_status
        FROM 
          payments p
        JOIN
          cus_oder co ON p.cus_oder_id = co.cus_oder_id
        WHERE 
          p.customer_id = ?
        ORDER BY 
          p.payment_date DESC`,
        [customerId]
      );

      return payments;
    } catch (error) {
      console.error("Error fetching customer payments:", error);
      throw error;
    }
  }

  /**
   * Update payment status and transaction details
   * @param {number} paymentId - Payment ID
   * @param {object} updateData - Updated payment data
   * @returns {Promise<object>} Result of update
   */
  static async updatePayment(paymentId, updateData) {
    const {
      status,
      transaction_id = null,
      payhere_reference = null,
      merchant_id = null,
      notes = null,
    } = updateData;

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Update the payment record
      await connection.execute(
        `UPDATE payments
        SET 
          status = ?,
          transaction_id = COALESCE(?, transaction_id),
          payhere_reference = COALESCE(?, payhere_reference),
          merchant_id = COALESCE(?, merchant_id),
          notes = COALESCE(?, notes)
        WHERE 
          payment_id = ?`,
        [
          status,
          transaction_id,
          payhere_reference,
          merchant_id,
          notes,
          paymentId,
        ]
      );

      // If payment is successful, update the order status
      if (status === "completed") {
        await connection.execute(
          `UPDATE cus_oder
          SET oder_status = 'Processing'
          WHERE cus_oder_id = (
            SELECT cus_oder_id FROM payments WHERE payment_id = ?
          )`,
          [paymentId]
        );

        // Create a notification for the customer
        await connection.execute(
          `INSERT INTO notifications (
            user_id,
            user_type,
            title,
            message,
            is_read
          ) SELECT 
            customer_id,
            'customer',
            'Payment Successful',
            CONCAT('Your payment for order #', cus_oder_id, ' has been successfully processed.'),
            FALSE
          FROM payments
          WHERE payment_id = ?`,
          [paymentId]
        );

        // Create a notification for staff
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
            'New Order Payment',
            CONCAT('Payment for order #', (SELECT cus_oder_id FROM payments WHERE payment_id = ?), ' has been completed.'),
            FALSE
          )`,
          [paymentId]
        );
      }

      // If payment failed, notify the customer
      if (status === "failed") {
        await connection.execute(
          `INSERT INTO notifications (
            user_id,
            user_type,
            title,
            message,
            is_read
          ) SELECT 
            customer_id,
            'customer',
            'Payment Failed',
            CONCAT('Your payment for order #', cus_oder_id, ' has failed. Please try again or use a different payment method.'),
            FALSE
          FROM payments
          WHERE payment_id = ?`,
          [paymentId]
        );
      }

      await connection.commit();

      // Get the updated payment record
      const [payments] = await db.execute(
        `SELECT * FROM payments WHERE payment_id = ?`,
        [paymentId]
      );

      return {
        success: true,
        payment: payments[0],
        message: `Payment status updated to ${status}`,
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error updating payment:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Generate PayHere payment hash
   * @param {object} params - Parameters for hash generation
   * @returns {string} MD5 hash for PayHere
   */
  static generatePayHereHash(params) {
    const crypto = require("crypto");
    const { merchantId, merchantSecret, orderId, amount, currency } = params;

    // Generate hash according to PayHere docs
    const stringToHash = `${merchantId}${orderId}${amount}${currency}${merchantSecret}`;
    return crypto
      .createHash("md5")
      .update(stringToHash)
      .digest("hex")
      .toUpperCase();
  }

  /**
   * Validate PayHere notification
   * @param {object} notification - PayHere notification data
   * @returns {boolean} True if notification is valid
   */
  static validatePayHereNotification(notification) {
    try {
      const crypto = require("crypto");
      const {
        merchant_id,
        order_id,
        payment_id,
        payhere_amount,
        payhere_currency,
        status_code,
        md5sig,
      } = notification;

      // Get merchant secret from environment variables
      const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

      // Calculate MD5 hash
      const stringToHash = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${payment_id}${merchantSecret.toUpperCase()}`;
      const calculatedHash = crypto
        .createHash("md5")
        .update(stringToHash)
        .digest("hex")
        .toUpperCase();

      // Compare calculated hash with received hash
      return calculatedHash === md5sig;
    } catch (error) {
      console.error("Error validating PayHere notification:", error);
      return false;
    }
  }

  /**
   * Process refund
   * @param {number} paymentId - Payment ID to refund
   * @param {number} amount - Amount to refund
   * @param {string} reason - Reason for refund
   * @returns {Promise<object>} Refund result
   */
  static async processRefund(paymentId, amount, reason) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get payment details
      const [payments] = await connection.execute(
        `SELECT * FROM payments WHERE payment_id = ?`,
        [paymentId]
      );

      if (payments.length === 0) {
        await connection.rollback();
        return {
          success: false,
          message: "Payment not found",
        };
      }

      const payment = payments[0];

      // Validate refund amount
      if (amount > payment.amount) {
        await connection.rollback();
        return {
          success: false,
          message: "Refund amount cannot exceed original payment amount",
        };
      }

      // If payment is already refunded
      if (payment.status === "refunded") {
        await connection.rollback();
        return {
          success: false,
          message: "Payment already refunded",
        };
      }

      // Update payment status
      await connection.execute(
        `UPDATE payments
        SET 
          status = 'refunded',
          notes = CONCAT(COALESCE(notes, ''), '\nRefund reason: ', ?)
        WHERE 
          payment_id = ?`,
        [reason, paymentId]
      );

      // Create a notification for the customer
      await connection.execute(
        `INSERT INTO notifications (
          user_id,
          user_type,
          title,
          message,
          is_read
        ) SELECT 
          customer_id,
          'customer',
          'Payment Refunded',
          CONCAT('Your payment for order #', cus_oder_id, ' has been refunded. Amount: Rs.', ?),
          FALSE
        FROM payments
        WHERE payment_id = ?`,
        [amount, paymentId]
      );

      await connection.commit();
      return {
        success: true,
        message: "Payment refunded successfully",
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error processing refund:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = PaymentModel;
