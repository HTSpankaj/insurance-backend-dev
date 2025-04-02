const { supabaseInstance } = require("../../../supabase-db/index.js");
const RegionService = require("../../../application/services/region/region.service.js");

const regionService = new RegionService(supabaseInstance);

exports.addRegionController = async (req, res) => {
    /*
      #swagger.tags = ['region']
    #swagger.description = 'Add region'
    #swagger.parameters['body'] = {
      in: 'body',
      schema: {
          title: 'North Region',
          state: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'],
          city: ['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003']
        }
      }
    
    */
    try {
        const { title, state, city } = req.body;

        // Validation
        if (!title || typeof title !== "string" || title.trim().length < 2) {
            throw new Error("Title must be a string with at least 2 characters");
        }
        if (!Array.isArray(state) || state.length === 0) {
            throw new Error("State must be a non-empty array of UUIDs");
        }
        if (!Array.isArray(city) || city.length === 0) {
            throw new Error("City must be a non-empty array of UUIDs");
        }

        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        state.forEach((id, index) => {
            if (!uuidRegex.test(id)) {
                throw new Error(`State ID at index ${index} is not a valid UUID`);
            }
        });
        city.forEach((id, index) => {
            if (!uuidRegex.test(id)) {
                throw new Error(`City ID at index ${index} is not a valid UUID`);
            }
        });

        const result = await regionService.addRegion(title, state, city);

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

exports.getRegionListByCompanyIdController = async (req, res) => {
    /*
    #swagger.tags = ['region']
    #swagger.description = 'Get Region List by Company ID'
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
      description: 'Search term for region name' 
    }
    */
    try {
        const { id } = req.params;
        const { page_number, limit, search } = req.query;

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

        const result = await regionService.getRegionListByCompanyId(
            id,
            pageNumber,
            limitPerPage,
            search?.trim(),
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
