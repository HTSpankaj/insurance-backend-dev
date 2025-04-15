const AdvisorAccessService = require("../../../application/services/config/advisorAccess.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const advisorAccessService = new AdvisorAccessService(supabaseInstance);

exports.updateAdvisorAccessConfigController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Update advisor access config'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            id: "",
            access: {}
        }
    }
    */
    try {
        const { id, access } = req.body;
        const result = await advisorAccessService.updateAdvisorAccessDatabase(id, access);
        return res.status(200).json({
            success: true,
            message: "Update advisor access config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getAdvisorAccessConfigController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Get advisor access config'
    */
    try {
        const result = await advisorAccessService.getAdvisorAccessService();
        return res.status(200).json({
            success: true,
            message: "Get advisor access config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
