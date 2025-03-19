const shopSchema = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/auth.utils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("../services/shop.service")

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

class AccessService {
    static login = async ({ email, password, refreshToken = null }) => {
        try {
            const foundShop = await findByEmail({ email: email });

            if (!foundShop) {
                throw new BadRequestError("Shop already registered!")
            }

            const match = await bcrypt.compare(password.toString(), foundShop.password);

            if (!match) {
                throw new AuthFailureError("Authentication error")
            }

            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });

            const tokens = await createTokenPair({ userId: foundShop._id, email: foundShop.email }, publicKey, privateKey);

            await KeyTokenService.createKeyToken({ userId: foundShop._id, refreshToken: tokens.refreshToken, privateKey, publicKey })

            return {
                metadata: {
                    shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
                    tokens
                }
            }
        } catch (error) {
            console.log("Check error: ", error.message);

            return {
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
    }

    static signUp = async ({ name, email, password }) => {
        try {
            const hodelShop = await shopSchema
                .findOne({
                    email: email,
                })
                .lean();

            if (hodelShop) {
                throw new BadRequestError("Shop already registed!")
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await shopSchema.create({
                email: email,
                password: passwordHash,
                name: name,
                role: [RoleShop.SHOP],
            })

            if (newShop) {
                const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 2048, // Độ dài khóa
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    }
                });

                const keyStore = await KeyTokenService.createKeyToken({ userId: newShop._id, publicKey: publicKey, privateKey: privateKey });

                if (!keyStore) {
                    throw new BadRequestError("publicKeyString error")
                }

                const tokens = await createTokenPair({ userId: newShop._id, email: newShop.email }, publicKey, privateKey);

                return {
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

    static logout = async ({ keyStore }) => {
        const delKey = await KeyTokenService.removeById(keyStore._id);
        return {
            metadata: {
                shop: getInfoData({ fileds: ['_id', 'user'], object: delKey }),
            }
        }
    }

    static handleRefreshToken = async ({ refreshToken }) => {
        try {
            const foundToken = await KeyTokenService.findByRefreshTokenUsed({ refreshToken: refreshToken });
            if (foundToken) {
                const { userId, email } = await verifyJWT(refreshToken, foundToken.publicKey);
                await KeyTokenService.deleteKey({ userId: userId });
                throw new ForbiddenError("Something wrong happend !! Pls relogin")
            }

            const holderKey = await KeyTokenService.findKeyByRefreshToken({ refreshToken: refreshToken });
            if (!holderKey) {
                throw new BadRequestError("Shop not register #1")
            }

            const { userId, email } = await verifyJWT(refreshToken, holderKey.publicKey);

            console.log(`Check userId ${userId}, ${email} #2`);

            const foundShop = await findByEmail({ email: email });

            if (!foundShop) {
                throw new BadRequestError("Shop not register #2")
            }

            const tokens = await createTokenPair({ userId, email }, holderKey.publicKey, holderKey.privateKey);

            holderKey.refreshTokensUsed.push(refreshToken);

            holderKey.refreshToken = tokens.refreshToken;
            await holderKey.save()

            return {
                metadata: {
                    shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
                    tokens
                }
            }
        } catch (error) {
            console.log("Check error: ", error);
            return {
                code: "xxx",
                message: error.message,
                status: "error",
            };
        }
    }
}

module.exports = AccessService;
