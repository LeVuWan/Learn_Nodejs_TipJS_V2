const { default: mongoose, Schema } = require("mongoose");

const DOCUMENT_NAME = "Key"
const COLLECTION_NAME = "Keys";

var keyTokenSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.ObjectId,
            require: true,
            ref: "Shop"
        },
        publicKey: {
            type: String,
            require: true,
        },
        refreshToken: {
            type: Array,
            default: []
        }
    },
    {
        timeseries: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
