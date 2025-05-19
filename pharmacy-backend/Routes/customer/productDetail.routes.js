// routes/productDetail.routes.js
const express = require("express");
const router = express.Router();
const ProductDetailController = require("../../Controllers/customer/productDetail.controller");
const { authenticate } = require("../../auth/middleware/auth"); // Adjust path as needed

// Get product details by ID - public route
router.get("/:id", ProductDetailController.getProductById);

// Get related products - public route
router.get("/related/:id", ProductDetailController.getRelatedProducts);

// Add to cart - protected route
router.post("/cart/add", authenticate, ProductDetailController.addToCart);

module.exports = router;
