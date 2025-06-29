
const { db } = require("../db");
const bcrypt = require("bcrypt");
const {
  uploadImage,
  deleteImage,
  getPublicIdFromUrl,
} = require("../utils/uploadImage");

class UserModel {
  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @param {string} role - User role
   * @returns {Promise<Object>} User details
   */
  static async getUserById(userId, role) {
    try {
      // Determine which table to query based on the role
      let table, idField, nameFields;
      switch (role) {
        case "customer":
          table = "customer";
          idField = "customer_id";
          nameFields = "name AS fullName";
          break;
        case "staff":
          table = "pharmacy_staff";
          idField = "pharmacy_staff_id";
          nameFields = "CONCAT(F_name, ' ', L_name) AS fullName";
          break;
        case "manager":
          table = "manager";
          idField = "manager_id";
          nameFields = "CONCAT(F_name, ' ', L_name) AS fullName";
          break;
        
        default:
          throw new Error("Invalid user role");
      }

      // Query for the user
      const [users] = await db.execute(
        `SELECT 
          ${idField} AS id, 
          ${nameFields}, 
          email, 
          address, 
          image AS profileImage,
          role
        FROM ${table} 
        WHERE ${idField} = ?`,
        [userId]
      );

      if (users.length === 0) {
        return null;
      }

      // Get phone number(s)
      let phoneNumberQuery, phoneNumberField;
      if (role === "customer") {
        phoneNumberQuery = "SELECT number FROM cusnumber WHERE customer_id = ?";
        phoneNumberField = "customer_id";
      } else if (role === "staff") {
        phoneNumberQuery =
          "SELECT number FROM pharmacy_staff_tel WHERE pharmacy_staff_id = ?";
        phoneNumberField = "pharmacy_staff_id";
      } else if (role === "manager") {
        phoneNumberQuery = "SELECT number FROM m_tel WHERE manager_id = ?";
        phoneNumberField = "manager_id";
      } 
   

      const [phoneNumbers] = await db.execute(phoneNumberQuery, [userId]);

      // Add phone number to user object
      const user = users[0];
      user.contactNumber =
        phoneNumbers.length > 0 ? phoneNumbers[0].number : null;

      return user;
    } catch (error) {
      console.error("Error in getUserById:", error);
      throw error;
    }
  }

  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @param {number} userId - Current user ID (to exclude from check)
   * @param {string} role - User role
   * @returns {Promise<boolean>} True if email exists, false otherwise
   */
  static async isEmailExists(email, userId, role) {
    try {
      // Check email in all user tables
      const tables = [
        { name: "customer", idField: "customer_id" },
        { name: "pharmacy_staff", idField: "pharmacy_staff_id" },
        { name: "manager", idField: "manager_id" },
        
      ];

      for (const table of tables) {
        // Skip checking the current user's own email
        if (table.name === this.getRoleTable(role) && userId) {
          const [result] = await db.execute(
            `SELECT email FROM ${table.name} WHERE email = ? AND ${table.idField} != ?`,
            [email, userId]
          );

          if (result.length > 0) {
            return true;
          }
        } else {
          const [result] = await db.execute(
            `SELECT email FROM ${table.name} WHERE email = ?`,
            [email]
          );

          if (result.length > 0) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error("Error in isEmailExists:", error);
      throw error;
    }
  }

  /**
   * Helper method to get table name from role
   * @param {string} role - User role
   * @returns {string} Table name
   */
  static getRoleTable(role) {
    switch (role) {
      case "customer":
        return "customer";
      case "staff":
        return "pharmacy_staff";
      case "manager":
        return "manager";
      default:
        throw new Error("Invalid user role");
    }
  }


  //userId - User ID , role - User role , userData - User data to update
  
  static async updateUserProfile(userId, role, userData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Determine which table to update based on role
      let table, idField;
      switch (role) {
        case "customer":
          table = "customer";
          idField = "customer_id";
          break;
        case "staff":
          table = "pharmacy_staff";
          idField = "pharmacy_staff_id";
          break;
        case "manager":
          table = "manager";
          idField = "manager_id";
          break;
        default:
          throw new Error("Invalid user role");
      }

      // Update basic user info
      // For customer, the name is a single field
      if (role === "customer") {
        await connection.execute(
          `UPDATE ${table} SET 
            name = ?, 
            email = ?, 
            address = ? 
          WHERE ${idField} = ?`,
          [userData.name, userData.email, userData.address, userId]
        );
      } else {
        // For manager, staff, name is split into F_name and L_name
        const names = userData.name.split(" ");
        const firstName = names[0];
        const lastName = names.slice(1).join(" ");

        await connection.execute(
          `UPDATE ${table} SET 
            F_name = ?, 
            L_name = ?, 
            email = ?, 
            address = ?
          WHERE ${idField} = ?`,
          [firstName, lastName, userData.email, userData.address, userId]
        );
      }

      // Update phone number if provided
      if (userData.contactNumber) {
        let phoneTable, phoneField;
        if (role === "customer") {
          phoneTable = "cusnumber";
          phoneField = "customer_id";
        } else if (role === "staff") {
          phoneTable = "pharmacy_staff_tel";
          phoneField = "pharmacy_staff_id";
        } else if (role === "manager") {
          phoneTable = "m_tel";
          phoneField = "manager_id";
        } 

        // Check if phone number already exists
        const [existingPhones] = await connection.execute(
          `SELECT number FROM ${phoneTable} WHERE ${phoneField} = ?`,
          [userId]
        );

        if (existingPhones.length > 0) {
          // Update the existing phone number
          await connection.execute(
            `UPDATE ${phoneTable} SET number = ? WHERE ${phoneField} = ?`,
            [userData.contactNumber, userId]
          );
        } else {
          // Insert a new phone number
          await connection.execute(
            `INSERT INTO ${phoneTable} (${phoneField}, number) VALUES (?, ?)`,
            [userId, userData.contactNumber]
          );
        }
      }

      await connection.commit();
      return { success: true, message: "Profile updated successfully" };
    } catch (error) {
      await connection.rollback();
      console.error("Error in updateUserProfile:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Change user password
   * @param {number} userId - User ID
   * @param {string} role - User role
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Result object
   */
  static async changePassword(userId, role, currentPassword, newPassword) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Determine which table to update based on role
      let table, idField;
      switch (role) {
        case "customer":
          table = "customer";
          idField = "customer_id";
          break;
        case "staff":
          table = "pharmacy_staff";
          idField = "pharmacy_staff_id";
          break;
        case "manager":
          table = "manager";
          idField = "manager_id";
          break;
        default:
          throw new Error("Invalid user role");
      }

      // Get current password
      const [users] = await connection.execute(
        `SELECT password FROM ${table} WHERE ${idField} = ?`,
        [userId]
      );

      if (users.length === 0) {
        await connection.rollback();
        return { success: false, message: "User not found" };
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, users[0].password);
      if (!isMatch) {
        await connection.rollback();
        return { success: false, message: "Current password is incorrect" };
      }

      // Hash and update new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await connection.execute(
        `UPDATE ${table} SET password = ? WHERE ${idField} = ?`,
        [hashedPassword, userId]
      );

      await connection.commit();
      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      await connection.rollback();
      console.error("Error in changePassword:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update user profile image
   * @param {number} userId - User ID
   * @param {string} role - User role
   * @param {Object} file - Uploaded file
   * @returns {Promise<Object>} Result object with image URL
   */
  static async updateProfileImage(userId, role, file) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Determine which table to update based on role
      let table, idField;
      switch (role) {
        case "customer":
          table = "customer";
          idField = "customer_id";
          break;
        case "staff":
          table = "pharmacy_staff";
          idField = "pharmacy_staff_id";
          break;
        case "manager":
          table = "manager";
          idField = "manager_id";
          break;
        
        default:
          throw new Error("Invalid user role");
      }

      // Get current profile image if exists
      const [users] = await connection.execute(
        `SELECT image FROM ${table} WHERE ${idField} = ?`,
        [userId]
      );

      if (users.length === 0) {
        await connection.rollback();
        return { success: false, message: "User not found" };
      }

      const currentImage = users[0].image;

      // Delete current image from cloudinary if exists
      if (currentImage) {
        const publicId = getPublicIdFromUrl(currentImage);
        if (publicId) {
          await deleteImage(publicId);
        }
      }

      // Upload new image to cloudinary
      const uploadResult = await uploadImage(file, "profiles");

      // Update profile image URL in database
      await connection.execute(
        `UPDATE ${table} SET image = ? WHERE ${idField} = ?`,
        [uploadResult.url, userId]
      );

      await connection.commit();
      return {
        success: true,
        message: "Profile image updated successfully",
        imageUrl: uploadResult.url,
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error in updateProfileImage:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = UserModel;
