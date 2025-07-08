const express = require("express");
const router = express.Router();
const SupplierController = require("../Controllers/SupplierController");
const { authenticate, authorize } = require("../auth/middleware/auth");
const multer = require("multer");
const path = require("path");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `supplier-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.use(authenticate);
router.use(authorize(["manager"]));

// Important: Keep this route BEFORE the /:id route to prevent conflicts
router.get("/products", SupplierController.getAvailableProducts);

// Get all suppliers
router.get("/", SupplierController.getAllSuppliers);

// Get supplier by ID
router.get("/:id", SupplierController.getSupplier);

// Create supplier
router.post("/", upload.single("image"), SupplierController.createSupplier);

// Update supplier
router.put("/:id", upload.single("image"), SupplierController.updateSupplier);

// Delete supplier
router.delete("/:id", SupplierController.deleteSupplier);


module.exports = router;
