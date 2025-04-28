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
