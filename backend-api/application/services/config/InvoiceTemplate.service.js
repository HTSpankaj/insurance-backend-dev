const InvoiceTemplateDatabase = require("../../../infrastructure/databases/config/invoice_template.database");

class InvoiceTemplateService {
    /**
     * Constructor for initializing the InvoiceTemplateService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.invoiceTemplateDatabase = new InvoiceTemplateDatabase(supabaseInstance);
    }

    async getAllInvoiceTemplateService() {
        return await this.invoiceTemplateDatabase.getAllInvoiceTemplateDatabase();
    }
}

module.exports = InvoiceTemplateService;
