const express = require("express");
const router = express.Router();
const PasswordResetController = require("../Controllers/ForgotPWController");

// Request OTP for password reset
router.post("/request-otp", PasswordResetController.requestOTP);

// Verify OTP
router.post("/verify-otp", PasswordResetController.verifyOTP);

// Reset password after OTP verification
router.post("/reset-password", PasswordResetController.resetPassword);

module.exports = router;
