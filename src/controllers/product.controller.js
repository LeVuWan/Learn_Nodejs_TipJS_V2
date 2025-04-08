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

    updateProduct = async (req, res, next) => {
        const payload = req.body;
        const result = await ProductFactory.updateProduct({
            payload: {
                ...payload,
                product_shop: req.user.userId,
            },
            productId: req.params.id
        });
        new SuccessRespone({
            message: "Update Product Success",
            metadata: result
        }).send(res)
    }

    findAllDraftsForShop = async (req, res, next) => {
        const result = await ProductFactory.findAllDraftsForShop({ product_shop: req.user.userId });
        new OK({
            message: "Get product success",
            metadata: result
        }).send(res)
    }

    findAllPublishForShop = async (req, res, next) => {
        const result = await ProductFactory.findAllPublishForShop({ product_shop: req.user.userId });
        new OK({
            message: "Get product success",
            metadata: result
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        const result = await ProductFactory.publishProductByShop({ product_shop: req.user.userId, product_id: req.params.id });
        new SuccessRespone({
            message: "Publish product success",
            metadata: result
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        const result = await ProductFactory.unPublishProductByShop({ product_shop: req.user.userId, product_id: req.params.id });
        new SuccessRespone({
            message: "UnPublish product success",
            metadata: result
        }).send(res)
    }

    searchProduct = async (req, res, next) => {
        const result = await ProductFactory.searchProduct({ keySearch: req.params.keySearch });
        new SuccessRespone({
            message: "Search product success",
            metadata: result
        }).send(res)
    }

    findAllProduct = async (req, res, next) => {
        const result = await ProductFactory.findAllProduct({});
        new OK({
            message: "Get product success",
            metadata: result
        }).send(res)
    }

    findOneProduct = async (req, res, next) => {
        const result = await ProductFactory.findOneProduct({ productId: req.params.id });
        new OK({
            message: "Get product success",
            metadata: result
        }).send(res)
    }
}

module.exports = new ProductController();
