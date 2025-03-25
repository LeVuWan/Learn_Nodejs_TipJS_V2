const { clothing, electronic, product, furniture } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const { findAllDraftsForShop, updateProductById, publishProductByShop, findAllPublishForShop, unPublishProductByShop, searchProduct, findAllProduct, findProduct } = require("../models/repositories/product.repo")
const { removeUndefinedObject } = require("../utils/index")

class ProductFactory {
    static async createProduct(type, payload) {
        try {
            switch (type) {
                case "Clothing":
                    return new Clothing(payload).createProduct()
                case "Electronics":
                    return new Electronic(payload).createProduct()
                case "Furniture":
                    return new Furniture(payload).createProduct()
                default:
                    throw new BadRequestError(`Invalid Product Types ${type}`)
            }
        } catch (error) {
            return {
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
    }

    static async updateProduct(type, payload, productId) {
        try {
            switch (type) {
                case "Clothing":
                    return new Clothing(payload).updateProduct(productId)
                case "Electronics":
                    return new Electronic(payload).updateProduct(productId)
                case "Furniture":
                    return new Furniture(payload).updateProduct(productId)
                default:
                    throw new BadRequestError(`Invalid Product Types ${type}`)
            }
        } catch (error) {
            return {
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }

        return await findAllDraftsForShop({ query: query, limit: limit, skip: skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: false, isPublished: true }
        return await findAllPublishForShop({ query: query, limit: limit, skip: skip })
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_id: product_id, product_shop: product_shop })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_id: product_id, product_shop: product_shop })
    }

    static async searchProduct({ keySearch }) {
        return await searchProduct({ keySearch: keySearch })
    }

    static async findAllProduct({ limit = 50, sort = "ctime", page = 1, filter = { isPublished: true } }) {

        return await findAllProduct({
            filter,
            limit: parseInt(limit),
            sort,
            page: parseInt(page),
            select: ["product_name", "product_price", "product_thumb"],
        });
    }

    static async findProduct({ shop_id, unselect }) {
        return await findProduct({ shop_id: shop_id, unselect: unselect })
    }
}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name,
            this.product_thumb = product_thumb,
            this.product_description = product_description,
            this.product_price = product_price,
            this.product_quantity = product_quantity,
            this.product_type = product_type,
            this.product_shop = product_shop,
            this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id, product_shop: product_shop._userId })
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ bodyUpdate: bodyUpdate, productId: productId, model: product });
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({ brand: this.product_attributes.brand, material: this.product_attributes.material, size: this.product_attributes.size, product_shop: this.product_shop })
        if (!newClothing) {
            throw new BadRequestError("Create new clothing error")
        }

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) {
            throw new BadRequestError("Create new product error")
        }
        return newProduct;
    }

    async updateProduct(productId) {
        const objParams = removeUndefinedObject(this);
        if (objParams.product_attributes) {
            await updateProductById({ bodyUpdate: removeUndefinedObject(objParams.product_attributes), productId: productId, model: clothing });
        }

        const updateProduct = await super.updateProduct(productId, removeUndefinedObject(objParams));
        return updateProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({ ...this.product_attributes, product_shop: this.product_shop })
        if (!newElectronic) {
            throw new BadRequestError("Create new electronic error")
        }

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) {
            throw new BadRequestError("Create new product error")
        }
        return newProduct;
    }

    async updateProduct(productId) {
        const objParams = removeUndefinedObject(this);
        if (objParams.product_attributes) {
            await updateProductById({ bodyUpdate: removeUndefinedObject(objParams.product_attributes), productId: productId, model: electronic });
        }

        const updateProduct = await super.updateProduct(productId, removeUndefinedObject(objParams));
        return updateProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({ ...this.product_attributes, product_shop: this.product_shop })
        if (!newFurniture) {
            throw new BadRequestError("Create new furniture error")
        }

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) {
            throw new BadRequestError("Create new product error")
        }
        return newProduct;
    }

    async updateProduct(productId) {
        const objParams = removeUndefinedObject(this);
        if (objParams.product_attributes) {
            await updateProductById({ bodyUpdate: removeUndefinedObject(objParams.product_attributes), productId: productId, model: furniture });
        }

        const updateProduct = await super.updateProduct(productId, removeUndefinedObject(objParams));
        return updateProduct;
    }
}
module.exports = ProductFactory


