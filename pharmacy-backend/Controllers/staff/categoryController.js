// controllers/categoryController.js
const Category = require("../../Models/staff/categoryModel");

class CategoryController {
  /**
   * Get all categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryModel.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error in getAllCategories controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve categories",
        error: error.message,
      });
    }
  }

  /**
   * Get a single category by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getCategoryById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const category = await CategoryModel.getCategoryById(parseInt(id));

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json(category);
    } catch (error) {
      console.error("Error in getCategoryById controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve category",
        error: error.message,
      });
    }
  }

  /**
   * Create a new category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createCategory(req, res) {
    try {
      const { name, description } = req.body;

      // Validate input
      if (!name || name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      // Create category
      const newCategory = await CategoryModel.createCategory({
        name,
        description: description || "",
      });

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        category: newCategory,
      });
    } catch (error) {
      console.error("Error in createCategory controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create category",
        error: error.message,
      });
    }
  }

  /**
   * Update an existing category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      // Validate input
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      if (!name || name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      // Check if category exists
      const existingCategory = await CategoryModel.getCategoryById(
        parseInt(id)
      );
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // Update category
      const updatedCategory = await CategoryModel.updateCategory(parseInt(id), {
        name,
        description: description || "",
      });

      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category: updatedCategory,
      });
    } catch (error) {
      console.error("Error in updateCategory controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update category",
        error: error.message,
      });
    }
  }

  /**
   * Delete a category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      // Validate input
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      try {
        const result = await CategoryModel.deleteCategory(parseInt(id));

        if (result) {
          res.status(200).json({
            success: true,
            message: "Category deleted successfully",
          });
        } else {
          res.status(404).json({
            success: false,
            message: "Category not found",
          });
        }
      } catch (deleteError) {
        // Handle specific errors
        if (deleteError.message.includes("associated products")) {
          return res.status(400).json({
            success: false,
            message:
              "Cannot delete category that has products. Remove all associated products first.",
          });
        }
        throw deleteError;
      }
    } catch (error) {
      console.error("Error in deleteCategory controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete category",
        error: error.message,
      });
    }
  }
}

module.exports = CategoryController;
