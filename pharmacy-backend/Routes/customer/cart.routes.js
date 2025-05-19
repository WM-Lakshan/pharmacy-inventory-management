const express = require("express");
const router = express.Router();
const CartController = require("../../Controllers/customer/cart.controller");
const { authenticate, authorize } = require("../../auth/middleware/auth");

// All cart routes require authentication
router.use(authenticate);
router.use(authorize(["customer"]));

// Cart routes
router.get("/", CartController.getCartItems);
router.post("/add", CartController.addToCart);
router.put("/update-quantity", CartController.updateCartItemQuantity);
router.delete("/remove/:id", CartController.removeCartItem);

module.exports = router;
