const AccessService = require("../services/access.service");
const { CREATED, OK, SuccessRespone } = require("../core/success.response")

class AccessController {
  signUp = async (req, res, next) => {
    const result = await AccessService.signUp(req.body);
    new CREATED({
      metadata: result,
    }).send(res)
  };

  login = async (req, res, next) => {
    const result = await AccessService.login(req.body);
    new SuccessRespone({
      metadata: result,
    }).send(res)
  }

  logout = async (req, res, next) => {
    const result = await AccessService.logout({ keyStore: req.keyStore });

    new SuccessRespone({
      message: "Logout success",
      metadata: result
    }).send(res)
  }

  handleRefreshToken = async (req, res, next) => {
    const result = await AccessService.handleRefreshToken({ refreshToken: req.body.refreshToken });

    new SuccessRespone({
      message: "Refresh token success",
      metadata: result
    }).send(res)
  }
}

module.exports = new AccessController();
