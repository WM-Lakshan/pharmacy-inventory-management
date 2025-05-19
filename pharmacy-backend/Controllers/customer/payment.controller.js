// controllers/payment.controller.js
const PaymentModel = require("../../Models/customer/PaymentModel");
const OrderModel = require("../../Models/customer/order.model");

class PaymentController {
  /**
   * Initialize PayHere payment for an order
   */
  static async initializePayment(req, res) {
    try {
      const { orderId } = req.params;
      const customerId = req.user.id;

      // Validate order belongs to customer
      const order = await OrderModel.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (order.customer_id !== customerId) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to pay for this order",
        });
      }

      // Check if order already paid
      const existingPayments = await PaymentModel.getPaymentsByOrderId(orderId);
      const completedPayment = existingPayments.find(
        (p) => p.status === "completed"
      );

      if (completedPayment) {
        return res.status(400).json({
          success: false,
          message: "This order has already been paid",
        });
      }

      // Create a payment record
      const paymentData = {
        cus_oder_id: orderId,
        customer_id: customerId,
        payment_method: "PayHere",
        amount: order.value,
        status: "pending",
      };

      const payment = await PaymentModel.createPayment(paymentData);

      // Generate PayHere hash for payment
      const merchantId = process.env.PAYHERE_MERCHANT_ID;
      const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

      const hash = PaymentModel.generatePayHereHash({
        merchantId,
        merchantSecret,
        orderId: orderId,
        amount: order.value,
        currency: "LKR",
      });

      // Return payment details and PayHere parameters
      res.status(200).json({
        success: true,
        payment: payment,
        payhere: {
          merchant_id: merchantId,
          return_url: `${process.env.FRONTEND_URL}/payment/complete`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
          notify_url: `${process.env.API_URL}/api/payments/notify`,
          order_id: orderId,
          items: "Order #" + orderId,
          amount: order.value.toFixed(2),
          currency: "LKR",
          hash: hash,
          first_name: req.user.firstName || req.user.name.split(" ")[0],
          last_name: req.user.lastName || req.user.name.split(" ")[1] || "",
          email: req.user.email,
          phone: req.user.phone || "",
          address: req.user.address || "",
          city: "",
          country: "Sri Lanka",
          delivery_address: order.delivery_address || "",
          delivery_city: "",
          delivery_country: "Sri Lanka",
        },
      });
    } catch (error) {
      console.error("Error initializing payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to initialize payment",
        error: error.message,
      });
    }
  }

  /**
   * Handle PayHere notification (IPN)
   */
  static async handlePayHereNotification(req, res) {
    try {
      const notification = req.body;

      // Log the full notification for debugging
      console.log("PayHere notification received:", notification);

      // Validate notification signature
      const isValid = PaymentModel.validatePayHereNotification(notification);

      if (!isValid) {
        console.error("Invalid PayHere notification signature");
        return res.status(400).json({
          success: false,
          message: "Invalid notification signature",
        });
      }

      // Extract PayHere details
      const {
        merchant_id,
        order_id,
        payment_id: payhere_payment_id,
        payhere_amount,
        payhere_currency,
        status_code,
        status_message,
      } = notification;

      // Map PayHere status to our status
      let paymentStatus;
      if (status_code === "2") {
        paymentStatus = "completed";
      } else if (status_code === "0") {
        paymentStatus = "pending";
      } else {
        paymentStatus = "failed";
      }

      // Find our payment record for this order
      const payments = await PaymentModel.getPaymentsByOrderId(order_id);
      if (payments.length === 0) {
        console.error("No payment record found for order:", order_id);
        return res.status(404).json({
          success: false,
          message: "Payment record not found",
        });
      }

      // Update the most recent pending payment
      const pendingPayment = payments.find((p) => p.status === "pending");
      if (!pendingPayment) {
        console.error("No pending payment found for order:", order_id);
        return res.status(400).json({
          success: false,
          message: "No pending payment found",
        });
      }

      // Update payment with PayHere details
      const updateData = {
        status: paymentStatus,
        transaction_id: payhere_payment_id,
        payhere_reference: payment_id,
        merchant_id: merchant_id,
        notes: status_message,
      };

      await PaymentModel.updatePayment(pendingPayment.payment_id, updateData);

      // Return success response to PayHere
      res.status(200).send("OK");
    } catch (error) {
      console.error("Error handling PayHere notification:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process payment notification",
        error: error.message,
      });
    }
  }

  /**
   * Get payment status and details
   */
  static async getPaymentStatus(req, res) {
    try {
      const { paymentId } = req.params;

      const payment = await PaymentModel.getPaymentById(paymentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      // Check if user has permission to view this payment
      if (
        req.user.role !== "manager" &&
        req.user.role !== "staff" &&
        payment.customer_id !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to view this payment",
        });
      }

      res.status(200).json({
        success: true,
        payment: payment,
      });
    } catch (error) {
      console.error("Error getting payment status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get payment status",
        error: error.message,
      });
    }
  }

  /**
   * Get payments for an order
   */
  static async getPaymentsForOrder(req, res) {
    try {
      const { orderId } = req.params;
      const customerId = req.user.id;

      // Check if the order belongs to this customer (if not staff/manager)
      if (req.user.role !== "manager" && req.user.role !== "staff") {
        const order = await OrderModel.getOrderById(orderId);
        if (!order || order.customer_id !== customerId) {
          return res.status(403).json({
            success: false,
            message:
              "You don't have permission to view payments for this order",
          });
        }
      }

      const payments = await PaymentModel.getPaymentsByOrderId(orderId);

      res.status(200).json({
        success: true,
        payments: payments,
      });
    } catch (error) {
      console.error("Error getting order payments:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get order payments",
        error: error.message,
      });
    }
  }

  /**
   * Get customer payment history
   */
  static async getCustomerPayments(req, res) {
    try {
      const customerId = req.params.customerId || req.user.id;

      // Only allow staff/managers to view other customers' payments
      if (
        customerId !== req.user.id &&
        req.user.role !== "manager" &&
        req.user.role !== "staff"
      ) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to view this customer's payments",
        });
      }

      const payments = await PaymentModel.getPaymentsByCustomerId(customerId);

      res.status(200).json({
        success: true,
        payments: payments,
      });
    } catch (error) {
      console.error("Error getting customer payments:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get payment history",
        error: error.message,
      });
    }
  }

  /**
   * Process a refund
   */
  static async processRefund(req, res) {
    try {
      // Only staff and managers can process refunds
      if (req.user.role !== "manager" && req.user.role !== "staff") {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to process refunds",
        });
      }

      const { paymentId } = req.params;
      const { amount, reason } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid refund amount",
        });
      }

      if (!reason) {
        return res.status(400).json({
          success: false,
          message: "Refund reason is required",
        });
      }

      const result = await PaymentModel.processRefund(
        paymentId,
        amount,
        reason
      );

      res.status(200).json(result);
    } catch (error) {
      console.error("Error processing refund:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process refund",
        error: error.message,
      });
    }
  }

  /**
   * Process cash on delivery payment
   */
  static async processCashOnDelivery(req, res) {
    try {
      const { orderId } = req.params;
      const customerId = req.user.id;

      // Validate order belongs to customer
      const order = await OrderModel.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Only customers can place their own COD orders
      if (order.customer_id !== customerId) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to place this order",
        });
      }

      // Check if order already paid
      const existingPayments = await PaymentModel.getPaymentsByOrderId(orderId);
      const completedPayment = existingPayments.find(
        (p) => p.status === "completed"
      );

      if (completedPayment) {
        return res.status(400).json({
          success: false,
          message: "This order has already been paid",
        });
      }

      // Create a payment record for COD
      const paymentData = {
        cus_oder_id: orderId,
        customer_id: customerId,
        payment_method: "CashOnDelivery",
        amount: order.value,
        status: "pending",
        notes: "Cash on delivery payment",
      };

      const payment = await PaymentModel.createPayment(paymentData);

      // Update order status to "Processing"
      await OrderModel.updateOrderStatus(orderId, "Processing");

      res.status(200).json({
        success: true,
        message: "Cash on delivery order placed successfully",
        payment: payment,
      });
    } catch (error) {
      console.error("Error processing COD payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to place COD order",
        error: error.message,
      });
    }
  }

  /**
   * Mark cash on delivery payment as completed
   */
  static async completeCashOnDelivery(req, res) {
    try {
      // Only staff and managers can mark COD as complete
      if (req.user.role !== "manager" && req.user.role !== "staff") {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to complete this payment",
        });
      }

      const { paymentId } = req.params;

      // Get payment details
      const payment = await PaymentModel.getPaymentById(paymentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      if (payment.payment_method !== "CashOnDelivery") {
        return res.status(400).json({
          success: false,
          message: "This is not a cash on delivery payment",
        });
      }

      if (payment.status === "completed") {
        return res.status(400).json({
          success: false,
          message: "This payment is already completed",
        });
      }

      // Update payment status
      const updateData = {
        status: "completed",
        notes: "Cash received on delivery",
      };

      const result = await PaymentModel.updatePayment(paymentId, updateData);

      res.status(200).json({
        success: true,
        message: "Cash on delivery payment marked as completed",
        payment: result.payment,
      });
    } catch (error) {
      console.error("Error completing COD payment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to complete payment",
        error: error.message,
      });
    }
  }
}

module.exports = PaymentController;
