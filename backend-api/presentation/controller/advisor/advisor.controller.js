const { supabaseInstance } = require("../../../supabase-db/index.js");
const AdvisorService = require("../../../application/services/advisor/advisor.service.js");
const AdvisorCompanyAccessService = require("../../../application/services/advisor/advisor_company_access.service.js");
const AdvisorCategoryAccessService = require("../../../application/services/advisor/advisor_catgory_access.service.js");

const advisorService = new AdvisorService(supabaseInstance);
const advisorCompanyAccessService = new AdvisorCompanyAccessService(supabaseInstance);
const advisorCategoryAccessService = new AdvisorCategoryAccessService(supabaseInstance);

exports.createAdvisorController = async (req, res) => {
    /*
    #swagger.tags = ['Advisor']
    #swagger.autoBody = false
    #swagger.description = 'Register a new advisor'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['join_as'] = { in: 'formData', type: 'string', required: true, description: 'Role the advisor is joining as' }
    #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true, description: 'Full name of the advisor' }
    #swagger.parameters['mobile_number'] = { in: 'formData', type: 'string', required: true, description: '10-digit mobile number' }
    #swagger.parameters['email'] = { in: 'formData', type: 'string', required: true, description: 'Email address' }
    #swagger.parameters['aadhar_card_number'] = { in: 'formData', type: 'string', required: true, description: '12-digit Aadhar card number' }
    #swagger.parameters['pan_card_number'] = { in: 'formData', type: 'string', required: true, description: '10-character PAN card number (e.g., ABCDE1234F)' }
    #swagger.parameters['qualification'] = { in: 'formData', type: 'string', required: true, description: 'Educational qualification' }
    #swagger.parameters['bank_name'] = { in: 'formData', type: 'string', required: true, description: 'Bank name' }
    #swagger.parameters['bank_ifsc_code'] = { in: 'formData', type: 'string', required: true, description: '11-character IFSC code (e.g., HDFC0001234)' }
    #swagger.parameters['bank_branch'] = { in: 'formData', type: 'string', required: true, description: 'Bank branch' }
    #swagger.parameters['bank_account_number'] = { in: 'formData', type: 'string', required: true, description: '9-18 digit bank account number' }
    #swagger.parameters['aadhar_card_file'] = { in: 'formData', type: 'file', required: true, description: 'Aadhar card file (JPEG or PDF)' }
    #swagger.parameters['pan_card_file'] = { in: 'formData', type: 'file', required: true, description: 'PAN card file (JPEG or PDF)' }
    #swagger.responses[200] = {
      description: 'Advisor registered successfully',
      schema: { success: true, data: { advisor_id: 'uuid', name: 'string', email: 'string', aadhar_card_image_url: 'string', pan_card_image_url: 'string' } }
    }
    #swagger.responses[400] = {
      description: 'Invalid input',
      schema: { success: false, error: { message: 'string' } }
    }
  */
    try {
        const {
            join_as,
            name,
            mobile_number,
            email,
            aadhar_card_number,
            pan_card_number,
            qualification,
            bank_name,
            bank_ifsc_code,
            bank_branch,
            bank_account_number,
        } = req.body;

        const aadhar_card_file = req.files?.aadhar_card_file?.[0];
        const pan_card_file = req.files?.pan_card_file?.[0];

        if (!aadhar_card_file || !pan_card_file) {
            return res.status(500).json({
                success: false,
                error: { message: "Aadhar and PAN card files are required" },
            });
        }

        const result = await advisorService.createAdvisor(
            join_as,
            name,
            mobile_number,
            email,
            aadhar_card_number,
            pan_card_number,
            qualification,
            bank_name,
            bank_ifsc_code,
            bank_branch,
            bank_account_number,
            aadhar_card_file,
            pan_card_file,
        );

        return res.status(200).json({
            success: true,
            message: "Advisor registered successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.resubmitAdvisorRegistrationController = async (req, res) => {
    /*
    #swagger.tags = ['Advisor']
    #swagger.autoBody = false
    #swagger.description = 'Register a new advisor'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['advisor_id'] = { in: 'formData', type: 'string', required: true, description: 'Advisor ID' }
    #swagger.parameters['bank_details_id'] = { in: 'formData', type: 'string', required: true, description: 'bank_details_id ID' }
    #swagger.parameters['join_as'] = { in: 'formData', type: 'string', required: true, description: 'Role the advisor is joining as' }
    #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true, description: 'Full name of the advisor' }
    #swagger.parameters['mobile_number'] = { in: 'formData', type: 'string', required: true, description: '10-digit mobile number' }
    #swagger.parameters['email'] = { in: 'formData', type: 'string', required: true, description: 'Email address' }
    #swagger.parameters['aadhar_card_number'] = { in: 'formData', type: 'string', required: true, description: '12-digit Aadhar card number' }
    #swagger.parameters['pan_card_number'] = { in: 'formData', type: 'string', required: true, description: '10-character PAN card number (e.g., ABCDE1234F)' }
    #swagger.parameters['qualification'] = { in: 'formData', type: 'string', required: true, description: 'Educational qualification' }
    #swagger.parameters['bank_name'] = { in: 'formData', type: 'string', required: true, description: 'Bank name' }
    #swagger.parameters['bank_ifsc_code'] = { in: 'formData', type: 'string', required: true, description: '11-character IFSC code (e.g., HDFC0001234)' }
    #swagger.parameters['bank_branch'] = { in: 'formData', type: 'string', required: true, description: 'Bank branch' }
    #swagger.parameters['bank_account_number'] = { in: 'formData', type: 'string', required: true, description: '9-18 digit bank account number' }
    #swagger.parameters['aadhar_card_file'] = { in: 'formData', type: 'file', required: true, description: 'Aadhar card file (JPEG or PDF)' }
    #swagger.parameters['pan_card_file'] = { in: 'formData', type: 'file', required: true, description: 'PAN card file (JPEG or PDF)' }
  */
    try {
        const {
            advisor_id,
            bank_details_id,
            join_as,
            name,
            mobile_number,
            email,
            aadhar_card_number,
            pan_card_number,
            qualification,
            bank_name,
            bank_ifsc_code,
            bank_branch,
            bank_account_number,
        } = req.body;

        const aadhar_card_file = req.files?.aadhar_card_file?.[0];
        const pan_card_file = req.files?.pan_card_file?.[0];

        if (!aadhar_card_file || !pan_card_file) {
            return res.status(500).json({
                success: false,
                error: { message: "Aadhar and PAN card files are required" },
            });
        }

        const result = await advisorService.reSubmitAdvisor(
            advisor_id,
            bank_details_id,
            join_as,
            name,
            mobile_number,
            email,
            aadhar_card_number,
            pan_card_number,
            qualification,
            bank_name,
            bank_ifsc_code,
            bank_branch,
            bank_account_number,
            aadhar_card_file,
            pan_card_file,
        );

        return res.status(200).json({
            success: true,
            message: "Advisor registered successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.sendAdvisorOtpController = async (req, res) => {
    /*
        #swagger.tags = ['Advisor']
        #swagger.description = 'Send otp to advisor mobile number'
        #swagger.parameters['body'] = {
            in: 'body',
            schema: {
                mobile_number: '1234567890',
                purpose_for: 'registration/login'
            }
        }
    */
    try {
        const { mobile_number, purpose_for } = req.body;

        const result = await advisorService.sendAdvisorOtp(mobile_number, purpose_for);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

// New verifyAdvisorMobileController
exports.verifyAdvisorMobileController = async (req, res) => {
    /*
      #swagger.tags = ['Advisor']
      #swagger.description = 'Verify advisor mobile number using OTP'
      #swagger.parameters['body'] = {
      in: 'body',
      schema: {
        
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          otp: 1234,
          mobile_number: '1234567890',
          purpose_for: 'registration/login'
        
      }
    }
    */
    try {
        const { token, otp, mobile_number, purpose_for } = req.body;

        const result = await advisorService.verifyAdvisorMobile(
            token,
            otp,
            mobile_number,
            purpose_for,
        );

        return res.status(200).json({
            success: true,
            ...result, // Spread result based on purpose_for
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

// New sendAdvisorEmailOtpController
exports.sendAdvisorEmailOtpController = async (req, res) => {
    /*
      #swagger.tags = ['Advisor']
      #swagger.description = 'Send OTP to advisor email for registration'
      #swagger.parameters['body'] = {
      in: 'body',
      schema: {
          email: 'john.doe@example.com'
        }
     
    }
    */
    try {
        const { email } = req.body;

        const result = await advisorService.sendAdvisorEmailOtp(email);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

// New verifyAdvisorEmailController
exports.verifyAdvisorEmailController = async (req, res) => {
    /*
      #swagger.tags = ['Advisor']
      #swagger.description = 'Verify advisor email using OTP'
      #swagger.parameters['body'] = {
      in: 'body',
      schema:  {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          otp: 1234,
          email: 'john.doe@example.com'
        }
      
    }
    */
    try {
        const { token, otp, email } = req.body;

        const result = await advisorService.verifyAdvisorEmail(token, otp, email);

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

// New getAdvisorStatisticsController
exports.getAdvisorStatisticsController = async (req, res) => {
    /*
      #swagger.tags = ['Advisor']
      #swagger.description = 'Get statistics of advisors (total, active, inactive, pending)'
      #swagger.responses[200] = {
        description: 'Advisor statistics retrieved successfully',
        schema: { 
          success: true, 
          data: { 
            total: 'number', 
            active: 'number', 
            inactive: 'number', 
            pending: 'number' 
          } 
        }
      }
      #swagger.responses[400] = {
        description: 'Error retrieving statistics',
        schema: { success: false, error: { message: 'string' } }
      }
    */
    try {
        const stats = await advisorService.getAdvisorStatistics();

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

// New getAdvisorListController
exports.getAdvisorListController = async (req, res) => {
    /*
      #swagger.tags = ['Advisor']
      #swagger.description = 'Get paginated list of advisors with filters'
      #swagger.parameters['page_number'] = { in: 'query', type: 'integer', default: 1, description: 'Page number' }
      #swagger.parameters['limit'] = { in: 'query', type: 'integer', default: 10, description: 'Number of records per page' }
      #swagger.parameters['search'] = { in: 'query', type: 'string', default: '', description: 'Filter by advisor name' }
      #swagger.parameters['active_status'] = { in: 'query', type: 'string', enum: ['', 'Active', 'Inactive'], default: '', description: 'Filter by active status' }
      #swagger.parameters['advisor_onboarding_status'] = { in: 'query', type: 'string', default: 'Pending,Approved,Re-Submitted,Rejected', description: 'Filter by onboarding status send by comma separated string.' }
      #swagger.parameters['join_as'] = { in: 'query', type: 'string', enum: ['', 'advisor', 'entrepreneur'], default: '', description: 'Filter by join_as role' }
    */
    try {
        let {
            page_number = 1,
            limit = 10,
            active_status = "",
            advisor_onboarding_status = "",
            join_as = "",
            search = "",
        } = req.query;
        const page = parseInt(page_number);
        const perPage = parseInt(limit);

        if (advisor_onboarding_status) {
            advisor_onboarding_status = advisor_onboarding_status.split(",");
        }

        if (isNaN(page) || page < 1 || isNaN(perPage) || perPage < 1) {
            throw new Error("Invalid page_number or limit");
        }

        const result = await advisorService.getAdvisorList(
            page,
            perPage,
            active_status,
            advisor_onboarding_status,
            join_as,
            search,
        );

        return res.status(200).json({
            success: true,
            data: result.advisors,
            metadata: result.metadata,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

// New getAdvisorDetailsByIdController
exports.getAdvisorDetailsByIdController = async (req, res) => {
    /*
      #swagger.tags = ['Advisor']
      #swagger.description = 'Get advisor details by ID'
      #swagger.parameters['id'] = { in: 'path', type: 'string', required: true, description: 'Advisor UUID', example: '550e8400-e29b-41d4-a716-446655440000' }
      #swagger.responses[200] = {
        description: 'Advisor details retrieved successfully',
        schema: { 
          success: true, 
          data: { 
            type: 'object', 
            properties: {
              advisor_id: { type: 'string' },
              join_as: { type: 'string' },
              name: { type: 'string' },
              mobile_number: { type: 'string' },
              email: { type: 'string' },
              aadhar_card_number: { type: 'string' },
              pan_card_number: { type: 'string' },
              qualification: { type: 'string' },
              status: { type: 'string' },
              aadhar_card_image_url: { type: 'string' },
              pan_card_image_url: { type: 'string' },
              bank_details: { 
                type: 'object', 
                properties: {
                  bank_name: { type: 'string' },
                  bank_ifsc_code: { type: 'string' },
                  bank_branch: { type: 'string' },
                  bank_account_number: { type: 'string' }
                }
              }
            }
          } 
        }
      }
      #swagger.responses[400] = {
        description: 'Error retrieving advisor details',
        schema: { success: false, error: { message: 'string' } }
      }
    */
    try {
        const { id } = req.params;

        if (
            !id ||
            !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
                id,
            )
        ) {
            throw new Error("Invalid advisor ID");
        }

        const advisor = await advisorService.getAdvisorDetailsById(id);

        if (!advisor) {
            throw new Error("Advisor not found");
        }

        return res.status(200).json({
            success: true,
            data: advisor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

// New approveAdvisorRequestController
exports.approveAdvisorRequestController = async (req, res) => {
    /*
      #swagger.tags = ['Advisor']
      #swagger.description = 'Approve an advisor request by setting advisor_onboarding_status_id to 2'
      #swagger.parameters['body'] = {
      in: 'body',
      schema: {
          advisor_id: '550e8400-e29b-41d4-a716-446655440000'
        }
      
    }
    */
    try {
        const { advisor_id } = req.body;

        if (
            !advisor_id ||
            !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
                advisor_id,
            )
        ) {
            throw new Error("Invalid advisor ID");
        }

        const updatedAdvisor = await advisorService.approveAdvisorRequest(advisor_id);

        return res.status(200).json({
            success: true,
            data: updatedAdvisor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

// New rejectAdvisorRequestController
// exports.rejectAdvisorRequestController = async (req, res) => {
//     /*
//       #swagger.tags = ['Advisor']
//       #swagger.description = 'Reject an advisor request by setting advisor_onboarding_status_id to 3'
//       #swagger.parameters['body'] = {
//       in: 'body',
//       schema:  {
//           advisor_id: '550e8400-e29b-41d4-a716-446655440000'
//         }

//     }
//     */
//     try {
//         const { advisor_id } = req.body;

//         if (
//             !advisor_id ||
//             !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
//                 advisor_id,
//             )
//         ) {
//             throw new Error("Invalid advisor ID");
//         }

//         const updatedAdvisor = await advisorService.rejectAdvisorRequest(advisor_id);

//         return res.status(200).json({
//             success: true,
//             data: updatedAdvisor, // Returns updated advisor; adjust to {} if needed
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             error: { message: error.message || "Something went wrong!" },
//         });
//     }
// };

// New resubmitAdvisorRequestController
exports.rejectAdvisorRequestController = async (req, res) => {
    /*
      #swagger.tags = ['Advisor']
      #swagger.description = 'Reject an advisor request for re-submission by setting advisor_onboarding_status_id to 3 and adding rejection remark'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['body'] = {
      in: 'body',
      schema:  {
          advisor_id: '550e8400-e29b-41d4-a716-446655440000',
          reason_type: ['Name'],
          reason: 'Invalid Aadhar card image'
        }
      
    }
    */
    try {
        const { advisor_id, reason_type, reason } = req.body;
        const action_by_user_id = res.locals.tokenData?.user_id; // Extracted from JWT token

        if (
            !advisor_id ||
            !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
                advisor_id,
            )
        ) {
            throw new Error("Invalid advisor ID");
        }
        if (!reason_type || !reason) {
            throw new Error("Reason type and reason are required");
        }
        if (!action_by_user_id) {
            throw new Error("User ID not found in token");
        }

        const updatedAdvisor = await advisorService.RejectAdvisorRequest(
            advisor_id,
            reason_type,
            reason,
            action_by_user_id,
        );

        return res.status(200).json({
            success: true,
            data: updatedAdvisor, // Returns updated advisor; adjust to {} if needed
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.updateAdvisorTabAccessController = async (req, res) => {
    /*
    #swagger.tags = ['Advisor']
    #swagger.description = 'Update advisor tab access'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            advisor_id: "550e8400-e29b-41d4-a716-446655440000",
            tab_access: {}
        }
    }
    */
    try {
        const { advisor_id, tab_access } = req.body;
        const result = await advisorService.updateAdvisorTabAccessService(advisor_id, tab_access);
        return res.status(200).json({
            success: true,
            message: "Update advisor tab access config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.activeInactiveAdvisorController = async (req, res) => {
    /*
    #swagger.tags = ['Advisor']
    #swagger.description = 'Update advisor status'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            advisor_id: "550e8400-e29b-41d4-a716-446655440000",
            advisor_status: "Active/Inactive"
        }
    }
    */
    try {
        const { advisor_id, advisor_status } = req.body;
        const result = await advisorService.activeInactiveAdvisorService(
            advisor_id,
            advisor_status,
        );
        return res.status(200).json({
            success: true,
            message: "Update advisor status successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

//*  ~~~~~~ Advisor company Access ~~~~~~
exports.getAdvisorCompanyAccessController = async (req, res) => {
    /*
    #swagger.tags = ['Advisor']
    #swagger.description = 'Get advisor company access'
    #parameters['advisor_id'] = { in: 'query', type: 'string', required: true, description: 'Advisor ID' }
    */
    try {
        const { advisor_id } = req.query;
        const result = await advisorCompanyAccessService.getAdvisorCompanyAccessService(advisor_id);
        return res.status(200).json({
            success: true,
            message: "Get advisor company access successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.upsertAdvisorCompanyAccessController = async (req, res) => {
    /*
    #swagger.tags = ['Advisor']
    #swagger.description = 'Upsert advisor company access'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            advisor_company_access_array: [
                {
                    "advisor_id": "550e8400-e29b-41d4-a716-446655440000",
                    "company_id": "550e8400-e29b-41d4-a716-446655440000",
                    "is_access": true
                }
            ]
        }
    }
    */
    try {
        const { advisor_company_access_array } = req.body;
        const result = await advisorCompanyAccessService.upsertAdvisorCompanyAccessService(
            advisor_company_access_array,
        );
        return res.status(201).json({
            success: true,
            message: "Upsert advisor company access successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getAdvisorCategoryAccessController = async (req, res) => {
    /*
    #swagger.tags = ['Advisor']
    #swagger.description = 'Get advisor category access'
    #parameters['advisor_id'] = { in: 'query', type: 'string', required: true, description: 'Advisor ID' }
    */
    try {
        const { advisor_id } = req.query;
        const result =
            await advisorCategoryAccessService.getAdvisorCategoryAccessService(advisor_id);
        return res.status(200).json({
            success: true,
            message: "Get advisor category access successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.upsertAdvisorCategoryAccessController = async (req, res) => {
    /*
    #swagger.tags = ['Advisor']
    #swagger.description = 'Upsert advisor category access'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            advisor_category_access_array: [
                {
                    "advisor_id": "550e8400-e29b-41d4-a716-446655440000",
                    "category_id": "550e8400-e29b-41d4-a716-446655440000",
                    "is_access": true
                }
            ]
        }
    }
    */
    try {
        const { advisor_category_access_array } = req.body;
        const result = await advisorCategoryAccessService.upsertAdvisorCategoryAccessService(
            advisor_category_access_array,
        );
        return res.status(201).json({
            success: true,
            message: "Upsert advisor category access successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getAdvisorStatisticsByAdvisorIdController = async (req, res) => {
    /*
    #swagger.tags = ['Advisor']
    #swagger.description = 'Get advisor statistics by advisor id'
    #parameters['advisor_id'] = { in: 'query', type: 'string', required: true, description: 'Advisor ID' }
    */
    try {
        const { advisor_id } = req.query;
        const result = await advisorService.getAdvisorStatisticsByAdvisorIdService(advisor_id);
        return res.status(200).json({
            success: true,
            message: "Get advisor statistics by advisor id successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
