const apiKeyModel = require("../models/apiKey.model");
const { findById } = require("../services/apiKey.service");
const crypto = require("crypto");

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization"
}

const apiKey = async (req, res, next) => {
    try {
        // const newApiKey = await apiKeyModel.create({
        //     key: crypto.randomBytes(64).toString("hex"),
        //     permissions: ["0000"],
        // })
        // console.log("Check newApiKey: ", newApiKey);

        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: "Forbidden Error"
            })
        }
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden Error"
            })
        }

        req.objKey = objKey;
        return next()
    } catch (error) {
        next(error)
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permisstion denied"
            })
        }
        const validPermisstion = req.objKey.permissions.includes(permission)
        if (!validPermisstion) {
            return res.status(403).json({
                message: "Permisstion denied"
            })
        }
        return next();
    }
}


module.exports = {
    apiKey,
    permission,
}