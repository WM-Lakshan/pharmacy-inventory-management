// controllers/landing.controller.js
const LandingModel = require("../../Models/customer/landing.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../../utils/cloudinaryConfig");
const { uploadImage } = require("../../utils/uploadImage");
const Jimp = require("jimp"); // Add this import (npm install jimp)
const { db } = require("../../db"); // Import your database connection

// Configure storage for temporary files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/prescriptions/temp";
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

// Upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept images and PDFs only
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(new Error("Only image or PDF files are allowed!"), false);
    }
    cb(null, true);
  },
}).single("prescription");

// Fixed watermark function
// const addWatermarkToImage = async (inputPath) => {
//   try {
//     console.log(`Adding watermark to image: ${inputPath}`);

//     // Make sure file exists
//     if (!fs.existsSync(inputPath)) {
//       console.error(`File not found: ${inputPath}`);
//       return null;
//     }

//     // Read the image using Jimp
//     const image = await Jimp.read(inputPath);

//     // Create watermark text
//     let font;
//     try {
//       font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
//     } catch (fontError) {
//       console.error("Error loading font:", fontError);
//       // Fallback to a different font if the first one fails
//       font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
//     }

//     const watermarkText = "L.W.PHARMACY - VERIFIED COPY";
//     const date = new Date().toISOString().split("T")[0];
//     const expiryDate = new Date();
//     expiryDate.setHours(expiryDate.getHours() + 48);
//     const expiryText = `EXPIRES: ${expiryDate
//       .toISOString()
//       .substring(0, 16)
//       .replace("T", " ")}`;

//     // Add watermark text
//     image.print(
//       font,
//       10,
//       10,
//       {
//         text: watermarkText,
//         alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
//         alignmentY: Jimp.VERTICAL_ALIGN_TOP,
//       },
//       image.getWidth() - 20
//     );

//     // Add date
//     image.print(
//       font,
//       10,
//       50,
//       {
//         text: `Date: ${date}`,
//         alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
//         alignmentY: Jimp.VERTICAL_ALIGN_TOP,
//       },
//       image.getWidth() - 20
//     );

//     // Add expiry text
//     image.print(
//       font,
//       10,
//       90,
//       {
//         text: expiryText,
//         alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
//         alignmentY: Jimp.VERTICAL_ALIGN_TOP,
//       },
//       image.getWidth() - 20
//     );

//     // Save the watermarked image to a temporary file
//     const outputPath = inputPath
//       .replace(".png", "-watermarked.png")
//       .replace(".jpg", "-watermarked.jpg")
//       .replace(".jpeg", "-watermarked.jpeg");

//     await image.writeAsync(outputPath);
//     console.log(`Watermarked image saved to: ${outputPath}`);

//     // Read the file as buffer to return
//     const buffer = await fs.promises.readFile(outputPath);

//     return {
//       buffer,
//       filePath: outputPath,
//       expiryDate,
//     };
//   } catch (error) {
//     console.error("Error adding watermark:", error);
//     return null;
//   }
// };

// Add this after all the require statements but before the LandingController class
async function addWatermarkToImage(tempFilePath) {
  try {
    console.log(`Reading image from: ${tempFilePath}`);

    // 1. Verify file exists
    if (!fs.existsSync(tempFilePath)) {
      throw new Error(`File not found: ${tempFilePath}`);
    }

    // 2. Read the image
    const image = await Jimp.read(tempFilePath);
    console.log("Image read successfully");

    // 3. Load font (with error handling)
    let font;
    try {
      font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    } catch (fontError) {
      console.error("Error loading font:", fontError);
      // Fallback to basic text writing if font fails
      font = Jimp.FONT_SANS_8_BLACK;
    }

    // 4. Add watermark
    image.print(
      font,
      10, // x
      10, // y
      {
        text: "L.W.PHARMACY - VERIFIED COPY",
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP,
      },
      image.bitmap.width - 20 // maxWidth
    );

    // 5. Save watermarked image
    const watermarkedPath = tempFilePath.replace(/(\.\w+)$/, "-watermarked$1");
    await image.writeAsync(watermarkedPath);

    return watermarkedPath;
  } catch (error) {
    console.error("Error in addWatermarkToImage:", error);
    throw error; // Or return null if you want to continue without watermark
  }
}

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/prescriptions/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, "prescription-" + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     // Accept images and PDFs only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
//       return cb(new Error("Only image or PDF files are allowed"), false);
//     }
//     cb(null, true);
//   },
// }).single("prescription");

class LandingController {
  // Get featured products
  static async getFeaturedProducts(req, res) {
    try {
      const products = await LandingModel.getFeaturedProducts();

      // Transform data for frontend
      const transformedProducts = products.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: product.price,
        image: product.image || `/api/placeholder/240/240`,
        discount: 0, // We could calculate this if there was discount data
        requiresPrescription: product.product_type === "prescription needed",
        inStock: product.quantity > 0,
        category: product.category_name,
      }));

      res.status(200).json({
        success: true,
        products: transformedProducts,
      });
    } catch (error) {
      console.error("Error getting featured products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get featured products",
      });
    }
  }

  // Get top selling products
  static async getTopSellingProducts(req, res) {
    try {
      const products = await LandingModel.getTopSellingProducts();

      // Transform data for frontend
      const transformedProducts = products.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: product.price,
        image: product.image || `/api/placeholder/240/240`,
        discount: 0, // We could calculate this if there was discount data
        requiresPrescription: product.product_type === "prescription needed",
        inStock: product.quantity > 0,
        category: product.category_name,
      }));

      res.status(200).json({
        success: true,
        products: transformedProducts,
      });
    } catch (error) {
      console.error("Error getting top selling products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get top selling products",
      });
    }
  }

  // Get categories
  static async getCategories(req, res) {
    try {
      const categories = await LandingModel.getCategories();

      // Add "All Categories" option
      const allCount = categories.reduce(
        (total, cat) => total + cat.product_count,
        0
      );
      const transformedCategories = [
        { id: "all", name: "All Categories", count: allCount },
        ...categories.map((cat) => ({
          id: cat.product_cato_id,
          name: cat.name,
          count: cat.product_count,
          description: cat.description,
        })),
      ];

      res.status(200).json({
        success: true,
        categories: transformedCategories,
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get categories",
      });
    }
  }

  // Search products
  static async searchProducts(req, res) {
    try {
      const { query, category } = req.query;
      const limit = parseInt(req.query.limit) || 12;

      const products = await LandingModel.searchProducts(
        query,
        category,
        limit
      );

      // Transform data for frontend
      const transformedProducts = products.map((product) => ({
        id: product.product_id,
        name: product.pname,
        price: product.price,
        image: product.image || `/api/placeholder/240/240`,
        discount: 0, // We could calculate this if there was discount data
        requiresPrescription: product.product_type === "prescription needed",
        inStock: product.quantity > 0,
        category: product.category_name,
      }));

      res.status(200).json({
        success: true,
        products: transformedProducts,
        total: transformedProducts.length,
      });
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({
        success: false,
        message: "Failed to search products",
      });
    }
  }

  /**
   * Upload prescription with watermark and 48-hour expiration
   */
  // static async uploadPrescription(req, res) {
  //   upload(req, res, async function (err) {
  //     if (err instanceof multer.MulterError) {
  //       console.error("Multer error:", err);
  //       return res.status(400).json({
  //         success: false,
  //         message: `File upload error: ${err.message}`,
  //       });
  //     } else if (err) {
  //       console.error("Upload error:", err);
  //       return res.status(400).json({
  //         success: false,
  //         message: err.message || "File upload failed",
  //       });
  //     }

  //     try {
  //       // Check authentication and validate required fields
  //       if (!req.user || !req.user.id) {
  //         return res.status(401).json({
  //           success: false,
  //           message: "Authentication required",
  //         });
  //       }

  //       console.log("Request body:", req.body);
  //       console.log("Uploaded file:", req.file);

  //       const customerId = req.user.id;

  //       // Normalize form fields that might be arrays
  //       const normalizeField = (field) => {
  //         return Array.isArray(field) ? field[0] : field;
  //       };

  //       const name =
  //         normalizeField(req.body.name) || normalizeField(req.body.fullName);
  //       const telephone = normalizeField(req.body.telephone);
  //       const address = normalizeField(req.body.address);
  //       let deliveryMethod = normalizeField(req.body.deliveryMethod);
  //       const deliveryAddress = normalizeField(req.body.deliveryAddress);
  //       const note = normalizeField(req.body.note);

  //       // Map frontend delivery method to database enum value if needed
  //       if (deliveryMethod === "Home Delivery") {
  //         deliveryMethod = "Deliver";
  //       }

  //       // Log normalized fields
  //       console.log("Normalized fields:", {
  //         name,
  //         telephone,
  //         deliveryMethod,
  //         deliveryAddress,
  //         note,
  //       });

  //       // Validate required fields
  //       if (!name || !telephone) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Name and telephone are required",
  //         });
  //       }

  //       if (deliveryMethod === "Home Delivery" && !deliveryAddress) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Delivery address is required for home delivery",
  //         });
  //       }

  //       // Ensure file was uploaded
  //       if (!req.file) {
  //         return res.status(400).json({
  //           success: false,
  //           message: "Prescription file is required",
  //         });
  //       }

  //       let cloudinaryUrl = "";
  //       let expiryDate = new Date();
  //       expiryDate.setHours(expiryDate.getHours() + 48); // Set expiry to 48 hours from now

  //       const tempFilePath = req.file.path;
  //       const fileExt = path.extname(tempFilePath).toLowerCase();

  //       try {
  //         if (fileExt === ".pdf") {
  //           // For PDF files, just upload directly to Cloudinary
  //           console.log("Uploading PDF to Cloudinary");
  //           const result = await cloudinary.uploader.upload(tempFilePath, {
  //             folder: "pharmacy/prescriptions",
  //             resource_type: "auto",
  //           });
  //           cloudinaryUrl = result.secure_url;
  //           console.log("PDF uploaded to:", cloudinaryUrl);
  //         } else if (fileExt.match(/\.(jpg|jpeg|png)$/i)) {
  //           // For image files, try to add watermark before uploading
  //           try {
  //             console.log("Attempting to add watermark to image");

  //             // Try to watermark the image
  //             let watermarkedPath = null;

  //             try {
  //               // Simple watermarking without complex Jimp functions
  //               const image = await Jimp.read(tempFilePath);
  //               const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);

  //               // Add watermark text
  //               image.print(
  //                 font,
  //                 10,
  //                 10,
  //                 {
  //                   text: "L.W.PHARMACY - VERIFIED COPY",
  //                 },
  //                 image.getWidth() - 20
  //               );

  //               // Add expiry text
  //               image.print(
  //                 font,
  //                 10,
  //                 30,
  //                 {
  //                   text: `EXPIRES: ${expiryDate.toLocaleDateString()}`,
  //                 },
  //                 image.getWidth() - 20
  //               );

  //               // Save watermarked image
  //               watermarkedPath = tempFilePath.replace(
  //                 /\.\w+$/,
  //                 "-watermarked$&"
  //               );
  //               await image.writeAsync(watermarkedPath);
  //               console.log("Watermark added successfully");
  //             } catch (jimpError) {
  //               console.error("Error using Jimp:", jimpError);
  //               watermarkedPath = null;
  //             }

  //             // Upload the watermarked image if available, otherwise original
  //             if (watermarkedPath && fs.existsSync(watermarkedPath)) {
  //               const result = await cloudinary.uploader.upload(
  //                 watermarkedPath,
  //                 {
  //                   folder: "pharmacy/prescriptions",
  //                   resource_type: "image",
  //                 }
  //               );
  //               cloudinaryUrl = result.secure_url;
  //               console.log("Watermarked image uploaded to:", cloudinaryUrl);

  //               // Clean up watermarked file
  //               try {
  //                 fs.unlinkSync(watermarkedPath);
  //                 console.log(`Deleted watermarked file: ${watermarkedPath}`);
  //               } catch (unlinkError) {
  //                 console.error(
  //                   "Error removing watermarked file:",
  //                   unlinkError
  //                 );
  //               }
  //             } else {
  //               // Upload original if watermarking failed
  //               console.log("Watermarking failed, uploading original image");
  //               const result = await cloudinary.uploader.upload(tempFilePath, {
  //                 folder: "pharmacy/prescriptions",
  //                 resource_type: "image",
  //               });
  //               cloudinaryUrl = result.secure_url;
  //               console.log("Original image uploaded to:", cloudinaryUrl);
  //             }
  //           } catch (watermarkError) {
  //             // If any error during watermarking, upload original
  //             console.error(
  //               "Error during watermarking process:",
  //               watermarkError
  //             );
  //             console.log("Uploading original image due to watermark error");
  //             const result = await cloudinary.uploader.upload(tempFilePath, {
  //               folder: "pharmacy/prescriptions",
  //               resource_type: "image",
  //             });
  //             cloudinaryUrl = result.secure_url;
  //             console.log("Original image uploaded to:", cloudinaryUrl);
  //           }
  //         }

  //         // Clean up temporary file
  //         try {
  //           fs.unlinkSync(tempFilePath);
  //           console.log(`Deleted temp file: ${tempFilePath}`);
  //         } catch (unlinkError) {
  //           console.error("Error removing temp file:", unlinkError);
  //         }
  //       } catch (uploadError) {
  //         console.error("Error uploading to Cloudinary:", uploadError);
  //         return res.status(500).json({
  //           success: false,
  //           message: "Failed to process and upload prescription",
  //           error: uploadError.message,
  //         });
  //       }

  //       // Save prescription to database
  //       const connection = await db.getConnection();

  //       try {
  //         await connection.beginTransaction();

  //         // Insert prescription with expiry date
  //         const [prescriptionResult] = await connection.execute(
  //           `
  //         INSERT INTO prescription (
  //           customer_id,
  //           pharmacy_staff_id,
  //           status,
  //           delivery_method,
  //           note,
  //           file_path,
  //           expiry_date
  //         )
  //         VALUES (?, NULL, 'Pending', ?, ?, ?, ?)
  //       `,
  //           [
  //             customerId,
  //             deliveryMethod,
  //             note || null,
  //             cloudinaryUrl,
  //             expiryDate,
  //           ]
  //         );

  //         const prescriptionId = prescriptionResult.insertId;

  //         // Create notification for the customer
  //         await connection.execute(
  //           `
  //         INSERT INTO notifications (
  //           user_id,
  //           user_type,
  //           title,
  //           message,
  //           is_read
  //         )
  //         VALUES (
  //           ?,
  //           'customer',
  //           'Prescription Uploaded',
  //           'Your prescription has been uploaded and is pending review. It will expire in 48 hours.',
  //           FALSE
  //         )
  //       `,
  //           [customerId]
  //         );

  //         // Create notification for pharmacy staff
  //         await connection.execute(`
  //         INSERT INTO notifications (
  //           user_id,
  //           user_type,
  //           title,
  //           message,
  //           is_read
  //         )
  //         VALUES (
  //           1,
  //           'staff',
  //           'New Prescription Uploaded',
  //           'A new prescription has been uploaded by a customer and needs review. It will expire in 48 hours.',
  //           FALSE
  //         )
  //       `);

  //         await connection.commit();

  //         // Set up expiration job (using a simple setTimeout for demo purposes)
  //         // In production, you would use a proper job scheduler like node-schedule or a cron job
  //         const expiryMs = expiryDate.getTime() - Date.now();
  //         setTimeout(async () => {
  //           try {
  //             // Update prescription status to 'Expired' after 48 hours
  //             await db.execute(
  //               `
  //             UPDATE prescription
  //             SET status = 'Expired'
  //             WHERE prescription_id = ? AND status = 'Pending'
  //           `,
  //               [prescriptionId]
  //             );

  //             // Notify customer about expiration
  //             await db.execute(
  //               `
  //             INSERT INTO notifications (
  //               user_id,
  //               user_type,
  //               title,
  //               message,
  //               is_read
  //             )
  //             VALUES (
  //               ?,
  //               'customer',
  //               'Prescription Expired',
  //               'Your prescription has expired. Please upload a new one if you still need your medications.',
  //               FALSE
  //             )
  //           `,
  //               [customerId]
  //             );

  //             console.log(
  //               `Prescription #${prescriptionId} expired automatically after 48 hours`
  //             );
  //           } catch (expiryError) {
  //             console.error("Error expiring prescription:", expiryError);
  //           }
  //         }, expiryMs);

  //         res.status(200).json({
  //           success: true,
  //           message:
  //             "Prescription uploaded successfully. It will expire in 48 hours.",
  //           prescriptionId: prescriptionId,
  //           expiryDate: expiryDate,
  //         });
  //       } catch (dbError) {
  //         await connection.rollback();
  //         console.error("Database error:", dbError);
  //         res.status(500).json({
  //           success: false,
  //           message: "Failed to save prescription details",
  //           error: dbError.message,
  //         });
  //       } finally {
  //         connection.release();
  //       }
  //     } catch (error) {
  //       console.error("Error in uploadPrescription:", error);
  //       res.status(500).json({
  //         success: false,
  //         message: "Failed to upload prescription",
  //         error: error.message,
  //       });
  //     }
  //   });
  // }

  static async uploadPrescription(req, res) {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`,
        });
      } else if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }

      try {
        // Check authentication and validate required fields
        if (!req.user || !req.user.id) {
          return res.status(401).json({
            success: false,
            message: "Authentication required",
          });
        }

        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);

        const customerId = req.user.id;

        // Normalize form fields that might be arrays
        const normalizeField = (field) => {
          return Array.isArray(field) ? field[0] : field;
        };

        const name =
          normalizeField(req.body.name) || normalizeField(req.body.fullName);
        const telephone = normalizeField(req.body.telephone);
        const address = normalizeField(req.body.address);
        let deliveryMethod = normalizeField(req.body.deliveryMethod);
        const deliveryAddress = normalizeField(req.body.deliveryAddress);
        const note = normalizeField(req.body.note);

        if (address && address.length > 255) {
          return res.status(400).json({
            success: false,
            message: "Address must be less than 255 characters",
          });
        }

        // Map frontend delivery method to database enum value if needed
        if (deliveryMethod === "Home Delivery") {
          deliveryMethod = "Deliver";
        }

        // Log normalized fields
        console.log("Normalized fields:", {
          name,
          telephone,
          deliveryMethod,
          deliveryAddress,
          note,
        });

        // Validate required fields
        if (!name || !telephone) {
          return res.status(400).json({
            success: false,
            message: "Name and telephone are required",
          });
        }

        if (deliveryMethod === "Home Delivery" && !deliveryAddress) {
          return res.status(400).json({
            success: false,
            message: "Delivery address is required for home delivery",
          });
        }

        // Ensure file was uploaded
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "Prescription file is required",
          });
        }

        let cloudinaryUrl = "";
        let expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 48); // Set expiry to 48 hours from now

        const tempFilePath = req.file.path;
        const fileExt = path.extname(tempFilePath).toLowerCase();

        try {
          if (fileExt === ".pdf") {
            // For PDF files, just upload directly to Cloudinary
            console.log("Uploading PDF to Cloudinary");
            const result = await cloudinary.uploader.upload(tempFilePath, {
              folder: "pharmacy/prescriptions",
              resource_type: "auto",
            });
            cloudinaryUrl = result.secure_url;
            console.log("PDF uploaded to:", cloudinaryUrl);
          } else if (fileExt.match(/\.(jpg|jpeg|png)$/i)) {
            // For image files, try to add watermark before uploading
            try {
              console.log("Attempting to add watermark to image");

              // Use the helper function to add watermark
              watermarkedPath = await addWatermarkToImage(tempFilePath);

              // Upload the watermarked image if available, otherwise original
              const uploadPath = watermarkedPath || tempFilePath;
              const result = await cloudinary.uploader.upload(uploadPath, {
                folder: "pharmacy/prescriptions",
                resource_type: "image",
              });
              cloudinaryUrl = result.secure_url;
              console.log("Image uploaded to:", cloudinaryUrl);

              // Clean up files
              if (watermarkedPath) {
                try {
                  fs.unlinkSync(watermarkedPath);
                } catch (unlinkError) {
                  console.error(
                    "Error removing watermarked file:",
                    unlinkError
                  );
                }
              }
            } catch (watermarkError) {
              console.error(
                "Error during watermarking process:",
                watermarkError
              );
              // Fallback to original image upload
              const result = await cloudinary.uploader.upload(tempFilePath, {
                folder: "pharmacy/prescriptions",
                resource_type: "image",
              });
              cloudinaryUrl = result.secure_url;
              console.log("Original image uploaded to:", cloudinaryUrl);
            }
          }

          // Clean up temporary file
          try {
            fs.unlinkSync(tempFilePath);
            console.log(`Deleted temp file: ${tempFilePath}`);
          } catch (unlinkError) {
            console.error("Error removing temp file:", unlinkError);
          }
        } catch (uploadError) {
          console.error("Error uploading to Cloudinary:", uploadError);
          return res.status(500).json({
            success: false,
            message: "Failed to process and upload prescription",
            error: uploadError.message,
          });
        }

        // Save prescription to database
        const connection = await db.getConnection();

        try {
          await connection.beginTransaction();

          // Insert prescription with expiry date
          const [prescriptionResult] = await connection.execute(
            `
        INSERT INTO prescription (
      customer_id, 
      pharmacy_staff_id, 
      status, 
      delivery_method, 
      note, 
      file_path,
      expiry_date,
      telephone,
      address
    )
    VALUES (?, NULL, 'Pending', ?, ?, ?, ?, ?, ?)
        `,
            [
              customerId,
              deliveryMethod,
              note || null,
              cloudinaryUrl,
              expiryDate,
              telephone || null,
              address || null,
            ]
          );

          const prescriptionId = prescriptionResult.insertId;

          // Create notification for the customer
          await connection.execute(
            `
          INSERT INTO notifications (
            user_id, 
            user_type, 
            title, 
            message, 
            is_read
          )
          VALUES (
            ?, 
            'customer', 
            'Prescription Uploaded', 
            'Your prescription has been uploaded and is pending review. It will expire in 48 hours.', 
            FALSE
          )
        `,
            [customerId]
          );

          // Create notification for pharmacy staff
          await connection.execute(`
          INSERT INTO notifications (
            user_id, 
            user_type, 
            title, 
            message, 
            is_read
          )
          VALUES (
            1, 
            'staff', 
            'New Prescription Uploaded', 
            'A new prescription has been uploaded by a customer and needs review. It will expire in 48 hours.', 
            FALSE
          )
        `);

          await connection.commit();

          // Set up expiration job (using a simple setTimeout for demo purposes)
          // In production, you would use a proper job scheduler like node-schedule or a cron job
          const expiryMs = expiryDate.getTime() - Date.now();
          setTimeout(async () => {
            try {
              // Update prescription status to 'Expired' after 48 hours
              await db.execute(
                `
              UPDATE prescription
              SET status = 'Expired'
              WHERE prescription_id = ? AND status = 'Pending'
            `,
                [prescriptionId]
              );

              // Notify customer about expiration
              await db.execute(
                `
              INSERT INTO notifications (
                user_id, 
                user_type, 
                title, 
                message, 
                is_read
              )
              VALUES (
                ?, 
                'customer', 
                'Prescription Expired', 
                'Your prescription has expired. Please upload a new one if you still need your medications.', 
                FALSE
              )
            `,
                [customerId]
              );

              console.log(
                `Prescription #${prescriptionId} expired automatically after 48 hours`
              );
            } catch (expiryError) {
              console.error("Error expiring prescription:", expiryError);
            }
          }, expiryMs);

          res.status(200).json({
            success: true,
            message:
              "Prescription uploaded successfully. It will expire in 48 hours.",
            prescriptionId: prescriptionId,
            expiryDate: expiryDate,
          });
        } catch (dbError) {
          await connection.rollback();
          console.error("Database error:", dbError);
          res.status(500).json({
            success: false,
            message: "Failed to save prescription details",
            error: dbError.message,
          });
        } finally {
          connection.release();
        }
      } catch (error) {
        console.error("Error in uploadPrescription:", error);
        res.status(500).json({
          success: false,
          message: "Failed to upload prescription",
          error: error.message,
        });
      }
    });
  }
}

module.exports = LandingController;
