const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../utils/cloudinaryConfig");
 // Adjust the path as necessary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "product-images", // optional folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
