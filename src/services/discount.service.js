const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { findAllDiscountSelect, findAllDiscountUnselect, checkDiscountExist } = require("../models/repositories/discount.repo");
const { findAllProduct } = require("../models/repositories/product.repo");
const { convertToObjId } = require("../utils/index")

class DiscountService {
    static async createDiscountCode(payload) {
        const { name, description, type, value, code,
            startDay, endDay, useCount, maxUse, maxUsePerUser,
            minOrderValue, shopId, appliesTo, productIds } = payload;

        const now = new Date();

        if (now < new Date(startDay)) {
            throw new BadRequestError("Discount has not started yet");
        }

        if (now > new Date(endDay)) {
            throw new BadRequestError("Discount has expired");
        }

        if (new Date(startDay) > new Date(endDay)) {
            console.log("Check date 2");
            throw new BadRequestError("Start date muse be before end date")
        }

        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shop_id: shopId
        })

        if (foundDiscount) {
            if (foundDiscount.discount_is_active) {
                throw new BadRequestError("Discount exists!")
            }
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: startDay,
            discount_end_date: endDay,
            discount_use_count: useCount,
            discount_max_use: maxUse,
            discount_user_used: [],
            discount_max_use_per_user: maxUsePerUser,
            discount_min_order_value: minOrderValue,
            discount_shop_id: shopId,
            discount_is_active: true,
            discount_applies_to: appliesTo,
            discount_product_id: appliesTo === 'specific' ? productIds || [] : []
        });
        return newDiscount
    }

    static async getAllDiscountCodeWithProduct({
        code, shopId, limit, page
    }) {
        const discountExist = await discountModel.findOne({
            discount_code: code,
            discount_shop_id: shopId
        }).lean()

        if (!discountExist || !discountExist.discount_is_active) {
            throw new NotFoundError("Discount not exist")
        }

        const { discount_applies_to, discount_product_id } = discountExist;

        let products;

        if (discount_applies_to === "all") {
            products = await findAllProduct({
                filter: { product_shop: shopId, isPublished: true },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            })
        }

        if (discount_applies_to === "specific") {
            products = await findAllProduct({
                filter: {
                    _id: { $in: discount_product_id }
                },
                limit: +limit,
                page: page,
                sort: "ctime",
                select: ["_id", "product_name"],
            })
        }

        return products;
    }

    static async getAllDiscountCodeByShopId({
        shopId, limit, page
    }) {        
        const discounts = await findAllDiscountUnselect({
            filter: { discount_shop_id: (shopId), discount_is_active: true },
            unselect: ["__v, discount_shop_id"],
            limit: +limit,
            page: +page,
        })

        return discounts
    }

    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExist({
            discount_code: code,
            discount_shop_id: (shopId)
        })

        if (!foundDiscount) {
            throw new BadRequestError("Discount not exist")
        }

        const { discount_is_active, discount_value, discount_user_used, discount_max_use, discount_min_order_value, discount_max_use_per_user, discount_type } = foundDiscount

        if (!discount_is_active) {
            throw new BadRequestError("Discount expried")
        }

        if (!discount_max_use) {
            throw new BadRequestError("Discount expried")
        }

        if (new Date() < new Date(startDay) || new Date > new Date(endDay)) {
            throw new BadRequestError("Discount has expried")
        }

        let totalOrder = 0;

        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
        }

        if (totalOrder < discount_min_order_value) {
            throw new BadRequestError(`Discount requires a minium order value of ${discount_min_order_value}`)
        }

        if (discount_max_use_per_user > 0) {
            const userUseDiscount = discount_user_used.find(user => user.userId === userId)
            if (userUseDiscount) {
                throw new BadRequestError("")
            }
        }

        const amount = discount_type === "fixed_amount" ? discount_value : totalOrder * (discount_value / 100)
        return {
            totalOrder,
            amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        const deleteDiscount = await discountModel.findOneAndDelete({
            discount_shop_id: shopId,
            discount_code: codeId
        })
        return deleteDiscount;
    }

    static async cancelDiscountCode({ shopId, codeId, userId }) {

        const foundDiscount = await discountModel.findOneAndUpdate({
            discount_shop_id: shopId,
            discount_code: codeId
        }, {
            $pull: {
                discount_user_used: userId
            },
            $inc: {
                discount_max_use: 1,
                discount_use_count: -1
            }
        })

        if (!foundDiscount) {
            throw new BadRequestError("Discount not exist")
        }

        return foundDiscount;
    }
}
module.exports = {
    DiscountService
}