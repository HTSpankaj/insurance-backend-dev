const CommonConfigService = require("../../../application/services/config/common_config.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const commonConfigService = new CommonConfigService(supabaseInstance);

exports.getTermAndConditionController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Get term and condition config'
    */
    try {
        const result = await commonConfigService.getTermAndConditionService();
        return res.status(200).json({
            success: true,
            message: "Get term and condition config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.updateTermAndConditionController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Update term and condition config'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            content: ""
        }
    }
    */
    try {
        const { content } = req.body;
        const result = await commonConfigService.updateTermAndConditionService(content);
        return res.status(200).json({
            success: true,
            message: "Update term and condition config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getHelpCenterController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Get help center config'
    */
    try {
        const result = await commonConfigService.getHelpCenterService();
        return res.status(200).json({
            success: true,
            message: "Get help center config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.updateHelpCenterController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Update help center config'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            title: "",
            description: "",
            contact_number: "",
            email: "",
            location: ""
        }
    }
    */
    try {
        const { title, description, contact_number, email, location } = req.body;
        const result = await commonConfigService.updateHelpCenterService(
            title,
            description,
            contact_number,
            email,
            location,
        );
        return res.status(200).json({
            success: true,
            message: "Update help center config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
