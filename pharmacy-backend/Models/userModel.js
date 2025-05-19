// // models/userModel.js
// const { db } = require("../db");
// const bcrypt = require("bcrypt");

// class UserModel {
//   /**
//    * Get user profile by ID and role
//    * @param {number} userId - User ID
//    * @param {string} role - User role (customer, staff, manager, supplier)
//    * @returns {Promise<Object>} User profile data
//    */
//   static async getUserProfile(userId, role) {
//     try {
//       let table, idField, userData;

//       // Determine which table to query based on role
//       switch (role) {
//         case "customer":
//           table = "customer";
//           idField = "customer_id";
//           break;
//         case "staff":
//           table = "pharmacy_staff";
//           idField = "pharmacy_staff_id";
//           break;
//         case "manager":
//           table = "manager";
//           idField = "manager_id";
//           break;
//         case "supplier":
//           table = "supplier";
//           idField = "sup_id";
//           break;
//         default:
//           throw new Error("Invalid user role");
//       }

//       // Query user data from appropriate table
//       const [userRows] = await db.execute(
//         `SELECT * FROM ${table} WHERE ${idField} = ?`,
//         [userId]
//       );

//       if (userRows.length === 0) {
//         return null;
//       }

//       userData = userRows[0];

//       // Format data according to role
//       let formattedUser = {};

//       if (role === "customer") {
//         // Get phone number from cusnumber table
//         const [phoneRows] = await db.execute(
//           "SELECT number FROM cusnumber WHERE customer_id = ? LIMIT 1",
//           [userId]
//         );

//         formattedUser = {
//           id: userData.customer_id,
//           name: userData.name,
//           email: userData.email,
//           address: userData.address || "",
//           phone: phoneRows.length > 0 ? phoneRows[0].number : "",
//           image: userData.image || null,
//           role: "customer",
//         };
//       } else if (role === "staff") {
//         // Get phone number from pharmacy_staff_tel table
//         const [phoneRows] = await db.execute(
//           "SELECT number FROM pharmacy_staff_tel WHERE pharmacy_staff_id = ? LIMIT 1",
//           [userId]
//         );

//         formattedUser = {
//           id: userData.pharmacy_staff_id,
//           name: `${userData.F_name} ${userData.L_name}`,
//           firstName: userData.F_name,
//           lastName: userData.L_name,
//           email: userData.email || "",
//           address: userData.address || "",
//           phone: phoneRows.length > 0 ? phoneRows[0].number : "",
//           image: userData.image || null,
//           role: "staff",
//         };
//       } else if (role === "manager") {
//         // Get phone number from m_tel table
//         const [phoneRows] = await db.execute(
//           "SELECT number FROM m_tel WHERE manager_id = ? LIMIT 1",
//           [userId]
//         );

//         formattedUser = {
//           id: userData.manager_id,
//           name: `${userData.F_name} ${userData.L_name}`,
//           firstName: userData.F_name,
//           lastName: userData.L_name,
//           email: userData.email || "",
//           address: userData.address || "",
//           phone: phoneRows.length > 0 ? phoneRows[0].number : "",
//           image: userData.image || null,
//           role: "manager",
//         };
//       } else if (role === "supplier") {
//         // Get phone number from s_tel table
//         const [phoneRows] = await db.execute(
//           "SELECT number FROM s_tel WHERE sup_id = ? LIMIT 1",
//           [userId]
//         );

//         formattedUser = {
//           id: userData.sup_id,
//           name: `${userData.F_name} ${userData.L_name}`,
//           firstName: userData.F_name,
//           lastName: userData.L_name,
//           email: userData.email || "",
//           address: userData.address || "",
//           phone: phoneRows.length > 0 ? phoneRows[0].number : "",
//           image: userData.image || null,
//           type: userData.type || "",
//           role: "supplier",
//         };
//       }

//       return formattedUser;
//     } catch (error) {
//       console.error("Error in getUserProfile:", error);
//       throw error;
//     }
//   }

//   /**
//    * Update user profile
//    * @param {number} userId - User ID
//    * @param {string} role - User role
//    * @param {Object} userData - User data to update
//    * @returns {Promise<Object>} Result object
//    */
//   static async updateUserProfile(userId, role, userData) {
//     const connection = await db.getConnection();

//     try {
//       await connection.beginTransaction();

//       let table, idField, updateQuery, updateParams;

//       switch (role) {
//         case "customer":
//           table = "customer";
//           idField = "customer_id";

//           // Update customer table
//           updateQuery =
//             "UPDATE customer SET name = ?, address = ? WHERE customer_id = ?";
//           updateParams = [userData.name, userData.address, userId];

//           await connection.execute(updateQuery, updateParams);

//           // Update phone number if provided
//           if (userData.phone) {
//             // Check if phone number exists
//             const [existingPhone] = await connection.execute(
//               "SELECT number FROM cusnumber WHERE customer_id = ?",
//               [userId]
//             );

//             if (existingPhone.length > 0) {
//               // Update existing phone
//               await connection.execute(
//                 "UPDATE cusnumber SET number = ? WHERE customer_id = ?",
//                 [userData.phone, userId]
//               );
//             } else {
//               // Insert new phone
//               await connection.execute(
//                 "INSERT INTO cusnumber (customer_id, number) VALUES (?, ?)",
//                 [userId, userData.phone]
//               );
//             }
//           }
//           break;

//         case "staff":
//           table = "pharmacy_staff";
//           idField = "pharmacy_staff_id";

//           // Split name into first and last name
//           let staffFirstName =
//             userData.firstName || userData.name.split(" ")[0];
//           let staffLastName =
//             userData.lastName || userData.name.split(" ").slice(1).join(" ");

//           // Update staff table
//           updateQuery =
//             "UPDATE pharmacy_staff SET F_name = ?, L_name = ?, address = ? WHERE pharmacy_staff_id = ?";
//           updateParams = [
//             staffFirstName,
//             staffLastName,
//             userData.address,
//             userId,
//           ];

//           await connection.execute(updateQuery, updateParams);

//           // Update phone number if provided
//           if (userData.phone) {
//             // Check if phone number exists
//             const [existingPhone] = await connection.execute(
//               "SELECT number FROM pharmacy_staff_tel WHERE pharmacy_staff_id = ?",
//               [userId]
//             );

//             if (existingPhone.length > 0) {
//               // Update existing phone
//               await connection.execute(
//                 "UPDATE pharmacy_staff_tel SET number = ? WHERE pharmacy_staff_id = ?",
//                 [userData.phone, userId]
//               );
//             } else {
//               // Insert new phone
//               await connection.execute(
//                 "INSERT INTO pharmacy_staff_tel (pharmacy_staff_id, number) VALUES (?, ?)",
//                 [userId, userData.phone]
//               );
//             }
//           }
//           break;

//         case "manager":
//           table = "manager";
//           idField = "manager_id";

//           // Split name into first and last name
//           let managerFirstName =
//             userData.firstName || userData.name.split(" ")[0];
//           let managerLastName =
//             userData.lastName || userData.name.split(" ").slice(1).join(" ");

//           // Update manager table
//           updateQuery =
//             "UPDATE manager SET F_name = ?, L_name = ?, address = ? WHERE manager_id = ?";
//           updateParams = [
//             managerFirstName,
//             managerLastName,
//             userData.address,
//             userId,
//           ];

//           await connection.execute(updateQuery, updateParams);

//           // Update phone number if provided
//           if (userData.phone) {
//             // Check if phone number exists
//             const [existingPhone] = await connection.execute(
//               "SELECT number FROM m_tel WHERE manager_id = ?",
//               [userId]
//             );

//             if (existingPhone.length > 0) {
//               // Update existing phone
//               await connection.execute(
//                 "UPDATE m_tel SET number = ? WHERE manager_id = ?",
//                 [userData.phone, userId]
//               );
//             } else {
//               // Insert new phone
//               await connection.execute(
//                 "INSERT INTO m_tel (manager_id, number) VALUES (?, ?)",
//                 [userId, userData.phone]
//               );
//             }
//           }
//           break;

//         case "supplier":
//           table = "supplier";
//           idField = "sup_id";

//           // Split name into first and last name
//           let supplierFirstName =
//             userData.firstName || userData.name.split(" ")[0];
//           let supplierLastName =
//             userData.lastName || userData.name.split(" ").slice(1).join(" ");

//           // Update supplier table
//           updateQuery =
//             "UPDATE supplier SET F_name = ?, L_name = ?, address = ? WHERE sup_id = ?";
//           updateParams = [
//             supplierFirstName,
//             supplierLastName,
//             userData.address,
//             userId,
//           ];

//           await connection.execute(updateQuery, updateParams);

//           // Update phone number if provided
//           if (userData.phone) {
//             // Check if phone number exists
//             const [existingPhone] = await connection.execute(
//               "SELECT number FROM s_tel WHERE sup_id = ?",
//               [userId]
//             );

//             if (existingPhone.length > 0) {
//               // Update existing phone
//               await connection.execute(
//                 "UPDATE s_tel SET number = ? WHERE sup_id = ?",
//                 [userData.phone, userId]
//               );
//             } else {
//               // Insert new phone
//               await connection.execute(
//                 "INSERT INTO s_tel (sup_id, number) VALUES (?, ?)",
//                 [userId, userData.phone]
//               );
//             }
//           }
//           break;

//         default:
//           throw new Error("Invalid user role");
//       }

//       await connection.commit();

//       // Get updated user profile
//       const updatedUser = await this.getUserProfile(userId, role);

//       return {
//         success: true,
//         message: "Profile updated successfully",
//         user: updatedUser,
//       };
//     } catch (error) {
//       await connection.rollback();
//       console.error("Error in updateUserProfile:", error);
//       throw error;
//     } finally {
//       connection.release();
//     }
//   }

//   /**
//    * Change user password
//    * @param {number} userId - User ID
//    * @param {string} role - User role
//    * @param {string} currentPassword - Current password
//    * @param {string} newPassword - New password
//    * @returns {Promise<Object>} Result object
//    */
//   static async changePassword(userId, role, currentPassword, newPassword) {
//     try {
//       let table, idField;

//       // Determine which table to query based on role
//       switch (role) {
//         case "customer":
//           table = "customer";
//           idField = "customer_id";
//           break;
//         case "staff":
//           table = "pharmacy_staff";
//           idField = "pharmacy_staff_id";
//           break;
//         case "manager":
//           table = "manager";
//           idField = "manager_id";
//           break;
//         case "supplier":
//           table = "supplier";
//           idField = "sup_id";
//           break;
//         default:
//           throw new Error("Invalid user role");
//       }

//       // Get current password hash
//       const [userRows] = await db.execute(
//         `SELECT password FROM ${table} WHERE ${idField} = ?`,
//         [userId]
//       );

//       if (userRows.length === 0) {
//         return {
//           success: false,
//           message: "User not found",
//         };
//       }

//       // Verify current password
//       const isPasswordValid = await bcrypt.compare(
//         currentPassword,
//         userRows[0].password
//       );

//       if (!isPasswordValid) {
//         return {
//           success: false,
//           message: "Current password is incorrect",
//         };
//       }

//       // Hash new password
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//       // Update password
//       await db.execute(
//         `UPDATE ${table} SET password = ? WHERE ${idField} = ?`,
//         [hashedPassword, userId]
//       );

//       return {
//         success: true,
//         message: "Password changed successfully",
//       };
//     } catch (error) {
//       console.error("Error in changePassword:", error);
//       throw error;
//     }
//   }

//   /**
//    * Update user profile image
//    * @param {number} userId - User ID
//    * @param {string} role - User role
//    * @param {string} imageUrl - Image URL/path
//    * @returns {Promise<Object>} Result object
//    */
//   static async updateProfileImage(userId, role, imageUrl) {
//     try {
//       let table, idField;

//       // Determine which table to update based on role
//       switch (role) {
//         case "customer":
//           table = "customer";
//           idField = "customer_id";
//           break;
//         case "staff":
//           table = "pharmacy_staff";
//           idField = "pharmacy_staff_id";
//           break;
//         case "manager":
//           table = "manager";
//           idField = "manager_id";
//           break;
//         case "supplier":
//           table = "supplier";
//           idField = "sup_id";
//           break;
//         default:
//           throw new Error("Invalid user role");
//       }

//       // Update image
//       await db.execute(`UPDATE ${table} SET image = ? WHERE ${idField} = ?`, [
//         imageUrl,
//         userId,
//       ]);

//       return {
//         success: true,
//         message: "Profile image updated successfully",
//         imageUrl,
//       };
//     } catch (error) {
//       console.error("Error in updateProfileImage:", error);
//       throw error;
//     }
//   }
// }

// module.exports = UserModel;
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
        case "supplier":
          table = "supplier";
          idField = "sup_id";
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
      } else if (role === "supplier") {
        phoneNumberQuery = "SELECT number FROM s_tel WHERE sup_id = ?";
        phoneNumberField = "sup_id";
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
        { name: "supplier", idField: "sup_id" },
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
      case "supplier":
        return "supplier";
      default:
        throw new Error("Invalid user role");
    }
  }

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {string} role - User role
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Result object
   */
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
        case "supplier":
          table = "supplier";
          idField = "sup_id";
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
        // For manager, staff, and supplier, name is split into F_name and L_name
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
        } else if (role === "supplier") {
          phoneTable = "s_tel";
          phoneField = "sup_id";
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
        case "supplier":
          table = "supplier";
          idField = "sup_id";
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
        case "supplier":
          table = "supplier";
          idField = "sup_id";
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
