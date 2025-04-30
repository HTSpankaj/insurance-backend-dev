const InvoiceTemplateService = require("../../../application/services/config/InvoiceTemplate.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const invoiceTemplateService = new InvoiceTemplateService(supabaseInstance);

exports.getAllInvoiceTemplateController = async (req, res) => {
    /*
    #swagger.tags = ['Invoice Config']
    #swagger.description = 'Get all invoice template'
    */
    try {
        const result = await invoiceTemplateService.getAllInvoiceTemplateService();
        return res.status(200).json({
            success: true,
            message: "Get all invoice template successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};