// // routes/checkout.routes.js
// const express = require("express");
// const router = express.Router();
// const CheckoutController = require("../Controllers/CheckoutController");
// const { authenticate } = require("../auth/middleware/auth");

// // Apply authentication middleware to all checkout routes
// router.use(authenticate);

// // Cart checkout
// router.post("/cart", CheckoutController.processCartCheckout);

// // Prescription checkout
// router.post("/prescription", CheckoutController.processPrescriptionCheckout);

// // Single product checkout
// router.post("/product", CheckoutController.processProductCheckout);

// module.exports = router;

const express = require("express");
const router = express.Router();
const CheckoutController = require("../Controllers/CheckoutController");
const { authenticate } = require("../auth/middleware/auth");

// Apply authentication middleware to all checkout routes
router.use(authenticate);

// Cart checkout
router.post("/cart", CheckoutController.processCartCheckout);

// Prescription checkout
router.post("/prescription", CheckoutController.processPrescriptionCheckout);

// Single product checkout
router.post("/product", CheckoutController.processProductCheckout);

module.exports = router;
