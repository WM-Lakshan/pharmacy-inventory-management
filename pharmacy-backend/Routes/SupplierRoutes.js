// // const express = require("express");
// // const router = express.Router();
// // const supplierController = require("../Controllers/SupplierController");

// // // Create supplier
// // router.post("/", supplierController.createSupplier);

// // // Get all suppliers
// // router.get("/", supplierController.getAllSuppliers);

// // // Get single supplier
// // router.get("/:id", supplierController.getSupplier);

// // // Update supplier
// // router.put("/:id", supplierController.updateSupplier);

// // // Delete supplier
// // router.delete("/:id", supplierController.deleteSupplier);

// // module.exports = router;

// // Routes/SupplierRoutes.js
// const express = require("express");
// const router = express.Router();
// const SupplierController = require("../Controllers/SupplierController");
// const { authenticate, authorize } = require("../auth/middleware/auth");
// const multer = require("multer");
// const path = require("path");

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `supplier-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const extname = allowedTypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed"));
//     }
//   },
// });

// router.use(authenticate, authorize(["manager"]));

// // Get all suppliers (manager only)
// router.get(
//   "/",
//   // authenticate,
//   // authorize(["manager"]),
//   SupplierController.getAllSuppliers
// );

// // Get available products for supplier selection
// router.get(
//   "/products",
//   // authenticate,
//   // authorize(["manager"]),
//   SupplierController.getAvailableProducts
// );

// // Get supplier by ID (manager only)
// router.get(
//   "/:id",
//   // authenticate,
//   // authorize(["manager"]),
//   SupplierController.getSupplier
// );

// // Create supplier (manager only)
// router.post(
//   "/",
//   // authenticate,
//   // authorize(["manager"]),
//   upload.single("image"),
//   SupplierController.createSupplier
// );

// // Update supplier (manager only)
// router.put(
//   "/:id",
//   // authenticate,
//   // authorize(["manager"]),
//   upload.single("image"),
//   SupplierController.updateSupplier
// );

// router.get(
//   "/:id/products",
//   // authenticate,
//   // authorize(["manager", "staff"]),
//   SupplierController.getSupplierProducts
// );

// router.post(
//   "/:id/products",
//   // authenticate,
//   // authorize(["manager"]),
//   SupplierController.addSupplierProduct
// );

// router.delete(
//   "/:id/products/:productId",
//   // authenticate,
//   // authorize(["manager"]),
//   SupplierController.removeSupplierProduct
// );

// // Delete supplier (manager only)
// router.delete(
//   "/:id",
//   // authenticate,
//   // authorize(["manager"]),
//   SupplierController.deleteSupplier
// );

// module.exports = router;

// Routes/SupplierRoutes.js
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

// Comment out routes that may not have controller methods defined
// Make sure these methods are defined in your SupplierController before uncommenting

/* 
// These routes need corresponding controller methods
router.get("/:id/products", SupplierController.getSupplierProducts);

router.post("/:id/products", SupplierController.addSupplierProduct);

router.delete("/:id/products/:productId", SupplierController.removeSupplierProduct);
*/

module.exports = router;
