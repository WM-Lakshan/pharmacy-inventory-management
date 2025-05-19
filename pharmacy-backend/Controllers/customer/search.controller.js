const SearchModel = require("../../Models/customer/search.model");

class SearchController {
  //   static async searchProducts(req, res) {
  //     try {
  //       const { q } = req.query;
  //       if (!q || q.trim() === "") {
  //         return res.status(400).json({ error: "Search term is required" });
  //       }

  //       const products = await SearchModel.searchProducts(q);
  //       res.json({ products });
  //     } catch (error) {
  //       console.error("Search controller error:", error);
  //       res.status(500).json({ error: "Internal server error" });
  //     }
  //   }

  //   static async searchProducts(req, res) {
  //     try {
  //       const { q } = req.query;

  //       if (!q || q.trim() === "") {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Search query is required",
  //         });
  //       }

  //       const products = await Product.find({
  //         $or: [
  //           { pname: { $regex: q, $options: "i" } },
  //           { description: { $regex: q, $options: "i" } },
  //         ],
  //       }).limit(10);

  //       // Transform products to include image URLs
  //       const results = products.map((product) => ({
  //         ...product._doc,
  //         image: product.image || "/default-product.jpg",
  //       }));

  //       res.json({ success: true, products: results });
  //     } catch (error) {
  //       console.error("Search error:", error);
  //       res.status(500).json({
  //         success: false,
  //         message: "Internal server error",
  //       });
  //     }
  //   }

  static async searchProducts(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim() === "") {
        return res.status(400).json([]);
      }

      const products = await SearchModel.searchProducts(q);
      res.json(products);
    } catch (error) {
      console.error("Search controller error:", error);
      res.status(500).json([]);
    }
  }

  static async getProductDetails(req, res) {
    try {
      const { id } = req.params;
      const [product] = await SearchModel.searchProducts(id, 1);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const relatedProducts = await SearchModel.getRelatedProducts(id);
      res.json({ product, relatedProducts });
    } catch (error) {
      console.error("Product details error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getRelatedProducts(req, res) {
    try {
      const { id } = req.params;
      const relatedProducts = await SearchModel.getRelatedProducts(id);
      res.json({ products: relatedProducts });
    } catch (error) {
      console.error("Related products error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = SearchController;
