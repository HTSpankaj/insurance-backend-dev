const express = require("express");
const {
    createCategoryController,
    getCategoriesController,
    getCategoriesWithSubCategoriesController,
    getCategoryListWithProductCountsController,
    activeInactiveCategoryController,
} = require("../../../presentation/controller/category/category.controller");
const { authenticateToken } = require("../../../middleware/auth");
const router = express.Router();

router.post("/", authenticateToken, createCategoryController);
router.put("/active-inactive-category", authenticateToken, activeInactiveCategoryController);
router.get("/", getCategoriesController);
router.get("/get-categories-with-sub-categories", getCategoriesWithSubCategoriesController);
router.get("/get-categories-with-product-count", getCategoryListWithProductCountsController);

module.exports = router;
