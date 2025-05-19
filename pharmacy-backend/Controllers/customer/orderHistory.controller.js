const CustomerOrderModel = require("../../Models/customer/orderhistory.model");

// class OrderController {
//   /**
//    * Get all orders for the logged in user
//    */
//   static async getUserOrders(req, res) {
//     try {
//       const customerId = req.user.id;

//       if (!customerId) {
//         return res.status(401).json({
//           success: false,
//           message: "Authentication required",
//         });
//       }

//       const {
//         page = 1,
//         pageSize = 10,
//         status,
//         startDate,
//         endDate,
//         sortField = "created_at",
//         sortDirection = "DESC",
//       } = req.query;

//       const pageNum = parseInt(page);
//       const pageSizeNum = parseInt(pageSize);

//       if (
//         isNaN(pageNum) ||
//         pageNum < 1 ||
//         isNaN(pageSizeNum) ||
//         pageSizeNum < 1
//       ) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid pagination parameters",
//         });
//       }

//       let startDateObj = null;
//       let endDateObj = null;

//       if (startDate) {
//         startDateObj = new Date(startDate);
//         if (isNaN(startDateObj.getTime())) {
//           return res.status(400).json({
//             success: false,
//             message: "Invalid start date format",
//           });
//         }
//       }

//       if (endDate) {
//         endDateObj = new Date(endDate);
//         if (isNaN(endDateObj.getTime())) {
//           return res.status(400).json({
//             success: false,
//             message: "Invalid end date format",
//           });
//         }
//       }

//       const options = {
//         page: pageNum,
//         pageSize: pageSizeNum,
//         status: status !== "all" ? status : null,
//         startDate: startDateObj,
//         endDate: endDateObj,
//         sortField,
//         sortDirection,
//       };

//       const result = await OrderModel.getUserOrders(customerId, options);

//       res.status(200).json({
//         success: true,
//         orders: result.orders,
//         pagination: {
//           total: result.total,
//           page: result.page,
//           pages: result.pages,
//           pageSize: pageSizeNum,
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching user orders:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to retrieve orders",
//       });
//     }
//   }

//   /**
//    * Get detailed information for a specific order
//    */
//   static async getOrderDetails(req, res) {
//     try {
//       const customerId = req.user.id;
//       const orderId = req.params.id;

//       if (!customerId) {
//         return res.status(401).json({
//           success: false,
//           message: "Authentication required",
//         });
//       }

//       if (!orderId) {
//         return res.status(400).json({
//           success: false,
//           message: "Order ID is required",
//         });
//       }

//       const result = await OrderModel.getOrderDetails(orderId, customerId);

//       if (!result.success) {
//         return res.status(404).json({
//           success: false,
//           message: result.message || "Order not found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         order: {
//           ...result.order,
//           date: new Date(result.order.date).toISOString(),
//         },
//         orderItems: result.orderItems.map((item) => ({
//           ...item,
//           total: item.price * item.quantity,
//         })),
//       });
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to retrieve order details",
//       });
//     }
//   }

//   /**
//    * Search orders by various parameters
//    */
//   static async searchOrders(req, res) {
//     try {
//       const customerId = req.user.id;
//       const {
//         query = "",
//         page = 1,
//         pageSize = 10,
//         status,
//         startDate,
//         endDate,
//       } = req.query;

//       if (!customerId) {
//         return res.status(401).json({
//           success: false,
//           message: "Authentication required",
//         });
//       }

//       const pageNum = parseInt(page);
//       const pageSizeNum = parseInt(pageSize);

//       if (
//         isNaN(pageNum) ||
//         pageNum < 1 ||
//         isNaN(pageSizeNum) ||
//         pageSizeNum < 1
//       ) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid pagination parameters",
//         });
//       }

//       let startDateObj = null;
//       let endDateObj = null;

//       if (startDate) {
//         startDateObj = new Date(startDate);
//         if (isNaN(startDateObj.getTime())) {
//           return res.status(400).json({
//             success: false,
//             message: "Invalid start date format",
//           });
//         }
//       }

//       if (endDate) {
//         endDateObj = new Date(endDate);
//         if (isNaN(endDateObj.getTime())) {
//           return res.status(400).json({
//             success: false,
//             message: "Invalid end date format",
//           });
//         }
//       }

//       const options = {
//         page: pageNum,
//         pageSize: pageSizeNum,
//         status: status !== "all" ? status : null,
//         startDate: startDateObj,
//         endDate: endDateObj,
//       };

//       const result = await OrderModel.searchOrders(customerId, query, options);

//       res.status(200).json({
//         success: true,
//         query,
//         orders: result.orders,
//         pagination: {
//           total: result.total,
//           page: result.page,
//           pages: result.pages,
//           pageSize: pageSizeNum,
//         },
//       });
//     } catch (error) {
//       console.error("Error searching orders:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to search orders",
//       });
//     }
//   }
// }

// module.exports = OrderController;

class CustomerOrderController {
  /**
   * Get all orders for the authenticated customer
   */
  static async getCustomerOrders(req, res) {
    try {
      // Get customer ID from authenticated user
      const customerId = req.user.id || req.user.customer_id;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Customer ID not found in token",
        });
      }

      const orders = await CustomerOrderModel.getCustomerOrders(customerId);

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  }

  /**
   * Get order by ID (with authorization check)
   */
  static async getOrderById(req, res) {
    try {
      const orderId = req.params.id;
      const customerId = req.user.id || req.user.customer_id;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Customer ID not found in token",
        });
      }

      const order = await CustomerOrderModel.getOrderById(orderId, customerId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found or doesn't belong to this customer",
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
      const customerId = req.user.id || req.user.customer_id;

      if (!customerId) {
        return res.status(400).json({
          success: false,
          message: "Customer ID not found in token",
        });
      }

      // First verify the order belongs to this customer
      const order = await CustomerOrderModel.getOrderById(orderId, customerId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found or doesn't belong to this customer",
        });
      }

      const products = await CustomerOrderModel.getOrderProducts(orderId);

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
}

module.exports = CustomerOrderController;
