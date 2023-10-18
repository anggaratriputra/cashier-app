const express = require("express");
const router = express.Router();

const transactionController = require("../controller/transaction");
const authMiddleware = require("../middleware/auth");

// Get all transaction
// router.get("/", authMiddleware.validateToken, authMiddleware.checkRole);

// Add new transaction
router.post("/", authMiddleware.validateToken, authMiddleware.checkRoleUser, transactionController.handleCreateTransaction);
// router.get("/:transactionId", authMiddleware.validateToken, authMiddleware.checkRole, transactionController.handleGetTransactionById);
router.get("/reports", authMiddleware.validateToken, authMiddleware.checkRole, transactionController.handleGetAllTransaction);
router.get("/", authMiddleware.validateToken, authMiddleware.checkRoleUser, transactionController.handleGetAllTransactionByCashier);

module.exports = router;
