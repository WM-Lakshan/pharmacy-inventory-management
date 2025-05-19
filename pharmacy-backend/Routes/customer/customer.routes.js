// routes/customer.routes.js
const express = require("express");
const router = express.Router();
const customerController = require("../../Controllers/customer/customer.controller");
const { authenticate, authorize } = require("../../auth/middleware/auth");

router.use(authenticate);
router.use(authorize(["customer"]));

// Product routes
router.get("/products", customerController.getAllProducts);
router.get("/products/featured", customerController.getFeaturedProducts);
router.get("/products/top-selling", customerController.getTopSellingProducts);
router.get("/products/search", customerController.searchProducts);
router.get("/products/related/:id", customerController.getRelatedProducts);
router.get("/products/:id", customerController.getProductById);

// Categories routes
router.get("/categories", customerController.getAllCategories);

// Cart routes
router.get("/cart", customerController.getCartItems);
router.post("/cart/add", customerController.addToCart);
router.put("/cart/update-quantity", customerController.updateCartItemQuantity);
router.delete("/cart/remove/:id", customerController.removeCartItem);

// Order routes
router.get("/orders", customerController.getOrders);
router.get("/orders/recent", customerController.getRecentOrders);
router.get("/orders/:id", customerController.getOrderById);
router.post("/checkout", customerController.checkout);
router.post("/checkout/process-payment", customerController.processPayment);

// Prescription routes
router.get("/prescriptions", customerController.getPrescriptions);
router.post("/prescriptions/upload", customerController.uploadPrescription);
router.get("/prescriptions/:id", customerController.getPrescriptionById);

// Profile routes
router.get("/profile", customerController.getProfile);
router.put("/profile", customerController.updateProfile);
router.put("/profile/password", customerController.changePassword);
router.post("/profile/avatar", customerController.uploadAvatar);

// Address routes
router.get("/addresses", customerController.getAddresses);
router.post("/addresses", customerController.addAddress);
// router.put("/addresses/:id", customerController.updateAddress);
// router.delete("/addresses/:id", customerController.deleteAddress);

module.exports = router;
