const InvoiceGenerationDatabase = require("../../../infrastructure/databases/config/invoice_generation.database");

class InvoiceGenerationService {
    /**
     * Constructor for initializing the InvoiceGenerationService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.invoiceGenerationDatabase = new InvoiceGenerationDatabase(supabaseInstance);
    }

    
}

module.exports = InvoiceGenerationService;
