const BankMisExcelDataService = require("../../../application/services/issuance/bank_mis_excel_data.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const bankMisExcelDataService = new BankMisExcelDataService(supabaseInstance);

exports.afterBankMisExcelDataController = async (req, res) => {
    /*
    #swagger.tags = ['Issuance']
    #swagger.description = 'add after issuance excel data'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'add after issuance excel data',
        schema: {
            "data": [
                {
                    "advisor_id": "ADV-00",
                    "advisor_name": "",
                    "commission_paid": 0,
                    "transaction_reference_number": "",
                    "payment_date": "YYYY-MM-DD",
                    "payment_mode": "Bank Transfer / UPI / Cheque",
                    
                    "file_name": "",
                    "row_number": "",
                }
            ]
        }
    }
    */

    try {
        const { data } = req.body;
        const transaction_created_by_user_id = res.locals.tokenData?.user_id;

        const result = await bankMisExcelDataService.addBankMisExcelDataInBulkDatabase(
            data,
            transaction_created_by_user_id,
        );
        return res.status(200).json({
            success: true,
            message: "Bank MIS excel data successfully.",
            data: result,
        });
    } catch (error) {
        console.error("Error in afterBankMisExcelDataController:", error);
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

exports.getExcelDataForBankMisDownloadController = async (req, res) => {
    /*
    #swagger.tags = ['Issuance']
    #swagger.description = 'get excel data For bank mis download'
    #swagger.parameters['page_number'] = { in: 'query', type: 'integer', required: false, description: 'Page number (default: 1)', example: 1, default: 1 }
    #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, description: 'Number of courses per page (default: 10)', example: 10, default: 10 }
    */

    const { page_number = 1, limit = 10 } = req.query;

    try {
        let result = await bankMisExcelDataService.getExcelDataForBankMisDownloadService(
            page_number,
            limit,
        );

        if (result) {
            result = result?.map(item => ({
                ...item,
                // policy_sold_date: "",
                // commission_start_date: "",
                // commission_end_date: "",
                // issuance_date: "",
                // profit_book_date: "",
                // profit_book_amount: "",
                // loan_disbursed_amount: "",
                // loan_disbursed_date: "",
                // emi_amount: "",
            }));
        }

        return res.status(200).json({
            success: true,
            message: "Get excel data for bank mis download successfully.",
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};