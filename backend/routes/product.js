const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const productController = require("../controller/product");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware.validateToken, authMiddleware.checkRole, productController.getAllProducts);
router.get("/:name", productController.getSingleProduct);
router.post("/create", multerUpload.single("img"), productController.createProduct);
router.patch("/update/:name", authMiddleware.validateToken, authMiddleware.checkRole, multerUpload.single("img"), productController.updateProduct);
router.put("/:name", authMiddleware.validateToken, authMiddleware.checkRole, productController.deactivateProduct);

module.exports = router;
