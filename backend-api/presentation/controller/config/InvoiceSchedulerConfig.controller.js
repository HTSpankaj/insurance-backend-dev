const InvoiceSchedulerConfigService = require("../../../application/services/config/InvoiceSchedulerConfig.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const invoiceSchedulerConfigService = new InvoiceSchedulerConfigService(supabaseInstance);

exports.getAllInvoiceSchedularConfigController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Get all invoice schedular config'
    */
    try {
        const result = await invoiceSchedulerConfigService.getAllInvoiceSchedularConfigService();
        return res.status(200).json({
            success: true,
            message: "Get all invoice schedular config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
exports.InsertInvoiceSchedularConfigController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Insert invoice schedular config'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            date: "1",
            time: "17:00:00",
            acceptance_time_period: "2"
        }
    }
    */
    try {
        const { date, time, acceptance_time_period } = req.body;
        const result = await invoiceSchedulerConfigService.InsertInvoiceSchedularConfigService(
            date,
            time,
            acceptance_time_period,
        );
        return res.status(200).json({
            success: true,
            message: "Insert invoice schedular config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
exports.UpdateInvoiceSchedularConfigController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Update invoice schedular config'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            id: "",
            date: "1",
            time: "17:00:00",
            acceptance_time_period: "2",
            is_active: true
        }
    }
    */
    try {
        const { id, date, time, acceptance_time_period, is_active } = req.body;
        const result = await invoiceSchedulerConfigService.UpdateInvoiceSchedularConfigService(
            id,
            date,
            time,
            acceptance_time_period,
            is_active,
        );
        return res.status(200).json({
            success: true,
            message: "Update invoice schedular config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
exports.DeleteInvoiceSchedularConfigController = async (req, res) => {
    /*
    #swagger.tags = ['Config']
    #swagger.description = 'Delete invoice schedular config'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            id: "",
        }
    }
    */
    try {
        const { id } = req.body;
        const result = await invoiceSchedulerConfigService.DeleteInvoiceSchedularConfigService(id);
        return res.status(200).json({
            success: true,
            message: "Delete invoice schedular config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
