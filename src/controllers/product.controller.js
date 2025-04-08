const ProductFactory = require("../services/product.service");
const { SuccessRespone, OK, CREATED } = require("../core/success.response")

class ProductController {
    createProduct = async (req, res, next) => {
        const payload = req.body;
        const result = await ProductFactory.createProduct({
            payload: {
                ...payload,
                product_shop: req.user.userId,
            }
        });
        new CREATED({
            message: "Create Product Success",
            metadata: result
        }).send(res)
    }
}

module.exports = new ProductController();
