const express = require("express");
const {
    createCategoryController,
    getCategoriesController,
    getCategoriesWithSubCategoriesController,
    getCategoryListWithProductCountsController,
    activeInactiveCategoryController,
    updateCategoryController,
    deleteCategoryController,
} = require("../../../presentation/controller/category/category.controller");
const { authenticateToken } = require("../../../middleware/auth");
const router = express.Router();

router.post("/", authenticateToken, createCategoryController);
router.put("/active-inactive-category", authenticateToken, activeInactiveCategoryController);
router.put("/update-category", authenticateToken, updateCategoryController);
router.delete("/delete-category", authenticateToken, deleteCategoryController);
router.get("/", getCategoriesController);
router.get("/get-categories-with-sub-categories", getCategoriesWithSubCategoriesController);
router.get("/get-categories-with-product-count", getCategoryListWithProductCountsController);

module.exports = router;
