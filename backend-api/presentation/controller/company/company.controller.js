const { supabaseInstance } = require("../../../supabase-db/index.js");
const CompanyService = require("../../../application/services/company/company.service.js");
const RegionService = require("../../../application/services/region/region.service.js");

const companyService = new CompanyService(supabaseInstance);
const regionService = new RegionService(supabaseInstance);

exports.createCompanyController = async (req, res) => {
    /*
    #swagger.tags = ['Company']
    #swagger.autoBody = false
    #swagger.description = 'Create company'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['company_name'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'Name of the company' 
    }
    #swagger.parameters['name'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'Contact person full name' 
    }
    #swagger.parameters['email'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'Email address' 
    }
    #swagger.parameters['contact_person'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: '10-digit contact phone number' 
    }
    #swagger.parameters['irdai_license_number'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'IRDAI license number' 
    }
    #swagger.parameters['tax_gstin_number'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: '15-character GSTIN number (e.g., 22AAAAA0000A1Z5)' 
    }
    #swagger.parameters['is_publish'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'Publish status (true or false)' 
    }
    #swagger.parameters['logo_file'] = { 
      in: 'formData', 
      type: 'file', 
      required: true, 
      description: 'Company logo file (PDF, JPEG, or PNG)' 
    }
    #swagger.parameters['irdai_license_file'] = { 
      in: 'formData', 
      type: 'file', 
      required: true, 
      description: 'IRDAI license file (PDF, JPEG, or PNG)' 
    }
    #swagger.parameters['terms_of_agreement_file'] = { 
      in: 'formData', 
      type: 'file', 
      required: true, 
      description: 'Terms of agreement file (PDF, JPEG, or PNG)' 
    }
    #swagger.parameters['business_certification_file'] = { 
      in: 'formData', 
      type: 'file', 
      required: true, 
      description: 'Business certification file (PDF, JPEG, or PNG)' 
    }
    */
    try {
        const {
            company_name,
            name,
            email,
            contact_person,
            irdai_license_number,
            tax_gstin_number,
            is_publish,
        } = req.body;

        const logo_file = req.files?.logo_file?.[0];
        const irdai_license_file = req.files?.irdai_license_file?.[0];
        const terms_of_agreement_file = req.files?.terms_of_agreement_file?.[0];
        const business_certification_file = req.files?.business_certification_file?.[0];
        const created_by_user_id = res.locals.tokenData?.user_id;

        // Validation for FormData fields (all received as strings)
        if (!company_name || company_name.trim().length < 2) {
            throw new Error("Company name must be a string with at least 2 characters");
        }
        if (!name || name.trim().length < 2) {
            throw new Error("Name must be a string with at least 2 characters");
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Invalid email address");
        }
        if (!contact_person || !/^\d{10}$/.test(contact_person)) {
            throw new Error("Contact person must be a 10-digit phone number");
        }
        if (!irdai_license_number || irdai_license_number.trim().length < 5) {
            throw new Error("IRDAI license number must be a string with at least 5 characters");
        }
        if (
            !tax_gstin_number ||
            !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(tax_gstin_number)
        ) {
            throw new Error("Invalid GSTIN number (e.g., 22AAAAA0000A1Z5)");
        }
        if (!["true", "false"].includes(is_publish)) {
            throw new Error('is_publish must be "true" or "false"');
        }

        // File validation
        const validFileTypes = ["application/pdf", "image/jpeg", "image/png"];
        const validateFile = (file, fieldName) => {
            if (!file) throw new Error(`${fieldName} is required`);
            if (!validFileTypes.includes(file.mimetype)) {
                throw new Error(`${fieldName} must be a PDF, JPEG, or PNG`);
            }
        };

        validateFile(logo_file, "logo_file");
        validateFile(irdai_license_file, "irdai_license_file");
        validateFile(terms_of_agreement_file, "terms_of_agreement_file");
        validateFile(business_certification_file, "business_certification_file");

        // Convert FormData strings to appropriate types
        const contactPersonNumeric = parseInt(contact_person, 10);
        const isPublishBoolean = is_publish === "true";

        const result = await companyService.createCompany(
            company_name,
            name,
            email,
            contactPersonNumeric,
            irdai_license_number,
            tax_gstin_number,
            isPublishBoolean,
            logo_file,
            irdai_license_file,
            terms_of_agreement_file,
            business_certification_file,
            created_by_user_id,
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

exports.addRegionController = async (req, res) => {
    /*
   #swagger.tags = ['Company']
  #swagger.description = 'Add Region'
  #swagger.parameters['body'] = {
    in: 'body',
    schema:  {
        title: 'North Region',
        company_id: '550e8400-e29b-41d4-a716-446655440000',
        state: ['550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'],
        city: ['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003']
      }
    
  }
  */
    try {
        const { title, state, city, company_id } = req.body;

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

        const result = await regionService.addRegion(title, state, city, company_id);

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

exports.getCompanyListController = async (req, res) => {
    /*
    #swagger.tags = ['Company']
    #swagger.description = 'Get paginated list of companies with statistics'
    #swagger.parameters['is_all'] = { 
      in: 'query', 
      type: 'boolean', 
      default: false, 
      description: 'Get all companies' 
    }
    #swagger.parameters['page_number'] = { 
      in: 'query', 
      type: 'integer', 
      default: 1, 
      description: 'Page number' 
    }
    #swagger.parameters['limit'] = { 
      in: 'query', 
      type: 'integer', 
      default: 10, 
      description: 'Number of records per page' 
    }
    #swagger.parameters['search'] = { 
      in: 'query', 
      type: 'string', 
      default: '', 
      description: 'Search by company name' 
    }
    
    */
    try {
        const { page_number = 1, limit = 10, search = "" } = req.query;
        const is_all = req.query.is_all === "true" ? true : false;

        const pageNumber = parseInt(page_number);
        const perPage = parseInt(limit);

        // Validate inputs
        if (isNaN(pageNumber) || pageNumber < 1 || isNaN(perPage) || perPage < 1) {
            throw new Error("Invalid page_number or limit");
        }

        const result = await companyService.getCompanyList(pageNumber, perPage, search, is_all);

        return res.status(200).json({
            success: true,
            data: result.data,
            metadata: result.metadata,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getConvertedLeadsByCompanyIdController = async (req, res) => {
    /*
    #swagger.tags = ['Company']
    #swagger.description = 'Get paginated list of converted leads by company ID'
    #swagger.parameters['id'] = { 
      in: 'path', 
      type: 'string', 
      required: true, 
      description: 'Company UUID', 
      example: '90f074fe-16eb-4072-8339-9217330b0905' 
    }
    #swagger.parameters['page_number'] = { 
      in: 'query', 
      type: 'integer', 
      default: 1, 
      description: 'Page number' 
    }
    #swagger.parameters['limit'] = { 
      in: 'query', 
      type: 'integer', 
      default: 10, 
      description: 'Number of records per page' 
    }
    */
    try {
        const { id } = req.params;
        const { page_number = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page_number);
        const perPage = parseInt(limit);

        // Validate inputs
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!uuidRegex.test(id)) {
            throw new Error("Invalid company ID");
        }
        if (isNaN(pageNumber) || pageNumber < 1 || isNaN(perPage) || perPage < 1) {
            throw new Error("Invalid page_number or limit");
        }

        const result = await companyService.getConvertedLeadsByCompanyId(id, pageNumber, perPage);

        return res.status(200).json({
            success: true,
            data: result.data,
            metadata: result.metadata,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getCompanyDetailsByIdWithStatisticsController = async (req, res) => {
    /*
    #swagger.tags = ['Company']
    #swagger.description = 'Get company details by ID with statistics'
    #swagger.parameters['id'] = { 
      in: 'path', 
      type: 'string', 
      required: true, 
      description: 'Company UUID', 
      example: '90f074fe-16eb-4072-8339-9217330b0905' 
    }
    #swagger.responses[200] = {
      description: 'Company details retrieved successfully',
      schema: { 
        success: true, 
        data: { 
          company_id: 'string',
          company_display_id: 'string',
          company_name: 'string',
          contact_person: 'string',
          email: 'string',
          logo_url: 'string',
          no_of_products: 'number',
          converted_leads: 'number',
          total_earnings: 'number',
          received_earnings: 'number',
          pending_earnings: 'number'
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Error retrieving company details',
      schema: { success: false, error: { message: 'string' } }
    }
    */
    try {
        const { id } = req.params;

        // Validate company ID
        const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!uuidRegex.test(id)) {
            throw new Error("Invalid company ID");
        }

        const result = await companyService.getCompanyDetailsByIdWithStatistics(id);

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
