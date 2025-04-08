const express = require("express");
const productController = require("../../controllers/product.controller");
const { acyncHandle } = require("../../helpers/acyncHandle");
const { authentication } = require("../../auth/auth.utils");
const router = express.Router();

router.get("/product/search/:searchProduct", acyncHandle(productController.searchProduct))
router.get("/product", acyncHandle(productController.findAllProduct))
router.get("/product/:id", acyncHandle(productController.findOneProduct))

router.use(authentication)
//create
router.post("/product", acyncHandle(productController.createProduct));
//get 
router.get("/product/drafts/all", acyncHandle(productController.findAllDraftsForShop));
router.get("/product/publish/all", acyncHandle(productController.findAllPublishForShop));
router.get("/product/search_product/:keySearch", acyncHandle(productController.searchProduct))
//update
router.post("/product/publish/:id", acyncHandle(productController.publishProductByShop));
router.post("/product/un_publish/:id", acyncHandle(productController.unPublishProductByShop))
//patch
router.patch("/product/:id", acyncHandle(productController.updateProduct))
module.exports = router;
