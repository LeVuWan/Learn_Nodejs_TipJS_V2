const { default: mongoose, Schema } = require("mongoose");

const DOCUMENT_NAME = "ApiKey"
const COLLECTION_NAME = "ApiKeys";

var apiKeySchema = new mongoose.Schema(
    {
        key: {
            type: String,
            require: true,
            unique: true
        },
        status: {
            type: Boolean,
            default: true
        },
        permissions: {
            type: [String],
            require: true,
            enum: ['0000', '1111', '2222']
        }
    },
    {
        timeseries: true,
        collection: COLLECTION_NAME,
    }
)

module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);