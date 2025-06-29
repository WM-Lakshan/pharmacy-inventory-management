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
AWE
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
