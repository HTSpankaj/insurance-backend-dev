const InvoiceTemplateDatabase = require("../../../infrastructure/databases/config/invoice_template.database");
const InvoiceTemplateGenerationDatabase = require("../../../infrastructure/databases/config/invoice_template_generation.database");

class InvoiceTemplateService {
    /**
     * Constructor for initializing the InvoiceTemplateService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.invoiceTemplateDatabase = new InvoiceTemplateDatabase(supabaseInstance);
        this.invoiceTemplateGenerationDatabase = new InvoiceTemplateGenerationDatabase(supabaseInstance);
    }

    async getAllInvoiceTemplateService() {
        return await this.invoiceTemplateDatabase.getAllInvoiceTemplateDatabase();
    }

    async invoiceTemplateGenerationService(
        company_header_config,
        invoice_info_config,
        bill_to_config,
        lead_table_preview_config,
        tax_summary_config,
        totals_section_config,
        bank_details_config,
        terms_conditions_config
    ) {
        return await this.invoiceTemplateGenerationDatabase.invoiceTemplateGenerationDatabase(
            company_header_config,
            invoice_info_config,
            bill_to_config,
            lead_table_preview_config,
            tax_summary_config,
            totals_section_config,
            bank_details_config,
            terms_conditions_config
        );
    }
}

module.exports = InvoiceTemplateService;
