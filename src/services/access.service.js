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
                const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: "pkcs1",
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: "pkcs1",
                        format: 'pem'
                    }
                })
                // const privateKey = crypto.getRandomValues(64).toString('hex')
                // const publicKey = crypto.getRandomValues(64).toString('hex')
                //Public key cryto standars !

                const publicKeyString = await KeyTokenService.createKeyToken({ userId: newShop._id, publicKey: publicKey });

                if (!publicKeyString) {
                    return {
                        code: "xxxx",
                        message: "publicKeyString error"
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString);

                const tokens = await createTokenPair({ userId: newShop._id, email: newShop.email }, publicKeyObject, privateKey);

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
            return {
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
    };
}

module.exports = AccessService;
