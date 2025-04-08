const { supabaseInstance } = require("../../../supabase-db/index.js");
const ProductService = require("../../../application/services/product/product.service.js");

const productService = new ProductService(supabaseInstance);

exports.addProductController = async (req, res) => {
    /*
    #swagger.tags = ['Product']
    #swagger.description = 'Add a new product'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['product_name'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'Name of the product' 
    }
    #swagger.parameters['sub_category_id'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'UUID of the subcategory' 
    }
    #swagger.parameters['company_id'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'UUID of the company' 
    }
    #swagger.parameters['description'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'Description of the product' 
    }
    #swagger.parameters['financial_description'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'Financial description of the product' 
    }
    #swagger.parameters['product_brochure_url'] = { 
      in: 'formData', 
      type: 'file', 
      required: true, 
      description: 'Product brochure file (PDF only)' 
    }
    #swagger.parameters['promotional_video_url'] = { 
      in: 'formData', 
      type: 'file', 
      required: true, 
      description: 'Promotional video file (MP4, AVI, MPEG)' 
    }
    #swagger.parameters['promotional_image_url'] = { 
      in: 'formData', 
      type: 'file', 
      required: true, 
      description: 'Promotional image file (JPEG, PNG, GIF)' 
    }
    */
    try {
        const { product_name, sub_category_id, company_id, description, financial_description } =
            req.body;

        const product_brochure_file = req.files?.product_brochure_url?.[0];
        const promotional_video_file = req.files?.promotional_video_url?.[0];
        const promotional_image_file = req.files?.promotional_image_url?.[0];

        // Validation
        if (!product_name || product_name.trim().length < 2) {
            throw new Error("Product name must be a string with at least 2 characters");
        }
        if (
            !sub_category_id ||
            !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
                sub_category_id,
            )
        ) {
            throw new Error("Invalid sub_category_id (must be UUID)");
        }
        if (
            !company_id ||
            !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
                company_id,
            )
        ) {
            throw new Error("Invalid company_id (must be UUID)");
        }
        if (!description || description.trim().length < 5) {
            throw new Error("Description must be a string with at least 5 characters");
        }
        if (!financial_description || financial_description.trim().length < 5) {
            throw new Error("Financial description must be a string with at least 5 characters");
        }

        const validateFile = (file, fieldName, allowedTypes) => {
            if (!file) throw new Error(`${fieldName} is required`);
            if (!allowedTypes.includes(file.mimetype)) {
                throw new Error(`${fieldName} must be ${allowedTypes.join(", ")}`);
            }
        };

        validateFile(product_brochure_file, "product_brochure_url", ["application/pdf"]);
        validateFile(promotional_video_file, "promotional_video_url", [
            "video/mp4",
            "video/avi",
            "video/mpeg",
        ]);
        validateFile(promotional_image_file, "promotional_image_url", [
            "image/jpeg",
            "image/png",
            "image/gif",
        ]);

        const result = await productService.addProduct(
            product_name,
            sub_category_id,
            company_id,
            description,
            financial_description,
            product_brochure_file,
            promotional_video_file,
            promotional_image_file,
        );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getProductListByCompanyIdController = async (req, res) => {
    /*
    #swagger.tags = ['Product']
    #swagger.description = 'Get Product List by Company ID'
    #swagger.parameters['id'] = { 
      in: 'path', 
      type: 'string', 
      required: true, 
      description: 'Company ID (UUID)' 
    }
    #swagger.parameters['page_number'] = { 
      in: 'query', 
      type: 'integer', 
      required: false, 
      description: 'Page number (default: 1)' 
    }
    #swagger.parameters['limit'] = { 
      in: 'query', 
      type: 'integer', 
      required: false, 
      description: 'Number of records per page (default: 10)' 
    }
    #swagger.parameters['search'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Search term for product name' 
    }
    #swagger.parameters['category_id'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Category ID (UUID)' 
    }
    #swagger.parameters['sub_category_id'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Sub-Category ID (UUID)' 
    }
    */
    try {
        const { id } = req.params;
        const { page_number, limit, search, category_id, sub_category_id } = req.query;

        // Validation
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!id || !uuidRegex.test(id)) {
            throw new Error("Company ID must be a valid UUID");
        }

        const pageNumber = parseInt(page_number) || 1;
        const limitPerPage = parseInt(limit) || 10;

        if (pageNumber < 1) {
            throw new Error("page_number must be a positive integer");
        }
        if (limitPerPage < 1 || limitPerPage > 100) {
            throw new Error("limit must be between 1 and 100");
        }
        if (search && (typeof search !== "string" || search.trim().length < 1)) {
            throw new Error("Search term must be a non-empty string");
        }
        if (category_id && !uuidRegex.test(category_id)) {
            throw new Error("Category ID must be a valid UUID");
        }
        if (sub_category_id && !uuidRegex.test(sub_category_id)) {
            throw new Error("Sub-Category ID must be a valid UUID");
        }

        const result = await productService.getProductListByCompanyId(
            id,
            pageNumber,
            limitPerPage,
            search?.trim(),
            category_id,
            sub_category_id,
        );

        return res.status(200).json({
            success: true,
            data: result.data,
            metadata: {
                page: pageNumber,
                per_page: limitPerPage,
                total_count: result.total_count,
                total_pages: result.total_pages,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getProductsByCategoryIdController = async (req, res) => {
    /*
    #swagger.tags = ['Product']
    #swagger.description = 'Get products by category ID with pagination and search'
    #swagger.parameters['page_number'] = { in: 'query', type: 'integer', required: false, description: 'Page number (default: 1)' }
    #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, description: 'Number of records per page (default: 10)' }
    #swagger.parameters['category_id'] = { in: 'query', type: 'string', required: false, description: 'Category ID (UUID) OR null' } 
    #swagger.parameters['sub_category_id'] = { in: 'query', type: 'string', required: false, description: 'sub-Category ID (UUID) OR null' }
    #swagger.parameters['search'] = { in: 'query', type: 'string', required: false, description: 'Search term for product name, subcategory, or company name' }
  */
    try {
        const { page_number, limit, category_id, sub_category_id, search } = req.query;
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

        const pageNumber = parseInt(page_number) || 1;
        const limitPerPage = parseInt(limit) || 10;

        if (pageNumber < 1) throw new Error("page_number must be a positive integer");
        if (limitPerPage < 1 || limitPerPage > 100)
            throw new Error("limit must be between 1 and 100");
        if (category_id && !uuidRegex.test(category_id))
            throw new Error("category_id must be a valid UUID");
        if (sub_category_id && !uuidRegex.test(sub_category_id))
            throw new Error("sub_category_id must be a valid UUID");
        if (search && (typeof search !== "string" || search.trim().length < 1))
            throw new Error("Search term must be a non-empty string");

        const result = await productService.getProductsByCategoryId(
            pageNumber,
            limitPerPage,
            category_id,
            sub_category_id,
            search?.trim(),
        );

        return res.status(200).json({
            success: true,
            data: result.data,
            metadata: {
                page: pageNumber,
                per_page: limitPerPage,
                // total_count: result.total_count,
                // total_pages: result.total_pages,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
