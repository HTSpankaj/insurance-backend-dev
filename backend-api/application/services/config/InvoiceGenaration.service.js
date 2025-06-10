const InvoiceTemplateGenerationDatabase = require("../../../infrastructure/databases/config/invoice_template_generation.database");

class InvoiceGenerationService {
    /**
     * Constructor for initializing the InvoiceGenerationService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.invoiceTemplateGenerationDatabase = new InvoiceTemplateGenerationDatabase(
            supabaseInstance,
        );
    }
}

module.exports = InvoiceGenerationService;
