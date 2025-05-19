// const cloudinary = require("cloudinary").v2;

// // Configure Cloudinary with credentials from environment variables
// cloudinary.config({
//   cloud_name: "dkzsvhyvx",
//   api_key: "519474643866936",
//   api_secret: "07KoKVP26HtPXwdupnR8RSz-Ac0",
// });

// /**
//  * Upload an image to Cloudinary
//  * @param {Object} file - The file object from request
//  * @param {string} folder - Cloudinary folder to upload to (e.g., 'products', 'categories')
//  * @returns {Promise<Object>} - Cloudinary upload result
//  */
// const uploadImage = async (file, folder = "products") => {
//   // Check if file exists
//   if (!file) {
//     throw new Error("No file provided for upload");
//   }

//   try {
//     // Create a new Promise to handle the Cloudinary upload
//     const uploadResult = await new Promise((resolve, reject) => {
//       // Create upload stream to Cloudinary
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: folder,
//           resource_type: "auto",
//           // Add any other Cloudinary options here
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );

//       // Convert file data buffer to stream and pipe to uploadStream
//       // If file is already a buffer
//       if (Buffer.isBuffer(file.data)) {
//         uploadStream.end(file.data);
//       }
//       // If file has a path (using express-fileupload or similar)
//       else if (file.tempFilePath) {
//         const fs = require("fs");
//         const readStream = fs.createReadStream(file.tempFilePath);
//         readStream.pipe(uploadStream);
//       }
//       // Handle files from multer
//       else if (file.buffer) {
//         uploadStream.end(file.buffer);
//       } else {
//         reject(new Error("Unsupported file format"));
//       }
//     });

//     return {
//       url: uploadResult.secure_url,
//       publicId: uploadResult.public_id,
//       format: uploadResult.format,
//       width: uploadResult.width,
//       height: uploadResult.height,
//     };
//   } catch (error) {
//     console.error("Error uploading image to Cloudinary:", error);
//     throw error;
//   }
// };

// /**
//  * Delete an image from Cloudinary
//  * @param {string} publicId - Cloudinary public ID of the image to delete
//  * @returns {Promise<Object>} - Cloudinary deletion result
//  */
// const deleteImage = async (publicId) => {
//   if (!publicId) return null;

//   try {
//     // If the public ID is a full URL, extract just the ID part
//     if (publicId.includes("cloudinary.com")) {
//       const parts = publicId.split("/");
//       const filename = parts[parts.length - 1];
//       // Remove extension if present
//       publicId = filename.split(".")[0];
//     }

//     const result = await cloudinary.uploader.destroy(publicId);
//     return result;
//   } catch (error) {
//     console.error("Error deleting image from Cloudinary:", error);
//     throw error;
//   }
// };

// /**
//  * Extract Cloudinary public ID from URL
//  * @param {string} url - Cloudinary URL
//  * @returns {string} - Public ID
//  */
// const getPublicIdFromUrl = (url) => {
//   if (!url) return null;

//   // Check if it's a Cloudinary URL
//   if (!url.includes("cloudinary.com")) {
//     return null;
//   }

//   try {
//     // Parse the URL to extract the public ID
//     const regex = /\/v\d+\/(.+?)\./;
//     const match = url.match(regex);
//     return match ? match[1] : null;
//   } catch (error) {
//     console.error("Error extracting public ID from URL:", error);
//     return null;
//   }
// };

// module.exports = {
//   uploadImage,
//   deleteImage,
//   getPublicIdFromUrl,
// };

/////correct one ////////////////

const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: "dkzsvhyvx",
  api_key: "519474643866936",
  api_secret: "07KoKVP26HtPXwdupnR8RSz-Ac0",
});

/**
 * Create a readable stream from a buffer
 * @param {Buffer} buffer - Buffer to convert to stream
 * @returns {Readable} - Readable stream
 */
function bufferToStream(buffer) {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
}

/**
 * Upload an image to Cloudinary
 * @param {Object} file - The file object from request
 * @param {string} folder - Cloudinary folder to upload to (e.g., 'products', 'categories')
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadImage = async (file, folder = "products") => {
  // Check if file exists
  if (!file) {
    throw new Error("No file provided for upload");
  }

  try {
    // Create a new Promise to handle the Cloudinary upload
    const uploadResult = await new Promise((resolve, reject) => {
      // Create upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
          // Add any other Cloudinary options here
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Convert file data buffer to stream and pipe to uploadStream
      // If file is already a buffer
      if (Buffer.isBuffer(file.data)) {
        uploadStream.end(file.data);
      }
      // If file has a path (using express-fileupload or similar)
      else if (file.tempFilePath) {
        const fs = require("fs");
        const readStream = fs.createReadStream(file.tempFilePath);
        readStream.pipe(uploadStream);
      }
      // Handle files from multer - they have .path property
      else if (file.path) {
        const fs = require("fs");
        const readStream = fs.createReadStream(file.path);
        readStream.pipe(uploadStream);
      }
      // Handle files from multer - they have .buffer property
      else if (file.buffer) {
        const readStream = bufferToStream(file.buffer);
        readStream.pipe(uploadStream);
      } else {
        reject(new Error("Unsupported file format"));
      }
    });

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Cloudinary public ID of the image to delete
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const deleteImage = async (publicId) => {
  if (!publicId) return null;

  try {
    // If the public ID is a full URL, extract just the ID part
    if (publicId.includes("cloudinary.com")) {
      const parts = publicId.split("/");
      const filename = parts[parts.length - 1];
      // Remove extension if present
      publicId = filename.split(".")[0];
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

/**
 * Extract Cloudinary public ID from URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
const getPublicIdFromUrl = (url) => {
  if (!url) return null;

  // Check if it's a Cloudinary URL
  if (!url.includes("cloudinary.com")) {
    return null;
  }

  try {
    // Parse the URL to extract the public ID
    const regex = /\/v\d+\/(.+?)\./;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting public ID from URL:", error);
    return null;
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  getPublicIdFromUrl,
};
