// controllers/cart.controller.js
const CartModel = require("../../Models/customer/cart.model");

class CartController {
  /**
   * Add product to cart
   */
  static async addToCart(req, res) {
    try {
      const customerId = req.user.id;
      const { productId, quantity = 1 } = req.body;

      // Validate input
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1",
        });
      }

      const result = await CartModel.addToCart(customerId, productId, quantity);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error in addToCart controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add product to cart",
        error: error.message,
      });
    }
  }

  /**
   * Get cart items
   */
  static async getCartItems(req, res) {
    try {
      const customerId = req.user.id;
      const cartItems = await CartModel.getCartItems(customerId);

      // Transform cart items to match frontend expectations
      const transformedItems = cartItems.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || `/api/placeholder/80/80`,
        requiresPrescription:
          item.requiresPrescription === "prescription needed",
        stockCount: item.stockCount,
      }));

      res.status(200).json({
        success: true,
        items: transformedItems,
      });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch cart items",
      });
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItemQuantity(req, res) {
    try {
      const customerId = req.user.id;
      const { cartItemId, quantity } = req.body;

      // Validate quantity
      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity",
        });
      }

      const result = await CartModel.updateCartItemQuantity(
        customerId,
        cartItemId,
        quantity
      );

      if (!result.found) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      if (!result.sufficientStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${result.stockQuantity} items available in stock`,
        });
      }

      res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully",
      });
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update cart item quantity",
      });
    }
  }

  /**
   * Remove cart item
   */
  static async removeCartItem(req, res) {
    try {
      const customerId = req.user.id;
      const cartItemId = req.params.id;

      const result = await CartModel.removeCartItem(customerId, cartItemId);

      if (!result.found) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
      });
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({
        success: false,
        message: "Failed to remove item from cart",
      });
    }
  }
}

module.exports = CartController;
