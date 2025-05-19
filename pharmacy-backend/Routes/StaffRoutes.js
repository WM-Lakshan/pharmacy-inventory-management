const express = require("express");
const router = express.Router();
const StaffController = require("../Controllers/StaffController");
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

// Apply authentication and authorization middleware to all routes
// Only managers can access staff management
router.use(authenticate, authorize(["manager"]));

// Get all staff members
router.get("/", StaffController.getAllStaff);

// Get staff member by ID
router.get("/:id", StaffController.getStaffById);

// Create new staff member
router.post("/", upload.single("image"), StaffController.createStaff);

// Update staff member
router.put("/:id", upload.single("image"), StaffController.updateStaff);

// Delete staff member
router.delete("/:id", StaffController.deleteStaff);

module.exports = router;
