// // // controllers/prescription.controller.js
// // const PrescriptionModel = require("../../Models/staff/prescriptionModel");
// // const multer = require("multer");
// // const path = require("path");
// // const fs = require("fs");
// // const cloudinary = require("../../utils/cloudinaryConfig");

// // // Configure storage for uploads
// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     const uploadDir = "uploads/prescriptions";
// //     if (!fs.existsSync(uploadDir)) {
// //       fs.mkdirSync(uploadDir, { recursive: true });
// //     }
// //     cb(null, uploadDir);
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// //     cb(null, "prescription-" + uniqueSuffix + path.extname(file.originalname));
// //   },
// // });

// // // Configure upload middleware
// // const upload = multer({
// //   storage: storage,
// //   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
// //   fileFilter: function (req, file, cb) {
// //     // Accept only images and PDFs
// //     if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
// //       return cb(new Error("Only image or PDF files are allowed"), false);
// //     }
// //     cb(null, true);
// //   },
// // }).single("prescription");

// // class PrescriptionController {
// //   /**
// //    * Get all prescriptions for staff
// //    */
// //   // static async getAllPrescriptions(req, res) {
// //   //   try {
// //   //     const page = parseInt(req.query.page) || 1;
// //   //     const limit = parseInt(req.query.limit) || 10;
// //   //     const status = req.query.status;
// //   //     const customerId = req.query.customerId;

// //   //     const result = await PrescriptionModel.getAllPrescriptions({
// //   //       page,
// //   //       limit,
// //   //       status,
// //   //       customerId,
// //   //     });

// //   //     res.status(200).json({
// //   //       success: true,
// //   //       prescriptions: result.prescriptions,
// //   //       pagination: result.pagination,
// //   //     });
// //   //   } catch (error) {
// //   //     console.error("Error fetching prescriptions:", error);
// //   //     res.status(500).json({
// //   //       success: false,
// //   //       message: "Failed to fetch prescriptions",
// //   //       error: error.message,
// //   //     });
// //   //   }
// //   // }

// //   // static async getAllPrescriptions(req, res) {
// //   //   try {
// //   //     console.log("Controller method called");

// //   //     // Explicitly create the options object
// //   //     const options = {
// //   //       page: parseInt(req.query.page) || 1,
// //   //       limit: parseInt(req.query.limit) || 10,
// //   //       status: req.query.status || null,
// //   //       customerId: req.query.customerId || null,
// //   //     };

// //   //     console.log("Options:", options);

// //   //     const result = await PrescriptionModel.getAllPrescriptions(options);

// //   //     res.status(200).json({
// //   //       success: true,
// //   //       prescriptions: result.prescriptions,
// //   //       pagination: result.pagination,
// //   //     });
// //   //   } catch (error) {
// //   //     console.error("Error in getAllPrescriptions:", error);
// //   //     res.status(500).json({
// //   //       success: false,
// //   //       message: "Failed to fetch prescriptions",
// //   //       error: error.message,
// //   //     });
// //   //   }
// //   // }

// //   ///////////////////////////////corrected code//////////////////////////////////////

// //   static async getAllPrescriptions(req, res) {
// //     try {
// //       const options = {
// //         page: parseInt(req.query.page) || 1,
// //         limit: parseInt(req.query.limit) || 10,
// //         status: req.query.status || null,
// //         customerId: req.query.customerId || null,
// //       };

// //       const result = await PrescriptionModel.getAllPrescriptions(options);

// //       // Log some sample data to verify address/telephone
// //       if (result.prescriptions.length > 0) {
// //         console.log("Sample prescription data:", {
// //           id: result.prescriptions[0].prescription_id,
// //           address: result.prescriptions[0].address,
// //           telephone: result.prescriptions[0].telephone,
// //         });
// //       }

// //       res.status(200).json({
// //         success: true,
// //         prescriptions: result.prescriptions,
// //         pagination: result.pagination,
// //       });
// //     } catch (error) {
// //       console.error("Error in getAllPrescriptions:", error);
// //       res.status(500).json({
// //         success: false,
// //         message: "Failed to fetch prescriptions",
// //         error: error.message,
// //       });
// //     }
// //   }
// //   /**
// //    * Get prescription by ID
// //    */
// //   static async getPrescriptionById(req, res) {
// //     try {
// //       const prescriptionId = req.params.id;
// //       const prescription = await PrescriptionModel.getPrescriptionById(
// //         prescriptionId
// //       );

// //       if (!prescription) {
// //         return res.status(404).json({
// //           success: false,
// //           message: "Prescription not found",
// //         });
// //       }

// //       res.status(200).json({
// //         success: true,
// //         prescription,
// //       });
// //     } catch (error) {
// //       console.error("Error fetching prescription details:", error);
// //       res.status(500).json({
// //         success: false,
// //         message: "Failed to fetch prescription details",
// //         error: error.message,
// //       });
// //     }
// //   }

// //   /**
// //    * Update prescription status
// //    */
// //   static async updatePrescriptionStatus(req, res) {
// //     try {
// //       const prescriptionId = req.params.id;
// //       const { status } = req.body;

// //       if (!status) {
// //         return res.status(400).json({
// //           success: false,
// //           message: "Status is required",
// //         });
// //       }

// //       if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
// //         return res.status(400).json({
// //           success: false,
// //           message: "Invalid prescription ID",
// //         });
// //       }

// //       if (!status || typeof status !== "string") {
// //         return res.status(400).json({
// //           success: false,
// //           message: "Invalid status",
// //         });
// //       }

// //       // Validate status
// //       const validStatuses = [
// //         "Pending",
// //         "Confirmed",
// //         "Available",
// //         "Not available",
// //         "Delayed",
// //         "Out for delivery",
// //         "Ready for pickup",
// //         "Completed",
// //         "Expired",
// //       ];

// //       if (!validStatuses.includes(status)) {
// //         return res.status(400).json({
// //           success: false,
// //           message:
// //             "Invalid status. Status must be one of: " +
// //             validStatuses.join(", "),
// //         });
// //       }

// //       // Get staff ID from authenticated user
// //       const staffId =
// //         req.user && req.user.role === "staff" ? req.user.id : null;

// //       const result = await PrescriptionModel.updatePrescriptionStatus(
// //         prescriptionId,
// //         status,
// //         staffId
// //       );

// //       if (!result.success) {
// //         return res.status(404).json({
// //           success: false,
// //           message: result.message,
// //         });
// //       }

// //       res.status(200).json({
// //         success: true,
// //         message: result.message,
// //         updatedStatus: status,
// //         previousStatus: result.oldStatus,
// //       });
// //     } catch (error) {
// //       console.error("Error updating prescription status:", error);
// //       res.status(500).json({
// //         success: false,
// //         message: "Failed to update prescription status",
// //         error: error.message,
// //       });
// //     }
// //   }

// //   /**
// //    * Upload a prescription
// //    */
// //   static async uploadPrescription(req, res) {
// //     upload(req, res, async function (err) {
// //       if (err instanceof multer.MulterError) {
// //         return res.status(400).json({
// //           success: false,
// //           message: `File upload error: ${err.message}`,
// //         });
// //       } else if (err) {
// //         return res.status(400).json({
// //           success: false,
// //           message: err.message,
// //         });
// //       }

// //       try {
// //         // Extract data from request
// //         const { deliveryMethod = "Order Pickup", note = null } = req.body;

// //         // Get customer ID from authenticated user
// //         const customerId = req.user.id;

// //         if (!customerId) {
// //           return res.status(401).json({
// //             success: false,
// //             message: "Customer ID is required",
// //           });
// //         }

// //         if (!req.file) {
// //           return res.status(400).json({
// //             success: false,
// //             message: "Prescription file is required",
// //           });
// //         }

// //         // Upload file to cloud storage (if you're using Cloudinary)
// //         let filePath;
// //         try {
// //           const result = await cloudinary.uploader.upload(req.file.path, {
// //             folder: "prescriptions",
// //             resource_type: "auto",
// //           });
// //           filePath = result.secure_url;

// //           // Clean up local file after upload
// //           fs.unlinkSync(req.file.path);
// //         } catch (uploadError) {
// //           console.error("Error uploading to Cloudinary:", uploadError);

// //           // If cloud upload fails, use local path as fallback
// //           filePath = `/${req.file.path.replace(/\\/g, "/")}`;
// //         }

// //         // Set expiry date to 48 hours from now
// //         const expiryDate = new Date();
// //         expiryDate.setHours(expiryDate.getHours() + 48);

// //         // Save prescription to database
// //         const result = await PrescriptionModel.uploadPrescription({
// //           customerId,
// //           deliveryMethod,
// //           filePath,
// //           note,
// //           expiryDate,
// //         });

// //         res.status(200).json({
// //           success: true,
// //           message: "Prescription uploaded successfully",
// //           prescriptionId: result.prescriptionId,
// //           expiryDate: expiryDate.toISOString(),
// //         });
// //       } catch (error) {
// //         console.error("Error uploading prescription:", error);
// //         res.status(500).json({
// //           success: false,
// //           message: "Failed to upload prescription",
// //           error: error.message,
// //         });
// //       }
// //     });
// //   }

// //   /**
// //    * Delete a prescription
// //    */
// //   static async deletePrescription(req, res) {
// //     try {
// //       const prescriptionId = req.params.id;
// //       const result = await PrescriptionModel.deletePrescription(prescriptionId);

// //       if (!result.success) {
// //         return res.status(400).json(result);
// //       }

// //       res.status(200).json(result);
// //     } catch (error) {
// //       console.error("Error deleting prescription:", error);
// //       res.status(500).json({
// //         success: false,
// //         message: "Failed to delete prescription",
// //         error: error.message,
// //       });
// //     }
// //   }

// //   /**
// //    * Get customer's prescriptions
// //    */
// //   static async getMyPrescriptions(req, res) {
// //     try {
// //       const customerId = req.user.id;
// //       const prescriptions = await PrescriptionModel.getPrescriptionsByCustomer(
// //         customerId
// //       );

// //       res.status(200).json({
// //         success: true,
// //         prescriptions,
// //       });
// //     } catch (error) {
// //       console.error("Error fetching customer prescriptions:", error);
// //       res.status(500).json({
// //         success: false,
// //         message: "Failed to fetch your prescriptions",
// //         error: error.message,
// //       });
// //     }
// //   }

// //   /**
// //    * Check for expired prescriptions (can be called by a cron job)
// //    */
// //   static async checkExpiredPrescriptions(req, res) {
// //     try {
// //       const result = await PrescriptionModel.checkExpiredPrescriptions();

// //       res.status(200).json({
// //         success: true,
// //         expiredCount: result.count,
// //         message: `${result.count} prescriptions marked as expired`,
// //       });
// //     } catch (error) {
// //       console.error("Error checking expired prescriptions:", error);
// //       res.status(500).json({
// //         success: false,
// //         message: "Failed to check expired prescriptions",
// //         error: error.message,
// //       });
// //     }
// //   }
// // }

// // module.exports = PrescriptionController;

// ///////////////////correct one///////////////////////////

// // controllers/prescription.controller.js
// const PrescriptionModel = require("../../Models/staff/prescriptionModel");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const cloudinary = require("../../utils/cloudinaryConfig");

// // Configure storage for uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = "uploads/prescriptions";
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, "prescription-" + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// // Configure upload middleware
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
//   fileFilter: function (req, file, cb) {
//     // Accept only images and PDFs
//     if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
//       return cb(new Error("Only image or PDF files are allowed"), false);
//     }
//     cb(null, true);
//   },
// }).single("prescription");

// class PrescriptionController {
//   /**
//    * Get all prescriptions for staff
//    */
//   // static async getAllPrescriptions(req, res) {
//   //   try {
//   //     const page = parseInt(req.query.page) || 1;
//   //     const limit = parseInt(req.query.limit) || 10;
//   //     const status = req.query.status;
//   //     const customerId = req.query.customerId;

//   //     const result = await PrescriptionModel.getAllPrescriptions({
//   //       page,
//   //       limit,
//   //       status,
//   //       customerId,
//   //     });

//   //     res.status(200).json({
//   //       success: true,
//   //       prescriptions: result.prescriptions,
//   //       pagination: result.pagination,
//   //     });
//   //   } catch (error) {
//   //     console.error("Error fetching prescriptions:", error);
//   //     res.status(500).json({
//   //       success: false,
//   //       message: "Failed to fetch prescriptions",
//   //       error: error.message,
//   //     });
//   //   }
//   // }

//   // static async getAllPrescriptions(req, res) {
//   //   try {
//   //     console.log("Controller method called");

//   //     // Explicitly create the options object
//   //     const options = {
//   //       page: parseInt(req.query.page) || 1,
//   //       limit: parseInt(req.query.limit) || 10,
//   //       status: req.query.status || null,
//   //       customerId: req.query.customerId || null,
//   //     };

//   //     console.log("Options:", options);

//   //     const result = await PrescriptionModel.getAllPrescriptions(options);

//   //     res.status(200).json({
//   //       success: true,
//   //       prescriptions: result.prescriptions,
//   //       pagination: result.pagination,
//   //     });
//   //   } catch (error) {
//   //     console.error("Error in getAllPrescriptions:", error);
//   //     res.status(500).json({
//   //       success: false,
//   //       message: "Failed to fetch prescriptions",
//   //       error: error.message,
//   //     });
//   //   }
//   // }

//   ///////////////////////////////corrected code//////////////////////////////////////

//   static async getAllPrescriptions(req, res) {
//     try {
//       const options = {
//         page: parseInt(req.query.page) || 1,
//         limit: parseInt(req.query.limit) || 10,
//         status: req.query.status || null,
//         customerId: req.query.customerId || null,
//       };

//       const result = await PrescriptionModel.getAllPrescriptions(options);

//       // Log some sample data to verify address/telephone
//       if (result.prescriptions.length > 0) {
//         console.log("Sample prescription data:", {
//           id: result.prescriptions[0].prescription_id,
//           address: result.prescriptions[0].address,
//           telephone: result.prescriptions[0].telephone,
//         });
//       }

//       res.status(200).json({
//         success: true,
//         prescriptions: result.prescriptions,
//         pagination: result.pagination,
//       });
//     } catch (error) {
//       console.error("Error in getAllPrescriptions:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch prescriptions",
//         error: error.message,
//       });
//     }
//   }
//   /**
//    * Get prescription by ID
//    */
//   static async getPrescriptionById(req, res) {
//     try {
//       const prescriptionId = req.params.id;
//       const prescription = await PrescriptionModel.getPrescriptionById(
//         prescriptionId
//       );

//       if (!prescription) {
//         return res.status(404).json({
//           success: false,
//           message: "Prescription not found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         prescription,
//       });
//     } catch (error) {
//       console.error("Error fetching prescription details:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch prescription details",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Update prescription status
//    */
//   static async updatePrescriptionStatus(req, res) {
//     try {
//       const prescriptionId = req.params.id;
//       const { status } = req.body;

//       if (!status) {
//         return res.status(400).json({
//           success: false,
//           message: "Status is required",
//         });
//       }

//       if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid prescription ID",
//         });
//       }

//       if (!status || typeof status !== "string") {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid status",
//         });
//       }

//       // Validate status
//       const validStatuses = [
//         "Pending",
//         "Confirmed",
//         "Available",
//         "Not available",
//         "Delayed",
//         "Out for delivery",
//         "Ready for pickup",
//         "Completed",
//         "Expired",
//       ];

//       if (!validStatuses.includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Invalid status. Status must be one of: " +
//             validStatuses.join(", "),
//         });
//       }

//       // Get staff ID from authenticated user
//       const staffId =
//         req.user && req.user.role === "staff" ? req.user.id : null;

//       const result = await PrescriptionModel.updatePrescriptionStatus(
//         prescriptionId,
//         status,
//         staffId
//       );

//       if (!result.success) {
//         return res.status(404).json({
//           success: false,
//           message: result.message,
//         });
//       }

//       res.status(200).json({
//         success: true,
//         message: result.message,
//         updatedStatus: status,
//         previousStatus: result.oldStatus,
//       });
//     } catch (error) {
//       console.error("Error updating prescription status:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to update prescription status",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Upload a prescription
//    */
//   // static async uploadPrescription(req, res) {
//   //   upload(req, res, async function (err) {
//   //     if (err instanceof multer.MulterError) {
//   //       return res.status(400).json({
//   //         success: false,
//   //         message: `File upload error: ${err.message}`,
//   //       });
//   //     } else if (err) {
//   //       return res.status(400).json({
//   //         success: false,
//   //         message: err.message,
//   //       });
//   //     }

//   //     try {
//   //       // Extract data from request
//   //       const { deliveryMethod = "Order Pickup", note = null } = req.body;

//   //       // Get customer ID from authenticated user
//   //       const customerId = req.user.id;

//   //       if (!customerId) {
//   //         return res.status(401).json({
//   //           success: false,
//   //           message: "Customer ID is required",
//   //         });
//   //       }

//   //       if (!req.file) {
//   //         return res.status(400).json({
//   //           success: false,
//   //           message: "Prescription file is required",
//   //         });
//   //       }

//   //       // Upload file to cloud storage (if you're using Cloudinary)
//   //       let filePath;
//   //       try {
//   //         const result = await cloudinary.uploader.upload(req.file.path, {
//   //           folder: "prescriptions",
//   //           resource_type: "auto",
//   //         });
//   //         filePath = result.secure_url;

//   //         // Clean up local file after upload
//   //         fs.unlinkSync(req.file.path);
//   //       } catch (uploadError) {
//   //         console.error("Error uploading to Cloudinary:", uploadError);

//   //         // If cloud upload fails, use local path as fallback
//   //         filePath = `/${req.file.path.replace(/\\/g, "/")}`;
//   //       }

//   //       // Set expiry date to 48 hours from now
//   //       const expiryDate = new Date();
//   //       expiryDate.setHours(expiryDate.getHours() + 48);

//   //       // Save prescription to database
//   //       const result = await PrescriptionModel.uploadPrescription({
//   //         customerId,
//   //         deliveryMethod,
//   //         filePath,
//   //         note,
//   //         expiryDate,
//   //       });

//   //       res.status(200).json({
//   //         success: true,
//   //         message: "Prescription uploaded successfully",
//   //         prescriptionId: result.prescriptionId,
//   //         expiryDate: expiryDate.toISOString(),
//   //       });
//   //     } catch (error) {
//   //       console.error("Error uploading prescription:", error);
//   //       res.status(500).json({
//   //         success: false,
//   //         message: "Failed to upload prescription",
//   //         error: error.message,
//   //       });
//   //     }
//   //   });
//   // }

//   /**
//    * Delete a prescription
//    */
//   static async deletePrescription(req, res) {
//     try {
//       const prescriptionId = req.params.id;
//       const result = await PrescriptionModel.deletePrescription(prescriptionId);

//       if (!result.success) {
//         return res.status(400).json(result);
//       }

//       res.status(200).json(result);
//     } catch (error) {
//       console.error("Error deleting prescription:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to delete prescription",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get customer's prescriptions
//    */
//   // static async getMyPrescriptions(req, res) {
//   //   try {
//   //     const customerId = req.user.id;
//   //     const prescriptions = await PrescriptionModel.getPrescriptionsByCustomer(
//   //       customerId
//   //     );

//   //     res.status(200).json({
//   //       success: true,
//   //       prescriptions,
//   //     });
//   //   } catch (error) {
//   //     console.error("Error fetching customer prescriptions:", error);
//   //     res.status(500).json({
//   //       success: false,
//   //       message: "Failed to fetch your prescriptions",
//   //       error: error.message,
//   //     });
//   //   }
//   // }

//   /**
//    * Check for expired prescriptions (can be called by a cron job)
//    */
//   // static async checkExpiredPrescriptions(req, res) {
//   //   try {
//   //     const result = await PrescriptionModel.checkExpiredPrescriptions();

//   //     res.status(200).json({
//   //       success: true,
//   //       expiredCount: result.count,
//   //       message: `${result.count} prescriptions marked as expired`,
//   //     });
//   //   } catch (error) {
//   //     console.error("Error checking expired prescriptions:", error);
//   //     res.status(500).json({
//   //       success: false,
//   //       message: "Failed to check expired prescriptions",
//   //       error: error.message,
//   //     });
//   //   }
//   // }
// }

// module.exports = PrescriptionController;

///////////////////////////////////working fine////////////////////////

// // controllers/prescription.controller.js
// const PrescriptionModel = require("../../Models/staff/prescriptionModel");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const cloudinary = require("../../utils/cloudinaryConfig");

// // Configure storage for uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = "uploads/prescriptions";
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, "prescription-" + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// // Configure upload middleware
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
//   fileFilter: function (req, file, cb) {
//     // Accept only images and PDFs
//     if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
//       return cb(new Error("Only image or PDF files are allowed"), false);
//     }
//     cb(null, true);
//   },
// }).single("prescription");

// class PrescriptionController {
//   /**
//    * Get all prescriptions for staff
//    */
//   // static async getAllPrescriptions(req, res) {
//   //   try {
//   //     const page = parseInt(req.query.page) || 1;
//   //     const limit = parseInt(req.query.limit) || 10;
//   //     const status = req.query.status;
//   //     const customerId = req.query.customerId;

//   //     const result = await PrescriptionModel.getAllPrescriptions({
//   //       page,
//   //       limit,
//   //       status,
//   //       customerId,
//   //     });

//   //     res.status(200).json({
//   //       success: true,
//   //       prescriptions: result.prescriptions,
//   //       pagination: result.pagination,
//   //     });
//   //   } catch (error) {
//   //     console.error("Error fetching prescriptions:", error);
//   //     res.status(500).json({
//   //       success: false,
//   //       message: "Failed to fetch prescriptions",
//   //       error: error.message,
//   //     });
//   //   }
//   // }

//   // static async getAllPrescriptions(req, res) {
//   //   try {
//   //     console.log("Controller method called");

//   //     // Explicitly create the options object
//   //     const options = {
//   //       page: parseInt(req.query.page) || 1,
//   //       limit: parseInt(req.query.limit) || 10,
//   //       status: req.query.status || null,
//   //       customerId: req.query.customerId || null,
//   //     };

//   //     console.log("Options:", options);

//   //     const result = await PrescriptionModel.getAllPrescriptions(options);

//   //     res.status(200).json({
//   //       success: true,
//   //       prescriptions: result.prescriptions,
//   //       pagination: result.pagination,
//   //     });
//   //   } catch (error) {
//   //     console.error("Error in getAllPrescriptions:", error);
//   //     res.status(500).json({
//   //       success: false,
//   //       message: "Failed to fetch prescriptions",
//   //       error: error.message,
//   //     });
//   //   }
//   // }

//   ///////////////////////////////corrected code//////////////////////////////////////

//   static async getAllPrescriptions(req, res) {
//     try {
//       const options = {
//         page: parseInt(req.query.page) || 1,
//         limit: parseInt(req.query.limit) || 10,
//         status: req.query.status || null,
//         customerId: req.query.customerId || null,
//       };

//       const result = await PrescriptionModel.getAllPrescriptions(options);

//       // Log some sample data to verify address/telephone
//       if (result.prescriptions.length > 0) {
//         console.log("Sample prescription data:", {
//           id: result.prescriptions[0].prescription_id,
//           address: result.prescriptions[0].address,
//           telephone: result.prescriptions[0].telephone,
//         });
//       }

//       res.status(200).json({
//         success: true,
//         prescriptions: result.prescriptions,
//         pagination: result.pagination,
//       });
//     } catch (error) {
//       console.error("Error in getAllPrescriptions:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch prescriptions",
//         error: error.message,
//       });
//     }
//   }
//   /**
//    * Get prescription by ID
//    */
//   static async getPrescriptionById(req, res) {
//     try {
//       const prescriptionId = req.params.id;
//       const prescription = await PrescriptionModel.getPrescriptionById(
//         prescriptionId
//       );

//       if (!prescription) {
//         return res.status(404).json({
//           success: false,
//           message: "Prescription not found",
//         });
//       }

//       res.status(200).json({
//         success: true,
//         prescription,
//       });
//     } catch (error) {
//       console.error("Error fetching prescription details:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch prescription details",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Update prescription status
//    */
//   static async updatePrescriptionStatus(req, res) {
//     try {
//       const prescriptionId = req.params.id;
//       const { status } = req.body;

//       if (!status) {
//         return res.status(400).json({
//           success: false,
//           message: "Status is required",
//         });
//       }

//       if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid prescription ID",
//         });
//       }

//       if (!status || typeof status !== "string") {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid status",
//         });
//       }

//       // Validate status
//       const validStatuses = [
//         "Pending",
//         "Confirmed",
//         "Available",
//         "Not available",
//         "Delayed",
//         "Out for delivery",
//         "Ready for pickup",
//         "Completed",
//         "Expired",
//       ];

//       if (!validStatuses.includes(status)) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Invalid status. Status must be one of: " +
//             validStatuses.join(", "),
//         });
//       }

//       // Get staff ID from authenticated user
//       const staffId =
//         req.user && req.user.role === "staff" ? req.user.id : null;

//       const result = await PrescriptionModel.updatePrescriptionStatus(
//         prescriptionId,
//         status,
//         staffId
//       );

//       if (!result.success) {
//         return res.status(404).json({
//           success: false,
//           message: result.message,
//         });
//       }

//       res.status(200).json({
//         success: true,
//         message: result.message,
//         updatedStatus: status,
//         previousStatus: result.oldStatus,
//       });
//     } catch (error) {
//       console.error("Error updating prescription status:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to update prescription status",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Upload a prescription
//    */
//   static async uploadPrescription(req, res) {
//     upload(req, res, async function (err) {
//       if (err instanceof multer.MulterError) {
//         return res.status(400).json({
//           success: false,
//           message: `File upload error: ${err.message}`,
//         });
//       } else if (err) {
//         return res.status(400).json({
//           success: false,
//           message: err.message,
//         });
//       }

//       try {
//         // Extract data from request
//         const { deliveryMethod = "Order Pickup", note = null } = req.body;

//         // Get customer ID from authenticated user
//         const customerId = req.user.id;

//         if (!customerId) {
//           return res.status(401).json({
//             success: false,
//             message: "Customer ID is required",
//           });
//         }

//         if (!req.file) {
//           return res.status(400).json({
//             success: false,
//             message: "Prescription file is required",
//           });
//         }

//         // Upload file to cloud storage (if you're using Cloudinary)
//         let filePath;
//         try {
//           const result = await cloudinary.uploader.upload(req.file.path, {
//             folder: "prescriptions",
//             resource_type: "auto",
//           });
//           filePath = result.secure_url;

//           // Clean up local file after upload
//           fs.unlinkSync(req.file.path);
//         } catch (uploadError) {
//           console.error("Error uploading to Cloudinary:", uploadError);

//           // If cloud upload fails, use local path as fallback
//           filePath = `/${req.file.path.replace(/\\/g, "/")}`;
//         }

//         // Set expiry date to 48 hours from now
//         const expiryDate = new Date();
//         expiryDate.setHours(expiryDate.getHours() + 48);

//         // Save prescription to database
//         const result = await PrescriptionModel.uploadPrescription({
//           customerId,
//           deliveryMethod,
//           filePath,
//           note,
//           expiryDate,
//         });

//         res.status(200).json({
//           success: true,
//           message: "Prescription uploaded successfully",
//           prescriptionId: result.prescriptionId,
//           expiryDate: expiryDate.toISOString(),
//         });
//       } catch (error) {
//         console.error("Error uploading prescription:", error);
//         res.status(500).json({
//           success: false,
//           message: "Failed to upload prescription",
//           error: error.message,
//         });
//       }
//     });
//   }

//   /**
//    * Delete a prescription
//    */
//   static async deletePrescription(req, res) {
//     try {
//       const prescriptionId = req.params.id;
//       const result = await PrescriptionModel.deletePrescription(prescriptionId);

//       if (!result.success) {
//         return res.status(400).json(result);
//       }

//       res.status(200).json(result);
//     } catch (error) {
//       console.error("Error deleting prescription:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to delete prescription",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Get customer's prescriptions
//    */
//   static async getMyPrescriptions(req, res) {
//     try {
//       const customerId = req.user.id;
//       const prescriptions = await PrescriptionModel.getPrescriptionsByCustomer(
//         customerId
//       );

//       res.status(200).json({
//         success: true,
//         prescriptions,
//       });
//     } catch (error) {
//       console.error("Error fetching customer prescriptions:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to fetch your prescriptions",
//         error: error.message,
//       });
//     }
//   }

//   /**
//    * Check for expired prescriptions (can be called by a cron job)
//    */
//   static async checkExpiredPrescriptions(req, res) {
//     try {
//       const result = await PrescriptionModel.checkExpiredPrescriptions();

//       res.status(200).json({
//         success: true,
//         expiredCount: result.count,
//         message: `${result.count} prescriptions marked as expired`,
//       });
//     } catch (error) {
//       console.error("Error checking expired prescriptions:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to check expired prescriptions",
//         error: error.message,
//       });
//     }
//   }
// }

// module.exports = PrescriptionController;

///////////////////correct one///////////////////////////

// controllers/prescription.controller.js
const PrescriptionModel = require("../../Models/staff/prescriptionModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../../utils/cloudinaryConfig");

// Configure storage for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/prescriptions";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "prescription-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Configure upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: function (req, file, cb) {
    // Accept only images and PDFs
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(new Error("Only image or PDF files are allowed"), false);
    }
    cb(null, true);
  },
}).single("prescription");

class PrescriptionController {
  /**
   * Get all prescriptions for staff
   */
  // static async getAllPrescriptions(req, res) {
  //   try {
  //     const page = parseInt(req.query.page) || 1;
  //     const limit = parseInt(req.query.limit) || 10;
  //     const status = req.query.status;
  //     const customerId = req.query.customerId;

  //     const result = await PrescriptionModel.getAllPrescriptions({
  //       page,
  //       limit,
  //       status,
  //       customerId,
  //     });

  //     res.status(200).json({
  //       success: true,
  //       prescriptions: result.prescriptions,
  //       pagination: result.pagination,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching prescriptions:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to fetch prescriptions",
  //       error: error.message,
  //     });
  //   }
  // }

  // static async getAllPrescriptions(req, res) {
  //   try {
  //     console.log("Controller method called");

  //     // Explicitly create the options object
  //     const options = {
  //       page: parseInt(req.query.page) || 1,
  //       limit: parseInt(req.query.limit) || 10,
  //       status: req.query.status || null,
  //       customerId: req.query.customerId || null,
  //     };

  //     console.log("Options:", options);

  //     const result = await PrescriptionModel.getAllPrescriptions(options);

  //     res.status(200).json({
  //       success: true,
  //       prescriptions: result.prescriptions,
  //       pagination: result.pagination,
  //     });
  //   } catch (error) {
  //     console.error("Error in getAllPrescriptions:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to fetch prescriptions",
  //       error: error.message,
  //     });
  //   }
  // }

  ///////////////////////////////corrected code//////////////////////////////////////

  static async getAllPrescriptions(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        status: req.query.status || null,
        customerId: req.query.customerId || null,
      };

      const result = await PrescriptionModel.getAllPrescriptions(options);

      // Log some sample data to verify address/telephone
      if (result.prescriptions.length > 0) {
        console.log("Sample prescription data:", {
          id: result.prescriptions[0].prescription_id,
          address: result.prescriptions[0].address,
          telephone: result.prescriptions[0].telephone,
        });
      }

      res.status(200).json({
        success: true,
        prescriptions: result.prescriptions,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error in getAllPrescriptions:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch prescriptions",
        error: error.message,
      });
    }
  }
  /**
   * Get prescription by ID
   */
  static async getPrescriptionById(req, res) {
    try {
      const prescriptionId = req.params.id;
      const prescription = await PrescriptionModel.getPrescriptionById(
        prescriptionId
      );

      if (!prescription) {
        return res.status(404).json({
          success: false,
          message: "Prescription not found",
        });
      }

      res.status(200).json({
        success: true,
        prescription,
      });
    } catch (error) {
      console.error("Error fetching prescription details:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch prescription details",
        error: error.message,
      });
    }
  }

  /**
   * Update prescription status
   */
  static async updatePrescriptionStatus(req, res) {
    try {
      const prescriptionId = req.params.id;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      if (!prescriptionId || isNaN(parseInt(prescriptionId))) {
        return res.status(400).json({
          success: false,
          message: "Invalid prescription ID",
        });
      }

      if (!status || typeof status !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      // Validate status
      const validStatuses = [
        "Pending",
        "Confirmed",
        "Available",
        "Not available",
        "Delayed",
        "Out for delivery",
        "Ready for pickup",
        "Completed",
        "Expired",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Status must be one of: " +
            validStatuses.join(", "),
        });
      }

      // Get staff ID from authenticated user
      const staffId =
        req.user && req.user.role === "staff" ? req.user.id : null;

      const result = await PrescriptionModel.updatePrescriptionStatus(
        prescriptionId,
        status,
        staffId
      );

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        updatedStatus: status,
        previousStatus: result.oldStatus,
      });
    } catch (error) {
      console.error("Error updating prescription status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update prescription status",
        error: error.message,
      });
    }
  }

  /**
   * Upload a prescription
   */
  // static async uploadPrescription(req, res) {
  //   upload(req, res, async function (err) {
  //     if (err instanceof multer.MulterError) {
  //       return res.status(400).json({
  //         success: false,
  //         message: `File upload error: ${err.message}`,
  //       });
  //     } else if (err) {
  //       return res.status(400).json({
  //         success: false,
  //         message: err.message,
  //       });
  //     }

  //     try {
  //       // Extract data from request
  //       const { deliveryMethod = "Order Pickup", note = null } = req.body;

  //       // Get customer ID from authenticated user
  //       const customerId = req.user.id;

  //       if (!customerId) {
  //         return res.status(401).json({
  //           success: false,
  //           message: "Customer ID is required",
  //         });
  //       }

  //       if (!req.file) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Prescription file is required",
  //         });
  //       }

  //       // Upload file to cloud storage (if you're using Cloudinary)
  //       let filePath;
  //       try {
  //         const result = await cloudinary.uploader.upload(req.file.path, {
  //           folder: "prescriptions",
  //           resource_type: "auto",
  //         });
  //         filePath = result.secure_url;

  //         // Clean up local file after upload
  //         fs.unlinkSync(req.file.path);
  //       } catch (uploadError) {
  //         console.error("Error uploading to Cloudinary:", uploadError);

  //         // If cloud upload fails, use local path as fallback
  //         filePath = `/${req.file.path.replace(/\\/g, "/")}`;
  //       }

  //       // Set expiry date to 48 hours from now
  //       const expiryDate = new Date();
  //       expiryDate.setHours(expiryDate.getHours() + 48);

  //       // Save prescription to database
  //       const result = await PrescriptionModel.uploadPrescription({
  //         customerId,
  //         deliveryMethod,
  //         filePath,
  //         note,
  //         expiryDate,
  //       });

  //       res.status(200).json({
  //         success: true,
  //         message: "Prescription uploaded successfully",
  //         prescriptionId: result.prescriptionId,
  //         expiryDate: expiryDate.toISOString(),
  //       });
  //     } catch (error) {
  //       console.error("Error uploading prescription:", error);
  //       res.status(500).json({
  //         success: false,
  //         message: "Failed to upload prescription",
  //         error: error.message,
  //       });
  //     }
  //   });
  // }

  /**
   * Delete a prescription
   */
  static async deletePrescription(req, res) {
    try {
      const prescriptionId = req.params.id;
      const result = await PrescriptionModel.deletePrescription(prescriptionId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting prescription:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete prescription",
        error: error.message,
      });
    }
  }

  /**
   * Get customer's prescriptions
   */
  // static async getMyPrescriptions(req, res) {
  //   try {
  //     const customerId = req.user.id;
  //     const prescriptions = await PrescriptionModel.getPrescriptionsByCustomer(
  //       customerId
  //     );

  //     res.status(200).json({
  //       success: true,
  //       prescriptions,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching customer prescriptions:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to fetch your prescriptions",
  //       error: error.message,
  //     });
  //   }
  // }

  /**
   * Check for expired prescriptions (can be called by a cron job)
   */
  // static async checkExpiredPrescriptions(req, res) {
  //   try {
  //     const result = await PrescriptionModel.checkExpiredPrescriptions();

  //     res.status(200).json({
  //       success: true,
  //       expiredCount: result.count,
  //       message: `${result.count} prescriptions marked as expired`,
  //     });
  //   } catch (error) {
  //     console.error("Error checking expired prescriptions:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Failed to check expired prescriptions",
  //       error: error.message,
  //     });
  //   }
  // }

  // In PrescriptionController.js
  static async completePrescription(req, res) {
    try {
      const prescriptionId = req.params.id;
      const staffId = req.user.id;

      const result = await PrescriptionModel.completePrescription(
        prescriptionId,
        staffId
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json({
        success: true,
        message: result.message,
        inventoryReduced: result.inventoryReduced,
      });
    } catch (error) {
      console.error("Error completing prescription:", error);
      res.status(500).json({
        success: false,
        message: "Failed to complete prescription",
        error: error.message,
      });
    }
  }

  static async cancelPrescription(req, res) {
    try {
      const prescriptionId = req.params.id;
      const staffId = req.user.id;

      const result = await PrescriptionModel.cancelPrescription(
        prescriptionId,
        staffId
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json({
        success: true,
        message: result.message,
        paymentDeleted: result.paymentDeleted,
      });
    } catch (error) {
      console.error("Error cancelling prescription:", error);
      res.status(500).json({
        success: false,
        message: "Failed to cancel prescription",
        error: error.message,
      });
    }
  }
}

module.exports = PrescriptionController;
