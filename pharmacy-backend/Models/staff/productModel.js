const { db } = require("../../db");

class Product {
  // Get all products (fixed Promise implementation)
  static async getAllProducts() {
    try {
      const [rows] = await db.query(`
        SELECT p.*, pc.name as category_name
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
      `);

      return rows.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: `Rs.${product.price}`,
        quantity: `${product.quantity} Packets`, // Using "Packets" as default as per your schema
        category: product.category_name || "Uncategorized",
        availability: product.quantity > 0 ? "In-stock" : "Out of stock",
        image: product.image || "/default-product.jpg",
        description: product.status || "No description available.",
        expiry_date: product.exp_date,
        requires_prescription: product.typr === "prescription needed",
      }));
    } catch (error) {
      console.error("Error in getAllProducts:", error);
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT p.*, pc.name as category_name
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE p.product_id = ?
      `,
        [id]
      );

      if (rows.length === 0) return null;

      const product = rows[0];
      return {
        id: product.product_id,
        name: product.pname,
        price: `Rs.${product.price}`,
        quantity: `${product.quantity} Packets`,
        category: product.category_name || "Uncategorized",
        availability: product.quantity > 0 ? "In-stock" : "Out of stock",
        image: product.image || "/default-product.jpg",
        description: product.status || "No description available.",
        expiry_date: product.exp_date,
        threshold: product.treshold,
        requires_prescription: product.typr === "prescription needed",
      };
    } catch (error) {
      console.error("Error in getProductById:", error);
      throw error;
    }
  }

  // Create product
  static async createProduct(productData) {
    try {
      const [result] = await db.query(
        `INSERT INTO product (
          product_cato_id, pname, status, treshold, 
          exp_date, quantity, price, image, typr
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.product_cato_id,
          productData.name,
          productData.description,
          productData.threshold,
          productData.expiry_date,
          productData.quantity,
          productData.price,
          productData.image,
          productData.requires_prescription
            ? "prescription needed"
            : "prescription no needed",
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(id, productData) {
    try {
      const [result] = await db.query(
        `UPDATE product SET
          product_cato_id = ?, pname = ?, status = ?, treshold = ?,
          exp_date = ?, quantity = ?, price = ?, image = ?, typr = ?
        WHERE product_id = ?`,
        [
          productData.product_cato_id,
          productData.name,
          productData.description,
          productData.threshold,
          productData.expiry_date,
          productData.quantity,
          productData.price,
          productData.image,
          productData.requires_prescription
            ? "prescription needed"
            : "prescription no needed",
          id,
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in updateProduct:", error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id) {
    try {
      const [result] = await db.query(
        `DELETE FROM product WHERE product_id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(categoryId) {
    try {
      const [rows] = await db.query(
        `SELECT p.*, pc.name as category_name
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE p.product_cato_id = ?`,
        [categoryId]
      );

      return rows.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: `Rs.${product.price}`,
        quantity: `${product.quantity} Packets`,
        category: product.category_name || "Uncategorized",
        availability: product.quantity > 0 ? "In-stock" : "Out of stock",
        image: product.image || "/default-product.jpg",
        description: product.status || "No description available.",
        expiry_date: product.exp_date,
      }));
    } catch (error) {
      console.error("Error in getProductsByCategory:", error);
      throw error;
    }
  }

  // Search products
  static async searchProducts(searchTerm) {
    try {
      const searchPattern = `%${searchTerm}%`;
      const [rows] = await db.query(
        `SELECT p.*, pc.name as category_name
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE p.pname LIKE ? OR pc.name LIKE ? OR p.status LIKE ?`,
        [searchPattern, searchPattern, searchPattern]
      );

      return rows.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: `Rs.${product.price}`,
        quantity: `${product.quantity} Packets`,
        category: product.category_name || "Uncategorized",
        availability: product.quantity > 0 ? "In-stock" : "Out of stock",
        image: product.image || "/default-product.jpg",
        description: product.status || "No description available.",
        expiry_date: product.exp_date,
      }));
    } catch (error) {
      console.error("Error in searchProducts:", error);
      throw error;
    }
  }
}

module.exports = Product;
