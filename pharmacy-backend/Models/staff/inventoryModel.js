// // models/inventory.model.js
// const { db } = require("../../db");

// class InventoryModel {
//   /**
//    * Get all inventory products with filtering and pagination
//    */
//   static async getAllProducts(options = {}) {
//     try {
//       const {
//         page = 1,
//         pageSize = 10,
//         category = null,
//         search = null,
//         inStock = null,
//       } = options;

//       const offset = (page - 1) * pageSize;

//       // Base query with joins to get category information
//       let query = `
//         SELECT
//           p.product_id as id,
//           p.pname as name,
//           p.price,
//           p.quantity,
//           p.status as description,
//           p.type as prescriptionRequired,
//           p.image,
//           pc.name as category,
//           CASE WHEN p.quantity > 0 THEN 'In-stock' ELSE 'Out of stock' END as availability
//         FROM
//           product p
//         LEFT JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         WHERE 1=1
//       `;

//       const params = [];

//       // Add search filter
//       if (search) {
//         query += ` AND (p.pname LIKE ? OR pc.name LIKE ?)`;
//         params.push(`%${search}%`, `%${search}%`);
//       }

//       // Add category filter
//       if (category) {
//         query += ` AND pc.product_cato_id = ?`;
//         params.push(category);
//       }

//       // Add in-stock filter
//       if (inStock !== null) {
//         if (inStock) {
//           query += ` AND p.quantity > 0`;
//         } else {
//           query += ` AND p.quantity <= 0`;
//         }
//       }

//       // Add sorting
//       query += ` ORDER BY p.product_id DESC`;

//       //   // Add pagination
//       //   query += ` LIMIT ? OFFSET ?`;
//       //   params.push(parseInt(pageSize), parseInt(offset));

//       // Execute query
//       const [products] = await db.execute(query, params);

//       // Format price as string with Rs. prefix
//       const formattedProducts = products.map((product) => ({
//         ...product,
//         price: `Rs.${product.price}`,
//         quantity: `${product.quantity} Units`,
//       }));

//       // Get total count for pagination
//       let countQuery = `
//         SELECT COUNT(*) as total
//         FROM product p
//         LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
//         WHERE 1=1
//       `;

//       const countParams = [];

//       if (search) {
//         countQuery += ` AND (p.pname LIKE ? OR pc.name LIKE ?)`;
//         countParams.push(`%${search}%`, `%${search}%`);
//       }

//       if (category) {
//         countQuery += ` AND pc.product_cato_id = ?`;
//         countParams.push(category);
//       }

//       if (inStock !== null) {
//         if (inStock) {
//           countQuery += ` AND p.quantity > 0`;
//         } else {
//           countQuery += ` AND p.quantity <= 0`;
//         }
//       }

//       const [countResult] = await db.execute(countQuery, countParams);
//       const total = countResult[0].total;

//       return {
//         products: formattedProducts,
//         total,
//         page,
//         pages: Math.ceil(total / pageSize),
//       };
//     } catch (error) {
//       console.error("Error in InventoryModel.getAllProducts:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get inventory product details by ID
//    */
//   static async getProductById(productId) {
//     try {
//       const query = `
//         SELECT
//           p.product_id as id,
//           p.pname as name,
//           p.price,
//           p.quantity,
//           p.status as description,
//           p.type as prescriptionRequired,
//           p.exp_date as expiryDate,
//           p.image,
//           pc.name as category,
//           CASE WHEN p.quantity > 0 THEN 'In-stock' ELSE 'Out of stock' END as availability
//         FROM
//           product p
//         LEFT JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         WHERE
//           p.product_id = ?
//       `;

//       const [products] = await db.execute(query, [productId]);

//       if (products.length === 0) {
//         return null;
//       }

//       const product = products[0];

//       // Format price and quantity
//       product.price = `Rs.${product.price}`;
//       product.quantity = `${product.quantity} Units`;

//       return product;
//     } catch (error) {
//       console.error("Error in InventoryModel.getProductById:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get all product categories
//    */
//   static async getCategories() {
//     try {
//       const query = `
//         SELECT
//           pc.product_cato_id as id,
//           pc.name,
//           pc.description,
//           COUNT(p.product_id) as productCount
//         FROM
//           product_cato pc
//         LEFT JOIN
//           product p ON pc.product_cato_id = p.product_cato_id
//         GROUP BY
//           pc.product_cato_id
//         ORDER BY
//           pc.name
//       `;

//       const [categories] = await db.execute(query);
//       return categories;
//     } catch (error) {
//       console.error("Error in InventoryModel.getCategories:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get low-stock products (below threshold)
//    */
//   static async getLowStockProducts() {
//     try {
//       const query = `
//         SELECT
//           p.product_id as id,
//           p.pname as name,
//           p.price,
//           p.quantity,
//           p.treshold as threshold,
//           p.status as description,
//           p.image,
//           pc.name as category
//         FROM
//           product p
//         LEFT JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         WHERE
//           p.quantity <= p.treshold
//         ORDER BY
//           (p.quantity / p.treshold) ASC
//       `;

//       const [products] = await db.execute(query);

//       // Format price and quantity
//       const formattedProducts = products.map((product) => ({
//         ...product,
//         price: `Rs.${product.price}`,
//         quantity: `${product.quantity} Units`,
//       }));

//       return formattedProducts;
//     } catch (error) {
//       console.error("Error in InventoryModel.getLowStockProducts:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get products expiring soon (within 30 days)
//    */
//   static async getExpiringProducts(days = 30) {
//     try {
//       const query = `
//         SELECT
//           p.product_id as id,
//           p.pname as name,
//           p.price,
//           p.quantity,
//           p.status as description,
//           p.exp_date as expiryDate,
//           p.image,
//           pc.name as category,
//           DATEDIFF(p.exp_date, CURDATE()) as daysRemaining
//         FROM
//           product p
//         LEFT JOIN
//           product_cato pc ON p.product_cato_id = pc.product_cato_id
//         WHERE
//           p.exp_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
//           AND p.quantity > 0
//         ORDER BY
//           p.exp_date ASC
//       `;

//       const [products] = await db.execute(query, [days]);

//       // Format price and quantity
//       const formattedProducts = products.map((product) => ({
//         ...product,
//         price: `Rs.${product.price}`,
//         quantity: `${product.quantity} Units`,
//       }));

//       return formattedProducts;
//     } catch (error) {
//       console.error("Error in InventoryModel.getExpiringProducts:", error);
//       throw error;
//     }
//   }

//   /**
//    * Update product stock
//    */
//   static async updateProductStock(productId, newQuantity, staffId) {
//     try {
//       const connection = await db.getConnection();
//       await connection.beginTransaction();

//       try {
//         // Get current quantity
//         const [productResult] = await connection.execute(
//           "SELECT quantity FROM product WHERE product_id = ?",
//           [productId]
//         );

//         if (productResult.length === 0) {
//           throw new Error("Product not found");
//         }

//         const oldQuantity = productResult[0].quantity;

//         // Update product quantity
//         await connection.execute(
//           "UPDATE product SET quantity = ? WHERE product_id = ?",
//           [newQuantity, productId]
//         );

//         // Log the stock update in inventory table
//         await connection.execute(
//           `INSERT INTO inventory
//             (product_id, quantity, Buying_price, date, exp_date)
//            VALUES (?, ?, 0, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR))`,
//           [productId, newQuantity - oldQuantity]
//         );

//         // Create notification for manager
//         await connection.execute(
//           `INSERT INTO notifications
//             (user_id, user_type, title, message, is_read)
//            VALUES (?, 'manager', 'Stock Updated', 'Product ID ${productId} stock updated from ${oldQuantity} to ${newQuantity}', FALSE)`,
//           [1] // Assuming manager ID 1 or adjust as needed
//         );

//         await connection.commit();
//         return {
//           success: true,
//           oldQuantity,
//           newQuantity,
//         };
//       } catch (error) {
//         await connection.rollback();
//         throw error;
//       } finally {
//         connection.release();
//       }
//     } catch (error) {
//       console.error("Error in InventoryModel.updateProductStock:", error);
//       throw error;
//     }
//   }

//   /**
//    * Get inventory history for a product
//    */
//   static async getInventoryHistory(productId) {
//     try {
//       const query = `
//         SELECT
//           i.inventory_id,
//           i.date,
//           i.quantity,
//           i.Buying_price as buyingPrice,
//           i.exp_date as expiryDate,
//           o.oder_id as orderId,
//           s.sup_id as supplierId,
//           CONCAT(s.F_name, ' ', s.L_name) as supplierName
//         FROM
//           inventory i
//         LEFT JOIN
//           s_oder o ON i.oder_id = o.oder_id
//         LEFT JOIN
//           supplier s ON o.sup_id = s.sup_id
//         WHERE
//           i.product_id = ?
//         ORDER BY
//           i.date DESC
//       `;

//       const [history] = await db.execute(query, [productId]);
//       return history;
//     } catch (error) {
//       console.error("Error in InventoryModel.getInventoryHistory:", error);
//       throw error;
//     }
//   }
// }

// module.exports = InventoryModel;

// models/inventory.model.js
const { db } = require("../../db");

class InventoryModel {
  /**
   * Get all inventory products with filtering and pagination
   */
  static async getAllProducts(options = {}) {
    try {
      const {
        page = 1,
        pageSize = 10,
        category = null,
        search = null,
        inStock = null,
      } = options;

      const offset = (page - 1) * pageSize;

      // Base query with joins to get category information
      let query = `
        SELECT 
          p.product_id as id, 
          p.pname as name, 
          p.price, 
          p.quantity, 
          p.status as description, 
          p.type as prescriptionRequired,
          p.image,
          pc.name as category,
          CASE WHEN p.quantity > 0 THEN 'In-stock' ELSE 'Out of stock' END as availability
        FROM 
          product p
        LEFT JOIN 
          product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 1=1
      `;

      const params = [];

      // Add search filter
      if (search) {
        query += ` AND (p.pname LIKE ? OR pc.name LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      // Add category filter
      if (category) {
        query += ` AND pc.product_cato_id = ?`;
        params.push(category);
      }

      // Add in-stock filter
      if (inStock !== null) {
        if (inStock) {
          query += ` AND p.quantity > 0`;
        } else {
          query += ` AND p.quantity <= 0`;
        }
      }

      // Add sorting
      query += ` ORDER BY p.product_id DESC`;

      //   // Add pagination
      //   query += ` LIMIT ? OFFSET ?`;
      //   params.push(parseInt(pageSize), parseInt(offset));

      // Execute query
      const [products] = await db.execute(query, params);

      // Format price as string with Rs. prefix and format prescription required info
      const formattedProducts = products.map((product) => ({
        ...product,
        price: `Rs.${product.price}`,
        quantity: `${product.quantity} Units`,
        prescriptionRequired:
          product.prescriptionRequired === "prescription needed"
            ? "Required"
            : "Not Required",
      }));

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 1=1
      `;

      const countParams = [];

      if (search) {
        countQuery += ` AND (p.pname LIKE ? OR pc.name LIKE ?)`;
        countParams.push(`%${search}%`, `%${search}%`);
      }

      if (category) {
        countQuery += ` AND pc.product_cato_id = ?`;
        countParams.push(category);
      }

      if (inStock !== null) {
        if (inStock) {
          countQuery += ` AND p.quantity > 0`;
        } else {
          countQuery += ` AND p.quantity <= 0`;
        }
      }

      const [countResult] = await db.execute(countQuery, countParams);
      const total = countResult[0].total;

      return {
        products: formattedProducts,
        total,
        page,
        pages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      console.error("Error in InventoryModel.getAllProducts:", error);
      throw error;
    }
  }

  /**
   * Get inventory product details by ID
   */
  static async getProductById(productId) {
    try {
      const query = `
        SELECT 
          p.product_id as id, 
          p.pname as name, 
          p.price, 
          p.quantity, 
          p.status as description, 
          p.type as prescriptionRequired,
          p.exp_date as expiryDate,
          p.image,
          pc.name as category,
          CASE WHEN p.quantity > 0 THEN 'In-stock' ELSE 'Out of stock' END as availability
        FROM 
          product p
        LEFT JOIN 
          product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 
          p.product_id = ?
      `;

      const [products] = await db.execute(query, [productId]);

      if (products.length === 0) {
        return null;
      }

      const product = products[0];

      // Format price and quantity and prescription required
      product.price = `Rs.${product.price}`;
      product.quantity = `${product.quantity} Units`;
      product.prescriptionRequired =
        product.prescriptionRequired === "prescription needed"
          ? "Required"
          : "Not Required";

      return product;
    } catch (error) {
      console.error("Error in InventoryModel.getProductById:", error);
      throw error;
    }
  }

  /**
   * Get all product categories
   */
  static async getCategories() {
    try {
      const query = `
        SELECT 
          pc.product_cato_id as id, 
          pc.name, 
          pc.description,
          COUNT(p.product_id) as productCount
        FROM 
          product_cato pc
        LEFT JOIN 
          product p ON pc.product_cato_id = p.product_cato_id
        GROUP BY 
          pc.product_cato_id
        ORDER BY 
          pc.name
      `;

      const [categories] = await db.execute(query);
      return categories;
    } catch (error) {
      console.error("Error in InventoryModel.getCategories:", error);
      throw error;
    }
  }

  /**
   * Get low-stock products (below threshold)
   */
  static async getLowStockProducts() {
    try {
      const query = `
        SELECT 
          p.product_id as id, 
          p.pname as name, 
          p.price, 
          p.quantity, 
          p.treshold as threshold,
          p.status as description, 
          p.type as prescriptionRequired,
          p.image,
          pc.name as category
        FROM 
          product p
        LEFT JOIN 
          product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 
          p.quantity <= p.treshold
        ORDER BY 
          (p.quantity / p.treshold) ASC
      `;

      const [products] = await db.execute(query);

      // Format price and quantity
      const formattedProducts = products.map((product) => ({
        ...product,
        price: `Rs.${product.price}`,
        quantity: `${product.quantity} Units`,
        prescriptionRequired:
          product.prescriptionRequired === "prescription needed"
            ? "Required"
            : "Not Required",
      }));

      return formattedProducts;
    } catch (error) {
      console.error("Error in InventoryModel.getLowStockProducts:", error);
      throw error;
    }
  }

  /**
   * Get products expiring soon (within 30 days)
   */
  static async getExpiringProducts(days = 30) {
    try {
      const query = `
        SELECT 
          p.product_id as id, 
          p.pname as name, 
          p.price, 
          p.quantity, 
          p.status as description, 
          p.type as prescriptionRequired,
          p.exp_date as expiryDate,
          p.image,
          pc.name as category,
          DATEDIFF(p.exp_date, CURDATE()) as daysRemaining
        FROM 
          product p
        LEFT JOIN 
          product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 
          p.exp_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
          AND p.quantity > 0
        ORDER BY 
          p.exp_date ASC
      `;

      const [products] = await db.execute(query, [days]);

      // Format price and quantity
      const formattedProducts = products.map((product) => ({
        ...product,
        price: `Rs.${product.price}`,
        quantity: `${product.quantity} Units`,
        prescriptionRequired:
          product.prescriptionRequired === "prescription needed"
            ? "Required"
            : "Not Required",
      }));

      return formattedProducts;
    } catch (error) {
      console.error("Error in InventoryModel.getExpiringProducts:", error);
      throw error;
    }
  }

  /**
   * Update product stock
   */
  static async updateProductStock(productId, newQuantity, staffId) {
    try {
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Get current quantity
        const [productResult] = await connection.execute(
          "SELECT quantity FROM product WHERE product_id = ?",
          [productId]
        );

        if (productResult.length === 0) {
          throw new Error("Product not found");
        }

        const oldQuantity = productResult[0].quantity;

        // Update product quantity
        await connection.execute(
          "UPDATE product SET quantity = ? WHERE product_id = ?",
          [newQuantity, productId]
        );

        // Log the stock update in inventory table
        await connection.execute(
          `INSERT INTO inventory 
            (product_id, quantity, Buying_price, date, exp_date) 
           VALUES (?, ?, 0, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR))`,
          [productId, newQuantity - oldQuantity]
        );

        // Create notification for manager
        await connection.execute(
          `INSERT INTO notifications 
            (user_id, user_type, title, message, is_read)
           VALUES (?, 'manager', 'Stock Updated', 'Product ID ${productId} stock updated from ${oldQuantity} to ${newQuantity}', FALSE)`,
          [1] // Assuming manager ID 1 or adjust as needed
        );

        await connection.commit();
        return {
          success: true,
          oldQuantity,
          newQuantity,
        };
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Error in InventoryModel.updateProductStock:", error);
      throw error;
    }
  }

  /**
   * Get inventory history for a product
   */
  static async getInventoryHistory(productId) {
    try {
      const query = `
        SELECT 
          i.inventory_id, 
          i.date, 
          i.quantity, 
          i.Buying_price as buyingPrice,
          i.exp_date as expiryDate,
          o.oder_id as orderId,
          s.sup_id as supplierId,
          CONCAT(s.F_name, ' ', s.L_name) as supplierName
        FROM 
          inventory i
        LEFT JOIN 
          s_oder o ON i.oder_id = o.oder_id
        LEFT JOIN 
          supplier s ON o.sup_id = s.sup_id
        WHERE 
          i.product_id = ?
        ORDER BY 
          i.date DESC
      `;

      const [history] = await db.execute(query, [productId]);
      return history;
    } catch (error) {
      console.error("Error in InventoryModel.getInventoryHistory:", error);
      throw error;
    }
  }
}

module.exports = InventoryModel;
