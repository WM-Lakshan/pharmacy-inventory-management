const express = require("express");
const router = express.Router();
const ProductController = require("../../Controllers/customer/product.controller");
const { authenticate } = require("../../auth/middleware/auth"); // Adjust path as needed

// Public routes (no authentication required)
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);

// Protected routes (authentication required)
router.post("/cart/add", authenticate, ProductController.addToCart);

module.exports = router;
