const express = require("express");
const router = express.Router();

const categoryController = require("../controller/category")

router.get('/', categoryController.getAllCategory)
router.post('/input', categoryController.createCategory)
router.put('/:name', categoryController.editCategory)
router.delete('/:name', categoryController.deleteCategory)

module.exports = router;