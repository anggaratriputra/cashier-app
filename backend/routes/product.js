const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const productController = require("../controller/product");
const authMiddleware = require("../middleware/auth");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getSingleProduct);
router.post("/create", multerUpload.single("img"), productController.createProduct);
router.patch("/update/:id", multerUpload.single("img"), productController.updateProduct);
router.put("/:id", productController.deactivateProduct);

module.exports = router;
