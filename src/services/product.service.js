const { clothing, electronic, product } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");

class ProductFactory {
    static async createProduct(type, payload) {
        try {
            switch (type) {
                case "Clothing":
                    return new Clothing(payload).createProduct()
                case "Electronics":
                    return new Electronic(payload).createProduct()
                default:
                    throw new BadRequestError(`Invalid Product Types ${type}`)
            }
        } catch (error) {
            console.error("Error in handleRefreshToken:", error);
            return {
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
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
        return await product.create({ ...this, _id: product_id })
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({ brand: this.product_attributes.brand, material: this.product_attributes.material, size: this.product_attributes.size, product_shop: this.product_shop })
        if (!newClothing) {
            throw new BadRequestError("Create new clothing error")
        }

        console.log("Check newClothing: ", newClothing);

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) {
            throw new BadRequestError("Create new product error")
        }
        return newProduct;
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
}

module.exports = ProductFactory


