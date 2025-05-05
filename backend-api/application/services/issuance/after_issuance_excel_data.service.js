const CompanyDatabase = require("../../../infrastructure/databases/company/company.database");
const AfterIssuanceExcelDataDatabase = require("../../../infrastructure/databases/issuance/after_issuance_excel_data.database");
const AfterIssuanceTransactionDatabase = require("../../../infrastructure/databases/issuance/after_issuance_transaction.database");
const BeforeIssuanceExcelDataDatabase = require("../../../infrastructure/databases/issuance/before_issuance_excel_data.database");
const LeadDatabase = require("../../../infrastructure/databases/lead/lead.database");
const LeadProductRelationDatabase = require("../../../infrastructure/databases/lead_product_relation/lead_product_relation.database");
const ProductDatabase = require("../../../infrastructure/databases/product/product.database");
const { calculateCommissionTransactionNumber } = require("../../../utils/dateTime.util");

class AfterIssuanceExcelDataService {
    constructor(supabaseInstance) {
        this.beforeIssuanceExcelDataDatabase = new BeforeIssuanceExcelDataDatabase(supabaseInstance);
        this.afterIssuanceExcelDataDatabase = new AfterIssuanceExcelDataDatabase(supabaseInstance);
        this.companyDatabase = new CompanyDatabase(supabaseInstance);
        this.productDatabase = new ProductDatabase(supabaseInstance);
        this.leadDatabase = new LeadDatabase(supabaseInstance);
        this.leadProductRelationDatabase = new LeadProductRelationDatabase(supabaseInstance);
        this.afterIssuanceTransactionDatabase = new AfterIssuanceTransactionDatabase(
            supabaseInstance,
        );
    }

    async addAfterIssuanceExcelDataInBulkDatabase(list = [], transaction_created_by_user_id) {
        let error_result = new Set(),
            success_count = 0;

        for (const element of list) {
            element.transaction_created_by_user_id = transaction_created_by_user_id;
            element.commission_transaction_number = calculateCommissionTransactionNumber(
                element.payout_type,
                element.commission_start_date,
                element.commission_end_date,
            );

            if (element.commission_transaction_number === 0) {
                error_result.add({
                    data: element,
                    message:
                        "Error for calculating commission transaction number. Please check Payout Type, Commission Start Date and Commission End Date.",
                });
                continue;
            }

            const [company_display_id, product_display_id] = element.product_id.split("-");
            const company = await this.companyDatabase.getCompanyByDisplayId(company_display_id);
            if (!company?.success) {
                error_result.add({
                    error: company?.error,
                    data: element,
                    message: "Company not found.",
                });
                continue;
            }

            const product = await this.productDatabase.getProductByDisplayIdCompanyId(
                product_display_id,
                company.data.company_id,
            );
            if (!product?.success) {
                error_result.add({
                    error: product?.error,
                    data: element,
                    message: "Product not found.",
                });
                continue;
            }

            const lead = await this.leadDatabase.getLeadByDisplayId(element.lead_id);
            if (!lead?.success) {
                error_result.add({ error: lead?.error, data: element, message: "lead not found." });
                continue;
            }

            const leadProduct =
                await this.leadProductRelationDatabase.getLeadProductRelationByLeadIdAndProductId(
                    lead.data.lead_id,
                    product.data.product_id,
                    element?.lead_product_relation_id,
                );
            if (!leadProduct?.success) {
                error_result.add({
                    error: leadProduct?.error,
                    data: element,
                    message:
                        "Lead Product Relation not found. please check lead_id, product_id or lead_product_relation_id.",
                });
                continue;
            }

            // Todo: Check if lead is sold
            if (leadProduct?.data?.lead_status_id !== 3) {
                error_result.add({
                    error: leadProduct?.error,
                    data: element,
                    message: "Lead Product is not sold.",
                });
                continue;
            }

            const excelData =
                await this.afterIssuanceExcelDataDatabase.addAfterIssuanceExcelDataDatabase(
                    element,
                );
            if (!excelData?.success) {
                error_result.add({
                    error: excelData?.error,
                    data: element,
                    message: "After Issuance Excel Data not inserted.",
                });
                continue;
            }

            // Todo: Add Entry in [after_issuance_transaction]

            const afterIssuanceTransactionDatabaseResponse =
                await this.afterIssuanceTransactionDatabase.addAfterIssuanceTransactionDatabase(
                    leadProduct.data.lead_product_id,
                    excelData.data?.commission_amount,
                    excelData.data?.payout_type,
                    excelData.data?.commission_transaction_number,
                    excelData.data?.commission_start_date,
                    excelData.data?.commission_end_date,
                    excelData.data?.id,
                );

            if (!afterIssuanceTransactionDatabaseResponse?.success) {
                await this.afterIssuanceExcelDataDatabase.deleteAfterIssuanceExcelDataDatabase(
                    excelData.data?.id,
                );
                error_result.add({
                    error: afterIssuanceTransactionDatabaseResponse?.error,
                    data: element,
                    message: "After Issuance Transaction not inserted.",
                });
                continue;
            }
            success_count++;
        }

        return {
            success_count,
            error_result: Array.from(error_result),
            total: list.length,
            error_count: error_result.size,
        };
    }

    async getExcelDataForAfterIssuanceService(page_number, limit){
        return await this.beforeIssuanceExcelDataDatabase.getExcelDataForAfterIssuanceDatabase(page_number, limit);
    }
}

module.exports = AfterIssuanceExcelDataService;
