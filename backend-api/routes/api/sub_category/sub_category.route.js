const express = require("express");
const {
    createSubCategoryController,
    getSubCategoriesController,
    activeInactiveSubCategoryController,
    getAllSubCategoriesController,
    updateSubCategoryController,
    deleteSubCategoryController,
} = require("../../../presentation/controller/sub_category/sub_category.controller");
const { authenticateToken } = require("../../../middleware/auth");
const router = express.Router();

router.post("/", authenticateToken, createSubCategoryController);
router.put("/active-inactive-sub-category", authenticateToken, activeInactiveSubCategoryController);
router.put("/update-sub-category", authenticateToken, updateSubCategoryController);
router.delete("/delete-sub-category", authenticateToken, deleteSubCategoryController);
router.get("/get-all-sub-categories", getAllSubCategoriesController);
router.get("/get-sub-categories-by-category/:id", getSubCategoriesController);

module.exports = router;
