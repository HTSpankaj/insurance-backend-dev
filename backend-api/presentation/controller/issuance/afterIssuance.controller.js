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
                    "lead_close_date": "",
                    "start_date_policy": "",
                    "end_date_policy": "",
                    "policy_amount": "",
                    "payout_type": "",
                    "commission_amount": "",

                    "commission_transaction_number": 2,
                    "commission_start_date": "",
                    
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

        const result = await afterIssuanceExcelDataService.addAfterIssuanceExcelDataInBulkDatabase(
            data,
            transaction_created_by_user_id,
        );
        return res.status(201).json({
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
