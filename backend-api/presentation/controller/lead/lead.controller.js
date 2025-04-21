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
      description: 'Page number (default: 1)' ,
      default: 1
      }
      #swagger.parameters['limit'] = { 
        in: 'query', 
        type: 'integer', 
        required: false, 
        description: 'Number of records per page (default: 10)' ,
        default: 10
    }
    #swagger.parameters['search'] = {
        in: 'query', 
        type: 'string', 
        required: false, 
        description: 'Search term for lead name',
        default: ''
    }
    #swagger.parameters['status'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Filter by lead status', 
      enum: ['', 'New', 'Assigned', 'Sold', 'Lost'], 
      example: 'New',
      default: ''
    }
    #swagger.parameters['priority'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Filter by lead priority', 
      enum: ['', 'High', 'Medium', 'Low'], 
      example: 'High',
      default: ''
    }
    #swagger.parameters['category_id'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Category ID (UUID) OR null',
      default: null
    }
    #swagger.parameters['company_id'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Company ID (UUID) OR null',
      default: null
    }
    */
    try {
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const search = req.query.search || null;
        const status = req.query.status || null;
        const priority = req.query.priority || null;
        const category_id = req.query.category_id || null;
        const company_id = req.query.company_id || null;

        if (pageNumber < 1) {
            throw new Error("page_number must be a positive integer");
        }
        if (limit < 1) {
            throw new Error("limit must be a positive integer");
        }

        const result = await leadService.getLeadList(
            pageNumber,
            limit,
            search,
            status,
            priority,
            category_id,
            company_id,
            null,
        );

        return res.status(200).json({
            success: true,
            data: result.data,
            metadata: {
                page: pageNumber,
                per_page: limit,
                current_page_count: result.total_count,
                // total_pages: result.total_pages,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getLeadListForAdvisorController = async (req, res) => {
    /*
    #swagger.tags = ['leads']
    #swagger.description = 'Get Lead List'
    #swagger.parameters['page_number'] = { 
      in: 'query', 
      type: 'integer', 
      required: false, 
      description: 'Page number (default: 1)' ,
      default: 1
      }
      #swagger.parameters['limit'] = { 
        in: 'query', 
        type: 'integer', 
        required: false, 
        description: 'Number of records per page (default: 10)' ,
        default: 10
    }
    #swagger.parameters['search'] = {
        in: 'query', 
        type: 'string', 
        required: false, 
        description: 'Search term for lead name',
        default: ''
    }
    #swagger.parameters['status'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Filter by lead status', 
      enum: ['', 'New', 'Assigned', 'Sold', 'Lost'], 
      example: 'New',
      default: ''
    }
    #swagger.parameters['priority'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Filter by lead priority', 
      enum: ['', 'High', 'Medium', 'Low'], 
      example: 'High',
      default: ''
    }
    #swagger.parameters['category_id'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Category ID (UUID) OR null',
      default: null
    }
    #swagger.parameters['company_id'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Company ID (UUID) OR null',
      default: null
    }
    */
    try {
        const pageNumber = parseInt(req.query.page_number) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const search = req.query.search || null;
        const status = req.query.status || null;
        const priority = req.query.priority || null;
        const category_id = req.query.category_id || null;
        const company_id = req.query.company_id || null;

        const advisor_id = res.locals.tokenData?.advisor_id;

        if (pageNumber < 1) {
            throw new Error("page_number must be a positive integer");
        }
        if (limit < 1) {
            throw new Error("limit must be a positive integer");
        }

        const result = await leadService.getLeadList(
            pageNumber,
            limit,
            search,
            status,
            priority,
            category_id,
            company_id,
            advisor_id,
        );

        return res.status(200).json({
            success: true,
            data: result.data,
            metadata: {
                page: pageNumber,
                per_page: limit,
                current_page_count: result.total_count,
                // total_pages: result.total_pages,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
exports.getLeadListProductByAdvisorIdController = async (req, res) => {
    /*
    #swagger.tags = ['leads']
    #swagger.description = 'Get Lead and product List By Advisor Id'
    #swagger.parameters['page_number'] = { 
      in: 'query', 
      type: 'integer', 
      required: false, 
      description: 'Page number (default: 1)',
      default: 1
    }
    #swagger.parameters['limit'] = { 
      in: 'query', 
      type: 'integer', 
      required: false, 
      description: 'Number of records per page (default: 10)',
      default: 10 
    }
      #swagger.parameters['advisor_id'] = {
        in: 'query',
        type: 'string',
        required: true,
        description: 'Advisor ID'
      }
    #swagger.responses[200] = {
        schema: {
            success: true,
            data: [],
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
        const advisor_id = req.query.advisor_id;

        const result = await leadService.getLeadProductRelationByAdvisorIdService(
            pageNumber,
            limit,
            advisor_id,
        );

        return res.status(200).json({
            success: true,
            data: result?.data?.map(m => {
                return {
                    ...m,
                    policy_amount: m?.before_issuance_excel_data_id?.policy_amount,
                    total_commission_amount:
                        m?.after_issuance_transaction?.[0]?.commission_amount *
                        m?.after_issuance_transaction?.[0]?.actual_number_transaction,
                    total_commission_received:
                        m?.after_issuance_transaction?.[0]?.issuance_transaction_invoice?.reduce(
                            (acc, cur) => acc + cur.paid_amount,
                            0,
                        ),
                    last_payment_date:
                        m?.after_issuance_transaction?.[0]?.issuance_transaction_invoice?.sort(
                            (a, b) => new Date(b.created_at) - new Date(a.created_at),
                        )[0]?.created_at,
                    payment_logs:
                        m?.after_issuance_transaction?.[0]?.issuance_transaction_invoice || [],
                };
            }),
            metadata: {
                page: pageNumber,
                per_page: limit,
                total_count: result.total_count,
                total_pages: result.total_pages,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.leadDetailsByLprIdController = async (req, res) => {
    /*
    #swagger.tags = ['leads']
    #swagger.description = 'Get Derails By lead_product_relation_display_id [LPR-1]'
    #swagger.parameters['lpr_id'] = {
        in: 'path',
        type: 'string',
        required: true,
        description: 'lead_product_relation_display_id [LPR-1]'
    }
    */
    try {
        const lead_product_relation_display_id = req.params.lpr_id;
        const result = await leadService.leadDetailsByLprIdService(
            lead_product_relation_display_id,
        );
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
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
        return res.status(500).json({
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
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.leadMobileSendOtpController = async (req, res) => {
    /*
        #swagger.tags = ['leads']
        #swagger.description = 'Send otp to advisor mobile number'
        #swagger.parameters['body'] = {
            in: 'body',
            schema: {
                mobile_number: '1234567890',
            }
        }
    */ try {
        const { mobile_number } = req.body;

        // Convert mobile_number to a number if it’s a string
        const mobileNumber =
            typeof mobile_number === "string" ? parseInt(mobile_number, 10) : mobile_number;

        // Validation
        if (!mobileNumber || isNaN(mobileNumber) || mobileNumber.toString().length !== 10) {
            throw new Error("Mobile number must be a 10-digit number");
        }

        const result = await leadService.sendLeadOtp(mobileNumber);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
exports.leadMobileVerifyController = async (req, res) => {
    /*
      #swagger.tags = ['leads']
      #swagger.description = 'Verify advisor mobile number using OTP'
      #swagger.parameters['body'] = {
      in: 'body',
      schema: {
        
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          otp: 1234,
          mobile_number: '1234567890',
    
        
      }
    }
    */
    try {
        const { token, otp, mobile_number } = req.body;

        // Convert to number if string
        const mobileNumber =
            typeof mobile_number === "string" ? parseInt(mobile_number, 10) : mobile_number;

        // Validation
        if (!token || typeof token !== "string") {
            throw new Error("Token must be a string");
        }
        if (!otp || typeof otp !== "number" || otp.toString().length !== 4) {
            throw new Error("OTP must be a 4-digit number");
        }
        if (!mobileNumber || isNaN(mobileNumber) || mobileNumber.toString().length !== 10) {
            throw new Error("Mobile number must be a 10-digit number");
        }

        const result = await leadService.verifyLeadMobile(token, otp, mobileNumber);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.leadEmailSendOtpController = async (req, res) => {
    /*
        #swagger.tags = ['leads']
        #swagger.description = 'Send otp to advisor mobile number'
        #swagger.parameters['body'] = {
            in: 'body',
            schema: {
                email: 'example@gmail.com',
            }
        }
    */ try {
        const { email } = req.body;

        const result = await leadService.sendEmailOtp(email);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
exports.leadEmailVerifyController = async (req, res) => {
    /*
        #swagger.tags = ['leads']
        #swagger.description = 'Verify advisor email using OTP'
        #swagger.parameters['body'] = {
            in: 'body',
            schema: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                otp: 1234,
                email: 'example@gmail.com',
            }
        }
    */
    try {
        const { token, otp, email } = req.body;

        const result = await leadService.verifyLeadEmail(token, otp, email);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
