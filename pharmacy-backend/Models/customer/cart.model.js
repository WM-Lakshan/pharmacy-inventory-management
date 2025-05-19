const { db } = require("../../db");

class CartModel {
  /**
   * Add a product to cart or update quantity if already exists
   */
  static async addToCart(customerId, productId, quantity = 1) {
    try {
      // Check if product exists and has enough stock
      const [productResult] = await db.execute(
        `SELECT product_id, quantity, type FROM product WHERE product_id = ?`,
        [productId]
      );

      if (productResult.length === 0) {
        return {
          success: false,
          message: "Product not found",
        };
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

      // Check if product requires prescription
      if (product.type === "prescription needed") {
        return {
          success: false,
          message: "This product requires a prescription",
          requiresPrescription: true,
        };
      }

      // Check if product is already in cart
      const [cartResult] = await db.execute(
        `SELECT cart_id, quantity 
         FROM cart 
         WHERE customer_id = ? AND product_id = ?`,
        [customerId, productId]
      );

      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        if (cartResult.length > 0) {
          // Update existing cart item
          const newQuantity = cartResult[0].quantity + quantity;

          await connection.execute(
            `UPDATE cart 
             SET quantity = ? 
             WHERE cart_id = ?`,
            [newQuantity, cartResult[0].cart_id]
          );
        } else {
          // Add new cart item
          await connection.execute(
            `INSERT INTO cart (customer_id, product_id, quantity) 
             VALUES (?, ?, ?)`,
            [customerId, productId, quantity]
          );
        }

        await connection.commit();
        return {
          success: true,
          message: "Product added to cart successfully",
        };
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Error in addToCart model:", error);
      throw error;
    }
  }

  /**
   * Get cart items for a customer
   */
  static async getCartItems(customerId) {
    try {
      const [cartItems] = await db.execute(
        `SELECT c.cart_id AS id, c.product_id, p.pname AS name, 
                p.price, c.quantity, p.image, p.type AS requiresPrescription,
                p.quantity AS stockCount
         FROM cart c
         JOIN product p ON c.product_id = p.product_id
         WHERE c.customer_id = ?`,
        [customerId]
      );

      return cartItems;
    } catch (error) {
      console.error("Error getting cart items:", error);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItemQuantity(customerId, cartItemId, quantity) {
    try {
      // Check if cart item exists and belongs to the customer
      const [cartItemResult] = await db.execute(
        `SELECT c.cart_id, c.product_id, p.quantity AS stockQuantity
         FROM cart c
         JOIN product p ON c.product_id = p.product_id
         WHERE c.cart_id = ? AND c.customer_id = ?`,
        [cartItemId, customerId]
      );

      if (cartItemResult.length === 0) {
        return { found: false };
      }

      const cartItem = cartItemResult[0];

      // Check if there's enough stock
      if (cartItem.stockQuantity < quantity) {
        return {
          found: true,
          sufficientStock: false,
          stockQuantity: cartItem.stockQuantity,
        };
      }

      // Update cart item quantity
      await db.execute(
        `UPDATE cart
         SET quantity = ?
         WHERE cart_id = ?`,
        [quantity, cartItemId]
      );

      return { found: true, sufficientStock: true, updated: true };
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      throw error;
    }
  }

  /**
   * Remove an item from cart
   */
  static async removeCartItem(customerId, cartItemId) {
    try {
      // Check if cart item exists and belongs to the customer
      const [cartItemResult] = await db.execute(
        `SELECT cart_id
         FROM cart
         WHERE cart_id = ? AND customer_id = ?`,
        [cartItemId, customerId]
      );

      if (cartItemResult.length === 0) {
        return { found: false };
      }

      // Remove cart item
      await db.execute(
        `DELETE FROM cart
         WHERE cart_id = ?`,
        [cartItemId]
      );

      return { found: true, removed: true };
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
    }
  }
}

module.exports = CartModel;
