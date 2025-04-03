var { supabaseInstance } = require("../../../supabase-db/index.js");
const SubCategoryService = require("../../../application/services/sub_category/sub_category.service");

const subCategoryService = new SubCategoryService(supabaseInstance);

exports.createSubCategoryController = async (req, res) => {
    /*
    #swagger.tags = ['SubCategory']
    #swagger.description = 'Create a new sub-category'
  */
    try {
        const { title, description, category_id } = req.body;
        // Assuming created_by_user_id comes from authentication middleware
        const created_by_user_id = res?.locals?.tokenData?.user_id; //up
        if (!created_by_user_id) {
            return res.status(401).json({
                success: false,
                error: { message: "Unauthorized: User ID not found" },
            });
        }
        const result = await subCategoryService.createSubCategory(
            title,
            description,
            category_id,
            created_by_user_id,
        );
        return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getSubCategoriesController = async (req, res) => {
    /*
    #swagger.tags = ['SubCategory']
    #swagger.description = 'Get sub-categories with pagination'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'category Primary Id (uuid)',
        required: true,
        type: 'string',
        format: 'uuid'
    }
  */
    try {
        const id = req.params.id;
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await subCategoryService.getSubCategories(id, pageNumber, limit);
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.activeInactiveSubCategoryController = async (req, res) => {
    /*
    #swagger.tags = ['SubCategory']
    #swagger.description = 'Active/Inactive subcategory.'
    #swagger.parameters['body'] ={
        in: 'body',
        schema: {
          "sub_category_id": "",
          "is_active": true,
        }
    }
  */
    try {
        const { sub_category_id, is_active } = req.body;
        const result = await subCategoryService.activeInactiveSubCategoryService(
            sub_category_id,
            is_active,
        );
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.getAllSubCategoriesController = async (req, res) => {
    /*
    #swagger.tags = ['SubCategory']
    #swagger.description = 'Get all sub-categories'
  */
    try {
        const result = await subCategoryService.getAllSubCategoriesService();
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.updateSubCategoryController = async (req, res) => {
    /*
    #swagger.tags = ['SubCategory']
    #swagger.description = 'Update sub-category'
    #swagger.parameters['body'] ={
        in: 'body',
        schema: {
          "sub_category_id": "",
          "category_id": "",
          "title": "",
          "description": "",
        }
    }
  */
    try {
        const { sub_category_id, category_id, title, description } = req.body;
        const result = await subCategoryService.updateSubCategoryService(
            sub_category_id,
            category_id,
            title,
            description,
        );
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.deleteSubCategoryController = async (req, res) => {
    /*
    #swagger.tags = ['SubCategory']
    #swagger.description = 'Delete sub-category'
    #swagger.parameters['body'] ={
        in: 'body',
        schema: {
          "sub_category_id": "",
        }
    }
  */
    try {
        const { sub_category_id } = req.body;
        const result = await subCategoryService.deleteSubCategoryService(sub_category_id);
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};
