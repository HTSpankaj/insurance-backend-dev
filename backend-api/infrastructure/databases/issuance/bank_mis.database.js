const { SupabaseClient } = require("@supabase/supabase-js");

const bank_mis_excel_dataTableName = "bank_mis_excel_data";
const invoice_bank_mis_relationTableName = "invoice_bank_mis_relation";

class BankMisDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async addBankMisExcelDataDatabase(payload) {
        const { data, error } = await this.db
            .from(bank_mis_excel_dataTableName)
            .insert(payload)
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

    async addInvoiceBankMisRelationDatabase(
        issuance_transaction_invoice_id,
        bank_mis_excel_data_id,
        paid_to_invoice,
    ) {
        const { data, error } = await this.db
            .from(invoice_bank_mis_relationTableName)
            .insert({
                issuance_transaction_invoice_id,
                bank_mis_excel_data_id,
                paid_to_invoice,
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
}

module.exports = BankMisDatabase;
