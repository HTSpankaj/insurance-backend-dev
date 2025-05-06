const InvoiceService = require("../../../application/services/issuance/invoice.service.js");
const RemunerationService = require("../../../application/services/remuneration/remuneration.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const remunerationService = new RemunerationService(supabaseInstance);
const invoiceService = new InvoiceService(supabaseInstance);

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
exports.getRemunerationInvoiceCardStatisticsController = async (req, res) => {
    /*
        #swagger.tags = ['Remuneration']
        #swagger.description = 'Get remuneration invoice card statistics'
        #swagger.parameters['start_date'] = { in: 'query', type: 'string', required: false, description: 'Start date format: YYYY-MM-DD' }
        #swagger.parameters['end_date'] = { in: 'query', type: 'string', required: false, description: 'End date format: YYYY-MM-DD' }
    */

    try {
        const { start_date, end_date } = req.query;

        const result = await remunerationService.getRemunerationInvoiceCardStatisticsService(
            start_date,
            end_date,
        );
        return res.status(200).json({
            success: true,
            message: "Get remuneration invoice card statistics successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getRemunerationInvoiceListForAdminController = async (req, res) => {
    /*
        #swagger.tags = ['Remuneration']
        #swagger.description = 'Get remuneration invoice card statistics'
        #swagger.parameters['start_date'] = { in: 'query', type: 'string', required: false, description: 'Start date format: YYYY-MM-DD' }
        #swagger.parameters['end_date'] = { in: 'query', type: 'string', required: false, description: 'End date format: YYYY-MM-DD' }
    */

    try {
        const { start_date, end_date } = req.query;

        const result = await remunerationService.getRemunerationInvoiceListForAdminService(
            start_date,
            end_date,
        );
        return res.status(200).json({
            success: true,
            message: "Get remuneration invoice list successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getRemunerationDashboardEarningBarStatisticsController = async (req, res) => {
    /*
        #swagger.tags = ['Remuneration']
        #swagger.description = 'Get remuneration dashboard earning bar statistics with company id'
        #swagger.parameters['company_id'] = { in: 'query', type: 'string', required: true, description: 'Company ID' }
    */

    try {
        const { company_id } = req.query;
        const result =
            await remunerationService.getRemunerationDashboardEarningBarStatisticsService(
                company_id,
            );
        return res.status(200).json({
            success: true,
            message: "Get remuneration dashboard earning bar statistics successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error || "Something went wrong!" },
        });
    }
};

exports.getRemunerationCompaniesWithFinancialStatisticsController = async (req, res) => {
    /*
        #swagger.tags = ['Remuneration']
        #swagger.description = 'Get remuneration companies with financial statistics'
        #swagger.parameters['page_number'] = { in: 'query', description: 'Page number', type: 'integer', required: true, default: 1 }
        #swagger.parameters['limit'] = { in: 'query', description: 'Number of records per page', type: 'integer', required: true, default: 10 }
        #swagger.parameters['search'] = { in: 'query', type: 'string', required: false, description: 'Search on company name' }
    */

    try {
        const { search, page_number, limit } = req.query;
        const result =
            await remunerationService.getRemunerationCompaniesWithFinancialStatisticsService(
                search,
                page_number,
                limit,
            );
        return res.status(200).json({
            success: true,
            message: "Get remuneration companies with financial statistics successfully.",
            data: result,

            metadata: {
                current_page_count: result?.length || 0,
                page: page_number,
                per_page: limit,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getRemunerationPaymentListController = async (req, res) => {
    /*
        #swagger.tags = ['Remuneration']
        #swagger.description = 'Get remuneration payment bank mis'
        #swagger.parameters['start_date'] = { in: 'query', type: 'string', required: false, description: 'Start date format: YYYY-MM-DD' }
        #swagger.parameters['end_date'] = { in: 'query', type: 'string', required: false, description: 'End date format: YYYY-MM-DD' }
        #swagger.parameters['search'] = { in: 'query', type: 'string', required: false, description: 'Search keyword' }
        #swagger.parameters['page_number'] = { in: 'query', description: 'Page number', type: 'integer', required: true, default: 1 }
        #swagger.parameters['limit'] = { in: 'query', description: 'Number of records per page', type: 'integer', required: true, default: 10 }
    */

        try {
            const { search, page_number, limit, start_date, end_date } = req.query;
            const result =
                await remunerationService.getRemunerationPaymentListService(
                    search,
                    page_number,
                    limit,
                    start_date,
                    end_date,
                );
            return res.status(200).json({
                success: true,
                message: "Get remuneration payment bank mis successfully.",
                data: result,
    
                metadata: {
                    current_page_count: result?.length || 0,
                    page: page_number,
                    per_page: limit,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: { message: error.message || "Something went wrong!" },
            });
        }
}

exports.getInvoiceDetailsByDisplayIdController = async (req, res) => {
    /*
        #swagger.tags = ['Remuneration']
        #swagger.description = 'Get invoice details by invoice display id'
        #swagger.parameters['invoice_display_id'] = { in: 'path', type: 'string', required: true, description: 'Invoice display id' }
    */

    try {
        const { invoice_display_id } = req.params;
        
        const result = await invoiceService.getInvoiceDetailsByDisplayIdService(invoice_display_id);
        return res.status(200).json({
            success: true,
            message: "Get invoice details by invoice display id successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
}