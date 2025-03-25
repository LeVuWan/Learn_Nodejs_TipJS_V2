const { Types } = require("mongoose")
const { product } = require("../../models/product.model")
const { getSelectData, unGetSelectData } = require("../../utils/index")

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query: query, limit: limit, skip: skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query: query, limit: limit, skip: skip })
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: product_shop,
        _id: new Types.ObjectId(product_id)
    });
    if (!foundProduct) {
        return null
    }

    foundProduct.isDraft = false;
    foundProduct.isPublished = true;
    const result = await foundProduct.save()
    return result
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: product_shop,
        _id: new Types.ObjectId(product_id)
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
    return await product.find(query).populate("product_shop", "name email -_id").sort({ updateAt: -1 }).skip(skip).limit(limit).lean().exec()
}

const searchProduct = async ({ keySearch }) => {
    const result = await product.find(
        { $text: { $search: keySearch } },
        { score: { $meta: "textScore" } }
    )
        .sort({ score: { $meta: "textScore" } })
        .lean();

    return result;
};

const findAllProduct = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await product
        .find(filter)
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
    return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew })
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProduct,
    findAllProduct,
    findProduct,
    updateProductById
}