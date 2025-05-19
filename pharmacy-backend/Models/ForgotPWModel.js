const { db } = require("../db");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

class PasswordResetModel {
  /**
   * Generate a random 6-digit OTP
   */
  static generateOTP() {
    // Generate a 6-digit number between 100000 and 999999
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Find a user by email across all user tables
   * @param {string} email - The email to search for
   * @returns {Object|null} - User data if found, null otherwise
   */
  static async findUserByEmail(email) {
    try {
      // Check customer table
      const [customers] = await db.execute(
        "SELECT customer_id as id, 'customer' as type, email, name FROM customer WHERE email = ?",
        [email]
      );

      if (customers.length > 0) {
        return customers[0];
      }

      // Check pharmacy_staff table
      const [staff] = await db.execute(
        "SELECT pharmacy_staff_id as id, 'staff' as type, email, CONCAT(F_name, ' ', L_name) as name FROM pharmacy_staff WHERE email = ?",
        [email]
      );

      if (staff.length > 0) {
        return staff[0];
      }

      // Check manager table
      const [managers] = await db.execute(
        "SELECT manager_id as id, 'manager' as type, email, CONCAT(F_name, ' ', L_name) as name FROM manager WHERE email = ?",
        [email]
      );

      if (managers.length > 0) {
        return managers[0];
      }

      // Check supplier table
      const [suppliers] = await db.execute(
        "SELECT sup_id as id, 'supplier' as type, email, CONCAT(F_name, ' ', L_name) as name FROM supplier WHERE email = ?",
        [email]
      );

      if (suppliers.length > 0) {
        return suppliers[0];
      }

      return null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  /**
   * Create or update OTP for a user
   * @param {number} userId - User ID
   * @param {string} userType - User type (customer, staff, manager, supplier)
   * @param {string} email - User email
   * @param {string} otp - Generated OTP
   * @returns {boolean} - Success status
   */
  static async createOTP(userId, userType, email, otp) {
    try {
      // First check if there's an existing OTP record for this user
      const [existingOTPs] = await db.execute(
        "SELECT * FROM password_reset_otps WHERE user_id = ? AND user_type = ?",
        [userId, userType]
      );

      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 5); // OTP valid for 5 minutes

      if (existingOTPs.length > 0) {
        // Update existing OTP
        await db.execute(
          "UPDATE password_reset_otps SET otp = ?, expiry_time = ?, attempts = 0 WHERE user_id = ? AND user_type = ?",
          [otp, expiryTime, userId, userType]
        );
      } else {
        // Create new OTP record
        await db.execute(
          "INSERT INTO password_reset_otps (user_id, user_type, email, otp, expiry_time) VALUES (?, ?, ?, ?, ?)",
          [userId, userType, email, otp, expiryTime]
        );
      }

      return true;
    } catch (error) {
      console.error("Error creating OTP:", error);
      throw error;
    }
  }

  /**
   * Send OTP to user's email
   * @param {string} email - Recipient email
   * @param {string} otp - OTP to send
   * @param {string} name - User's name
   * @returns {boolean} - Success status
   */
  static async sendOTPEmail(email, otp, name) {
    try {
      // Create nodemailer transporter
      const transporter = nodemailer.createTransport({
        // Configure your email service here
        service: process.env.EMAIL_SERVICE || "gmail",
        auth: {
          user: process.env.EMAIL_USER || "your-email@gmail.com",
          pass: process.env.EMAIL_PASSWORD || "your-email-password",
        },
      });

      // Create email template
      const mailOptions = {
        from: process.env.EMAIL_FROM || "L.W.Pharmacy <noreply@lwpharmacy.com>",
        to: email,
        subject: "Password Reset - OTP Verification",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e8e8e8; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #1890ff;">L.W.Pharmacy</h2>
            </div>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="margin-top: 0;">Hello ${
                name || "Valued Customer"
              },</h3>
              <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to verify your identity:</p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="font-size: 24px; letter-spacing: 5px; font-weight: bold; background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">
                  ${otp}
                </div>
              </div>
              <p>This OTP will expire in 5 minutes.</p>
              <p>If you did not request this password reset, please ignore this email or contact our support team.</p>
            </div>
            <div style="text-align: center; color: #888; font-size: 12px;">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} L.W.Pharmacy. All rights reserved.</p>
            </div>
          </div>
        `,
      };

      // Send email
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending OTP email:", error);
      throw error;
    }
  }

  /**
   * Verify OTP for password reset
   * @param {string} email - User email
   * @param {string} otp - OTP to verify
   * @param {string} userType - User type (customer, staff, manager, supplier)
   * @returns {Object} - Verification result with success status and user data
   */
  static async verifyOTP(email, otp, userType) {
    try {
      // Get the OTP record
      const [otpRecords] = await db.execute(
        "SELECT * FROM password_reset_otps WHERE email = ? AND user_type = ?",
        [email, userType]
      );

      if (otpRecords.length === 0) {
        return { success: false, message: "No OTP found for this email" };
      }

      const otpRecord = otpRecords[0];
      const currentTime = new Date();
      const expiryTime = new Date(otpRecord.expiry_time);

      // Check if OTP is expired
      if (currentTime > expiryTime) {
        return { success: false, message: "OTP has expired" };
      }

      // Check if max attempts reached
      if (otpRecord.attempts >= 3) {
        return {
          success: false,
          message:
            "Maximum verification attempts reached. Please request a new OTP",
        };
      }

      // Update attempts
      await db.execute(
        "UPDATE password_reset_otps SET attempts = attempts + 1 WHERE id = ?",
        [otpRecord.id]
      );

      // Verify OTP
      if (otpRecord.otp !== otp) {
        return { success: false, message: "Invalid OTP" };
      }

      // Mark OTP as verified
      await db.execute(
        "UPDATE password_reset_otps SET is_verified = TRUE WHERE id = ?",
        [otpRecord.id]
      );

      return {
        success: true,
        userId: otpRecord.user_id,
        userType: otpRecord.user_type,
      };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }

  /**
   * Reset user password
   * @param {string} email - User email
   * @param {string} newPassword - New password
   * @param {string} userType - User type (customer, staff, manager, supplier)
   * @returns {boolean} - Success status
   */
  static async resetPassword(email, newPassword, userType) {
    try {
      // Check if OTP was verified
      const [otpRecords] = await db.execute(
        "SELECT * FROM password_reset_otps WHERE email = ? AND user_type = ? AND is_verified = TRUE",
        [email, userType]
      );

      if (otpRecords.length === 0) {
        return {
          success: false,
          message: "OTP verification required before password reset",
        };
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password based on user type
      let query;
      let userId;

      switch (userType) {
        case "customer":
          query = "UPDATE customer SET password = ? WHERE email = ?";
          break;
        case "staff":
          query = "UPDATE pharmacy_staff SET password = ? WHERE email = ?";
          break;
        case "manager":
          query = "UPDATE manager SET password = ? WHERE email = ?";
          break;
        case "supplier":
          query = "UPDATE supplier SET password = ? WHERE email = ?";
          break;
        default:
          return { success: false, message: "Invalid user type" };
      }

      // Execute the update
      await db.execute(query, [hashedPassword, email]);

      // Delete the OTP record after successful password reset
      await db.execute(
        "DELETE FROM password_reset_otps WHERE email = ? AND user_type = ?",
        [email, userType]
      );

      return { success: true };
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }
}

module.exports = PasswordResetModel;
