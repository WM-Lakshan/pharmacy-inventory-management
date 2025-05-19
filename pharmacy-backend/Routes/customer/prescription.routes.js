// routes/customer/prescriptionRoutes.js
const express = require("express");
const router = express.Router();
const CustomerPrescriptionController = require("../../Controllers/customer/prescription.controller.js");
const { authenticate, authorize } = require("../../auth/middleware/auth");

// Apply authentication and customer role authorization to all routes
router.use(authenticate);
router.use(authorize(["customer"]));

// Get all prescriptions for the logged-in customer
router.get(
  "/prescriptions",
  CustomerPrescriptionController.getCustomerPrescriptions
);

// Get a single prescription by ID
router.get(
  "/prescriptions/:id",
  CustomerPrescriptionController.getPrescriptionById
);

// Update prescription status (customers can only accept or cancel)
router.put(
  "/prescriptions/:id/status",
  CustomerPrescriptionController.updatePrescriptionStatus
);

// Route for getting products in a prescription
router.get(
  "/prescriptions/:id/products",
  authenticate,
  CustomerPrescriptionController.getPrescriptionProducts
);

module.exports = router;
