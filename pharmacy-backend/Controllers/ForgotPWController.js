const PasswordResetModel = require("../Models/ForgotPWModel");

class PasswordResetController {
  /**
   * Request a password reset OTP
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async requestOTP(req, res) {
    try {
      const { email, resend } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      // Find user by email
      const user = await PasswordResetModel.findUserByEmail(email);

      if (!user) {
        // Don't reveal if the email exists for security reasons
        return res.status(200).json({
          success: true,
          message:
            "If your email is registered, you will receive an OTP shortly",
        });
      }

      // Generate OTP
      const otp = PasswordResetModel.generateOTP();

      // Save OTP to database
      await PasswordResetModel.createOTP(user.id, user.type, email, otp);

      // Send OTP to user's email
      await PasswordResetModel.sendOTPEmail(email, otp, user.name);

      // For security reasons, don't confirm if the email exists
      return res.status(200).json({
        success: true,
        message: "If your email is registered, you will receive an OTP shortly",
        userType: user.type, // Include user type for the next steps
      });
    } catch (error) {
      console.error("Error requesting OTP:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your request",
      });
    }
  }

  /**
   * Verify OTP for password reset
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async verifyOTP(req, res) {
    try {
      const { email, otp, userType } = req.body;

      if (!email || !otp || !userType) {
        return res.status(400).json({
          success: false,
          message: "Email, OTP, and user type are required",
        });
      }

      // Verify OTP
      const verification = await PasswordResetModel.verifyOTP(
        email,
        otp,
        userType
      );

      if (!verification.success) {
        return res.status(400).json({
          success: false,
          message: verification.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while verifying the OTP",
      });
    }
  }

  /**
   * Reset password after OTP verification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async resetPassword(req, res) {
    try {
      const { email, password, userType } = req.body;

      if (!email || !password || !userType) {
        return res.status(400).json({
          success: false,
          message: "Email, password, and user type are required",
        });
      }

      // Check password strength
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
      }

      // Check if password contains at least one uppercase letter and one number
      if (!/^(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return res.status(400).json({
          success: false,
          message:
            "Password must contain at least one uppercase letter and one number",
        });
      }

      // Reset password
      const result = await PasswordResetModel.resetPassword(
        email,
        password,
        userType
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while resetting the password",
      });
    }
  }
}

module.exports = PasswordResetController;
