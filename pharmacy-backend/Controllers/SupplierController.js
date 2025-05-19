// // const db = require("../db"); // adjust based on your DB connection file

// // module.exports = {
// //   // Create supplier
// //   createSupplier: async (req, res) => {
// //     try {
// //       const { name, email, phone, address } = req.body;

// //       if (!name || !email || !phone || !address) {
// //         return res
// //           .status(400)
// //           .json({ success: false, error: "All fields are required" });
// //       }

// //       const [result] = await db.execute(
// //         "INSERT INTO suppliers (name, email, phone, address) VALUES (?, ?, ?, ?)",
// //         [name, email, phone, address]
// //       );

// //       res.status(201).json({
// //         success: true,
// //         message: "Supplier created successfully",
// //         supplierId: result.insertId,
// //       });
// //     } catch (error) {
// //       res.status(500).json({ success: false, error: error.message });
// //     }
// //   },

// //   // Get all suppliers
// //   getAllSuppliers: async (req, res) => {
// //     try {
// //       const [suppliers] = await db.execute("SELECT * FROM suppliers");
// //       res.status(200).json({ success: true, suppliers });
// //     } catch (error) {
// //       res.status(500).json({ success: false, error: error.message });
// //     }
// //   },

// //   // Get single supplier
// //   getSupplier: async (req, res) => {
// //     try {
// //       const supplierId = req.params.id;
// //       const [rows] = await db.execute("SELECT * FROM suppliers WHERE id = ?", [
// //         supplierId,
// //       ]);

// //       if (rows.length === 0) {
// //         return res
// //           .status(404)
// //           .json({ success: false, error: "Supplier not found" });
// //       }

// //       res.status(200).json({ success: true, supplier: rows[0] });
// //     } catch (error) {
// //       res.status(500).json({ success: false, error: error.message });
// //     }
// //   },

// //   // Update supplier
// //   updateSupplier: async (req, res) => {
// //     try {
// //       const supplierId = req.params.id;
// //       const { name, email, phone, address } = req.body;

// //       const [result] = await db.execute(
// //         "UPDATE suppliers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
// //         [name, email, phone, address, supplierId]
// //       );

// //       if (result.affectedRows === 0) {
// //         return res.status(404).json({
// //           success: false,
// //           error: "Supplier not found or nothing changed",
// //         });
// //       }

// //       res
// //         .status(200)
// //         .json({ success: true, message: "Supplier updated successfully" });
// //     } catch (error) {
// //       res.status(500).json({ success: false, error: error.message });
// //     }
// //   },

// //   // Delete supplier
// //   deleteSupplier: async (req, res) => {
// //     try {
// //       const supplierId = req.params.id;

// //       const [result] = await db.execute("DELETE FROM suppliers WHERE id = ?", [
// //         supplierId,
// //       ]);

// //       if (result.affectedRows === 0) {
// //         return res
// //           .status(404)
// //           .json({ success: false, error: "Supplier not found" });
// //       }

// //       res
// //         .status(200)
// //         .json({ success: true, message: "Supplier deleted successfully" });
// //     } catch (error) {
// //       res.status(500).json({ success: false, error: error.message });
// //     }
// //   },
// // };

// // Controllers/SupplierController.js
// const SupplierModel = require("../Models/SupplierModel");
// const cloudinary = require("../utils/cloudinaryConfig");

// class SupplierController {
//   static async getAllSuppliers(req, res) {
//     // try {
//     //   const suppliers = await SupplierModel.getAllSuppliers();
//     //   res.status(200).json({
//     //     success: true,
//     //     suppliers,
//     //   });

//     try {
//       const suppliers = await SupplierModel.getAllSuppliers();
//       // Transform products to match frontend expectations
//       const transformedSuppliers = suppliers.map((supplier) => ({
//         ...supplier,
//         products: supplier.products.map((product) => ({
//           id: product.product_id,
//           name: product.product_name,
//         })),
//       }));

//       res.status(200).json({
//         success: true,
//         suppliers: transformedSuppliers,
//       });
//     } catch (error) {
//       console.error("Error in getAllSuppliers:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch suppliers",
//         error: error.message,
//       });
//     }
//   }

//   static async getSupplier(req, res) {
//     try {
//       const { id } = req.params;
//       const supplier = await SupplierModel.getSupplierById(id);

//       if (!supplier) {
//         return res.status(404).json({
//           success: false,
//           message: "Supplier not found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         supplier,
//       });
//     } catch (error) {
//       console.error(`Error in getSupplier with ID ${req.params.id}:`, error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch supplier details",
//         error: error.message,
//       });
//     }
//   }

//   static async createSupplier(req, res) {
//     try {
//       let imageUrl = null;
//       if (req.file) {
//         const result = await cloudinary.uploader.upload(req.file.path);
//         imageUrl = result.secure_url;
//       }

//       let products = [];
//       if (req.body.products) {
//         try {
//           // Handle all possible formats:
//           // 1. Already an array (from raw JSON)
//           if (Array.isArray(req.body.products)) {
//             products = req.body.products;
//           }
//           // 2. JSON string that can be parsed
//           else if (typeof req.body.products === "string") {
//             try {
//               products = JSON.parse(req.body.products);
//               if (!Array.isArray(products)) {
//                 // If it's not an array after parsing, wrap it
//                 products = [products];
//               }
//             } catch (e) {
//               // If not JSON, treat as comma-separated string
//               products = req.body.products.split(",").map((p) => p.trim());
//             }
//           }
//           // 3. Single product (wrap in array)
//           else {
//             products = [req.body.products];
//           }
//         } catch (error) {
//           console.error("Error processing products:", error);
//           return res.status(400).json({
//             success: false,
//             message: "Invalid products format",
//             error: error.message,
//           });
//         }
//       }
//       // Handle image upload if present
//       if (req.file) {
//         const result = await cloudinary.uploader.upload(req.file.path, {
//           folder: "pharmacy/suppliers",
//           resource_type: "auto",
//         });
//         imageUrl = result.secure_url;
//       }

//       const supplierData = {
//         ...req.body,
//         products,
//         image: imageUrl,
//         products: req.body.products ? JSON.parse(req.body.products) : [],
//       };

//       const id = await SupplierModel.createSupplier(supplierData);

//       res.status(201).json({
//         success: true,
//         message: "Supplier created successfully",
//         supplierId: id,
//       });
//     } catch (error) {
//       console.error("Error in createSupplier:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to process supplier data",
//         error: error.message,
//       });
//     }
//   }

//   static async updateSupplier(req, res) {
//     try {
//       const { id } = req.params;
//       let imageUrl = req.body.currentImage || null;
//       let products = [];
//       if (req.body.products) {
//         try {
//           // Handle both string and array formats
//           products = Array.isArray(req.body.products)
//             ? req.body.products
//             : JSON.parse(req.body.products);
//         } catch (err) {
//           // Fallback: Treat as a single product string
//           products = [req.body.products];
//         }
//       }

//       // Handle image upload if present
//       if (req.file) {
//         // Delete old image if exists
//         if (req.body.currentImage) {
//           try {
//             const publicId = req.body.currentImage
//               .split("/")
//               .pop()
//               .split(".")[0];
//             await cloudinary.uploader.destroy(`pharmacy/suppliers/${publicId}`);
//           } catch (error) {
//             console.error("Error deleting old image:", error);
//           }
//         }

//         // Upload new image
//         const result = await cloudinary.uploader.upload(req.file.path, {
//           folder: "pharmacy/suppliers",
//           resource_type: "auto",
//         });
//         imageUrl = result.secure_url;
//       } else if (req.body.currentImage) {
//         // Keep existing image if no new one uploaded
//         imageUrl = req.body.currentImage;
//       }

//       const supplierData = {
//         ...req.body,
//         products,
//         image: imageUrl,
//         products: req.body.products ? JSON.parse(req.body.products) : [],
//       };

//       const success = await SupplierModel.updateSupplier(id, supplierData);

//       if (!success) {
//         return res.status(404).json({
//           success: false,
//           message: "Supplier not found or no changes made",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         message: "Supplier updated successfully",
//       });
//     } catch (error) {
//       console.error(`Error in updateSupplier with ID ${req.params.id}:`, error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to update supplier",
//         error: error.message,
//       });
//     }
//   }

//   static async deleteSupplier(req, res) {
//     try {
//       const { id } = req.params;
//       const success = await SupplierModel.deleteSupplier(id);

//       if (!success) {
//         return res.status(404).json({
//           success: false,
//           message: "Supplier not found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         message: "Supplier deleted successfully",
//       });
//     } catch (error) {
//       console.error(`Error in deleteSupplier with ID ${req.params.id}:`, error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to delete supplier",
//         error: error.message,
//       });
//     }
//   }

//   static async getAvailableProducts(req, res) {
//     try {
//       const products = await SupplierModel.getAvailableProducts();
//       res.status(200).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       console.error("Error in getAvailableProducts:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch available products",
//         error: error.message,
//       });
//     }
//   }
//   static async getSupplierProducts(req, res) {
//     try {
//       const { id } = req.params;
//       const [products] = await db.execute(
//         `
//         SELECT
//           p.product_id as id,
//           p.pname as name,
//           p.price,
//           p.quantity,
//           p.status,
//           p.image
//         FROM supplier_suppling_products sp
//         JOIN product p ON sp.product_id = p.product_id
//         WHERE sp.sup_id = ?
//       `,
//         [id]
//       );

//       res.status(200).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       console.error("Error fetching supplier products:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch supplier products",
//         error: error.message,
//       });
//     }
//   }

//   static async addSupplierProduct(req, res) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();
//       const { id } = req.params;
//       const { productId } = req.body;

//       // Check if product exists
//       const [product] = await connection.execute(
//         `SELECT product_id FROM product WHERE product_id = ?`,
//         [productId]
//       );

//       if (product.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "Product not found",
//         });
//       }

//       // Check if relationship already exists
//       const [existing] = await connection.execute(
//         `SELECT * FROM supplier_suppling_products
//          WHERE sup_id = ? AND product_id = ?`,
//         [id, productId]
//       );

//       if (existing.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message: "Product already associated with this supplier",
//         });
//       }

//       // Create relationship
//       await connection.execute(
//         `INSERT INTO supplier_suppling_products (sup_id, product_id)
//          VALUES (?, ?)`,
//         [id, productId]
//       );

//       await connection.commit();
//       res.status(201).json({
//         success: true,
//         message: "Product added to supplier successfully",
//       });
//     } catch (error) {
//       await connection.rollback();
//       console.error("Error adding supplier product:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to add product to supplier",
//         error: error.message,
//       });
//     } finally {
//       connection.release();
//     }
//   }

//   static async removeSupplierProduct(req, res) {
//     const connection = await db.getConnection();
//     try {
//       await connection.beginTransaction();
//       const { id, productId } = req.params;

//       // Delete relationship
//       const [result] = await connection.execute(
//         `DELETE FROM supplier_suppling_products
//          WHERE sup_id = ? AND product_id = ?`,
//         [id, productId]
//       );

//       if (result.affectedRows === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "Product not found for this supplier",
//         });
//       }

//       await connection.commit();
//       res.status(200).json({
//         success: true,
//         message: "Product removed from supplier successfully",
//       });
//     } catch (error) {
//       await connection.rollback();
//       console.error("Error removing supplier product:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to remove product from supplier",
//         error: error.message,
//       });
//     } finally {
//       connection.release();
//     }
//   }
// }

// module.exports = SupplierController;

const SupplierModel = require("../Models/SupplierModel");
const cloudinary = require("../utils/cloudinaryConfig");

class SupplierController {
  static async getAllSuppliers(req, res) {
    try {
      const suppliers = await SupplierModel.getAllSuppliers();

      res.status(200).json({
        success: true,
        suppliers: suppliers,
      });
    } catch (error) {
      console.error("Error in getAllSuppliers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch suppliers",
        error: error.message,
      });
    }
  }

  static async getSupplier(req, res) {
    try {
      const { id } = req.params;
      const supplier = await SupplierModel.getSupplierById(id);

      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: "Supplier not found",
        });
      }

      res.status(200).json({
        success: true,
        supplier,
      });
    } catch (error) {
      console.error(`Error in getSupplier with ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch supplier details",
        error: error.message,
      });
    }
  }

  static async createSupplier(req, res) {
    try {
      let imageUrl = null;

      // Handle image upload if present
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "pharmacy/suppliers",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
      }

      // Parse products data
      let products = [];
      if (req.body.products) {
        try {
          // Parse products JSON string to array
          if (typeof req.body.products === "string") {
            products = JSON.parse(req.body.products);
          } else if (Array.isArray(req.body.products)) {
            products = req.body.products;
          }
        } catch (error) {
          console.error("Error parsing products:", error);
          return res.status(400).json({
            success: false,
            message: "Invalid products format",
            error: error.message,
          });
        }
      }

      const supplierData = {
        name: req.body.name,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        type: req.body.type,
        address: req.body.address,
        image: imageUrl,
        products: products,
      };

      const id = await SupplierModel.createSupplier(supplierData);

      res.status(201).json({
        success: true,
        message: "Supplier created successfully",
        supplierId: id,
      });
    } catch (error) {
      console.error("Error in createSupplier:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create supplier",
        error: error.message,
      });
    }
  }

  static async updateSupplier(req, res) {
    try {
      const { id } = req.params;
      let imageUrl = req.body.currentImage || null;

      // Parse products data
      let products = [];
      if (req.body.products) {
        try {
          // Parse products JSON string to array
          if (typeof req.body.products === "string") {
            products = JSON.parse(req.body.products);
          } else if (Array.isArray(req.body.products)) {
            products = req.body.products;
          }
        } catch (error) {
          console.error("Error parsing products:", error);
          return res.status(400).json({
            success: false,
            message: "Invalid products format",
            error: error.message,
          });
        }
      }

      // Handle image upload if present
      if (req.file) {
        // Delete old image if exists
        if (req.body.currentImage) {
          try {
            const publicId = req.body.currentImage
              .split("/")
              .pop()
              .split(".")[0];
            await cloudinary.uploader.destroy(`pharmacy/suppliers/${publicId}`);
          } catch (error) {
            console.error("Error deleting old image:", error);
          }
        }

        // Upload new image
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "pharmacy/suppliers",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
      }

      const supplierData = {
        name: req.body.name,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        type: req.body.type,
        address: req.body.address,
        image: imageUrl,
        products: products,
      };

      const success = await SupplierModel.updateSupplier(id, supplierData);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Supplier not found or no changes made",
        });
      }

      res.status(200).json({
        success: true,
        message: "Supplier updated successfully",
      });
    } catch (error) {
      console.error(`Error in updateSupplier with ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to update supplier",
        error: error.message,
      });
    }
  }

  static async deleteSupplier(req, res) {
    try {
      const { id } = req.params;
      const success = await SupplierModel.deleteSupplier(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Supplier not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Supplier deleted successfully",
      });
    } catch (error) {
      console.error(`Error in deleteSupplier with ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: "Failed to delete supplier",
        error: error.message,
      });
    }
  }

  static async getAvailableProducts(req, res) {
    try {
      const products = await SupplierModel.getAvailableProducts();
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Error in getAvailableProducts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch available products",
        error: error.message,
      });
    }
  }
}

module.exports = SupplierController;
