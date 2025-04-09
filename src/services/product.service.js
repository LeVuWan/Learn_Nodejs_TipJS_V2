'use strict'

const { product, electronic, clothing, furniture } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const { findAllDraftsForShop, findAllPublishForShop, publishProductByShop, unPublishProductByShop, searchProduct, findAllProduct, findOneProduct, updateProductById } = require("../models/repositories/product.repo");
const { insertIntory } = require("../models/repositories/inventory.repo");

class ProductFactory {

    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct({ payload }) {
        const type = payload.product_type;
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).createProduct()
    }

    static async updateProduct({ payload, productId }) {
        const type = payload.product_type;
        const productClass = ProductFactory.productRegistry[type]

        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).updateProduct({ productId: productId })
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftsForShop({ query: query, skip: skip, limit: limit })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: false };
        return await findAllPublishForShop({ query: query, skip: skip, limit: limit })
    }

    static async publishProductByShop({ product_id, product_shop }) {
        return await publishProductByShop({ product_id: product_id, product_shop: product_shop })
    }

    static async unPublishProductByShop({ product_id, product_shop }) {
        return await unPublishProductByShop({ product_id: product_id, product_shop: product_shop })
    }

    static async searchProduct({ keySearch }) {
        return await searchProduct({ keySearch: keySearch })
    }

    static async findAllProduct({ limit = 50, sort = "ctime", page = 1, filter = { isPublished: true } }) {
        return await findAllProduct({
            limit: limit, sort: sort, page: page, filter: filter,
            select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    static async findOneProduct({ productId }) {
        return await findOneProduct({ product_id: productId, unselect: ['__v', "product_variations"] })
    }
}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct({ product_id }) {
        const newProduct = product.create({ _id: product_id, ...this })
        if (newProduct) {
            await insertIntory({ productId: product_id, shopId: this.product_shop, stock: this.product_quantity, });
        }
        return newProduct
    }

    async updateProduct({ productId, payload }) {
        return await updateProductById({ productId: productId, bodyUpdate: payload, model: product });
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newElectronic) throw new BadRequestError("Create a new Electronic error")
        const newProduct = await super.createProduct({ product_id: newElectronic._id })
        if (!newProduct) throw new BadRequestError("Create a new product error")
        return newProduct
    }

    async updateProduct() {
        const payload = this;

        if (payload.product_attributes) {
            await updateProductById({ productId: productId, bodyUpdate: payload.product_attributes, model: electronic });
        }

        const updateProduct = await super.updateProduct({ productId: productId, payload: payload });
        return updateProduct;
    }
}

class Clothing extends Product {
    async createProduct() {
        const newCloting = await clothing.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newCloting) throw new BadRequestError("Create a new clothing error")
        const newProduct = await super.createProduct({ product_id: newCloting._id })
        if (!newProduct) throw new BadRequestError("Create a new product error")
        return newProduct
    }

    async updateProduct({ productId }) {
        const payload = (this);

        if (payload.product_attributes) {
            console.log("Check update payload");

            await updateProductById({ productId: productId, bodyUpdate: payload.product_attributes, model: clothing });
        }

        const updateProduct = await super.updateProduct({ productId: productId, payload: payload });

        return updateProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newFurniture) throw new BadRequestError("Create a new Furniture error")
        const newProduct = await super.createProduct({ product_id: newFurniture._id })
        if (!newProduct) throw new BadRequestError("Create a new product error")
        return newProduct
    }

    async updateProduct(productId) {
        const payload = this;

        if (payload.product_attributes) {
            await updateProductById({ productId: productId, bodyUpdate: payload.product_attributes, model: furniture });
        }

        const updateProduct = await super.updateProduct({ productId: productId, payload: payload });
        return updateProduct;
    }
}

ProductFactory.registerProductType("Electronics", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory