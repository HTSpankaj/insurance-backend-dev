const { SupabaseClient } = require("@supabase/supabase-js");

const tableName = "before_issuance_excel_data";

class BeforeIssuanceExcelDataDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async addBeforeIssuanceExcelDataDatabase(payload) {

        let postBody = {
            "lead_id": payload?.lead_id,
            "lead_name": payload?.lead_name,
            "product_id": payload?.product_id,
            "product_name": payload?.product_name,
            "company_name": payload?.company_name,
            "lead_product_relation_id": payload?.lead_product_relation_id,
            "lead_close_date": payload?.lead_close_date,
            "start_date_policy": payload?.start_date_policy,
            "end_date_policy": payload?.end_date_policy,
            "policy_amount": payload?.policy_amount,
            "payout_type": payload?.payout_type,
            "commission_amount": payload?.commission_amount,
            "errorArray": payload?.errorArray,
            "row_number": payload?.row_number,
            "file_name": payload?.file_name,
            transaction_created_by_user_id: payload?.transaction_created_by_user_id
        }
        const { data, error } = await this.db
            .from(tableName)
            .insert(postBody)
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

    async deleteBeforeIssuanceExcelDataDatabase(id) {
        const { error } = await this.db.from(tableName).delete().eq("id", id);
        if (error) {
            return {
                success: false,
                error,
            };
        } else {
            return {
                success: true,
            };
        }
    }

    async getExcelDataForAfterIssuanceDatabase(page_number, limit) {
        try {
            const { data, error } = await this.db.rpc("get_excel_data_for_after_issuance_excel", {
                page_number_val: page_number,
                limit_val: limit,
            });
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to get excel data for after issuance excel: ${error.message}`);
        }
    }
}

module.exports = BeforeIssuanceExcelDataDatabase;
