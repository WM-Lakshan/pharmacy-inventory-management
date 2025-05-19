const { db } = require("../../db");

class SearchModel {
  static async searchProducts(searchTerm, limit = 10) {
    try {
      const [rows] = await db.query(
        `
      SELECT 
        p.product_id as id,
        p.pname as name,
        p.price,
        p.image,
        p.type as requiresPrescription,
        CASE 
          WHEN p.quantity > 0 THEN 'In Stock'
          ELSE 'Out of Stock'
        END as availabilityStatus,
        pc.name as category
      FROM product p
      JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
      WHERE p.pname LIKE ? OR pc.name LIKE ?
      LIMIT ?
    `,
        [`%${searchTerm}%`, `%${searchTerm}%`, limit]
      );

      return rows.map((product) => ({
        ...product,
        requiresPrescription:
          product.requiresPrescription === "prescription needed",
      }));
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  }

  static async getRelatedProducts(productId, limit = 4) {
    try {
      const [rows] = await db.query(
        `
        SELECT 
          p.product_id as id,
          p.pname as name,
          p.price,
          p.image,
          p.quantity > 0 as inStock,
          p.type as requiresPrescription
        FROM product p
        JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE p.product_id != ? 
        AND p.product_cato_id = (
          SELECT product_cato_id FROM product WHERE product_id = ?
        )
        LIMIT ?
      `,
        [productId, productId, limit]
      );

      return rows.map((product) => ({
        ...product,
        requiresPrescription:
          product.requiresPrescription === "prescription needed",
      }));
    } catch (error) {
      console.error("Related products error:", error);
      throw error;
    }
  }
}

module.exports = SearchModel;
