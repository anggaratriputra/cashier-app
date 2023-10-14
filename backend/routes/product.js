const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const productController = require("../controller/product");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware.validateToken, productController.getAllProducts); // jgn cek pake check role, soalnya cashier jg mau nampilin semua produk 
router.get("/:id", authMiddleware.validateToken, productController.getSingleProduct);
router.post("/create", authMiddleware.validateToken, authMiddleware.checkRole, multerUpload.single("img"), productController.createProduct);
router.patch("/update/:id", authMiddleware.validateToken, authMiddleware.checkRole, multerUpload.single("image"), productController.updateProduct);
router.put("/:id", authMiddleware.validateToken, authMiddleware.checkRole, productController.deactivateProduct);

module.exports = router;