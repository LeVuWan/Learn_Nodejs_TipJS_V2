const { DiscountService } = require("../services/discount.service")
const { SuccessRespone, OK, CREATED } = require("../core/success.response")

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        const result = await DiscountService.createDiscountCode({ ...req.body, shopId });
        new CREATED({
            message: "Create code sucsess",
            metadata: result
        })
    }

    getAllDiscountCode = async (req, res, next) => {
        const result = await DiscountService.getAllDiscountCodeByShopId({
            ...req.query,
            shopId: req.user.userId
        })

        new OK({
            message: "Get discount success",
            metadata: result
        })
    }

    getDiscountAmount = async (req, res, next) => {
        const result = await DiscountService.getDiscountAmount({
            ...req.body,
            shopId: req.user.userId
        })

        new OK({
            message: "Get discount success",
            metadata: result
        })
    }

    getAllDiscountCodeWithProduct = async (req, res, next) => {
        const result = await DiscountService.getAllDiscountCodeWithProduct({
            ...req.query,
        })

        new OK({
            message: "Get discount success",
            metadata: result
        })
    }

    getAllDiscountCode = async (req, res, next) => {
        const result = await DiscountService.getDiscountAmount({
            ...req.query,
            shopId: req.user.userId
        })

        new OK({
            message: "Get discount success",
            metadata: result
        })
    }
}

module.exports = new DiscountController();
