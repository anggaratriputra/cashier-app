const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const authController = require("../controller/account");
const authMiddleware = require("../middleware/auth");
const { validateToken } = require("../middleware/auth");

router.get("/profile", authController.getAllAccounts);
router.get("/myprofile/:username", authMiddleware.validateToken, authController.getSingleAccount);
router.get("/profile/:username", authMiddleware.validateToken, authMiddleware.checkRoleUser, authController.getSingleAccount);
router.get("/profile/admin/:username", authMiddleware.validateToken, authMiddleware.checkRole, authController.getSingleAccount);
router.post("/", authController.handleLogin);
router.patch("/profile", authMiddleware.validateToken, authMiddleware.checkRoleUser, multerUpload.single("photoProfile"), authController.updateAccount);
router.patch("/admin/profile", authMiddleware.validateToken, authMiddleware.checkRole, multerUpload.single("photoProfile"), authController.updateAccount);
router.post("/reset-password/request", authMiddleware.validateToken, authController.initiatePasswordReset)
router.post("/reset-password/", authMiddleware.validateToken, authController.resetPassword);


module.exports = router;
