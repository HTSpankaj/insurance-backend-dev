const { supabaseInstance } = require("../../../supabase-db/index.js");
const RelationshipManagerService = require("../../../application/services/relationship-manager/relationship-manager.service.js");

const relationshipManagerService = new RelationshipManagerService(supabaseInstance);

exports.addRelationshipManagerController = async (req, res) => {
    /*
     #swagger.tags = ['Relationship-managers']
    #swagger.description = 'Add a relationship-managers'
    #swagger.parameters['body'] = {
      in: 'body',
      schema: {
          name: 'John Doe',
          contact_number: 1234567890,
          company_id: '550e8400-e29b-41d4-a716-446655440000',
          region: ["39357ef5-e5b7-47d2-98ad-750e202bb49d","e26b14ae-66d0-4ce2-aaa4-fb2b3b82211d"],
          category: ["50f9a13b-d878-454f-a84a-3a1ca0d7a843","7ca19a57-fdbc-4756-bcdb-b8f1623f36a9"]
        }
      
    }

    */
    try {
        const { name, contact_number, region, category, company_id } = req.body;

        // Validation
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            throw new Error("Name must be a string with at least 2 characters");
        }
        if (!contact_number || !/^\d{10}$/.test(contact_number.toString())) {
            throw new Error("Contact number must be a 10-digit number");
        }
        if (!Array.isArray(region) || region.length === 0) {
            throw new Error("Region must be a non-empty array of UUIDs");
        }
        if (!Array.isArray(category) || category.length === 0) {
            throw new Error("Category must be a non-empty array of UUIDs");
        }

        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        region.forEach((id, index) => {
            if (!uuidRegex.test(id)) {
                throw new Error(`Region ID at index ${index} is not a valid UUID`);
            }
        });
        category.forEach((id, index) => {
            if (!uuidRegex.test(id)) {
                throw new Error(`Category ID at index ${index} is not a valid UUID`);
            }
        });

        const result = await relationshipManagerService.addRelationshipManager(
            name,
            contact_number.toString(), // Convert to string for database
            region,
            category,
            company_id
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

exports.getRelationshipManagerListByCompanyIdController = async (req, res) => {
    /*
    #swagger.tags = ['Relationship-managers']
    #swagger.description = 'Get Relationship Manager List by Company ID'
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
      description: 'Search term for relationship manager name' 
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

        const result = await relationshipManagerService.getRelationshipManagerListByCompanyId(
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
