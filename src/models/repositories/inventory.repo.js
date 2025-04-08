const inventory = require("../inventory.model");

const insertIntory = async ({ productId, shopId, stock, location = "unKnow" }) => {
    return await inventory.create({
        inven_product_id: productId,
        inven_location: location,
        inven_shop_id: shopId,
        inven_stock: stock
    })
}

module.exports = {
    insertIntory
}