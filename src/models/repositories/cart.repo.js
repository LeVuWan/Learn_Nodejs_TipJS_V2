const cartModel = require("../../models/cart.model");
const createUserCart = async ({ userId, product }) => {
    let cart = await cartModel.findOneAndUpdate(query, updateSet, options)

    if (!cart) {
        cart = await cartModel.findOneAndUpdate(
            {
                cart_userId: userId,
                cart_state: "active"
            },
            {
                $push: {
                    cart_products: {
                        product_id: productId,
                        quantity: quantity
                    }
                }
            },
            { new: true, upsert: true }
        )
    }
    return cart

}

module.exports = {
    createUserCart
}