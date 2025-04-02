const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "lead_product_relation";

class LeadProductRelationDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getLeadProductRelationByLeadIdAndProductId(lead_id, productId) {
        const { data, error } = await this.db
            .from(tableName)
            .select("*")
            .eq("lead_id", lead_id)
            .eq("product_id", productId)
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

    async setSoldStatusByLeadProductRelationId(lead_product_id, before_issuance_excel_data_id) {
        const { data, error } = await this.db
            .from(tableName)
            .update({
                lead_status_id: 3,
                before_issuance_excel_data_id: before_issuance_excel_data_id,
            })
            .eq("lead_product_id", lead_product_id)
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

module.exports = LeadProductRelationDatabase;
