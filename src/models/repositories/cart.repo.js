const cartModel = require("../../models/cart.model");
const createUserCart = async ({ userId, product }) => {
    const { productId, quantity } = product
    const query = {
        cart_userId: userId,
        "cart_products.product_id": productId,
        cart_state: "active"
    }, updateSet = {
        $inc: {
            "cart_products.$.quantity": quantity
        }
    }, options = { new: true }

    return await cartModel.findOneAndUpdate(query, updateSet, options)
}

module.exports = {
    createUserCart
}