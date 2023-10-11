const express = require("express");
const router = express.Router();

const cashierController = require("../controller/cashier");

// Get all cashiers
router.get("/", cashierController.getAllCashier);

// Toggle cashier status (GET request for simplicity; consider using POST or PUT for better REST practices)
router.put("/:cashierId/toggle-status", cashierController.toggleCashierStatus);

module.exports = router;