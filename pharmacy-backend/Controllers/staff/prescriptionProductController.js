// controllers/staff/prescriptionProduct.controller.js
const PrescriptionProductModel = require("../../Models/staff/prescriptionProductModel");

class PrescriptionProductController {
  /**
   * Get products associated with a prescription
   */
  // static async getProductsByPrescriptionId(req, res) {
  //   try {
  //     const { prescriptionId } = req.params;

  //     // Validate prescriptionId
  //     if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid prescription ID",
  //       });
  //     }

  //     // Get prescription details to verify it exists
  //     const prescription =
  //       await PrescriptionProductModel.getPrescriptionDetails(prescriptionId);

  //     if (!prescription) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Prescription not found",
  //       });
  //     }

  //     // Get products
  //     const products =
  //       await PrescriptionProductModel.getProductsByPrescriptionId(
  //         prescriptionId
  //       );

  //     res.status(200).json({
  //       success: true,
  //       prescription,
  //       products,
  //     });
  //   } catch (error) {
  //     console.error("Error in getProductsByPrescriptionId controller:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "An error occurred while fetching prescription products",
  //       error: error.message,
  //     });
  //   }
  // }

  static async getProductsByPrescriptionId(req, res) {
    try {
      const { prescriptionId } = req.params;

      // Validate prescriptionId
      if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid prescription ID",
        });
      }

      // Get prescription details to verify it exists
      const prescription =
        await PrescriptionProductModel.getPrescriptionDetails(prescriptionId);

      if (!prescription) {
        return res.status(404).json({
          success: false,
          message: "Prescription not found",
        });
      }

      // Get products
      const products =
        await PrescriptionProductModel.getProductsByPrescriptionId(
          prescriptionId
        );

      console.log(
        `Found ${products.length} products for prescription ${prescriptionId}`
      );

      res.status(200).json({
        success: true,
        prescription,
        products,
      });
    } catch (error) {
      console.error("Error in getProductsByPrescriptionId controller:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching prescription products",
        error: error.message,
      });
    }
  }

  /**
   * Get prescription by ID
   */
  static async getPrescriptionById(req, res) {
    try {
      const { prescriptionId } = req.params;

      // Validate prescriptionId
      if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid prescription ID",
        });
      }

      // Get prescription details
      const prescription =
        await PrescriptionProductModel.getPrescriptionDetails(prescriptionId);

      if (!prescription) {
        return res.status(404).json({
          success: false,
          message: "Prescription not found",
        });
      }

      res.status(200).json({
        success: true,
        prescription,
      });
    } catch (error) {
      console.error("Error in getPrescriptionById controller:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching prescription details",
        error: error.message,
      });
    }
  }

  /**
   * Search products by name
   */
  static async searchProducts(req, res) {
    try {
      const { query } = req.query;
      const limit = parseInt(req.query.limit) || 10;

      // If no query provided, return empty array
      if (!query || query.trim() === "") {
        return res.status(200).json({
          success: true,
          products: [],
        });
      }

      const products = await PrescriptionProductModel.searchProducts(
        query,
        limit
      );

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Error in searchProducts controller:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while searching products",
        error: error.message,
      });
    }
  }

  /**
   * Add product to prescription
   */
  static async addProductToPrescription(req, res) {
    try {
      const { prescriptionId } = req.params;
      const { productId, quantity, price } = req.body;

      // Validate inputs
      if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid prescription ID",
        });
      }

      if (!productId || isNaN(parseInt(productId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      if (!quantity || isNaN(parseInt(quantity)) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity. Must be a positive number.",
        });
      }

      // Add product to prescription
      const result = await PrescriptionProductModel.addProductToPrescription(
        prescriptionId,
        productId,
        quantity,
        price
      );

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in addProductToPrescription controller:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while adding product to prescription",
        error: error.message,
      });
    }
  }
  /**
   * Update product quantity
   */
  static async updateProductQuantity(req, res) {
    try {
      const { prescriptionId, productId } = req.params;
      const { quantity } = req.body;

      // Validate inputs
      if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid prescription ID",
        });
      }

      if (!productId || isNaN(parseInt(productId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      if (!quantity || isNaN(parseInt(quantity)) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity. Must be a positive number.",
        });
      }

      // Update product quantity
      const result = await PrescriptionProductModel.updateProductQuantity(
        prescriptionId,
        productId,
        quantity
      );

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in updateProductQuantity controller:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating product quantity",
        error: error.message,
      });
    }
  }

  /**
   * Remove product from prescription
   */
  static async removeProductFromPrescription(req, res) {
    try {
      const { prescriptionId, productId } = req.params;

      // Validate inputs
      if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid prescription ID",
        });
      }

      if (!productId || isNaN(parseInt(productId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      // Remove product from prescription
      const result =
        await PrescriptionProductModel.removeProductFromPrescription(
          prescriptionId,
          productId
        );

      res.status(200).json(result);
    } catch (error) {
      console.error(
        "Error in removeProductFromPrescription controller:",
        error
      );
      res.status(500).json({
        success: false,
        message: "An error occurred while removing product from prescription",
        error: error.message,
      });
    }
  }

  /**
   * Update prescription status
   */
  //   static async updatePrescriptionStatus(req, res) {
  //     try {
  //       const { prescriptionId } = req.params;
  //       const { status } = req.body;

  //       // Validate inputs
  //       if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Invalid prescription ID",
  //         });
  //       }

  //       if (!status || typeof status !== "string") {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Invalid status",
  //         });
  //       }

  //       // Validate status value
  //       const validStatuses = [
  //         "Pending",
  //         "Confirmed",
  //         "Available",
  //         "Not available",
  //         "Delayed",
  //         "Out for delivery",
  //         "Ready for pickup",
  //         "Completed",
  //         "Expired",
  //       ];

  //       if (!validStatuses.includes(status)) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Invalid status value",
  //           validValues: validStatuses,
  //         });
  //       }

  //       // Update prescription status
  //       const result = await PrescriptionProductModel.updatePrescriptionStatus(
  //         prescriptionId,
  //         status
  //       );

  //       res.status(200).json(result);
  //     } catch (error) {
  //       console.error("Error in updatePrescriptionStatus controller:", error);
  //       res.status(500).json({
  //         success: false,
  //         message: "An error occurred while updating prescription status",
  //         error: error.message,
  //       });
  //     }
  //   }

  /////////////////////////////corrected code/////////////////////////////////////

  // static async updatePrescriptionStatus(req, res) {
  //   try {
  //     const { prescriptionId } = req.params;
  //     const { status, reduceInventory = false } = req.body;

  //     // Validate inputs
  //     if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid prescription ID",
  //       });
  //     }

  //     if (!status || typeof status !== "string") {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid status",
  //       });
  //     }

  //     // Validate status value
  //     const validStatuses = [
  //       "Pending",
  //       "Confirmed",
  //       "Available",
  //       "Not available",
  //       "Delayed",
  //       "Out for delivery",
  //       "Ready for pickup",
  //       "Completed",
  //       "Expired",
  //     ];

  //     if (!validStatuses.includes(status)) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid status value",
  //         validValues: validStatuses,
  //       });
  //     }

  //     // Check if status is "Confirmed" - only customers can set this
  //     if (status === "Confirmed" && req.user.role !== "customer") {
  //       return res.status(403).json({
  //         success: false,
  //         message: "Only customers can confirm a prescription",
  //       });
  //     }

  //     // Update prescription status
  //     const result = await PrescriptionProductModel.updatePrescriptionStatus(
  //       prescriptionId,
  //       status,
  //       reduceInventory
  //     );

  //     res.status(200).json(result);
  //   } catch (error) {
  //     console.error("Error in updatePrescriptionStatus controller:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "An error occurred while updating prescription status",
  //       error: error.message,
  //     });
  //   }
  // }

  /////////////////////////correct Final////////////////////

  static async updatePrescriptionStatus(req, res) {
    try {
      const { prescriptionId } = req.params;
      const { status, reduceInventory = false } = req.body;
      const staffId = req.user.id;

      // Validate inputs
      if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid prescription ID",
        });
      }

      if (!status || typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      // Validate status value
      const validStatuses = [
        "Pending",
        "Confirmed",
        "Available",
        "Not available",
        "Delayed",
        "Out for delivery",
        "Ready for pickup",
        "Completed",
        "Expired",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value",
          validValues: validStatuses,
        });
      }

      // Check if status is "Confirmed" - only customers can set this
      if (status === "Confirmed" && req.user.role !== "customer") {
        return res.status(403).json({
          success: false,
          message: "Only customers can confirm a prescription",
        });
      }

      // Update prescription status
      const result = await PrescriptionProductModel.updatePrescriptionStatus(
        prescriptionId,
        status,
        reduceInventory,
        staffId
      );

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in updatePrescriptionStatus controller:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating prescription status",
        error: error.message,
      });
    }
  }
}

module.exports = PrescriptionProductController;
