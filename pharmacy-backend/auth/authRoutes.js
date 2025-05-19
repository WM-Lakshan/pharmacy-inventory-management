
const express = require("express");
const router = express.Router();
const AuthController = require("./AuthController");
const { authenticate } = require("./middleware/auth");

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Protected route example
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
