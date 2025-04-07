const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "after_issuance_transaction";

class AfterIssuanceTransactionDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async addAfterIssuanceTransactionDatabase(
        lead_product_relation_id,
        commission_amount,
        payout_type,
        actual_number_transaction,
        commission_start_date,
        after_issuance_excel_data_id,
    ) {
        const { data, error } = await this.db
            .from(tableName)
            .insert({
                lead_product_relation_id,
                commission_amount,
                payout_type,
                actual_number_transaction,
                commission_start_date,
                after_issuance_excel_data_id,
            })
            .select("*")
            .maybeSingle();
        if (data) {
            return {
                success: true,
                data,
            };
        } else {
            return {
                success: false,
                error,
            };
        }
    }

    async getAfterIssuanceTransactionDatabase() {
        const { data, error } = await this.db.rpc(
            "get_after_issuance_transactions_for_invoice_creation",
        );
        return {
            data,
            error,
        };
    }

    async updateAfterIssuanceTransactionDatabase(
        current_number_invoice_created,
        after_issuance_transaction_id,
    ) {
        const { data, error } = await this.db
            .from(tableName)
            .update({
                current_number_invoice_created,
            })
            .eq("id", after_issuance_transaction_id)
            .select("*")
            .maybeSingle();
        return {
            data,
            error,
        };
    }
}

module.exports = AfterIssuanceTransactionDatabase;
