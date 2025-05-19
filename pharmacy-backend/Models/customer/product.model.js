// models/product.model.js
const { db } = require("../../db");

class ProductModel {
  /**
   * Get all products with optional filtering and pagination
   */
  static async getAllProducts(options = {}) {
    try {
      const {
        page = 1,
        pageSize = 8,
        category = null,
        featured = false,
        topSelling = false,
      } = options;

      const offset = (page - 1) * pageSize;

      if (isNaN(page) || isNaN(pageSize) || isNaN(offset)) {
        throw new Error("Pagination values must be valid integers.");
      }

      // Base query
      let query = `
        SELECT p.product_id, p.pname, p.price, p.image, p.quantity, p.type AS product_type, 
               pc.name AS category_name
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 1=1
      `;
      const params = [];

      // Add category filter
      if (category && category !== "all") {
        query += ` AND pc.product_cato_id = ?`;
        params.push(category);
      }

      // Add sorting logic
      if (featured) {
        query += ` ORDER BY RAND()`;
      } else if (topSelling) {
        query += ` ORDER BY RAND()`;
      } else {
        query += ` ORDER BY p.product_id DESC`;
      }

      // Add pagination
      // query += ` LIMIT ? OFFSET ?`;
      // params.push(parseInt(pageSize, 10), parseInt(offset, 10));

      // Execute query
      const [products] = await db.execute(query, params);

      // Get total count
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE 1=1
      `;
      const countParams = [];
      if (category && category !== "all") {
        countQuery += ` AND pc.product_cato_id = ?`;
        countParams.push(category);
      }

      console.log("Count Query:", countQuery);
      console.log("Count Params:", countParams);

      const [countResult] = await db.execute(countQuery, countParams);
      const total = countResult[0].total;

      return {
        products,
        total,
        page,
        pages: Math.ceil(total / pageSize),
      };
    } catch (error) {
      console.error("Error in getAllProducts:", error);
      throw error;
    }
  }

  //   static async getAllProducts(options = {}) {
  //     try {
  //       const {
  //         page = 1,
  //         pageSize = 8,
  //         category = null,
  //         featured = false,
  //         topSelling = false,
  //       } = options;

  //       const offset = (page - 1) * pageSize;

  //       if (isNaN(page) || isNaN(pageSize) || isNaN(offset)) {
  //         throw new Error("Pagination values must be valid integers.");
  //       }

  //       let query = `
  //         SELECT p.product_id, p.pname, p.price, p.image, p.quantity, p.type AS product_type,
  //                pc.name AS category_name
  //         FROM product p
  //         LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
  //         WHERE 1=1
  //       `;
  //       const params = [];

  //       if (category && category !== "all") {
  //         query += ` AND pc.product_cato_id = ?`;
  //         params.push(category);
  //       }

  //       if (featured) {
  //         query += ` ORDER BY RAND()`;
  //       } else if (topSelling) {
  //         query += ` ORDER BY RAND()`;
  //       } else {
  //         query += ` ORDER BY p.product_id DESC`;
  //       }

  //       query += ` LIMIT ? OFFSET ?`;
  //       params.push(parseInt(pageSize, 10), parseInt(offset, 10));

  //       console.log("Page Size:", pageSize, "Offset:", offset);
  //       console.log("Query:", query);
  //       console.log("Params:", params);
  //       console.log("Category Filter:", category);

  //       const [products] = await db.execute(query, params);

  //       let countQuery = `
  //         SELECT COUNT(*) as total
  //         FROM product p
  //         LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
  //         WHERE 1=1
  //       `;
  //       const countParams = [];
  //       if (category && category !== "all") {
  //         countQuery += ` AND pc.product_cato_id = ?`;
  //         countParams.push(category);
  //       }

  //       console.log("Count Query:", countQuery);
  //       console.log("Count Params:", countParams);

  //       const [countResult] = await db.execute(countQuery, countParams);
  //       const total = countResult[0].total;

  //       return {
  //         products,
  //         total,
  //         page,
  //         pages: Math.ceil(total / pageSize),
  //       };
  //     } catch (error) {
  //       console.error("Error in getAllProducts:", error);
  //       throw error;
  //     }
  //   }

  /**
   * Get a single product by ID
   */
  static async getProductById(productId) {
    try {
      const [products] = await db.execute(
        `
        SELECT p.product_id, p.pname, p.price, p.image, p.quantity, p.type AS product_type, 
               p.status, p.exp_date, p.treshold,
               pc.name AS category_name, pc.description AS category_description
        FROM product p
        LEFT JOIN product_cato pc ON p.product_cato_id = pc.product_cato_id
        WHERE p.product_id = ?
      `,
        [productId]
      );

      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error("Error in getProductById:", error);
      throw error;
    }
  }

  /**
   * Add product to cart
   */
  static async addToCart(customerId, productId, quantity) {
    try {
      // Check if product exists and has enough stock
      const [productResult] = await db.execute(
        `
        SELECT product_id, quantity, type 
        FROM product 
        WHERE product_id = ?
      `,
        [productId]
      );

      if (productResult.length === 0) {
        return { success: false, message: "Product not found" };
      }

      const product = productResult[0];

      if (product.quantity < quantity) {
        return {
          success: false,
          message: "Not enough stock available",
          availableQuantity: product.quantity,
        };
      }

      // Check if prescription is required
      if (product.type === "prescription needed") {
        return {
          success: false,
          message: "This product requires a prescription",
        };
      }

      // Check if item already exists in cart
      const [cartResult] = await db.execute(
        `
        SELECT cart_id, quantity 
        FROM cart 
        WHERE customer_id = ? AND product_id = ?
      `,
        [customerId, productId]
      );

      // Start transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        if (cartResult.length > 0) {
          // Update quantity if already in cart
          const newQuantity = cartResult[0].quantity + quantity;
          await connection.execute(
            `
            UPDATE cart 
            SET quantity = ? 
            WHERE cart_id = ?
          `,
            [newQuantity, cartResult[0].cart_id]
          );
        } else {
          // Add new item to cart
          await connection.execute(
            `
            INSERT INTO cart (customer_id, product_id, quantity) 
            VALUES (?, ?, ?)
          `,
            [customerId, productId, quantity]
          );
        }

        await connection.commit();
        return { success: true, message: "Product added to cart successfully" };
      } catch (err) {
        await connection.rollback();
        console.error("Transaction error:", err);
        throw err;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Error in addToCart:", error);
      throw error;
    }
  }
}

module.exports = ProductModel;
