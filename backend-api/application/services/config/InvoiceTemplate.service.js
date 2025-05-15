const InvoiceTemplateDatabase = require("../../../infrastructure/databases/config/invoice_template.database");
const InvoiceTemplateGenerationDatabase = require("../../../infrastructure/databases/config/invoice_template_generation.database");
const BucketNameStorage = require("../../../infrastructure/storage/bucketName.storage");

class InvoiceTemplateService {
    /**
     * Constructor for initializing the InvoiceTemplateService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.configStorage = new BucketNameStorage(supabaseInstance, "config");
        this.invoiceTemplateDatabase = new InvoiceTemplateDatabase(supabaseInstance);
        this.invoiceTemplateGenerationDatabase = new InvoiceTemplateGenerationDatabase(
            supabaseInstance,
        );
    }

    async getAllInvoiceTemplateService() {
        return await this.invoiceTemplateDatabase.getAllInvoiceTemplateDatabase();
    }

    async invoiceTemplateGenerationService(
        title,
        company_header_config,
        invoice_info_config,
        bill_to_config,
        lead_table_preview_config,
        tax_summary_config,
        totals_section_config,
        bank_details_config,
        terms_conditions_config,
        category,
        sub_category,
    ) {
        return await this.invoiceTemplateGenerationDatabase.invoiceTemplateGenerationDatabase(
            title,
            company_header_config,
            invoice_info_config,
            bill_to_config,
            lead_table_preview_config,
            tax_summary_config,
            totals_section_config,
            bank_details_config,
            terms_conditions_config,
            category,
            sub_category,
        );
    }

    async updateInvoiceTemplateGenerationService(
        id,
        title,
        company_header_config,
        invoice_info_config,
        bill_to_config,
        lead_table_preview_config,
        tax_summary_config,
        totals_section_config,
        bank_details_config,
        terms_conditions_config,
        logo_url,
        category,
        sub_category,
    ) {
        return await this.invoiceTemplateGenerationDatabase.updateInvoiceTemplateGenerationDatabase(
            id,
            title,
            company_header_config,
            invoice_info_config,
            bill_to_config,
            lead_table_preview_config,
            tax_summary_config,
            totals_section_config,
            bank_details_config,
            terms_conditions_config,
            logo_url,
            category,
            sub_category,
        );
    }

    async getInvoiceTemplateGenerationService(page_number, limit, search) {
        return await this.invoiceTemplateGenerationDatabase.getInvoiceTemplateGenerationDatabase(
            page_number,
            limit,
            search,
        );
    }

    async uploadInvoiceTemplateGenerationLogoService(file, id) {
        let updatedInvoiceTemplateGeneration = null;
        const fileExtension = file.mimetype.split("/")[1];
        const filePath = `invoice/${id}/invoice_logo.${fileExtension}`;

        const uploadFileResponse = await this.configStorage.uploadFile(
            filePath,
            file.buffer,
            file.mimetype,
            true,
        );

        if (uploadFileResponse) {
            const logo_url = await this.configStorage.getPublicUrl(
                uploadFileResponse?.path + "?" + new Date().getTime(),
            );
            updatedInvoiceTemplateGeneration =
                await this.invoiceTemplateGenerationDatabase.updateInvoiceTemplateGenerationDatabase(
                    id,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    logo_url,
                );
        }
        return updatedInvoiceTemplateGeneration;
    }
}

module.exports = InvoiceTemplateService;
