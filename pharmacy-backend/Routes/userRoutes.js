const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/userController");
const { authenticate } = require("../auth/middleware/auth");

router.use(authenticate);

router.get("/profile", UserController.getUserProfile);

router.put("/profile", UserController.updateUserProfile);

router.put("/password", UserController.changePassword);

router.post("/profile-image", UserController.uploadProfileImage);

module.exports = router;
