// // controllers/userController.js
// const UserModel = require("../Models/userModel");
// const bcrypt = require("bcrypt");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Configure storage for profile image uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = "uploads/profile-images";
//     // Create directory if it doesn't exist
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const userId = req.user.id;
//     const role = req.user.role;
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, `profile-${role}-${userId}-${uniqueSuffix}${ext}`);
//   },
// });

// // File filter to only accept image files
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPEG, JPG, and PNG image files are allowed"), false);
//   }
// };

// // Configure multer upload
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 2 * 1024 * 1024, // 2MB limit
//   },
//   fileFilter: fileFilter,
// });

// class UserController {
//   /**
//    * Get user profile
//    * @param {Request} req - Express request object
//    * @param {Response} res - Express response object
//    */
//   static async getUserProfile(req, res) {
//     try {
//       const userId = req.user.id;
//       const role = req.user.role;

//       const user = await UserModel.getUserProfile(userId, role);

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         user,
//       });
//     } catch (error) {
//       console.error("Error getting user profile:", error);
//       return res.status(500).json({
//         success: false,
//         message: "An error occurred while retrieving the user profile",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Update user profile
//    * @param {Request} req - Express request object
//    * @param {Response} res - Express response object
//    */
//   static async updateUserProfile(req, res) {
//     try {
//       const userId = req.user.id;
//       const role = req.user.role;
//       const userData = req.body;

//       // Basic validation
//       if (!userData.name) {
//         return res.status(400).json({
//           success: false,
//           message: "Name is required",
//         });
//       }

//       const result = await UserModel.updateUserProfile(userId, role, userData);

//       return res.status(200).json(result);
//     } catch (error) {
//       console.error("Error updating user profile:", error);
//       return res.status(500).json({
//         success: false,
//         message: "An error occurred while updating the user profile",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Change user password
//    * @param {Request} req - Express request object
//    * @param {Response} res - Express response object
//    */
//   static async changePassword(req, res) {
//     try {
//       const userId = req.user.id;
//       const role = req.user.role;
//       const { currentPassword, newPassword } = req.body;

//       // Validate input
//       if (!currentPassword || !newPassword) {
//         return res.status(400).json({
//           success: false,
//           message: "Current password and new password are required",
//         });
//       }

//       // Password complexity validation
//       if (newPassword.length < 8) {
//         return res.status(400).json({
//           success: false,
//           message: "New password must be at least 8 characters long",
//         });
//       }

//       const result = await UserModel.changePassword(
//         userId,
//         role,
//         currentPassword,
//         newPassword
//       );

//       if (!result.success) {
//         return res.status(400).json(result);
//       }

//       return res.status(200).json(result);
//     } catch (error) {
//       console.error("Error changing password:", error);
//       return res.status(500).json({
//         success: false,
//         message: "An error occurred while changing the password",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Update profile image - Middleware for handling file upload
//    */
//   static uploadProfileImage() {
//     return upload.single("image");
//   }

//   /**
//    * Update profile image - Process after upload
//    * @param {Request} req - Express request object
//    * @param {Response} res - Express response object
//    */
//   static async updateProfileImage(req, res) {
//     try {
//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           message: "No file uploaded",
//         });
//       }

//       const userId = req.user.id;
//       const role = req.user.role;

//       // Get the file path relative to the server
//       const imageUrl = `/${req.file.path.replace(/\\/g, "/")}`;

//       const result = await UserModel.updateProfileImage(userId, role, imageUrl);

//       return res.status(200).json({
//         success: true,
//         message: "Profile image updated successfully",
//         imageUrl,
//       });
//     } catch (error) {
//       console.error("Error updating profile image:", error);
//       return res.status(500).json({
//         success: false,
//         message: "An error occurred while updating the profile image",
//         error: error.message,
//       });
//     }
//   }
// }

// module.exports = UserController;

const UserModel = require("../Models/userModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create the directory if it doesn't exist
    const uploadDir = "uploads/profiles";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    // Only accept images
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
}).single("profileImage");

class UserController {
  /**
   * Get user profile
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Response} JSON response
   */
  static async getUserProfile(req, res) {
    try {
      // Extract user ID and role from authenticated user
      const userId = req.user.id;
      const role = req.user.role;

      // Get user profile from model
      const userProfile = await UserModel.getUserById(userId, role);

      if (!userProfile) {
        return res.status(404).json({
          success: false,
          message: "User profile not found",
        });
      }

      // Return user profile
      res.status(200).json({
        success: true,
        user: userProfile,
      });
    } catch (error) {
      console.error("Error in getUserProfile controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  /**
   * Update user profile
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Response} JSON response
   */
  static async updateUserProfile(req, res) {
    try {
      // Extract user ID and role from authenticated user
      const userId = req.user.id;
      const role = req.user.role;

      // Extract profile data from request body
      const { name, email, address, contactNumber } = req.body;

      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Name and email are required",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Check if email already exists (belonging to another user)
      const emailExists = await UserModel.isEmailExists(email, userId, role);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another account",
        });
      }

      // Update user profile
      const result = await UserModel.updateUserProfile(userId, role, {
        name,
        email,
        address,
        contactNumber,
      });

      // Return success response
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error in updateUserProfile controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  /**
   * Change user password
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Response} JSON response
   */
  static async changePassword(req, res) {
    try {
      // Extract user ID and role from authenticated user
      const userId = req.user.id;
      const role = req.user.role;

      // Extract password data from request body
      const { currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      // Validate password strength
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 8 characters long",
        });
      }

      // Change password
      const result = await UserModel.changePassword(
        userId,
        role,
        currentPassword,
        newPassword
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      // Return success response
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in changePassword controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  /**
   * Upload profile image
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Response} JSON response
   */
  static async uploadProfileImage(req, res) {
    // Handle file upload with multer
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A multer error occurred when uploading
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`,
        });
      } else if (err) {
        // An unknown error occurred
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      try {
        // Extract user ID and role from authenticated user
        const userId = req.user.id;
        const role = req.user.role;

        // Check if file was uploaded
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "No file uploaded",
          });
        }

        // Update profile image
        const result = await UserModel.updateProfileImage(
          userId,
          role,
          req.file
        );

        if (!result.success) {
          return res.status(400).json(result);
        }

        // Return success response with image URL
        res.status(200).json({
          success: true,
          message: "Profile image updated successfully",
          imageUrl: result.imageUrl,
        });
      } catch (error) {
        console.error("Error in uploadProfileImage controller:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
      }
    });
  }
}

module.exports = UserController;
