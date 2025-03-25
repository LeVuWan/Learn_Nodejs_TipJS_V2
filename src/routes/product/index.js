const express = require("express");
const productController = require("../../controllers/product.controller");
const { acyncHandle } = require("../../helpers/acyncHandle");
const { authentication } = require("../../auth/auth.utils");
const router = express.Router();

router.get("/product/search_product/:key", acyncHandle(productController.searchProduct))
router.get("/product", acyncHandle(productController.findAllProduct))

router.use(authentication)
router.post("/product", acyncHandle(productController.createProduct));
router.patch("/product/:id", acyncHandle(productController.updateProduct));
router.get("/product/get_product_draft_by_shop", acyncHandle(productController.findAllDraftsForShop))
router.get("/product/get_product_publish_by_shop", acyncHandle(productController.findAllPublishForShop))

router.post("/product/publish/:id", acyncHandle(productController.publishProductByShop))
router.post("/product/un_publish/:id", acyncHandle(productController.unPublishProductByShop))

module.exports = router;
