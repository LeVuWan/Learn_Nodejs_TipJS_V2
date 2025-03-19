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
        privateKey: {
            type: String,
            require: true,
        },
        publicKey: {
            type: String,
            require: true,
        },
        refreshTokensUsed: {
            type: Array,
            default: []
        },
        refreshToken: {
            type: String, require: true
        }
    },
    {
        timeseries: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
