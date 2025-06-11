const express = require("express");
const {
    addProductController,
    getProductsByCategoryIdController,
    getProductByProductIdController,
    deleteProductByIdController,
    updateProductController,
} = require("../../../presentation/controller/product/product.controller");
const { upload } = require("../../../middleware/multer.middleware");
const {
    getProductListByCompanyIdController,
} = require("../../../presentation/controller/product/product.controller");
const router = express.Router();

router.post("/add-product", upload, addProductController);
router.put("/update-product", upload, updateProductController);
router.get("/get-product-list-by-company-id/:id", getProductListByCompanyIdController);
router.get("/get-products-by-category-id", getProductsByCategoryIdController);
router.get("/get-product-by-product-id/:product_id", getProductByProductIdController);
router.delete("/delete-product/:product_id", deleteProductByIdController);

module.exports = router;
