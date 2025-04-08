'use strict'

const { product, electronic, clothing, furniture } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response")

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
        return product.create({ _id: product_id, ...this })
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
}

class Clothing extends Product {
    async createProduct() {
        const newCloting = await clothing.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newCloting) throw new BadRequestError("Create a new clothing error")
        const newProduct = await super.createProduct({ product_id: newCloting._id })
        if (!newProduct) throw new BadRequestError("Create a new product error")
        return newProduct
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
}

ProductFactory.registerProductType("Electronics", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory