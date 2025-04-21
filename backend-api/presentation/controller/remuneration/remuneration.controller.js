const RemunerationService = require("../../../application/services/remuneration/remuneration.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const remunerationService = new RemunerationService(supabaseInstance);

exports.getRemunerationDashboardCardStatisticsController = async (req, res) => {
    /*
        #swagger.tags = ['Remuneration']
        #swagger.description = 'Get remuneration dashboard card statistics'
    */

    try {
        const result = await remunerationService.getRemunerationDashboardCardStatisticsService();
        return res.status(200).json({
            success: true,
            message: "Get remuneration dashboard card statistics successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getRemunerationDashboardEarningBarStatisticsController = async (req, res) => {};
