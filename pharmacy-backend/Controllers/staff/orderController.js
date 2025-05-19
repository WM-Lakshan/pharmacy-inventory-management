// // controllers/staff/orderController.js
// const OrderModel = require("../../Models/staff/orderModel");

// class OrderController {
//   /**
//    * Get all orders for staff
//    */
//   static async getAllOrders(req, res) {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const status = req.query.status;
//       const customerId = req.query.customerId;

//       const result = await OrderModel.getAllOrders({
//         page,
//         limit,
//         status,
//         customerId,
//       });

//       res.status(200).json({
//         success: true,
//         orders: result.orders,
//         pagination: result.pagination,
//       });
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch orders",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get order by ID
//    */
//   static async getOrderById(req, res) {
//     try {
//       const orderId = req.params.id;
//       const order = await OrderModel.getOrderById(orderId);

//       if (!order) {
//         return res.status(404).json({
//           success: false,
//           message: "Order not found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         order,
//       });
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch order details",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get products in an order
//    */
//   static async getOrderProducts(req, res) {
//     try {
//       const orderId = req.params.id;
//       const products = await OrderModel.getOrderProducts(orderId);

//       res.status(200).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       console.error("Error fetching order products:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch order products",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Update order status
//    */
//   static async updateOrderStatus(req, res) {
//     try {
//       const orderId = req.params.id;
//       const { status, reduceInventory = false } = req.body;

//       if (!status) {
//         return res.status(400).json({
//           success: false,
//           message: "Status is required",
//         });
//       }

//       // Validate status
//       const validStatuses = [
//         "Pending",
//         "Confirmed",
//         "Processing",
//         "Out for delivery",
//         "Ready for pickup",
//         "Delivered",
//         "Delayed",
//         "Cancelled",
//       ];

//       if (!validStatuses.includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Invalid status. Status must be one of: " +
//             validStatuses.join(", "),
//         });
//       }

//       const result = await OrderModel.updateOrderStatus(
//         orderId,
//         status,
//         reduceInventory
//       );

//       if (!result.success) {
//         return res.status(404).json({
//           success: false,
//           message: result.message,
//         });
//       }

//       res.status(200).json({
//         success: true,
//         message: result.message,
//         updatedStatus: status,
//         previousStatus: result.oldStatus,
//         inventoryReduced: result.inventoryReduced,
//       });
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to update order status",
//         error: error.message,
//       });
//     }
//   }
// }

// module.exports = OrderController;

// controllers/staff/orderController.js
const OrderModel = require("../../Models/staff/orderModel");

class OrderController {
  /**
   * Get all orders for staff
   */
  static async getAllOrders(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;
      const customerId = req.query.customerId;

      const result = await OrderModel.getAllOrders({
        page,
        limit,
        status,
        customerId,
      });

      res.status(200).json({
        success: true,
        orders: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(req, res) {
    try {
      const orderId = req.params.id;
      const order = await OrderModel.getOrderById(orderId);

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
      console.error("Error fetching order details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch order details",
        error: error.message,
      });
    }
  }

  /**
   * Get products in an order
   */
  static async getOrderProducts(req, res) {
    try {
      const orderId = req.params.id;
      const products = await OrderModel.getOrderProducts(orderId);

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Error fetching order products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch order products",
        error: error.message,
      });
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(req, res) {
    try {
      const orderId = req.params.id;
      const { status, reduceInventory = false } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      // Validate status
      const validStatuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Out for delivery",
        "Ready for pickup",
        "Delivered",
        "Delayed",
        "Cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Status must be one of: " +
            validStatuses.join(", "),
        });
      }

      const result = await OrderModel.updateOrderStatus(
        orderId,
        status,
        reduceInventory
      );

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        updatedStatus: status,
        previousStatus: result.oldStatus,
        inventoryReduced: result.inventoryReduced,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update order status",
        error: error.message,
      });
    }
  }

  /**
   * Delete payment record for an order
   * This is a new method to handle payment deletion when an order is cancelled
   */
  static async deletePaymentRecord(req, res) {
    try {
      const orderId = req.params.orderId;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order ID is required",
        });
      }

      const result = await OrderModel.deletePaymentRecord(orderId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Payment record deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting payment record:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete payment record",
        error: error.message,
      });
    }
  }
}

module.exports = OrderController;
