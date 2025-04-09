const { DiscountService } = require("../services/discount.service")
const { SuccessRespone, OK, CREATED } = require("../core/success.response")

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        const result = await DiscountService.createDiscountCode({ ...req.body, shopId: req.user.userId });
        new CREATED({
            message: "Create code sucsess",
            metadata: result
        }).send(res)
    }

    getAllDiscountCode = async (req, res, next) => {
        const result = await DiscountService.getAllDiscountCodeByShopId({
            ...req.query,
            shopId: req.user.userId
        })

        new OK({
            message: "Get discount success",
            metadata: result
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        const result = await DiscountService.getDiscountAmount({
            ...req.body,
            shopId: req.user.userId
        })

        new OK({
            message: "Get discount success",
            metadata: result
        }).send(res)
    }

    getAllDiscountCodeWithProduct = async (req, res, next) => {
        const result = await DiscountService.getAllDiscountCodeWithProduct({
            code: req.query.code,
            shopId: req.user.userId,
            limit: req.query.limit,
            page: req.query.page
        })

        new OK({
            message: "Get discount success",
            metadata: result
        }).send(res)
    }

    deleteDiscountCode = async (req, res, next) => {
        const result = await DiscountService.deleteDiscountCode({
            codeId: req.query.code,
            shopId: req.user.userId
        })

        new SuccessRespone({
            message: "Delete discount success",
            metadata: result
        }).send(res)
    }
}

module.exports = new DiscountController();
