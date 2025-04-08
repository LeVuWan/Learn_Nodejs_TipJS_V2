const { default: mongoose, Schema } = require("mongoose");

const DOCUMENT_NAME = "Cart"
const COLLECTION_NAME = "Carts";

var cartSchema = new mongoose.Schema(
    {
        cart_state: {
            type: String,
            require: true,
            enum: ["active", "completed", "failed", "pending"],
            default: "active"
        },
        cart_products: {
            type: Array,
            require: true,
            default: []
        },
        cart_count_product: {
            type: Number,
            require: true
        },
        cart_userId: { type: Number, require: true },
    },
    {
        timeseries: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);