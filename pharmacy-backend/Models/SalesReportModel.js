
const { db } = require("../db");

class SalesReportModel {
  /**
   * Get sales report data with specified filters
   */
  static async getSalesReport(filters) {
    try {
      const {
        startDate,
        endDate,
        type = "daily", // daily, weekly, monthly, yearly
        managerId,
      } = filters;

      let dateQuery = "";
      let params = [];

      // Build date filter condition
      if (startDate && endDate) {
        dateQuery = "AND co.created_at BETWEEN ? AND ?";
        params.push(startDate, endDate);
      }

      // Determine query based on report type
      let groupByClause = "";
      let selectDateFormat = "";
      let orderByClause = "";

      switch (type) {
        case "daily":
          selectDateFormat = "DATE(co.created_at) as date";
          groupByClause = "GROUP BY DATE(co.created_at)";
          orderByClause = "ORDER BY DATE(co.created_at) DESC";
          break;
        case "weekly":
          selectDateFormat =
            "YEARWEEK(co.created_at) as date_key, DATE_FORMAT(co.created_at, '%Y-Week %u') as date";
          groupByClause =
            "GROUP BY YEARWEEK(co.created_at), DATE_FORMAT(co.created_at, '%Y-Week %u')";
          orderByClause = "ORDER BY date_key DESC";
          break;
        case "monthly":
          selectDateFormat =
            "DATE_FORMAT(co.created_at, '%Y-%m') as date_key, DATE_FORMAT(co.created_at, '%Y-%m') as date";
          groupByClause = "GROUP BY DATE_FORMAT(co.created_at, '%Y-%m')";
          orderByClause = "ORDER BY date_key DESC";
          break;
        case "yearly":
          selectDateFormat =
            "YEAR(co.created_at) as date_key, YEAR(co.created_at) as date";
          groupByClause = "GROUP BY YEAR(co.created_at)";
          orderByClause = "ORDER BY date_key DESC";
          break;
        default:
          // Default to daily view
          selectDateFormat = "DATE(co.created_at) as date";
          groupByClause = "GROUP BY DATE(co.created_at)";
          orderByClause = "ORDER BY DATE(co.created_at) DESC";
      }

      // For summary data (aggregated by time period)
      const summaryQuery = `
      SELECT 
        ${selectDateFormat},
        COUNT(DISTINCT co.cus_oder_id) as order_count,
        SUM(co.value) as total_sales
      FROM 
        cus_oder co
      WHERE 
        1=1 ${dateQuery}
      ${groupByClause}
      ${orderByClause}
    `;

      // For detailed order information
      const query = `
      SELECT 
        co.cus_oder_id,
        co.value,
        co.oder_status as status,
        co.created_at,
        DATE(co.created_at) as date,
        c.name as customer_name,
        p.payment_method,
        (SELECT COUNT(*) FROM customer_product cp WHERE cp.cus_oder_id = co.cus_oder_id) as items_count
      FROM 
        cus_oder co
      LEFT JOIN 
        customer c ON co.customer_id = c.customer_id
      LEFT JOIN 
        payments p ON p.cus_oder_id = co.cus_oder_id
      WHERE 
        1=1 ${dateQuery}
      ORDER BY 
        co.created_at DESC
    `;

      // Execute queries
      const [sales] = await db.execute(query, params);
      const [summary] = await db.execute(summaryQuery, params);

      return {
        sales,
        summary,
      };
    } catch (error) {
      console.error("Error in getSalesReport:", error);
      throw error;
    }
  }

  /**
   * Get payment methods distribution
   */
  static async getPaymentMethodsDistribution(filters) {
    try {
      const { startDate, endDate } = filters;
      let dateQuery = "";
      let params = [];

      // Build date filter condition
      if (startDate && endDate) {
        dateQuery = "AND co.created_at BETWEEN ? AND ?";
        params.push(startDate, endDate);
      }

      const query = `
        SELECT 
          p.payment_method,
          COUNT(*) as count,
          SUM(p.amount) as total_amount
        FROM 
          payments p
        JOIN 
          cus_oder co ON p.cus_oder_id = co.cus_oder_id
        WHERE 
          1=1 ${dateQuery}
        GROUP BY 
          p.payment_method
      `;

      const [results] = await db.execute(query, params);

      return results;
    } catch (error) {
      console.error("Error in getPaymentMethodsDistribution:", error);
      throw error;
    }
  }

  /**
   * Get top selling products
   */
  static async getTopSellingProducts(filters = {}) {
    try {
      const { startDate, endDate, limit = 10 } = filters;
      let params = [];
      let whereClause = "";

      // Add date filter if provided
      if (startDate && endDate) {
        whereClause = "AND co.created_at BETWEEN ? AND ?";
        params.push(startDate, endDate);
      }

      // // Add limit (ensure it's a number)
      // const limitValue = parseInt(limit, 10);
      // params.push(isNaN(limitValue) ? 10 : limitValue);

      const query = `
       SELECT 
        p.product_id,
        p.pname as product_name,
        SUM(cp.quantity) as total_quantity,
        SUM(cp.quantity * cp.price) as total_sales,
        AVG(cp.price) as average_price,
        pc.name as category_name
    FROM 
        customer_product cp
    JOIN 
        product p ON cp.product_id = p.product_id
    LEFT JOIN 
        product_cato pc ON p.product_cato_id = pc.product_cato_id
    JOIN 
        cus_oder co ON cp.cus_oder_id = co.cus_oder_id
    WHERE 
        1=1 AND co.created_at BETWEEN ? AND ?
    GROUP BY 
        p.product_id
    ORDER BY 
        total_quantity DESC
    `;

      const [results] = await db.execute(query, params);
      return results;
    } catch (error) {
      console.error("Error in getTopSellingProducts:", error);
      throw error;
    }
  }
}

module.exports = SalesReportModel;
