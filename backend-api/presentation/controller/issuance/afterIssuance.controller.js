const AfterIssuanceExcelDataService = require("../../../application/services/issuance/after_issuance_excel_data.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const afterIssuanceExcelDataService = new AfterIssuanceExcelDataService(supabaseInstance);

exports.afterIssuanceExcelDataController = async (req, res) => {
    /*
    #swagger.tags = ['Issuance']
    #swagger.description = 'add after issuance excel data'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'add after issuance excel data',
        schema: {
            "data": [
                {
                    "lead_id": "",
                    "lead_name": "",
                    "product_id": "",
                    "product_name": "",
                    "company_name": "",
                    "lead_product_relation_id": "",
                    "lead_close_date": "",
                    "start_date_policy": "",
                    "end_date_policy": "",
                    "policy_amount": "",
                    "payout_type": "",
                    "commission_amount": "",

                    "policy_sold_date": 2,
                    "commission_start_date": "",
                    "commission_end_date": "",
                    
                    "issuance_date": "",
                    
                    "profit_book_amount": "",
                    "profit_book_date": "",
                    
                    "loan_disbursed_amount": "",
                    "loan_disbursed_date": "",
                    "emi_amount": "",
                    
                    "file_name": "",
                    "row_number": "",
                }
            ]
        }
    }
    */

    //  //? Insurance Products//   Part Payment
    //  "issuance_date": "",

    //  //? Mutual Products//      One Time
    //  "profit_book_amount": "",
    //  "profit_book_date": "",

    //  //? Loan Products//         One Time
    //  "loan_disbursed_amount": "",
    //  "loan_disbursed_date": "",
    //  "emi_amount": "",

    try {
        const { data } = req.body;
        const transaction_created_by_user_id = res.locals.tokenData?.user_id;

        const result = await afterIssuanceExcelDataService.addAfterIssuanceExcelDataInBulkDatabase(
            data,
            transaction_created_by_user_id,
        );
        return res.status(200).json({
            success: true,
            message: "Add after issuance excel data successfully.",
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};

exports.getExcelDataForAfterIssuanceController = async (req, res) => {
    /*
    #swagger.tags = ['Issuance']
    #swagger.description = 'get excel data for after issuance'
    #swagger.parameters['page_number'] = { in: 'query', type: 'integer', required: false, description: 'Page number (default: 1)', example: 1, default: 1 }
    #swagger.parameters['limit'] = { in: 'query', type: 'integer', required: false, description: 'Number of courses per page (default: 10)', example: 10, default: 10 }
    */

    const { page_number = 1, limit = 10 } = req.query;

    try {
        let result = await afterIssuanceExcelDataService.getExcelDataForAfterIssuanceService(
            page_number,
            limit,
        );

        if (result) {
            result = result?.map(item => ({
                ...item,
                policy_sold_date: "",
                commission_start_date: "",
                commission_end_date: "",
                issuance_date: "",
                profit_book_date: "",
                profit_book_amount: "",
                loan_disbursed_amount: "",
                loan_disbursed_date: "",
                emi_amount: "",
            }));
        }

        return res.status(200).json({
            success: true,
            message: "Get excel data for after issuance successfully.",
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};
