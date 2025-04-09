const { convertToObjId } = require("../utils/index");
const { createUserCart } = require("../models/repositories/cart.repo");
const cartModel = require("../models/cart.model");

class CartService {
    static async addToCart({ userId, product = {} }) {
        const checkCart = await cartModel.findOne({
            cart_userId: convertToObjId(userId),
        });

        if (!checkCart) {
            return await createUserCart({ userId: userId, product: product });
        }

        if (!checkCart.cart_products.length) {
            checkCart.cart_products.unshift(product);
            return await checkCart.save();
        }

        return await createUserCart({ userId: userId, product: product });
    } 

    static async deleteUserCart({ userId, productId }) {
        const query = {
            cart_userId: userId,
            cart_state: "active",
        },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId,
                    },
                },
            };

        const deleteCart = await cartModel.updateOne(query, updateSet);
        return deleteCart;
    }

    static async getListCart({ userId }) {
        return await cartModel
            .find({
                cart_userId: userId,
            })
            .lean();
    }

    static async updateCart ({}) {
        
    }
}

module.exports = CartService;


