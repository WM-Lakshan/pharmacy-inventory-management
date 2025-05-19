// // controllers/dashboardController.js
// const DashboardModel = require("../models/dashboardModel");

// /**
//  * Dashboard Controller
//  * Handles all dashboard-related API requests
//  */
// class DashboardController {
//   /**
//    * Get overview metrics for the dashboard
//    */
//   async getOverview(req, res) {
//     try {
//       const overviewData = await DashboardModel.getOverview();
//       res.status(200).json(overviewData);
//     } catch (error) {
//       console.error("Error in getOverview controller:", error);
//       res.status(500).json({
//         success: false,
//         message: "Error fetching overview data",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get inventory summary data
//    */
//   async getInventorySummary(req, res) {
//     try {
//       const inventoryData = await DashboardModel.getInventorySummary();
//       res.status(200).json(inventoryData);
//     } catch (error) {
//       console.error("Error in getInventorySummary controller:", error);
//       res.status(500).json({
//         success: false,
//         message: "Error fetching inventory summary",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get sales data for the chart
//    */
//   async getSalesData(req, res) {
//     try {
//       const { timeRange } = req.query;
//       const salesData = await DashboardModel.getSalesData(timeRange);
//       res.status(200).json(salesData);
//     } catch (error) {
//       console.error("Error in getSalesData controller:", error);
//       res.status(500).json({
//         success: false,
//         message: "Error fetching sales data",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get top selling products
//    */
//   async getTopSellingProducts(req, res) {
//     try {
//       const products = await DashboardModel.getTopSellingProducts();
//       res.status(200).json(products);
//     } catch (error) {
//       console.error("Error in getTopSellingProducts controller:", error);
//       res.status(500).json({
//         success: false,
//         message: "Error fetching top selling products",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get products that are near expiry
//    */
//   async getExpiredProducts(req, res) {
//     try {
//       const products = await DashboardModel.getExpiredProducts();
//       res.status(200).json(products);
//     } catch (error) {
//       console.error("Error in getExpiredProducts controller:", error);
//       res.status(500).json({
//         success: false,
//         message: "Error fetching expired products",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get products with low stock
//    */
//   async getLowStockProducts(req, res) {
//     try {
//       const products = await DashboardModel.getLowStockProducts();
//       res.status(200).json(products);
//     } catch (error) {
//       console.error("Error in getLowStockProducts controller:", error);
//       res.status(500).json({
//         success: false,
//         message: "Error fetching low stock products",
//         error: error.message,
//       });
//     }
//   }
// }

// module.exports = new DashboardController();

// controllers/dashboardController.js
const Dashboard = require("../Models/dashboardModel");

/**
 * Dashboard Controller
 * Handles all dashboard-related API requests
 */
class DashboardController {
  /**
   * Get overview metrics for the dashboard
   */
  async getOverview(req, res) {
    try {
      const overviewData = await Dashboard.getOverview();
      res.status(200).json(overviewData);
    } catch (error) {
      console.error("Error in getOverview controller:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching overview data",
        error: error.message,
      });
    }
  }

  /**
   * Get inventory summary data
   */
  async getInventorySummary(req, res) {
    try {
      const inventoryData = await Dashboard.getInventorySummary();
      res.status(200).json(inventoryData);
    } catch (error) {
      console.error("Error in getInventorySummary controller:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching inventory summary",
        error: error.message,
      });
    }
  }

  /**
   * Get sales data for the chart
   */
  async getSalesData(req, res) {
    try {
      const { timeRange } = req.query;
      const salesData = await Dashboard.getSalesData(timeRange);
      res.status(200).json(salesData);
    } catch (error) {
      console.error("Error in getSalesData controller:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching sales data",
        error: error.message,
      });
    }
  }

  /**
   * Get top selling products
   */
  async getTopSellingProducts(req, res) {
    try {
      const products = await Dashboard.getTopSellingProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error in getTopSellingProducts controller:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching top selling products",
        error: error.message,
      });
    }
  }

  /**
   * Get products that are near expiry
   */
  async getExpiredProducts(req, res) {
    try {
      const products = await Dashboard.getExpiredProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error in getExpiredProducts controller:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching expired products",
        error: error.message,
      });
    }
  }

  /**
   * Get products with low stock
   */
  async getLowStockProducts(req, res) {
    try {
      const products = await Dashboard.getLowStockProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error in getLowStockProducts controller:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching low stock products",
        error: error.message,
      });
    }
  }
}

module.exports = new DashboardController();
