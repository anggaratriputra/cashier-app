const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const productController = require("../controller/product");

router.get("/", productController.getAllProducts)
router.post("/create", multerUpload.single("img"), productController.createProduct);
router.put("/update/:name", multerUpload.single("img"), productController.updateProduct);
router.put("/:name", productController.deactivateProduct);


module.exports = router