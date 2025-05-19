// controllers/product.controller.js
const ProductModel = require("../../Models/customer/product.model");

class ProductController {
  /**
   * Get all products with optional filtering and pagination
   */
  static async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 8;
      const category = req.query.category || "all";
      const featured = req.query.featured === "true";
      const topSelling = req.query.topSelling === "true";

      const result = await ProductModel.getAllProducts({
        page,
        pageSize,
        category,
        featured,
        topSelling,
      });

      // Transform the data to match frontend expectations
      const transformedProducts = result.products.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: product.price,
        image: product.image || `/api/placeholder/240/240`,
        discount: 0, // You could calculate this if you add a discount field
        requiresPrescription: product.product_type === "prescription needed",
        inStock: product.quantity > 0,
        category: product.category_name,
      }));

      res.status(200).json({
        success: true,
        products: transformedProducts,
        total: result.total,
        page: result.page,
        pages: result.pages,
      });
    } catch (error) {
      console.error("Error in getAllProducts controller:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(req, res) {
    try {
      const productId = req.params.id;

      const product = await ProductModel.getProductById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Transform the data to match frontend expectations
      const transformedProduct = {
        id: product.product_id,
        name: product.pname,
        price: product.price,
        image: product.image || `/api/placeholder/240/240`,
        discount: 0, // You could calculate this if you add a discount field
        requiresPrescription: product.product_type === "prescription needed",
        inStock: product.quantity > 0,
        category: product.category_name,
        description: product.status,
        expiryDate: new Date(product.exp_date).toISOString().split("T")[0],
      };

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
   * Add product to cart
   */
  static async addToCart(req, res) {
    try {
      // Ensure user is authenticated
      const customerId = req.user?.id;
      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const { productId, quantity = 1 } = req.body;

      // Validate inputs
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

      const result = await ProductModel.addToCart(
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

module.exports = ProductController;
