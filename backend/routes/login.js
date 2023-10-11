const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const authController = require("../controller/account");
const authMiddleware = require("../middleware/auth");
const { validateToken } = require("../middleware/auth");



router.get("/profile", authController.getAllAccounts);
router.get("/profile/:username", authController.getSingleAccount);
 router.post("/", authController.handleLogin);
 router.patch(
  "/update/:username",
  authMiddleware.validateToken,
  multerUpload.single("photoProfile"),
  authController.updateAccount
);


module.exports = router;