/*const { CategoryService } = require("../../../application/services/category/category.service.js");
var { supabaseInstance } = require("../../../supabase-db/index.js");

const categorySService = new CategoryService(supabaseInstance);
exports.addCategoryController = async (req, res) => {
    /*
    #swagger.tags = ['Category']

    #swagger.description = 'Add Category'
    #swagger.parameters['body'] ={
        in: 'body',
        description: 'Add User',
        schema: {
          "title": "",
          "description": "",
        }
    }
  */

/* {
        const payload = {
            title: req.body.title,
            description: req.body.description,
        };
        const serviceResponse = await categoryService.addCategoryService(payload);

        return res.status(200).json({
            success: true,
            message: "user profile fetch successfully",
            data: serviceResponse,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error || "Something went wrong!" });
    }
}; */

const CategoryService = require("../../../application/services/category/category.service");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const categoryService = new CategoryService(supabaseInstance);

exports.createCategoryController = async (req, res) => {
    /*
    #swagger.tags = ['Category']
    #swagger.description = 'Create a new category'
  */
    try {
        const { title, description } = req.body;
        const result = await categoryService.createCategory(title, description);
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
  */
    try {
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const is_all = req?.query?.is_all == "true";
        const result = await categoryService.getCategories(pageNumber, limit, is_all);
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
  */
    try {
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await categoryService.getCategoriesWithSubCategories(pageNumber, limit);
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
    #swagger.parameters['body'] ={
        in: 'body',
        schema: {
          "category_id": "",
          "title": "",
          "description": "",
        }
    }
  */
    try {
        const { category_id, title, description } = req.body;
        const result = await categoryService.updateCategoryService(category_id, title, description);
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
