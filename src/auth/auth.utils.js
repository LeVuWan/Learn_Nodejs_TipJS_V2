const JWT = require("jsonwebtoken")
const { acyncHandle } = require("../helpers/acyncHandle")
const { findByUserId } = require("../services/keyToken.service")
const { AuthFailureError } = require("../core/error.response")

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
    CLIENT_ID: "x-client-id",
    REFRESHTOKEN: "refresh-token"
}


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "2d"
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "7d"
        });

        try {
            const decoded = JWT.verify(accessToken, publicKey, { algorithms: ["RS256"] });
            console.log("Check decoded: ", decoded);
        } catch (err) {
            console.error("Error verifying token:", err.message);
        }

        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};

const authentication = acyncHandle(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]

    if (!userId) throw AuthFailureError("Invalid Request");

    const keyStore = await findByUserId(userId);

    if (!keyStore) {
        throw new AuthFailureError("Invalid Request")
    }

    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.publicKey, { algorithms: ["RS256"] });
            if (userId !== decodeUser.userId) {
                throw AuthFailureError("Invalid UserId")
            }
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError("Access token expired")

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey, { algorithms: ["RS256"] });

        if (userId != decodeUser.userId) throw AuthFailureError("Invalid UserId")
        req.user = decodeUser;
        req.keyStore = keyStore;
        return next()
    } catch (error) {
        console.log("Check err: ", error);
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    console.log("Check decode : ", JWT.verify(token, keySecret, { algorithms: ["RS256"] }));

    return JWT.verify(token, keySecret, { algorithms: ["RS256"] });
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}