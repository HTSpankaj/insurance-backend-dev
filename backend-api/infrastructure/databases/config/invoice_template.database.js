const { SupabaseClient } = require("@supabase/supabase-js");

const TableName = "invoice_template";

class InvoiceTemplateDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getAllInvoiceTemplateDatabase() {
        try {
            const { data, error } = await this.db.from(TableName).select("*");
            if (data) {
                return data;
            } else {
                throw error;
            }
        } catch (error) {
            throw new Error(`Failed to get invoice template: ${error.message}`);
        }
    }
}

module.exports = InvoiceTemplateDatabase;
