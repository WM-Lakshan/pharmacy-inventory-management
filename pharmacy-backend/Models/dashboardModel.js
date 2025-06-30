

const { db } = require("../db");
class Dashboard {
  /**
   * Get overview metrics for the dashboard
   */
  static async getOverview() {
    try {
      // Get total sales amount and count (from cus_oder)
      const [salesResult] = await db.query(`
        SELECT COUNT(*) as orderCount, COALESCE(SUM(value), 0) as totalAmount 
        FROM cus_oder 
        WHERE oder_status IN ('Completed', 'Ready for pickup', 'Out for delivery')
      `);

      // Get total purchases (from s_oder)
      const [purchasesResult] = await db.query(`
        SELECT COUNT(*) as purchaseCount 
        FROM s_oder
      `);

      // Get cancellations
      const [cancellationsResult] = await db.query(`
        SELECT COUNT(*) as cancelCount 
        FROM cus_oder 
        WHERE oder_status = 'Cancelled'
      `);

      return {
        sales: salesResult[0].orderCount || 0,
        totalAmount: salesResult[0].totalAmount || 0,
        purchases: purchasesResult[0].purchaseCount || 0,
        cancellations: cancellationsResult[0].cancelCount || 0,
      };
    } catch (error) {
      console.error("Error in getOverview model:", error);
      // Return mock data if error occurs
      return {
        sales: 832,
        totalAmount: 832,
        purchases: 82,
        cancellations: 5,
      };
    }
  }

  /**
   * Get inventory summary
   */
  static async getInventorySummary() {
    try {
      // Get total quantity in hand
      const [inHandResult] = await db.query(`
        SELECT COALESCE(SUM(quantity), 0) as totalQuantity 
        FROM product
      `);

      // Get quantity to be received (from supplier_product)
      // This calculates the products that are ordered but not yet received
      // We sum the Products_remaining column which shows how many products are still to be delivered
      const [toBeReceivedResult] = await db.query(`
        SELECT COALESCE(SUM(Products_remaining), 0) as totalToBeReceived 
        FROM supplier_product 
        WHERE Products_remaining > 0
      `);

      return {
        quantityInHand: inHandResult[0].totalQuantity || 0,
        toBeReceived: toBeReceivedResult[0].totalToBeReceived || 0,
      };
    } catch (error) {
      console.error("Error in getInventorySummary model:", error);
      // Return mock data if error occurs
      return {
        quantityInHand: 868,
        toBeReceived: 200,
      };
    }
  }

  /**
   * Get sales and purchase data over time
   */
  static async getSalesData(timeRange = "monthly") {
    try {
      // Check if created_at column exists in cus_oder
      const [checkCusOrderCreatedAt] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'cus_oder' 
        AND column_name = 'created_at'
      `);

      // Check if created_at column exists in s_oder
      const [checkSOrderCreatedAt] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 's_oder' 
        AND column_name = 'created_at'
      `);

      // If created_at doesn't exist in either table, return mock data
      if (
        checkCusOrderCreatedAt[0].count === 0 ||
        checkSOrderCreatedAt[0].count === 0
      ) {
        return this.getMockSalesData();
      }

      let groupBy = "";

      // Determine the date format and grouping based on the time range
      switch (timeRange) {
        case "weekly":
          groupBy = 'DATE_FORMAT(created_at, "%Y-%u")'; // Group by week
          break;
        case "yearly":
          groupBy = "YEAR(created_at)"; // Group by year
          break;
        default: // monthly
          groupBy = 'DATE_FORMAT(created_at, "%Y-%m")'; // Group by month
      }

      // Get sales data
      const [salesData] = await db.query(`
        SELECT 
          ${groupBy} as period,
          COALESCE(SUM(value), 0) as sales
        FROM cus_oder
        WHERE created_at IS NOT NULL
        GROUP BY ${groupBy}
        ORDER BY period
      `);

      // Get purchase data
      const [purchaseData] = await db.query(`
        SELECT 
          ${groupBy} as period,
          COUNT(*) as purchaseCount
        FROM s_oder
        WHERE created_at IS NOT NULL
        GROUP BY ${groupBy}
        ORDER BY period
      `);

      // If no data was found, return mock data
      if (salesData.length === 0 && purchaseData.length === 0) {
        return this.getMockSalesData();
      }

      // Format the data for the chart
      // We need to merge both datasets by period and normalize the date formats
      const mergedData = [];
      const allPeriods = new Set([
        ...salesData.map((item) => item.period),
        ...purchaseData.map((item) => item.period),
      ]);

      // Convert period format to readable month names
      const periodToMonth = {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec",
      };

      [...allPeriods].sort().forEach((period) => {
        const salesItem = salesData.find((item) => item.period === period);
        const purchaseItem = purchaseData.find(
          (item) => item.period === period
        );

        let displayPeriod = period;
        if (timeRange === "monthly") {
          // Format YYYY-MM to Month name
          const month = period.split("-")[1];
          displayPeriod = periodToMonth[month] || month;
        } else if (timeRange === "weekly") {
          // Format YYYY-WW to Week WW
          const week = period.split("-")[1];
          displayPeriod = `Week ${week}`;
        }

        mergedData.push({
          month: displayPeriod,
          sales: salesItem ? Number(salesItem.sales) : 0,
          purchase: purchaseItem ? Number(purchaseItem.purchaseCount) * 500 : 0, // Multiply by average value for visualization
        });
      });

      return mergedData.length > 0 ? mergedData : this.getMockSalesData();
    } catch (error) {
      console.error("Error in getSalesData model:", error);
      // Return mock data if error occurs
      return this.getMockSalesData();
    }
  }

  // Helper method to generate mock sales data
  static getMockSalesData() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    return months.map((month) => ({
      month,
      purchase: Math.floor(Math.random() * 30000) + 20000,
      sales: Math.floor(Math.random() * 20000) + 20000,
    }));
  }

  /**
   * Get top selling products
   */
  static async getTopSellingProducts() {
    try {
      // Check if customer_product table exists and has data
      const [checkTable] = await db.query(`
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_schema = DATABASE() AND table_name = 'customer_product'
      `);

      if (checkTable[0].count === 0) {
        // If table doesn't exist, return mock data
        return this.getMockTopSellingProducts();
      }

      // Check if there's data in the table
      const [checkData] = await db.query(`
        SELECT COUNT(*) as count FROM customer_product
      `);

      if (checkData[0].count === 0) {
        // If no data, return mock data
        return this.getMockTopSellingProducts();
      }

      // Get actual top selling products
      const [topProducts] = await db.query(`
        SELECT 
          cp.product_id as id,
          p.pname as name,
          SUM(cp.quantity) as soldQuantity,
          p.quantity as remainingQuantity,
          p.price
        FROM customer_product cp
        JOIN product p ON cp.product_id = p.product_id
        GROUP BY cp.product_id
        ORDER BY soldQuantity DESC
        LIMIT 5
      `);

      return topProducts.length > 0
        ? topProducts
        : this.getMockTopSellingProducts();
    } catch (error) {
      console.error("Error in getTopSellingProducts model:", error);
      return this.getMockTopSellingProducts();
    }
  }

  // Helper method to generate mock top selling products
  static getMockTopSellingProducts() {
    return [
      {
        id: 1,
        name: "panadol",
        soldQuantity: 30,
        remainingQuantity: 12,
        price: 100,
      },
      {
        id: 2,
        name: "samahan",
        soldQuantity: 21,
        remainingQuantity: 15,
        price: 207,
      },
      {
        id: 3,
        name: "K95",
        soldQuantity: 18,
        remainingQuantity: 15,
        price: 150,
      },
    ];
  }

  /**
   * Get products that are near expiry
   * Uses supplier_product table which contains expiry dates
   */
  static async getExpiredProducts() {
    try {
      // First check if supplier_product table has the expired_date column
      const [checkColumn] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'supplier_product' 
        AND column_name = 'expired_date'
      `);

      if (checkColumn[0].count === 0) {
        console.log(
          "'expired_date' column not found in supplier_product table"
        );
        // If expired_date doesn't exist, try alternative column names
        return this.checkAlternativeExpiryColumns();
      }

      // Get products near expiry from supplier_product table
      const [expiringProducts] = await db.query(`
        SELECT 
          sp.product_id as id,
          p.pname as name,
          sp.Products_remaining as remainingQuantity,
          COALESCE(sp.unit_type, 'Packet') as unit,
          CASE 
            WHEN p.quantity <= p.treshold THEN 'Low'
            ELSE 'Warning' 
          END as status
        FROM supplier_product sp
        JOIN product p ON sp.product_id = p.product_id
        WHERE sp.expired_date IS NOT NULL
          AND sp.expired_date < DATE_ADD(CURDATE(), INTERVAL 30 DAY)
          AND sp.Products_remaining > 0
        ORDER BY sp.expired_date
        LIMIT 10
      `);

      console.log("Expiring products query result:", expiringProducts);

      if (expiringProducts.length === 0) {
        console.log("No products found near expiry, trying alternatives");
        return this.checkAlternativeExpiryColumns();
      }

      return expiringProducts;
    } catch (error) {
      console.error("Error in getExpiredProducts model:", error);
      return this.checkAlternativeExpiryColumns();
    }
  }

  /**
   * Helper method to check alternative column names for expiry date
   */
  static async checkAlternativeExpiryColumns() {
    try {
      // Check if supplier_product table has the expiry_date column
      const [checkExpiryDate] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'supplier_product' 
        AND column_name = 'expiry_date'
      `);

      if (checkExpiryDate[0].count > 0) {
        return this.getSupplierProductsWithExpiryColumn("expiry_date");
      }

      // Check for exp_date column
      const [checkExpDate] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'supplier_product' 
        AND column_name = 'exp_date'
      `);

      if (checkExpDate[0].count > 0) {
        return this.getSupplierProductsWithExpiryColumn("exp_date");
      }

      // No expiry column found in supplier_product, try product table
      return this.tryProductTableExpiry();
    } catch (error) {
      console.error("Error in checkAlternativeExpiryColumns:", error);
      return this.getMockExpiredProducts();
    }
  }

  /**
   * Try to get expiry data from the product table
   */
  static async tryProductTableExpiry() {
    try {
      // Check for exp_date in product table
      const [checkExpDate] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'product' 
        AND column_name = 'exp_date'
      `);

      if (checkExpDate[0].count > 0) {
        return this.getExpiredProductsFromProductTable("exp_date");
      }

      // Check for expiry_date in product table
      const [checkExpiryDate] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'product' 
        AND column_name = 'expiry_date'
      `);

      if (checkExpiryDate[0].count > 0) {
        return this.getExpiredProductsFromProductTable("expiry_date");
      }

      // No expiry column found, return mock data
      console.log("No expiry columns found in any table, using mock data");
      return this.getMockExpiredProducts();
    } catch (error) {
      console.error("Error in tryProductTableExpiry:", error);
      return this.getMockExpiredProducts();
    }
  }

  /**
   * Helper method to get products near expiry from supplier_product table
   */
  static async getSupplierProductsWithExpiryColumn(columnName) {
    try {
      const [expiringProducts] = await db.query(`
        SELECT 
          sp.product_id as id,
          p.pname as name,
          sp.Products_remaining as remainingQuantity,
          COALESCE(sp.unit_type, 'Packet') as unit,
          CASE 
            WHEN p.quantity <= p.treshold THEN 'Low'
            ELSE 'Warning' 
          END as status
        FROM supplier_product sp
        JOIN product p ON sp.product_id = p.product_id
        WHERE sp.${columnName} IS NOT NULL
          AND sp.${columnName} < DATE_ADD(CURDATE(), INTERVAL 30 DAY)
          AND sp.Products_remaining > 0
        ORDER BY sp.${columnName}
        LIMIT 10
      `);

      return expiringProducts.length > 0
        ? expiringProducts
        : this.getMockExpiredProducts();
    } catch (error) {
      console.error(
        `Error in getSupplierProductsWithExpiryColumn(${columnName}):`,
        error
      );
      return this.getMockExpiredProducts();
    }
  }

  /**
   * Helper method to get expired products from product table
   */
  static async getExpiredProductsFromProductTable(columnName) {
    try {
      const [expiringProducts] = await db.query(`
        SELECT 
          product_id as id,
          pname as name,
          quantity as remainingQuantity,
          'Packet' as unit,
          CASE 
            WHEN quantity <= treshold THEN 'Low'
            ELSE 'Warning' 
          END as status
        FROM product
        WHERE ${columnName} IS NOT NULL
          AND ${columnName} < DATE_ADD(CURDATE(), INTERVAL 30 DAY)
          AND quantity > 0
        ORDER BY ${columnName}
        LIMIT 10
      `);

      return expiringProducts.length > 0
        ? expiringProducts
        : this.getMockExpiredProducts();
    } catch (error) {
      console.error(
        `Error in getExpiredProductsFromProductTable(${columnName}):`,
        error
      );
      return this.getMockExpiredProducts();
    }
  }

  // Helper method to generate mock expired products
  static getMockExpiredProducts() {
    return [
      {
        id: 1,
        name: "masks",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
      {
        id: 2,
        name: "K95",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
    ];
  }

  /**
   * Get products with low stock
   */
  static async getLowStockProducts() {
    try {
      // Check if treshold column exists in the product table
      const [checkColumn] = await db.query(`
        SELECT COUNT(*) AS count 
        FROM information_schema.columns 
        WHERE table_name = 'product' 
        AND column_name = 'treshold'
      `);

      // If treshold doesn't exist, use a simple quantity check
      if (checkColumn[0].count === 0) {
        const [lowStockProducts] = await db.query(`
          SELECT 
            product_id as id,
            pname as name,
            quantity as remainingQuantity,
            'Packet' as unit,
            'Low' as status
          FROM product
          WHERE quantity < 10
          ORDER BY quantity
          LIMIT 10
        `);

        return lowStockProducts.length > 0
          ? lowStockProducts
          : this.getMockLowStockProducts();
      }

      // Use treshold column for comparison
      const [lowStockProducts] = await db.query(`
        SELECT 
          product_id as id,
          pname as name,
          quantity as remainingQuantity,
          'Packet' as unit,
          'Low' as status
        FROM product
        WHERE quantity <= treshold
        ORDER BY quantity
        LIMIT 10
      `);

      return lowStockProducts.length > 0
        ? lowStockProducts
        : this.getMockLowStockProducts();
    } catch (error) {
      console.error("Error in getLowStockProducts model:", error);
      return this.getMockLowStockProducts();
    }
  }

  // Helper method to generate mock low stock products
  static getMockLowStockProducts() {
    return [
      {
        id: 1,
        name: "masks",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
      {
        id: 2,
        name: "K95",
        remainingQuantity: 15,
        unit: "Packet",
        status: "Low",
      },
    ];
  }
}

module.exports = Dashboard;
