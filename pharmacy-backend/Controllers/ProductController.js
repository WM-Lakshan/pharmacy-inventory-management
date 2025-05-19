// controllers/ProductController.js
const ProductModel = require("../Models/ProductModel");
const { db } = require("../db");
const {
  uploadImage,
  deleteImage,
  getPublicIdFromUrl,
} = require("../utils/uploadImage");

const getCategoryByName = async (categoryName) => {
  try {
    console.log(`Searching for category name: "${categoryName}"`);

    // Get all categories for debugging
    const [allCategories] = await db.execute(
      "SELECT product_cato_id as id, name FROM product_cato"
    );
    console.log("Available categories:", allCategories);

    // Case insensitive search
    const [rows] = await db.execute(
      "SELECT product_cato_id as id, name FROM product_cato WHERE LOWER(name) = LOWER(?)",
      [categoryName]
    );

    console.log(`Search results for "${categoryName}":`, rows);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error getting category by name:", error);
    return null;
  }
};

class ProductController {
  // Get all products
  static async getAllProducts(req, res) {
    try {
      const products = await ProductModel.getAllProducts();

      res.status(200).json({
        success: true,
        products,
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

  // Get inventory statistics for dashboard
  static async getInventoryStats(req, res) {
    try {
      const stats = await ProductModel.getInventoryStats();

      res.status(200).json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error("Error in getInventoryStats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch inventory statistics",
        error: error.message,
      });
    }
  }

  // Get single product
  static async getProduct(req, res) {
    try {
      const product = await ProductModel.getProductById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Error in getProduct:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product",
        error: error.message,
      });
    }
  }

  // Create new product
  // static async createProduct(req, res) {
  //   try {
  //     // Validate required fields
  //     const { name, price, category, type, threshold } = req.body;

  //     if (!name || !price || !category || !type || !threshold) {
  //       return res.status(400).json({
  //         success: false,
  //         message:
  //           "Please provide all required fields: name, price, category, type, and threshold",
  //       });
  //     }

  //       // Get the file path if uploaded
  //   //const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

  //     // Extract category ID
  //     let categoryId = parseInt(req.body.categoryId || req.body.category_id);

  //     // If no category ID provided, try to find by name
  //     if (!categoryId && typeof category === "string") {
  //       const CategoryModel = require("../models/CategoryModel");
  //       const categories = await CategoryModel.getAllCategories();
  //       const foundCategory = categories.find(
  //         (c) => c.name.toLowerCase() === category.toLowerCase()
  //       );

  //       if (!foundCategory) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Invalid category selected",
  //         });
  //       }

  //       categoryId = foundCategory.id;
  //     }

  //     // Prepare product data
  //     const productData = {
  //       name,
  //       price: parseFloat(price),
  //       categoryId,
  //       type,
  //       threshold: parseInt(threshold),
  //     };

  //     // Handle image upload
  //     let imageFile = null;
  //     if (req.files && req.files.image) {
  //       imageFile = req.files.image;
  //     }

  //     const productId = await ProductModel.createProduct(
  //       productData,
  //       imageFile
  //     );

  //     res.status(201).json({
  //       success: true,
  //       message: "Product created successfully",
  //       productId,
  //     });
  //   } catch (error) {
  //     console.error("Error in createProduct:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to create product",
  //       error: error.message,
  //     });
  //   }
  // }

  // // In your product controller
  // static async createProduct(req, res) {
  //   try {
  //     console.log("Request body:", req.body);
  //     console.log("File:", req.file);

  //     // Extract data from request
  //     const { name, category, price, type, threshold } = req.body;

  //     // Validate input
  //     if (!name || !category || !price || !threshold) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Missing required fields",
  //         receivedFields: Object.keys(req.body),
  //       });
  //     }

  //     // Get file path if uploaded
  //     const imagePath = req.file
  //       ? `/uploads/inventory/${req.file.filename}`
  //       : null;

  //     // Convert values to appropriate types
  //     const priceValue = parseFloat(price);
  //     const thresholdValue = parseInt(threshold);

  //     // Get category ID from name if needed
  //     const categoryId = await getCategoryIdFromName(category);
  //     if (!categoryId) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid category",
  //       });
  //     }

  //     // Use your product model to create the product
  //     const productId = await ProductModel.createProduct({
  //       name,
  //       categoryId,
  //       price: priceValue,
  //       type: type,
  //       threshold: thresholdValue,
  //       image: imagePath,
  //     });

  //     return res.status(201).json({
  //       success: true,
  //       message: "Product added successfully",
  //       productId,
  //     });
  //   } catch (error) {
  //     console.error("Error creating product:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Failed to create product",
  //       error: error.message,
  //     });
  //   }
  // }

  // // Update product
  // static async updateProduct(req, res) {
  //   try {
  //     const productId = req.params.id;

  //     // Check if product exists
  //     const existingProduct = await ProductModel.getProductById(productId);
  //     if (!existingProduct) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Product not found",
  //       });
  //     }

  //     // Extract category ID
  //     let categoryId = parseInt(req.body.categoryId || req.body.category_id);

  //     // If no category ID provided, try to find by name
  //     if (!categoryId && req.body.category) {
  //       const CategoryModel = require("../models/CategoryModel");
  //       const categories = await CategoryModel.getAllCategories();
  //       const foundCategory = categories.find(
  //         (c) => c.name.toLowerCase() === req.body.category.toLowerCase()
  //       );

  //       if (!foundCategory) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Invalid category selected",
  //         });
  //       }

  //       categoryId = foundCategory.id;
  //     }

  //     // Prepare update data
  //     const updateData = {
  //       name: req.body.name,
  //       price: parseFloat(req.body.price),
  //       categoryId: categoryId || existingProduct.categoryId,
  //       type: req.body.type,
  //       threshold: parseInt(req.body.threshold),
  //     };

  //     // Handle image upload
  //     let imageFile = null;
  //     if (req.files && req.files.image) {
  //       imageFile = req.files.image;
  //     }

  //     const success = await ProductModel.updateProduct(
  //       productId,
  //       updateData,
  //       imageFile
  //     );

  //     if (!success) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Product not found or update failed",
  //       });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: "Product updated successfully",
  //     });
  //   } catch (error) {
  //     console.error("Error in updateProduct:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to update product",
  //       error: error.message,
  //     });
  //   }
  // }

  /**
   * Create a new product
   */
  // static async createProduct(req, res) {
  //   try {
  //     const { name, category, price, type, threshold } = req.body;

  //     // Validate required fields
  //     if (!name || !category || !price || !threshold) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Missing required fields",
  //       });
  //     }

  //     // Upload image to Cloudinary if provided
  //     let imageUrl = null;
  //     if (req.file) {
  //       try {
  //         const uploadResult = await uploadImage(req.file, "products");
  //         imageUrl = uploadResult.url;
  //       } catch (uploadError) {
  //         console.error("Image upload error:", uploadError);
  //         // Continue without image if upload fails
  //       }
  //     }

  //     // Find or convert category_id from category name if needed
  //     const categoryObj = await getCategoryByName(category);
  //     const categoryId = categoryObj ? categoryObj.id : null;

  //     // If category doesn't exist
  //     if (!categoryId) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid category",
  //       });
  //     }

  //     // Create product using model
  //     const productId = await ProductModel.createProduct({
  //       name,
  //       categoryId,
  //       price: parseFloat(price),
  //       type: type, // Use type to match database field
  //       threshold: parseInt(threshold),
  //       image: imageUrl,
  //     });

  //     return res.status(201).json({
  //       success: true,
  //       message: "Product created successfully",
  //       productId,
  //     });
  //   } catch (error) {
  //     console.error("Error creating product:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Failed to create product",
  //       error: error.message,
  //     });
  //   }
  // }

  ////////////correct one /////////////
  static async createProduct(req, res) {
    try {
      const { name, category, price, type, threshold } = req.body;

      // Debug logging
      console.log("Request body:", req.body);
      console.log("Extracted values:", {
        name,
        category,
        price,
        type,
        threshold,
      });

      // Validate required fields
      if (!name || !category || !price || !threshold) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
          receivedFields: { name, category, price, type, threshold },
        });
      }

      // Upload image to Cloudinary if provided
      let imageUrl = null;
      if (req.file) {
        try {
          const uploadResult = await uploadImage(req.file, "products");
          imageUrl = uploadResult.url;
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
        }
      }

      // Find or convert category_id from category name if needed
      const categoryObj = await getCategoryByName(category);
      const categoryId = categoryObj ? categoryObj.id : null;

      // If category doesn't exist
      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      // IMPORTANT: Ensure type is always provided - use default if not present
      // This value must match one of the allowed enum values in your database
      const productType = type || "prescription not needed"; // Default value
      const productThreshold = parseInt(threshold) || 0;
      const productPrice = parseFloat(price) || 0;

      // Log the data being sent to the model
      console.log("Sending to model:", {
        name,
        categoryId,
        price: productPrice,
        type: productType,
        threshold: productThreshold,
        image: imageUrl,
      });

      // Create product using model
      const productId = await ProductModel.createProduct({
        name,
        categoryId,
        price: productPrice,
        type: productType,
        threshold: productThreshold,
        image: imageUrl,
      });

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        productId,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create product",
        error: error.message,
      });
    }
  }

  /**
   * Update an existing product
   */
  // static async updateProduct(req, res) {
  //   try {
  //     const productId = req.params.id;
  //     const { name, category, price, type, threshold } = req.body;

  //     // Validate product exists
  //     const existingProduct = await ProductModel.getProductById(productId);
  //     if (!existingProduct) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Product not found",
  //       });
  //     }

  //     // Upload new image to Cloudinary if provided
  //     let imageUrl = existingProduct.image;
  //     if (req.file) {
  //       try {
  //         // Delete previous image if exists
  //         if (existingProduct.image) {
  //           const publicId = getPublicIdFromUrl(existingProduct.image);
  //           if (publicId) {
  //             await deleteImage(publicId);
  //           }
  //         }

  //         // Upload new image
  //         const uploadResult = await uploadImage(req.file, "products");
  //         imageUrl = uploadResult.url;
  //       } catch (uploadError) {
  //         console.error("Image upload error:", uploadError);
  //         // Continue with existing image if upload fails
  //       }
  //     }

  //     // Find or convert category_id from category name if needed
  //     let categoryId = existingProduct.categoryId;
  //     if (category) {
  //       const categoryObj = await getCategoryByName(category);
  //       categoryId = categoryObj ? categoryObj.id : categoryId;
  //     }

  //     // Update product
  //     const success = await ProductModel.updateProduct(productId, {
  //       name: name || existingProduct.name,
  //       categoryId,
  //       price: price ? parseFloat(price) : existingProduct.price,
  //       type: type || existingProduct.type,
  //       threshold: threshold ? parseInt(threshold) : existingProduct.threshold,
  //       image: imageUrl,
  //     });

  //     if (!success) {
  //       return res.status(500).json({
  //         success: false,
  //         message: "Failed to update product",
  //       });
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       message: "Product updated successfully",
  //     });
  //   } catch (error) {
  //     console.error("Error updating product:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Failed to update product",
  //       error: error.message,
  //     });
  //   }
  // }

  // Delete product

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      let imageUrl = req.body.image; // Existing image URL

      // Handle new image upload if present
      if (req.file) {
        // Delete old image if exists
        if (req.body.image) {
          await deleteImage(getPublicIdFromUrl(req.body.image));
        }

        // Upload new image
        const uploadResult = await uploadImage(req.file);
        imageUrl = uploadResult.url;
      }

      // Update product with new data
      const updated = await ProductModel.updateProduct(id, {
        ...req.body,
        image: imageUrl,
      });

      res.json({
        success: true,
        product: updated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const success = await ProductModel.deleteProduct(req.params.id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteProduct:", error);

      // Custom error message for product in use
      if (error.message.includes("Cannot delete product")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete product",
        error: error.message,
      });
    }
  }

  // Get product history
  static async getProductHistory(req, res) {
    try {
      const productId = req.params.id;

      // Check if product exists
      const product = await ProductModel.getProductById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const history = await ProductModel.getProductHistory(productId);

      res.status(200).json({
        success: true,
        history,
      });
    } catch (error) {
      console.error("Error in getProductHistory:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product history",
        error: error.message,
      });
    }
  }
}

module.exports = ProductController;
