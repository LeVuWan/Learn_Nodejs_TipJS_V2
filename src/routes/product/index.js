const express = require("express");
const productController = require("../../controllers/product.controller");
const { acyncHandle } = require("../../helpers/acyncHandle");
const { authentication } = require("../../auth/auth.utils");
const router = express.Router();

// router.get("/product/search_product/:key", acyncHandle(productController.searchProduct))
// router.get("/product", acyncHandle(productController.findAllProduct))

router.use(authentication)
router.post("/product", acyncHandle(productController.createProduct));

module.exports = router;
