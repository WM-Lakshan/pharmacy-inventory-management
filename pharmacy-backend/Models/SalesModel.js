const { db } = require("../db");

class SalesModel {
  // Get all sales with basic information
  static async getAllSales() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          co.cus_oder_id as order_id,
          co.prescription_id,
          co.value,
          co.customer_id,
          co.pharmacy_staff_id as staff_id,
          DATE_FORMAT(co.created_at, '%d/%m/%y') as time,
          co.oder_status as status
        FROM cus_oder co
        ORDER BY co.created_at DESC
      `);
      //console.log("Sales Query Results:", rows);

      return rows;
    } catch (error) {
      console.error("Error fetching sales:", error);
      throw error;
    }
  }

  // Get a specific sale by ID with complete details including products
  // static async getSaleById(saleId) {
  //   const connection = await db.getConnection();
  //   try {
  //     await connection.beginTransaction();

  //     // Get sale details
  //     const [saleRows] = await connection.execute(
  //       `SELECT
  //         co.cus_oder_id as order_id,
  //         co.prescription_id,
  //         co.value as totalValue,
  //         co.customer_id,
  //         co.pharmacy_staff_id as staff_id,
  //         DATE_FORMAT(co.created_at, '%d/%m/%y') as time,
  //         co.oder_status as status
  //       FROM cus_oder co
  //       WHERE co.cus_oder_id = ?`,
  //       [saleId]
  //     );

  //     if (saleRows.length === 0) {
  //       await connection.rollback();
  //       return null;
  //     }

  //     const sale = saleRows[0];

  //     // Get products associated with the sale
  //     const [productRows] = await connection.execute(
  //       `SELECT
  //         oi.product_id,
  //         p.pname as product_name,
  //         oi.quantity,
  //         oi.price_at_purchase as price,
  //         (oi.price_at_purchase * oi.quantity) as value
  //       FROM order_items oi
  //       JOIN product p ON oi.product_id = p.product_id
  //       WHERE oi.cus_oder_id = ?`,
  //       [saleId]
  //     );

  //     sale.products = productRows || [];

  //     await connection.commit();
  //     return sale;
  //   } catch (error) {
  //     await connection.rollback();
  //     console.error(`Error fetching sale with ID ${saleId}:`, error);
  //     throw error;
  //   } finally {
  //     if (connection) connection.release();
  //   }
  // }

  static async getSaleById(saleId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      console.log(`SalesModel: Fetching sale ID ${saleId}`);

      // Get sale details
      const [saleRows] = await connection.execute(
        `SELECT 
        co.cus_oder_id as order_id,
        co.prescription_id,
        co.value as totalValue,
        co.customer_id,
        co.pharmacy_staff_id as staff_id,
        DATE_FORMAT(co.created_at, '%d/%m/%y') as time,
        co.oder_status as status
      FROM cus_oder co
      WHERE co.cus_oder_id = ?`,
        [saleId]
      );

      if (saleRows.length === 0) {
        console.log(`SalesModel: No sale found with ID ${saleId}`);
        await connection.rollback();
        return null;
      }

      const sale = saleRows[0];
      console.log(`SalesModel: Found sale ${JSON.stringify(sale)}`);

      // Get products associated with the sale - checking both customer_product and order_items tables
      let productRows = [];

      // First try customer_product table
      const [customerProducts] = await connection.execute(
        `SELECT 
        cp.product_id,
        p.pname as product_name,
        cp.quantity,
        cp.price as price,
        (cp.price * cp.quantity) as value
      FROM customer_product cp
      JOIN product p ON cp.product_id = p.product_id
      WHERE cp.cus_oder_id = ?`,
        [saleId]
      );

      if (customerProducts.length > 0) {
        console.log(
          `SalesModel: Found ${customerProducts.length} products in customer_product table`
        );
        productRows = customerProducts;
      } else {
        // Try order_items table
        const [orderItems] = await connection.execute(
          `SELECT 
          oi.product_id,
          p.pname as product_name,
          oi.quantity,
          IFNULL(oi.price_at_purchase, p.price) as price,
          (IFNULL(oi.price_at_purchase, p.price) * oi.quantity) as value
        FROM order_items oi
        JOIN product p ON oi.product_id = p.product_id
        WHERE oi.cus_oder_id = ?`,
          [saleId]
        );

        console.log(
          `SalesModel: Found ${orderItems.length} products in order_items table`
        );
        productRows = orderItems;
      }

      // If still no products found, as a last resort, check if there's any data in prescription_product
      if (productRows.length === 0 && sale.prescription_id) {
        const [prescriptionProducts] = await connection.execute(
          `SELECT 
          pp.product_id,
          p.pname as product_name,
          pp.quantity,
          p.price as price,
          (p.price * pp.quantity) as value
        FROM prescription_product pp
        JOIN product p ON pp.product_id = p.product_id
        WHERE pp.prescription_id = ?`,
          [sale.prescription_id]
        );

        console.log(
          `SalesModel: Found ${prescriptionProducts.length} products in prescription_product table`
        );
        productRows = prescriptionProducts;
      }

      sale.products = productRows || [];
      console.log(
        `SalesModel: Returning sale with ${sale.products.length} products`
      );

      await connection.commit();
      return sale;
    } catch (error) {
      await connection.rollback();
      console.error(`Error fetching sale with ID ${saleId}:`, error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  // Update an existing sale - only managers can do this
  static async updateSale(saleId, saleData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Check if sale exists
      const [saleCheck] = await connection.execute(
        `SELECT cus_oder_id FROM cus_oder WHERE cus_oder_id = ?`,
        [saleId]
      );

      if (saleCheck.length === 0) {
        await connection.rollback();
        return false;
      }

      // 2. Update sale status
      await connection.execute(
        `UPDATE cus_oder SET 
          oder_status = ?,
          prescription_id = ?,
          pharmacy_staff_id = ?,
          value = ?
        WHERE cus_oder_id = ?`,
        [
          saleData.status,
          saleData.prescription_id,
          saleData.pharmacy_staff_id,
          saleData.totalValue,
          saleId,
        ]
      );

      // 3. Process product updates
      // First, get current products in the order
      const [currentProducts] = await connection.execute(
        `SELECT * FROM order_items WHERE cus_oder_id = ?`,
        [saleId]
      );

      // Process each product in the updated sale
      for (const updatedProduct of saleData.products) {
        const existingProduct = currentProducts.find(
          (p) => p.product_id === parseInt(updatedProduct.product_id)
        );

        if (existingProduct) {
          // Calculate quantity difference for inventory update
          const quantityDiff =
            updatedProduct.quantity - existingProduct.quantity;

          // Update order product entry
          await connection.execute(
            `UPDATE order_items 
             SET quantity = ?, price_at_purchase = ?
             WHERE cus_oder_id = ? AND product_id = ?`,
            [
              updatedProduct.quantity,
              updatedProduct.price,
              saleId,
              updatedProduct.product_id,
            ]
          );

          // Update product inventory (subtract additional quantity or add back reduced quantity)
          if (quantityDiff !== 0) {
            await connection.execute(
              `UPDATE product 
               SET quantity = quantity - ? 
               WHERE product_id = ?`,
              [quantityDiff, updatedProduct.product_id]
            );
          }
        } else {
          // Add new product to order
          await connection.execute(
            `INSERT INTO order_items 
             (cus_oder_id, product_id, quantity, price_at_purchase)
             VALUES (?, ?, ?, ?)`,
            [
              saleId,
              updatedProduct.product_id,
              updatedProduct.quantity,
              updatedProduct.price,
            ]
          );

          // Update product inventory (subtract newly added product quantity)
          await connection.execute(
            `UPDATE product 
             SET quantity = quantity - ? 
             WHERE product_id = ?`,
            [updatedProduct.quantity, updatedProduct.product_id]
          );
        }
      }

      // 4. Handle removed products
      const updatedProductIds = saleData.products.map((p) =>
        parseInt(p.product_id)
      );
      const removedProducts = currentProducts.filter(
        (p) => !updatedProductIds.includes(p.product_id)
      );

      for (const product of removedProducts) {
        // Remove from order
        await connection.execute(
          `DELETE FROM order_items 
           WHERE cus_oder_id = ? AND product_id = ?`,
          [saleId, product.product_id]
        );

        // Restore inventory quantity
        await connection.execute(
          `UPDATE product 
           SET quantity = quantity + ? 
           WHERE product_id = ?`,
          [product.quantity, product.product_id]
        );
      }

      // 5. Recalculate and update total value
      const [totalResult] = await connection.execute(
        `SELECT SUM(quantity * price_at_purchase) as total
         FROM order_items
         WHERE cus_oder_id = ?`,
        [saleId]
      );

      await connection.execute(
        `UPDATE cus_oder SET value = ? WHERE cus_oder_id = ?`,
        [totalResult[0].total || 0, saleId]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error(`Error updating sale with ID ${saleId}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete a sale - only managers can do this
  static async deleteSale(saleId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Get all products in the order to restore inventory
      const [orderProducts] = await connection.execute(
        `SELECT product_id, quantity FROM order_items WHERE cus_oder_id = ?`,
        [saleId]
      );

      // 2. Restore quantities to product inventory
      for (const product of orderProducts) {
        await connection.execute(
          `UPDATE product 
           SET quantity = quantity + ? 
           WHERE product_id = ?`,
          [product.quantity, product.product_id]
        );
      }

      // 3. Delete the order items
      await connection.execute(
        `DELETE FROM order_items WHERE cus_oder_id = ?`,
        [saleId]
      );

      // 4. Delete the order itself
      const [result] = await connection.execute(
        `DELETE FROM cus_oder WHERE cus_oder_id = ?`,
        [saleId]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error(`Error deleting sale with ID ${saleId}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all products for search functionality
  static async getAllProducts() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          p.product_id as id,
          p.pname as name,
          p.price,
          p.quantity as current_stock,
          pc.name as category
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

module.exports = SalesModel;




