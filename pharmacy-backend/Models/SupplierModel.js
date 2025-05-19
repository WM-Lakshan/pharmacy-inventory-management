// // const db = require("../db"); // or your sequelize/connection instance

// // const SupplierOrder = {
// //   create: async (orderData, products) => {
// //     // Assuming Sequelize with models Order and OrderItem
// //     // You may need to adjust this according to your DB structure
// //     const [orderResult] = await db.query(
// //       `INSERT INTO supplier_orders (manager_id, sup_id, order_date) VALUES (?, ?, NOW())`,
// //       [orderData.manager_id, orderData.sup_id]
// //     );

// //     const orderId = orderResult.insertId;

// //     for (let product of products) {
// //       await db.query(
// //         `INSERT INTO supplier_order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`,
// //         [orderId, product.product_id, product.quantity]
// //       );
// //     }

// //     return orderId;
// //   },

// //   getAll: async () => {
// //     const [rows] = await db.query(`SELECT * FROM supplier_orders`);
// //     return rows;
// //   },

// //   getById: async (id) => {
// //     const [[order]] = await db.query(
// //       `SELECT * FROM supplier_orders WHERE id = ?`,
// //       [id]
// //     );
// //     return order;
// //   },

// //   delete: async (id) => {
// //     const [result] = await db.query(
// //       `DELETE FROM supplier_orders WHERE id = ?`,
// //       [id]
// //     );
// //     return result.affectedRows > 0;
// //   },
// // };

// // module.exports = SupplierOrder;

// // Models/SupplierModel.js
// const { db } = require("../db");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

// class SupplierModel {
//   static async getAllSuppliers() {
//     // try {
//     //   const [rows] = await db.execute(`
//     //     SELECT
//     //       s.sup_id as id,
//     //       CONCAT(s.F_name, ' ', s.L_name) as name,
//     //       s.email,
//     //       s.address,
//     //       s.type
//     //     FROM supplier s
//     //   `);
//     try {
//       const [rows] = await db.execute(`
//       SELECT 
//         s.sup_id as id, 
//         CONCAT(s.F_name, ' ', s.L_name) as name, 
//         s.email, 
//         s.address, 
//         s.type,
//         s.image
//       FROM supplier s
//     `);

//       // Get phone numbers for each supplier
//       for (const supplier of rows) {
//         const [phoneRows] = await db.execute(
//           `SELECT number as contactNumber FROM s_tel WHERE sup_id = ?`,
//           [supplier.id]
//         );

//         supplier.contactNumber =
//           phoneRows.length > 0 ? phoneRows[0].contactNumber : "";

//         // Get products for each supplier
//         // const [productRows] = await db.execute(
//         //   `
//         //   // SELECT p.pname as product_name
//         //   // FROM supplier_suppling_products sp
//         //   // JOIN product p ON sp.product_id = p.product_id
//         //   // WHERE sp.sup_id = ?
//         // `,
//         //   [supplier.id]
//         // );

//         //supplier.products = productRows.map((prod) => prod.product_name);
//         const [productRows] = await db.execute(
//           `
//         SELECT p.product_id as id, p.pname as name 
//         FROM supplier_suppling_products sp
//         JOIN product p ON sp.product_id = p.product_id
//         WHERE sp.sup_id = ?
//       `,
//           [supplier.id]
//         );

//         supplier.products = productRows;
//       }

//       return rows;
//     } catch (error) {
//       console.error("Error fetching suppliers:", error);
//       throw error;
//     }
//   }

//   static async getSupplierById(id) {
//     try {
//       const [rows] = await db.execute(
//         `SELECT 
//           s.sup_id as id, 
//           s.F_name, 
//           s.L_name, 
//           CONCAT(s.F_name, ' ', s.L_name) as name, 
//           s.email, 
//           s.address, 
//           s.type,
//           s.image
//         FROM supplier s
//         WHERE s.sup_id = ?`,
//         [id]
//       );

//       if (rows.length === 0) {
//         return null;
//       }

//       const supplier = rows[0];

//       // Get phone numbers
//       const [phoneRows] = await db.execute(
//         `SELECT number as contactNumber FROM s_tel WHERE sup_id = ?`,
//         [id]
//       );

//       supplier.contactNumber =
//         phoneRows.length > 0 ? phoneRows[0].contactNumber : "";

//       // Get products
//       const [productRows] = await db.execute(
//         `
//         SELECT p.pname as product_name, p.product_id 
//         FROM supplier_suppling_products sp
//         JOIN product p ON sp.product_id = p.product_id
//         WHERE sp.sup_id = ?
//       `,
//         [id]
//       );

//       supplier.products = productRows.map((prod) => ({
//         id: prod.product_id,
//         name: prod.pname,
//       }));

//       return supplier;
//     } catch (error) {
//       console.error(`Error fetching supplier with ID ${id}:`, error);
//       throw error;
//     }
//   }

//   static async createSupplier(supplierData) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       const { name, email, contactNumber, products, type, address, image } =
//         supplierData;

//       // Split name into first and last
//       const nameParts = name.split(" ");
//       const F_name = nameParts[0];
//       const L_name = nameParts.slice(1).join(" ") || "";

//       // Hash the default password
//       const hashedPassword = await bcrypt.hash("12345678", saltRounds);

//       // Insert into supplier table
//       const [result] = await connection.execute(
//         `INSERT INTO supplier (F_name, L_name, email, password, address, type, image) 
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [F_name, L_name, email, hashedPassword, address, type, image || null]
//       );

//       const supplierId = result.insertId;

//       // Insert contact number
//       if (contactNumber) {
//         await connection.execute(
//           `INSERT INTO s_tel (sup_id, number) VALUES (?, ?)`,
//           [supplierId, contactNumber]
//         );
//       }

//       // Insert supplier products
//       if (products && products.length > 0) {
//         for (const productName of products) {
//           // Get product ID or create if not exists
//           let productId;

//           const [existingProducts] = await connection.execute(
//             `SELECT product_id FROM product WHERE pname = ?`,
//             [productName]
//           );

//           if (existingProducts.length > 0) {
//             productId = existingProducts[0].product_id;
//           } else {
//             // If product doesn't exist, you might want to create it or skip
//             continue;
//           }

//           if (products && products.length > 0) {
//             for (const product of products) {
//               const productId =
//                 typeof product === "object" ? product.id : product;

//               // Insert into supplier_suppling_products
//               await connection.execute(
//                 `INSERT INTO supplier_suppling_products (sup_id, product_id) 
//        VALUES (?, ?)`,
//                 [supplierId, productId]
//               );
//             }
//           }
//         }
//       }

//       await connection.commit();
//       return supplierId;
//     } catch (error) {
//       await connection.rollback();
//       console.error("Error creating supplier:", error);
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }

//   static async updateSupplier(id, supplierData) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       const { name, email, contactNumber, products, type, address, image } =
//         supplierData;

//       // Split name into first and last
//       const nameParts = name.split(" ");
//       const F_name = nameParts[0];
//       const L_name = nameParts.slice(1).join(" ") || "";

//       // Update supplier table
//       await connection.execute(
//         `UPDATE supplier 
//          SET F_name = ?, L_name = ?, email = ?, address = ?, type = ?, image = ?
//          WHERE sup_id = ?`,
//         [F_name, L_name, email, address, type, image, id]
//       );

//       // Update contact number - delete old and insert new
//       await connection.execute(`DELETE FROM s_tel WHERE sup_id = ?`, [id]);

//       if (contactNumber) {
//         await connection.execute(
//           `INSERT INTO s_tel (sup_id, number) VALUES (?, ?)`,
//           [id, contactNumber]
//         );
//       }

//       // Update supplier products - delete old associations and insert new ones
//       await connection.execute(
//         `DELETE FROM supplier_suppling_products WHERE sup_id = ?`,
//         [id]
//       );

//       if (products && products.length > 0) {
//         for (const productName of products) {
//           let productId;

//           const [existingProducts] = await connection.execute(
//             `SELECT product_id FROM product WHERE pname = ?`,
//             [productName]
//           );

//           if (existingProducts.length > 0) {
//             productId = existingProducts[0].product_id;

//             // Insert into supplier_suppling_products
//             await connection.execute(
//               `INSERT INTO supplier_suppling_products (sup_id, product_id) 
//                VALUES (?, ?)`,
//               [id, productId]
//             );
//           }
//         }
//       }

//       await connection.commit();
//       return true;
//     } catch (error) {
//       await connection.rollback();
//       console.error(`Error updating supplier with ID ${id}:`, error);
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }
//   static async getSupplierProducts(supplierId) {
//     try {
//       const [products] = await db.execute(
//         `
//         SELECT 
//           p.product_id as id,
//           p.pname as name,
//           p.price,
//           p.quantity,
//           p.status,
//           p.image,
//           p.exp_date as expiryDate,
//           p.treshold as threshold
//         FROM supplier_suppling_products sp
//         JOIN product p ON sp.product_id = p.product_id
//         WHERE sp.sup_id = ?
//       `,
//         [supplierId]
//       );

//       return products;
//     } catch (error) {
//       console.error("Error fetching supplier products:", error);
//       throw error;
//     }
//   }

//   static async addSupplierProduct(supplierId, productId) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Check if relationship exists
//       const [existing] = await connection.execute(
//         `SELECT * FROM supplier_suppling_products 
//          WHERE sup_id = ? AND product_id = ?`,
//         [supplierId, productId]
//       );

//       if (existing.length > 0) {
//         throw new Error("Product already associated with this supplier");
//       }

//       // Create relationship
//       await connection.execute(
//         `INSERT INTO supplier_suppling_products (sup_id, product_id)
//          VALUES (?, ?)`,
//         [supplierId, productId]
//       );

//       await connection.commit();
//       return true;
//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }

//   static async removeSupplierProduct(supplierId, productId) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       const [result] = await connection.execute(
//         `DELETE FROM supplier_suppling_products 
//          WHERE sup_id = ? AND product_id = ?`,
//         [supplierId, productId]
//       );

//       if (result.affectedRows === 0) {
//         throw new Error("Product not found for this supplier");
//       }

//       await connection.commit();
//       return true;
//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }

//   static async deleteSupplier(id) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Delete supplier products associations
//       await connection.execute(
//         `DELETE FROM supplier_suppling_products WHERE sup_id = ?`,
//         [id]
//       );

//       // Delete supplier phone numbers
//       await connection.execute(`DELETE FROM s_tel WHERE sup_id = ?`, [id]);

//       // Delete supplier
//       const [result] = await connection.execute(
//         `DELETE FROM supplier WHERE sup_id = ?`,
//         [id]
//       );

//       await connection.commit();
//       return result.affectedRows > 0;
//     } catch (error) {
//       await connection.rollback();
//       console.error(`Error deleting supplier with ID ${id}:`, error);
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }

//   static async getAvailableProducts() {
//     try {
//       const [rows] = await db.execute(
//         `SELECT product_id, pname as name FROM product WHERE status = 'active'`
//       );
//       return rows;
//     } catch (error) {
//       console.error("Error fetching available products:", error);
//       throw error;
//     }
//   }
// }

// module.exports = SupplierModel;

const { db } = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class SupplierModel {
  static async getAllSuppliers() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          s.sup_id as id, 
          CONCAT(s.F_name, ' ', s.L_name) as name, 
          s.email, 
          s.address, 
          s.type,
          s.image as imageUrl
        FROM supplier s
      `);

      // Get phone numbers and products for each supplier
      for (const supplier of rows) {
        const [phoneRows] = await db.execute(
          `SELECT number as contactNumber FROM s_tel WHERE sup_id = ?`,
          [supplier.id]
        );

        supplier.contactNumber =
          phoneRows.length > 0 ? phoneRows[0].contactNumber : "";

        // Get products for each supplier
        const [productRows] = await db.execute(
          `
          SELECT p.product_id as id, p.pname as name 
          FROM supplier_suppling_products sp
          JOIN product p ON sp.product_id = p.product_id
          WHERE sp.sup_id = ?
          `,
          [supplier.id]
        );

        supplier.products = productRows;
      }

      return rows;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw error;
    }
  }

  static async getSupplierById(id) {
    try {
      const [rows] = await db.execute(
        `SELECT 
          s.sup_id as id, 
          s.F_name, 
          s.L_name, 
          CONCAT(s.F_name, ' ', s.L_name) as name, 
          s.email, 
          s.address, 
          s.type,
          s.image as imageUrl
        FROM supplier s
        WHERE s.sup_id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      const supplier = rows[0];

      // Get phone numbers
      const [phoneRows] = await db.execute(
        `SELECT number as contactNumber FROM s_tel WHERE sup_id = ?`,
        [id]
      );

      supplier.contactNumber =
        phoneRows.length > 0 ? phoneRows[0].contactNumber : "";

      // Get products
      const [productRows] = await db.execute(
        `
        SELECT p.product_id as id, p.pname as name 
        FROM supplier_suppling_products sp
        JOIN product p ON sp.product_id = p.product_id
        WHERE sp.sup_id = ?
        `,
        [id]
      );

      supplier.products = productRows;

      return supplier;
    } catch (error) {
      console.error(`Error fetching supplier with ID ${id}:`, error);
      throw error;
    }
  }

  static async createSupplier(supplierData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { name, email, contactNumber, products, type, address, image } =
        supplierData;

      // Split name into first and last
      const nameParts = name.split(" ");
      const F_name = nameParts[0];
      const L_name = nameParts.slice(1).join(" ") || "";

      // Hash the default password
      const hashedPassword = await bcrypt.hash("12345678", saltRounds);

      // Insert into supplier table
      const [result] = await connection.execute(
        `INSERT INTO supplier (F_name, L_name, email, password, address, type, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [F_name, L_name, email, hashedPassword, address, type, image || null]
      );

      const supplierId = result.insertId;

      // Insert contact number
      if (contactNumber) {
        await connection.execute(
          `INSERT INTO s_tel (sup_id, number) VALUES (?, ?)`,
          [supplierId, contactNumber]
        );
      }

      // Insert supplier products
      if (products && products.length > 0) {
        for (const product of products) {
          // Extract product ID whether it's an object or direct ID
          const productId = typeof product === 'object' ? product.id : product;
          
          // Insert into supplier_suppling_products
          await connection.execute(
            `INSERT INTO supplier_suppling_products (sup_id, product_id) 
             VALUES (?, ?)`,
            [supplierId, productId]
          );
        }
      }

      await connection.commit();
      return supplierId;
    } catch (error) {
      await connection.rollback();
      console.error("Error creating supplier:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateSupplier(id, supplierData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { name, email, contactNumber, products, type, address, image } =
        supplierData;

      // Split name into first and last
      const nameParts = name.split(" ");
      const F_name = nameParts[0];
      const L_name = nameParts.slice(1).join(" ") || "";

      // Update supplier table
      await connection.execute(
        `UPDATE supplier 
         SET F_name = ?, L_name = ?, email = ?, address = ?, type = ?, image = ?
         WHERE sup_id = ?`,
        [F_name, L_name, email, address, type, image, id]
      );

      // Update contact number - delete old and insert new
      await connection.execute(`DELETE FROM s_tel WHERE sup_id = ?`, [id]);

      if (contactNumber) {
        await connection.execute(
          `INSERT INTO s_tel (sup_id, number) VALUES (?, ?)`,
          [id, contactNumber]
        );
      }

      // Update supplier products - delete old associations and insert new ones
      await connection.execute(
        `DELETE FROM supplier_suppling_products WHERE sup_id = ?`,
        [id]
      );

      if (products && products.length > 0) {
        for (const product of products) {
          // Extract product ID whether it's an object or direct ID
          const productId = typeof product === 'object' ? product.id : product;
          
          // Insert into supplier_suppling_products
          await connection.execute(
            `INSERT INTO supplier_suppling_products (sup_id, product_id) 
             VALUES (?, ?)`,
            [id, productId]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error(`Error updating supplier with ID ${id}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getSupplierProducts(supplierId) {
    try {
      const [products] = await db.execute(
        `
        SELECT 
          p.product_id as id,
          p.pname as name,
          p.price,
          p.quantity,
          p.status,
          p.image,
          p.exp_date as expiryDate,
          p.treshold as threshold
        FROM supplier_suppling_products sp
        JOIN product p ON sp.product_id = p.product_id
        WHERE sp.sup_id = ?
      `,
        [supplierId]
      );

      return products;
    } catch (error) {
      console.error("Error fetching supplier products:", error);
      throw error;
    }
  }

  static async addSupplierProduct(supplierId, productId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if relationship exists
      const [existing] = await connection.execute(
        `SELECT * FROM supplier_suppling_products 
         WHERE sup_id = ? AND product_id = ?`,
        [supplierId, productId]
      );

      if (existing.length > 0) {
        throw new Error("Product already associated with this supplier");
      }

      // Create relationship
      await connection.execute(
        `INSERT INTO supplier_suppling_products (sup_id, product_id)
         VALUES (?, ?)`,
        [supplierId, productId]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async removeSupplierProduct(supplierId, productId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `DELETE FROM supplier_suppling_products 
         WHERE sup_id = ? AND product_id = ?`,
        [supplierId, productId]
      );

      if (result.affectedRows === 0) {
        throw new Error("Product not found for this supplier");
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteSupplier(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Delete supplier products associations
      await connection.execute(
        `DELETE FROM supplier_suppling_products WHERE sup_id = ?`,
        [id]
      );

      // Delete supplier phone numbers
      await connection.execute(`DELETE FROM s_tel WHERE sup_id = ?`, [id]);

      // Delete supplier
      const [result] = await connection.execute(
        `DELETE FROM supplier WHERE sup_id = ?`,
        [id]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error(`Error deleting supplier with ID ${id}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getAvailableProducts() {
    try {
      const [rows] = await db.execute(
        `SELECT product_id as id, pname as name FROM product WHERE status = 'active'`
      );
      return rows;
    } catch (error) {
      console.error("Error fetching available products:", error);
      throw error;
    }
  }
}

module.exports = SupplierModel;
