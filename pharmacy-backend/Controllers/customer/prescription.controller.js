// controllers/customer/prescriptionController.js
const CustomerPrescriptionModel = require("../../Models/customer/prescription.model.js");

class CustomerPrescriptionController {
  /**
   * Get all prescriptions for the authenticated customer
   */
  /**
   * Get products for a prescription
   */
  static async getPrescriptionProducts(req, res) {
    try {
      const prescriptionId = req.params.id;
      const customerId = req.user.id;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const result = await CustomerPrescriptionModel.getPrescriptionProducts(
        prescriptionId,
        customerId
      );

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in getPrescriptionProducts controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch prescription products",
        error: error.message,
      });
    }
  }

  static async getCustomerPrescriptions(req, res) {
    try {
      // Get customer ID from authenticated user
      const customerId = req.user.id;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const prescriptions =
        await CustomerPrescriptionModel.getCustomerPrescriptions(customerId);

      // Format dates and other display values
      // const formattedPrescriptions = prescriptions.map((prescription) => ({
      //   prescription_id: prescription.prescription_id,
      //   status: prescription.status,
      //   delivery_method: prescription.delivery_method,
      //   value: `Rs.${prescription.value}`,
      //   uploaded_at: new Date(prescription.uploaded_at).toLocaleDateString(),
      //   expiry_date: prescription.expiry_date
      //     ? new Date(prescription.expiry_date).toLocaleDateString()
      //     : null,
      //   file_path: prescription.file_path,
      // }));

      //////correct one////////

      const formattedPrescriptions = prescriptions.map((prescription) => ({
        prescription_id: prescription.prescription_id,
        status: prescription.status,
        delivery_method: prescription.delivery_method,
        value: `Rs.${prescription.value || 0}`,
        uploaded_at: new Date(prescription.uploaded_at).toLocaleDateString(),
        expiry_date: prescription.expiry_date
          ? new Date(prescription.expiry_date).toLocaleDateString()
          : null,
        file_path: prescription.file_path,
        address: prescription.address,
        telephone: prescription.telephone,
      }));

      res.status(200).json({
        success: true,
        prescriptions: formattedPrescriptions,
      });
    } catch (error) {
      console.error("Error in getCustomerPrescriptions controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch prescriptions",
        error: error.message,
      });
    }
  }

  /**
   * Get a single prescription by ID
   */
  static async getPrescriptionById(req, res) {
    try {
      const prescriptionId = req.params.id;
      const customerId = req.user.id;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const prescription = await CustomerPrescriptionModel.getPrescriptionById(
        prescriptionId,
        customerId
      );

      if (!prescription) {
        return res.status(404).json({
          success: false,
          message:
            "Prescription not found or you don't have permission to view it",
        });
      }

      // Format dates and other display values
      const formattedPrescription = {
        prescription_id: prescription.prescription_id,
        status: prescription.status,
        delivery_method: prescription.delivery_method,
        value: `Rs.${prescription.value}`,
        uploaded_at: new Date(prescription.uploaded_at).toLocaleDateString(),
        expiry_date: prescription.expiry_date
          ? new Date(prescription.expiry_date).toLocaleDateString()
          : null,
        file_path: prescription.file_path,
      };

      res.status(200).json({
        success: true,
        prescription: formattedPrescription,
      });
    } catch (error) {
      console.error("Error in getPrescriptionById controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch prescription details",
        error: error.message,
      });
    }
  }

  /**
   * Update prescription status (customer can only accept or cancel)
   */
  static async updatePrescriptionStatus(req, res) {
    try {
      const prescriptionId = req.params.id;
      const customerId = req.user.id;
      const { status, reduceInventory = false } = req.body;

      // Validation
      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      // Customers can only update to "Confirmed" or "Cancelled"
      if (status !== "Confirmed" && status !== "Cancelled") {
        return res.status(403).json({
          success: false,
          message: "Customers can only confirm or cancel prescriptions",
        });
      }

      const result = await CustomerPrescriptionModel.updatePrescriptionStatus(
        prescriptionId,
        status,
        customerId,
        reduceInventory
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in updatePrescriptionStatus controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update prescription status",
        error: error.message,
      });
    }
  }
}

module.exports = CustomerPrescriptionController;
