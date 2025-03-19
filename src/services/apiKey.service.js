const apiKeySchema = require("../models/apiKey.model")
const crypto = require("crypto")

const findById = async (key) => {
    // const newObjKey = await apiKeySchema.create({
    //     key: crypto.randomBytes(64).toString('hex'),
    //     permissions: ['0000']
    // })
    // console.log("Check newObjKey: ", newObjKey);

    const objKey = await apiKeySchema.findOne({
        key: key, status: true
    }).lean()
    return objKey
}

module.exports = {
    findById
}