const express = require("express");
const router = express.Router();
const productController = require("../../Controllers/staff/productController");
const { authenticate, authorize } = require("../../auth/middleware/auth");
// const upload = require("../../utils/uploadImage");
const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, "product-" + uniqueSuffix + extension);
  },
});

// File filter to validate upload types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Create the multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limit to 5MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;

router.use(authenticate, authorize(["staff"]));

// GET all products
router.get("/", productController.getAllProducts);

// GET product by ID
router.get("/:id", productController.getProductById);

// POST create new product with image upload
router.post("/", upload.single("image"), productController.createProduct);

// PUT update product with optional image upload
router.put("/:id", upload.single("image"), productController.updateProduct);

// DELETE product
router.delete("/:id", productController.deleteProduct);

// GET products by category
router.get("/category/:categoryId", productController.getProductsByCategory);

// GET search products
router.get("/search", productController.searchProducts);

module.exports = router;
