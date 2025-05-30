const BeforeIssuanceExcelDataService = require("../../../application/services/issuance/before_issuance_excel_data.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const beforeIssuanceExcelDataService = new BeforeIssuanceExcelDataService(supabaseInstance);

exports.beforeIssuanceExcelDataController = async (req, res) => {
    /*
    #swagger.tags = ['Issuance']
    #swagger.description = 'add before issuance excel data'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'add before issuance excel data',
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

        const result =
            await beforeIssuanceExcelDataService.addBeforeIssuanceExcelDataInBulkDatabase(
                data,
                transaction_created_by_user_id,
            );
        return res.status(200).json({
            success: true,
            message: "Add before issuance excel data successfully.",
            data: result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: error?.message || "Something went wrong!" });
    }
};
