const { default: mongoose, Schema } = require("mongoose");

const DOCUMENT_NAME = "Inventory"
const COLLECTION_NAME = "Inventories";

var inventorySchema = new mongoose.Schema(
    {
        inven_product_id: { type: Schema.Types.ObjectId, ref: "Product" },
        inven_location: { type: String, default: "unKnow" },
        inven_stock: { type: Number, require: true },
        inven_shop_id: { type: Schema.Types.ObjectId, ref: "shop" },
        iven_reservations: { type: Array, default: [] }
    },
    {
        timeseries: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);
