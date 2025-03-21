const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Products"
const COLLECTION_NAME = "Products"

const productSchema = new Schema({
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: { type: String, require: true },
    product_price: { type: String, require: true },
    product_quantity: { type: Number, require: true },
    product_type: { type: String, require: true, enum: ["Electronics", "Clothing", "Furniture"] },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, require: true },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: { type: String },
    material: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
}, {
    collection: "Clothings",
    timestamps: true
})

const electronicSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
}, {
    collection: "Electrics",
    timestamps: true
})

const furnitureSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
}, {
    collection: "Furniture",
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model("Electronic", electronicSchema),
    clothing: model("Clothing", clothingSchema),
    furniture: model("Furniture", furnitureSchema)
}

