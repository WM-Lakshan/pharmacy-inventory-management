const { db } = require("../db");

function formatDateForMySQL(dateString) {
  if (!dateString) return null;

  try {
    // Parse the date (works with both ISO strings and simple date strings)
    const date = new Date(dateString);

    // Check if it's a valid date
    if (isNaN(date.getTime())) {
      console.warn("Invalid date:", dateString);
      return null;
    }

    // Format as YYYY-MM-DD
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date:", error);
    return null;
  }
}

// Calculate total units based on quantity and units per package
function calculateTotalUnits(quantity, unitsPerPackage, unitType) {
  // If it's a singular unit type or unitsPerPackage is not provided, return the quantity as is
  if (!unitsPerPackage || unitsPerPackage <= 1) {
    return quantity;
  }

  // For non-singular units, multiply quantity by units per package
  return quantity * unitsPerPackage;
}

class SupplierOrderModel {
  // Get all supplier orders with supplier names
  static async getAllOrders() {
    try {
      const [rows] = await db.execute(`
        SELECT
          so.oder_id as order_id,
          so.manager_id,
          so.sup_id as supplier_id,
          CONCAT(s.F_name, ' ', s.L_name) as supplier_name,
          so.created_at as order_date,
          SUM(sp.quantity * sp.price) as total_value
        FROM s_oder so
        JOIN supplier s ON so.sup_id = s.sup_id
        JOIN supplier_product sp ON so.oder_id = sp.oder_id
        GROUP BY so.oder_id
        ORDER BY so.created_at DESC
      `);
      return rows;
    } catch (error) {
      console.error("Error fetching supplier orders:", error);
      throw error;
    }
  }

  // Search suppliers by name
  static async searchSuppliers(searchTerm) {
    try {
      const [rows] = await db.execute(
        `
        SELECT
          sup_id as supplier_id,
          CONCAT(F_name, ' ', L_name) as supplier_name,
          email,
          type
        FROM supplier
        WHERE F_name LIKE ? OR L_name LIKE ? OR email LIKE ?
        LIMIT 10
      `,
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      console.error("Error searching suppliers:", error);
      throw error;
    }
  }

  // Get order by ID with complete details
  static async getOrderById(orderId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get order details with supplier name
      const [orderRows] = await connection.execute(
        `SELECT
          so.oder_id as order_id,
          so.manager_id,
          so.sup_id as supplier_id,
          CONCAT(s.F_name, ' ', s.L_name) as supplier_name,
          so.created_at as order_date
        FROM s_oder so
        JOIN supplier s ON so.sup_id = s.sup_id
        WHERE so.oder_id = ?`,
        [orderId]
      );

      if (orderRows.length === 0) {
        await connection.rollback();
        return null;
      }

      const order = orderRows[0];

      // Get products with details
      const [productRows] = await connection.execute(
        `SELECT
          sp.product_id,
          p.pname as product_name,
          sp.quantity,
          sp.price as buying_price,
          (sp.price * sp.quantity) as value,
          sp.expired_date,
          sp.unit_type,
          sp.units_per_package
        FROM supplier_product sp
        JOIN product p ON sp.product_id = p.product_id
        WHERE sp.oder_id = ?`,
        [orderId]
      );

      order.products = productRows || [];
      order.total_value = productRows.reduce(
        (sum, product) => sum + (parseFloat(product.value) || 0),
        0
      );

      await connection.commit();
      return order;
    } catch (error) {
      await connection.rollback();
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Create new order with inventory updates
  static async createOrder(orderData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { supplier_id, manager_id, products } = orderData;

      // Create order header
      const [orderResult] = await connection.execute(
        `INSERT INTO s_oder (sup_id, manager_id, created_at)
         VALUES (?, ?, NOW())`,
        [supplier_id, manager_id]
      );

      const orderId = orderResult.insertId;

      // Add products and update inventory
      for (const product of products) {
        // Format the date
        const formattedExpiryDate = formatDateForMySQL(product.expired_date);

        // Ensure unit_type and units_per_package have defaults
        const unitType = product.unit_type || "unit";
        const unitsPerPackage = product.units_per_package || 1;

        // Calculate total units for inventory update
        const totalUnits = calculateTotalUnits(
          product.quantity,
          unitsPerPackage,
          unitType
        );

        await connection.execute(
          `INSERT INTO supplier_product
           (sup_id, product_id, oder_id, quantity, price, expired_date, unit_type, units_per_package,Products_remaining)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`,
          [
            supplier_id,
            product.product_id,
            orderId,
            product.quantity,
            product.buying_price,
            formattedExpiryDate,
            unitType,
            unitsPerPackage,
            totalUnits,
          ]
        );

        // Update product quantity with total units
        await connection.execute(
          `UPDATE product
           SET quantity = quantity + ?
           WHERE product_id = ?`,
          [totalUnits, product.product_id]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      console.error("Error creating order:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update order with inventory management
  static async updateOrder(orderId, orderData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { products } = orderData;

      // Get current products in the order
      const [currentProducts] = await connection.execute(
        `SELECT * FROM supplier_product WHERE oder_id = ?`,
        [orderId]
      );

      // Get supplier ID
      const [supplierResult] = await connection.execute(
        `SELECT sup_id FROM s_oder WHERE oder_id = ?`,
        [orderId]
      );
      const supplierId = supplierResult[0].sup_id;

      // Process each product in the updated order
      for (const product of products) {
        // Format the date
        const formattedExpiryDate = formatDateForMySQL(product.expired_date);

        // Ensure unit_type and units_per_package have defaults
        const unitType = product.unit_type || "unit";
        const unitsPerPackage = product.units_per_package || 1;

        const existingProduct = currentProducts.find(
          (p) => p.product_id === product.product_id
        );

        if (existingProduct) {
          // Calculate base quantity difference
          const quantityDiff = product.quantity - existingProduct.quantity;

          // Calculate old and new total units
          const oldTotalUnits = calculateTotalUnits(
            existingProduct.quantity,
            existingProduct.units_per_package || 1,
            existingProduct.unit_type || "unit"
          );

          const newTotalUnits = calculateTotalUnits(
            product.quantity,
            unitsPerPackage,
            unitType
          );

          // The actual difference in units for inventory
          const totalUnitsDiff = newTotalUnits - oldTotalUnits;

          // Update order product
          await connection.execute(
            `UPDATE supplier_product
             SET quantity = ?, price = ?, expired_date = ?, unit_type = ?, units_per_package = ?, Products_remaining = ?
             WHERE oder_id = ? AND product_id = ?`,
            [
              product.quantity,
              product.buying_price,
              formattedExpiryDate,
              unitType,
              unitsPerPackage,
              orderId,
              product.product_id,
              totalUnits,
            ]
          );

          // Update inventory if total units changed
          if (totalUnitsDiff !== 0) {
            await connection.execute(
              `UPDATE product
               SET quantity = quantity + ?
               WHERE product_id = ?`,
              [totalUnitsDiff, product.product_id]
            );
          }
        } else {
          // Calculate total units for new product
          const totalUnits = calculateTotalUnits(
            product.quantity,
            unitsPerPackage,
            unitType
          );

          // Add new product to order
          await connection.execute(
            `INSERT INTO supplier_product
             (sup_id, product_id, oder_id, quantity, price, expired_date, unit_type, units_per_package)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              supplierId,
              product.product_id,
              orderId,
              product.quantity,
              product.buying_price,
              formattedExpiryDate,
              unitType,
              unitsPerPackage,
            ]
          );

          // Update inventory with total units
          await connection.execute(
            `UPDATE product
             SET quantity = quantity + ?
             WHERE product_id = ?`,
            [totalUnits, product.product_id]
          );
        }
      }

      // Handle removed products
      const updatedProductIds = products.map((p) => p.product_id);
      const removedProducts = currentProducts.filter(
        (p) => !updatedProductIds.includes(p.product_id)
      );

      for (const product of removedProducts) {
        // Calculate total units to remove
        const totalUnitsToRemove = calculateTotalUnits(
          product.quantity,
          product.units_per_package || 1,
          product.unit_type || "unit"
        );

        // Remove from order
        await connection.execute(
          `DELETE FROM supplier_product
           WHERE oder_id = ? AND product_id = ?`,
          [orderId, product.product_id]
        );

        // Revert inventory with total units
        await connection.execute(
          `UPDATE product
           SET quantity = quantity - ?
           WHERE product_id = ?`,
          [totalUnitsToRemove, product.product_id]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error(`Error updating order ${orderId}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete order with inventory reversion
  static async deleteOrder(orderId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get all products in the order with their unit types and units per package
      const [products] = await connection.execute(
        `SELECT product_id, quantity, unit_type, units_per_package FROM supplier_product WHERE oder_id = ?`,
        [orderId]
      );

      // Delete products from order
      await connection.execute(
        `DELETE FROM supplier_product WHERE oder_id = ?`,
        [orderId]
      );

      // Delete the order
      const [result] = await connection.execute(
        `DELETE FROM s_oder WHERE oder_id = ?`,
        [orderId]
      );

      // Revert inventory for all products
      for (const product of products) {
        // Calculate total units to remove
        const totalUnitsToRemove = calculateTotalUnits(
          product.quantity,
          product.units_per_package || 1,
          product.unit_type || "unit"
        );

        await connection.execute(
          `UPDATE product
           SET quantity = quantity - ?
           WHERE product_id = ?`,
          [totalUnitsToRemove, product.product_id]
        );
      }

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error(`Error deleting order ${orderId}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all products for order creation
  static async getAllProducts() {
    try {
      const [rows] = await db.execute(`
        SELECT
          p.product_id as id,
          p.pname as name,
          p.price,
          p.quantity as current_stock,
          pc.name as category,
          p.type as product_type,
          'unit' as default_unit_type,
          1 as default_units_per_package
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        ORDER BY p.pname
      `);
      return rows;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
}

module.exports = SupplierOrderModel;
