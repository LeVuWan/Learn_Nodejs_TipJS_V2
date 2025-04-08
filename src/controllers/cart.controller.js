const { SuccessRespone } = require("../core/success.response");
const CartService = require("../services/cart.service")

class CartController {
    addToCart = async (req, res, next) => {
        const result = await CartService.addToCart({ userId: req.user.userId, product: req.body })
        new SuccessRespone({
            message: "Add product to cart success",
            metadata: null
        }).send(res)
    }

    delete = async (req, res, next) => {
        const result = await CartService.deleteUserCart({ userId: req.user.userId, product: req.param.id })
        new SuccessRespone({
            message: "Delete product in cart success",
            metadata: null
        }).send(res)
    }


    getListCart = async (req, res, next) => {
        const result = await CartService.getListCart({ userId: req.user.userId })
        new SuccessRespone({
            message: "Get product in cart success",
            metadata: null
        }).send(res)
    }
}

module.exports = new CartController();
