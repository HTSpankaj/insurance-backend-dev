const MobileBannerService = require("../../../application/services/config/mobile_banner.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const mobileBannerService = new MobileBannerService(supabaseInstance);

exports.getMobileBannerController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Get mobile banner config'
    #swagger.parameters['is_active'] = { in: 'query', type: 'string', enum: ['', 'true', 'false'], default: '', description: 'Filter by active status' }
    */
    try {
        let is_active = req.query?.is_active;
        if (is_active === "true") {
            is_active = true;
        } else if (is_active === "false") {
            is_active = false;
        } else {
            is_active = null;
        }

        const result = await mobileBannerService.getMobileBannerService(is_active);
        return res.status(200).json({
            success: true,
            message: "Get mobile banner config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.insertMobileBannerController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Insert mobile banner config'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['title'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'Title of the banner' 
    }
    #swagger.parameters['description'] = { 
      in: 'formData', 
      type: 'string', 
      required: true, 
      description: 'Description of the banner' 
    }
    #swagger.parameters['is_active'] = { 
      in: 'formData', 
      type: 'boolean', 
      required: true, 
      description: 'Active status of the banner' 
    }
    #swagger.parameters['file'] = { 
      in: 'formData', 
      type: 'file', 
      required: true, 
      description: 'Banner image/video' 
    }
    */
    try {
        const { title, description, is_active } = req.body;
        const file = req.files?.file?.[0] || null;

        console.log({title, description, is_active});
        

        const result = await mobileBannerService.insertUpdateMobileBannerService(
            null,
            title,
            description,
            is_active,
            file,
        );
        return res.status(200).json({
            success: true,
            message: "Insert mobile banner config successfully.",
            data: result,
        });
    } catch (error) {
        console.log("Mobile banner error", error);
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.updateMobileBannerController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Insert mobile banner config'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['id'] = {
      in: 'formData',
      type: 'string',
      required: true,
      description: 'ID of the banner'
    }
    #swagger.parameters['title'] = { 
      in: 'formData', 
      type: 'string', 
      required: false, 
      description: 'Title of the banner' 
    }
    #swagger.parameters['description'] = { 
      in: 'formData', 
      type: 'string', 
      required: false, 
      description: 'Description of the banner' 
    }
    #swagger.parameters['is_active'] = { 
      in: 'formData', 
      type: 'boolean', 
      required: false, 
      description: 'Active status of the banner' 
    }
    #swagger.parameters['file'] = { 
      in: 'formData', 
      type: 'file', 
      required: false, 
      description: 'Banner image/video' 
    }
    */
    try {
        const { id, title, description, is_active } = req.body;
        const file = req.files?.file?.[0] || null;

        const result = await mobileBannerService.insertUpdateMobileBannerService(
            id,
            title,
            description,
            is_active,
            file,
        );
        return res.status(200).json({
            success: true,
            message: "Update mobile banner config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.deleteMobileBannerController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Delete mobile banner config'
    #swagger.parameters['id'] = {
      in: 'path',
      type: 'string',
      required: true,
      description: 'ID of the banner'
    }
    */
    try {
        const { id } = req.params;
        const result = await mobileBannerService.deleteMobileBannerService(id);
        return res.status(200).json({
            success: true,
            message: "Delete mobile banner config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
