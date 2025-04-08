const express = require("express");
const { acyncHandle } = require("../../helpers/acyncHandle");
const { authentication } = require("../../auth/auth.utils");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.post("/amount", acyncHandle(discountController.getDiscountAmount))
router.get("/list_product_code", acyncHandle(discountController.getAllDiscountCodeWithProduct))

router.use(authentication)

router.post("", acyncHandle(discountController.createDiscountCode))
router.get("", acyncHandle(discountController.getAllDiscountCode))

module.exports = router;
