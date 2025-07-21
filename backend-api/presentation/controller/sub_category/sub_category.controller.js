var { supabaseInstance } = require("../../../supabase-db/index.js");
const SubCategoryService = require("../../../application/services/sub_category/sub_category.service");

const subCategoryService = new SubCategoryService(supabaseInstance);

exports.createSubCategoryController = async (req, res) => {
    /*
    #swagger.tags = ['SubCategory']
    #swagger.description = 'Create a new sub-category'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['title'] = { in: 'formData', type: 'string', required: true, description: 'Title of the subcategory' }
    #swagger.parameters['description'] = { in: 'formData', type: 'string', required: true, description: 'Description of the subcategory' }
    #swagger.parameters['category_id'] = { in: 'formData', type: 'string', required: true, description: 'Id of the category' }
    #swagger.parameters['file'] = { in: 'formData', type: 'file', required: true, description: 'subcategory image' }
  */
    try {
        const { title, description, category_id } = req.body;
        const file = req.files?.file?.[0];
        const created_by_user_id = res?.locals?.tokenData?.user_id;

        const result = await subCategoryService.createSubCategory(
            title,
            description,
            category_id,
            created_by_user_id,
            file,
        );
        return res.status(result.success ? 201 : 500).json(result);
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
    #swagger.parameters['is_all'] = {
        in: 'query',
        description: 'Get all sub-categories',
        required: false,
        type: 'boolean'
    }
    #swagger.parameters['page_number'] = {
        in: 'query',
        description: 'Page number (default: 1)',
        required: false,
        type: 'integer'
    }
    #swagger.parameters['limit'] = {
        in: 'query',
        description: 'Number of records per page (default: 10)',
        required: false,
        type: 'integer'
    }
  */
    try {
        const id = req.params.id;
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const is_all = req?.query?.is_all == "true";

        const result = await subCategoryService.getSubCategories(id, pageNumber, limit, is_all);
        return res.status(result.success ? 200 : 500).json(result);
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
        return res.status(result.success ? 200 : 500).json(result);
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
    #swagger.parameters['is_all'] = {
        in: 'query',
        description: 'Get all categories',
        required: false,
        type: 'boolean'
    }
    #swagger.parameters['page_number'] = {
        in: 'query',
        description: 'Page number (default: 1)',
        required: false,
        type: 'integer'
    }
    #swagger.parameters['limit'] = {
        in: 'query',
        description: 'Number of records per page (default: 10)',
        required: false,
        type: 'integer'
    }
    #swagger.parameters['search'] = {
        in: 'query',
        description: 'Search keyword',
        required: false,
        type: 'string'
    }
  */
    try {
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const is_all = req?.query?.is_all == "true";
        const search = req?.query?.search;

        const result = await subCategoryService.getAllSubCategoriesService(
            pageNumber,
            limit,
            is_all,
            search,
        );
        return res.status(result.success ? 200 : 500).json(result);
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
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['sub_category_id'] = { in: 'formData', type: 'string', required: true, description: 'Id of the subcategory' }
    #swagger.parameters['title'] = { in: 'formData', type: 'string', required: true, description: 'Title of the subcategory' }
    #swagger.parameters['description'] = { in: 'formData', type: 'string', required: true, description: 'Description of the subcategory' }
    #swagger.parameters['category_id'] = { in: 'formData', type: 'string', required: true, description: 'Id of the category' }
    #swagger.parameters['file'] = { in: 'formData', type: 'file', required: true, description: 'subcategory image' }
  */
    try {
        const { sub_category_id, category_id, title, description } = req.body;
        const file = req.files?.file?.[0];

        const result = await subCategoryService.updateSubCategoryService(
            sub_category_id,
            category_id,
            title,
            description,
            file,
        );
        return res.status(result.success ? 200 : 500).json(result);
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
        return res.status(result.success ? 200 : 500).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};
