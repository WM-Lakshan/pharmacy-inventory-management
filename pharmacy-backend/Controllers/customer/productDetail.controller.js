// controllers/productDetail.controller.js
const ProductDetailModel = require("../../Models/customer/productDetail.model");

class ProductDetailController {
  /**
   * Get product details by ID
   */
  static async getProductById(req, res) {
    try {
      const productId = req.params.id;

      // Validate productId
      if (!productId || isNaN(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      // Get product details
      const product = await ProductDetailModel.getProductById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Transform product data for frontend
      const transformedProduct = {
        id: product.product_id,
        name: product.pname,
        price: product.price,
        image: product.image || `/placeholders/product-400x320.jpg`,
        description: product.description || "No description available",
        availabilityStatus: product.quantity > 0 ? "In Stock" : "Out of Stock",
        requiresPrescription: product.product_type === "prescription needed",
        usage: "Take as directed by your healthcare provider.",
        sideEffects:
          "Consult your healthcare provider for potential side effects.",
        composition: "See package for ingredients.",
        manufacturer: "Pharmaceutical Company",
        category: product.category_name,
        stockCount: product.quantity,
      };

      console.log("Transformed product:", transformedProduct);

      res.status(200).json({
        success: true,
        product: transformedProduct,
      });
    } catch (error) {
      console.error("Error in getProductById controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product details",
        error: error.message,
      });
    }
  }

  /**
   * Get related products
   */
  static async getRelatedProducts(req, res) {
    try {
      const productId = req.params.id;

      // Validate productId
      if (!productId || isNaN(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      // Get related products
      const relatedProducts = await ProductDetailModel.getRelatedProducts(
        productId
      );

      // Transform product data for frontend
      const transformedProducts = relatedProducts.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: product.price,
        discount: 0, // Placeholder - implement actual discount logic if needed
        image: product.image || `/images/placeholder.jpg`,
        requiresPrescription: product.product_type === "prescription needed",
        inStock: product.quantity > 0,
      }));

      res.status(200).json({
        success: true,
        products: transformedProducts,
      });
    } catch (error) {
      console.error("Error in getRelatedProducts controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch related products",
        error: error.message,
      });
    }
  }

  /**
   * Add product to cart
   */
  static async addToCart(req, res) {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const customerId = req.user.id;
      const { productId, quantity = 1 } = req.body;

      // Validate input
      if (!productId || isNaN(productId)) {
        return res.status(400).json({
          success: false,
          message: "Valid product ID is required",
        });
      }

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1",
        });
      }

      // Add to cart
      const result = await ProductDetailModel.addToCart(
        customerId,
        productId,
        quantity
      );

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
}

module.exports = ProductDetailController;
