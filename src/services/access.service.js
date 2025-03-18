const shopSchema = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service.service");
const { createTokenPair } = require("../auth/auth.utils");
const { getInfoData } = require("../utils");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            const hodelShop = await shopSchema
                .findOne({
                    email: email,
                })
                .lean();

            if (hodelShop) {
                return {
                    code: "xxxx",
                    message: "Shop already registed!",
                }
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await shopSchema.create({
                email: email,
                password: passwordHash,
                name: name,
                role: [RoleShop.SHOP],
            })

            if (newShop) {
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                const keyStore = await KeyTokenService.createKeyToken({ userId: newShop._id, publicKey: publicKey, privateKey: privateKey });

                if (!keyStore) {
                    return {
                        code: "xxxx",
                        message: "publicKeyString error"
                    }
                }

                const tokens = await createTokenPair({ userId: newShop._id, email: newShop.email }, publicKey, privateKey);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }
        } catch (error) {
            console.log("Check error: ", error);

            return {
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
    };
}

module.exports = AccessService;
