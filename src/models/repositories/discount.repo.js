const { getSelectData, unGetSelectData } = require("../../utils");
const discountModel = require("../discount.model");

const findAllDiscountSelect = async ({ limit = 50, sort = "ctime", page = 1, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await discountModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return products;
};

const findAllDiscountUnselect = async ({ limit = 50, sort = "ctime", page = 1, filter, unselect }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await discountModel
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unselect))
        .lean();
    return products;
};

const checkDiscountExist = async ({ filter }) => {
    return await discountModel.findOne(
        filter
    ).lean()
}

module.exports = {
    findAllDiscountUnselect,
    findAllDiscountSelect,
    checkDiscountExist
}