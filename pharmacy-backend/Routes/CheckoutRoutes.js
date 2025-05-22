// // // routes/checkout.routes.js
// // const express = require("express");
// // const router = express.Router();
// // const CheckoutController = require("../Controllers/CheckoutController");
// // const { authenticate } = require("../auth/middleware/auth");

// // // Apply authentication middleware to all checkout routes
// // router.use(authenticate);

// // // Cart checkout
// // router.post("/cart", CheckoutController.processCartCheckout);

// // // Prescription checkout
// // router.post("/prescription", CheckoutController.processPrescriptionCheckout);

// // // Single product checkout
// // router.post("/product", CheckoutController.processProductCheckout);

// // module.exports = router;

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

// router.get('/prescription/:id/products', CheckoutController.getPrescriptionProducts);

// module.exports = router;



//////////////////////////////////////working///////////////////////////////////

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

// Add the new endpoint to get prescription products
router.get('/customer-prescriptions/prescriptions/:id/products', CheckoutController.getPrescriptionProducts);

module.exports = router;