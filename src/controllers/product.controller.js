const ProductFactory = require("../services/product.service");
const { SuccessRespone, OK } = require("../core/success.response")

class ProductController {
    createProduct = async (req, res, next) => {
        const productType = req.body.product_type;
        const payload = req.body;
        const result = await ProductFactory.createProduct(productType, { ...payload, product_shop: req.user.userId });
        new OK({
            message: "Create Product Success",
            metadata: result
        }).send(res)
    }
}

module.exports = new ProductController();
