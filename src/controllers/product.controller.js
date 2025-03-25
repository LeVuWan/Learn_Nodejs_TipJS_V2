const ProductFactory = require("../services/product.service");
const { SuccessRespone, OK, CREATED } = require("../core/success.response")

class ProductController {
    createProduct = async (req, res, next) => {
        const productType = req.body.product_type;
        const payload = req.body;
        const result = await ProductFactory.createProduct(productType, { ...payload, product_shop: req.user.userId });
        new CREATED({
            message: "Create Product Success",
            metadata: result
        }).send(res)
    }

    findAllDraftsForShop = async (req, res, next) => {
        const result = await ProductFactory.findAllDraftsForShop({ product_shop: req.user.userId });
        new OK({
            message: "Get list product success",
            metadata: result
        }).send(res)
    }

    findAllPublishForShop = async (req, res, next) => {
        const result = await ProductFactory.findAllPublishForShop({ product_shop: req.user.userId })
        new OK({
            message: "Get list product success",
            metadata: result
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        const result = await ProductFactory.publishProductByShop({ product_id: req.params.id, product_shop: req.user.userId });
        new SuccessRespone({
            message: "Update success",
            metadata: result
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        const result = await ProductFactory.unPublishProductByShop({ product_id: req.params.id, product_shop: req.user.userId });
        new SuccessRespone({
            message: "Update success",
            metadata: result
        }).send(res)
    }

    searchProduct = async (req, res, next) => {
        const keySearch = req.params.key; // Lấy giá trị từ URL params
        const result = await ProductFactory.searchProduct({ keySearch });
        new OK({
            message: "Get list product success",
            metadata: result
        }).send(res)
    }

    findAllProduct = async (req, res, next) => {
        const { limit, sort, page, filter } = req.query;

        const result = await ProductFactory.findAllProduct({
            limit: limit,
            sort: sort,
            page: page,
            filter: filter
        });

        new OK({
            message: "Get list product success",
            metadata: result
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        const result = await ProductFactory.findProduct({ shop_id: req.params.id, unselect: "__v" });
        new OK({
            message: "Get product success",
            metadata: result
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        const result = await ProductFactory.findProduct({ shop_id: req.params.id, unselect: "__v" });
        new OK({
            message: "Get product success",
            metadata: result
        }).send(res)
    }

    updateProduct = async (req, res, next) => {
        const productType = req.body.product_type;
        const payload = req.body;
        const result = await ProductFactory.updateProduct(productType, { ...payload, product_shop: req.user.userId }, req.params.id);
        new SuccessRespone({
            message: "Update Product Success",
            metadata: result
        }).send(res)
    }
}

module.exports = new ProductController();
