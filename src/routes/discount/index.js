const express = require("express");
const { acyncHandle } = require("../../helpers/acyncHandle");
const { authentication } = require("../../auth/auth.utils");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.post("/discount", authentication, acyncHandle(discountController.createDiscountCode))
router.get("/discount/get_all_discount", authentication, acyncHandle(discountController.getAllDiscountCode))
router.post("/discount/amount", acyncHandle(discountController.getDiscountAmount))
router.get("/discount/list_product_code", authentication, acyncHandle(discountController.getAllDiscountCodeWithProduct))

module.exports = router;
