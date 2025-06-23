const CategoryService = require("../../../application/services/category/category.service");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const categoryService = new CategoryService(supabaseInstance);

exports.createCategoryController = async (req, res) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Create a new category'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['title'] = { in: 'formData', type: 'string', required: true, description: 'Title of the category' }
    #swagger.parameters['description'] = { in: 'formData', type: 'string', required: true, description: 'Description of the category' }
    #swagger.parameters['is_lead_add_without_product'] = { in: 'formData', type: 'boolean', required: true, description: 'Is lead add without product' } 
    #swagger.parameters['file'] = { in: 'formData', type: 'file', required: true, description: 'category image' }
  */
    try {
        const { title, description, is_lead_add_without_product } = req.body;
        const file = req.files?.file?.[0];
        const created_by_user_id = res?.locals?.tokenData?.user_id;

        const result = await categoryService.createCategory(
            title,
            description,
            is_lead_add_without_product,
            file,
            created_by_user_id,
        );
        return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.getCategoriesController = async (req, res) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get categories with pagination'
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
    #swagger.parameters['is_lead_add_without_product'] = {
        in: 'query',
        description: 'Is lead add without product',
        required: false,
        type: 'boolean'
    }
    #swagger.parameters['is_active'] = {
        in: 'query',
        description: 'Is active',
        required: false,
        type: 'boolean'
    }
  */
    try {
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const is_all = req?.query?.is_all == "true";

        let is_lead_add_without_product = null;
        if (req.query?.is_lead_add_without_product === "true") {
            is_lead_add_without_product = true;
        } else if (req.query?.is_lead_add_without_product === "false") {
            is_lead_add_without_product = false;
        }

        let is_active = null;
        if (req.query?.is_active === "true") {
            is_active = true;
        } else if (req.query?.is_active === "false") {
            is_active = false;
        }

        const result = await categoryService.getCategories(
            pageNumber,
            limit,
            is_all,
            is_lead_add_without_product,
            is_active,
        );
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.getCategoriesWithSubCategoriesController = async (req, res) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get categories with pagination'
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
    #swagger.parameters['is_lead_add_without_product'] = {
        in: 'query',
        description: 'Is lead add without product',
        required: false,
        type: 'boolean'
    }
    #swagger.parameters['is_active'] = {
        in: 'query',
        description: 'Is active',
        required: false,
        type: 'boolean'
    }
  */
    try {
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const is_all = req?.query?.is_all == "true";

        let is_lead_add_without_product = null;
        if (req?.query?.is_lead_add_without_product == "true") {
            is_lead_add_without_product = true;
        } else if (req?.query?.is_lead_add_without_product == "false") {
            is_lead_add_without_product = false;
        }

        let is_active = null;
        if (req?.query?.is_active == "true") {
            is_active = true;
        } else if (req?.query?.is_active == "false") {
            is_active = false;
        }

        const result = await categoryService.getCategoriesWithSubCategories(
            pageNumber,
            limit,
            is_all,
            is_lead_add_without_product,
            is_active,
        );
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.getCategoryListWithProductCountsController = async (req, res) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Get categories with product count'
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

        const result = await categoryService.getCategoryListWithProductCounts(
            pageNumber,
            limit,
            is_all,
            search,
        );
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.activeInactiveCategoryController = async (req, res) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Active/Inactive category.'
    #swagger.parameters['body'] ={
        in: 'body',
        schema: {
          "category_id": "",
          "is_active": true,
        }
    }
  */
    try {
        const { category_id, is_active } = req.body;
        const result = await categoryService.activeInactiveCategoryService(category_id, is_active);
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.updateCategoryController = async (req, res) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Update category.'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['category_id'] = { in: 'formData', type: 'string', required: true, description: 'Id of the category' }
    #swagger.parameters['title'] = { in: 'formData', type: 'string', required: true, description: 'Title of the category' }
    #swagger.parameters['description'] = { in: 'formData', type: 'string', required: true, description: 'Description of the category' }
    #swagger.parameters['is_lead_add_without_product'] = { in: 'formData', type: 'boolean', required: true, description: 'Is lead add without product' } 
    #swagger.parameters['file'] = { in: 'formData', type: 'file', required: true, description: 'category image' }
  
  */
    try {
        const { category_id, title, description } = req.body;
        const file = req.files?.file?.[0];
        let is_lead_add_without_product = null;
        if (req.body?.is_lead_add_without_product === "true") {
            is_lead_add_without_product = true;
        } else if (req.body?.is_lead_add_without_product === "false") {
            is_lead_add_without_product = false;
        }

        const result = await categoryService.updateCategoryService(
            category_id,
            title,
            description,
            is_lead_add_without_product,
            file,
        );
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.deleteCategoryController = async (req, res) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Delete category.'
    #swagger.parameters['body'] ={
        in: 'body',
        schema: {
          "category_id": "",
        }
    }
  */
    try {
        const { category_id } = req.body;
        const result = await categoryService.deleteCategoryService(category_id);
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};
