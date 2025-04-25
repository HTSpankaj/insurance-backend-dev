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
const {
    uploadFileForCategoryAndSubCategoryMulterMiddleware,
} = require("../../../middleware/multer.middleware");
const router = express.Router();

router.post(
    "/",
    authenticateToken,
    uploadFileForCategoryAndSubCategoryMulterMiddleware,
    createCategoryController,
);
router.put(
    "/update-category",
    authenticateToken,
    uploadFileForCategoryAndSubCategoryMulterMiddleware,
    updateCategoryController,
);

router.put("/active-inactive-category", authenticateToken, activeInactiveCategoryController);
router.delete("/delete-category", authenticateToken, deleteCategoryController);
router.get("/", getCategoriesController);
router.get("/get-categories-with-sub-categories", getCategoriesWithSubCategoriesController);
router.get("/get-categories-with-product-count", getCategoryListWithProductCountsController);

module.exports = router;
