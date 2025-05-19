


/////////////////////////////////corrcted version///////////////////////////////////////



const SupplierOrderModel = require("../Models/SupplierOrderModel");

class SupplierOrderController {
  // Get all orders
  static async getAllOrders(req, res) {
    try {
      const orders = await SupplierOrderModel.getAllOrders();
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error("Error in getAllOrders:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  }

  // Search suppliers
  static async searchSuppliers(req, res) {
    try {
      const { search } = req.query;
      if (!search) {
        return res.status(400).json({
          success: false,
          message: "Search term is required",
        });
      }

      const suppliers = await SupplierOrderModel.searchSuppliers(search);
      res.status(200).json({
        success: true,
        suppliers, // Ensure this is an array of { supplier_id, supplier_name }
      });
    } catch (error) {
      console.error("Error in searchSuppliers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search suppliers",
        error: error.message,
      });
    }
  }

  // Get order by ID
  static async getOrderById(req, res) {
    try {
      const order = await SupplierOrderModel.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }
      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Error in getOrderById:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch order",
        error: error.message,
      });
    }
  }

  // Create new order
  static async createOrder(req, res) {
    try {
      const orderData = req.body;

      // Validation
      if (
        !orderData.supplier_id ||
        !Array.isArray(orderData.products) ||
        orderData.products.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Supplier ID and products are required",
        });
      }

      // Product validation
      for (const product of orderData.products) {
        if (
          !product.product_id ||
          !product.quantity ||
          !product.buying_price ||
          !product.expired_date
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Each product requires product_id, quantity, buying_price, and expired_date",
          });
        }
        if (product.quantity <= 0 || product.buying_price <= 0) {
          return res.status(400).json({
            success: false,
            message: "Quantity and price must be positive",
          });
        }

        // Ensure unit_type and units_per_package have defaults
        product.unit_type = product.unit_type || "unit";
        product.units_per_package = product.units_per_package || 1;
      }

      // Set manager from auth
      orderData.manager_id = req.user?.id || 1;

      const orderId = await SupplierOrderModel.createOrder(orderData);
      res.status(201).json({
        success: true,
        message: "Order created successfully",
        orderId,
      });
    } catch (error) {
      console.error("Error in createOrder:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create order",
        error: error.message,
      });
    }
  }

  // Update order
  static async updateOrder(req, res) {
    try {
      const orderData = req.body;

      // Ensure each product has unit_type and units_per_package
      if (orderData.products) {
        orderData.products.forEach((product) => {
          product.unit_type = product.unit_type || "unit";
          product.units_per_package = product.units_per_package || 1;
        });
      }

      const success = await SupplierOrderModel.updateOrder(
        req.params.id,
        orderData
      );

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Order not found or update failed",
        });
      }

      res.status(200).json({
        success: true,
        message: "Order updated successfully",
      });
    } catch (error) {
      console.error("Error in updateOrder:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update order",
        error: error.message,
      });
    }
  }

  // Delete order
  static async deleteOrder(req, res) {
    try {
      const success = await SupplierOrderModel.deleteOrder(req.params.id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteOrder:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete order",
        error: error.message,
      });
    }
  }

  // Get all products
  static async getAllProducts(req, res) {
    try {
      const products = await SupplierOrderModel.getAllProducts();
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Error in getAllProducts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      });
    }
  }
}

module.exports = SupplierOrderController;
