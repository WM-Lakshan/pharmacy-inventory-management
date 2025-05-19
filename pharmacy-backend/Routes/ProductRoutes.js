// // routes/ProductRoutes.js
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const ProductController = require("../Controllers/ProductController");
// const { authenticate, authorize } = require("../auth/middleware/auth");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/inventory/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, "product-" + Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// router.use(authenticate, authorize(["manager"]));

// // Stats for dashboard (no auth required for this route in development)
// router.get("/stats", ProductController.getInventoryStats);

// // POST /api/inventory - Create a new product
// router.post(
//   "/",
//   authenticate,
//   authorize(["manager"]),
//   upload.single("image"),
//   ProductController.createProduct
// );

// // Get all products
// router.get("/", ProductController.getAllProducts);

// // Get single product
// router.get("/:id", ProductController.getProduct);

// // Get product history
// router.get("/:id/history", ProductController.getProductHistory);

// // Create new product
// // router.post("/", ProductController.createProduct);

// // Update product - with file upload
// router.put("/:id", upload.single("image"), ProductController.updateProduct);

// // Delete product
// router.delete("/:id", ProductController.deleteProduct);

// module.exports = router;

// routes/ProductRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const ProductController = require("../Controllers/ProductController");
const { authenticate, authorize } = require("../auth/middleware/auth");

// For handling multipart form data but not saving to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Stats route - public
router.get("/stats", ProductController.getInventoryStats);

// Protected routes that require authentication
router.use(authenticate);
router.use(authorize(["manager"]));

// Get all products
router.get("/", ProductController.getAllProducts);

// Get single product
router.get("/:id", ProductController.getProduct);

// Get product history
router.get("/:id/history", ProductController.getProductHistory);

// Create new product - with file upload
router.post("/", upload.single("image"), ProductController.createProduct);

// Update product - with file upload
router.put("/:id", upload.single("image"), ProductController.updateProduct);

// Delete product
router.delete("/:id", ProductController.deleteProduct);

router.put(
  "/:id",
  upload.single("image"), // This handles the file upload
  ProductController.updateProduct
);

module.exports = router;
