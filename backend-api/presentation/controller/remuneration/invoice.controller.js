const InvoiceService = require("../../../application/services/issuance/invoice.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const invoiceService = new InvoiceService(supabaseInstance);

exports.getAdvisorInvoiceController = async (req, res) => {
    /*
        #swagger.tags = ['Remuneration']
        #swagger.description = 'Get Advisor Invoice for login advisor only'
        @swagger.parameters['page_number'] = { in: 'query', description: 'Page number', type: 'integer', default: 1 }
        @swagger.parameters['limit'] = { in: 'query', description: 'Number of records per page', type: 'integer', default: 10 }
        #swagger.parameters['start_date'] = { in: 'query', type: 'string', required: false, description: 'Start date format: YYYY-MM-DD' }
        #swagger.parameters['end_date'] = { in: 'query', type: 'string', required: false, description: 'End date format: YYYY-MM-DD' }

    */

    const { page_number, limit, start_date, end_date } = req.query;
    const advisor_id = res.locals.tokenData?.advisor_id; //* get advisor_id from token

    try {
        const result = await invoiceService.getInvoiceByAdvisorIdService(
            advisor_id,
            page_number,
            limit,
            start_date,
            end_date,
        );
        return res.status(200).json({
            success: true,
            data: result?.data,
            metadata: {
                total_count: result?.count,
                current_page_count: result?.data?.length || 0,
                page: page_number,
                per_page: limit,
            },
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.approveInvoiceController = async (req, res) => {
    /*
        #swagger.tags = ['Remuneration']
        #swagger.description = 'Approve Invoice for login advisor only'
        #swagger.parameters['body'] = {
            in: 'body',
            schema:  {
                invoice_id: '550e8400-e29b-41d4-a716-446655440000',
            }
        }
    */

    const { invoice_id } = req.body;
    try {
        const result = await invoiceService.approveInvoiceService(invoice_id);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};

exports.rejectionInvoiceController = async (req, res) => {
    /*
        #swagger.tags = ['Remuneration']
        #swagger.description = 'Rejection Invoice for login advisor only'
        #swagger.parameters['body'] = {
            in: 'body',
            schema:  {
                invoice_id: '550e8400-e29b-41d4-a716-446655440000',
                rejection_reason: 'Reason for rejection'
            }
        }
    */

    const { invoice_id, rejection_reason } = req.body;
    try {
        const result = await invoiceService.rejectionInvoiceService(invoice_id, rejection_reason);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: { message: error.message || "Something went wrong!" } });
    }
};
