// routes/landing.routes.js
const express = require("express");
const router = express.Router();
const LandingController = require("../../Controllers/customer/landing.controller");
const { authenticate } = require("../../auth/middleware/auth"); // Adjust path as needed

// Public routes (no authentication required)
router.get("/featured-products", LandingController.getFeaturedProducts);
router.get("/top-selling", LandingController.getTopSellingProducts);
router.get("/categories", LandingController.getCategories);
router.get("/search", LandingController.searchProducts);

// Protected routes (authentication required)
router.post(
  "/upload-prescription",
  authenticate,
  LandingController.uploadPrescription
);

module.exports = router;
