const express = require("express");
const router = express.Router();

const cashierController = require("../controller/cashier")

router.get('/', cashierController.getAllCashier)

module.exports = router;

