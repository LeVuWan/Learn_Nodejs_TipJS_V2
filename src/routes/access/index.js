const express = require("express");
const accessController = require("../../controllers/access.controller");
const { acyncHandle } = require("../../helpers/acyncHandle");
const { authentication } = require("../../auth/auth.utils");
const router = express.Router();

router.post("/shop/signup", acyncHandle(accessController.signUp));
router.post("/shop/login", acyncHandle(accessController.login));
router.use(authentication)
router.post("/shop/refresh_token", acyncHandle(accessController.handleRefreshToken));
router.post("/shop/logout", acyncHandle(accessController.logout));


module.exports = router;
