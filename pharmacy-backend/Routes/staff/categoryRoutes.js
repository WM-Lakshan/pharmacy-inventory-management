// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../../Controllers/staff/categoryController");
const { authenticate, authorize } = require("../../auth/middleware/auth");

router.use(authenticate, authorize(["staff"]));

router.get("/", categoryController.getAllCategories);

/**
 * @route GET /api/categories/:id
 * @description Get a single category by ID
 * @access Private - staff, manager, supplier
 */
router.get("/:id", categoryController.getCategoryById);
/**
 * @route POST /api/categories
 * @description Create a new category
 * @access Private - manager only
 */
router.post("/", authorize(["manager"]), categoryController.createCategory);

/**
 * @route PUT /api/categories/:id
 * @description Update an existing category
 * @access Private - manager only
 */
router.put("/:id", authorize(["manager"]), categoryController.updateCategory);

/**
 * @route DELETE /api/categories/:id
 * @description Delete a category
 * @access Private - manager only
 */
router.delete(
  "/:id",
  authorize(["manager"]),
  categoryController.deleteCategory
);

module.exports = router;
