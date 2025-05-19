// routes/payment.routes.js
const express = require("express");
const router = express.Router();
const PaymentController = require("../../Controllers/customer/payment.controller");
const { authenticate, authorize } = require("../../auth/middleware/auth");

// Initialize payment for an order
router.post(
  "/orders/:orderId/pay",
  authenticate,
  authorize(["customer"]),
  PaymentController.initializePayment
);

// Handle PayHere notifications (IPN)
router.post("/notify", PaymentController.handlePayHereNotification);

// Get payment status
router.get("/:paymentId", authenticate, PaymentController.getPaymentStatus);

// Get payments for an order
router.get(
  "/orders/:orderId",
  authenticate,
  PaymentController.getPaymentsForOrder
);

// Get customer payment history
router.get(
  "/customers/:customerId?",
  authenticate,
  PaymentController.getCustomerPayments
);

// Process a refund
router.post(
  "/:paymentId/refund",
  authenticate,
  authorize(["manager", "staff"]),
  PaymentController.processRefund
);

// Process cash on delivery payment
router.post(
  "/orders/:orderId/cod",
  authenticate,
  authorize(["customer"]),
  PaymentController.processCashOnDelivery
);

// Mark cash on delivery payment as completed
router.post(
  "/:paymentId/complete-cod",
  authenticate,
  authorize(["manager", "staff"]),
  PaymentController.completeCashOnDelivery
);

module.exports = router;
