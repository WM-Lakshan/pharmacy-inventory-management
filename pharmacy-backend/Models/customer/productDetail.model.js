// models/productDetail.model.js
const { db } = require("../../db");

class ProductDetailModel {
  /**
   * Get detailed product information by ID
   */
  static async getProductById(productId) {
    try {
      // Query to get product with category information
      const [products] = await db.execute(
        `
        SELECT 
          p.product_id, 
          p.pname, 
          p.price, 
          p.image, 
          p.quantity, 
          p.type AS product_type, 
          p.status AS description, 
          p.treshold,
          pc.name AS category_name, 
          pc.description AS category_description
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE p.product_id = ?
      `,
        [productId]
      );

      if (products.length === 0) {
        return null;
      }

      return products[0];
    } catch (error) {
      console.error("Error in getProductById:", error);
      throw error;
    }
  }

  /**
   * Get related products based on category
   */
  static async getRelatedProducts(productId) {
    try {
      // First get the product's category
      const [product] = await db.execute(
        `
        SELECT product_cato_id FROM product WHERE product_id = ?
      `,
        [productId]
      );

      if (product.length === 0) {
        return [];
      }

      const categoryId = product[0].product_cato_id;

      // Get products from the same category
      const [relatedProducts] = await db.execute(
        `
        SELECT 
          p.product_id, 
          p.pname, 
          p.price, 
          p.image, 
          p.quantity, 
          p.type AS product_type
        FROM product p
        WHERE p.product_cato_id = ? AND p.product_id != ?
        LIMIT 4
      `,
        [categoryId, productId]
      );

      return relatedProducts;
    } catch (error) {
      console.error("Error in getRelatedProducts:", error);
      throw error;
    }
  }

  /**
   * Add product to cart
   */
  static async addToCart(customerId, productId, quantity) {
    try {
      // Check if product exists and has enough stock
      const [productResult] = await db.execute(
        `
        SELECT product_id, quantity, type 
        FROM product 
        WHERE product_id = ?
      `,
        [productId]
      );

      if (productResult.length === 0) {
        return { success: false, message: "Product not found" };
      }

      const product = productResult[0];

      // Check if there's enough stock
      if (product.quantity < quantity) {
        return {
          success: false,
          message: `Only ${product.quantity} items available in stock`,
          availableQuantity: product.quantity,
        };
      }

      // Check if prescription is required
      if (product.type === "prescription needed") {
        return {
          success: false,
          message: "This product requires a prescription",
        };
      }

      // Check if product already exists in cart
      const [cartResult] = await db.execute(
        `
        SELECT cart_id, quantity
        FROM cart
        WHERE customer_id = ? AND product_id = ?
      `,
        [customerId, productId]
      );

      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        if (cartResult.length > 0) {
          // Update existing cart item
          const newQuantity = cartResult[0].quantity + quantity;

          await connection.execute(
            `
            UPDATE cart
            SET quantity = ?
            WHERE cart_id = ?
          `,
            [newQuantity, cartResult[0].cart_id]
          );
        } else {
          // Add new cart item
          await connection.execute(
            `
            INSERT INTO cart (customer_id, product_id, quantity)
            VALUES (?, ?, ?)
          `,
            [customerId, productId, quantity]
          );
        }

        await connection.commit();
        return { success: true, message: "Product added to cart successfully" };
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Error in addToCart:", error);
      throw error;
    }
  }
}

module.exports = ProductDetailModel;
