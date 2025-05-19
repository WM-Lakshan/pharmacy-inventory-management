// models/ProductModel.js
const { db } = require("../db");
const cloudinary = require("../utils/cloudinaryConfig");

class ProductModel {
  // Get all products with category names and stock status
  static async getAllProducts() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          p.product_id AS id,
          p.pname AS name,
          p.price,
          p.quantity,
          p.status,
          p.type AS type,
          p.treshold AS threshold,
          p.image,
          pc.name AS category,
          pc.product_cato_id AS category_id,
          CASE
            WHEN p.quantity = 0 THEN 'Out of stock'
            WHEN p.quantity < p.treshold THEN 'Low stock'
            ELSE 'In-stock'
          END AS status
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        ORDER BY p.pname
      `);

      // Format products for frontend
      return rows.map((product) => ({
        id: product.id,
        name: product.name,
        price: `Rs.${product.price}`,
        quantity: product.quantity.toString(),
        status: product.status,
        type:
          product.type === "prescription needed"
            ? "Prescription Required"
            : "No Prescription",
        category: product.category || "Uncategorized",
        categoryId: product.category_id,
        productId: `PROD-${String(product.id).padStart(4, "0")}`,
        threshold: product.threshold.toString(),
        remainingStock: product.quantity.toString(),
        unit: "Units",
        image: product.image,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  // Get inventory statistics for dashboard
  static async getInventoryStats() {
    try {
      // Get category count
      const [categoryRows] = await db.execute(
        "SELECT COUNT(*) as count FROM product_cato"
      );
      const categoriesCount = categoryRows[0].count;

      // Get low stock count (quantity < threshold but > 0)
      const [lowStockRows] = await db.execute(`
        SELECT COUNT(*) as count FROM product 
        WHERE quantity < treshold AND quantity > 0
      `);
      const lowStockCount = lowStockRows[0].count;

      // Get out of stock count
      const [emptyStockRows] = await db.execute(
        "SELECT COUNT(*) as count FROM product WHERE quantity = 0"
      );
      const emptyStockCount = emptyStockRows[0].count;

      return {
        categoriesCount,
        lowStockCount,
        emptyStockCount,
      };
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
      throw error;
    }
  }

  // Get single product details
  static async getProductById(id) {
    try {
      const [rows] = await db.execute(
        `
        SELECT 
          p.product_id as id,
          p.pname as name,
          p.price,
          p.quantity,
          p.status,
          p.type as type,
          p.treshold as threshold,
          p.image,
          pc.name as category,
          pc.product_cato_id as category_id,
          CASE 
            WHEN p.quantity = 0 THEN 'Out of stock'
            WHEN p.quantity < p.treshold THEN 'Low stock'
            ELSE 'In-stock'
          END as status
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE p.product_id = ?
      `,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      const product = rows[0];

      // Format for frontend
      return {
        id: product.id,
        name: product.name,
        price: `Rs.${product.price}`,
        quantity: product.quantity.toString(),
        status: product.status,
        type:
          product.type === "prescription needed"
            ? "Prescription Required"
            : "No Prescription",
        category: product.category || "Uncategorized",
        categoryId: product.category_id,
        productId: `PROD-${String(product.id).padStart(4, "0")}`,
        threshold: product.threshold.toString(),
        remainingStock: product.quantity.toString(),
        unit: "Units",
        image: product.image,
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // Create new product
  // static async createProduct(productData, imageFile) {
  //   const connection = await db.getConnection();
  //   let imageUrl = null;

  //   try {
  //     await connection.beginTransaction();

  //     // Upload image to Cloudinary if present
  //     if (imageFile) {
  //       const result = await cloudinary.uploader.upload(
  //         imageFile.tempFilePath,
  //         {
  //           folder: "products",
  //         }
  //       );
  //       imageUrl = result.secure_url;
  //     }

  //     // Convert type to MySQL enum format
  //     const productType =
  //       productData.type === "Prescription Required"
  //         ? "prescription needed"
  //         : "prescription no needed";

  //     const [result] = await connection.execute(
  //       `
  //       INSERT INTO product (
  //         product_cato_id,
  //         pname,
  //         status,
  //         treshold,
  //         exp_date,
  //         quantity,
  //         price,
  //         type,
  //         image
  //       ) VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)
  //     `,
  //       [
  //         productData.categoryId,
  //         productData.name,
  //         "Active", // Default status
  //         productData.threshold,
  //         0, // Initial quantity is zero
  //         productData.price,
  //         productType,
  //         imageUrl,
  //       ]
  //     );

  //     const productId = result.insertId;

  //     await connection.commit();
  //     return productId;
  //   } catch (error) {
  //     await connection.rollback();
  //     console.error("Error creating product:", error);
  //     throw error;
  //   } finally {
  //     connection.release();
  //   }
  // }

  // // Update product
  // static async updateProduct(id, productData, imageFile) {
  //   const connection = await db.getConnection();
  //   try {
  //     await connection.beginTransaction();

  //     // Get current product to check for image
  //     const [currentProduct] = await connection.execute(
  //       "SELECT image FROM product WHERE product_id = ?",
  //       [id]
  //     );

  //     if (currentProduct.length === 0) {
  //       await connection.rollback();
  //       return null;
  //     }

  //     let imageUrl = currentProduct[0].image;

  //     // Upload new image if provided
  //     if (imageFile) {
  //       // Delete previous image if exists
  //       if (imageUrl && imageUrl.includes("cloudinary")) {
  //         const publicId = imageUrl.split("/").pop().split(".")[0];
  //         await cloudinary.uploader.destroy(`products/${publicId}`);
  //       }

  //       const result = await cloudinary.uploader.upload(
  //         imageFile.tempFilePath,
  //         {
  //           folder: "products",
  //         }
  //       );
  //       imageUrl = result.secure_url;
  //     }

  //     // Convert type to MySQL enum format
  //     const productType =
  //       productData.type === "Prescription Required"
  //         ? "prescription needed"
  //         : "prescription no needed";

  //     // Update product
  //     const [result] = await connection.execute(
  //       `
  //       UPDATE product
  //       SET
  //         product_cato_id = ?,
  //         pname = ?,
  //         treshold = ?,
  //         type = ?,
  //         price = ?,
  //         image = ?
  //       WHERE product_id = ?
  //     `,
  //       [
  //         productData.categoryId,
  //         productData.name,
  //         productData.threshold,
  //         productType,
  //         productData.price,
  //         imageUrl,
  //         id,
  //       ]
  //     );

  //     await connection.commit();
  //     return result.affectedRows > 0;
  //   } catch (error) {
  //     await connection.rollback();
  //     console.error(`Error updating product ${id}:`, error);
  //     throw error;
  //   } finally {
  //     connection.release();
  //   }
  // }

  // static async createProduct(productData) {
  //   const { name, categoryId, price, type, threshold, image } = productData;

  //   try {
  //     const [result] = await db.execute(
  //       `
  //       INSERT INTO product (
  //         product_cato_id,
  //         pname,
  //         status,
  //         treshold,
  //         exp_date,
  //         quantity,
  //         price,
  //         type,
  //         image
  //       ) VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)
  //     `,
  //       [
  //         categoryId,
  //         name,
  //         "Active", // Default status
  //         threshold,
  //         0, // Initial quantity
  //         price,
  //         type, // Match database field 'type'
  //         image, // Cloudinary URL
  //       ]
  //     );

  //     return result.insertId;
  //   } catch (error) {
  //     console.error("Database error in createProduct:", error);
  //     throw error;
  //   }
  // }

  ////////////////////////////////correct///////////////////////////

  static async createProduct(productData) {
    const { name, categoryId, price, type, threshold, image } = productData;

    // Log the parameters to debug
    console.log("Creating product with parameters:", {
      categoryId,
      name,
      threshold,
      price,
      type,
      image,
    });

    try {
      // If type is undefined or null, provide a default value that's valid for your enum
      const productType = type || "prescription not needed"; // Default value

      const [result] = await db.execute(
        `
      INSERT INTO product (
        product_cato_id, 
        pname, 
        status, 
        treshold, 
        quantity, 
        price,
        type,
        image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [
          categoryId,
          name,
          "Active", // Default status
          threshold,
          0, // Initial quantity
          price,
          productType, // Use the defaulted value
          image || null, // Provide null instead of undefined for image which can be null
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error("Database error in createProduct:", error);
      throw error;
    }
  }

  /**
   * Update an existing product
   */
  static async updateProduct(id, productData) {
    const { name, categoryId, price, type, threshold, image } = productData;

    try {
      const [result] = await db.execute(
        `
        UPDATE product 
        SET 
          product_cato_id = ?,
          pname = ?,
          treshold = ?,
          price = ?,
          type = ?,
          image = ?
        WHERE product_id = ?
      `,
        [
          categoryId,
          name,
          threshold,
          price,
          type, // Match database field 'type'
          image, // Cloudinary URL
          id,
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Database error in updateProduct:", error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if product exists and get image URL
      const [product] = await connection.execute(
        "SELECT image FROM product WHERE product_id = ?",
        [id]
      );

      if (product.length === 0) {
        await connection.rollback();
        return false;
      }

      // Delete product image from Cloudinary if exists
      if (product[0].image && product[0].image.includes("cloudinary")) {
        const publicId = product[0].image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }

      // Check if product is used in any orders
      const [orderItems] = await connection.execute(
        "SELECT COUNT(*) as count FROM supplier_product WHERE product_id = ?",
        [id]
      );

      if (orderItems[0].count > 0) {
        await connection.rollback();
        throw new Error(
          `Cannot delete product. It is used in ${orderItems[0].count} order(s).`
        );
      }

      // Delete product
      const [result] = await connection.execute(
        "DELETE FROM product WHERE product_id = ?",
        [id]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get product history
  //   static async getProductHistory(id) {
  //     try {
  //       const [rows] = await db.execute(
  //         `
  //         SELECT
  //           sp.oder_id as orderId,
  //           CONCAT(s.F_name, ' ', s.L_name) as supplierName,
  //           sp.expired_date as expiryDate,
  //           sp.quantity,
  //           so.created_at as date
  //         FROM supplier_product sp
  //         JOIN s_oder so ON sp.oder_id = so.oder_id
  //         JOIN supplier s ON sp.sup_id = s.sup_id
  //         WHERE sp.product_id = ?
  //         ORDER BY so.created_at DESC
  //         LIMIT 20
  //       `,
  //         [id]
  //       );

  //       return rows.map((item) => ({
  //         id: `${item.orderId}-${Math.random().toString(36).substring(7)}`, // Generate unique ID
  //         orderId: item.orderId,
  //         supplierName: item.supplierName,
  //         expiryDate: item.expiryDate
  //           ? new Date(item.expiryDate).toLocaleDateString()
  //           : "N/A",
  //         quantity: item.quantity,
  //         date: new Date(item.date).toLocaleDateString(),
  //       }));
  //     } catch (error) {
  //       console.error(`Error fetching product history for ${id}:`, error);
  //       throw error;
  //     }
  //   }
  // }

  static async getProductHistory(id) {
    try {
      const [rows] = await db.execute(
        `
      SELECT 
        sp.oder_id as orderId,
        CONCAT(s.F_name, ' ', s.L_name) as supplierName,
        sp.expired_date as expiryDate,
        sp.Products_remaining as quantity,
        sp.price as buying_price,
        so.created_at as date
      FROM supplier_product sp
      JOIN s_oder so ON sp.oder_id = so.oder_id
      JOIN supplier s ON sp.sup_id = s.sup_id
      WHERE sp.product_id = ?
      ORDER BY so.created_at DESC
      LIMIT 20
    `,
        [id]
      );

      return rows.map((item) => ({
        id: `${item.orderId}-${Math.random().toString(36).substring(7)}`,
        orderId: item.orderId,
        supplierName: item.supplierName,
        expiryDate: item.expiryDate
          ? new Date(item.expiryDate).toLocaleDateString()
          : "N/A",
        quantity: item.quantity,
        buyingPrice: item.buyingPrice ? `Rs.${item.buyingPrice}` : "N/A",
        date: new Date(item.date).toLocaleDateString(),
      }));
    } catch (error) {
      console.error(`Error fetching product history for ${id}:`, error);
      throw error;
    }
  }
}

module.exports = ProductModel;
