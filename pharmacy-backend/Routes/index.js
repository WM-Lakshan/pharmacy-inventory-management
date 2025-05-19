const express = require("express");
const router = express.Router();
const authRoutes = require("../auth/authRoutes");
const { authenticate, authorize } = require("../auth/middleware/auth");

// Auth routes
router.use("/auth", authRoutes);

// Protected admin route example
router.get("/admin-only", authenticate, authorize(["manager"]), (req, res) => {
  res.json({ message: "Admin access granted" });
});

module.exports = router;
