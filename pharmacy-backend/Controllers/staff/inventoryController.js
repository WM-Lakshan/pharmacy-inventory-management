// controllers/inventory.controller.js
const InventoryModel = require("../../Models/staff/inventoryModel");

class InventoryController {
  /**
   * Get all inventory products with filtering and pagination
   */
  static async getAllProducts(req, res) {
    try {
      // Extract query parameters
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const category = req.query.category;
      const search = req.query.search;
      const inStock =
        req.query.inStock === "true"
          ? true
          : req.query.inStock === "false"
          ? false
          : null;

      // Get products from model
      const result = await InventoryModel.getAllProducts({
        page,
        pageSize,
        category,
        search,
        inStock,
      });

      // Return formatted response
      res.status(200).json({
        success: true,
        products: result.products,
        total: result.total,
        page: result.page,
        pages: result.pages,
      });
    } catch (error) {
      console.error("Error in InventoryController.getAllProducts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch inventory products",
        error: error.message,
      });
    }
  }

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
      const product = await InventoryModel.getProductById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Get inventory history for this product
      const inventoryHistory = await InventoryModel.getInventoryHistory(
        productId
      );

      res.status(200).json({
        success: true,
        product,
        inventoryHistory,
      });
    } catch (error) {
      console.error("Error in InventoryController.getProductById:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product details",
        error: error.message,
      });
    }
  }

  /**
   * Get all product categories
   */
  static async getCategories(req, res) {
    try {
      const categories = await InventoryModel.getCategories();

      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.error("Error in InventoryController.getCategories:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product categories",
        error: error.message,
      });
    }
  }

  /**
   * Get dashboard overview data
   */
  static async getDashboardData(req, res) {
    try {
      // Get low stock products
      const lowStockProducts = await InventoryModel.getLowStockProducts();

      // Get products expiring within 30 days
      const expiringProducts = await InventoryModel.getExpiringProducts(30);

      res.status(200).json({
        success: true,
        lowStockProducts,
        expiringProducts,
        lowStockCount: lowStockProducts.length,
        expiringCount: expiringProducts.length,
      });
    } catch (error) {
      console.error("Error in InventoryController.getDashboardData:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard data",
        error: error.message,
      });
    }
  }

  /**
   * Update product stock quantity
   */
  static async updateProductStock(req, res) {
    try {
      const { productId, quantity } = req.body;
      const staffId = req.user.id; // From auth middleware

      // Validate required fields
      if (!productId || isNaN(productId) || !quantity || isNaN(quantity)) {
        return res.status(400).json({
          success: false,
          message: "Product ID and quantity are required and must be numbers",
        });
      }

      // If quantity is negative, that's an error
      if (quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity cannot be negative",
        });
      }

      // Update stock
      const result = await InventoryModel.updateProductStock(
        productId,
        quantity,
        staffId
      );

      res.status(200).json({
        success: true,
        message: `Product stock updated from ${result.oldQuantity} to ${result.newQuantity} successfully`,
        data: result,
      });
    } catch (error) {
      console.error("Error in InventoryController.updateProductStock:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update product stock",
        error: error.message,
      });
    }
  }

  /**
   * Get low stock products
   */
  static async getLowStockProducts(req, res) {
    try {
      const lowStockProducts = await InventoryModel.getLowStockProducts();

      res.status(200).json({
        success: true,
        products: lowStockProducts,
        count: lowStockProducts.length,
      });
    } catch (error) {
      console.error("Error in InventoryController.getLowStockProducts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch low stock products",
        error: error.message,
      });
    }
  }

  /**
   * Get expiring products
   */
  static async getExpiringProducts(req, res) {
    try {
      const days = parseInt(req.query.days) || 30;
      const expiringProducts = await InventoryModel.getExpiringProducts(days);

      res.status(200).json({
        success: true,
        products: expiringProducts,
        count: expiringProducts.length,
        daysWindow: days,
      });
    } catch (error) {
      console.error("Error in InventoryController.getExpiringProducts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch expiring products",
        error: error.message,
      });
    }
  }

  /**
   * Get inventory history for a product
   */
  static async getInventoryHistory(req, res) {
    try {
      const productId = req.params.id;

      // Validate productId
      if (!productId || isNaN(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      const history = await InventoryModel.getInventoryHistory(productId);

      res.status(200).json({
        success: true,
        history,
      });
    } catch (error) {
      console.error("Error in InventoryController.getInventoryHistory:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch inventory history",
        error: error.message,
      });
    }
  }
}

module.exports = InventoryController;
