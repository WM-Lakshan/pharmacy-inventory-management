const { db } = require("../../db");

class CategoryModel {
  /**
   * Get all categories
   * @returns {Promise<Array>} Array of categories
   */
  static async getAllCategories() {
    try {
      const [categories] = await db.execute(`
        SELECT 
          product_cato_id as id, 
          name, 
          description 
        FROM 
          product_cato 
        ORDER BY 
          name ASC
      `);

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  /**
   * Get a single category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Object|null>} Category object or null if not found
   */
  static async getCategoryById(id) {
    try {
      const [categories] = await db.execute(
        `
        SELECT 
          product_cato_id as id, 
          name, 
          description 
        FROM 
          product_cato 
        WHERE 
          product_cato_id = ?
      `,
        [id]
      );

      return categories.length > 0 ? categories[0] : null;
    } catch (error) {
      console.error(`Error fetching category with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new category
   * @param {Object} category - Category data {name, description}
   * @returns {Promise<Object>} Created category with ID
   */
  static async createCategory(category) {
    try {
      const { name, description } = category;

      const [result] = await db.execute(
        `
        INSERT INTO product_cato (name, description) 
        VALUES (?, ?)
      `,
        [name, description]
      );

      const newCategoryId = result.insertId;

      return {
        id: newCategoryId,
        name,
        description,
      };
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  /**
   * Update an existing category
   * @param {number} id - Category ID
   * @param {Object} category - Updated category data {name, description}
   * @returns {Promise<Object>} Updated category
   */
  static async updateCategory(id, category) {
    try {
      const { name, description } = category;

      await db.execute(
        `
        UPDATE product_cato 
        SET 
          name = ?, 
          description = ? 
        WHERE 
          product_cato_id = ?
      `,
        [name, description, id]
      );

      // Fetch and return the updated category
      return await this.getCategoryById(id);
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a category
   * @param {number} id - Category ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  static async deleteCategory(id) {
    try {
      // Check if category exists
      const category = await this.getCategoryById(id);
      if (!category) {
        return false;
      }

      // Check if products are associated with this category
      const [products] = await db.execute(
        `
        SELECT COUNT(*) as count 
        FROM product 
        WHERE product_cato_id = ?
      `,
        [id]
      );

      if (products[0].count > 0) {
        throw new Error("Cannot delete category with associated products");
      }

      // Delete the category
      const [result] = await db.execute(
        `
        DELETE FROM product_cato 
        WHERE product_cato_id = ?
      `,
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = CategoryModel;
