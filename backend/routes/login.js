const express = require("express");
const router = express.Router();

const authController = require("../controller/account");
const authMiddleware = require("../middleware/auth");

 router.post("/", authController.handleLogin);
//  router.patch("/account",
//  authMiddleware.validateToken,
//  authController.updateAccount);


module.exports = router;