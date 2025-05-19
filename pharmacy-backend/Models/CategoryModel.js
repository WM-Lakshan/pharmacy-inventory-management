// models/CategoryModel.js
const { db } = require("../db");

class CategoryModel {
  // Get all categories
  static async getAllCategories() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          product_cato_id as id, 
          name, 
          description,
          (SELECT COUNT(*) FROM product WHERE product_cato_id = product_cato.product_cato_id) as productCount
        FROM product_cato
        ORDER BY name
      `);

      return rows;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // Get category by ID
  static async getCategoryById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT product_cato_id as id, name, description
         FROM product_cato WHERE product_cato_id = ?`,
        [id]
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  }

  // Create new category
  static async createCategory(categoryData) {
    const { name, description } = categoryData;

    try {
      const [result] = await db.execute(
        `INSERT INTO product_cato (name, description) VALUES (?, ?)`,
        [name, description]
      );

      const newCategory = {
        id: result.insertId,
        name,
        description,
      };

      return newCategory;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  // Update category
  static async updateCategory(id, categoryData) {
    const { name, description } = categoryData;

    try {
      const [result] = await db.execute(
        `UPDATE product_cato SET name = ?, description = ? WHERE product_cato_id = ?`,
        [name, description, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return {
        id,
        name,
        description,
      };
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  }

  // Delete category
  static async deleteCategory(id) {
    try {
      // Check if category has products
      const [products] = await db.execute(
        `SELECT COUNT(*) as count FROM product WHERE product_cato_id = ?`,
        [id]
      );

      if (products[0].count > 0) {
        throw new Error(
          `Cannot delete category. It has ${products[0].count} product(s).`
        );
      }

      const [result] = await db.execute(
        `DELETE FROM product_cato WHERE product_cato_id = ?`,
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
}

module.exports = CategoryModel;
