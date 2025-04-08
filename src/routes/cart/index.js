const express = require("express");
const { acyncHandle } = require("../../helpers/acyncHandle");
const { authentication } = require("../../auth/auth.utils");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();

router.use(authentication)
router.post("/add_product_to_cart", acyncHandle(cartController.addToCart))
router.post("/delete_product/:id", acyncHandle(cartController.delete))
router.get("", acyncHandle(cartController.getListCart))


module.exports = router;
