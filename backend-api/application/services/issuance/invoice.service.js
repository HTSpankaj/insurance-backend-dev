const IssuanceTransactionInvoiceDatabase = require("../../../infrastructure/databases/issuance/issuance_transaction_invoice.database");

class InvoiceService {
    constructor(supabaseInstance) {
        this.issuanceTransactionInvoiceDatabase = new IssuanceTransactionInvoiceDatabase(
            supabaseInstance,
        );
    }

    async getInvoiceByAdvisorIdService(advisor_id, pageNumber, limit, start_date, end_date) {
        return await this.issuanceTransactionInvoiceDatabase.getInvoiceByAdvisorIdDatabase(
            advisor_id,
            pageNumber,
            limit,
            start_date,
            end_date,
        );
    }

    async approveInvoiceService(invoice_id) {
        return await this.issuanceTransactionInvoiceDatabase.approveInvoiceDatabase(invoice_id);
    }

    async rejectionInvoiceService(invoice_id, rejection_reason) {
        return await this.issuanceTransactionInvoiceDatabase.rejectionInvoiceDatabase(
            invoice_id,
            rejection_reason,
        );
    }
}

module.exports = InvoiceService;
