const Product = require("../../Models/staff/productModel");

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await Product.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      res
        .status(500)
        .json({ message: "Error fetching products", error: error.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.getProductById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("Error getting product:", error);
      res
        .status(500)
        .json({ message: "Error fetching product", error: error.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const productData = req.body;

      // Basic validation
      if (
        !productData.name ||
        !productData.price ||
        !productData.product_cato_id
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Handle image upload if included
      if (req.file) {
        productData.image = req.file.path;
      }

      const newProductId = await Product.createProduct(productData);

      res.status(201).json({
        message: "Product created successfully",
        productId: newProductId,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res
        .status(500)
        .json({ message: "Error creating product", error: error.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const productData = req.body;

      // Handle image upload if included
      if (req.file) {
        productData.image = req.file.path;
      }

      const updated = await Product.updateProduct(productId, productData);

      if (!updated) {
        return res
          .status(404)
          .json({ message: "Product not found or no changes made" });
      }

      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating product:", error);
      res
        .status(500)
        .json({ message: "Error updating product", error: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const deleted = await Product.deleteProduct(productId);

      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res
        .status(500)
        .json({ message: "Error deleting product", error: error.message });
    }
  }

  static async getProductsByCategory(req, res) {
    try {
      const categoryId = req.params.categoryId;
      const products = await Product.getProductsByCategory(categoryId);

      res.status(200).json(products);
    } catch (error) {
      console.error("Error getting products by category:", error);
      res
        .status(500)
        .json({ message: "Error fetching products", error: error.message });
    }
  }

  static async searchProducts(req, res) {
    try {
      const searchTerm = req.query.q;

      if (!searchTerm) {
        return res.status(400).json({ message: "Search term is required" });
      }

      const products = await Product.searchProducts(searchTerm);

      res.status(200).json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res
        .status(500)
        .json({ message: "Error searching products", error: error.message });
    }
  }
}
module.exports = ProductController;
