const { Types } = require("mongoose");
const keyTokenSchema = require("../models/keyToken.model")

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken };
            const options = { upsert: true, new: true };
            const foundKey = await keyTokenSchema.findOne({ user: userId })

            const tokens = await keyTokenSchema.findOneAndUpdate({ user: userId }, update, options);

            return tokens?.publicKey || null;
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenSchema.findOne({ user: userId }).lean()
    }

    static removeById = async (id) => {
        return await keyTokenSchema.findByIdAndDelete(id)
    }

    static findByRefreshTokenUsed = async ({ refreshToken }) => {
        return await keyTokenSchema.findOne({ refreshTokensUsed: { $in: [refreshToken] } }).lean();

    }

    static findKeyByRefreshToken = async ({ refreshToken }) => {
        return await keyTokenSchema.findOne({ refreshToken: refreshToken })
    }

    static deleteKey = async ({ userId }) => {
        console.log("Check userId in deleteKey: ", userId);
        const result = await keyTokenSchema.deleteOne({ user: userId });
        if (result.deletedCount === 0) {
            console.log(`Không tìm thấy token nào cho userId: ${userId}`);
            return { message: "Không có dữ liệu nào để xóa", success: false };
        }
        return result;
    };
}

module.exports = KeyTokenService;
