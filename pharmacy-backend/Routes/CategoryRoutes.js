// routes/CategoryRoutes.js
const express = require("express");
const router = express.Router();
const CategoryController = require("../Controllers/CategoryController");
const { authenticate, authorize } = require("../auth/middleware/auth");

// Protected routes that require authentication
router.use(authenticate, authorize(["manager"]));

// Get all categories
router.get("/", CategoryController.getAllCategories);

// Get single category
router.get("/:id", CategoryController.getCategoryById);

// Create new category
router.post("/", CategoryController.createCategory);

// Update category
router.put("/:id", CategoryController.updateCategory);

// Delete category
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
