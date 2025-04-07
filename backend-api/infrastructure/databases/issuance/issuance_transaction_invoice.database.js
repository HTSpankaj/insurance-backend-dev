const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "issuance_transaction_invoice";

class IssuanceTransactionInvoiceDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async addIssuanceTransactionInvoiceDb(after_issuance_transaction_id) {
        const { data, error } = await this.db
            .from("issuance_transaction_invoice")
            .insert({
                after_issuance_transaction_id: after_issuance_transaction_id,
            })
            .select()
            .maybeSingle();
        return {
            data,
            error,
        };
    }
}

module.exports = IssuanceTransactionInvoiceDatabase;
