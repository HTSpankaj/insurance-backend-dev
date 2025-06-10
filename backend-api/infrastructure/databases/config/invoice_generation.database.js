const { SupabaseClient } = require("@supabase/supabase-js");

const invoice_generation_TableName = "invoice_generation";
const invoice_generation_category_relation_TableName = "invoice_generation_category_relation";
const invoice_generation_sub_category_relation_TableName =
    "invoice_generation_sub_category_relation";

class InvoiceGenerationDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getInvoiceGenerationBySubCategory(sub_category_id) {
        return new Promise(async (resolve, reject) => {
            const { data, error } = await this.db
                .from(invoice_generation_sub_category_relation_TableName)
                .select("*,invoice_generation:invoice_generation_id(*)")
                .eq("sub_category_id", sub_category_id);

            if (error) {
                return resolve({
                    success: false,
                    error: error,
                });
            }
            if (!data) {
                return resolve({
                    success: false,
                });
            }
            const _data = data.filter(_f => {
                if (
                    _f.invoice_generation.is_active === true &&
                    _f.invoice_generation.is_delete === false
                ) {
                    return true;
                }
                return false;
            });
            return resolve({
                success: true,
                data: _data?.[0] || null,
            });
        });
    }
}

module.exports = InvoiceGenerationDatabase;
