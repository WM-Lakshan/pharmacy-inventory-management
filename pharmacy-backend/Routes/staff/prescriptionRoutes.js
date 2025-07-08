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



module.exports = router;
