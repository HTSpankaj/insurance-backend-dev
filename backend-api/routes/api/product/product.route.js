const express = require("express");
const {
    addProductController,
} = require("../../../presentation/controller/product/product.controller");
const upload = require("../../../middleware/multer.middleware");
const {
    getProductListByCompanyIdController,
} = require("../../../presentation/controller/product/product.controller");
const router = express.Router();

router.post("/add-product", upload, addProductController);
router.get("/get-product-list-by-company-id/:id", getProductListByCompanyIdController);

module.exports = router;
