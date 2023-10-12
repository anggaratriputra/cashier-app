const express = require("express");
const router = express.Router();

const categoryController = require("../controller/category")
const authMiddleware = require("../middleware/auth")


router.get('/', authMiddleware.validateToken, categoryController.getAllCategory)
router.post('/input', categoryController.createCategory)
router.put('/:id', categoryController.editCategory)
router.delete('/:name', categoryController.deleteCategory)

module.exports = router;