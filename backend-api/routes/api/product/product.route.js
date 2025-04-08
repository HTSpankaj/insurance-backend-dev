const express = require("express");
const {
    addProductController,
    getProductsByCategoryIdController,
} = require("../../../presentation/controller/product/product.controller");
const upload = require("../../../middleware/multer.middleware");
const {
    getProductListByCompanyIdController,
} = require("../../../presentation/controller/product/product.controller");
const router = express.Router();

router.post("/add-product", upload, addProductController);
router.get("/get-product-list-by-company-id/:id", getProductListByCompanyIdController);
router.get("/get-products-by-category-id", getProductsByCategoryIdController);

module.exports = router;
