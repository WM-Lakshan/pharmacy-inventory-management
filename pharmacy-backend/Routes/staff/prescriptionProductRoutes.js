// routes/prescriptionProduct.routes.js
const express = require("express");
const router = express.Router();
const PrescriptionProductController = require("../../Controllers/staff/prescriptionProductController");
const { authenticate, authorize } = require("../../auth/middleware/auth");

router.use(authenticate, authorize(["staff"]));

// Get products associated with a prescription
router.get(
  "/prescriptions/:prescriptionId/products",
  PrescriptionProductController.getProductsByPrescriptionId
);

// Get prescription by ID
router.get(
  "/prescriptions/:prescriptionId",
  PrescriptionProductController.getPrescriptionById
);

// Search products
router.get("/products/search", PrescriptionProductController.searchProducts);

// Add product to prescription
router.post(
  "/prescriptions/:prescriptionId/products",
  PrescriptionProductController.addProductToPrescription
);

// Update product quantity
router.put(
  "/prescriptions/:prescriptionId/products/:productId",
  PrescriptionProductController.updateProductQuantity
);

// Remove product from prescription
router.delete(
  "/prescriptions/:prescriptionId/products/:productId",
  PrescriptionProductController.removeProductFromPrescription
);

// Update prescription status
router.put(
  "/prescriptions/:prescriptionId/status",
  PrescriptionProductController.updatePrescriptionStatus
);

module.exports = router;
