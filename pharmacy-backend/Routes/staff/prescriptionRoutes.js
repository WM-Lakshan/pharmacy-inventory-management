// routes/prescriptionRoutes.js
const express = require("express");
const router = express.Router();
const PrescriptionController = require("../../Controllers/staff/prescriptioncontroller");
const { authenticate, authorize } = require("../../auth/middleware/auth");

router.use(authenticate, authorize(["staff"]));

// Routes for staff
router.get(
  "/prescriptions",
  authenticate,
  PrescriptionController.getAllPrescriptions
);

router.get(
  "/prescriptions/:id",
  authenticate,
  PrescriptionController.getPrescriptionById
);

router.put(
  "/prescriptions/:id/status",
  authenticate,
  PrescriptionController.updatePrescriptionStatus
);

router.delete(
  "/prescriptions/:id",
  authenticate,
  PrescriptionController.deletePrescription
);

router.post(
  "/prescriptions/:id/complete",
  authenticate,
  PrescriptionController.completePrescription
);

router.post(
  "/prescriptions/:id/cancel",
  authenticate,
  PrescriptionController.cancelPrescription
);

// Route to check expired prescriptions (can be protected or used by cron job)
// router.post(
//   "/prescriptions/check-expired",
//   authenticate,
//   PrescriptionController.checkExpiredPrescriptions
// );

// // Routes for customers
// router.get(
//   "/customer/prescriptions",
//   authenticate,
//   authorize(["customer"]),
//   PrescriptionController.getMyPrescriptions
// );

// router.get(
//   "/customer/prescriptions/:id",
//   authenticate,
//   authorize(["customer"]),
//   PrescriptionController.getPrescriptionById
// );

// router.post(
//   "/customer/prescriptions/upload",
//   authenticate,
//   authorize(["customer"]),
//   PrescriptionController.uploadPrescription
// );

module.exports = router;
