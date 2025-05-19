const StaffModel = require("../Models/StaffModel");
const cloudinary = require("../utils/cloudinaryConfig");

class StaffController {
  static async getAllStaff(req, res) {
    try {
      const staff = await StaffModel.getAllStaff();
      res.status(200).json({
        success: true,
        staff,
      });
    } catch (error) {
      console.error("Error in getAllStaff:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch staff members",
        error: error.message,
      });
    }
  }

  static async getStaffById(req, res) {
    try {
      const { id } = req.params;
      const staff = await StaffModel.getStaffById(id);

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff member not found",
        });
      }

      res.status(200).json({
        success: true,
        staff,
      });
    } catch (error) {
      console.error(`Error in getStaffById with ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch staff member details",
        error: error.message,
      });
    }
  }

  static async createStaff(req, res) {
    try {
      let imageUrl = null;

      // Handle image upload if present
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "pharmacy/staff",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
      }

      const staffData = {
        ...req.body,
        image: imageUrl,
      };

      const id = await StaffModel.createStaff(staffData);

      res.status(201).json({
        success: true,
        message: "Staff member created successfully",
        staffId: id,
      });
    } catch (error) {
      console.error("Error in createStaff:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process staff member data",
        error: error.message,
      });
    }
  }

  static async updateStaff(req, res) {
    try {
      const { id } = req.params;
      let imageUrl = req.body.currentImage || null;

      // Handle image upload if present
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "pharmacy/staff",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
      }

      const staffData = {
        ...req.body,
        image: imageUrl,
      };

      const success = await StaffModel.updateStaff(id, staffData);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Staff member not found or no changes made",
        });
      }

      res.status(200).json({
        success: true,
        message: "Staff member updated successfully",
      });
    } catch (error) {
      console.error(`Error in updateStaff with ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to update staff member",
        error: error.message,
      });
    }
  }

  static async deleteStaff(req, res) {
    try {
      const { id } = req.params;
      const success = await StaffModel.deleteStaff(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Staff member not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Staff member deleted successfully",
      });
    } catch (error) {
      console.error(`Error in deleteStaff with ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to delete staff member",
        error: error.message,
      });
    }
  }
}

module.exports = StaffController;
