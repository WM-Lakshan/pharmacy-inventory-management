const SalesModel = require("../Models/SalesModel");

class SalesController {
  // Get all sales
  static async getAllSales(req, res) {
    try {
      const sales = await SalesModel.getAllSales();

      res.status(200).json({
        success: true,
        sales: sales,
      });
    } catch (error) {
      console.error("Error in getAllSales:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch sales data",
        error: error.message,
      });
    }
  }

  // Get sale by ID
  // static async getSaleById(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const sale = await SalesModel.getSaleById(id);

  //     if (!sale) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Sale not found",
  //       });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       sale,
  //     });
  //   } catch (error) {
  //     console.error(`Error in getSaleById with ID ${req.params.id}:`, error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to fetch sale details",
  //       error: error.message,
  //     });
  //   }
  // }

  static async getSaleById(req, res) {
    try {
      const { id } = req.params;
      console.log(`Fetching sale with ID: ${id}`);

      const sale = await SalesModel.getSaleById(id);

      if (!sale) {
        return res.status(404).json({
          success: false,
          message: "Sale not found",
        });
      }

      // Ensure the sale contains products array
      console.log(`Found sale: ${JSON.stringify(sale, null, 2)}`);

      res.status(200).json({
        success: true,
        sale: sale,
      });
    } catch (error) {
      console.error(`Error in getSaleById with ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch sale details",
        error: error.message,
      });
    }
  }

  // Update an existing sale (only managers can update)
  static async updateSale(req, res) {
    try {
      const { id } = req.params;
      const saleData = req.body;

      // Validate required fields
      if (!saleData.status || !Array.isArray(saleData.products)) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: status and products are required",
        });
      }

      const success = await SalesModel.updateSale(id, saleData);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Sale not found or no changes made",
        });
      }

      res.status(200).json({
        success: true,
        message: "Sale updated successfully",
      });
    } catch (error) {
      console.error(`Error in updateSale with ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to update sale",
        error: error.message,
      });
    }
  }

  // Delete a sale (only managers can delete)
  static async deleteSale(req, res) {
    try {
      const { id } = req.params;
      const success = await SalesModel.deleteSale(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Sale not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Sale deleted successfully",
      });
    } catch (error) {
      console.error(`Error in deleteSale with ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to delete sale",
        error: error.message,
      });
    }
  }

  // Get all products for search functionality
  static async getAllProducts(req, res) {
    try {
      const products = await SalesModel.getAllProducts();

      res.status(200).json({
        success: true,
        products: products,
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

module.exports = SalesController;
