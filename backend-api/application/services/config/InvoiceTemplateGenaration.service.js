const InvoiceTemplateGenerationDatabase = require("../../../infrastructure/databases/config/invoice_template_generation.database");
const IssuanceTransactionInvoiceDatabase = require("../../../infrastructure/databases/issuance/issuance_transaction_invoice.database");

class InvoiceTemplateGenerationService {
    /**
     * Constructor for initializing the InvoiceTemplateGenerationService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.invoiceTemplateGenerationDatabase = new InvoiceTemplateGenerationDatabase(supabaseInstance);
        this.issuanceTransactionInvoiceDatabase = new IssuanceTransactionInvoiceDatabase(supabaseInstance);
    }


    async getInvoiceTemplateGenerationDetailsByInvoiceDisplayID(invoice_display_id) {
        return await this.issuanceTransactionInvoiceDatabase.getInvoiceDetailsByInvoiceDisplayIdDatabase(invoice_display_id);
    }
    // {
    //     code: '22P02',
    //     details: null,
    //     hint: null,
    //     message: 'invalid input syntax for type bigint: "sss"'
    //   }
}

module.exports = InvoiceTemplateGenerationService;
