const { Types } = require("mongoose")
const { product } = require("../../models/product.model")
const { getSelectData, unGetSelectData, convertToObjId, removeUndefinedObject } = require("../../utils/index")

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query: query, limit: limit, skip: skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query: query, limit: limit, skip: skip })
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: product_shop,
        _id: product_id
    });
    if (!foundProduct) return null

    foundProduct.isDraft = false;
    foundProduct.isPublished = true;
    return await foundProduct.save()
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: product_shop,
        _id: product_id
    });
    if (!foundProduct) {
        return null
    }

    foundProduct.isDraft = true;
    foundProduct.isPublished = false;
    const result = await foundProduct.save()
    return result
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query).populate("product_shop", "name email -_id").sort({ updatedAt: -1 }).limit(limit).skip(skip).lean();
}

const searchProduct = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const result = await product.find({
        $text: { $search: regexSearch }
    }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .lean()

    console.log("Check result: ", result);
    return result;
};

const findAllProduct = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean();

    return products;
};

const findProduct = async ({ shop_id, unselect }) => {
    return await product.findById(shop_id).select(unGetSelectData(unselect))
}

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
    return await model.findByIdAndUpdate(productId, removeUndefinedObject(bodyUpdate), { new: isNew })
}

const findOneProduct = async ({ product_id, unselect }) => {
    return await product.findById(product_id).select(unGetSelectData(unselect));
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProduct,
    findAllProduct,
    findProduct,
    updateProductById,
    findOneProduct
}