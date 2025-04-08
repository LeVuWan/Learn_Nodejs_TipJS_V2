const { default: mongoose, Schema } = require("mongoose");

const DOCUMENT_NAME = "Discount"
const COLLECTION_NAME = "Discounts";

var discountSchema = new mongoose.Schema(
    {
        discount_name: { type: String, require: true },
        discount_description: { type: String, require: true },
        discount_type: { type: String, default: "fixed_amount" },
        discount_value: { type: Number, require: true },
        discount_code: { type: String, require: true },
        discount_start_date: { type: Date, require: true },
        discount_end_date: { type: Date, require: true },
        discount_use_count: { type: Number, require: true },
        discount_max_use: { type: Number, require: true },
        discount_user_used: { type: Array, require: true },
        discount_max_use_per_user: { type: Number, require: true },
        discount_min_order_value: { type: Number, require: true },
        discount_shop_id: { type: Schema.Types.ObjectId, ref: "shop", require: true },
        discount_is_active: { type: Boolean, default: true },
        discount_applies_to: { type: String, require: true, enum: ['all', 'specific'] },
        discount_product_id: { type: Array, default: [] },
    },
    {
        timeseries: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
