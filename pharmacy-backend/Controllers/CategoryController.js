// controllers/CategoryController.js
const CategoryModel = require("../models/CategoryModel");

class CategoryController {
  // Get all categories
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryModel.getAllCategories();

      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.error("Error in getAllCategories:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
        error: error.message,
      });
    }
  }

  // Get category by ID
  static async getCategoryById(req, res) {
    try {
      const category = await CategoryModel.getCategoryById(req.params.id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      console.error("Error in getCategoryById:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch category",
        error: error.message,
      });
    }
  }

  // Create new category
  static async createCategory(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const category = await CategoryModel.createCategory({
        name,
        description,
      });

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        category,
      });
    } catch (error) {
      console.error("Error in createCategory:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create category",
        error: error.message,
      });
    }
  }

  // Update category
  static async updateCategory(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const category = await CategoryModel.updateCategory(req.params.id, {
        name,
        description,
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category,
      });
    } catch (error) {
      console.error("Error in updateCategory:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update category",
        error: error.message,
      });
    }
  }

  // Delete category
  static async deleteCategory(req, res) {
    try {
      const success = await CategoryModel.deleteCategory(req.params.id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteCategory:", error);

      // Special handling for products constraint
      if (error.message.includes("Cannot delete category")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete category",
        error: error.message,
      });
    }
  }
}

module.exports = CategoryController;
