const express = require("express");
const router = express.Router();

const cashierController = require("../controller/cashier");
const cashierValidator = require("../middleware/validation/cashier")
const authMiddleware = require("../middleware/auth")

// Get all cashiers
router.get("/", authMiddleware.validateToken, authMiddleware.checkRole, cashierController.getAllCashiers);

// Toggle cashier status (GET request for simplicity; consider using POST or PUT for better REST practices)
router.put("/:cashierId/toggle-status", authMiddleware.validateToken, authMiddleware.checkRole, cashierController.toggleCashierStatus);

// Add new cashiers
router.post(
    "/register", 
  cashierValidator.registerValidationRules,
  cashierValidator.applyRegisterValidation,
   cashierController.handleRegister
   );
  
module.exports = router;