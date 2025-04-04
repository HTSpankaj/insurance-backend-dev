const { supabaseInstance } = require("../../../supabase-db/index.js");
const LeadService = require("../../../application/services/lead/lead.service.js");

const leadService = new LeadService(supabaseInstance);

exports.getLeadListController = async (req, res) => {
    /*
    #swagger.tags = ['leads']
    #swagger.description = 'Get Lead List'
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
    #swagger.responses[200] = {
        schema: {
            success: true,
            data: [{
                leadname: 'string',
                product_name: 'string',
                companyname: 'string',
                relationship_manager: 'string',
                priority: 'string',
                status: 'string',
                lead_id: 'string',
                product_id: 'string',
                advisor_id: 'string',
                created_at: 'string'
            }],
            metadata: {
                page: 1,
                per_page: 10,
                total_count: 120,
                total_pages: 12
            }
        }
    }
    */
    try {
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (pageNumber < 1) {
            throw new Error("page_number must be a positive integer");
        }
        if (limit < 1 || limit > 100) {
            throw new Error("limit must be between 1 and 100");
        }

        const result = await leadService.getLeadList(pageNumber, limit);

        return res.status(200).json({
            success: true,
            data: result.data,
            metadata: {
                page: pageNumber,
                per_page: limit,
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

// Updated addLeadController
exports.addLeadController = async (req, res) => {
    /*
    #swagger.tags = ['leads']
    #swagger.description = 'Add Leads'
    #swagger.parameters['body'] = {
      in: 'body',
      schema: {
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          contact_number: 9876543210,
          dob: '1990-01-01',
          address: '123 Main St',
          city_id: '550e8400-e29b-41d4-a716-446655440000',
          priority: 'High',
          additinal_note: 'Urgent lead',
          product_id: '550e8400-e29b-41d4-a716-446655440001'
        }
      
    }
    */
    try {
        const {
            name,
            email,
            contact_number,
            dob,
            address,
            city_id,
            priority,
            additinal_note,
            product_id,
        } = req.body;

        const advisor_id = res.locals.tokenData?.advisor_id; // Extract advisor_id from token

        // Validation
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            throw new Error("Name must be a string with at least 2 characters");
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Invalid email address");
        }
        if (!contact_number || !/^\d{10}$/.test(contact_number.toString())) {
            throw new Error("Contact number must be a 10-digit number");
        }
        if (!dob || isNaN(Date.parse(dob))) {
            throw new Error("DOB must be a valid date (e.g., YYYY-MM-DD)");
        }
        if (!address || typeof address !== "string" || address.trim().length < 5) {
            throw new Error("Address must be a string with at least 5 characters");
        }
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!city_id || !uuidRegex.test(city_id)) {
            throw new Error("City ID must be a valid UUID");
        }
        if (!priority || !["High", "Medium", "Low"].includes(priority)) {
            throw new Error("Priority must be one of: High, Medium, Low");
        }
        if (
            additinal_note &&
            (typeof additinal_note !== "string" || additinal_note.trim().length < 1)
        ) {
            throw new Error("Additional note must be a non-empty string if provided");
        }
        if (!product_id || !uuidRegex.test(product_id)) {
            throw new Error("Product ID must be a valid UUID");
        }
        if (!advisor_id || !uuidRegex.test(advisor_id)) {
            throw new Error("Advisor ID (from token) must be a valid UUID");
        }

        const result = await leadService.addLead(
            name,
            email,
            contact_number,
            dob,
            address,
            city_id,
            priority,
            additinal_note || "",
            product_id,
            advisor_id,
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

// New getLeadStatisticsNumberController
exports.getLeadStatisticsNumberController = async (req, res) => {
    /*
    #swagger.tags = ['leads']
    #swagger.description = 'Get Lead Statistics Number'
    */
    try {
        const stats = await leadService.getLeadStatisticsNumber();

        return res.status(200).json({
            success: true,
            data: {
                total: stats.total,
                new: stats.new,
                assigned: stats.assigned,
                converted: stats.converted,
                lost: stats.lost,
            },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
