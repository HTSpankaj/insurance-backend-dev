const CompanyDatabase = require("../../../infrastructure/databases/company/company.database");
const BeforeIssuanceExcelDataDatabase = require("../../../infrastructure/databases/issuance/before_issuance_excel_data.database");
const LeadDatabase = require("../../../infrastructure/databases/lead/lead.database");
const LeadProductRelationDatabase = require("../../../infrastructure/databases/lead_product_relation/lead_product_relation.database");
const ProductDatabase = require("../../../infrastructure/databases/product/product.database");

class BeforeIssuanceExcelDataService {
    constructor(supabaseInstance) {
        this.beforeIssuanceExcelDataDatabase = new BeforeIssuanceExcelDataDatabase(
            supabaseInstance,
        );
        this.companyDatabase = new CompanyDatabase(supabaseInstance);
        this.productDatabase = new ProductDatabase(supabaseInstance);
        this.leadDatabase = new LeadDatabase(supabaseInstance);
        this.leadProductRelationDatabase = new LeadProductRelationDatabase(supabaseInstance);
    }

    async addBeforeIssuanceExcelDataInBulkDatabase(list = [], transaction_created_by_user_id) {
        let error_result = new Set(),
            success_count = 0;

        for (const element of list) {
            element.transaction_created_by_user_id = transaction_created_by_user_id;

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
                    element?.lead_product_relation_id
                );
            if (!leadProduct?.success) {
                error_result.add({
                    error: leadProduct?.error,
                    data: element,
                    message: "Lead Product Relation not found. please check lead_id, product_id or lead_product_relation_id.",
                });
                continue;
            }

            const excelData =
                await this.beforeIssuanceExcelDataDatabase.addBeforeIssuanceExcelDataDatabase(
                    element,
                );
            if (!excelData?.success) {
                error_result.add({
                    error: excelData?.error,
                    data: element,
                    message: "Before Issuance Excel Data not inserted.",
                });
                continue;
            }

            const setSoldStatus =
                await this.leadProductRelationDatabase.setSoldStatusByLeadProductRelationId(
                    leadProduct.data.lead_product_id,
                    excelData.data?.id,
                );
            if (!setSoldStatus?.success) {
                await this.beforeIssuanceExcelDataDatabase.deleteBeforeIssuanceExcelDataDatabase(
                    excelData.data?.id,
                );
                error_result.add({
                    error: setSoldStatus?.error,
                    data: element,
                    message: "Failed to update Sold Status.",
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
}

module.exports = BeforeIssuanceExcelDataService;
