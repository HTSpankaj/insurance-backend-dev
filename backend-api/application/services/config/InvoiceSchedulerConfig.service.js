const InvoiceSchedulerConfigDatabase = require("../../../infrastructure/databases/config/config_scheduler_invoice.database");

class InvoiceSchedulerConfigService {
    /**
     * Constructor for initializing the InvoiceSchedulerConfigService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.invoiceSchedulerConfigDatabase = new InvoiceSchedulerConfigDatabase(supabaseInstance);
    }

    async getAllInvoiceSchedularConfigService() {
        return await this.invoiceSchedulerConfigDatabase.getAllInvoiceSchedularConfigDatabase();
    }
    async InsertInvoiceSchedularConfigService(date,time, acceptance_time_period) {
        return await this.invoiceSchedulerConfigDatabase.InsertInvoiceSchedularConfigDatabase(date,time, acceptance_time_period);
    }
    async UpdateInvoiceSchedularConfigService(id, date,time, acceptance_time_period, is_active) {
        return await this.invoiceSchedulerConfigDatabase.UpdateInvoiceSchedularConfigDatabase(id, date,time, acceptance_time_period, is_active);
    }
    async DeleteInvoiceSchedularConfigService(id) {
        return await this.invoiceSchedulerConfigDatabase.DeleteInvoiceSchedularConfigDatabase(id);
    }
}

module.exports = InvoiceSchedulerConfigService;
